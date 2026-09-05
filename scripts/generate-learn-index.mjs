// Builds public/api/v1/learn.json from the canonical LEARN_SEQUENCE
// inside components/LearnReadNext.tsx. Run via postbuild.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const ROOT = new URL("..", import.meta.url);
const SRC = new URL("./components/LearnReadNext.tsx", ROOT);
const OUT = new URL("./out/api/v1/learn.json", ROOT);

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
  license: "All content © HoldLens / Caslon Media. Free to cite with link attribution to the canonical URL. Not investment advice — historical SEC-filing analysis only.",
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
  collections: {
    famous_trades: {
      name: "Famous trades — public-record case studies",
      description: "Eight historical trades reconstructable from SEC EDGAR alone (Berkshire/KO 1988, Berkshire/Apple 2016-onward, Berkshire/BAC 2011 preferred+warrants, Burry/Big Short 2005-08, Ackman/Herbalife 2012-18, Soros-Druckenmiller/GBP 1992, Munger/Costco 1997-2023, Icahn/Apple 2013-16). Each essay traces the trade through 13F, Form 4, and DEF 14A filings.",
      slugs: [
        "buffett-coca-cola-trade",
        "buffett-apple-position",
        "buffett-bank-of-america-2011",
        "tepper-bank-stocks-2009",
        "burry-big-short",
        "ackman-herbalife-short",
        "soros-druckenmiller-gbp-1992",
        "munger-costco-lifetime-hold",
        "icahn-apple-buyback-campaign",
      ],
    },
    sec_filing_mechanics: {
      name: "SEC filing mechanics",
      description: "Plain-English guides to the SEC forms that produce HoldLens's data: 13F (institutional holdings), Form 4 (insider trades), DEF 14A (proxies), 13D/13G (5%+ stakes), Rule 144 (insider sales).",
      slugs: [
        "edgar-explained",
        "what-is-a-13f",
        "how-to-read-a-13f",
        "45-day-lag-explained",
        "13f-vs-13d-vs-13g",
        "13d-vs-13g-activist-filings",
        "13f-securities-list",
        "form-4-vs-13f",
        "proxy-voting-def-14a",
        "rule-144-holding-period",
        "cusip-explained",
      ],
    },
    signals_and_methodology: {
      name: "HoldLens signals + methodology",
      description: "How HoldLens computes ConvictionScore, InsiderScore, Event Score, and why no single SEC filing tells the whole story.",
      slugs: [
        "conviction-score-explained",
        "insider-score-explained",
        "event-score-explained",
        "sec-signals-trilogy",
        "do-hedge-fund-signals-work",
        "what-is-alpha",
        "copy-trading-myth",
        "survivorship-bias-in-hedge-funds",
        "superinvestor-handbook",
        "warren-buffett-method",
      ],
    },
    capital_allocation: {
      name: "Capital allocation + corporate finance",
      description: "Buybacks, dividends, short interest, ETF overlap, congressional stock trading — adjacent topics for serious public-markets readers.",
      slugs: [
        "buybacks-vs-dividends",
        "how-to-read-buyback-disclosures",
        "short-interest-explained",
        "etf-overlap-explained",
        "congressional-stock-trading-stock-act",
      ],
    },
  },
  last_updated: new Date().toISOString().slice(0, 10),
  articles,
};

await mkdir(new URL(".", OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`✓ learn.json — ${articles.length} articles → ${fileURLToPath(OUT)}`);
