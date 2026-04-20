// Pure math helpers for the recommender backtest — zero data imports so
// client bundles that only need the math functions don't pull in the 12MB
// ALL_MOVES / conviction / managers graph via lib/backtest.ts.
//
// Server-side build code imports from lib/backtest (getBacktestQuarters etc.);
// client runtime imports from THIS file.

import type { Quarter } from "./moves-types";

export type BacktestQuarter = {
  quarter: Quarter;
  label: string;
  filedAt: string;
  filedAtEpoch: number;
  topBuys: ConvictionScoreLite[];
};

/** Minimal ConvictionScore shape BacktestProof actually reads at runtime.
 * Avoids importing the full ConvictionScore type from lib/conviction (which
 * imports the data graph). Keep in sync with conviction.ConvictionScore. */
export type ConvictionScoreLite = {
  ticker: string;
  score: number;
  action: "BUY" | "SELL" | "HOLD";
  quarter: Quarter;
  [key: string]: unknown;
};

export type RealizedReturn = {
  ticker: string;
  startPrice: number;
  currentPrice: number;
  returnPct: number;
  daysHeld: number;
  beatBenchmark: boolean;
};

/** Compute realized return from a chart series + a target start epoch. */
export function computeRealizedReturn(
  chart: { t: number; c: number }[],
  startEpoch: number
): { startPrice: number; currentPrice: number; returnPct: number; daysHeld: number } | null {
  if (!chart || chart.length === 0) return null;

  let startIdx = 0;
  let minDiff = Math.abs(chart[0].t - startEpoch);
  for (let i = 1; i < chart.length; i++) {
    const diff = Math.abs(chart[i].t - startEpoch);
    if (diff < minDiff) {
      minDiff = diff;
      startIdx = i;
    }
  }

  if (minDiff > 14 * 86400) return null;

  const startPrice = chart[startIdx].c;
  const currentPrice = chart[chart.length - 1].c;
  if (!startPrice || !currentPrice) return null;

  const returnPct = ((currentPrice - startPrice) / startPrice) * 100;
  const daysHeld = Math.round((chart[chart.length - 1].t - chart[startIdx].t) / 86400);

  return { startPrice, currentPrice, returnPct, daysHeld };
}

/** Annualize a return given days held. */
export function annualizedReturn(returnPct: number, daysHeld: number): number {
  if (daysHeld <= 0) return 0;
  const years = daysHeld / 365;
  return (Math.pow(1 + returnPct / 100, 1 / years) - 1) * 100;
}
