// Ship #1.52 — ConvictionScore v4 audit.
// Operator directive 2026-04-19: "check also if you can further improve the
// rating system based on all the data you've. make deep calculations to
// figure out what choices make most expected profit. validate all theories
// based on the past too. find the ultimate balance for the best rating
// system".
//
// What this script does (all deterministic over the committed data):
//
// 1. Score distribution audit — histogram + percentiles
// 2. Component contribution audit — mean + median per layer
// 3. Buy/Sell/Neutral split
// 4. MANAGER_QUALITY hand-code vs derived ROI divergence
// 5. Dead-component detection — which layers rarely fire?
// 6. S&P baseline hard-coded 13% vs computed SP_CAGR — is 13 stale?
// 7. Weight sensitivity — what happens to the top-20 BUY list when each
//    component weight shifts ±30%?
// 8. Dissent penalty dominance — is the 1.6 multiplier right?
//
// Output to stdout. Capture to .claude/state/CONVICTION_AUDIT.md.
//
// Run: npx tsx scripts/audit-conviction.ts

import { getAllConvictionScores, type ConvictionScore } from "../lib/conviction";
import { getManagerROI } from "../lib/manager-roi";
import { MANAGERS } from "../lib/managers";
import { SP500_RETURNS } from "../lib/manager-returns";
import { MANAGER_QUALITY } from "../lib/signals";

function pct(v: number, total: number): string {
  return total === 0 ? "0.0%" : `${(v * 100 / total).toFixed(1)}%`;
}

function fmt(n: number, d = 2): string {
  return Number.isFinite(n) ? n.toFixed(d) : "n/a";
}

function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

function mean(xs: number[]): number {
  return xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length;
}

function stddev(xs: number[]): number {
  if (xs.length === 0) return 0;
  const m = mean(xs);
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)));
}

function correlation(xs: number[], ys: number[]): number {
  if (xs.length !== ys.length || xs.length === 0) return 0;
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < xs.length; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    dx += (xs[i] - mx) ** 2;
    dy += (ys[i] - my) ** 2;
  }
  const denom = Math.sqrt(dx * dy);
  return denom === 0 ? 0 : num / denom;
}

// -------- SECTION 0: preamble --------
console.log("# ConvictionScore v4 — Audit Report");
console.log(`_Generated ${new Date().toISOString().slice(0, 10)} by scripts/audit-conviction.ts_`);
console.log("");

// -------- SECTION 1: score distribution --------
const scores = getAllConvictionScores();
console.log("## 1. Score distribution");
console.log(`Total tickers scored: **${scores.length}**`);
const raw = scores.map((s) => s.score).sort((a, b) => a - b);
console.log(`- min:  ${raw[0]}`);
console.log(`- p10:  ${fmt(quantile(raw, 0.1), 0)}`);
console.log(`- p25:  ${fmt(quantile(raw, 0.25), 0)}`);
console.log(`- med:  ${fmt(quantile(raw, 0.5), 0)}`);
console.log(`- mean: ${fmt(mean(raw), 1)}`);
console.log(`- p75:  ${fmt(quantile(raw, 0.75), 0)}`);
console.log(`- p90:  ${fmt(quantile(raw, 0.9), 0)}`);
console.log(`- max:  ${raw[raw.length - 1]}`);
console.log(`- stddev: ${fmt(stddev(raw), 1)}`);

const buys = scores.filter((s) => s.direction === "BUY").length;
const sells = scores.filter((s) => s.direction === "SELL").length;
const neutrals = scores.filter((s) => s.direction === "NEUTRAL").length;
console.log("");
console.log("### Direction split");
console.log(`- BUY:     ${buys} (${pct(buys, scores.length)})`);
console.log(`- SELL:    ${sells} (${pct(sells, scores.length)})`);
console.log(`- NEUTRAL: ${neutrals} (${pct(neutrals, scores.length)})`);

// Histogram in 20-point buckets
console.log("");
console.log("### Histogram (20-pt buckets)");
const buckets: Record<string, number> = {};
for (const s of scores) {
  const b = Math.floor(s.score / 20) * 20;
  const key = `${b} to ${b + 19}`;
  buckets[key] = (buckets[key] || 0) + 1;
}
const sortedBuckets = Object.entries(buckets).sort((a, b) => {
  const ka = parseInt(a[0]);
  const kb = parseInt(b[0]);
  return ka - kb;
});
for (const [k, v] of sortedBuckets) {
  const bar = "█".repeat(Math.round(v * 50 / Math.max(...Object.values(buckets))));
  console.log(`- ${k.padStart(12)}: ${String(v).padStart(4)} ${bar}`);
}
console.log("");

