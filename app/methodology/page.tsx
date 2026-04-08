import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology — How HoldLens scores conviction",
  description: "How HoldLens parses 13F filings, calculates conviction scores, and ranks superinvestor moves.",
};

export default function MethodologyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Methodology</div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-8">How we calculate everything</h1>
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
          <h2 className="text-2xl font-bold mb-3">Conviction Score (coming v0.4)</h2>
          <p className="text-muted">
            A position is high-conviction when it's: (a) large relative to the manager's typical position size,
            (b) added to over multiple quarters, (c) held even after price drawdowns. Our Conviction Score
            combines all three signals into a single 0-100 number per position.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Consensus Score (coming v0.4)</h2>
          <p className="text-muted">
            When 5+ tracked managers independently buy the same stock in the same quarter, that's a consensus
            signal. Our Consensus Score weighs the manager's track record + position size to flag emerging themes
            one quarter early.
          </p>
        </section>

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
