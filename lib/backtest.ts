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

// Pure math helpers + client-safe types live in backtest-math.ts so client
// bundles (BacktestProof) don't pull the 12MB conviction/moves/managers graph.
export { computeRealizedReturn, annualizedReturn } from "./backtest-math";
export type { RealizedReturn } from "./backtest-math";

export type BacktestQuarter = {
  quarter: Quarter;
  label: string;
  filedAt: string;
  filedAtEpoch: number;
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

// computeRealizedReturn + annualizedReturn + RealizedReturn live in
// ./backtest-math and are re-exported above.
