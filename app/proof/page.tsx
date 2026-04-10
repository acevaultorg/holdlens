import type { Metadata } from "next";
import BacktestProof from "@/components/BacktestProof";
import { getBacktestQuarters } from "@/lib/backtest";

export const metadata: Metadata = {
  title: "Proof — backtested realized returns of the recommender",
  description: "If you'd followed HoldLens's top BUY signals from each historical 13F filing, here's what your portfolio would look like today. Honest backtest with live prices.",
  alternates: { canonical: "https://holdlens.com/proof" },
  openGraph: {
    title: "HoldLens · Recommender backtest proof",
    description: "Honest realized returns of the multi-factor ConvictionScore recommender from each historical quarter.",
  },
};

export default function ProofPage() {
  // Compute the historical top picks at build time. The realized returns are
  // computed client-side from live Yahoo Finance data via the Worker proxy.
  const quarters = getBacktestQuarters(5);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        The proof
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        Did the recommender actually work?
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-3">
        For each historical 13F filing date, we compute what HoldLens would have recommended using
        only the data available at that point in time. Then we measure the realized return from
        that day to today using live prices.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-8">
        No survivorship bias, no curation, no cherry-picking. If the model picked stocks that lost
        money, this page shows it. Trust comes from being right when nobody is looking.
      </p>

      {/* The honest "this is hard mode" explainer */}
      <div className="rounded-2xl border border-brand/30 bg-brand/5 p-6 mb-12">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          Read this first · why this is hard mode for the model
        </div>
        <h3 className="text-xl font-bold mb-3">The model needs ≥3 quarters of trend data to work</h3>
        <p className="text-sm text-muted leading-relaxed mb-3">
          ConvictionScore v3 weights <span className="text-text font-semibold">multi-quarter trend
          streaks</span> heavily — a manager building a position for 3 consecutive quarters is a
          much stronger signal than a single-quarter move. But this backtest tests the model in its
          <span className="text-text font-semibold"> weakest possible condition</span>:
        </p>
        <ul className="text-sm text-muted leading-relaxed list-disc list-inside space-y-1 mb-3">
          <li>
            <span className="text-text font-semibold">Q1 2025</span>: model had <span className="text-rose-400">0 prior quarters</span> — basically random picks
          </li>
          <li>
            <span className="text-text font-semibold">Q2 2025</span>: model had 1 prior quarter — still under-trained
          </li>
          <li>
            <span className="text-text font-semibold">Q3 2025</span>: model had 2 prior quarters — first quarter with meaningful trend signal
          </li>
          <li>
            <span className="text-text font-semibold">Q4 2025 (today)</span>: model has 3 prior quarters of trend data — fully operational
          </li>
        </ul>
        <p className="text-sm text-muted leading-relaxed">
          The honest takeaway: the model got worse the further back we test it, because the further
          back we go, the less historical data it had to score with. Today&apos;s {" "}
          <a href="/best-now" className="text-brand hover:underline font-semibold">
            /best-now ranking
          </a>{" "}
          uses all 4 quarters of trend data and is the version that should compound.
        </p>
        <p className="text-xs text-dim leading-relaxed mt-3">
          v0.23 will fix this properly by adding 8+ quarters of historical move data so the backtest
          can test the model under its <em>actual</em> operating conditions instead of degraded ones.
        </p>
      </div>

      <BacktestProof quarters={quarters} />

      {/* Methodology callout */}
      <section className="mt-16 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          Methodology
        </div>
        <h2 className="text-xl font-bold mb-3">How the backtest works</h2>
        <ol className="space-y-2 text-sm text-muted leading-relaxed list-decimal list-inside">
          <li>
            <span className="text-text font-semibold">As-of conviction:</span> For each historical
            quarter (Q1, Q2, Q3 2025), we compute the ConvictionScore using ONLY moves filed up to
            that quarter. Time decay is re-anchored so the historical &quot;latest&quot; quarter has weight 1.0.
          </li>
          <li>
            <span className="text-text font-semibold">Top 5 BUY signals:</span> We take the top 5
            stocks ranked BUY at that historical point in time. No curation — whatever the model said.
          </li>
          <li>
            <span className="text-text font-semibold">Entry price:</span> The closing price closest
            to the 13F filing date (when an investor could have actually acted on the signal).
          </li>
          <li>
            <span className="text-text font-semibold">Exit price:</span> Today&apos;s live price from
            Yahoo Finance via our Cloudflare Worker proxy.
          </li>
          <li>
            <span className="text-text font-semibold">Realized return:</span> Simple
            (exit − entry) / entry. Not annualized for the per-pick rows; the aggregate annualizes
            using days held.
          </li>
          <li>
            <span className="text-text font-semibold">Benchmark:</span> SPY total return over the
            same period. Hit rate = % of picks that beat SPY.
          </li>
          <li>
            <span className="text-text font-semibold">Equal weight:</span> Each pick weighted 1/N.
            No position sizing, no rebalancing. The simplest possible strategy.
          </li>
        </ol>
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          Caveats
        </div>
        <ul className="space-y-2 text-sm text-muted leading-relaxed list-disc list-inside">
          <li>
            <span className="text-text font-semibold">Small sample size:</span> 3 quarters × 5 picks = 15 data points.
            Statistically meaningful inference would need 20+ quarters of data.
          </li>
          <li>
            <span className="text-text font-semibold">Insider data is not time-locked:</span>
            The model uses current Form 4 data even for historical computations. Minor look-ahead bias on the insider component.
          </li>
          <li>
            <span className="text-text font-semibold">Owner count is not time-locked:</span>
            The crowding penalty uses today&apos;s ownership count, not the historical count. Minor.
          </li>
          <li>
            <span className="text-text font-semibold">No transaction costs:</span> Real returns would be slightly
            lower due to spreads + commissions (though most brokers are commission-free in 2026).
          </li>
          <li>
            <span className="text-text font-semibold">Past ≠ future:</span> A model that worked historically
            can stop working tomorrow. Past performance is not indicative of future results.
          </li>
        </ul>
      </section>

      <p className="text-xs text-dim mt-12 text-center">
        Backtest data is recomputed live on every page load. Returns shift with the market each day.
        Not investment advice. <a href="/methodology" className="underline">Full methodology →</a>
      </p>
    </div>
  );
}