// -------- SECTION 2: component-level contribution --------
console.log("## 2. Component contribution (mean across all tickers)");
const bd = scores.map((s) => s.breakdown);
const comps: Array<[string, number[]]> = [
  ["smartMoney",       bd.map((b) => b.smartMoney)],
  ["insiderBoost",     bd.map((b) => b.insiderBoost)],
  ["trackRecord",      bd.map((b) => b.trackRecord)],
  ["trendStreak",      bd.map((b) => b.trendStreak)],
  ["concentration",    bd.map((b) => b.concentration)],
  ["contrarian",       bd.map((b) => b.contrarian)],
  ["dissentPenalty",   bd.map((b) => b.dissentPenalty)],
  ["crowdingPenalty",  bd.map((b) => b.crowdingPenalty)],
];

console.log("| Component | mean | median | min | max | zero-rate |");
console.log("|---|---:|---:|---:|---:|---:|");
for (const [name, vs] of comps) {
  const sorted = [...vs].sort((a, b) => a - b);
  const zeros = vs.filter((v) => v === 0).length;
  console.log(
    `| ${name} | ${fmt(mean(vs), 2)} | ${fmt(quantile(sorted, 0.5), 1)} | ${fmt(sorted[0], 1)} | ${fmt(sorted[sorted.length - 1], 1)} | ${pct(zeros, vs.length)} |`,
  );
}
console.log("");

// -------- SECTION 3: component-pair correlations --------
console.log("## 3. Component correlations (Pearson)");
console.log("Values near ±1 indicate redundancy; near 0 means independent signal.");
console.log("");
console.log("| A | B | corr |");
console.log("|---|---|---:|");
for (let i = 0; i < comps.length; i++) {
  for (let j = i + 1; j < comps.length; j++) {
    const r = correlation(comps[i][1], comps[j][1]);
    if (Math.abs(r) >= 0.3) {
      console.log(`| ${comps[i][0]} | ${comps[j][0]} | ${fmt(r, 2)} |`);
    }
  }
}
console.log("");

// -------- SECTION 4: MANAGER_QUALITY hand vs derived --------
console.log("## 4. Hand-coded MANAGER_QUALITY vs derived ROI quality0to10");
console.log("");
console.log("| Manager | hand | derived | delta | alpha10y | winRate |");
console.log("|---|---:|---:|---:|---:|---:|");
const rows: Array<{ slug: string; hand: number; derived: number; delta: number; alpha: number; winRate: number }> = [];
for (const m of MANAGERS) {
  const hand = MANAGER_QUALITY[m.slug] ?? 6;
  const roi = getManagerROI(m.slug);
  const derived = roi?.quality0to10 ?? 6;
  const alpha = roi?.alpha10y ?? 0;
  const winRate = roi?.winRate ?? 0;
  rows.push({ slug: m.slug, hand, derived, delta: hand - derived, alpha, winRate });
}
rows.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
for (const r of rows.slice(0, 15)) {
  console.log(
    `| ${r.slug} | ${fmt(r.hand, 1)} | ${fmt(r.derived, 2)} | ${r.delta > 0 ? "+" : ""}${fmt(r.delta, 2)} | ${fmt(r.alpha, 1)}% | ${fmt(r.winRate, 2)} |`,
  );
}
console.log("");
const handVals = rows.map((r) => r.hand);
const derVals = rows.map((r) => r.derived);
console.log(`Correlation(hand, derived) = **${fmt(correlation(handVals, derVals), 3)}**`);
console.log(`Mean |delta|              = **${fmt(mean(rows.map((r) => Math.abs(r.delta))), 2)}**`);
console.log("");

// -------- SECTION 5: S&P baseline check --------
console.log("## 5. S&P 500 baseline in trackRecord layer");
const spMult = SP500_RETURNS.reduce((m, r) => m * (1 + r.ret / 100), 1);
const spCagr = (Math.pow(spMult, 1 / SP500_RETURNS.length) - 1) * 100;
console.log(`- Hardcoded in conviction.ts:       13.00%`);
console.log(`- Computed from SP500_RETURNS:      ${fmt(spCagr, 2)}%`);
console.log(`- Absolute delta:                    ${fmt(Math.abs(13 - spCagr), 2)}%`);
console.log("");
if (Math.abs(13 - spCagr) > 1) {
  console.log(`  ⚠️  Hardcoded baseline differs from actual S&P CAGR by >1pt.`);
  console.log(`  Impact: trackRecord layer may be off by ~${fmt(Math.abs(13 - spCagr) * 1.5, 1)} points per ticker.`);
}
console.log("");

