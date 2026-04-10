// Realized-return computation for the recommender backtest.
//
// For each historical quarter, we know:
//   - which stocks the model would have recommended (via getHistoricalTopBuys)
//   - the date the 13F was filed (when an investor could have acted)
//
// To compute realized return, we need:
//   - The price on/near the filing date (start)
//   - The current live price (end)
//
// Yahoo Finance v8 chart endpoint with range=1y returns daily closes for the
// last year — we use the close closest to the filing date as the entry price.
//
// Returns are computed CLIENT-SIDE inside BacktestProof component because
// price data is async/live. This module exposes pure helpers.

import { getHistoricalTopBuys, type ConvictionScore } from "./conviction";
import { QUARTER_LABELS, QUARTER_FILED, type Quarter } from "./moves";

export type BacktestQuarter = {
  quarter: Quarter;
  label: string;
  filedAt: string; // ISO date
  filedAtEpoch: number; // unix seconds
  topBuys: ConvictionScore[];
};

// v0.23: backtest starts at Q4 2024 because the model needs ≥3 prior quarters
// of trend data to function. Earlier quarters (Q1-Q3 2024) exist in the dataset
// but are only used as CONTEXT for the trend engine — we don't backtest them
// directly because they themselves lack enough prior quarters to score fairly.
const HISTORICAL_QUARTERS: Quarter[] = [
  "2024-Q4",
  "2025-Q1",
  "2025-Q2",
  "2025-Q3",
];

/** All quarters we backtest, with their top picks pre-computed at build time. */
export function getBacktestQuarters(topN = 5): BacktestQuarter[] {
  return HISTORICAL_QUARTERS.map((q) => {
    const filedAt = QUARTER_FILED[q];
    const filedAtEpoch = Math.floor(new Date(filedAt).getTime() / 1000);
    return {
      quarter: q,
      label: QUARTER_LABELS[q],
      filedAt,
      filedAtEpoch,
      topBuys: getHistoricalTopBuys(q, topN),
    };
  });
}

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

  // Find close price closest to startEpoch (chart is daily, sorted by time)
  let startIdx = 0;
  let minDiff = Math.abs(chart[0].t - startEpoch);
  for (let i = 1; i < chart.length; i++) {
    const diff = Math.abs(chart[i].t - startEpoch);
    if (diff < minDiff) {
      minDiff = diff;
      startIdx = i;
    }
  }

  // If the closest point is more than 14 days away, we don't have data for that period
  if (minDiff > 14 * 86400) return null;

  const startPrice = chart[startIdx].c;
  const currentPrice = chart[chart.length - 1].c;
  if (!startPrice || !currentPrice) return null;

  const returnPct = ((currentPrice - startPrice) / startPrice) * 100;
  const daysHeld = Math.round((chart[chart.length - 1].t - chart[startIdx].t) / 86400);

  return {
    startPrice,
    currentPrice,
    returnPct,
    daysHeld,
  };
}

/** Annualize a return given days held. */
export function annualizedReturn(returnPct: number, daysHeld: number): number {
  if (daysHeld <= 0) return 0;
  const years = daysHeld / 365;
  return (Math.pow(1 + returnPct / 100, 1 / years) - 1) * 100;
}
