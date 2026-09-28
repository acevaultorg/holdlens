#!/usr/bin/env node
// sitemap-lastmod.mjs — give each out/sitemap.xml URL the date its page last CHANGED, not the build time.
//
// Why (2026-09-28, site guard card mukti6j5jzi12o): app/sitemap.ts stamps `lastModified: now` on every
// entry, so all 1,291 live URLs carried the same millisecond (2026-09-28T07:00:46.304Z). A lastmod that
// moves on every deploy for pages that did not change teaches Bing and Google to ignore it, which costs
// the pages that DID change (13F filings, insider buys) their fast recrawl.
//
// Mechanism: hash each page's visible text (scripts, styles, tags and whitespace removed, so Next's
// per-build chunk names and RSC payload do not count as change). Stored per URL in data/page-lastmod.json:
//   { "<url>": { "h": "<sha1-12>", "d": "YYYY-MM-DD" } }
// Same hash as stored -> keep the stored date. New or different -> today. A URL with no HTML file
// (feeds, .xml/.json, /api/) keeps whatever app/sitemap.ts wrote.
//
// Seeded 2026-09-28 from the live pages (1,191 URLs, all deployed that day, dated 2026-09-28). A URL
// with no history gets today. Commit data/page-lastmod.json after every deploy, or the next deploy
// re-dates the pages this one changed.
//
// Never fails the build: on any error the sitemap stays as Next wrote it.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";

const OUT = path.resolve(process.cwd(), "out");
const SITEMAP = path.join(OUT, "sitemap.xml");
const MANIFEST = path.resolve(process.cwd(), "data/page-lastmod.json");
const BASE = "https://holdlens.com";
const today = new Date().toISOString().slice(0, 10);

function fileFor(url) {
  let p = url.startsWith(BASE) ? url.slice(BASE.length) : url;
  p = decodeURIComponent(p.split(/[?#]/)[0] || "/");
  if (/\.(xml|json|txt|pdf|rss|atom)$/i.test(p) || p.startsWith("/api/")) return null;
  const clean = p.replace(/^\/+|\/+$/g, "");
  const cands = clean ? [path.join(OUT, clean, "index.html"), path.join(OUT, clean + ".html")] : [path.join(OUT, "index.html")];
  return cands.find((f) => existsSync(f)) || null;
}

export function visibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Run only as a script, so the seed/test tools can import visibleText() without touching out/.
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) try {
  if (!existsSync(SITEMAP)) throw new Error("no out/sitemap.xml");
  const xml = readFileSync(SITEMAP, "utf8");
  const old = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
  const next = {};
  let kept = 0, changed = 0, skipped = 0;
  const out = xml.replace(/<url>([\s\S]*?)<\/url>/g, (block, inner) => {
    const loc = (inner.match(/<loc>\s*([^<]+?)\s*<\/loc>/) || [])[1];
    const f = loc && fileFor(loc);
    if (!f) { skipped++; if (loc && old[loc]) next[loc] = old[loc]; return block; }
    const h = createHash("sha1").update(visibleText(readFileSync(f, "utf8"))).digest("hex").slice(0, 12);
    const prev = old[loc];
    const d = prev && prev.h === h ? prev.d : today;
    if (d === today && !(prev && prev.h === h)) changed++; else kept++;
    next[loc] = { h, d };
    const body = /<lastmod>[\s\S]*?<\/lastmod>/.test(inner)
      ? inner.replace(/<lastmod>[\s\S]*?<\/lastmod>/, `<lastmod>${d}</lastmod>`)
      : inner.replace(/(<\/loc>)/, `$1\n<lastmod>${d}</lastmod>`);
    return `<url>${body}</url>`;
  });
  writeFileSync(SITEMAP, out);
  writeFileSync(MANIFEST, JSON.stringify(next, null, 0).replace(/},"/g, '},\n"') + "\n");
  console.log(`sitemap-lastmod: ${kept} unchanged (kept date) · ${changed} new/changed (${today}) · ${skipped} without an HTML file`);
  if (changed) console.log("sitemap-lastmod: commit data/page-lastmod.json after this deploy");
} catch (e) {
  console.log(`sitemap-lastmod: ${e.message} — sitemap left as built`);
}
