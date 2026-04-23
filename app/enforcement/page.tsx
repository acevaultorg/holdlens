import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SEC Enforcement Actions Tracker · HoldLens",
  description:
    "Every SEC enforcement action, consent decree, civil penalty, and administrative proceeding involving public companies. EDGAR-sourced, freshness-stamped, cross-linked to /insiders/ and /events/.",
  alternates: { canonical: "https://holdlens.com/enforcement/" },
  openGraph: {
    title: "HoldLens — SEC Enforcement Tracker",
    description:
      "SEC enforcement actions surfaced and cross-linked to insider activity + 8-K filings. Niche, authoritative, citation-ready.",
    url: "https://holdlens.com/enforcement/",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens Enforcement" }],
  },
  robots: { index: true, follow: true },
};

const TRACKED_ACTION_TYPES = [
  { code: "AAER", label: "Accounting & Auditing Enforcement Release", desc: "Financial-reporting fraud, accounting restatements, auditor misconduct" },
  { code: "LR", label: "Litigation Release", desc: "Civil enforcement actions filed in federal court" },
  { code: "33-Action", label: "Securities Act §17(a) action", desc: "Anti-fraud provision violations in offer/sale of securities" },
  { code: "34-Action", label: "Exchange Act §10(b) action", desc: "Insider trading, market manipulation, disclosure fraud" },
  { code: "Admin-Proc", label: "Administrative Proceeding Order", desc: "Cease-and-desist orders, industry bars, registration revocations" },
  { code: "Whistleblower", label: "Whistleblower Award Order", desc: "SEC §21F payouts to original-information sources" },
];

export default function EnforcementHub() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "HoldLens SEC Enforcement Tracker",
    description:
      "Database of SEC enforcement actions involving public US companies — civil penalties, consent decrees, AAER releases, administrative proceedings.",
    url: "https://holdlens.com/enforcement/",
    publisher: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com/" },
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Regulatory
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        SEC Enforcement
      </h1>
      <p className="text-lg text-muted leading-relaxed mb-10">
        Every SEC enforcement action against a public US issuer, classified by action type,
        cross-linked to the issuer's insider activity and recent 8-K filings. Niche-but-authoritative
        coverage of the regulatory layer most retail investors never see.
      </p>

      <div className="space-y-6 text-text leading-relaxed">
        <h2 className="text-2xl font-bold mt-10 mb-3">Why this surface exists</h2>
        <p className="text-muted">
          SEC enforcement actions are public-record signals that often precede stock-moving
          disclosures. An accounting restatement (8-K Item 4.02) typically follows weeks
          after the underlying AAER release; a §10(b) insider-trading prosecution often
          follows months of unusual Form 4 patterns. Surfacing both — and cross-linking
          them — lets investors see the full pattern instead of three disconnected feeds.
        </p>
        <p className="text-muted">
          HoldLens is the only platform that cross-links SEC enforcement actions to the
          underlying issuer's
          <Link href="/insiders/" className="text-brand underline mx-1">insider trades</Link>,
          <Link href="/events/" className="text-brand underline mx-1">8-K material events</Link>,
          and
          <Link href="/13f/" className="text-brand underline mx-1">13F superinvestor positioning</Link>.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Action types tracked</h2>
        <div className="rounded-lg border border-border overflow-hidden my-4">
          <table className="w-full text-sm">
            <thead className="bg-card text-text">
              <tr>
                <th className="text-left p-3 font-semibold">Code</th>
                <th className="text-left p-3 font-semibold">Action type</th>
                <th className="text-left p-3 font-semibold">What it covers</th>
              </tr>
            </thead>
            <tbody className="text-muted">
              {TRACKED_ACTION_TYPES.map((t) => (
                <tr key={t.code} className="border-t border-border">
                  <td className="p-3 font-mono">{t.code}</td>
                  <td className="p-3 font-semibold text-text">{t.label}</td>
                  <td className="p-3">{t.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-3">Data source</h2>
        <p className="text-muted">
          Primary source: SEC's own enforcement releases at
          {" "}
          <a href="https://www.sec.gov/litigation" className="text-brand underline" target="_blank" rel="noopener noreferrer">
            sec.gov/litigation
          </a>
          {" "}— LR (Litigation Release), AAER (Accounting & Auditing Enforcement Release),
          and the SEC Administrative Proceedings docket. Each row on /enforcement/ links
          back to its source SEC filing by accession number for verification.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Status</h2>
        <p className="text-muted">
          Day-1: action-type taxonomy + cross-link infrastructure shipped. Day-2 (next
          ship): EDGAR enforcement-release scraper backfills 90 days of actions; populates
          per-issuer enforcement timeline pages. Day-3: EnforcementScore composite metric
          (severity × recency × repeat-violator multiplier) joining ConvictionScore +
          InsiderScore + EventScore as the fourth branded HoldLens signal.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Honest framing</h2>
        <p className="text-muted">
          Not every SEC enforcement action implies stock-moving severity — many are
          minor administrative matters or settled cases with token penalties. /enforcement/
          surfaces ALL of them with action-type classification so the reader can filter
          to what matters to them. Per-issuer pages aggregate severity-weighted history
          rather than just count counts.
        </p>
        <p className="text-muted">
          See <Link href="/disclaimer/" className="text-brand underline">disclaimer</Link>{" "}
          for the full not-investment-advice + 4-business-day filing-lag framing.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Related surfaces</h2>
        <p className="text-muted">
          <Link href="/insiders/" className="text-brand underline">Insider trading (Form 4)</Link>
          {" · "}
          <Link href="/events/" className="text-brand underline">Material events (Form 8-K)</Link>
          {" · "}
          <Link href="/activist/" className="text-brand underline">Activist filings (13D/13G)</Link>
          {" · "}
          <Link href="/methodology/" className="text-brand underline">Methodology</Link>
          {" · "}
          <Link href="/glossary/" className="text-brand underline">Glossary</Link>
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
