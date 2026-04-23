#!/usr/bin/env npx tsx
/**
 * EDGAR Form 8-K Parser — fetches SEC Form 8-K (material event) filings
 * from EDGAR's daily-index, parses item-numbers + headlines, emits structured
 * JSON for the HoldLens /events/ surface.
 *
 * Usage:
 *   npx tsx scripts/fetch-edgar-8k.ts                  # default: last 7 days
 *   npx tsx scripts/fetch-edgar-8k.ts --days 30        # last 30 days
 *   npx tsx scripts/fetch-edgar-8k.ts --since 2026-04-01
 *   npx tsx scripts/fetch-edgar-8k.ts --max 1000       # cap rows for testing
 *
 * Output:
 *   data/edgar-8k.json        — array of Form8KEvent-shaped rows
 *   data/edgar-8k-stats.json  — per-day counts + skipped reasons
 *
 * 8-K vs Form 4 differences:
 *   - 8-K doesn't have a standardized structured XML for "items". Items are
 *     announced in the SEC-HEADER block as "ITEM INFORMATION:" rows.
 *   - We parse SEC-HEADER, extract item codes (1.01, 1.05, 5.02, etc.),
 *     ticker (from issuerName + EDGAR ticker lookup), filingDate, and headline.
 *   - We DON'T attempt to extract event detail/summary from filing body —
 *     that requires NLP per item-type and is Day-3 work. The per-item-type
 *     pages on /events/type/[slug] already have curated context; this scraper
 *     populates the per-ticker firehose only.
 *   - Each .txt may have MULTIPLE item codes (one filing can be ITEM 5.02 AND
 *     9.01); we emit one row per (filing, item-code) tuple.
 *
 * Day-2 step plan (this script is step 1; integration is step 2):
 *   1. THIS SCRIPT — fetcher only. Outputs data/edgar-8k.json. Safe to test.
 *   2. Step 2 (next session): swap lib/events.ts CURATED_EVENTS to merge with
 *      EDGAR data; keep curated as CURATED_EVENTS for hand-verified events.
 *   3. Step 3: scripts/generate-api-json.ts events endpoints already exist;
 *      they'll auto-populate with the larger dataset on next regeneration.
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";

const USER_AGENT = "HoldLens/0.2 (contact@acevault.org)";
const RATE_LIMIT_MS = 220; // ~4.5 req/sec, well within SEC 10/sec cap
const DEFAULT_DAYS = 7;
const DATA_DIR = resolve(import.meta.dirname ?? __dirname, "../data");
const TICKER_MAP_URL = "https://www.sec.gov/files/company_tickers.json";
const TICKER_MAP_CACHE = resolve(DATA_DIR, "sec-ticker-map.json");
const TICKER_MAP_TTL_DAYS = 7;

// SEC Form 8-K item codes we surface (canonical taxonomy, matches lib/events.ts EVENT_ITEMS)
const TRACKED_ITEMS = new Set([
  "1.01", "1.02", "1.03", "1.05", "2.01", "2.02", "2.05", "2.06",
  "3.01", "4.02", "5.02", "7.01", "8.01",
]);

// Output shape (mirrors lib/events.ts Form8KEvent — emits one row per item code)
type ScrapedForm8KEvent = {
  ticker: string;
  companyName: string;
  itemCode: string;
  eventDate: string;       // ISO YYYY-MM-DD
  filedAt: string;          // ISO YYYY-MM-DD
  headline: string;         // generated from item-code label, since 8-Ks don't have free-text headlines in metadata
  source: "edgar";
  // v0.2 extension fields
  form8kAccessionNumber: string;
  issuerCik: string;
};

type DayStats = {
  date: string;
  formsListed: number;
  form8ksFound: number;
  parsed: number;
  skipped: number;
  skipReasons: Record<string, number>;
};

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  let days = DEFAULT_DAYS;
  let since: Date | null = null;
  let max: number | null = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--days" && args[i + 1]) days = parseInt(args[++i], 10);
    else if (args[i] === "--since" && args[i + 1]) since = new Date(args[++i]);
    else if (args[i] === "--max" && args[i + 1]) max = parseInt(args[++i], 10);
  }
  return { days, since, max };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "*/*" },
      });
      if (res.status === 429) {
        await sleep(1000 * Math.pow(2, attempt));
        continue;
      }
      return res;
    } catch (err) {
      lastErr = err;
      await sleep(500 * Math.pow(2, attempt));
    }
  }
  throw lastErr ?? new Error(`fetchWithRetry exhausted for ${url}`);
}

function quarterOf(d: Date): number {
  return Math.floor(d.getUTCMonth() / 3) + 1;
}
function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function ymdCompact(d: Date): string {
  return ymd(d).replace(/-/g, "");
}
function dailyIndexUrl(d: Date): string {
  return `https://www.sec.gov/Archives/edgar/daily-index/${d.getUTCFullYear()}/QTR${quarterOf(
    d
  )}/form.${ymdCompact(d)}.idx`;
}

