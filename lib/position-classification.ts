// Position-sizing intelligence. Classifies each holding in an investor's
// portfolio along two axes: SIZE (relative to portfolio) and TREND
// (multi-quarter delta).
//
// Why this matters: "Buffett owns Apple" is descriptive. "Apple is 22% of
// Buffett's portfolio and he added 5% last quarter after 3 quarters of
// trimming" is intelligence. The same factual data, much more useful
// for the reader trying to read the position.
//
// All classifications are descriptive (size buckets, trend buckets) —
// no recommendations, no verdict labels. Pivot-A-safe.

import { getEdgarHoldings } from "@/lib/edgar-data";
import { getMovesByManager } from "@/lib/moves";
import type { Quarter } from "@/lib/moves";

export type PositionSize =
  | "core"        // ≥10% of portfolio — top conviction
  | "significant" // 3-10%
  | "starter"     // 1-3%
  | "small"       // <1%
  ;

export type PositionTrend =
  | "building"        // net adds over last 2 quarters
  | "trimming"        // net trims over last 2 quarters
  | "holding-steady"  // ≤5% deltaPct over last 2 quarters
  | "new"             // appeared this quarter, no prior history
  | "exit-pending"    // trimmed >50% in last quarter
  ;

export type PositionClassification = {
  ticker: string;
  name: string;
  pctPortfolio: number;
  size: PositionSize;
  trend: PositionTrend;
  // Plain-language label combining size + trend
  // e.g., "Core position, building"; "Starter, new this quarter"
  label: string;
  // How many quarters this position has been held continuously (best-effort
  // from move log; defaults to 1 if no prior move record).
  quartersHeld: number;
};

function classifySize(pct: number): PositionSize {
  if (pct >= 10) return "core";
  if (pct >= 3) return "significant";
  if (pct >= 1) return "starter";
  return "small";
}

function trendFromMoves(
  ticker: string,
  managerSlug: string,
): { trend: PositionTrend; quartersHeld: number } {
  if (!ticker || typeof ticker !== "string") {
    return { trend: "holding-steady", quartersHeld: 1 };
  }
  const sym = ticker.toUpperCase();
  const moves = getMovesByManager(managerSlug)
    .filter((mv) =>
      typeof mv.ticker === "string" && mv.ticker.length > 0 &&
      mv.ticker.toUpperCase() === sym,
    )
    .sort((a, b) => (a.quarter as string).localeCompare(b.quarter as string));

  if (moves.length === 0) {
    return { trend: "holding-steady", quartersHeld: 1 };
  }

  const latest = moves[moves.length - 1];
  const last2 = moves.slice(-2);
  const netDelta = last2.reduce((s, m) => s + (m.deltaPct ?? 0), 0);

  let trend: PositionTrend;
  if (latest.action === "new") {
    trend = "new";
  } else if (latest.action === "exit") {
    trend = "exit-pending";
  } else if (Math.abs(netDelta) <= 5) {
    trend = "holding-steady";
  } else if (netDelta > 0) {
    trend = "building";
  } else {
    trend = "trimming";
  }

  // Quarters held = move-set length, but new/exit at start makes it less
  // meaningful; cap at moves.length.
  const quartersHeld = Math.max(1, moves.length);
  return { trend, quartersHeld };
}

const TREND_LABEL: Record<PositionTrend, string> = {
  "building": "building",
  "trimming": "trimming",
  "holding-steady": "holding steady",
  "new": "new this quarter",
  "exit-pending": "exit pending",
};

const SIZE_LABEL: Record<PositionSize, string> = {
  "core": "Core position",
  "significant": "Significant position",
  "starter": "Starter position",
  "small": "Small position",
};

function combinedLabel(size: PositionSize, trend: PositionTrend): string {
  if (trend === "new") return `${SIZE_LABEL[size]}, new this quarter`;
  if (trend === "exit-pending") return `${SIZE_LABEL[size]}, exit pending`;
  return `${SIZE_LABEL[size]}, ${TREND_LABEL[trend]}`;
}

/**
 * Classify all current holdings for a manager.
 * Returns positions sorted by portfolio weight DESC.
 */
export function classifyManagerPositions(
  managerSlug: string,
): PositionClassification[] {
  const edgar = getEdgarHoldings(managerSlug);
  if (!edgar || !edgar.holdings) return [];

  return edgar.holdings
    .filter((h) => h.pct > 0 && h.ticker)
    .map((h) => {
      const size = classifySize(h.pct);
      const { trend, quartersHeld } = trendFromMoves(h.ticker, managerSlug);
      return {
        ticker: h.ticker,
        name: h.name,
        pctPortfolio: h.pct,
        size,
        trend,
        label: combinedLabel(size, trend),
        quartersHeld,
      };
    })
    .sort((a, b) => b.pctPortfolio - a.pctPortfolio);
}

/**
 * Aggregate counts by size bucket — used in summary panels.
 */
export function positionSizeSummary(
  managerSlug: string,
): { core: number; significant: number; starter: number; small: number; total: number } {
  const positions = classifyManagerPositions(managerSlug);
  const summary = { core: 0, significant: 0, starter: 0, small: 0, total: positions.length };
  for (const p of positions) {
    summary[p.size]++;
  }
  return summary;
}

/**
 * Aggregate counts by trend bucket — used in summary panels.
 */
export function positionTrendSummary(
  managerSlug: string,
): { building: number; trimming: number; "holding-steady": number; "new": number; "exit-pending": number; total: number } {
  const positions = classifyManagerPositions(managerSlug);
  const summary = {
    building: 0,
    trimming: 0,
    "holding-steady": 0,
    "new": 0,
    "exit-pending": 0,
    total: positions.length,
  };
  for (const p of positions) {
    summary[p.trend]++;
  }
  return summary;
}
