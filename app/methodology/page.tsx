import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Methodology — How HoldLens scores conviction",
  description: "How HoldLens parses 13F filings, calculates conviction scores, and ranks superinvestor moves.",
};

export default function MethodologyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Methodology</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">How we calculate everything</h1>
      <div className="space-y-8 text-text leading-relaxed">

        <section>
          <h2 className="text-2xl font-bold mb-3">Data sources</h2>
          <p className="text-muted">
            Every position on HoldLens comes from <strong className="text-text">SEC EDGAR 13F filings</strong> —
            quarterly disclosures required from any institutional investment manager with over $100M in
            assets under management. We supplement with Form 4 (insider trades) and Form 13G/13D (large position
            disclosures).
          </p>
          <ul className="mt-4 space-y-2 text-muted">
            <li>• <strong className="text-text">13F-HR:</strong> Long US equity positions, filed within 45 days of quarter end</li>
            <li>• <strong className="text-text">Form 4:</strong> Insider buys + sells, filed within 2 business days</li>
            <li>• <strong className="text-text">13G/13D:</strong> Large position changes (5%+), filed in real time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">The 45-day lag (and why it matters)</h2>
          <p className="text-muted">
            13F filings are due 45 days after each quarter ends. Translation: when you see a position on HoldLens,
            the actual buy/sell happened 6 weeks to 4 months ago. We never pretend otherwise. <strong className="text-text">
            HoldLens is for pattern recognition, not copy-trading.</strong>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Unified ConvictionScore (v4)</h2>
          <p className="text-muted">
            Every ticker is assigned ONE signed score on a single scale:
            <span className="text-emerald-400 font-semibold"> +100 is the strongest possible buy</span>,
            <span className="text-rose-400 font-semibold"> −100 the strongest possible sell</span>,
            and zero is no signal. A stock can appear on EXACTLY ONE list (buys or sells) — never both —
            because both lists are filtered views of the same single number.
          </p>
          <p className="text-muted mt-3">
            The score is built from six positive layers minus two penalty layers:
          </p>
          <ul className="mt-3 space-y-2 text-muted">
            <li>• <strong className="text-text">Smart money</strong> — manager-quality × consensus, time-decayed across 8 quarters of 13F data</li>
            <li>• <strong className="text-text">Insider activity</strong> — CEO/CFO open-market buys (the strongest single equity signal). Routine 10b5-1 sells don't count against</li>
            <li>• <strong className="text-text">Track record</strong> — buyer 10-year CAGR weighted by their position size in this stock</li>
            <li>• <strong className="text-text">Trend streak</strong> — multi-quarter compounding (3 quarters in a row ≠ 1 quarter)</li>
            <li>• <strong className="text-text">Concentration</strong> — a 15% position is weighted heavier than a 1% position</li>
            <li>• <strong className="text-text">Contrarian bonus</strong> — under-the-radar stocks (small ownership count + tier-1 buyers)</li>
            <li>• <strong className="text-text">− Dissent penalty</strong> — sellers subtract from the score (×1.2 because exits require more conviction than trims)</li>
            <li>• <strong className="text-text">− Crowding penalty</strong> — when ownership count is high, the signal is already priced in</li>
          </ul>
          <p className="text-muted mt-3">
            <strong className="text-text">Pure sign-based:</strong> a ticker's ranking membership is determined entirely
            by the sign of its single signed score. Positive → buy ranking. Negative → sell ranking. Zero → neither.
            No dead zone. No third bucket. The same number tells you everything: direction by its sign, strength by
            its magnitude.
          </p>
          <p className="text-muted mt-3">
            META used to be #1 on both rankings under the old dual-list scheme. Under the unified score, META has
            ONE conviction value (positive, ~+20) — its 9 buyers slightly outweigh its 5 sellers — so it appears
            in EXACTLY ONE list (buys), with a moderate score that reflects the contested nature of the stock.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">How a label maps to the score</h2>
          <p className="text-muted text-sm mb-3">
            Labels are purely cosmetic — they describe how strong a signal is, but don't affect which list a
            ticker appears in. Only the SIGN of the score does that.
          </p>
          <ul className="text-muted space-y-1 text-sm">
            <li><span className="text-emerald-400 font-semibold">STRONG BUY</span> — score ≥ +70</li>
            <li><span className="text-emerald-400 font-semibold">BUY</span> — score ≥ +40</li>
            <li><span className="text-emerald-400 font-semibold">WEAK BUY</span> — score &gt; +10</li>
            <li><span className="text-muted">NEUTRAL</span> — score in [−10, +10] · still appears on buys or sells based on sign</li>
            <li><span className="text-rose-400 font-semibold">WEAK SELL</span> — score &lt; −10</li>
            <li><span className="text-rose-400 font-semibold">SELL</span> — score ≤ −40</li>
            <li><span className="text-rose-400 font-semibold">STRONG SELL</span> — score ≤ −70</li>
          </ul>
        </section>

        <AdSlot format="in-article" />

        <section>
          <h2 className="text-2xl font-bold mb-3">What we don't show</h2>
          <ul className="text-muted space-y-2">
            <li>❌ Short positions (not in 13Fs)</li>
            <li>❌ Options exposure (notional only, no detail)</li>
            <li>❌ Non-US equities (not in 13Fs)</li>
            <li>❌ Bonds, crypto, real estate (not in 13Fs)</li>
            <li>❌ Real-time positions (legal floor: 45 days)</li>
          </ul>
          <p className="mt-4 text-dim text-sm">
            If you need real-time, options-aware data, you need a Bloomberg terminal — or more accurately, you
            need to be at one of these funds. HoldLens is the best public data made beautiful.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Updates</h2>
          <p className="text-muted">
            Manager portfolios update within hours of each 13F filing. Email subscribers get a one-line move
            alert per filing. We never delete historical data — every quarter is preserved.
          </p>
        </section>

        <section id="predictive-validity">
          <h2 className="text-2xl font-bold mb-3">
            Predictive validity — what our 2026 backtest found
          </h2>
          <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-5 mb-4">
            <p className="text-text font-semibold mb-2">
              The ConvictionScore does not predict forward stock returns.
            </p>
            <p className="text-muted text-sm leading-relaxed">
              In April 2026 we ran a full backtest of the score against realized 6-14 month
              forward returns across 221 ticker-quarter pairs (4 quarters × ~55 scored tickers
              each). The correlation between ConvictionScore and forward alpha over SPY was{" "}
              <strong className="text-text">r = −0.12</strong> — essentially zero, and slightly
              negative in direction. Every single quarter in the window showed negative correlation.
              Top-decile BUYs underperformed SPY by ~5%; bottom-decile SELLs <em>outperformed</em>{" "}
              SPY by ~24%.
            </p>
          </div>

          <h3 className="text-lg font-semibold mt-5 mb-2">Why the score still matters</h3>
          <p className="text-muted leading-relaxed">
            HoldLens is a <strong className="text-text">smart-money positioning tracker</strong>,
            not a return predictor. The ConvictionScore is a clean composite of what the tracked
            portfolio managers are actually doing in their most-recent 13F filings — consensus,
            concentration, multi-quarter trends, insider alignment, dissent. That is
            legitimately useful market intelligence (people want to know what Buffett, Ackman,
            Burry and Druckenmiller are buying and selling).
          </p>
          <p className="text-muted leading-relaxed mt-3">
            What the score is <strong className="text-text">not</strong>: a reliable guide to which
            stocks will outperform. Three structural reasons the backtest data points at:
          </p>
          <ul className="mt-3 space-y-2 text-muted">
            <li>
              • <strong className="text-text">Contrarian inversion.</strong> When tracked managers
              BUY a stock, it&apos;s often because the stock dropped and they&apos;re
              bargain-hunting; the drop continues (momentum). When they SELL, they&apos;re often
              taking profit on a winner that keeps winning.
            </li>
            <li>
              • <strong className="text-text">Manager-quality drag.</strong> Several storied
              managers tracked on HoldLens have materially underperformed the S&amp;P over the
              recent 10-year window (see per-manager ROI panels on the investor pages). Their
              picks drive BUY signals; their picks have underperformed.
            </li>
            <li>
              • <strong className="text-text">45-day filing lag.</strong> By the time we surface
              &ldquo;smart money buying X&rdquo;, the news is usually priced in.
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-5 mb-2">Reproducing the backtest</h3>
          <p className="text-muted leading-relaxed">
            The backtest script lives at{" "}
            <code className="text-xs px-1.5 py-0.5 bg-panel-hi rounded">scripts/backtest-conviction.ts</code>
            . It pulls 2-year daily closes from Yahoo Finance for every tracked ticker + SPY, replays
            the ConvictionScore at each of the last 4 historical quarters, pairs it with forward
            return from the 13F filing date to today, and computes Pearson correlation + decile
            alpha spreads. Full output is logged to{" "}
            <code className="text-xs px-1.5 py-0.5 bg-panel-hi rounded">.claude/state/CONVICTION_BACKTEST.md</code>
            . We re-run this every quarter — transparency over flattery.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Errors and corrections</h2>
          <p className="text-muted">
            Found a wrong number? Email <a href="mailto:hello@holdlens.com" className="text-brand hover:underline">hello@holdlens.com</a>.
            Corrections logged publicly with a timestamp. Trust is the moat.
          </p>
        </section>

        <p className="text-xs text-dim pt-8 border-t border-border">
          HoldLens is not a registered investment advisor. Nothing on this site is investment advice. Always do
          your own research. See <a href="/about" className="underline">about</a> for our principles.
        </p>
      </div>
    </div>
  );
}
