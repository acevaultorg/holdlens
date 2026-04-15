import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import InvestingBooks from "@/components/InvestingBooks";

export const metadata: Metadata = {
  title: "What is a 13F filing? — Plain English guide for retail investors",
  description: "A 13F is an SEC form that hedge funds must file each quarter. Here's exactly what's in it, when it drops, and how to read one.",
};

export default function What13FPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "What is a 13F filing?",
    description: "Plain English guide to SEC Form 13F for retail investors.",
    author: { "@type": "Organization", name: "HoldLens" },
    publisher: { "@type": "Organization", name: "HoldLens" },
  };
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn</div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-8">What is a 13F filing?</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <p className="text-lg text-muted">
          A 13F is an SEC form that institutional investment managers with over <strong className="text-text">$100 million</strong>
          {" "}in assets are required to file every quarter. It lists their long US equity positions.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">When are 13Fs filed?</h2>
        <p className="text-muted">
          Within <strong className="text-text">45 days after the end of each calendar quarter</strong>:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>Q1 (Jan-Mar) → due May 15</li>
          <li>Q2 (Apr-Jun) → due August 14</li>
          <li>Q3 (Jul-Sep) → due November 14</li>
          <li>Q4 (Oct-Dec) → due February 14</li>
        </ul>
        <p className="text-muted mt-3">
          That 45-day lag is the <strong className="text-text">single most important fact</strong> about 13Fs:
          when you see a position, the actual buy/sell happened 6 weeks to 4 months ago.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">What's in a 13F?</h2>
        <p className="text-muted">For every position, the filing shows:</p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>Stock name + CUSIP (a unique 9-character identifier)</li>
          <li>Number of shares held</li>
          <li>Market value at quarter end</li>
          <li>Whether the manager has voting rights</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">What's NOT in a 13F?</h2>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">Short positions</strong> — completely invisible</li>
          <li><strong className="text-text">Options</strong> — disclosed only as notional, no detail</li>
          <li><strong className="text-text">Non-US stocks</strong> — only US equities</li>
          <li><strong className="text-text">Bonds, crypto, real estate, private equity</strong> — none of it</li>
          <li><strong className="text-text">Cash position</strong> — not disclosed</li>
        </ul>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-10 mb-3">Should I copy 13F trades?</h2>
        <p className="text-muted">
          Probably not literally. By the time you read a position on HoldLens, the price has usually moved 5-15%
          from where the manager bought. <strong className="text-text">13Fs are for pattern recognition, not copy-trading</strong> —
          spotting consensus, identifying themes, validating your own picks.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Where can I read 13Fs?</h2>
        <p className="text-muted">
          Raw filings: <a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=13F" className="text-brand underline">SEC EDGAR</a>.
          Painful to read. We do it for you on <a href="/" className="text-brand underline">HoldLens</a>.
        </p>

        <InvestingBooks
          heading="Foundational reading on securities analysis"
          sub="You just learned what a 13F is. The three books below are where the managers themselves learned — Graham, Lynch, Munger. Start with whichever voice you want to hear first."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. See <a href="/methodology" className="underline">methodology</a> for how we parse
          and score every filing.
        </p>

        <AdSlot format="horizontal" priority="secondary" />
      </div>
    </div>
  );
}
