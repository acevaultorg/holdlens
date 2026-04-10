import type { Metadata } from "next";
import LiveQuote from "@/components/LiveQuote";
import CsvExportButton from "@/components/CsvExportButton";
import TrendBadge from "@/components/TrendBadge";
import AdSlot from "@/components/AdSlot";
import { getSellSignals, ratingLabel } from "@/lib/signals";
import { formatSignedScore } from "@/lib/conviction";
import { QUARTER_LABELS, LATEST_QUARTER } from "@/lib/moves";

export const metadata: Metadata = {
  title: "What to sell — smart money exits from the best investors",
  description:
    "HoldLens sell signals on a single signed −100..+100 scale. The same score model that ranks buys, just on the negative side. Real 13F data from the best portfolio managers in the world.",
  openGraph: {
    title: "What to sell — smart money exits",
    description: "Ranked sell signals on a single signed −100..+100 scale from the best portfolio managers in the world.",
  },
  twitter: { card: "summary_large_image", title: "What to sell — HoldLens" },
};

export default function SellsPage() {
  const signals = getSellSignals();
  const quarterLabel = QUARTER_LABELS[LATEST_QUARTER];

  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `What the smart money is selling — ${quarterLabel}`,
    itemListElement: signals.slice(0, 25).map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${s.ticker} — ${s.name}`,
    })),
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <div className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-4">
        Sell signals · {quarterLabel}
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        What to <span className="text-rose-400">sell</span>.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        Stocks being dumped by the best portfolio managers in the world — ranked on a single
        signed score where <span className="text-rose-400 font-semibold">−100 is the strongest
        possible sell</span> and <span className="text-emerald-400 font-semibold">+100 the
        strongest buy</span>. This page shows the negative side of that scale.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-6">
        The score is the unified ConvictionScore from <a href="/methodology" className="underline">methodology</a>:
        smart-money consensus, insider activity, manager track record, multi-quarter trend
        streaks, position concentration, and an under-the-radar bonus — minus dissent from
        sellers and a crowding penalty when a stock is already widely owned. A ticker can
        appear on EXACTLY ONE list (buys or sells) — never both.
      </p>
      <div className="mb-10">
        <CsvExportButton
          filename={`holdlens-sells-${LATEST_QUARTER}.csv`}
          label="Download sell signals CSV"
          rows={signals.map((s, i) => ({
            rank: i + 1,
            ticker: s.ticker,
            name: s.name,
            sector: s.sector || "",
            score: s.score,
            seller_count: s.sellerCount,
            sellers: s.sellers.map((b) => b.managerName).join("; "),
            exit_share: s.exitShare.toFixed(2),
            dump_severity: s.dumpSeverity.toFixed(0),
          }))}
        />
      </div>

      {signals.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel p-10 text-center text-muted">
          No sell signals for {quarterLabel} yet.
        </div>
      ) : (
        <div className="space-y-4">
          {signals.map((s, i) => {
            const rating = ratingLabel(s.score);
            const ratingColor =
              rating.color === "rose"
                ? "text-rose-400 bg-rose-400/10 border-rose-400/30"
                : rating.color === "amber"
                ? "text-brand bg-brand/10 border-brand/30"
                : "text-muted bg-panel border-border";

            return (
              <a
                key={s.ticker}
                href={`/signal/${s.ticker}`}
                className="block rounded-2xl border border-border bg-panel p-5 hover:border-rose-400/40 transition group"
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
                        <TrendBadge ticker={s.ticker} size="md" />
                      </div>
                      <div className="text-xs text-muted mt-1">
                        <LiveQuote symbol={s.ticker} size="sm" refreshMs={0} />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${ratingColor}`}>
                      {rating.label} SELL · {formatSignedScore(s.score)}
                    </div>
                    <div className="text-xs text-dim mt-1.5">
                      Score {formatSignedScore(s.score)} / −100
                      {s.sellerCount > 0 && ` · ${s.sellerCount} manager${s.sellerCount > 1 ? "s" : ""} selling`}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
                  {s.sellers.length === 0 ? (
                    <span className="text-xs text-dim italic">
                      No fresh sells this quarter — score reflects historical dissent, crowding, and trend deterioration.
                    </span>
                  ) : (
                    s.sellers.map((b) => (
                      <span
                        key={b.managerSlug}
                        className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
                          b.action === "exit"
                            ? "text-rose-400 bg-rose-400/10 border-rose-400/30"
                            : "text-muted bg-panel border-border"
                        }`}
                      >
                        {b.action === "exit" ? "✕ EXIT" : "−"} {b.managerName.split(" ").slice(-1)[0]}
                        {b.deltaPct != null && b.action === "trim" && (
                          <span className="text-dim">({b.deltaPct}%)</span>
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

      <AdSlot format="horizontal" />

      <p className="text-xs text-dim mt-8">
        Sell signals do not imply a stock will decline. Sometimes managers trim profitably. Use these signals as one input,
        not as the whole thesis. <a href="/methodology" className="underline">Methodology</a>. Not investment advice.
      </p>
    </div>
  );
}
