// Builds public/api/v1/learn.json from the canonical LEARN_SEQUENCE
// inside components/LearnReadNext.tsx. Run via postbuild.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const ROOT = new URL("..", import.meta.url);
const SRC = new URL("./components/LearnReadNext.tsx", ROOT);
const OUT = new URL("./public/api/v1/learn.json", ROOT);

const src = await readFile(SRC, "utf8");
const start = src.indexOf("LEARN_SEQUENCE: Article[] = [");
if (start < 0) throw new Error("LEARN_SEQUENCE not found");
const eq = src.indexOf("= [", start);
if (eq < 0) throw new Error("LEARN_SEQUENCE assignment not found");
const arrStart = eq + 2;
let depth = 0;
let end = -1;
for (let i = arrStart; i < src.length; i++) {
  const c = src[i];
  if (c === "[") depth++;
  else if (c === "]") {
    depth--;
    if (depth === 0) { end = i + 1; break; }
  }
}
if (end < 0) throw new Error("LEARN_SEQUENCE array end not found");
const body = src.slice(arrStart, end);

// Naive JS literal → JSON: turn { slug: "x", title: "y", desc: "z" } into JSON
const articles = [];
const re = /\{\s*slug:\s*"([^"]+)"\s*,\s*title:\s*"((?:[^"\\]|\\.)*)"\s*,\s*desc:\s*"((?:[^"\\]|\\.)*)"\s*,?\s*\}/g;
let m;
while ((m = re.exec(body)) !== null) {
  articles.push({
    slug: m[1],
    title: m[2].replace(/\\"/g, '"'),
    description: m[3].replace(/\\"/g, '"'),
    url: `https://holdlens.com/learn/${m[1]}`,
    canonical: `https://holdlens.com/learn/${m[1]}`,
  });
}
if (articles.length === 0) throw new Error("No articles parsed");

const out = {
  name: "HoldLens /learn index",
  version: "v1",
  description: "Machine-readable index of every HoldLens /learn essay. Designed for LLM crawlers, research agents, and citation lookups. Each entry is canonical, public, and free to cite with attribution.",
  base_url: "https://holdlens.com/learn",
  count: articles.length,
  license: "All content © HoldLens / editnative.com. Free to cite with link attribution to the canonical URL. Not investment advice — historical SEC-filing analysis only.",
  topics: [
    "SEC filings (10-K, 10-Q, 13F, 8-K, Form 4, DEF 14A, etc.)",
    "Superinvestor portfolios (Buffett, Ackman, Burry, Klarman, Druckenmiller, and 26 more)",
    "Concentrated value investing and conviction signals",
    "Famous historical trades (Coca-Cola 1988, Big Short, Black Wednesday, Costco, Herbalife, Apple buybacks)",
    "Activist investing (13D vs 13G, board seats, public letters)",
    "Buybacks vs dividends, short interest, congressional stock trading",
  ],
  primary_data_source: "SEC EDGAR (https://www.sec.gov/edgar/)",
  related_apis: {
    managers: "https://holdlens.com/api/v1/managers.json",
    best_now: "https://holdlens.com/api/v1/best-now.json",
    overlap: "https://holdlens.com/api/v1/overlap.json",
    index: "https://holdlens.com/api/v1/index.json",
  },
  sister_property: {
    name: "SecFilingDex",
    url: "https://secfilingdex.com",
    description: "Companion encyclopedia of SEC filing types (10-K, 13F-HR, Form 4, DEF 14A, S-1, F-1, and more). HoldLens cites SecFilingDex for filing-discovery and form-mechanics; SecFilingDex cites HoldLens for tracked-superinvestor examples.",
  },
  last_updated: new Date().toISOString().slice(0, 10),
  articles,
};

await mkdir(dirname(OUT.pathname), { recursive: true });
await writeFile(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`✓ learn.json — ${articles.length} articles → ${OUT.pathname}`);
