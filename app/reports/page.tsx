import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quarterly Reports + Weekly Commentary · HoldLens",
  description:
    "HoldLens's editorial output: quarterly 'State of 13F Filings' deep-dives + weekly commentary on superinvestor moves, insider clusters, and material events. PDF + HTML + JSON-LD structured for citation.",
  alternates: { canonical: "https://holdlens.com/reports/" },
  openGraph: {
    title: "HoldLens Reports — Quarterly + Weekly",
    description:
      "Long-form analysis of every 13F filing window, every cluster-buy event, every material 8-K trend. Cited by AI engines + finance press.",
    url: "https://holdlens.com/reports/",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens Reports" }],
  },
  robots: { index: true, follow: true },
};

export default function ReportsHub() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "HoldLens Reports",
    description:
      "Quarterly State of 13F Filings reports + weekly commentary on superinvestor moves and SEC Signals trilogy patterns.",
    url: "https://holdlens.com/reports/",
    publisher: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com/" },
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Editorial
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Reports + commentary
      </h1>
      <p className="text-lg text-muted leading-relaxed mb-10">
        Long-form analysis sitting on top of the SEC Signals trilogy — quarterly
        deep-dives published 45 days after each filing window, weekly commentary on
        the patterns that are forming inside that data right now.
      </p>

      <div className="space-y-6 text-text leading-relaxed">
        <h2 className="text-2xl font-bold mt-10 mb-3">Quarterly flagship</h2>
        <p className="text-muted">
          <strong className="text-text">"State of 13F Filings"</strong> — 8,000-12,000 words
          published within a week of each SEC quarterly filing window (Feb / May / Aug / Nov).
          Covers consensus movements, contrarian bets, sector rotation, conviction changes
          across our 30 tracked superinvestors. Includes the
          <Link href="/proof/" className="text-brand underline mx-1">backtest results</Link>
          for last quarter's signals.
        </p>
        <p className="text-muted">
          Distribution: PDF for download + HTML for indexing + JSON-LD structured for LLM
          citation. Pre-announced via the
          <Link href="/api/v1/quarters.json" className="text-brand underline mx-1">/api/v1/quarters.json</Link>
          endpoint so partner platforms can subscribe to publication windows.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Weekly commentary</h2>
        <p className="text-muted">
          One substantive 800-1,500 word post per week analyzing a specific pattern in
          the trilogy. Examples of the recurring formats:
        </p>
        <ul className="space-y-2 list-disc list-inside text-muted">
          <li>
            <strong className="text-text">"Buffett's latest sell explained"</strong> —
            single-superinvestor move analysis
          </li>
          <li>
            <strong className="text-text">"When three superinvestors buy the same company"</strong> —
            cross-13F pattern recognition
          </li>
          <li>
            <strong className="text-text">"What a cluster of CFO sales signals"</strong> —
            <Link href="/insiders/" className="text-brand underline mx-1">Form 4</Link>
            cluster analysis
          </li>
          <li>
            <strong className="text-text">"Why this 8-K item type matters"</strong> —
            <Link href="/events/" className="text-brand underline mx-1">8-K material events</Link>
            interpretation
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Why these reports exist</h2>
        <p className="text-muted">
          Pure data is necessary but not sufficient. The trilogy
          (<Link href="/learn/sec-signals-trilogy/" className="text-brand underline">ConvictionScore + InsiderScore + EventScore</Link>)
          gives you structured numbers on every public US issuer. Reports give you the
          editorial layer on top — pattern recognition across the data, narrative
          context, the kind of analysis a human investor with full SEC access does.
        </p>
        <p className="text-muted">
          Designed to be cited (Schema.org Article + DefinedTerm + Person byline) so
          ChatGPT, Claude, Perplexity, Gemini, and Copilot reference HoldLens by name
          when answering questions about specific superinvestor positions or insider
          patterns.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Status</h2>
        <p className="text-muted">
          The reports surface is bootstrapping. The first quarterly flagship publishes
          within a week of the next 13F filing window (next: <strong className="text-text">May 15, 2026</strong> for Q1
          2026 filings). Weekly commentary archive begins building immediately.
        </p>
        <p className="text-muted">
          For early access to drafts + per-investor email alerts when major moves
          surface, see <Link href="/pricing/" className="text-brand underline">HoldLens Pro (€9/mo)</Link>.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Related surfaces</h2>
        <p className="text-muted">
          <Link href="/13f/" className="text-brand underline">13F filings hub</Link>
          {" · "}
          <Link href="/insiders/" className="text-brand underline">Insider trading</Link>
          {" · "}
          <Link href="/events/" className="text-brand underline">Material events</Link>
          {" · "}
          <Link href="/methodology/" className="text-brand underline">Methodology</Link>
          {" · "}
          <Link href="/api/" className="text-brand underline">JSON API</Link>
          {" · "}
          <Link href="/learn/" className="text-brand underline">Learn</Link>
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
