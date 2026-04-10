// Server component — reads from lib/manager-roi.ts
// Shows the realized track record block on /investor/[slug] pages.
import { getManagerROI, SP500_CAGR_10Y } from "@/lib/manager-roi";

export default function ManagerROICard({ slug }: { slug: string }) {
  const roi = getManagerROI(slug);
  if (!roi || roi.cagr10y === 0) return null;

  const beats = roi.alpha10y >= 0;
  const headlineColor = beats ? "text-emerald-400" : "text-rose-400";

  return (
    <div className="rounded-2xl border border-border bg-panel overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-baseline justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-brand font-semibold mb-1">
            Realized 10-year track record
          </div>
          <div className="text-xs text-muted">{roi.source}</div>
        </div>
        <a
          href="/leaderboard"
          className="text-xs text-brand hover:underline font-semibold whitespace-nowrap"
        >
          See leaderboard →
        </a>
      </div>

      {/* Hero stats */}
      <div className="px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-border">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">10y CAGR</div>
          <div className="text-3xl font-bold tabular-nums text-text mt-1">{roi.cagr10y.toFixed(1)}%</div>
          <div className="text-[11px] text-dim mt-0.5">net of fees</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">Alpha vs S&amp;P</div>
          <div className={`text-3xl font-bold tabular-nums mt-1 ${headlineColor}`}>
            {roi.alpha10y >= 0 ? "+" : ""}
            {roi.alpha10y.toFixed(1)}%
          </div>
          <div className="text-[11px] text-dim mt-0.5">vs {SP500_CAGR_10Y}% benchmark</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">Win rate</div>
          <div className="text-3xl font-bold tabular-nums text-text mt-1">{(roi.winRate * 100).toFixed(0)}%</div>
          <div className="text-[11px] text-dim mt-0.5">years beating S&amp;P</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">Quality score</div>
          <div className="text-3xl font-bold tabular-nums text-brand mt-1">{roi.quality0to10.toFixed(1)}</div>
          <div className="text-[11px] text-dim mt-0.5">computed 0–10</div>
        </div>
      </div>

      {/* Detail row */}
      <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <Stat label="Best year" value={`${roi.bestYear >= 0 ? "+" : ""}${roi.bestYear.toFixed(0)}%`} positive />
        <Stat label="Worst year" value={`${roi.worstYear.toFixed(0)}%`} negative />
        <Stat label="Cumulative 10y" value={`${(roi.cumulative10y / 100 + 1).toFixed(1)}×`} />
        <Stat label="Volatility" value={`${roi.volatility.toFixed(0)}%`} />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  positive,
  negative,
}: {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  const color = positive ? "text-emerald-400" : negative ? "text-rose-400" : "text-text";
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">{label}</div>
      <div className={`text-lg font-bold tabular-nums mt-0.5 ${color}`}>{value}</div>
    </div>
  );
}