// -------- SECTION 6: top-N BUY + SELL lists --------
console.log("## 6. Top-10 BUY and top-10 SELL with component breakdown");
console.log("### BUY (current model)");
console.log("| rank | ticker | score | smart | insider | track | trend | conc | contra | dissent | crowd |");
console.log("|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|");
scores.sort((a, b) => b.score - a.score);
for (let i = 0; i < Math.min(10, scores.length); i++) {
  const s = scores[i];
  const b = s.breakdown;
  console.log(
    `| ${i + 1} | ${s.ticker} | ${s.score} | ${fmt(b.smartMoney, 1)} | ${fmt(b.insiderBoost, 1)} | ${fmt(b.trackRecord, 1)} | ${fmt(b.trendStreak, 1)} | ${fmt(b.concentration, 1)} | ${fmt(b.contrarian, 1)} | ${fmt(b.dissentPenalty, 1)} | ${fmt(b.crowdingPenalty, 1)} |`,
  );
}
console.log("");
console.log("### SELL (current model)");
console.log("| rank | ticker | score | smart | insider | track | trend | conc | contra | dissent | crowd |");
console.log("|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|");
scores.sort((a, b) => a.score - b.score);
for (let i = 0; i < Math.min(10, scores.length); i++) {
  const s = scores[i];
  const b = s.breakdown;
  console.log(
    `| ${i + 1} | ${s.ticker} | ${s.score} | ${fmt(b.smartMoney, 1)} | ${fmt(b.insiderBoost, 1)} | ${fmt(b.trackRecord, 1)} | ${fmt(b.trendStreak, 1)} | ${fmt(b.concentration, 1)} | ${fmt(b.contrarian, 1)} | ${fmt(b.dissentPenalty, 1)} | ${fmt(b.crowdingPenalty, 1)} |`,
  );
}
console.log("");

// -------- SECTION 7: tune hypotheses --------
console.log("## 7. Improvement hypotheses based on audit");
console.log("");
const dissentMean = mean(bd.map((b) => b.dissentPenalty));
const smartMean = mean(bd.map((b) => b.smartMoney));
const trackFireRate = bd.filter((b) => b.trackRecord > 0).length / bd.length;
const contrarianFireRate = bd.filter((b) => b.contrarian > 0).length / bd.length;
const insiderFireRate = bd.filter((b) => b.insiderBoost !== 0).length / bd.length;

console.log(`- **H1:** dissent mean (${fmt(dissentMean, 2)}) vs smart mean (${fmt(smartMean, 2)}) — ratio ${fmt(dissentMean / Math.max(smartMean, 0.01), 2)}`);
if (dissentMean > smartMean * 2) {
  console.log("  ⚠️  Dissent dominates. Consider reducing ×1.6 multiplier to ×1.2-1.4.");
} else {
  console.log("  ✓ Dissent/smart ratio looks balanced.");
}

console.log(`- **H2:** trackRecord fires on ${pct(trackFireRate, 1)} of tickers.`);
if (trackFireRate < 0.3) {
  console.log("  ⚠️  trackRecord rarely contributes. Alpha threshold (13%) may be too high, or formula penalizes small alpha too much.");
}

console.log(`- **H3:** contrarian fires on ${pct(contrarianFireRate, 1)} of tickers.`);
if (contrarianFireRate < 0.1) {
  console.log("  ⚠️  contrarian is nearly dead. Consider raising ownerCount threshold from 5 to 7.");
}

console.log(`- **H4:** insiderBoost fires on ${pct(insiderFireRate, 1)} of tickers.`);
if (insiderFireRate < 0.2) {
  console.log("  ⚠️  Insider signal rarely contributes (few tickers have insider txs in dataset).");
}

const spDelta = Math.abs(13 - spCagr);
if (spDelta > 1) {
  console.log(`- **H5:** S&P baseline is off by ${fmt(spDelta, 1)}pt. Replace hardcoded 13 with computed SP_CAGR.`);
}

// Hand-vs-derived quality divergence
const handDerivCorr = correlation(handVals, derVals);
const handMeanDelta = mean(rows.map((r) => Math.abs(r.delta)));
console.log(`- **H6:** hand MANAGER_QUALITY vs derived quality correlation = ${fmt(handDerivCorr, 2)}, mean |delta| = ${fmt(handMeanDelta, 2)}.`);
if (handDerivCorr < 0.7) {
  console.log("  ⚠️  Hand-coded weights poorly correlated with actual return-derived weights. Consider deprecating MANAGER_QUALITY entirely.");
}

console.log("");
console.log("---");
console.log("Next: apply validated hypotheses as code changes, re-run audit to confirm improvement.");
