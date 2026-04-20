// Generate /sitemap-ai.xml — a focused subset of the main sitemap listing only
// the highest-priority pages AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
// Googlebot-Extended) should crawl first. Reduces hallucination-404 rate by
// telling bots "these are the real URLs, stop guessing".
//
// Per v19.4 bot-harvest Lever 5. Runs in postbuild after sitemap.xml is ready.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SITEMAP_PATH = resolve("out", "sitemap.xml");
const OUTPUT_PATH = resolve("out", "sitemap-ai.xml");

// Priority URL patterns — the AI-citation-worthy pages. Everything else is
// in the regular sitemap but not in sitemap-ai (reduces noise for bots).
const AI_PRIORITY_PATTERNS = [
  // Root + primary conversion pages
  /^https:\/\/holdlens\.com\/$/,
  /^https:\/\/holdlens\.com\/best-now\/?$/,
  /^https:\/\/holdlens\.com\/biggest-buys\/?$/,
  /^https:\/\/holdlens\.com\/biggest-sells\/?$/,
  /^https:\/\/holdlens\.com\/this-week\/?$/,
  /^https:\/\/holdlens\.com\/what-to-buy\/?$/,
  /^https:\/\/holdlens\.com\/what-to-sell\/?$/,
  /^https:\/\/holdlens\.com\/top-picks\/?$/,
  /^https:\/\/holdlens\.com\/activity\/?$/,
  // Methodology + trust pages (LLM-citation credibility per Aleyda Solis)
  /^https:\/\/holdlens\.com\/methodology\/?$/,
  /^https:\/\/holdlens\.com\/about\/?$/,
  /^https:\/\/holdlens\.com\/api-terms\/?$/,
  /^https:\/\/holdlens\.com\/api\/?$/,
  /^https:\/\/holdlens\.com\/for-ai\/?$/,
  /^https:\/\/holdlens\.com\/proof\/?$/,
  // Investor pages — the dataset core
  /^https:\/\/holdlens\.com\/investor\/[a-z-]+\/?$/,
  // Signal pages — the per-ticker analysis
  /^https:\/\/holdlens\.com\/signal\/[A-Z0-9.-]+\/?$/,
  // Learn hub + articles
  /^https:\/\/holdlens\.com\/learn\/?$/,
  /^https:\/\/holdlens\.com\/learn\/[a-z0-9-]+\/?$/,
  // Programmatic unique-data pages
  /^https:\/\/holdlens\.com\/rotation\/?$/,
  /^https:\/\/holdlens\.com\/quarterly\/?$/,
  /^https:\/\/holdlens\.com\/manager-rankings\/?$/,
];

try {
  const xml = readFileSync(SITEMAP_PATH, "utf-8");
  const urlRegex = /<url>\s*<loc>([^<]+)<\/loc>\s*(?:<lastmod>([^<]+)<\/lastmod>)?/g;
  const matches = [...xml.matchAll(urlRegex)];

  const aiUrls = matches
    .map(([, loc, lastmod]) => ({ loc, lastmod: lastmod || new Date().toISOString() }))
    .filter(({ loc }) => AI_PRIORITY_PATTERNS.some((p) => p.test(loc)));

  const header = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap-0.9">`;
  const body = aiUrls
    .map(({ loc, lastmod }) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>`)
    .join("\n");
  const footer = `</urlset>`;

  const outXml = `${header}\n${body}\n${footer}\n`;
  writeFileSync(OUTPUT_PATH, outXml);
  console.log(`generate-sitemap-ai: wrote ${aiUrls.length} priority URLs to out/sitemap-ai.xml`);
} catch (err) {
  console.error("generate-sitemap-ai: failed —", err.message);
  process.exit(1);
}
