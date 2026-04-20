import { getBuyback, formatBuybackAmount } from "@/lib/buybacks";

// Server component — conditionally renders a compact buyback-activity card
// on a ticker page when that ticker has a tracked buyback program. Returns
// null when no program exists (v1 covers 10 top repurchasers). The card
// links to /buybacks/[ticker]/ for the full detail page — a cross-link that
// closes the HoldLens "who's buying and selling this stock" loop by adding
// the company-itself-as-buyer signal alongside 13F (institutional) and
// Form 4 (insider) activity. Zero client JS, zero network calls.

export default function BuybackSummary({ symbol }: { symbol: string }) {
  const p = getBuyback(symbol);
  if (!p) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-2">Buyback program</h2>
      <p className="text-muted text-sm mb-6">
        Tracked SEC disclosures — how aggressively {p.companyName} repurchases
        its own stock.
      </p>
      <a
        href={`/buybacks/${p.ticker}/`}
        className="block rounded-2xl border border-border bg-panel p-6 hover:border-brand/40 transition"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-dim mb-1">
              {p.latestFyLabel} repurchased
            </div>
            <div className="text-xl font-bold tabular-nums">
              {formatBuybackAmount(p.latestFyRepurchased)}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-dim mb-1">
              Buyback yield
            </div>
            <div className="text-xl font-bold tabular-nums text-emerald-400">
              {p.buybackYieldPct != null ? `${p.buybackYieldPct}%` : "—"}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-dim mb-1">
              Authorization
            </div>
            <div className="text-xl font-bold tabular-nums">
              {p.authorizationSize ? formatBuybackAmount(p.authorizationSize) : "—"}
            </div>
            {p.authDate && (
              <div className="text-[10px] text-dim mt-0.5">Approved {p.authDate}</div>
            )}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-dim mb-1">
              Est. remaining
            </div>
            <div className="text-xl font-bold tabular-nums">
              {p.authRemainingEstimate
                ? formatBuybackAmount(p.authRemainingEstimate)
                : "—"}
            </div>
          </div>
        </div>
        <div className="mt-4 text-xs text-brand">
          See full buyback dossier → {p.source.filingType} source cited
        </div>
      </a>
    </section>
  );
}