// ---------------------------------------------------------------------------
// Daily-index parsing (regex-anchored for column-width drift tolerance)
// ---------------------------------------------------------------------------

type IndexRow = {
  formType: string;
  companyName: string;
  cik: string;
  filingDate: string;
  filename: string;
};

function parseDailyIndex(text: string): IndexRow[] {
  const rows: IndexRow[] = [];
  const lines = text.split("\n");
  let inData = false;
  for (const raw of lines) {
    if (!inData) {
      if (raw.startsWith("---")) inData = true;
      continue;
    }
    if (raw.length < 50) continue;
    const fnMatch = raw.match(/(edgar\/data\/\S+)\s*$/);
    if (!fnMatch) continue;
    const filename = fnMatch[1];
    const headPart = raw.slice(0, fnMatch.index).trimEnd();
    const tailMatch = headPart.match(/(\d{1,10})\s+(\d{8})\s*$/);
    if (!tailMatch) continue;
    const [tail, cik, filingDate] = tailMatch;
    const beforeTail = headPart.slice(0, headPart.length - tail.length).trimEnd();
    const formMatch = beforeTail.match(/^(\S+)\s+(.+)$/);
    if (!formMatch) continue;
    const [, formType, companyName] = formMatch;
    if (!formType || !cik) continue;
    rows.push({
      formType,
      companyName: companyName.trim(),
      cik,
      filingDate,
      filename,
    });
  }
  return rows;
}

function txtUrlFromIndex(indexPath: string): string | null {
  const m = indexPath.match(/^edgar\/data\/(\d+)\/([\d-]+)\.txt$/);
  if (!m) return null;
  const [, cik, accDashed] = m;
  return `https://www.sec.gov/Archives/edgar/data/${cik}/${accDashed}.txt`;
}

// ---------------------------------------------------------------------------
// 8-K parsing (SEC-HEADER + ITEM INFORMATION lines)
// ---------------------------------------------------------------------------

// 8-K SEC-HEADER block contains "ITEM INFORMATION:" lines that encode the items.
// Format examples seen in real EDGAR 8-Ks:
//   ITEM INFORMATION:	Departure of Directors or Certain Officers; ...
//   ITEM INFORMATION:	Financial Statements and Exhibits
// Item NUMBERS are NOT in the ITEM INFORMATION lines themselves — they're
// in the EDGAR XBRL block (different format). For broad coverage, we infer
// item codes from a small label-to-code lookup.
const ITEM_LABEL_TO_CODE: Record<string, string> = {
  "Entry into a Material Definitive Agreement": "1.01",
  "Termination of a Material Definitive Agreement": "1.02",
  "Bankruptcy or Receivership": "1.03",
  "Material Cybersecurity Incidents": "1.05",
  "Completion of Acquisition or Disposition of Assets": "2.01",
  "Results of Operations and Financial Condition": "2.02",
  "Costs Associated with Exit or Disposal Activities": "2.05",
  "Material Impairments": "2.06",
  "Notice of Delisting or Failure to Satisfy a Continued Listing Rule or Standard": "3.01",
  "Non-Reliance on Previously Issued Financial Statements or a Related Audit Report or Completed Interim Review": "4.02",
  "Departure of Directors or Certain Officers; Election of Directors; Appointment of Certain Officers; Compensatory Arrangements of Certain Officers": "5.02",
  "Regulation FD Disclosure": "7.01",
  "Other Events": "8.01",
};

// Loose-match (substring → code) for header label variations
function inferItemCode(label: string): string | null {
  const trimmed = label.trim();
  // Exact match first
  if (ITEM_LABEL_TO_CODE[trimmed]) return ITEM_LABEL_TO_CODE[trimmed];
  // Substring fallback per known label fragments (handles SEC's evolving wording)
  const fragments: Array<[RegExp, string]> = [
    [/material definitive agreement/i, /entry/i.test(trimmed) ? "1.01" : "1.02"],
    [/bankruptcy/i, "1.03"],
    [/cybersecurity/i, "1.05"],
    [/completion of acquisition/i, "2.01"],
    [/results of operations/i, "2.02"],
    [/costs associated.*exit/i, "2.05"],
    [/material impairment/i, "2.06"],
    [/delisting|listing rule/i, "3.01"],
    [/non-reliance.*previously issued/i, "4.02"],
    [/departure.*directors|election.*directors|appointment.*officers/i, "5.02"],
    [/regulation fd/i, "7.01"],
    [/other events/i, "8.01"],
  ];
  for (const [re, code] of fragments) {
    if (re.test(trimmed)) return code;
  }
  return null;
}

