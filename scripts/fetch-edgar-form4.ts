#!/usr/bin/env npx tsx
/**
 * EDGAR Form 4 Parser — fetches SEC Form 4 (insider trading) filings
 * from EDGAR's daily-index, parses each transaction, and emits structured
 * JSON for the HoldLens /insiders/ surface.
 *
 * Usage:
 *   npx tsx scripts/fetch-edgar-form4.ts                  # default: last 7 days
 *   npx tsx scripts/fetch-edgar-form4.ts --days 30        # last 30 days
 *   npx tsx scripts/fetch-edgar-form4.ts --since 2026-04-01
 *   npx tsx scripts/fetch-edgar-form4.ts --max 1000       # cap rows for testing
 *
 * Output:
 *   data/edgar-form4.json        — array of InsiderTx-shaped rows
 *   data/edgar-form4-stats.json  — per-day counts + skipped reasons
 *
 * SEC EDGAR fair-access:
 *   - User-Agent MUST identify caller (operator + contact)
 *   - 10 req/sec hard cap; we throttle to ~4.5/sec for safety
 *   - Daily index endpoint: https://www.sec.gov/Archives/edgar/daily-index/YYYY/QTRn/form.YYYYMMDD.idx
 *   - Filings cataloged after publication; we filter Form Type == "4" or "4/A"
 *
 * Day-2 ship plan (this script is step 1; integration is step 2):
 *   1. THIS SCRIPT — fetcher only. Outputs data/edgar-form4.json. Safe to test
 *      without touching the live site or lib/insiders.ts.
 *   2. Step 2 (next session): swap lib/insiders.ts INSIDER_TX from hand-curated
 *      22 rows to a build-time import of data/edgar-form4.json. Keep curated
 *      rows merged in as CURATED_INSIDER_TX for hand-verified reference cases.
 *   3. Step 3: scripts/generate-api-json.ts emits /api/v1/insiders/* endpoints.
 *   4. Step 4: indexnow ping + sitemap-ai.xml regen pick up the new URLs.
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const USER_AGENT = "HoldLens/0.2 (contact@acevault.org)";
const RATE_LIMIT_MS = 220; // ~4.5 req/sec, well within SEC's 10/sec cap
const DEFAULT_DAYS = 7;
const DATA_DIR = resolve(import.meta.dirname ?? __dirname, "../data");

// SEC Form 4 transaction codes (Table I) per
// https://www.sec.gov/about/forms/form4data.pdf — the ~99% codes we care about.
//   P=open-market purchase (strongest +signal)  S=open-market sale
//   A=grant/award (compensation, ~zero signal)  M=option exercise
//   F=tax withholding on vesting (mechanical)   D=disposition to issuer
//   G=bona-fide gift                            V=voluntary report
//   J=other (catch-all; needs note to interpret)
type Form4TransactionCode = "P" | "S" | "A" | "M" | "F" | "D" | "G" | "V" | "J";

type InsiderTxAction = "buy" | "sell";

// Output shape (mirror lib/insiders.ts InsiderTx exactly so the swap in step 2
// is a one-line import change. Optional v0.2 fields populated from EDGAR.)
type ScrapedInsiderTx = {
  ticker: string;
  insiderName: string;
  insiderTitle: string;
  action: InsiderTxAction;
  date: string; // ISO YYYY-MM-DD (transaction date)
  shares: number;
  pricePerShare: number;
  value: number;
  remainingShares?: number;
  note?: string;
  // v0.2 EDGAR-sourced fields
  form4AccessionNumber: string;
  transactionCode: Form4TransactionCode;
  derivative: boolean;
  filedAt: string;
  issuerCik: string;
  reporterCik: string;
};

type DayStats = {
  date: string;
  formsListed: number;
  form4sFound: number;
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
    if (args[i] === "--days" && args[i + 1]) {
      days = parseInt(args[++i], 10);
    } else if (args[i] === "--since" && args[i + 1]) {
      since = new Date(args[++i]);
    } else if (args[i] === "--max" && args[i + 1]) {
      max = parseInt(args[++i], 10);
    }
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
        // Rate-limited — back off exponentially
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

// EDGAR daily-index URL for a given date.
function dailyIndexUrl(d: Date): string {
  return `https://www.sec.gov/Archives/edgar/daily-index/${d.getUTCFullYear()}/QTR${quarterOf(
    d
  )}/form.${ymdCompact(d)}.idx`;
}

// ---------------------------------------------------------------------------
// Daily-index parsing
// ---------------------------------------------------------------------------

type IndexRow = {
  formType: string;
  companyName: string;
  cik: string;
  filingDate: string;
  filename: string; // e.g. edgar/data/320193/0001127602-25-001234-index.htm
};

function parseDailyIndex(text: string): IndexRow[] {
  const rows: IndexRow[] = [];
  const lines = text.split("\n");
  // The .idx file has a header that ends with a row of dashes; data follows.
  let inData = false;
  for (const raw of lines) {
    if (!inData) {
      if (raw.startsWith("---")) inData = true;
      continue;
    }
    if (raw.length < 50) continue;
    // SEC's form.YYYYMMDD.idx column widths drift across years. Anchor on
    // the filename (always ends `edgar/data/...`) and parse backward:
    //   <FormType>  <CompanyName>  <CIK>  <YYYYMMDD>  edgar/data/CIK/ACC.txt
    const fnMatch = raw.match(/(edgar\/data\/\S+)\s*$/);
    if (!fnMatch) continue;
    const filename = fnMatch[1];
    const headPart = raw.slice(0, fnMatch.index).trimEnd();
    // Parse from the end of headPart: ... <CIK> <YYYYMMDD>
    const tailMatch = headPart.match(/(\d{1,10})\s+(\d{8})\s*$/);
    if (!tailMatch) continue;
    const [tail, cik, filingDate] = tailMatch;
    const beforeTail = headPart.slice(0, headPart.length - tail.length).trimEnd();
    // beforeTail = "<FormType>  <CompanyName>"
    // Form type is the first whitespace-bounded token
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

// ---------------------------------------------------------------------------
// Form 4 fetch + parse
// ---------------------------------------------------------------------------

// EDGAR daily-index "filename" column comes as
//   edgar/data/{CIK}/{ACC-NUM-WITH-DASHES}.txt
// The .txt is the full filing as a single MIME-concatenated text doc with the
// Form 4 ownership XML embedded inside <XML> ... </XML> tags. Single fetch =
// half the SEC rate-limit pressure vs the older index.json + xml two-step.
function form4TxtUrlFromIndex(indexPath: string): string | null {
  const m =
    indexPath.match(/^edgar\/data\/(\d+)\/([\d-]+)\.txt$/) ||
    // Defensive: -index.htm form (older EDGAR), derive .txt from it
    indexPath.match(/^edgar\/data\/(\d+)\/([\d-]+)-index\.htm$/);
  if (!m) return null;
  const [, cik, accDashed] = m;
  return `https://www.sec.gov/Archives/edgar/data/${cik}/${accDashed}.txt`;
}

// Extract the embedded Form 4 ownership XML from the EDGAR .txt submission.
// The .txt wraps each attached file in <DOCUMENT>...</DOCUMENT> blocks. The
// Form 4 XML is inside <XML>...</XML> within the TYPE=4 document section.
function extractOwnershipXmlFromTxt(txt: string): string | null {
  // Try the most-specific pattern first: <ownershipDocument> ... </ownershipDocument>
  const ownership = txt.match(
    /<ownershipDocument>([\s\S]*?)<\/ownershipDocument>/i
  );
  if (ownership) return `<ownershipDocument>${ownership[1]}</ownershipDocument>`;
  // Fallback: <XML> ... </XML> block
  const xmlBlock = txt.match(/<XML>\s*([\s\S]*?)\s*<\/XML>/i);
  if (xmlBlock) return xmlBlock[1];
  return null;
}

// Form 4 ownership XML structure (simplified):
//   <ownershipDocument>
//     <issuer>
//       <issuerCik>0000320193</issuerCik>
//       <issuerName>Apple Inc</issuerName>
//       <issuerTradingSymbol>AAPL</issuerTradingSymbol>
//     </issuer>
//     <reportingOwner>
//       <reportingOwnerId>
//         <rptOwnerCik>0001234567</rptOwnerCik>
//         <rptOwnerName>Cook Tim</rptOwnerName>
//       </reportingOwnerId>
//       <reportingOwnerRelationship>
//         <isOfficer>1</isOfficer>
//         <officerTitle>CEO</officerTitle>
//         <isDirector>0</isDirector>
//         <isTenPercentOwner>0</isTenPercentOwner>
//       </reportingOwnerRelationship>
//     </reportingOwner>
//     <nonDerivativeTable>
//       <nonDerivativeTransaction>
//         <securityTitle><value>Common Stock</value></securityTitle>
//         <transactionDate><value>2026-04-15</value></transactionDate>
//         <transactionCoding>
//           <transactionCode>P</transactionCode>
//         </transactionCoding>
//         <transactionAmounts>
//           <transactionShares><value>1000</value></transactionShares>
//           <transactionPricePerShare><value>175.50</value></transactionPricePerShare>
//           <transactionAcquiredDisposedCode><value>A</value></transactionAcquiredDisposedCode>
//         </transactionAmounts>
//         <postTransactionAmounts>
//           <sharesOwnedFollowingTransaction><value>50000</value></sharesOwnedFollowingTransaction>
//         </postTransactionAmounts>
//       </nonDerivativeTransaction>
//     </nonDerivativeTable>
//     <derivativeTable>...</derivativeTable>  (we mark these derivative=true)
//   </ownershipDocument>

function tagText(xml: string, tag: string): string | null {
  const r = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, "i");
  const m = xml.match(r);
  return m ? m[1].replace(/<[^>]+>/g, "").trim() || null : null;
}

function valueText(xml: string, parentTag: string): string | null {
  const block = tagText(xml, parentTag);
  if (!block) return null;
  // Extract <value>...</value> from inside if present
  const v = block.match(/<value[^>]*>([\s\S]*?)<\/value>/i);
  return v ? v[1].trim() : block;
}

type ParsedForm4 = {
  issuerCik: string;
  issuerName: string;
  issuerTicker: string;
  reporterCik: string;
  reporterName: string;
  reporterTitle: string;
  isOfficer: boolean;
  isDirector: boolean;
  isTenPercentOwner: boolean;
  transactions: ScrapedInsiderTx[];
};

function parseForm4Xml(
  xml: string,
  accession: string,
  filedAt: string
): ParsedForm4 | null {
  // Issuer
  const issuerBlock = xml.match(/<issuer>([\s\S]*?)<\/issuer>/i);
  if (!issuerBlock) return null;
  const issuerCik = tagText(issuerBlock[1], "issuerCik") ?? "";
  const issuerName = tagText(issuerBlock[1], "issuerName") ?? "";
  const issuerTicker = (tagText(issuerBlock[1], "issuerTradingSymbol") ?? "").toUpperCase();
  if (!issuerTicker) return null; // Skip filings without a trading symbol

  // Reporting owner
  const ownerBlock = xml.match(/<reportingOwner>([\s\S]*?)<\/reportingOwner>/i);
  if (!ownerBlock) return null;
  const reporterCik = tagText(ownerBlock[1], "rptOwnerCik") ?? "";
  const reporterName = tagText(ownerBlock[1], "rptOwnerName") ?? "";
  const reporterTitle = tagText(ownerBlock[1], "officerTitle") ?? "";
  const isOfficer = (tagText(ownerBlock[1], "isOfficer") ?? "0") === "1";
  const isDirector = (tagText(ownerBlock[1], "isDirector") ?? "0") === "1";
  const isTenPercentOwner =
    (tagText(ownerBlock[1], "isTenPercentOwner") ?? "0") === "1";

  // Resolve title fallback if officerTitle missing
  const resolvedTitle =
    reporterTitle ||
    (isDirector ? "Director" : isTenPercentOwner ? "10% Owner" : "Insider");

  const transactions: ScrapedInsiderTx[] = [];

  // Non-derivative transactions
  const nonDerivBlocks = [
    ...xml.matchAll(
      /<nonDerivativeTransaction>([\s\S]*?)<\/nonDerivativeTransaction>/gi
    ),
  ];
  for (const m of nonDerivBlocks) {
    const tx = parseTransactionBlock(
      m[1],
      false,
      issuerTicker,
      reporterName,
      resolvedTitle,
      accession,
      filedAt,
      issuerCik,
      reporterCik
    );
    if (tx) transactions.push(tx);
  }

  // Derivative transactions (marked derivative=true; weaker signal)
  const derivBlocks = [
    ...xml.matchAll(
      /<derivativeTransaction>([\s\S]*?)<\/derivativeTransaction>/gi
    ),
  ];
  for (const m of derivBlocks) {
    const tx = parseTransactionBlock(
      m[1],
      true,
      issuerTicker,
      reporterName,
      resolvedTitle,
      accession,
      filedAt,
      issuerCik,
      reporterCik
    );
    if (tx) transactions.push(tx);
  }

  if (transactions.length === 0) return null;

  return {
    issuerCik,
    issuerName,
    issuerTicker,
    reporterCik,
    reporterName,
    reporterTitle: resolvedTitle,
    isOfficer,
    isDirector,
    isTenPercentOwner,
    transactions,
  };
}

function parseTransactionBlock(
  block: string,
  derivative: boolean,
  ticker: string,
  insiderName: string,
  insiderTitle: string,
  accession: string,
  filedAt: string,
  issuerCik: string,
  reporterCik: string
): ScrapedInsiderTx | null {
  const date = valueText(block, "transactionDate");
  const codeRaw = (tagText(block, "transactionCode") ?? "").toUpperCase();
  if (!date || !codeRaw) return null;
  if (!"PSAMFDGVJ".includes(codeRaw)) return null;
  const code = codeRaw as Form4TransactionCode;
  const shares = parseFloat(valueText(block, "transactionShares") ?? "0") || 0;
  const ppsRaw = valueText(block, "transactionPricePerShare") ?? "0";
  const pricePerShare = parseFloat(ppsRaw) || 0;
  const post = parseFloat(
    valueText(block, "sharesOwnedFollowingTransaction") ?? "0"
  );
  const acqDisp = (
    valueText(block, "transactionAcquiredDisposedCode") ?? ""
  ).toUpperCase();
  const action: InsiderTxAction = acqDisp === "A" ? "buy" : "sell";

  // Form-4 footnote indicating 10b5-1 plan — captured as a free-text marker.
  const note10b51 = /10b5-?1/i.test(block) ? "10b5-1 plan" : undefined;

  return {
    ticker,
    insiderName,
    insiderTitle,
    action,
    date,
    shares,
    pricePerShare,
    value: shares * pricePerShare,
    remainingShares: post > 0 ? post : undefined,
    note: note10b51,
    form4AccessionNumber: accession,
    transactionCode: code,
    derivative,
    filedAt,
    issuerCik,
    reporterCik,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const { days, since, max } = parseArgs();

  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

  const today = new Date();
  const start = since ?? new Date(today.getTime() - days * 86_400_000);

  console.log(
    `Form 4 fetcher — User-Agent: ${USER_AGENT}\n  range: ${ymd(start)} → ${ymd(
      today
    )}${max ? `, max=${max} rows` : ""}\n`
  );

  const allTx: ScrapedInsiderTx[] = [];
  const stats: DayStats[] = [];

  let cursor = new Date(start);
  outer: while (cursor <= today) {
    // Skip Sat/Sun (no SEC filings)
    const dow = cursor.getUTCDay();
    if (dow === 0 || dow === 6) {
      cursor = new Date(cursor.getTime() + 86_400_000);
      continue;
    }

    const dayUrl = dailyIndexUrl(cursor);
    const dayStat: DayStats = {
      date: ymd(cursor),
      formsListed: 0,
      form4sFound: 0,
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
    const form4s = rows.filter((r) => r.formType === "4" || r.formType === "4/A");
    dayStat.form4sFound = form4s.length;

    console.log(
      `  ${ymd(cursor)}: ${rows.length} forms / ${form4s.length} Form 4s`
    );

    for (const row of form4s) {
      if (max != null && allTx.length >= max) break outer;
      const txtUrl = form4TxtUrlFromIndex(row.filename);
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
      const xml = extractOwnershipXmlFromTxt(txt);
      if (!xml) {
        dayStat.skipped++;
        dayStat.skipReasons["no_ownership_xml"] =
          (dayStat.skipReasons["no_ownership_xml"] ?? 0) + 1;
        continue;
      }
      const accession =
        row.filename.match(/([\d-]+)\.txt$/)?.[1] ??
        row.filename.match(/([\d-]+)-index\.htm$/)?.[1] ??
        "";
      const parsed = parseForm4Xml(xml, accession, row.filingDate);
      if (!parsed) {
        dayStat.skipped++;
        dayStat.skipReasons["parse_failed"] =
          (dayStat.skipReasons["parse_failed"] ?? 0) + 1;
        continue;
      }
      allTx.push(...parsed.transactions);
      dayStat.parsed += parsed.transactions.length;
    }

    stats.push(dayStat);
    cursor = new Date(cursor.getTime() + 86_400_000);
  }

  // Write outputs
  const outFile = resolve(DATA_DIR, "edgar-form4.json");
  const statsFile = resolve(DATA_DIR, "edgar-form4-stats.json");
  writeFileSync(outFile, JSON.stringify(allTx, null, 2));
  writeFileSync(
    statsFile,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalRows: allTx.length,
        days: stats,
      },
      null,
      2
    )
  );

  console.log(
    `\n✓ Wrote ${allTx.length.toLocaleString()} transactions to ${outFile}`
  );
  console.log(`✓ Wrote stats to ${statsFile}`);
  console.log(`\nNext step (separate session): swap lib/insiders.ts INSIDER_TX
to read data/edgar-form4.json. Keep curated rows in CURATED_INSIDER_TX.`);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
