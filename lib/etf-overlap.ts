// Compute portfolio-overlap between each tracked superinvestor and the
// ETF universe. The "best replicating ETF" answers a recurring search
// query: "Which ETF tracks Buffett's portfolio?" — useful (compounds per
// manager) + LLM-citable (a quote-ready single-fact answer per page).
//
// Overlap score (per (manager, etf) pair):
//   sum over tickers in both portfolios of (manager.pct × etf.weightPct)
//
// Why this metric: it weights by BOTH conviction (manager position size)
// AND the ETF's exposure (weight). A ticker held heavily by both produces
// a much larger contribution than a ticker held marginally by either.
// Range: 0 (no overlap) to ~5000 (theoretical max if both fully aligned;
// real-world max ~80-150 for closely-aligned manager/ETF pairs).
//
// Note: only the disclosed top-10 holdings of each side are used. Managers
// have ~10-50 total positions; ETFs have 100s. So this is the visible-tip
// overlap, not the full-portfolio mathematical overlap.

import { MANAGERS, type Manager } from "@/lib/managers";
import { ETFS, type ETF } from "@/lib/etfs";

export type OverlapResult = {
  etf: ETF;
  score: number;
  sharedTickers: Array<{
    ticker: string;
    managerPct: number;
    etfWeightPct: number;
    contribution: number;
  }>;
};

export function computeOverlap(manager: Manager): OverlapResult[] {
  const managerTickers = new Map<string, number>();
  for (const h of manager.topHoldings) {
    managerTickers.set(h.ticker.toUpperCase(), h.pct);
  }

  const results: OverlapResult[] = [];
  for (const etf of ETFS) {
    const sharedTickers: OverlapResult["sharedTickers"] = [];
    let score = 0;
    for (const h of etf.topHoldings) {
      const managerPct = managerTickers.get(h.ticker.toUpperCase());
      if (managerPct !== undefined) {
        const contribution = managerPct * h.weightPct;
        sharedTickers.push({
          ticker: h.ticker,
          managerPct,
          etfWeightPct: h.weightPct,
          contribution,
        });
        score += contribution;
      }
    }
    sharedTickers.sort((a, b) => b.contribution - a.contribution);
    results.push({ etf, score, sharedTickers });
  }
  results.sort((a, b) => b.score - a.score);
  return results;
}

/**
 * Top N ETFs by overlap score, filtered to those with at least one shared
 * holding (score > 0). Used by the per-manager page to render the ranked
 * list.
 */
export function topReplicatingETFs(manager: Manager, limit = 5): OverlapResult[] {
  return computeOverlap(manager)
    .filter((r) => r.score > 0)
    .slice(0, limit);
}