function extractTickerFromHeader(header: string): string | null {
  // EDGAR sometimes embeds TRADING SYMBOL in the SEC-HEADER. Many 8-Ks omit
  // it; for those we fall through to CIK-lookup via SEC's company_tickers map.
  const ts = header.match(/TRADING SYMBOL:\s*([A-Z][A-Z0-9.\-]{0,9})/i);
  return ts ? ts[1].toUpperCase() : null;
}

// SEC publishes a free, single-file CIK→ticker map at company_tickers.json
// (~10k rows). Cached locally with 7-day TTL to avoid re-fetching every run.
type CikTickerMap = Record<string, { ticker: string; name: string }>;

async function loadCikTickerMap(): Promise<CikTickerMap> {
  if (existsSync(TICKER_MAP_CACHE)) {
    const stat = require("fs").statSync(TICKER_MAP_CACHE);
    const ageDays = (Date.now() - stat.mtimeMs) / 86_400_000;
    if (ageDays < TICKER_MAP_TTL_DAYS) {
      try {
        return JSON.parse(require("fs").readFileSync(TICKER_MAP_CACHE, "utf-8"));
      } catch {
        /* fall through to re-fetch */
      }
    }
  }
  console.log("  Refreshing SEC company_tickers.json map ...");
  const res = await fetchWithRetry(TICKER_MAP_URL);
  if (!res.ok) {
    console.warn("  CIK map fetch failed; continuing with empty map");
    return {};
  }
  // Format: { "0": { cik_str: 320193, ticker: "AAPL", title: "Apple Inc." }, ... }
  const raw = (await res.json()) as Record<string, { cik_str: number; ticker: string; title: string }>;
  const map: CikTickerMap = {};
  for (const v of Object.values(raw)) {
    const cikPadded = String(v.cik_str).padStart(10, "0");
    map[cikPadded] = { ticker: v.ticker.toUpperCase(), name: v.title };
  }
  writeFileSync(TICKER_MAP_CACHE, JSON.stringify(map, null, 0));
  console.log(`  Cached ${Object.keys(map).length.toLocaleString()} CIK→ticker entries`);
  return map;
}

type ParsedForm8K = {
  ticker: string;
  companyName: string;
  issuerCik: string;
  eventDate: string;
  itemCodes: string[];
};

function parseForm8KTxt(
  txt: string,
  fallbackCompany: string,
  fallbackCik: string,
  fallbackFiledAt: string
): ParsedForm8K | null {
  // SEC-HEADER block contains everything we need
  const headerMatch = txt.match(/<SEC-HEADER>([\s\S]*?)<\/SEC-HEADER>/i);
  if (!headerMatch) return null;
  const header = headerMatch[1];

  // Ticker — try header first, fall back to (none — we still emit for company name)
  const ticker = extractTickerFromHeader(header) ?? "";

  // Item INFORMATION lines
  const itemLines = [
    ...header.matchAll(/ITEM INFORMATION:\s*([^\n\r]+)/gi),
  ].map((m) => m[1].trim());

  const itemCodes = itemLines
    .map((label) => inferItemCode(label))
    .filter((c): c is string => c !== null && TRACKED_ITEMS.has(c));

  if (itemCodes.length === 0) return null;

  // Event date — try CONFORMED PERIOD OF REPORT first (event date), else fall back to filing date
  const eventDate =
    header.match(/CONFORMED PERIOD OF REPORT:\s*(\d{8})/i)?.[1] ??
    header.match(/FILED AS OF DATE:\s*(\d{8})/i)?.[1] ??
    fallbackFiledAt;
  const eventDateIso = eventDate.length === 8
    ? `${eventDate.slice(0, 4)}-${eventDate.slice(4, 6)}-${eventDate.slice(6, 8)}`
    : fallbackFiledAt;

  return {
    ticker,
    companyName: fallbackCompany,
    issuerCik: fallbackCik.padStart(10, "0"),
    eventDate: eventDateIso,
    itemCodes: Array.from(new Set(itemCodes)),
  };
}

