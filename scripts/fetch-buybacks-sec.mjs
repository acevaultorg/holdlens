#!/usr/bin/env node
/**
 * Buyback refresh from SEC XBRL (the v0.3 parser lib/buybacks.ts promised).
 *
 *   node scripts/fetch-buybacks-sec.mjs            # writes data/buybacks-sec.json
 *   node scripts/fetch-buybacks-sec.mjs --dry      # prints the table, writes nothing
 *
 * Per company, from data.sec.gov companyfacts:
 *   - latest fiscal-year repurchases: 10-K, ~1-year duration, latest period end, value as
 *     reported in the latest filing for that end (so restatements win)
 *   - trailing 5-year average: the same tag, last 5 fiscal-year ends (null if fewer than 5)
 *   - remaining authorization: StockRepurchaseProgramRemainingAuthorizedRepurchaseAmount1,
 *     only when dated within MAX_REM_AGE_DAYS (older tags are stale, so null, never carried)
 *   - buyback yield: FY repurchases / (cover-page shares outstanding x close price on the run
 *     date), single share class only; multi-class companies get null rather than a wrong cap
 *
 * Refuses (exit 1, nothing written) when any company has no fiscal year ending within
 * MAX_FY_AGE_DAYS and no FILING_READS entry: a stale number never ships silently.
 */
import { writeFileSync } from "fs";
import { resolve } from "path";

const UA = "HoldLens/0.3 (contact@acevault.org)";
const OUT = resolve(process.cwd(), "data/buybacks-sec.json");
const DRY = process.argv.includes("--dry");
const DAY = 86_400_000;
const MAX_FY_AGE_DAYS = 490; // a 10-K lands up to ~3 months after a fiscal year that ran 12
const MAX_REM_AGE_DAYS = 460;

const CIKS = {
  AAPL: "0000320193", GOOGL: "0001652044", META: "0001326801", MSFT: "0000789019",
  NVDA: "0001045810", "BRK.B": "0001067983", JPM: "0000019617", BAC: "0000070858",
  V: "0001403161", CVX: "0000093410", ORCL: "0001341439", MA: "0001141391",
  WFC: "0000072971", GS: "0000886982", MS: "0000895421", COST: "0000909832",
  HD: "0000354950", LOW: "0000060667", WMT: "0000104169", CSCO: "0000858877",
  PG: "0000080424", XOM: "0000034088", COP: "0001163165", AVGO: "0001730168",
  CRM: "0001108524",
};

// Several listed share classes (or class B/C stock that converts): cover-page share counts
// do not give a market cap, so no yield for these.
const MULTI_CLASS = new Set(["GOOGL", "META", "BRK.B", "V", "MA"]);

// Cash-flow tags first; the equity-statement tag only when none of them has a current year
// (Morgan Stanley stopped using the cash-flow tag in 2013).
const FY_TAGS = [
  "PaymentsForRepurchaseOfCommonStock",
  "PaymentsForRepurchaseOfEquity",
  "PaymentsForRepurchaseOfCommonStockAndPreferredStock",
];
const FALLBACK_TAGS = ["StockRepurchasedDuringPeriodValue"];

