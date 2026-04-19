// ConvictionScore v4.1+v4.2 backtest against realized returns.
//
// Operator directive 2026-04-19: "make deep calculations to figure out
// what choices make most expected profit. validate all theories based
// on the past."
//
// Method:
//   1. For each historical quarter Q in {2024-Q4, 2025-Q1, 2025-Q2, 2025-Q3}:
//        - Score EVERY tracked ticker as of Q (via getConvictionAtQuarter)
//        - Find the 13F filing date for Q (QUARTER_FILED[Q])
//   2. Fetch Yahoo v8 chart for each unique ticker (2y range, daily closes)
//   3. For each (ticker, Q), find the close nearest the filing date (entry)
//      and the most recent close (exit)
//   4. Compute forward return = (exit - entry) / entry × 100
//   5. Benchmark against SPY (S&P 500 ETF) over the same window
//   6. Statistics per quarter:
//      - Pearson correlation (score, returnPct)
//      - Mean return of top-10 BUYs (score ≥ 10) vs bottom-10 SELLs (score ≤ -10)
//      - Hit-rate: % of top-10 BUYs with positive alpha over SPY
//      - Hit-rate: % of top-10 SELLs underperforming SPY
//   7. Aggregate across quarters with equal weight
//
// Output: stdout markdown, captured to .claude/state/CONVICTION_BACKTEST.md
//
// Run: npx tsx scripts/backtest-conviction.ts

import { ALL_MOVES, QUARTER_FILED, type Quarter } from "../lib/moves";
import { getConvictionAtQuarter } from "../lib/conviction";

const HISTORICAL_QUARTERS: Quarter[] = [
  "2024-Q4",
  "2025-Q1",
  "2025-Q2",
  "2025-Q3",
];

type ChartPoint = { t: number; c: number };

