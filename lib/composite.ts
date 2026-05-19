// The Conviction — a data-display basket reflecting which tickers tracked
// superinvestors collectively accumulate most heavily, weighted by the
// intensity of that cross-manager accumulation.
//
// IMPORTANT: this is NOT a recommendation, advice, or "optimal portfolio."
// It is a deterministic descriptive aggregate of public SEC 13F filings.
// Pivot A compliance: no verdict labels, no forward-looking claims, no
// hidden assumptions. Per I-43, this page cannot be framed as "best ROI"
// or "ultimate" — those are verdict-encoded recommendations that require
// licensed credentials we do not hold.
//
// Methodology v2 (2026-05-19 — uses ALL available data):
//   1. Universe — every tracked ticker whose ConvictionScore is positive.
//      ConvictionScore already aggregates ALL 9 quarters of 13F data
//      (time-decayed 0.6^distance), with 6 signal layers per ticker:
//        a. Smart money — manager-quality × consensus weight
//        b. Contrarian — counter-flow detection
//        c. Insider — cross-checked Form 4 buyer agreement
//        d. Trend streak — multi-quarter compounding (3Q in a row >> 1Q)
//        e. Sector context — relative-to-peer-group accumulation
//        f. Prior-score memory — persistence vs new entries
//      No arbitrary min-buyer gate, no arbitrary score floor — positive
//      net-accumulation is the only entry criterion.
//   2. Sort by ConvictionScore descending.
//   3. Walk sorted list, accept each ticker IF its sector hasn't filled
//      the per-sector count cap (≤8 of 30 ≈ 27% — concentration control).
//   4. Stop at TARGET_POSITIONS (30) or when the universe is exhausted.
//   5. **Conviction-weighted sizing**: each holding's slot = its score
//      ÷ sum-of-selected-scores × 100. Higher conviction = larger slot.
//      Equal-weight reference also exposed (1 / N × 100) for comparison.
//
// Rebalance cadence: quarterly (when new 13F filings land). Each new
// quarter's 13F-HR filings → new ConvictionScores → new sort → new basket.
//
// What we DO NOT do (compliance discipline):
//   - Project forward returns (expectedReturnPct stays out of public JSON)
//   - Claim "optimal", "best", "highest ROI"
//   - Suggest readers buy this basket
//   - Rebalance daily/hourly (would imply real-time advice — RIA territory)
//   - Use leverage, derivatives, shorts, or any complexity beyond long-only equity

import { getAllConvictionScores } from "./conviction";
import type { ConvictionScore } from "./conviction";
import { LATEST_QUARTER, QUARTER_LABELS, QUARTER_FILED } from "./moves";

export const COMPOSITE_TARGET_POSITIONS = 30;
export const COMPOSITE_MAX_PER_SECTOR = 8; // ≤27% by count — concentration cap
export const COMPOSITE_MIN_SCORE = 1; // positive accumulation only

// Back-compat aliases (v2 methodology kept these names so existing imports/schemas
// don't break). Semantics:
//   - COMPOSITE_SECTOR_CAP_PCT: implied weight ceiling per sector under equal-weight
//     reference (~26.7% = 8/30). Real cap is count-based now (COMPOSITE_MAX_PER_SECTOR).
//   - COMPOSITE_MIN_BUYERS: legacy strict-buyer-floor. v2 uses ConvictionScore directly
//     (score signal already incorporates buyer agreement via 6 layers + time-decay),
//     so the standalone buyer-count floor is 0. Kept for downstream-doc reference.
export const COMPOSITE_SECTOR_CAP_PCT =
  Math.round((COMPOSITE_MAX_PER_SECTOR / COMPOSITE_TARGET_POSITIONS) * 100);
export const COMPOSITE_MIN_BUYERS = 0;

export type CompositeHolding = ConvictionScore & {
  weight_pct: number; // conviction-weighted (score / sum × 100)
  weight_equal_pct: number; // reference: 100 / N for comparison
  rank_in_composite: number;
};

export type CompositeSnapshot = {
  quarter: string;
  quarter_label: string;
  rebalance_date: string;
  next_rebalance_estimate: string;
  weighting_method: "conviction-weighted";
  holdings: CompositeHolding[];
  sector_breakdown: Array<{ sector: string; weight_pct: number; ticker_count: number }>;
  total_positions: number;
  universe_size: number; // number of positive-score tickers considered
  avg_score: number;
  top_score: number;
  bottom_score: number;
  buyer_count_avg: number;
  generated_at: string;
};

