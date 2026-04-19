import type { Metadata } from "next";
import LiveQuote from "@/components/LiveQuote";
import SinceFilingDelta from "@/components/SinceFilingDelta";
import CsvExportButton from "@/components/CsvExportButton";
import TrendBadge from "@/components/TrendBadge";
import TickerLogo from "@/components/TickerLogo";
import MethodologyDisclaimer from "@/components/MethodologyDisclaimer";
import { getBuySignals, ratingLabel } from "@/lib/signals";
import { formatSignedScore } from "@/lib/conviction";
import { QUARTER_LABELS, LATEST_QUARTER, QUARTER_FILED } from "@/lib/moves";

// v4.3 honest-relabel (2026-04-19) — see .claude/state/CONVICTION_BACKTEST.md.
// Page re-positioned from "what to buy" (predictive) to "what tracked
// superinvestors are buying" (tracker).

export const metadata: Metadata = {
  title: "What tracked superinvestors are buying — heaviest 13F adds",
  description:
    "The stocks with the heaviest smart-money BUY conviction across 30 tracked portfolio managers' latest 13F filings. Smart-money positioning tracker, not investment advice.",
  openGraph: {
    title: "What tracked superinvestors are buying",
    description: "Ranked by aggregate BUY conviction across 30 of the best portfolio managers' latest 13F filings.",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: { card: "summary_large_image", title: "Heaviest smart-money buys — HoldLens" },
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
        Heaviest smart-money buys · {quarterLabel}
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        What tracked superinvestors <span className="text-emerald-400">are buying</span>.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        The stocks with the heaviest aggregate BUY conviction across 30 tracked portfolio managers&apos;
        latest 13F filings. Ranked on a single signed score:{" "}
        <span className="text-emerald-400 font-semibold">+100 = strongest tracked-consensus BUY</span>,{" "}
        <span className="text-rose-400 font-semibold">−100 = strongest tracked-consensus SELL</span>.
        This page shows the positive side. A ticker appears on exactly one list.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-6">
        The score aggregates smart-money consensus, insider buys, manager track record,
        multi-quarter trend streaks, position concentration, and an under-the-radar bonus — minus
        dissent from sellers and a crowding penalty. Full method at{" "}
        <a href="/methodology" className="underline">/methodology</a>, including the 2026 backtest
        over 221 ticker-quarter pairs.
      </p>

      <MethodologyDisclaimer />
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
                    <TickerLogo symbol={s.ticker} size={40} className="mt-1" />
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
                        <TrendBadge ticker={s.ticker} size="md" />
                      </div>
                      <div className="text-xs text-muted mt-1">
                        <LiveQuote symbol={s.ticker} size="sm" refreshMs={0} />
                        <SinceFilingDelta
                          ticker={s.ticker}
                          filedAt={QUARTER_FILED[LATEST_QUARTER]}
                          leadingSeparator
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${ratingColor}`}>
                      {rating.label} BUY · {formatSignedScore(s.score)}
                    </div>
                    <div className="text-xs text-dim mt-1.5">
                      Score {formatSignedScore(s.score)} / +100
                      {s.buyerCount > 0 && ` · ${s.buyerCount} manager${s.buyerCount > 1 ? "s" : ""} buying`}
                    </div>
                  </div>
                </div>

                {/* Buyers list */}
                <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
                  {s.buyers.length === 0 ? (
                    <span className="text-xs text-dim italic">
                      No fresh buys this quarter — score reflects historical conviction, insider activity, and trend streaks.
                    </span>
                  ) : (
                    s.buyers.map((b) => (
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
                    ))
                  )}
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
