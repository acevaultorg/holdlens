// Post-build: walk every HTML file in out/ and rewrite <a href="/X"> into
// <span> when out/X/index.html (or out/X.html, out/X) is missing. Kills
// internal-link PageRank leaks to 404 without touching 50+ source components
// that emit the broken links.
//
// Why post-build instead of source edits:
//   - ~55 source files emit `/signal/${ticker}` or `/ticker/${symbol}` links
//     from data (MERGED_MOVES) that is wider than TICKER_INDEX. Wrapping each
//     site in a conditional ticker-link component is correct but touches 55
//     files. A post-build pass solves the same problem in one place.
//   - Runtime is free — static export already walks every HTML file during
//     build. This script just adds a single post-pass (~1-2s for 3500 files).
//   - Zero payload impact (actually shrinks HTML by removing href attributes
//     on broken links).
//
// Scope:
//   - Only rewrites internal links (href starts with "/") with no query/hash
//   - Preserves anchor className + children text
//   - Leaves external links, mailto:, tel:, and hash-only anchors alone
//   - Skips <link> and <area> tags (href has different semantics there)
//
// Triggers: package.json `postbuild` hook runs after `next build` finishes.

import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.resolve(process.cwd(), "out");

async function collectHtmlFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...(await collectHtmlFiles(full)));
    } else if (e.isFile() && e.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

async function pathExists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

// Memoized lookup: does `/foo/bar` resolve to something in out/?
const resolveCache = new Map<string, boolean>();
async function linkResolves(internalPath: string): Promise<boolean> {
  if (resolveCache.has(internalPath)) return resolveCache.get(internalPath)!;
  const clean = internalPath.replace(/^\/+/, "").replace(/\/+$/, "");
  if (!clean) {
    resolveCache.set(internalPath, true);
    return true;
  }
  // Try index.html, plain file, then .html suffix — in that order
  const candidates = [
    path.join(OUT_DIR, clean, "index.html"),
    path.join(OUT_DIR, clean),
    path.join(OUT_DIR, clean + ".html"),
  ];
  for (const c of candidates) {
    if (await pathExists(c)) {
      resolveCache.set(internalPath, true);
      return true;
    }
  }
  resolveCache.set(internalPath, false);
  return false;
}

// Matches <a ... href="/internal/path" ...>children</a>. No match on mailto:,
// https:, //, #, or any href with query/hash (those route through redirect
// rules or client-side routing, both outside the static-file check).
const INTERNAL_ANCHOR_RE =
  /<a\s+([^>]*?\s)?href="(\/[^"#?]*)"([^>]*)>([\s\S]*?)<\/a>/g;

async function processFile(file: string): Promise<{ rewrites: number }> {
  const original = await readFile(file, "utf8");
  let rewrites = 0;

  // Collect unique internal hrefs first so we can check resolution once per
  // distinct target instead of once per match.
  const hrefsToCheck = new Set<string>();
  for (const m of original.matchAll(INTERNAL_ANCHOR_RE)) {
    hrefsToCheck.add(m[2]);
  }
  for (const h of hrefsToCheck) {
    // warm cache
    await linkResolves(h);
  }

  let next = original.replace(
    INTERNAL_ANCHOR_RE,
    (full, preAttrs = "", href, postAttrs = "", children) => {
      const resolves = resolveCache.get(href);
      if (resolves) return full;
      rewrites++;
      // Preserve className if present so visual styling stays.
      const classMatch =
        /class="([^"]*)"/.exec(preAttrs + " " + postAttrs) ?? null;
      const cls = classMatch ? ` class="${classMatch[1]}"` : "";
      return `<span${cls}>${children}</span>`;
    },
  );

  // Next.js 15 emits a React Flight stream (self.__next_f.push calls) that
  // the client uses to hydrate the component tree. If we only fix the
  // server HTML above, hydration would re-add the broken <a> element on
  // the client. Strip matching href entries from the Flight payload too
  // so post-hydration DOM matches the server-rendered state.
  //
  // The Flight encoding for an anchor fragment is:
  //   ["$","a",null,{"href":"/signal/FLUT","className":"..."},...]
  // We rewrite the type "a" -> "span" AND drop the href property when
  // the target doesn't resolve. Both edits are bounded to the specific
  // fragment so unrelated JSON isn't touched.
  const FLIGHT_ANCHOR_RE =
    /\[\\"\$\\",\\"a\\",null,\{\\"href\\":\\"(\/[^\\"#?]*?)\\"/g;
  next = next.replace(FLIGHT_ANCHOR_RE, (full, href) => {
    const resolves = resolveCache.get(href);
    if (resolves === true) return full;
    if (resolves === undefined) return full; // never checked → leave alone
    rewrites++;
    // Convert anchor to span by changing type marker + dropping href.
    // className + children stay intact.
    return '[\\"$\\",\\"span\\",null,{';
  });

  // Clean up any trailing comma left after the href drop: `,{`
  // followed by `,"className"` becomes `{"className"`.
  next = next.replace(/\[\\"\$\\",\\"span\\",null,\{,/g, '[\\"$\\",\\"span\\",null,{');

  if (rewrites > 0) {
    await writeFile(file, next, "utf8");
  }
  return { rewrites };
}

async function main() {
  const exists = await pathExists(OUT_DIR);
  if (!exists) {
    console.log(`strip-broken-links: out/ not found at ${OUT_DIR}, skipping`);
    return;
  }
  console.log("strip-broken-links: scanning out/ for internal 404 links...");
  const started = Date.now();
  const files = await collectHtmlFiles(OUT_DIR);
  let totalRewrites = 0;
  let filesTouched = 0;
  for (const f of files) {
    const { rewrites } = await processFile(f);
    if (rewrites > 0) {
      filesTouched++;
      totalRewrites += rewrites;
    }
  }
  const elapsed = ((Date.now() - started) / 1000).toFixed(1);
  console.log(
    `strip-broken-links: ${totalRewrites} broken-link anchors stripped across ${filesTouched} files · ${files.length} scanned · ${elapsed}s`,
  );
}

main().catch((e) => {
  console.error("strip-broken-links failed:", e);
  process.exit(1);
});
