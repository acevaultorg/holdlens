import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "What is the HoldLens ConvictionScore? — The single signed −100..+100 scale",
  description: "How HoldLens assigns every stock one signed conviction score on a −100..+100 scale where +100 is the strongest possible buy and −100 the strongest possible sell.",
};

export default function ConvictionPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <a href="/learn" className="text-xs text-muted hover:text-text">← All guides</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn</div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-8">
        What is the HoldLens ConvictionScore?
      </h1>
      <p className="text-xl text-muted mb-10">
        One signed score per stock on a single scale: <span className="text-emerald-400 font-semibold">+100 is the
        strongest possible buy</span>, <span className="text-rose-400 font-semibold">−100 the strongest possible sell</span>.
      </p>

      <div className="space-y-6 text-text leading-relaxed">
        <h2 className="text-2xl font-bold mt-8 mb-3">The problem with dual buy / sell rankings</h2>
        <p className="text-muted">
          Every 13F aggregator ranks "top buys" and "top sells" as two independent lists. The naive version counts
          managers: META bought by 9, sold by 5. That's #1 on both lists — which makes the signal meaningless.
          If a stock is the strongest possible buy AND the strongest possible sell, the algorithm is measuring
          trading <em>volume</em>, not conviction.
        </p>
        <p className="text-muted">
          HoldLens fixes this by collapsing buys and sells into ONE signed number per stock. A ticker appears on
          exactly one list — buys if its score is above zero, sells if below. META's 9 buyers slightly outweigh
          its 5 sellers, so it shows up once, on the buy side, at a moderate positive score that reflects the
          contested nature of the stock.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">The six signal layers</h2>
        <p className="text-muted">
          Every stock is scored by six positive layers minus two penalty layers. All components are time-decayed
          across 8 quarters of 13F data — recent moves count more than older ones.
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>
            <strong className="text-text">Smart money.</strong> Manager quality × consensus. A Kantesaria buy (18.7%
            CAGR track record) weighs more than a Pabrai buy.
          </li>
          <li>
            <strong className="text-text">Insider activity.</strong> CEO or CFO open-market buys — the strongest single
            equity signal there is. Routine 10b5-1 sells don&apos;t count against.
          </li>
          <li>
            <strong className="text-text">Track record.</strong> Each buyer&apos;s realized 10-year CAGR weighted by their
            position size in this particular stock.
          </li>
          <li>
            <strong className="text-text">Trend streak.</strong> Multi-quarter compounding. 3 quarters in a row of
            adding ≠ a single-quarter buy.
          </li>
          <li>
            <strong className="text-text">Concentration.</strong> A 15% position is a conviction bet. A 1% position
            is portfolio filler. The model weights them accordingly.
          </li>
          <li>
            <strong className="text-text">Contrarian bonus.</strong> Under-the-radar stocks with tier-1 buyers get
            extra credit — that&apos;s where alpha lives, not in the already-crowded names.
          </li>
          <li>
            <strong className="text-text">− Dissent penalty.</strong> Every seller subtracts from the score,
            weighted ×1.6 because exits require more conviction than trims.
          </li>
          <li>
            <strong className="text-text">− Crowding penalty.</strong> When 15+ managers already own a stock, the
            signal is already priced in. The model discounts it.
          </li>
        </ul>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-8 mb-3">Reading the number</h2>
        <p className="text-muted">
          The score is signed, so the number itself tells you everything: direction by the sign, strength by the
          magnitude. Labels are cosmetic — they don&apos;t affect which list a ticker appears in, only how strong
          the signal reads.
        </p>
        <div className="rounded-xl border border-border bg-panel p-5">
          <ul className="text-sm space-y-1.5">
            <li>
              <span className="text-emerald-400 font-semibold tabular-nums">+70 → +100</span>
              <span className="text-muted"> — STRONG BUY. Unambiguous tier-1 consensus with trend + insider support.</span>
            </li>
            <li>
              <span className="text-emerald-400 font-semibold tabular-nums">+40 → +70</span>
              <span className="text-muted"> — BUY. Clear positive signal, solid manager backing.</span>
            </li>
            <li>
              <span className="text-emerald-400 font-semibold tabular-nums">+10 → +40</span>
              <span className="text-muted"> — WEAK BUY. Positive signal but muted by dissent or crowding.</span>
            </li>
            <li>
              <span className="text-muted font-semibold tabular-nums">−10 → +10</span>
              <span className="text-muted"> — NEUTRAL label, still appears on buys or sells by sign.</span>
            </li>
            <li>
              <span className="text-rose-400 font-semibold tabular-nums">−10 → −40</span>
              <span className="text-muted"> — WEAK SELL. Negative signal but not catastrophic.</span>
            </li>
            <li>
              <span className="text-rose-400 font-semibold tabular-nums">−40 → −70</span>
              <span className="text-muted"> — SELL. Clear distribution from tracked managers.</span>
            </li>
            <li>
              <span className="text-rose-400 font-semibold tabular-nums">−70 → −100</span>
              <span className="text-muted"> — STRONG SELL. Multi-quarter exit pressure from elite managers.</span>
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-3">Why the score tells the truth on Buffett</h2>
        <p className="text-muted">
          The older HoldLens model assigned Buffett a hand-curated quality score of 10. The unified ConvictionScore
          uses Berkshire&apos;s realized 10-year CAGR instead. Over 2015–2024, BRK trailed the S&amp;P 500 — so
          Buffett&apos;s computed quality score is <span className="text-text font-semibold">5.9</span>, not 10. A
          Buffett buy now weighs less than a Kantesaria buy (quality 8.2) because the last decade of numbers
          backs it up. Reputation doesn&apos;t flatter the score — track record grounds it.
        </p>

        <div className="mt-10 rounded-2xl border border-border bg-panel p-6">
          <h3 className="text-lg font-bold mb-2">See it live</h3>
          <p className="text-muted text-sm mb-4">
            The score is already running. Browse the ranked lists, the per-ticker dossier, or the manager
            leaderboard to see it in action.
          </p>
          <div className="flex flex-wrap gap-2">
            <a href="/buys" className="inline-block bg-emerald-400 text-black font-semibold rounded-xl px-4 py-2.5 hover:opacity-90 transition">
              Top buy signals →
            </a>
            <a href="/sells" className="inline-block border border-rose-400/40 text-rose-400 bg-panel font-semibold rounded-xl px-4 py-2.5 hover:bg-rose-400/5 transition">
              Top sell signals →
            </a>
            <a href="/leaderboard" className="inline-block border border-border text-text bg-panel font-semibold rounded-xl px-4 py-2.5 hover:border-brand transition">
              Manager leaderboard →
            </a>
          </div>
        </div>

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          The full six-layer formula lives in the project repo and is described in detail on the{" "}
          <a href="/methodology" className="underline">methodology page</a>. Not investment advice.
        </p>

        <AdSlot format="horizontal" priority="secondary" />
      </div>
    </div>
  );
}
