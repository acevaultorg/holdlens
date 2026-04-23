import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Superinvestor Divergence — where the smart money disagrees · HoldLens",
  description:
    "Tickers where ≥2 tracked superinvestors are net buying AND ≥2 are net selling in the same quarter. The debate signal — when conviction is split.",
  alternates: { canonical: "https://holdlens.com/divergence/" },
  openGraph: {
    title: "HoldLens — Superinvestor Divergence",
    description: "Where the smart money is split: ≥2 buying, ≥2 selling, same ticker, same quarter.",
    url: "https://holdlens.com/divergence/",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens Divergence" }],
  },
  robots: { index: true, follow: true },
};

export default function DivergenceHub() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "HoldLens Superinvestor Divergence",
    description: "Tickers where tracked superinvestors disagree directionally in the same quarter — the debate signal.",
    url: "https://holdlens.com/divergence/",
    publisher: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com/" },
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Cross-Filer Pattern</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">Divergence</h1>
      <p className="text-lg text-muted leading-relaxed mb-10">
        Where the smart money is split: tickers with ≥2 tracked superinvestors net buying
        AND ≥2 net selling in the same quarter. The debate signal — when conviction
        actively disagrees.
      </p>

      <div className="space-y-6 text-text leading-relaxed">
        <h2 className="text-2xl font-bold mt-10 mb-3">The companion to /consensus/</h2>
        <p className="text-muted">
          <Link href="/consensus/" className="text-brand underline">/consensus/</Link>{" "}
          surfaces tickers where smart money agrees (multiple buyers, no sellers).
          /divergence/ surfaces the opposite: tickers where smart money explicitly
          disagrees. Both are valid signals; they answer different questions.
        </p>
        <ul className="space-y-3 list-disc list-inside text-muted">
          <li>
            <strong className="text-text">Consensus</strong> = "high conviction this is mispriced." Lower variance, often slower compounding.
          </li>
          <li>
            <strong className="text-text">Divergence</strong> = "smart money is fighting over the thesis." Higher variance, asymmetric bets in either direction.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">What divergence often signals</h2>
        <ul className="space-y-3 list-disc list-inside text-muted">
          <li>
            <strong className="text-text">Inflection-point trades</strong> — value managers exiting on multiple expansion while growth managers building (Tesla 2020-2021)
          </li>
          <li>
            <strong className="text-text">Capital-cycle turning points</strong> — energy, real estate, mining where some superinvestors call top while others call bottom
          </li>
          <li>
            <strong className="text-text">Activist-anticipation</strong> — a famously activist-friendly investor building a position while traditional value players exit (often signals incoming campaign)
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Status</h2>
        <p className="text-muted">
          Phase 3 Fork B (Y2 candidate). Day-1 hub shipped. Day-2: aggregation pass over the
          existing /api/v1/scores/ + /api/v1/managers/ data identifies tickers meeting the
          ≥2-buy + ≥2-sell threshold per quarter; renders per-quarter divergence pages.
          Day-3: cross-link to <Link href="/contrarian-bets/" className="text-brand underline">/contrarian-bets/</Link>{" "}
          which is the simpler "anyone-buying-against-consensus" page.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Related</h2>
        <p className="text-muted">
          <Link href="/consensus/" className="text-brand underline">Consensus (where smart money agrees)</Link>
          {" · "}
          <Link href="/contrarian-bets/" className="text-brand underline">Contrarian bets</Link>
          {" · "}
          <Link href="/best-now/" className="text-brand underline">Best now (top conviction)</Link>
          {" · "}
          <Link href="/13f/" className="text-brand underline">All 13F filings</Link>
        </p>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