// Values read by hand from the filing text where XBRL carries no current fact. Used only when
// XBRL has nothing newer. Each entry quotes the line it came from.
const FILING_READS = {
  "BRK.B": {
    val: 0,
    start: "2025-01-01",
    end: "2025-12-31",
    filed: "2026-03-02",
    accn: "0001193125-26-083899",
    tag: "10-K text",
    note: 'Berkshire 10-K for 2025: "There were no share repurchases in 2025." Cash-flow line "Acquisition of treasury stock" is nil for 2025 ($2.918B in 2024).',
  },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const days = (a, b) => (Date.parse(b) - Date.parse(a)) / DAY;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

async function getJson(url, headers = {}) {
  for (let i = 0; i < 3; i++) {
    const res = await fetch(url, { headers: { "User-Agent": UA, ...headers } });
    if (res.ok) return res.json();
    if (res.status === 404) return null;
    await sleep(1500 * (i + 1));
  }
  throw new Error(`fetch failed: ${url}`);
}

function annualRows(facts, tag) {
  const rows = facts?.["us-gaap"]?.[tag]?.units?.USD ?? [];
  const byEnd = new Map();
  for (const r of rows) {
    if (!r.form?.startsWith("10-K") || !r.start) continue;
    const d = days(r.start, r.end);
    if (d < 340 || d > 380) continue;
    const prev = byEnd.get(r.end);
    if (!prev || r.filed > prev.filed) byEnd.set(r.end, { ...r, tag });
  }
  return [...byEnd.values()].sort((a, b) => a.end.localeCompare(b.end));
}

function latestFy(facts, tags) {
  let best = null;
  let series = [];
  for (const tag of tags) {
    const rows = annualRows(facts, tag);
    if (!rows.length) continue;
    const last = rows[rows.length - 1];
    if (!best || last.end > best.end) {
      best = last;
      series = rows;
    }
  }
  return { best, series };
}

function fyLabel(end) {
  const [y, m] = end.split("-").map(Number);
  // 52/53-week years ending in the first days of a month belong to the month before.
  const day = Number(end.slice(8, 10));
  let month = m;
  let year = y;
  if (day <= 7) {
    month = m === 1 ? 12 : m - 1;
    if (m === 1) year = y - 1;
  }
  return month === 12 ? `FY${year}` : `FY ended ${MONTHS[month - 1]} ${year}`;
}

async function closePrice(ticker) {
  const sym = ticker.replace(".", "-");
  try {
    const j = await getJson(
      `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?range=5d&interval=1d`,
      { "User-Agent": "Mozilla/5.0" },
    );
    const meta = j?.chart?.result?.[0]?.meta;
    if (!meta?.regularMarketPrice || !meta?.regularMarketTime) return null;
    return {
      price: meta.regularMarketPrice,
      date: new Date(meta.regularMarketTime * 1000).toISOString().slice(0, 10),
    };
  } catch {
    return null;
  }
}

const today = new Date().toISOString().slice(0, 10);
const rows = {};
const refused = [];

for (const [ticker, cik] of Object.entries(CIKS)) {
  const j = await getJson(`https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`);
  await sleep(150);
  const facts = j?.facts ?? {};

  let { best, series } = latestFy(facts, FY_TAGS);
  if (!best || days(best.end, today) > MAX_FY_AGE_DAYS) {
    const fb = latestFy(facts, FALLBACK_TAGS);
    if (fb.best && (!best || fb.best.end > best.end)) ({ best, series } = fb);
  }
  const read = FILING_READS[ticker];
  if (read && (!best || read.end > best.end)) {
    best = read;
    series = [...series.filter((r) => r.end < read.end), read];
  }
  if (!best || days(best.end, today) > MAX_FY_AGE_DAYS) {
    refused.push(`${ticker}: newest fiscal year ${best?.end ?? "none"}`);
    continue;
  }

  const last5 = series.slice(-5);
  const trailing5yAverage =
    last5.length === 5 && days(last5[0].end, last5[4].end) < 5 * 380
      ? Math.round(last5.reduce((a, r) => a + r.val, 0) / 5)
      : null;

  const remRows = (facts["us-gaap"]?.StockRepurchaseProgramRemainingAuthorizedRepurchaseAmount1?.units?.USD ?? [])
    .filter((r) => /^10-[KQ]/.test(r.form ?? ""))
    .sort((a, b) => a.end.localeCompare(b.end) || a.filed.localeCompare(b.filed));
  const rem = remRows[remRows.length - 1];
  const remFresh = rem && days(rem.end, today) <= MAX_REM_AGE_DAYS ? rem : null;

  let yieldPct = null;
  let yieldAsOf = null;
  let marketCapNote = null;
  if (!MULTI_CLASS.has(ticker)) {
    const so = facts.dei?.EntityCommonStockSharesOutstanding?.units?.shares ?? [];
    const lastEnd = so.reduce((m, r) => (r.end > m ? r.end : m), "");
    const atEnd = so.filter((r) => r.end === lastEnd);
    const distinct = new Set(atEnd.map((r) => r.val));
    if (lastEnd && distinct.size === 1 && days(lastEnd, today) <= MAX_REM_AGE_DAYS) {
      const px = await closePrice(ticker);
      if (px) {
        const shares = atEnd[0].val;
        const cap = shares * px.price;
        yieldPct = Math.round((best.val / cap) * 1000) / 10;
        yieldAsOf = px.date;
        marketCapNote = `${shares} shares (cover page ${lastEnd}) x $${px.price} close ${px.date}`;
      }
      await sleep(250);
    }
  }

  const accnPath = best.accn.replace(/-/g, "");
  rows[ticker] = {
    latestFyRepurchased: best.val,
    latestFyLabel: fyLabel(best.end),
    fyPeriodEnd: best.end,
    trailing5yAverage,
    authRemainingEstimate: remFresh ? remFresh.val : null,
    authRemainingAsOf: remFresh ? remFresh.end : null,
    buybackYieldPct: yieldPct,
    yieldAsOf,
    marketCapNote,
    source: {
      filingType: "10-K",
      filingDate: best.filed,
      edgarUrl: `https://www.sec.gov/Archives/edgar/data/${Number(cik)}/${accnPath}/`,
      note: best.note ?? `${best.tag}, ${best.start} to ${best.end}, as reported in the 10-K filed ${best.filed}.`,
    },
  };
  console.log(
    `${ticker.padEnd(6)} ${(best.val / 1e9).toFixed(3).padStart(8)}B ${rows[ticker].latestFyLabel.padEnd(20)} ` +
      `filed ${best.filed}  5y ${trailing5yAverage ? (trailing5yAverage / 1e9).toFixed(1) + "B" : "-"}  ` +
      `rem ${remFresh ? (remFresh.val / 1e9).toFixed(1) + "B @" + remFresh.end : "-"}  yield ${yieldPct ?? "-"}`,
  );
}

if (refused.length) {
  console.error(`REFUSED, nothing written. No current fiscal year for:\n  ${refused.join("\n  ")}`);
  console.error("Read the 10-K and add a FILING_READS entry, or fix the tag list.");
  process.exit(1);
}

const dataAsOf = Object.values(rows).reduce((m, r) => (r.source.filingDate > m ? r.source.filingDate : m), "");
const out = { generatedAt: today, dataAsOf, count: Object.keys(rows).length, rows };
if (DRY) console.log(`dry run: ${out.count} rows, data as of ${dataAsOf}`);
else {
  writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
  console.log(`wrote ${OUT}: ${out.count} rows, data as of ${dataAsOf}`);
}