const SECTOR_FALLBACK = "Unclassified";

function nextQuarterRebalanceEstimate(currentQuarter: string): string {
  // 13F-HR deadlines: Q1 → May 15 · Q2 → Aug 14 · Q3 → Nov 14 · Q4 → Feb 14
  const map: Record<string, string> = {
    "2026-Q1": "2026-08-14 (Q2 2026 13F deadline)",
    "2025-Q4": "2026-05-15 (Q1 2026 13F deadline)",
    "2025-Q3": "2026-02-14 (Q4 2025 13F deadline)",
    "2025-Q2": "2025-11-14 (Q3 2025 13F deadline)",
    "2025-Q1": "2025-08-14 (Q2 2025 13F deadline)",
  };
  return map[currentQuarter] ?? "next 13F-HR filing deadline";
}

export function getComposite(): CompositeSnapshot {
  const all = getAllConvictionScores();

  // 1. Universe — every positive-score ticker (uses ALL 9 quarters via time-decay
  //    already baked into ConvictionScore). No arbitrary buyer-count or score-floor
  //    gate beyond "net-accumulation positive".
  const universe = all
    .filter((s) => s.score >= COMPOSITE_MIN_SCORE)
    .sort((a, b) => b.score - a.score);

  // 2. Walk sorted universe; greedy sector-count cap protects concentration.
  const sectorCounts = new Map<string, number>();
  const picked: ConvictionScore[] = [];
  for (const c of universe) {
    if (picked.length >= COMPOSITE_TARGET_POSITIONS) break;
    const sec = c.sector || SECTOR_FALLBACK;
    const count = sectorCounts.get(sec) ?? 0;
    if (count >= COMPOSITE_MAX_PER_SECTOR) continue;
    picked.push(c);
    sectorCounts.set(sec, count + 1);
  }

  // 3. Conviction-weighted sizing — slot ∝ score
  const totalScore = picked.reduce((s, h) => s + h.score, 0) || 1;
  const equalShare = 100 / Math.max(picked.length, 1);
  const holdings: CompositeHolding[] = picked.map((c, i) => ({
    ...c,
    weight_pct: Math.round(((c.score / totalScore) * 100) * 100) / 100,
    weight_equal_pct: Math.round(equalShare * 100) / 100,
    rank_in_composite: i + 1,
  }));

  // 4. Sector breakdown by aggregate WEIGHT (the live methodology)
  const sectorWeightMap = new Map<string, number>();
  const sectorTickerMap = new Map<string, number>();
  for (const h of holdings) {
    const sec = h.sector || SECTOR_FALLBACK;
    sectorWeightMap.set(sec, (sectorWeightMap.get(sec) ?? 0) + h.weight_pct);
    sectorTickerMap.set(sec, (sectorTickerMap.get(sec) ?? 0) + 1);
  }
  const sectorBreakdown = Array.from(sectorWeightMap.entries())
    .map(([sector, weight_pct]) => ({
      sector,
      weight_pct: Math.round(weight_pct * 100) / 100,
      ticker_count: sectorTickerMap.get(sector) ?? 0,
    }))
    .sort((a, b) => b.weight_pct - a.weight_pct);

  const avg_score = holdings.reduce((s, h) => s + h.score, 0) / Math.max(holdings.length, 1);
  const buyer_count_avg =
    holdings.reduce((s, h) => s + h.buyerCount, 0) / Math.max(holdings.length, 1);

  return {
    quarter: LATEST_QUARTER,
    quarter_label: QUARTER_LABELS[LATEST_QUARTER],
    rebalance_date: QUARTER_FILED[LATEST_QUARTER] || "2026-05-15",
    next_rebalance_estimate: nextQuarterRebalanceEstimate(LATEST_QUARTER),
    weighting_method: "conviction-weighted",
    holdings,
    sector_breakdown: sectorBreakdown,
    total_positions: holdings.length,
    universe_size: universe.length,
    avg_score: Math.round(avg_score * 10) / 10,
    top_score: holdings[0]?.score ?? 0,
    bottom_score: holdings[holdings.length - 1]?.score ?? 0,
    buyer_count_avg: Math.round(buyer_count_avg * 10) / 10,
    generated_at: new Date().toISOString(),
  };
}
