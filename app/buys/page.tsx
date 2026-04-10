import type { Metadata } from "next";
import LiveQuote from "@/components/LiveQuote";
import CsvExportButton from "@/components/CsvExportButton";
import { getBuySignals, ratingLabel } from "@/lib/signals";
import { QUARTER_LABELS, LATEST_QUARTER } from "@/lib/moves";

export const metadata: Metadata = {
  title: "What to buy — recommendation model from the best investors",
  description:
    "HoldLens buy signals ranked by a multi-factor recommendation model: manager quality, consensus, conviction, fresh money. Real 13F data from the best portfolio managers in the world.",
  openGraph: {
    title: "What to buy — smart money signals",
    description: "Ranked buy signals from the best portfolio managers in the world.",
  },
  twitter: { card: "summary_large_image", title: "What to buy — HoldLens" },
};

export default function BuysPage() {
  const signals = getBuySignals();
  const quarterLabel = QUARTER_LABELS[LATEST_QUARTER];

  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `What the smart money is buying — ${quarterLabel}`,
    itemListElement: signals.slice(0, 25).map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${s.ticker} — ${s.name}`,
    })),
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-4">
        Buy signals · {quarterLabel}
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        What to <span className="text-emerald-400">buy</span>.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        Stocks being bought by the best portfolio managers in the world this quarter — ranked by our multi-factor
        recommendation model.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-6">
        Score combines <span className="text-text font-semibold">manager quality</span> (70%),
        <span className="text-text font-semibold"> consensus</span> across managers (20%),
        <span className="text-text font-semibold"> fresh money</span> (new positions weighted higher, 10%), and
        a <span className="text-text font-semibold">concentration bonus</span> when a buyer commits &gt;10% of their portfolio.
      </p>
      <div className="mb-10">
        <CsvExportButton
          filename={`holdlens-buys-${LATEST_QUARTER}.csv`}
          label="Download buy signals CSV"
          rows={signals.map((s, i) => ({
            rank: i + 1,
            ticker: s.ticker,
            name: s.name,
            sector: s.sector || "",
            score: s.score,
            buyer_count: s.buyerCount,
            buyers: s.buyers.map((b) => b.managerName).join("; "),
            fresh_money_share: s.freshMoneyShare.toFixed(2),
            concentration_bonus: s.concentrationBonus,
          }))}
        />
      </div>

      {signals.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel p-10 text-center text-muted">
          No buy signals for {quarterLabel} yet.
        </div>
      ) : (
        <div className="space-y-4">
          {signals.map((s, i) => {
            const rating = ratingLabel(s.score);
            const ratingColor =
              rating.color === "emerald"
                ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
                : rating.color === "amber"
                ? "text-brand bg-brand/10 border-brand/30"
                : "text-muted bg-panel border-border";

            return (
              <a
                key={s.ticker}
                href={`/signal/${s.ticker}`}
                className="block rounded-2xl border border-border bg-panel p-5 hover:border-brand/40 transition group"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="text-2xl font-bold text-dim tabular-nums w-10 shrink-0">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="font-mono text-xl font-bold text-brand group-hover:underline">
                          {s.ticker}
                        </div>
                        <div className="text-text">{s.name}</div>
                        {s.sector && (
                          <span className="text-[10px] uppercase tracking-wider text-dim border border-border rounded px-1.5 py-0.5">
                            {s.sector}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted mt-1">
                        <LiveQuote symbol={s.ticker} size="sm" refreshMs={0} />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${ratingColor}`}>
                      {rating.label} · {s.score}
                    </div>
                    <div className="text-xs text-dim mt-1.5">
                      {s.buyerCount} manager{s.buyerCount > 1 ? "s" : ""} buying
                    </div>
                  </div>
                </div>

                {/* Buyers list */}
                <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
                  {s.buyers.map((b) => (
                    <span
                      key={b.managerSlug}
                      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
                        b.action === "new"
                          ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
                          : "text-muted bg-panel border-border"
                      }`}
                    >
                      {b.action === "new" ? "★ NEW" : "+"} {b.managerName.split(" ").slice(-1)[0]}
                      {b.deltaPct != null && b.action === "add" && (
                        <span className="text-dim">({b.deltaPct > 0 ? "+" : ""}{b.deltaPct}%)</span>
                      )}
                    </span>
                  ))}
                </div>
              </a>
            );
          })}
        </div>
      )}

      <div className="mt-16 rounded-2xl border border-border bg-panel p-8">
        <h2 className="text-xl font-bold mb-2">Want these signals in your inbox?</h2>
        <p className="text-muted text-sm mb-6">
          One email per 13F filing season. Top 10 buy signals ranked by the recommendation model.
        </p>
      </div>

      <p className="text-xs text-dim mt-8">
        Recommendation scores are derived from publicly disclosed 13F filings. Past positioning by these managers
        is not a guarantee of future performance. <a href="/methodology" className="underline">Methodology</a>.
        Not investment advice.
      </p>
    </div>
  );
}
