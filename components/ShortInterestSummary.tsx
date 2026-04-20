import { getShortPosition, formatShares, formatPct } from "@/lib/short-interest";

// Server component — conditionally renders a compact short-interest card on
// a ticker page when that ticker is in the FINRA short-interest seed.
// Returns null when the ticker isn't tracked (v1 covers 18 most-shorted
// U.S. equities). Mirrors the BuybackSummary cross-link pattern. Zero
// client JS, zero network calls.

export default function ShortInterestSummary({ symbol }: { symbol: string }) {
  const p = getShortPosition(symbol);
  if (!p) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-2">Short interest</h2>
      <p className="text-muted text-sm mb-6">
        FINRA bi-monthly disclosure — how heavily {p.companyName} is sold short.
      </p>
      <a
        href={`/short-interest/${p.ticker}/`}
        className="block rounded-2xl border border-border bg-panel p-6 hover:border-brand/40 transition"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-dim mb-1">
              % of float
            </div>
            <div className="text-xl font-bold tabular-nums text-rose-400">
              {p.shortInterestPctFloat.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-dim mb-1">
              Shares short
            </div>
            <div className="text-xl font-bold tabular-nums">
              {formatShares(p.shortInterestShares)}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-dim mb-1">
              Days to cover
            </div>
            <div className="text-xl font-bold tabular-nums text-amber-400">
              {p.daysToCover.toFixed(1)}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-dim mb-1">
              Δ vs prior
            </div>
            <div
              className={`text-xl font-bold tabular-nums ${
                p.changeVsPriorPct >= 0
                  ? "text-rose-400"
                  : "text-emerald-400"
              }`}
            >
              {formatPct(p.changeVsPriorPct)}
            </div>
          </div>
        </div>
        <div className="mt-4 text-xs text-brand">
          See full short-interest dossier → settled {p.settlementDate}
        </div>
      </a>
    </section>
  );
}
