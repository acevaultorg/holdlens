import { getMovesByManager, QUARTER_LABELS, QUARTERS, type Quarter, type Move } from "@/lib/moves";
import SinceFilingDelta from "@/components/SinceFilingDelta";

// Cap per-quarter rows rendered. Broad-portfolio managers (Greenblatt's
// Magic Formula = ~3,000 positions/filing, polen-capital ~240) otherwise
// blow the static export HTML past 4 MB per page, which then fails CF Pages
// wrangler upload (~56 MB EPIPE cap batched across files) AND hurts LCP/CLS
// for users who just want to see the significant moves. Top-50-by-magnitude
// covers the actual signal — tiny positions with rounding-error delta are
// noise for a retail reader.
const MAX_MOVES_PER_QUARTER = 50;

export default function InvestorMoves({ slug }: { slug: string }) {
  const all = getMovesByManager(slug);
  if (all.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-panel p-6 text-sm text-dim">
        No tracked 13F moves for this manager yet. Check back after the next filing deadline.
      </div>
    );
  }

  // Group by quarter
  const byQuarter: Record<string, Move[]> = {};
  for (const mv of all) {
    if (!byQuarter[mv.quarter]) byQuarter[mv.quarter] = [];
    byQuarter[mv.quarter].push(mv);
  }
  const orderedQuarters = (QUARTERS as readonly string[]).filter((q) => byQuarter[q]?.length);

  return (
    <div className="space-y-6">
      {orderedQuarters.map((q) => {
        const moves = byQuarter[q];
        const buys = moves.filter((m) => m.action === "new" || m.action === "add");
        const sells = moves.filter((m) => m.action === "trim" || m.action === "exit");
        // Take top N by absolute deltaPct magnitude, buys-first via the
        // downstream sort. The card header still shows the TRUE total buy/
        // sell counts above so the cap is explicit, not hidden.
        const visibleMoves = moves
          .slice()
          .sort((a, b) => Math.abs(b.deltaPct ?? 0) - Math.abs(a.deltaPct ?? 0))
          .slice(0, MAX_MOVES_PER_QUARTER);
        const hiddenCount = moves.length - visibleMoves.length;
        return (
          <div key={q} className="rounded-2xl border border-border bg-panel overflow-hidden">
            <div className="flex items-baseline justify-between px-5 py-4 border-b border-border">
              <div className="text-sm font-bold text-text">{QUARTER_LABELS[q as Quarter]}</div>
              <div className="text-xs text-dim">
                <span className="text-emerald-400">{buys.length} buy{buys.length !== 1 ? "s" : ""}</span>
                {" · "}
                <span className="text-rose-400">{sells.length} sell{sells.length !== 1 ? "s" : ""}</span>
              </div>
            </div>

            <table className="w-full text-sm">
              <thead className="text-dim text-[10px] uppercase tracking-wider">
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-2">Ticker</th>
                  <th className="text-left px-5 py-2">Activity</th>
                  <th className="text-right px-5 py-2 hidden md:table-cell">Share change</th>
                  <th className="text-right px-5 py-2">% portfolio</th>
                </tr>
              </thead>
              <tbody>
                {visibleMoves
                  .slice()
                  .sort((a, b) => {
                    // Buys first, then by |deltaPct| desc
                    const aIsBuy = a.action === "new" || a.action === "add";
                    const bIsBuy = b.action === "new" || b.action === "add";
                    if (aIsBuy !== bIsBuy) return aIsBuy ? -1 : 1;
                    return Math.abs(b.deltaPct ?? 0) - Math.abs(a.deltaPct ?? 0);
                  })
                  .map((mv, i) => {
                    const isBuy = mv.action === "new" || mv.action === "add";
                    const color = isBuy ? "text-emerald-400" : "text-rose-400";
                    const label =
                      mv.action === "new"
                        ? "Buy (new)"
                        : mv.action === "add"
                        ? mv.deltaPct != null
                          ? `Add ${mv.deltaPct}%`
                          : "Add"
                        : mv.action === "trim"
                        ? mv.deltaPct != null
                          ? `Reduce ${Math.abs(mv.deltaPct)}%`
                          : "Reduce"
                        : "Sell (exit)";
                    return (
                      <tr key={`${mv.ticker}-${i}`} className="border-b border-border last:border-0 align-top">
                        <td className="px-5 py-3 font-mono font-semibold">
                          <a href={`/ticker/${mv.ticker}`} className="text-brand hover:underline">
                            {mv.ticker}
                          </a>
                        </td>
                        <td className={`px-5 py-3 font-semibold ${color}`}>
                          {label}
                          {/* Live P&L context since this specific filing —
                              range=2y covers all tracked quarters (Q1 2024 back). */}
                          <div className="text-[10.5px] font-normal opacity-80 mt-0.5">
                            <SinceFilingDelta
                              ticker={mv.ticker}
                              filedAt={mv.filedAt}
                              compact
                              range="2y"
                            />
                          </div>
                          {mv.note && (
                            <div className="text-[11px] text-muted font-normal mt-0.5 italic max-w-md">
                              {mv.note}
                            </div>
                          )}
                        </td>
                        <td className={`px-5 py-3 text-right tabular-nums hidden md:table-cell ${color}`}>
                          {mv.shareChange != null
                            ? `${mv.shareChange > 0 ? "+" : ""}${formatNumber(mv.shareChange)}`
                            : "—"}
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums text-muted">
                          {mv.portfolioImpactPct != null ? `${mv.portfolioImpactPct.toFixed(2)}%` : "—"}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {hiddenCount > 0 && (
              <div className="px-5 py-3 border-t border-border text-[11px] text-dim">
                Showing top {MAX_MOVES_PER_QUARTER} by position change · {hiddenCount.toLocaleString()} smaller moves hidden
              </div>
            )}
          </div>
        );
      })}
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
