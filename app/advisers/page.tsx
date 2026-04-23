import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Form ADV Adviser Tracker — RIA AUM, fees, and disciplinary history · HoldLens",
  description:
    "Every SEC-registered investment adviser tracked via Form ADV: AUM, fee schedule, employee count, disciplinary history, custodian relationships. Annual filing freshness.",
  alternates: { canonical: "https://holdlens.com/advisers/" },
  openGraph: {
    title: "HoldLens Form ADV Tracker",
    description: "RIA AUM, fees, disciplinary records — every Form ADV in one searchable surface.",
    url: "https://holdlens.com/advisers/",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens Advisers" }],
  },
  robots: { index: true, follow: true },
};

export default function AdvisersHub() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "HoldLens Form ADV Adviser Tracker",
    description: "SEC Form ADV-sourced database of registered investment advisers — AUM, fee structures, disciplinary records.",
    url: "https://holdlens.com/advisers/",
    publisher: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com/" },
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">RIA</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">Form ADV Tracker</h1>
      <p className="text-lg text-muted leading-relaxed mb-10">
        Every SEC-registered investment adviser tracked via Form ADV: assets under
        management, fee schedule, employee count, disciplinary history, primary custodian.
        The transparency layer behind the RIA industry.
      </p>

      <div className="space-y-6 text-text leading-relaxed">
        <h2 className="text-2xl font-bold mt-10 mb-3">What Form ADV captures</h2>
        <ul className="space-y-3 list-disc list-inside text-muted">
          <li><strong className="text-text">AUM</strong> — discretionary + non-discretionary, updated annually</li>
          <li><strong className="text-text">Fee schedule</strong> — % of assets, performance-based, fixed-fee tiers</li>
          <li><strong className="text-text">Client mix</strong> — high-net-worth individuals, institutions, pension plans, etc.</li>
          <li><strong className="text-text">Disciplinary history</strong> — every reportable event in the adviser's regulatory history (Section 11)</li>
          <li><strong className="text-text">Custodian relationships</strong> — Schwab, Fidelity, IBKR, etc.</li>
          <li><strong className="text-text">Employee count + key personnel</strong></li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Why investors check Form ADV</h2>
        <p className="text-muted">
          Before hiring an RIA, the standard due-diligence step is reading their Form ADV
          Part 1 + Part 2 ("brochure"). HoldLens makes that searchable + cross-comparable
          across the universe of ~14,000 SEC-registered advisers, with disciplinary-history
          alerts for the ~5% with reportable events.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Status</h2>
        <p className="text-muted">
          Phase 3 Fork B ship (planned 2026 Q4). Day-1 hub shipped. Future Day-2:
          Form ADV bulk-download integration (SEC publishes annual ADV dataset) +
          per-adviser searchable pages with AUM history, fee comparison, disciplinary timeline.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Related</h2>
        <p className="text-muted">
          <Link href="/13f/" className="text-brand underline">13F filers (institutional managers)</Link>
          {" · "}
          <Link href="/investor/" className="text-brand underline">Tracked superinvestors</Link>
          {" · "}
          <Link href="/enforcement/" className="text-brand underline">SEC enforcement</Link>
          {" · "}
          <Link href="/disclaimer/" className="text-brand underline">Disclaimer</Link>
        </p>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
