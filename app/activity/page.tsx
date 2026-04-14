import type { Metadata } from "next";
import { getAllMovesEnriched, QUARTER_LABELS, QUARTERS, type Quarter } from "@/lib/moves";
import { MANAGER_QUALITY } from "@/lib/signals";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Activity feed — every 13F move by the best investors",
  description:
    "Every tracked buy, add, trim, and exit from the best portfolio managers in the world. Grouped by quarter, ranked by manager quality.",
  openGraph: { title: "Activity — HoldLens" },
};

export default function ActivityPage() {
  const all = getAllMovesEnriched();

  // Group by quarter, then sort within quarter by manager quality × action weight
  const byQuarter: Record<string, typeof all> = {};
  for (const mv of all) {
    if (!byQuarter[mv.quarter]) byQuarter[mv.quarter] = [];
    byQuarter[mv.quarter].push(mv);
  }
  for (const q of Object.keys(byQuarter)) {
    byQuarter[q].sort((a, b) => {
      const qa = MANAGER_QUALITY[a.managerSlug] ?? 6;
      const qb = MANAGER_QUALITY[b.managerSlug] ?? 6;
      const wa = a.action === "new" || a.action === "exit" ? 2 : 1;
      const wb = b.action === "new" || b.action === "exit" ? 2 : 1;
      return qb * wb - qa * wa;
    });
  }
  const orderedQuarters = (QUARTERS as readonly string[]).filter((q) => byQuarter[q]?.length);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Activity feed
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        Every move, every quarter.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-10">
        Every tracked buy, add, trim, and exit by the best portfolio managers in the world. Ranked within each quarter
        by manager quality — so you see the highest-conviction moves first.
      </p>

      <AdSlot format="horizontal" />

      <div className="space-y-12">
        {orderedQuarters.map((q) => (
          <section key={q}>
            <div className="flex items-baseline justify-between mb-4 border-b border-border pb-3">
              <h2 className="text-xl font-bold">{QUARTER_LABELS[q as Quarter]}</h2>
              <div className="text-xs text-dim">{byQuarter[q].length} moves tracked</div>
            </div>

            <div className="space-y-2">
              {byQuarter[q].map((mv, i) => {
                const isBuy = mv.action === "new" || mv.action === "add";
                const color = isBuy ? "text-emerald-400" : "text-rose-400";
                const accent = isBuy ? "border-l-emerald-400/50" : "border-l-rose-400/50";
                const quality = MANAGER_QUALITY[mv.managerSlug] ?? 6;

                return (
                  <div
                    key={`${mv.managerSlug}-${mv.ticker}-${mv.quarter}-${i}`}
                    className={`rounded-xl border border-border border-l-4 ${accent} bg-panel p-4 hover:bg-panel/60 transition`}
                  >
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap ${color}`}>
                          {mv.action === "new"
                            ? "BUY NEW"
                            : mv.action === "add"
                            ? `ADD ${mv.deltaPct != null ? `+${mv.deltaPct}%` : ""}`
                            : mv.action === "trim"
                            ? `REDUCE ${mv.deltaPct != null ? `${mv.deltaPct}%` : ""}`
                            : "EXIT"}
                        </div>
                        <a
                          href={`/ticker/${mv.ticker}`}
                          className="font-mono font-bold text-brand hover:underline"
                        >
                          {mv.ticker}
                        </a>
                        <div className="text-sm text-text truncate max-w-[40%]">
                          {mv.name || ""}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <a
                          href={`/investor/${mv.managerSlug}`}
                          className="text-text font-semibold hover:text-brand transition"
                        >
                          {mv.managerName}
                        </a>
                        {quality >= 9 && (
                          <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider text-brand bg-brand/10 border border-brand/30 rounded px-1.5 py-0.5">
                            Tier 1
                          </span>
                        )}
                      </div>
                    </div>
                    {mv.note && (
                      <div className="mt-2 text-xs text-muted italic">{mv.note}</div>
                    )}
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-dim tabular-nums">
                      {mv.shareChange != null && (
                        <span>
                          Share change:{" "}
                          <span className={color}>
                            {mv.shareChange > 0 ? "+" : ""}
                            {formatNumber(mv.shareChange)}
                          </span>
                        </span>
                      )}
                      {mv.portfolioImpactPct != null && (
                        <span>
                          Position: <span className="text-text">{mv.portfolioImpactPct.toFixed(2)}%</span> of portfolio
                        </span>
                      )}
                      <span>{mv.managerFund}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function formatNumber(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return n.toLocaleString("en-US");
}
