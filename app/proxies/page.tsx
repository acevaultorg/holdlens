import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DEF 14A Proxy Tracker — voting + comp + activist campaigns · HoldLens",
  description:
    "SEC Form DEF 14A proxy filings: shareholder voting, executive compensation, board nominations, activist campaign details. Q1-Q2 peak. EDGAR-sourced.",
  alternates: { canonical: "https://holdlens.com/proxies/" },
  openGraph: {
    title: "HoldLens Proxy Tracker — DEF 14A",
    description:
      "Every proxy statement: votes, exec comp, activist campaigns, board changes.",
    url: "https://holdlens.com/proxies/",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens Proxies" }],
  },
  robots: { index: true, follow: true },
};

export default function ProxiesHub() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "HoldLens DEF 14A Proxy Tracker",
    description: "SEC Form DEF 14A proxy filings — shareholder voting, executive compensation, activist campaigns.",
    url: "https://holdlens.com/proxies/",
    publisher: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com/" },
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Governance</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">Proxy Tracker — DEF 14A</h1>
      <p className="text-lg text-muted leading-relaxed mb-10">
        Every proxy statement filed with the SEC: shareholder votes, executive comp packages,
        board nominations, activist campaign details. Peak filing season Q1-Q2.
      </p>

      <div className="space-y-6 text-text leading-relaxed">
        <h2 className="text-2xl font-bold mt-10 mb-3">What DEF 14A captures</h2>
        <ul className="space-y-3 list-disc list-inside text-muted">
          <li><strong className="text-text">Shareholder votes</strong> — annual meeting agenda, board elections, comp ratification, M&A approvals</li>
          <li><strong className="text-text">Executive compensation</strong> — full breakdown of CEO/CFO/named-executive pay, including stock + options awards</li>
          <li><strong className="text-text">Activist campaigns</strong> — proxy contests where activists nominate competing slates (cross-references HoldLens <Link href="/activist/" className="text-brand underline">activist tracker</Link>)</li>
          <li><strong className="text-text">Related-party transactions</strong> — disclosures of insider deals between officers/directors and the company</li>
          <li><strong className="text-text">Audit committee + compensation committee composition</strong></li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Why proxies matter for investors</h2>
        <p className="text-muted">
          Proxies are the densest single SEC filing for governance signal. A pay package that
          dramatically misaligns with company performance, an audit-committee chair with
          undisclosed conflicts, or a contested vote against the CEO's preferred slate are
          all red flags that show up FIRST in DEF 14A — months before they show up in 8-K
          disclosures or 13F position changes.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Status</h2>
        <p className="text-muted">
          Day-1: schema + URL surface shipped. Day-2 (Q1 2026 ship): EDGAR DEF 14A scraper
          + per-issuer proxy timeline + executive-compensation extractor. Day-3: cross-link
          activist proxy contests to /activist/ campaign records.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Related</h2>
        <p className="text-muted">
          <Link href="/activist/" className="text-brand underline">Activist filings (13D/13G)</Link>
          {" · "}
          <Link href="/insiders/" className="text-brand underline">Insider trades (Form 4)</Link>
          {" · "}
          <Link href="/events/" className="text-brand underline">Material events (8-K)</Link>
          {" · "}
          <Link href="/enforcement/" className="text-brand underline">SEC enforcement</Link>
        </p>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
