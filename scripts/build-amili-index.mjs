#!/usr/bin/env node
// out/amili-index.json for the Ask Amili bar: [{title, url, text, terms}], one entry per page in
// out/sitemap.xml (so only advertised, indexable pages). text = the page's OWN meta description,
// no new claims. Copied from zipradar (0558ced), adapted from colorcombinations' script (S5, ee955dc). Fails if empty or over the
// embed's ~300 KB budget.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
const OUT = path.resolve("out");
const SITE = "https://holdlens.com";
const dec = (s) => String(s).replace(/&amp;/g, "&").replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
const sm = await readFile(path.join(OUT, "sitemap.xml"), "utf8");
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, "")).filter((u) => u !== "/" && !/^\/(terms|privacy|partners|methodology|disclosure|contact|about|faq)\/$/.test(u));
const out = [];
for (const u of urls) {
  const rel = u.replace(/^\/|\/$/g, "");
  let h;
  for (const f of [path.join(OUT, rel, "index.html"), path.join(OUT, rel + ".html")]) { try { h = await readFile(f, "utf8"); break; } catch {} }
  if (!h || /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(h)) continue;
  const title = dec(((h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || "").replace(/<!-- -->/g, "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  const desc = dec((h.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || [])[1] || "").trim();
  if (!title || !desc) continue;
  const segs = rel.split("/");
  out.push({ title: title.slice(0, 110), url: u, text: desc.length > 120 ? desc.slice(0, 117).replace(/\s+\S*$/, "") + "…" : desc, terms: [...new Set([segs.slice(1).join(" ").replace(/-/g, " "), segs[0]])].filter(Boolean) });
}
const json = JSON.stringify(out);
if (!out.length) { console.error("build-amili-index: 0 entries, refusing"); process.exit(1); }
if (json.length > 300 * 1024) { console.error(`build-amili-index: ${(json.length / 1024).toFixed(0)} KB > 300 KB budget, refusing`); process.exit(1); }
await writeFile(path.join(OUT, "amili-index.json"), json);
console.log(`build-amili-index: ${out.length} of ${urls.length} sitemap pages, ${(json.length / 1024).toFixed(0)} KB`);
