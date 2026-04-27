// Post-build: prune URLs from out/sitemap.xml + out/sitemap-ai.xml whose
// corresponding HTML file doesn't exist in out/. Closes the 20% crawl-budget
// 404 bleed observed in GSC Crawl Stats audit (2026-04-27): ~2.18K of 10.9K
// crawls/90d hit 404 because sitemap ships URLs for routes that no longer
// have backing files (stale ticker slugs from EDGAR data refreshes, malformed
// slugs from concat bugs, etc.).
//
// Why post-build instead of fixing app/sitemap.ts:
//   - app/sitemap.ts pulls from MERGED_MOVES (~3.5K tickers) but only the
//     subset with TICKER_INDEX entries get static-exported. The two sets
//     drift between EDGAR data refreshes. Maintaining strict sync at the
//     source requires touching ~20 lib/ files.
//   - A post-pass filter is the same as strip-broken-links.ts pattern: solve
//     the symptom in one place, deterministically, with zero source-touch.
//   - Runtime ~50ms for 2.6K URLs vs filesystem checks (small).
//
// Mapping rules (URL → file path):
//   - https://holdlens.com/         → out/index.html
//   - https://holdlens.com/foo      → out/foo/index.html  OR  out/foo.html
//   - https://holdlens.com/foo/     → out/foo/index.html
//   - https://holdlens.com/foo/bar  → out/foo/bar/index.html  OR  out/foo/bar.html
//
// Whitelisted (kept regardless of filesystem):
//   - URLs ending in known asset extensions (.xml, .json, .txt) — served by
//     CF Pages routing or Workers, not as static HTML
//   - Paths under /api/ — handled by functions/* not static export
//
// Triggers: package.json `postbuild` hook, runs AFTER strip-broken-links,
// generate-sitemap-ai, and add-content-signals — when out/ is in final state.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve(process.cwd(), "out");
const BASE = "https://holdlens.com";

const WHITELIST_EXTENSIONS = [".xml", ".json", ".txt", ".pdf"];
const WHITELIST_PREFIXES = ["/api/"];

// Map a URL to candidate file paths in out/. URL is alive if ANY candidate exists.
function urlToCandidatePaths(url: string): string[] {
  if (!url.startsWith(BASE)) return []; // foreign URL, treat as dead
  const rel = url.slice(BASE.length) || "/";

  // Whitelist by extension (sitemap, robots, manifest, etc.)
  for (const ext of WHITELIST_EXTENSIONS) {
    if (rel.endsWith(ext)) return [path.join(OUT_DIR, rel)];
  }
  // Whitelist by prefix (API routes are dynamic, not in out/)
  for (const prefix of WHITELIST_PREFIXES) {
    if (rel.startsWith(prefix)) return ["__WHITELISTED__"]; // sentinel: always keep
  }

  // Strip query string + hash (URLs in sitemap shouldn't have these but defensive)
  const cleanRel = rel.split("?")[0].split("#")[0];

  if (cleanRel === "/") {
    return [path.join(OUT_DIR, "index.html")];
  }

  // Strip trailing slash for filename comparison
  const normalized = cleanRel.endsWith("/") ? cleanRel.slice(0, -1) : cleanRel;
  // Strip leading slash for path.join
  const segment = normalized.startsWith("/") ? normalized.slice(1) : normalized;

  return [
    path.join(OUT_DIR, segment, "index.html"),
    path.join(OUT_DIR, `${segment}.html`),
  ];
}

function isUrlAlive(url: string): boolean {
  const candidates = urlToCandidatePaths(url);
  if (candidates.length === 0) return false;
  if (candidates[0] === "__WHITELISTED__") return true;
  return candidates.some((p) => existsSync(p));
}

function pruneSitemap(filePath: string, label: string): { kept: number; dropped: number; droppedUrls: string[] } {
  if (!existsSync(filePath)) {
    console.warn(`[prune-sitemap] ${label}: ${filePath} not found, skipping`);
    return { kept: 0, dropped: 0, droppedUrls: [] };
  }

  const xml = readFileSync(filePath, "utf-8");

  // Match each <url>...</url> block. Tolerant of whitespace + indentation.
  const urlBlockRegex = /<url>[\s\S]*?<\/url>/g;
  const blocks = xml.match(urlBlockRegex) || [];

  if (blocks.length === 0) {
    console.warn(`[prune-sitemap] ${label}: no <url> blocks matched in ${filePath}`);
    return { kept: 0, dropped: 0, droppedUrls: [] };
  }

  const droppedUrls: string[] = [];
  let kept = 0;
  let dropped = 0;
  const keptBlocks: string[] = [];

  for (const block of blocks) {
    const locMatch = block.match(/<loc>([^<]+)<\/loc>/);
    if (!locMatch) {
      // Malformed block — drop it
      dropped++;
      droppedUrls.push("(malformed: no <loc>)");
      continue;
    }
    const url = locMatch[1].trim();
    if (isUrlAlive(url)) {
      kept++;
      keptBlocks.push(block);
    } else {
      dropped++;
      droppedUrls.push(url);
    }
  }

  if (dropped === 0) {
    console.log(`[prune-sitemap] ${label}: ${kept} URLs all alive, no changes`);
    return { kept, dropped, droppedUrls };
  }

  // Reconstruct: replace ALL <url> blocks with the kept set, in order
  let newXml = xml;
  // Remove all original blocks first (split by URL boundaries)
  const beforeFirst = xml.indexOf("<url>");
  const afterLast = xml.lastIndexOf("</url>") + "</url>".length;

  if (beforeFirst === -1 || afterLast === -1) {
    console.error(`[prune-sitemap] ${label}: couldn't find <url> boundaries — leaving file unchanged`);
    return { kept, dropped, droppedUrls };
  }

  const head = xml.slice(0, beforeFirst);
  const tail = xml.slice(afterLast);
  // Re-join kept blocks with newline-and-indent like the originals
  newXml = head + keptBlocks.join("\n  ") + tail;

  writeFileSync(filePath, newXml, "utf-8");
  console.log(`[prune-sitemap] ${label}: kept ${kept}, dropped ${dropped}`);

  return { kept, dropped, droppedUrls };
}

const result1 = pruneSitemap(path.join(OUT_DIR, "sitemap.xml"), "sitemap.xml");
const result2 = pruneSitemap(path.join(OUT_DIR, "sitemap-ai.xml"), "sitemap-ai.xml");

const totalDropped = result1.dropped + result2.dropped;
console.log(`\n[prune-sitemap] TOTAL: dropped ${totalDropped} dead URLs`);

if (totalDropped > 0) {
  // Log first 20 dropped URLs to stderr for ops visibility
  const sampleDropped = [...result1.droppedUrls, ...result2.droppedUrls].slice(0, 20);
  console.log(`[prune-sitemap] Sample dropped URLs (first 20):`);
  for (const u of sampleDropped) console.log(`  - ${u}`);
}