async function fetchYahooChart(ticker: string): Promise<ChartPoint[] | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=2y&interval=1d`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      chart?: {
        result?: Array<{
          timestamp?: number[];
          indicators?: { quote?: Array<{ close?: (number | null)[] }> };
        }>;
      };
    };
    const r = json.chart?.result?.[0];
    if (!r || !r.timestamp || !r.indicators?.quote?.[0]?.close) return null;
    const ts = r.timestamp;
    const cs = r.indicators.quote[0].close;
    const out: ChartPoint[] = [];
    for (let i = 0; i < ts.length; i++) {
      const c = cs[i];
      if (c != null && Number.isFinite(c)) out.push({ t: ts[i], c });
    }
    return out.length > 0 ? out : null;
  } catch {
    return null;
  }
}

function closestClose(
  chart: ChartPoint[],
  targetEpoch: number,
  maxDiffDays = 14,
): number | null {
  if (chart.length === 0) return null;
  let best = 0;
  let min = Math.abs(chart[0].t - targetEpoch);
  for (let i = 1; i < chart.length; i++) {
    const d = Math.abs(chart[i].t - targetEpoch);
    if (d < min) {
      min = d;
      best = i;
    }
  }
  if (min > maxDiffDays * 86400) return null;
  return chart[best].c;
}

function mean(xs: number[]): number {
  return xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length;
}

function stddev(xs: number[]): number {
  if (xs.length === 0) return 0;
  const m = mean(xs);
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)));
}

function pearson(xs: number[], ys: number[]): number {
  if (xs.length !== ys.length || xs.length < 3) return 0;
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

async function main() {
  console.log("# ConvictionScore v4.1+v4.2 Backtest");
  console.log(`_Generated ${new Date().toISOString().slice(0, 10)} by scripts/backtest-conviction.ts_`);
  console.log("");

  // Collect all tickers ever traded by a tracked manager (this is the
  // score-eligible universe — same filter getHistoricalTopBuys uses).
  const allTickers = new Set<string>();
  for (const m of ALL_MOVES) allTickers.add(m.ticker.toUpperCase());
  console.log(`Score-eligible universe: **${allTickers.size}** tickers`);
  console.log("");

  // Fetch SPY baseline + every ticker (throttled)
  const universe = [...allTickers];
  const symbols = ["SPY", ...universe];
  console.log(`Fetching ${symbols.length} price series from Yahoo (2y daily)...`);
  const charts = new Map<string, ChartPoint[]>();
  let fetchedOk = 0;
  let fetchedFail = 0;

  // Simple throttled fan-out: 8 at a time, small delay between batches.
  const batchSize = 8;
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    const results = await Promise.all(batch.map((s) => fetchYahooChart(s)));
    for (let j = 0; j < batch.length; j++) {
      const s = batch[j];
      const c = results[j];
      if (c && c.length > 0) {
        charts.set(s, c);
        fetchedOk++;
      } else {
        fetchedFail++;
      }
    }
    if (i + batchSize < symbols.length) await new Promise((r) => setTimeout(r, 150));
  }
  console.log(`Fetched: ${fetchedOk} OK, ${fetchedFail} failed/skipped`);
  console.log("");

  const spy = charts.get("SPY");
  if (!spy) {
    console.error("SPY baseline unavailable — cannot compute benchmark. Aborting.");
    process.exit(1);
  }
  const spyEnd = spy[spy.length - 1].c;

  // Per-quarter analysis
  type Row = { ticker: string; score: number; ret: number; spyRet: number; alpha: number };
  const allRows: Row[] = [];

  for (const q of HISTORICAL_QUARTERS) {
    const filedIso = QUARTER_FILED[q];
    const filedEpoch = Math.floor(new Date(filedIso).getTime() / 1000);
    const rows: Row[] = [];

    const spyStart = closestClose(spy, filedEpoch);
    const spyRet =
      spyStart && spyEnd ? ((spyEnd - spyStart) / spyStart) * 100 : 0;

    for (const t of universe) {
      const c = charts.get(t);
      if (!c) continue;
      const start = closestClose(c, filedEpoch);
      if (!start) continue;
      const end = c[c.length - 1].c;
      if (!end) continue;
      const ret = ((end - start) / start) * 100;
      const alpha = ret - spyRet;

      const scoreObj = getConvictionAtQuarter(t, q);
      // Score 0 = no signal (no buys at that quarter); exclude noise.
      if (scoreObj.score === 0 && scoreObj.buyerCount === 0 && scoreObj.sellerCount === 0) continue;

      const row = { ticker: t, score: scoreObj.score, ret, spyRet, alpha };
      rows.push(row);
      allRows.push(row);
    }

    // Per-quarter stats
    const scores = rows.map((r) => r.score);
    const rets = rows.map((r) => r.ret);
    const alphas = rows.map((r) => r.alpha);
    const r_ret = pearson(scores, rets);
    const r_alpha = pearson(scores, alphas);

    // Top-10 BUY vs bottom-10 SELL performance
    const sortedByScore = [...rows].sort((a, b) => b.score - a.score);
    const topBuys = sortedByScore.slice(0, 10);
    const topSells = [...rows].sort((a, b) => a.score - b.score).slice(0, 10);
    const topBuysMean = mean(topBuys.map((r) => r.ret));
    const topBuysAlpha = mean(topBuys.map((r) => r.alpha));
    const topSellsMean = mean(topSells.map((r) => r.ret));
    const topSellsAlpha = mean(topSells.map((r) => r.alpha));
    const buysHitRate = topBuys.filter((r) => r.alpha > 0).length / Math.max(1, topBuys.length);
    const sellsHitRate = topSells.filter((r) => r.alpha < 0).length / Math.max(1, topSells.length);

    console.log(`## ${q} (filed ${filedIso}, held ${Math.round((spy[spy.length - 1].t - filedEpoch) / 86400)} days)`);
    console.log("");
    console.log(`- Tickers scored + priced: **${rows.length}**`);
    console.log(`- SPY return over window: **${spyRet.toFixed(2)}%**`);
    console.log(`- Pearson r(score, return):     ${r_ret.toFixed(3)}`);
    console.log(`- Pearson r(score, alpha):      ${r_alpha.toFixed(3)}`);
    console.log("");
    console.log(`### Top-10 BUY vs SELL`);
    console.log(`| group | mean return | mean alpha | hit-rate |`);
    console.log(`|---|---:|---:|---:|`);
    console.log(`| top-10 BUY (highest score) | ${topBuysMean.toFixed(1)}% | ${topBuysAlpha > 0 ? "+" : ""}${topBuysAlpha.toFixed(1)}% | ${(buysHitRate * 100).toFixed(0)}% positive alpha |`);
    console.log(`| top-10 SELL (lowest score) | ${topSellsMean.toFixed(1)}% | ${topSellsAlpha > 0 ? "+" : ""}${topSellsAlpha.toFixed(1)}% | ${(sellsHitRate * 100).toFixed(0)}% negative alpha |`);
    console.log(`| delta BUY − SELL | ${(topBuysMean - topSellsMean).toFixed(1)}pt | ${(topBuysAlpha - topSellsAlpha).toFixed(1)}pt | — |`);
    console.log("");
  }

  // Aggregate across quarters
  console.log(`## Aggregate (all ${HISTORICAL_QUARTERS.length} quarters pooled)`);
  const scores = allRows.map((r) => r.score);
  const rets = allRows.map((r) => r.ret);
  const alphas = allRows.map((r) => r.alpha);
  console.log("");
  console.log(`- Total (ticker, quarter) pairs: **${allRows.length}**`);
  console.log(`- Pearson r(score, return):     ${pearson(scores, rets).toFixed(3)}`);
  console.log(`- Pearson r(score, alpha):      ${pearson(scores, alphas).toFixed(3)}`);
  console.log(`- Mean return overall:          ${mean(rets).toFixed(1)}%`);
  console.log(`- Mean alpha overall:           ${mean(alphas).toFixed(1)}%`);
  console.log("");

  // Score bucket analysis
  console.log("### Score bucket performance");
  const buckets: Array<{ label: string; min: number; max: number }> = [
    { label: "Strong sell (≤ -30)", min: -100, max: -30 },
    { label: "Sell (-29..-10)", min: -29, max: -10 },
    { label: "Weak sell (-9..-1)", min: -9, max: -1 },
    { label: "Neutral (0)", min: 0, max: 0 },
    { label: "Weak buy (1..9)", min: 1, max: 9 },
    { label: "Buy (10..29)", min: 10, max: 29 },
    { label: "Strong buy (≥ 30)", min: 30, max: 100 },
  ];
  console.log(`| bucket | N | mean return | mean alpha | hit-rate (alpha > 0) |`);
  console.log(`|---|---:|---:|---:|---:|`);
  for (const b of buckets) {
    const g = allRows.filter((r) => r.score >= b.min && r.score <= b.max);
    const hr = g.length === 0 ? 0 : g.filter((r) => r.alpha > 0).length / g.length;
    const mr = g.length === 0 ? 0 : mean(g.map((r) => r.ret));
    const ma = g.length === 0 ? 0 : mean(g.map((r) => r.alpha));
    console.log(`| ${b.label} | ${g.length} | ${mr.toFixed(1)}% | ${ma > 0 ? "+" : ""}${ma.toFixed(1)}% | ${(hr * 100).toFixed(0)}% |`);
  }
  console.log("");

  // Verdict
  const topDecile = [...allRows].sort((a, b) => b.score - a.score).slice(0, Math.floor(allRows.length / 10));
  const botDecile = [...allRows].sort((a, b) => a.score - b.score).slice(0, Math.floor(allRows.length / 10));
  const topAlpha = mean(topDecile.map((r) => r.alpha));
  const botAlpha = mean(botDecile.map((r) => r.alpha));
  const overallR = pearson(scores, alphas);

  console.log(`## Verdict`);
  console.log("");
  console.log(`- **Top-decile alpha:** ${topAlpha > 0 ? "+" : ""}${topAlpha.toFixed(1)}%`);
  console.log(`- **Bottom-decile alpha:** ${botAlpha > 0 ? "+" : ""}${botAlpha.toFixed(1)}%`);
  console.log(`- **Decile spread:** ${(topAlpha - botAlpha).toFixed(1)}pt`);
  console.log(`- **Correlation r(score, alpha):** ${overallR.toFixed(3)}`);
  console.log("");
  if (Math.abs(overallR) < 0.1) {
    console.log("⚠️  **r < 0.1 → signal indistinguishable from noise over this window.** Model needs further calibration OR sample size is too small (N=${allRows.length}). Don't stake filter UIs on the current score.");
  } else if (overallR >= 0.3) {
    console.log("✓ **r ≥ 0.3 → meaningful predictive signal.** Score is fit for ranking in overview/filter UIs.");
  } else if (overallR >= 0.15) {
    console.log("◐ **0.15 ≤ r < 0.3 → modest signal.** Useful for tail-ranking (top-decile vs bottom-decile clearly separates), weaker for middle-rank granularity.");
  } else if (overallR > 0) {
    console.log("◌ **0 < r < 0.15 → very weak positive signal.** Directionally right but decile spread will carry most of the information; middle-rank ordering is noise.");
  } else {
    console.log("❌ **r < 0 → inverse signal over this window.** Either the model is wrong or this window's forward returns are idiosyncratic. Investigate before shipping score-based UIs.");
  }
  console.log("");
  console.log("---");
  console.log("Method + code: scripts/backtest-conviction.ts. Data: Yahoo Finance v8 chart API, 2y daily closes, fetched at script runtime.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
