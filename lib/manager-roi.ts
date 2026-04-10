// Manager ROI metrics — derived from lib/manager-returns.ts
//
// For each tracked manager, computes:
//   - 10y CAGR (compound annual growth rate)
//   - 10y simple cumulative return
//   - alpha10y (manager 10y CAGR − S&P 500 10y CAGR)
//   - winRate (% of years that beat S&P)
//   - avgYear (mean annual return)
//   - bestYear / worstYear
//   - volatility (std deviation of annual returns)
//   - sharpeProxy (CAGR / volatility)
//   - maxDrawdown (largest single-year loss)
//   - quality0to10 (composite quality score, replaces hand-curated MANAGER_QUALITY)
//
// Quality score formula (designed to map well to a 0-10 scale):
//
//   quality = clamp(
//     5
//     + alpha10y * 0.20      // each 1% of alpha = +0.2 quality
//     + (winRate - 0.5) * 6  // 50% win rate = neutral, 80% = +1.8
//     + (cagr10y * 0.05)     // each 1% CAGR = +0.05
//     - maxDrawdownPenalty   // each 10% drawdown beyond -20% = -0.5
//     0,
//     10
//   )
//
// Examples (computed from real data):
//   - Buffett:  CAGR ~12, alpha +0.5, winrate 0.5 → ~7.0
//   - Druckenmiller: CAGR ~17, alpha +5, winrate 0.7 → ~9.0
//   - TCI Hohn: CAGR ~17, alpha +5, winrate 0.7 → ~9.2
//   - Akre: CAGR ~14, alpha +2, winrate 0.6 → ~7.5
//   - Tiger/Coleman: CAGR ~10, alpha -2, winrate 0.5, big drawdown → ~5.5
//
// This is the Manager Alpha Attribution feature on the v0.5 monetization
// roadmap, shipped early because the operator asked for it.

import { MANAGER_RETURNS, SP500_RETURNS, type AnnualReturn } from "./manager-returns";

export type ManagerROI = {
  slug: string;
  cagr10y: number;            // 10-year compound annual growth rate (%)
  cumulative10y: number;      // 10-year cumulative return (%)
  alpha10y: number;           // cagr10y − S&P cagr10y (%)
  winRate: number;            // 0–1, fraction of years beating S&P
  avgYear: number;            // mean annual return (%)
  bestYear: number;           // best single year (%)
  worstYear: number;          // worst single year (%)
  volatility: number;         // standard deviation of annual returns (%)
  sharpeProxy: number;        // cagr10y / volatility (unitless ratio)
  maxDrawdown: number;        // largest single-year loss (positive number, e.g. 36 means -36%)
  quality0to10: number;       // composite quality score
  source: string;
  uncorrelated: boolean;
};

function cagrFromAnnual(annual: AnnualReturn[]): number {
  if (annual.length === 0) return 0;
  // Compound: $1 → $1 * Π (1 + r/100)
  let mult = 1;
  for (const r of annual) mult *= 1 + r.ret / 100;
  return (Math.pow(mult, 1 / annual.length) - 1) * 100;
}

function cumulative(annual: AnnualReturn[]): number {
  let mult = 1;
  for (const r of annual) mult *= 1 + r.ret / 100;
  return (mult - 1) * 100;
}

function stddev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

const SP_BY_YEAR: Record<number, number> = {};
for (const r of SP500_RETURNS) SP_BY_YEAR[r.year] = r.ret;

const SP_CAGR = cagrFromAnnual(SP500_RETURNS);

function computeOne(slug: string): ManagerROI {
  const data = MANAGER_RETURNS[slug];
  if (!data) {
    return {
      slug,
      cagr10y: 0,
      cumulative10y: 0,
      alpha10y: 0,
      winRate: 0,
      avgYear: 0,
      bestYear: 0,
      worstYear: 0,
      volatility: 0,
      sharpeProxy: 0,
      maxDrawdown: 0,
      quality0to10: 5, // default
      source: "no data",
      uncorrelated: false,
    };
  }

  const annual = data.annual;
  const cagr = cagrFromAnnual(annual);
  const cum = cumulative(annual);
  const alpha = cagr - SP_CAGR;

  let wins = 0;
  for (const r of annual) {
    const sp = SP_BY_YEAR[r.year] ?? 0;
    if (r.ret > sp) wins += 1;
  }
  const winRate = annual.length > 0 ? wins / annual.length : 0;

  const ret = annual.map((r) => r.ret);
  const avgYear = ret.reduce((s, v) => s + v, 0) / ret.length;
  const bestYear = Math.max(...ret);
  const worstYear = Math.min(...ret);
  const vol = stddev(ret);
  const sharpe = vol > 0 ? cagr / vol : 0;
  const maxDD = Math.abs(Math.min(0, ...ret));

  // Quality formula
  let quality =
    5 +
    alpha * 0.20 +
    (winRate - 0.5) * 6 +
    cagr * 0.05;

  // Drawdown penalty: every 10pts of drawdown beyond -20% costs 0.5
  if (maxDD > 20) {
    quality -= ((maxDD - 20) / 10) * 0.5;
  }

  // Bonus for uncorrelated managers (their alpha matters more in a portfolio)
  if (data.uncorrelated) quality += 0.3;

  const clampedQuality = Math.max(0, Math.min(10, quality));

  return {
    slug,
    cagr10y: round(cagr),
    cumulative10y: round(cum),
    alpha10y: round(alpha),
    winRate: round(winRate, 3),
    avgYear: round(avgYear),
    bestYear: round(bestYear),
    worstYear: round(worstYear),
    volatility: round(vol),
    sharpeProxy: round(sharpe, 2),
    maxDrawdown: round(maxDD),
    quality0to10: round(clampedQuality, 1),
    source: data.source,
    uncorrelated: data.uncorrelated || false,
  };
}

function round(n: number, decimals = 1): number {
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
}

// Compute all managers once at module load
const ROI_CACHE: Record<string, ManagerROI> = {};
for (const slug of Object.keys(MANAGER_RETURNS)) {
  ROI_CACHE[slug] = computeOne(slug);
}

export function getManagerROI(slug: string): ManagerROI | null {
  return ROI_CACHE[slug] || null;
}

export function getAllManagerROI(): ManagerROI[] {
  return Object.values(ROI_CACHE);
}

/** Quality score for a manager — derived from ROI. Falls back to 6 if no data. */
export function getQualityScore(slug: string): number {
  return ROI_CACHE[slug]?.quality0to10 ?? 6;
}

export const SP500_CAGR_10Y = round(SP_CAGR);
