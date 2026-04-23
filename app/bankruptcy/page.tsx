import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chapter 11 Bankruptcy Tracker · HoldLens",
  description:
    "Every public US company in Chapter 11 reorganization or Chapter 7 liquidation. SEC 8-K Item 1.03 sourced + court docket cross-links. Real-time filing detection.",
  alternates: { canonical: "https://holdlens.com/bankruptcy/" },
  openGraph: {
    title: "HoldLens Chapter 11 Tracker",
    description: "Every public US company in bankruptcy. 8-K + court docket cross-links.",
    url: "https://holdlens.com/bankruptcy/",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens Bankruptcy" }],
  },
  robots: { index: true, follow: true },
};

export default function BankruptcyHub() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "HoldLens Chapter 11 Bankruptcy Tracker",
    description: "Public-company bankruptcy filings sourced from SEC 8-K Item 1.03 and PACER court dockets.",
    url: "https://holdlens.com/bankruptcy/",
    publisher: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com/" },
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Distress</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">Bankruptcy Tracker</h1>
      <p className="text-lg text-muted leading-relaxed mb-10">
        Every public US company that files for Chapter 11 reorganization or Chapter 7
        liquidation, surfaced from SEC Form 8-K Item 1.03 (Bankruptcy or Receivership)
        within hours of the filing.
      </p>

      <div className="space-y-6 text-text leading-relaxed">
        <h2 className="text-2xl font-bold mt-10 mb-3">Why the bankruptcy lens matters</h2>
        <p className="text-muted">
          Chapter 11 filings are among the highest-impact disclosures a public company can make
          — equity is typically wiped out, debt restructured, and the cap table reset entirely.
          For investors, the question isn't just "did they file" but "was there a signal
          before the filing?" HoldLens answers that by linking each Chapter 11 to the issuer's
          prior <Link href="/insiders/" className="text-brand underline">insider trading</Link>{" "}
          patterns (cluster sells often precede), prior{" "}
          <Link href="/events/type/material-impairment/" className="text-brand underline">8-K impairments</Link>,{" "}
          and prior{" "}
          <Link href="/enforcement/" className="text-brand underline">SEC enforcement</Link>{" "}
          history.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Data flow</h2>
        <ul className="space-y-3 list-disc list-inside text-muted">
          <li><strong className="text-text">Primary signal:</strong> SEC 8-K Item 1.03 filing (must be filed within 4 business days of bankruptcy petition)</li>
          <li><strong className="text-text">Cross-reference:</strong> PACER court docket for chapter type (7 vs 11), debtor name, lead law firm</li>
          <li><strong className="text-text">Aftermath tracking:</strong> debtor-in-possession financing announcements (8-K Item 1.01 + 2.03), plan-of-reorganization docs</li>
          <li><strong className="text-text">Pre-filing context:</strong> 90-day window of insider trades + material 8-Ks shown on each per-issuer page</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Status</h2>
        <p className="text-muted">
          Day-1 hub shipped. Day-2 (next ship): EDGAR 8-K Item 1.03 scraper auto-populates
          on every Form 8-K fetcher run. Day-3: PACER court docket integration for chapter
          classification. Currently the{" "}
          <Link href="/events/type/bankruptcy/" className="text-brand underline">/events/type/bankruptcy/</Link>{" "}
          page is the live source while this surface bootstraps.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Related</h2>
        <p className="text-muted">
          <Link href="/events/type/bankruptcy/" className="text-brand underline">8-K Item 1.03 events</Link>
          {" · "}
          <Link href="/events/type/material-impairment/" className="text-brand underline">Material impairments (8-K Item 2.06)</Link>
          {" · "}
          <Link href="/insiders/" className="text-brand underline">Insider trades</Link>
          {" · "}
          <Link href="/enforcement/" className="text-brand underline">SEC enforcement</Link>
        </p>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
