// Server component. Groups a manager's holdings by sector and renders a bar
// chart + table. Pure data derivation from holdings[].pct + SECTOR_MAP.
// Filling a core Dataroma parity gap: portfolio diversification at a glance.
import { SECTOR_MAP } from "@/lib/tickers";

type Holding = { ticker: string; pct: number };

// Ordered palette — consistent colors per sector across the site.
const SECTOR_COLORS: Record<string, string> = {
  Technology: "#60a5fa",
  Financials: "#34d399",
  Healthcare: "#f472b6",
  "Consumer Discretionary": "#fbbf24",
  "Consumer Staples": "#a78bfa",
  Communication: "#f87171",
  Industrials: "#fb923c",
  Energy: "#facc15",
  Materials: "#22d3ee",
  Utilities: "#818cf8",
  "Real Estate": "#c084fc",
  Other: "#94a3b8",
};

function sectorOf(ticker: string): string {
  return SECTOR_MAP[ticker.toUpperCase()] || "Other";
}

export default function SectorBreakdown({
  holdings,
  label = "Sector breakdown",
}: {
  holdings: Holding[];
  label?: string;
}) {
  if (!holdings || holdings.length === 0) return null;

  // Aggregate pct by sector
  const buckets: Record<string, { pct: number; count: number; tickers: string[] }> = {};
  for (const h of holdings) {
    const s = sectorOf(h.ticker);
    if (!buckets[s]) buckets[s] = { pct: 0, count: 0, tickers: [] };
    buckets[s].pct += h.pct;
    buckets[s].count += 1;
    buckets[s].tickers.push(h.ticker);
  }
  const total = Object.values(buckets).reduce((s, b) => s + b.pct, 0) || 1;
  const rows = Object.entries(buckets)
    .map(([sector, b]) => ({
      sector,
      pct: b.pct,
      sharePct: (b.pct / total) * 100,
      count: b.count,
      tickers: b.tickers,
      color: SECTOR_COLORS[sector] || SECTOR_COLORS.Other,
    }))
    .sort((a, b) => b.sharePct - a.sharePct);

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">{label}</h2>
      <p className="text-muted text-sm mb-6 max-w-2xl">
        How the top {holdings.length} positions are diversified across {rows.length} sector
        {rows.length > 1 ? "s" : ""}. Weighted by stated portfolio percentage.
      </p>

      {/* Stacked bar — full width, divided by sector */}
      <div className="rounded-2xl border border-border bg-panel p-5 overflow-hidden">
        <div
          className="flex h-4 w-full rounded-full overflow-hidden bg-bg"
          role="img"
          aria-label={`Sector allocation: ${rows
            .map((r) => `${r.sector} ${r.sharePct.toFixed(0)}%`)
            .join(", ")}`}
        >
          {rows.map((r) => (
            <div
              key={r.sector}
              style={{ width: `${r.sharePct}%`, backgroundColor: r.color }}
              title={`${r.sector} — ${r.sharePct.toFixed(1)}%`}
            />
          ))}
        </div>

        {/* Legend / table */}
        <div className="mt-5 divide-y divide-border">
          {rows.map((r) => (
            <div
              key={r.sector}
              className="flex items-center gap-3 py-2.5 text-sm first:pt-0 last:pb-0"
            >
              <span
                className="inline-block w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: r.color }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="text-text font-semibold">{r.sector}</div>
                <div className="text-xs text-dim mt-0.5 truncate">
                  {r.count} position{r.count > 1 ? "s" : ""} · {r.tickers.slice(0, 8).join(", ")}
                  {r.tickers.length > 8 ? ` +${r.tickers.length - 8}` : ""}
                </div>
              </div>
              <div className="text-right tabular-nums shrink-0">
                <div className="text-text font-semibold">{r.sharePct.toFixed(1)}%</div>
                <div className="text-xs text-dim">{r.pct.toFixed(1)}% of AUM</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
