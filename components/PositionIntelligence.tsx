// Position Intelligence panel — composite component for /investor/[slug].
//
// Surfaces position-classification + summary stats + per-position trend
// readout. All factual / descriptive — no verdict labels. Pivot-A safe.

import Link from "next/link";
import TickerLink from "@/components/TickerLink";
import {
  classifyManagerPositions,
  positionSizeSummary,
  positionTrendSummary,
  type PositionClassification,
} from "@/lib/position-classification";

const SIZE_COLORS: Record<string, string> = {
  core: "bg-brand/15 text-brand border-brand/30",
  significant: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  starter: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  small: "bg-muted/15 text-muted border-muted/30",
};

const TREND_BADGE: Record<string, { label: string; cls: string }> = {
  building: { label: "↑ building", cls: "text-emerald-400" },
  trimming: { label: "↓ trimming", cls: "text-amber-400" },
  "holding-steady": { label: "→ steady", cls: "text-muted" },
  new: { label: "★ new", cls: "text-brand" },
  "exit-pending": { label: "× exit pending", cls: "text-rose-400" },
};

export default function PositionIntelligence({
  managerSlug,
  managerName,
  topN = 15,
}: {
  managerSlug: string;
  managerName: string;
  topN?: number;
}) {
  const positions = classifyManagerPositions(managerSlug);
  if (positions.length === 0) return null;

  const sizeSum = positionSizeSummary(managerSlug);
  const trendSum = positionTrendSummary(managerSlug);
  const visible = positions.slice(0, topN);

  return (
    <section className="mt-12 rounded-2xl border-2 border-border bg-panel p-6 md:p-7">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
        Position intelligence · 13F-derived
      </div>
      <h2 className="text-2xl font-bold mb-4">
        How {managerName.split(" ").slice(-1)} is sized + moving
      </h2>
      <p className="text-sm text-muted mb-6 leading-relaxed max-w-3xl">
        Every position classified by both portfolio weight (size bucket)
        and recent move activity (trend bucket). A 22% Apple position
        building +5% this quarter signals different intent than a 1%
        starter trimmed in half. Descriptive analysis of 13F filings —
        not recommendation.
      </p>

      {/* Summary stats: size + trend distributions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <SummaryStat label="Core" value={sizeSum.core} subtext="≥10% positions" />
        <SummaryStat label="Significant" value={sizeSum.significant} subtext="3–10%" />
        <SummaryStat label="Starter" value={sizeSum.starter} subtext="1–3%" />
        <SummaryStat label="Small" value={sizeSum.small} subtext="<1%" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-7 text-xs">
        <TrendStat label="Building" value={trendSum.building} color="text-emerald-400" />
        <TrendStat label="Steady" value={trendSum["holding-steady"]} color="text-muted" />
        <TrendStat label="Trimming" value={trendSum.trimming} color="text-amber-400" />
        <TrendStat label="New" value={trendSum.new} color="text-brand" />
        <TrendStat label="Exit pending" value={trendSum["exit-pending"]} color="text-rose-400" />
      </div>

      {/* Top-N position table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-bg/30">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-panel/50">
              <th className="text-left p-3 font-semibold">Position</th>
              <th className="text-right p-3 font-semibold">% portfolio</th>
              <th className="text-left p-3 font-semibold hidden sm:table-cell">Size</th>
              <th className="text-left p-3 font-semibold">Trend</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => (
              <tr key={p.ticker} className="border-b border-border/40 last:border-b-0 hover:bg-bg/50">
                <td className="p-3">
                  <TickerLink symbol={p.ticker} className="font-semibold text-brand hover:underline">
                    {p.ticker}
                  </TickerLink>
                  <div className="text-xs text-muted mt-0.5 truncate max-w-[200px]">{p.name}</div>
                </td>
                <td className="p-3 text-right tabular-nums font-semibold">{p.pctPortfolio.toFixed(1)}%</td>
                <td className="p-3 hidden sm:table-cell">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-xs font-semibold border ${SIZE_COLORS[p.size]}`}
                  >
                    {p.size}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`text-xs font-semibold ${TREND_BADGE[p.trend].cls}`}>
                    {TREND_BADGE[p.trend].label}
                  </span>
                </td>
              </tr>
            ))}
            {positions.length > topN && (
              <tr>
                <td colSpan={4} className="p-3 text-center text-xs text-muted">
                  Showing top {topN} of {positions.length} positions.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted leading-relaxed">
        <strong className="text-text">How to read:</strong> Size bucket
        from current 13F-filed portfolio weight. Trend bucket from the
        last 2 quarters of move activity (net delta &gt;5% in either
        direction = building/trimming; new = first-appearance this quarter;
        exit pending = trimmed &gt;50% last quarter). Data lag: SEC 13F
        filings are reported 45 days after quarter-end. This is
        descriptive intelligence — not investment advice.
      </p>
    </section>
  );
}

function SummaryStat({
  label,
  value,
  subtext,
}: {
  label: string;
  value: number;
  subtext: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-bg/40 p-3 text-center">
      <div className="text-2xl font-bold text-text tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted mt-1">{label}</div>
      <div className="text-[10px] text-muted/70 mt-0.5">{subtext}</div>
    </div>
  );
}

function TrendStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-bg/40 p-2 text-center">
      <div className={`text-lg font-bold tabular-nums ${color}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted mt-0.5">{label}</div>
    </div>
  );
}
