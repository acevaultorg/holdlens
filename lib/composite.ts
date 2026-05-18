// The HoldLens Composite — a data-display basket reflecting which tickers
// tracked superinvestors collectively own most heavily.
//
// IMPORTANT: this is NOT a recommendation, advice, or "optimal portfolio."
// It is a deterministic descriptive aggregate of public SEC 13F filings.
// Pivot A compliance: no verdict labels, no forward-looking claims, no
// hidden assumptions. Per I-43, /composite cannot be framed as "best ROI"
// or "ultimate" — those are verdict-encoded recommendations that require
// licensed credentials we do not hold.
//
// Methodology:
//   1. Take every tracked stock with ConvictionScore ≥ +20 AND ≥2 buyers
//   2. Sort by score descending
//   3. Walk sorted list; accept each ticker IF its sector hasn't hit the
//      25% sector cap (risk-aware diversification — no sector dominates)
//   4. Stop at TARGET_POSITIONS (30) or candidates exhausted
//   5. Equal-weight each selected position (1/30 = 3.33% each)
//
// Rebalance cadence: quarterly (when new 13F filings land). Each new
// quarter's 13F-HR filings → new ConvictionScores → new sort → new basket.
//
// What we DO NOT do (compliance discipline):
//   - Project forward returns
//   - Claim "optimal" or "highest ROI"
//   - Suggest readers buy this basket
//   - Rebalance daily/hourly (would imply real-time advice — RIA territory)
//   - Use leverage, derivatives, shorts, or any complexity beyond long-only equity

import { getAllConvictionScores } from "./conviction";
import type { ConvictionScore } from "./conviction";
import { LATEST_QUARTER, QUARTER_LABELS, QUARTER_FILED } from "./moves";

export const COMPOSITE_TARGET_POSITIONS = 30;
export const COMPOSITE_SECTOR_CAP_PCT = 25;
export const COMPOSITE_MIN_SCORE = 20;
export const COMPOSITE_MIN_BUYERS = 2;

export type CompositeHolding = ConvictionScore & {
  weight_pct: number;
  rank_in_composite: number;
};

export type CompositeSnapshot = {
  quarter: string;
  quarter_label: string;
  rebalance_date: string;
  next_rebalance_estimate: string;
  holdings: CompositeHolding[];
  sector_breakdown: Array<{ sector: string; weight_pct: number; ticker_count: number }>;
  total_positions: number;
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

  // 1. Filter to candidates with meaningful accumulation signal
  const candidates = all
    .filter((s) => s.score >= COMPOSITE_MIN_SCORE && s.buyerCount >= COMPOSITE_MIN_BUYERS)
    .sort((a, b) => b.score - a.score);

  // 2. Walk sorted list, accept with sector cap discipline
  const selected: CompositeHolding[] = [];
  const sectorWeights = new Map<string, number>();
  const sectorCounts = new Map<string, number>();
  const positionWeight = 100 / COMPOSITE_TARGET_POSITIONS;

  for (const c of candidates) {
    if (selected.length >= COMPOSITE_TARGET_POSITIONS) break;
    const sec = c.sector || SECTOR_FALLBACK;
    const currentSectorWeight = sectorWeights.get(sec) ?? 0;
    if (currentSectorWeight + positionWeight > COMPOSITE_SECTOR_CAP_PCT) continue;
    selected.push({
      ...c,
      weight_pct: positionWeight,
      rank_in_composite: selected.length + 1,
    });
    sectorWeights.set(sec, currentSectorWeight + positionWeight);
    sectorCounts.set(sec, (sectorCounts.get(sec) ?? 0) + 1);
  }

  const sectorBreakdown = Array.from(sectorWeights.entries())
    .map(([sector, weight_pct]) => ({
      sector,
      weight_pct,
      ticker_count: sectorCounts.get(sector) ?? 0,
    }))
    .sort((a, b) => b.weight_pct - a.weight_pct);

  const avg_score =
    selected.reduce((s, h) => s + h.score, 0) / Math.max(selected.length, 1);
  const buyer_count_avg =
    selected.reduce((s, h) => s + h.buyerCount, 0) / Math.max(selected.length, 1);

  return {
    quarter: LATEST_QUARTER,
    quarter_label: QUARTER_LABELS[LATEST_QUARTER],
    rebalance_date: QUARTER_FILED[LATEST_QUARTER] || "2026-05-15",
    next_rebalance_estimate: nextQuarterRebalanceEstimate(LATEST_QUARTER),
    holdings: selected,
    sector_breakdown: sectorBreakdown,
    total_positions: selected.length,
    avg_score: Math.round(avg_score * 10) / 10,
    top_score: selected[0]?.score ?? 0,
    bottom_score: selected[selected.length - 1]?.score ?? 0,
    buyer_count_avg: Math.round(buyer_count_avg * 10) / 10,
    generated_at: new Date().toISOString(),
  };
}
