// SectorAccumulationHeatmap — visualizes which SECTORS the tracked
// superinvestor cohort is collectively accumulating vs trimming, quarter
// by quarter. Rows = sectors. Columns = quarters. Color intensity =
// net portfolio-impact-percentage across all 30 tracked managers.
//
// Reads from MERGED_MOVES (curated + EDGAR-derived). Maps each ticker
// to a sector via SECTOR_MAP in lib/tickers.ts. Aggregates net delta
// per (sector, quarter) cell.
//
// Pivot-A safe: pure descriptive aggregation of public 13F filing moves.
// No verdict labels, no per-stock recommendations.

import { MERGED_MOVES, QUARTERS, QUARTER_LABELS, type Quarter } from "@/lib/moves";
import { SECTOR_MAP } from "@/lib/tickers";

const SECTORS_ORDER = [
  "Technology",
  "Financials",
  "Consumer",
  "Healthcare",
  "Energy",
  "Industrials",
  "Communication",
  "Materials",
  "Utilities",
  "Real Estate",
  "Other",
] as const;
type Sector = (typeof SECTORS_ORDER)[number];

function sectorFor(ticker: string): Sector {
  const s = SECTOR_MAP[ticker?.toUpperCase()];
  if (!s) return "Other";
  if (SECTORS_ORDER.includes(s as Sector)) return s as Sector;
  // Coarse remap: anything not in our canonical list → Other
  return "Other";
}

function colorForDelta(delta: number, max: number): string {
  if (Math.abs(delta) < 0.1) return "bg-muted/5";
  const intensity = Math.min(1, Math.abs(delta) / max);
  // Stepped intensity buckets (5 levels)
  const step = Math.ceil(intensity * 5);
  if (delta > 0) {
    return [
      "bg-emerald-500/5",
      "bg-emerald-500/15",
      "bg-emerald-500/25",
      "bg-emerald-500/40",
      "bg-emerald-500/60",
    ][step - 1];
  }
  return [
    "bg-rose-500/5",
    "bg-rose-500/15",
    "bg-rose-500/25",
    "bg-rose-500/40",
    "bg-rose-500/60",
  ][step - 1];
}

export default function SectorAccumulationHeatmap() {
  // Build sector × quarter matrix from MERGED_MOVES.
  const matrix: Record<Sector, Record<Quarter, number>> = {} as Record<
    Sector,
    Record<Quarter, number>
  >;
  for (const s of SECTORS_ORDER) {
    matrix[s] = {} as Record<Quarter, number>;
    for (const q of QUARTERS) {
      matrix[s][q] = 0;
    }
  }

  for (const mv of MERGED_MOVES) {
    const sector = sectorFor(mv.ticker);
    const impact = mv.portfolioImpactPct ?? 0;
    if (mv.action === "trim" || mv.action === "exit") {
      matrix[sector][mv.quarter as Quarter] -= Math.abs(impact);
    } else {
      matrix[sector][mv.quarter as Quarter] += impact;
    }
  }

  // Find max magnitude for color scaling
  let max = 0;
  for (const s of SECTORS_ORDER) {
    for (const q of QUARTERS) {
      max = Math.max(max, Math.abs(matrix[s][q]));
    }
  }
  if (max < 1) max = 1; // avoid div-by-zero

  // Compute row totals + show sectors with non-trivial activity first
  const rowsWithTotals = SECTORS_ORDER.map((s) => {
    const total = QUARTERS.reduce((sum, q) => sum + matrix[s][q], 0);
    const activity = QUARTERS.reduce(
      (sum, q) => sum + Math.abs(matrix[s][q]),
      0,
    );
    return { sector: s, total, activity };
  })
    .filter((r) => r.activity > 0.1)
    .sort((a, b) => b.activity - a.activity);

  if (rowsWithTotals.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border-2 border-border bg-panel p-6 md:p-7">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
        Sector accumulation heatmap
      </div>
      <h2 className="text-2xl font-bold mb-3">
        Where the cohort is collectively positioning, quarter by quarter
      </h2>
      <p className="text-sm text-muted mb-6 leading-relaxed max-w-3xl">
        Each cell is the NET portfolio-impact across all 30 tracked
        superinvestors for that sector in that quarter. Green = net
        accumulating; red = net trimming; intensity scales with
        magnitude. Sectors with no activity are hidden. Descriptive
        aggregate of 13F moves — not investment advice.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-2 font-semibold sticky left-0 bg-panel z-10">
                Sector
              </th>
              {QUARTERS.map((q) => (
                <th key={q} className="text-center p-2 font-semibold text-muted whitespace-nowrap">
                  {QUARTER_LABELS[q].replace("20", "")}
                </th>
              ))}
              <th className="text-right p-2 font-semibold">Net</th>
            </tr>
          </thead>
          <tbody>
            {rowsWithTotals.map((row) => (
              <tr key={row.sector} className="border-b border-border/30 last:border-b-0">
                <td className="p-2 font-semibold sticky left-0 bg-panel z-10">{row.sector}</td>
                {QUARTERS.map((q) => {
                  const delta = matrix[row.sector][q];
                  const cls = colorForDelta(delta, max);
                  return (
                    <td
                      key={q}
                      className={`p-2 text-center tabular-nums ${cls}`}
                      title={`${row.sector} · ${QUARTER_LABELS[q]}: ${delta >= 0 ? "+" : ""}${delta.toFixed(1)}% portfolio impact`}
                    >
                      {Math.abs(delta) < 0.1 ? "·" : (delta > 0 ? "+" : "") + delta.toFixed(1)}
                    </td>
                  );
                })}
                <td
                  className={`p-2 text-right tabular-nums font-bold ${
                    row.total > 0 ? "text-emerald-400" : row.total < 0 ? "text-rose-400" : "text-muted"
                  }`}
                >
                  {(row.total >= 0 ? "+" : "") + row.total.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-3 items-center text-xs text-muted">
        <span>Net delta:</span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block w-4 h-4 rounded bg-rose-500/60 border border-rose-500/40" />
          Strong trimming
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block w-4 h-4 rounded bg-muted/10 border border-border" />
          Neutral
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block w-4 h-4 rounded bg-emerald-500/60 border border-emerald-500/40" />
          Strong accumulation
        </span>
      </div>

      <p className="mt-5 text-xs text-muted leading-relaxed">
        <strong className="text-text">How to read:</strong> Each cell
        aggregates the portfolio-impact-percentage across all 30 tracked
        managers&apos; moves in that sector that quarter. +5.0 means net
        accumulation equivalent to 5% of cohort portfolio capacity; -3.2
        means net trimming of 3.2%. Sector classification is per
        SECTOR_MAP; tickers outside the canonical list are grouped under
        Other. Data lag: 45 days post-quarter (SEC 13F).
      </p>
    </section>
  );
}