// Generate a human-readable headline from item-code (since 8-Ks don't have
// canonical headlines; the "headline" is implied by the item type).
const ITEM_HEADLINES: Record<string, string> = {
  "1.01": "Material agreement entered",
  "1.02": "Material agreement terminated",
  "1.03": "Bankruptcy or receivership",
  "1.05": "Material cybersecurity incident",
  "2.01": "Acquisition or disposition completed",
  "2.02": "Earnings results",
  "2.05": "Exit or disposal costs",
  "2.06": "Material impairment",
  "3.01": "Delisting notice",
  "4.02": "Financial restatement",
  "5.02": "Officer / director change",
  "7.01": "Regulation FD disclosure",
  "8.01": "Other material event",
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const { days, since, max } = parseArgs();
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

  const today = new Date();
  const start = since ?? new Date(today.getTime() - days * 86_400_000);

  console.log(
    `Form 8-K fetcher — User-Agent: ${USER_AGENT}\n  range: ${ymd(start)} → ${ymd(
      today
    )}${max ? `, max=${max} rows` : ""}\n`
  );

  // Load CIK→ticker map first (single fetch, then cached 7d). Used to resolve
  // tickers when 8-K SEC-HEADER lacks TRADING SYMBOL.
  const cikTickerMap = await loadCikTickerMap();

  const allEvents: ScrapedForm8KEvent[] = [];
  const stats: DayStats[] = [];

  let cursor = new Date(start);
  outer: while (cursor <= today) {
    const dow = cursor.getUTCDay();
    if (dow === 0 || dow === 6) {
      cursor = new Date(cursor.getTime() + 86_400_000);
      continue;
    }
    const dayUrl = dailyIndexUrl(cursor);
    const dayStat: DayStats = {
      date: ymd(cursor),
      formsListed: 0,
      form8ksFound: 0,
      parsed: 0,
      skipped: 0,
      skipReasons: {},
    };
    await sleep(RATE_LIMIT_MS);
    const idxRes = await fetchWithRetry(dayUrl);
    if (!idxRes.ok) {
      console.warn(`  ${ymd(cursor)} index fetch ${idxRes.status} — skip day`);
      stats.push(dayStat);
      cursor = new Date(cursor.getTime() + 86_400_000);
      continue;
    }
    const idxText = await idxRes.text();
    const rows = parseDailyIndex(idxText);
    dayStat.formsListed = rows.length;
    const form8ks = rows.filter((r) => r.formType === "8-K" || r.formType === "8-K/A");
    dayStat.form8ksFound = form8ks.length;
    console.log(`  ${ymd(cursor)}: ${rows.length} forms / ${form8ks.length} Form 8-Ks`);

    for (const row of form8ks) {
      if (max != null && allEvents.length >= max) break outer;
      const txtUrl = txtUrlFromIndex(row.filename);
      if (!txtUrl) {
        dayStat.skipped++;
        dayStat.skipReasons["bad_index_path"] =
          (dayStat.skipReasons["bad_index_path"] ?? 0) + 1;
        continue;
      }
      await sleep(RATE_LIMIT_MS);
      const txtRes = await fetchWithRetry(txtUrl);
      if (!txtRes.ok) {
        dayStat.skipped++;
        dayStat.skipReasons["txt_http_err"] =
          (dayStat.skipReasons["txt_http_err"] ?? 0) + 1;
        continue;
      }
      const txt = await txtRes.text();
      const parsed = parseForm8KTxt(txt, row.companyName, row.cik, row.filingDate);
      if (!parsed) {
        dayStat.skipped++;
        dayStat.skipReasons["no_tracked_items"] =
          (dayStat.skipReasons["no_tracked_items"] ?? 0) + 1;
        continue;
      }
      const accession = row.filename.match(/([\d-]+)\.txt$/)?.[1] ?? "";
      const filedAtIso = row.filingDate.length === 8
        ? `${row.filingDate.slice(0, 4)}-${row.filingDate.slice(4, 6)}-${row.filingDate.slice(6, 8)}`
        : row.filingDate;
      // Resolve ticker: SEC-HEADER first, then CIK→ticker map fallback
      const resolvedTicker =
        parsed.ticker ||
        cikTickerMap[parsed.issuerCik]?.ticker ||
        `_CIK_${parsed.issuerCik}`;
      // Emit one event row per item code (an 8-K can have multiple)
      for (const itemCode of parsed.itemCodes) {
        allEvents.push({
          ticker: resolvedTicker,
          companyName: parsed.companyName,
          itemCode,
          eventDate: parsed.eventDate,
          filedAt: filedAtIso,
          headline: ITEM_HEADLINES[itemCode] ?? `Item ${itemCode} disclosure`,
          source: "edgar",
          form8kAccessionNumber: accession,
          issuerCik: parsed.issuerCik,
        });
      }
      dayStat.parsed += parsed.itemCodes.length;
    }

    stats.push(dayStat);
    cursor = new Date(cursor.getTime() + 86_400_000);
  }

  const outFile = resolve(DATA_DIR, "edgar-8k.json");
  const statsFile = resolve(DATA_DIR, "edgar-8k-stats.json");
  writeFileSync(outFile, JSON.stringify(allEvents, null, 2));
  writeFileSync(
    statsFile,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalRows: allEvents.length,
        days: stats,
      },
      null,
      2
    )
  );

  console.log(`\n✓ Wrote ${allEvents.length.toLocaleString()} 8-K events to ${outFile}`);
  console.log(`✓ Wrote stats to ${statsFile}`);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
