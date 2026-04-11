import type { Metadata } from "next";
import LiveQuote from "@/components/LiveQuote";
import TrendBadge from "@/components/TrendBadge";
import { getSellSignals, ratingLabel } from "@/lib/signals";
import { formatSignedScore } from "@/lib/conviction";
import { QUARTER_LABELS, LATEST_QUARTER } from "@/lib/moves";
import { MANAGERS } from "@/lib/managers";

export const metadata: Metadata = {
  title: "What to sell — stocks the best portfolio managers are dumping",
  description: `${MANAGERS.length} of the best portfolio managers in the world and what they're selling. Ranked on a single signed −100..+100 ConvictionScore where −100 is the strongest possible sell.`,
  alternates: { canonical: "https://holdlens.com/sells" },
  openGraph: {
    title: "What to sell — HoldLens",
    description: "Stocks the best portfolio managers in the world are dumping, ranked on the unified signed ConvictionScore.",
    url: "https://holdlens.com/what-to-sell",
  },
};

export default function WhatToSellPage() {
  const signals = getSellSignals().slice(0, 10);
  const quarterLabel = QUARTER_LABELS[LATEST_QUARTER];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-4">
        What to sell · {quarterLabel}
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        What should you <span className="text-rose-400">sell</span> right now?
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-6">
        The top 10 stocks that {MANAGERS.length} of the best portfolio managers in the world are
        dumping this quarter. Ranked on a single signed score where <span className="text-rose-400 font-semibold">−100
        is the strongest possible sell</span> and <span className="text-emerald-400 font-semibold">+100
        the strongest buy</span>.
      </p>
      <div className="mb-10 flex flex-wrap gap-3">
        <a
          href="/sells"
          className="inline-block bg-rose-400 text-black font-semibold rounded-xl px-5 py-3 hover:opacity-90 transition"
        >
          Full ranking (all sell signals) →
        </a>
        <a
          href="/signal"
          className="inline-block border border-border bg-panel rounded-xl px-5 py-3 hover:border-brand transition"
        >
          Browse signal dossiers →
        </a>
      </div>

      <div className="space-y-3">
        {signals.map((s, i) => {
          const rating = ratingLabel(s.score);
          const color = rating.color === "rose" ? "text-rose-400" : rating.color === "amber" ? "text-brand" : "text-muted";
          return (
            <a
              key={s.ticker}
              href={`/signal/${s.ticker}`}
              className="block rounded-xl border border-border bg-panel p-4 hover:border-rose-400/40 transition"
            >
              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-2xl font-bold text-dim tabular-nums w-10">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-mono text-lg font-bold text-brand">{s.ticker}</div>
                    <div className="text-text truncate">{s.name}</div>
                    <TrendBadge ticker={s.ticker} />
                  </div>
                  <div className="text-xs text-muted mt-1">
                    {s.sellerCount > 0
                      ? `${s.sellerCount} manager${s.sellerCount > 1 ? "s" : ""} selling`
                      : "Strong historical exit pressure"} · <LiveQuote symbol={s.ticker} size="sm" refreshMs={0} />
                  </div>
                </div>
                <div className={`text-sm font-bold tabular-nums ${color}`}>{formatSignedScore(s.score)} / −100</div>
              </div>
            </a>
          );
        })}
      </div>

      <p className="text-xs text-dim mt-16">
        Sell signals do not imply a stock will decline — sometimes managers trim profitably.
        Use these as one input. Not investment advice. <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
