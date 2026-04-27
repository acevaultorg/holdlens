/**
 * scripts/dt-stats.ts — coverage dashboard for the dividend-tax research
 * cadence. Run with `npm run dt:stats` at the start of each evening
 * session to see progress + spot underserved investor countries.
 */

import * as fs from "node:fs";
import * as path from "node:path";

type State = "verified" | "derived" | "needs_research";
type TreatyCell = {
  investor_country: string;
  payer_country: string;
  withholding_rate_pct: number;
  source_citation: string;
  state: State;
  last_verified: string;
};
type Country = { code: string; name: string };

const data = JSON.parse(
  fs.readFileSync(path.resolve("data/dividend-tax.json"), "utf8"),
) as { countries: Country[]; treaties: TreatyCell[]; _meta: any };

const total = data.treaties.length;
const verified = data.treaties.filter((t) => t.state === "verified").length;
const derived = data.treaties.filter((t) => t.state === "derived").length;
const needs = data.treaties.filter((t) => t.state === "needs_research").length;
const target = data.countries.length * data.countries.length;

console.log("DIVIDEND-TAX RESEARCH CADENCE — coverage report");
console.log("─".repeat(60));
console.log(`Matrix:           ${target} cells (${data.countries.length}×${data.countries.length})`);
console.log(`Verified:         ${verified} (${((100 * verified) / target).toFixed(1)}%)`);
console.log(`Derived:          ${derived}`);
console.log(`Needs research:   ${needs} (${((100 * needs) / target).toFixed(1)}%)`);
console.log(`Total in JSON:    ${total}`);
console.log();

// Source distribution (for verified cells)
const sourceBuckets: Record<string, number> = {};
const SRC_PATTERNS: [string, RegExp][] = [
  ["PwC", /pwc/i],
  ["KPMG", /kpmg/i],
  ["IRS Pub 901", /irs\s+(publication|pub\.?)\s*901/i],
  ["OECD", /oecd/i],
  ["Country tax authority", /hmrc|\bato\b|bzst|skatteverket|skatteetaten|skat\.dk|agenzia entrate|aeat|belastingdienst|impots|estv|cra|nta\.go|iras/i],
  ["EY/Deloitte", /\bey\b|deloitte/i],
];
for (const t of data.treaties) {
  if (t.state !== "verified" && t.state !== "derived") continue;
  let bucketed = false;
  for (const [name, re] of SRC_PATTERNS) {
    if (re.test(t.source_citation)) {
      sourceBuckets[name] = (sourceBuckets[name] ?? 0) + 1;
      bucketed = true;
      break;
    }
  }
  if (!bucketed) sourceBuckets["Other/uncited"] = (sourceBuckets["Other/uncited"] ?? 0) + 1;
}

console.log("Source distribution (verified cells):");
const sortedSources = Object.entries(sourceBuckets).sort((a, b) => b[1] - a[1]);
for (const [name, n] of sortedSources) {
  console.log(`  ${name.padEnd(28)} ${n.toString().padStart(4)}`);
}
console.log();

// Per-investor country progress — operator can pick "today's batch"
console.log("Coverage by investor country (sorted by % verified, ascending = highest leverage):");
const perInv: Record<string, { v: number; total: number }> = {};
for (const t of data.treaties) {
  const k = t.investor_country;
  if (!perInv[k]) perInv[k] = { v: 0, total: 0 };
  perInv[k].total++;
  if (t.state === "verified" || t.state === "derived") perInv[k].v++;
}
const rows = Object.entries(perInv)
  .map(([code, v]) => ({ code, ...v, pct: (100 * v.v) / v.total }))
  .sort((a, b) => a.pct - b.pct);
for (const r of rows) {
  const bar = "█".repeat(Math.round(r.pct / 5)).padEnd(20, "·");
  console.log(`  ${r.code}  ${bar} ${r.v.toString().padStart(3)}/${r.total} (${r.pct.toFixed(0)}%)`);
}
console.log();

// Recently verified (last 7 days) — momentum signal
const today = new Date();
const sevenDaysAgo = new Date(today.getTime() - 7 * 86400 * 1000)
  .toISOString()
  .slice(0, 10);
const recent = data.treaties.filter(
  (t) =>
    (t.state === "verified" || t.state === "derived") &&
    t.last_verified >= sevenDaysAgo,
);
console.log(`Recently verified (last 7 days): ${recent.length} cells`);
console.log();

// Suggested next batch — pick the investor country with lowest coverage
// that has known sources available (US always available via IRS Pub 901).
const lowest = rows[0];
console.log("─".repeat(60));
console.log(`SUGGESTED NEXT BATCH: investor=${lowest.code}, fill ${lowest.total - lowest.v} cells.`);
console.log(`At 30-45 min/evening × ~12 cells/session: ~${Math.ceil(needs / 12)} sessions to hit 100%.`);
console.log(
  "Add cells fast: npm run dt:add -- --inv " +
    lowest.code +
    " --pay XX --rate N --ref \"...\" --src \"PwC/KPMG/IRS Pub 901: ...\"",
);
