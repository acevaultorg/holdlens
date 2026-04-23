import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "10-K / 10-Q Material-Change Diff Tracker · HoldLens",
  description:
    "Year-over-year and quarter-over-quarter diffs of SEC 10-K and 10-Q filings. Surfaces newly added risk factors, MD&A language changes, segment redefinitions — the structural-change signal SEC veterans watch.",
  alternates: { canonical: "https://holdlens.com/filings/" },
  openGraph: {
    title: "HoldLens 10-K / 10-Q Diff Tracker",
    description: "Material changes between consecutive SEC annual/quarterly reports.",
    url: "https://holdlens.com/filings/",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens Filings" }],
  },
  robots: { index: true, follow: true },
};

export default function FilingsHub() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "HoldLens 10-K / 10-Q Diff Tracker",
    description: "Diff comparison between consecutive 10-K (annual) and 10-Q (quarterly) SEC filings, highlighting material language and structural changes.",
    url: "https://holdlens.com/filings/",
    publisher: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com/" },
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Disclosure</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">10-K / 10-Q Diff Tracker</h1>
      <p className="text-lg text-muted leading-relaxed mb-10">
        Companies file 10-Ks (annual) and 10-Qs (quarterly) with hundreds of pages of
        boilerplate. The signal lives in the diff between consecutive filings — newly
        added risk factors, MD&A language shifts, segment redefinitions. HoldLens surfaces
        those changes automatically.
      </p>

      <div className="space-y-6 text-text leading-relaxed">
        <h2 className="text-2xl font-bold mt-10 mb-3">What gets diffed</h2>
        <ul className="space-y-3 list-disc list-inside text-muted">
          <li>
            <strong className="text-text">Risk Factors (Item 1A)</strong> — newly added,
            removed, or materially reworded risks. New risk-factor text is usually the
            single most-tradable signal in a 10-K.
          </li>
          <li>
            <strong className="text-text">MD&A (Item 7)</strong> — Management Discussion
            and Analysis tone shifts, customer-concentration disclosures, accounting policy
            changes, segment reporting redefinitions.
          </li>
          <li>
            <strong className="text-text">Legal Proceedings (Item 3)</strong> — new
            litigation disclosures, settlement amounts, reversed prior estimates.
          </li>
          <li>
            <strong className="text-text">Segment data</strong> — segment redefinitions
            (often signal preparation for divestiture or spin-off) and per-segment margin shifts.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Why this is hard (and rare)</h2>
        <p className="text-muted">
          Almost no platform does this well — Bloomberg charges $25k/year for 10-K diff
          tools, no free tool exists. The challenge: 10-Ks are filed as multi-megabyte
          XBRL/HTML documents with formatting changes that LOOK like content changes.
          HoldLens normalizes the text first (strips boilerplate formatting) then diffs
          on semantic chunks.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Status</h2>
        <p className="text-muted">
          Phase 2 ship (planned 2026 Q3). Day-1 hub shipped. Day-2: 10-K + 10-Q EDGAR
          fetcher with text-normalization pass. Day-3: per-issuer year-over-year diff
          pages with section-by-section change highlights. Day-4: per-section subscription
          alerts for new risk factors and MD&A language shifts.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Related</h2>
        <p className="text-muted">
          <Link href="/events/" className="text-brand underline">8-K material events</Link>
          {" · "}
          <Link href="/events/type/restatement/" className="text-brand underline">Financial restatements</Link>
          {" · "}
          <Link href="/insiders/" className="text-brand underline">Insider trades</Link>
          {" · "}
          <Link href="/proxies/" className="text-brand underline">Proxy filings</Link>
        </p>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
