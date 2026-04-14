import type { Metadata } from "next";
import BacktestProof from "@/components/BacktestProof";
import AdSlot from "@/components/AdSlot";
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

      {/* The honest "how we test the model" explainer — v0.23 */}
      <div className="rounded-2xl border border-brand/30 bg-brand/5 p-6 mb-12">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          Read this first · how we test the model fairly
        </div>
        <h3 className="text-xl font-bold mb-3">Every backtested quarter has ≥3 prior quarters of trend data</h3>
        <p className="text-sm text-muted leading-relaxed mb-3">
          ConvictionScore v3 weights <span className="text-text font-semibold">multi-quarter trend
          streaks</span> heavily — a manager building a position for 3 consecutive quarters is a
          much stronger signal than a single-quarter move. In <span className="text-brand font-semibold">v0.23</span> we
          extended the dataset to 8 historical quarters (Q1 2024 → Q4 2025) so the backtest can test
          the model under its <span className="text-text font-semibold">actual operating conditions</span>:
        </p>
        <ul className="text-sm text-muted leading-relaxed list-disc list-inside space-y-1 mb-3">
          <li>
            <span className="text-text font-semibold">Q1-Q3 2024</span>: used only as context for the trend engine (not backtested directly)
          </li>
          <li>
            <span className="text-text font-semibold">Q4 2024</span>: model has 3 prior quarters — first quarter fairly backtestable
          </li>
          <li>
            <span className="text-text font-semibold">Q1 2025</span>: model has 4 prior quarters — fully operational
          </li>
          <li>
            <span className="text-text font-semibold">Q2 2025</span>: model has 5 prior quarters — strong trend signal
          </li>
          <li>
            <span className="text-text font-semibold">Q3 2025</span>: model has 6 prior quarters — peak trend signal
          </li>
        </ul>
        <p className="text-sm text-muted leading-relaxed">
          The rule: a quarter is only included in the backtest if the model had at least 3 quarters
          of prior data available to score with. That&apos;s the same condition today&apos;s {" "}
          <a href="/best-now" className="text-brand hover:underline font-semibold">
            /best-now ranking
          </a>{" "}
          operates under. No handicap, no excuses.
        </p>
        <p className="text-xs text-dim leading-relaxed mt-3">
          Earlier 2024 quarters exist in the dataset but aren&apos;t backtested as entry points — they
          would themselves lack enough prior quarters to score fairly. v0.24 will extend coverage
          to 2022-2023 so we can test the model across a full bull-bear cycle.
        </p>
      </div>

      <BacktestProof quarters={quarters} />

      <AdSlot format="horizontal" className="my-10" />

      {/* Methodology callout */}
      <section className="mt-16 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          Methodology
        </div>
        <h2 className="text-xl font-bold mb-3">How the backtest works</h2>
        <ol className="space-y-2 text-sm text-muted leading-relaxed list-decimal list-inside">
          <li>
            <span className="text-text font-semibold">As-of conviction:</span> For each historical
            quarter (Q4 2024, Q1/Q2/Q3 2025), we compute the ConvictionScore using ONLY moves filed
            up to that quarter. Time decay is re-anchored so the historical &quot;latest&quot; quarter has weight 1.0.
            Every backtested quarter has ≥3 prior quarters of trend context (Q1-Q3 2024 serve as
            the warmup dataset).
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
            <span className="text-text font-semibold">Small sample size:</span> 4 quarters × 5 picks = 20 data points.
            Statistically meaningful inference would need 20+ quarters of data. v0.24 extends coverage
            further back.
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
