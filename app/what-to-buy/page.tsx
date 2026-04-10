import type { Metadata } from "next";
import LiveQuote from "@/components/LiveQuote";
import TrendBadge from "@/components/TrendBadge";
import { getBuySignals, ratingLabel } from "@/lib/signals";
import { QUARTER_LABELS, LATEST_QUARTER } from "@/lib/moves";
import { MANAGERS } from "@/lib/managers";

export const metadata: Metadata = {
  title: "What to buy — stocks the best portfolio managers are buying",
  description: `${MANAGERS.length} of the best portfolio managers in the world and what they're buying this quarter. Multi-factor recommendation score, live prices, multi-quarter trend streaks.`,
  alternates: { canonical: "https://holdlens.com/buys" },
  openGraph: {
    title: "What to buy — HoldLens",
    description: "Stocks the best portfolio managers in the world are buying.",
    url: "https://holdlens.com/what-to-buy",
  },
};

// This page mirrors /buys with SEO-optimized copy targeting high-intent "what to buy" queries.
// Canonical points to /buys.
export default function WhatToBuyPage() {
  const signals = getBuySignals().slice(0, 10);
  const quarterLabel = QUARTER_LABELS[LATEST_QUARTER];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-4">
        What to buy · {quarterLabel}
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        What should you <span className="text-emerald-400">buy</span> right now?
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-6">
        The top 10 stocks that {MANAGERS.length} of the best portfolio managers in the world — Buffett,
        Ackman, Druckenmiller, Klarman, Tepper, Coleman and more — are buying this quarter. Ranked
        by HoldLens's multi-factor recommendation model.
      </p>
      <div className="mb-10 flex flex-wrap gap-3">
        <a
          href="/buys"
          className="inline-block bg-emerald-400 text-black font-semibold rounded-xl px-5 py-3 hover:opacity-90 transition"
        >
          Full ranking (all signals) →
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
          const color = rating.color === "emerald" ? "text-emerald-400" : rating.color === "amber" ? "text-brand" : "text-muted";
          return (
            <a
              key={s.ticker}
              href={`/signal/${s.ticker}`}
              className="block rounded-xl border border-border bg-panel p-4 hover:border-emerald-400/40 transition"
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
                    {s.buyerCount} manager{s.buyerCount > 1 ? "s" : ""} buying · <LiveQuote symbol={s.ticker} size="sm" refreshMs={0} />
                  </div>
                </div>
                <div className={`text-sm font-bold tabular-nums ${color}`}>{s.score}/100</div>
              </div>
            </a>
          );
        })}
      </div>

      <section className="mt-16 rounded-2xl border border-border bg-panel p-8">
        <h2 className="text-xl font-bold mb-3">How HoldLens decides what to buy</h2>
        <p className="text-muted text-sm leading-relaxed">
          We track every 13F filing from {MANAGERS.length} of the best portfolio managers in the world
          — the ones with multi-decade track records and measurable alpha. Every buy and sell they report
          is scored by our multi-factor recommendation model: manager quality (70%), consensus across managers (20%),
          fresh-money share (10%), and a concentration bonus when a buyer commits over 10% of their portfolio.
          Multi-quarter trend streaks get additional weight — if three Tier-1 managers have been adding for three
          consecutive quarters, that's a much stronger signal than any single move.
        </p>
      </section>

      <p className="text-xs text-dim mt-8">
        Not investment advice. <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
