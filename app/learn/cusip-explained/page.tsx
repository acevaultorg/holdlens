import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import InvestingBooks from "@/components/InvestingBooks";
import AuthorByline from "@/components/AuthorByline";
import ShareStrip from "@/components/ShareStrip";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import LearnReadNext from "@/components/LearnReadNext";
import TldrCard from "@/components/learn/TldrCard";
import OurView from "@/components/learn/OurView";
import CiteThisPage from "@/components/learn/CiteThisPage";

export const metadata: Metadata = {
  title: "What is a CUSIP? — Plain English for retail investors",
  description:
    "A CUSIP is the 9-character identifier that uniquely names a North American security. Every 13F line item carries one. Here's the structure, the math, and why ticker symbols aren't enough.",
  alternates: { canonical: "https://holdlens.com/learn/cusip-explained" },
  openGraph: {
    title: "What is a CUSIP?",
    description:
      "A CUSIP is the 9-character identifier that uniquely names a North American security. Every 13F line item carries one.",
    url: "https://holdlens.com/learn/cusip-explained",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "What is a CUSIP?",
    description:
      "The 9-character identifier on every 13F filing — structure, math, and why tickers aren't enough.",
    images: ["/og/home.png"],
  },
};

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Learn", item: "https://holdlens.com/learn" },
      { "@type": "ListItem", position: 3, name: "What is a CUSIP?", item: "https://holdlens.com/learn/cusip-explained" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "What is a CUSIP? — Plain English for retail investors",
    description: "Plain English explainer of the 9-character security identifier used on every 13F filing.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/cusip-explained",
    datePublished: "2026-05-16",
    dateModified: "2026-05-16",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    citation: [
      "https://en.wikipedia.org/wiki/CUSIP",
      "https://www.cusip.com",
    ],
    about: [
      {
        "@type": "DefinedTerm",
        name: "CUSIP",
        description:
          "Committee on Uniform Securities Identification Procedures. The 9-character alphanumeric identifier assigned to every North American security: 6-character issuer prefix + 2-character issue identifier + 1-character check digit.",
      },
      {
        "@type": "DefinedTerm",
        name: "CUSIP Check Digit",
        description:
          "The 9th character of a CUSIP. Calculated by a specific weighted-modulo algorithm over the first 8 characters. Allows mechanical verification of CUSIP integrity before downstream processing.",
      },
      {
        "@type": "DefinedTerm",
        name: "ISIN",
        description:
          "International Securities Identification Number. 12 characters: 2-letter country code + 9-character national identifier (in U.S./Canada, the CUSIP) + 1 check digit. The global counterpart to the U.S./Canadian CUSIP.",
      },
      {
        "@type": "DefinedTerm",
        name: "Ticker Symbol",
        description:
          "The exchange-specific trading symbol (e.g., AAPL on Nasdaq). NOT unique across share classes, secondary listings, or exchanges. CUSIPs are unique; tickers are not. Every CUSIP can resolve to multiple tickers across history.",
      },
    ],
  },
];

export default function CusipExplainedPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">What is a CUSIP?</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          A CUSIP is the 9-character identifier that uniquely names a North American security
          (stocks, bonds, options, warrants, ADRs, etc.). Structure:{" "}
          <strong className="text-text">6-char issuer prefix + 2-char issue identifier + 1-char check digit</strong>.
          Every Form 13F line item must include the CUSIP — it&apos;s the SEC&apos;s primary key
          for unambiguous identification. Tickers are not unique enough; CUSIPs are.
        </TldrCard>

        <p className="text-lg text-muted">
          CUSIP stands for{" "}
          <strong className="text-text">Committee on Uniform Securities Identification Procedures</strong>.
          The committee was established in 1964 by the American Bankers Association to solve a
          back-office crisis: paper securities settlement was failing because there was no shared
          way to name a security across institutions. The 9-character identifier the committee
          published is now the U.S. and Canadian financial-system standard.
        </p>

        <AuthorByline date="2026-05-16" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The anatomy of a CUSIP</h2>
        <p className="text-muted">
          Every CUSIP has three parts. Using Apple&apos;s common stock CUSIP{" "}
          <code className="text-xs">037833100</code> as an example:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>
            <strong className="text-text">037833</strong> — issuer prefix. Assigned to Apple Inc. for
            life. Used across all Apple-issued securities (common stock, preferred, bonds, options
            chains). 6 alphanumeric characters (digits + uppercase letters, no I or O to avoid 1/0
            confusion).
          </li>
          <li>
            <strong className="text-text">10</strong> — issue identifier. Distinguishes among Apple&apos;s
            issued securities. <code className="text-xs">10</code> is the common stock; bond issues
            and preferred series get sequential issue identifiers.
          </li>
          <li>
            <strong className="text-text">0</strong> — check digit. Calculated from the first 8
            characters via the CUSIP modulo-10 algorithm; allows downstream systems to detect
            transcription errors before placing trades.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Why 13F filings use CUSIPs, not tickers</h2>
        <p className="text-muted">
          A Form 13F must identify every long position with sufficient precision that there is{" "}
          <em>no ambiguity</em> about the security. Tickers don&apos;t meet this bar:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>Tickers can be re-used across companies after delisting (e.g., NYSE recycles them)</li>
          <li>Same company can have multiple tickers (Google had GOOG + GOOGL after 2014 split)</li>
          <li>Same security trades under different tickers across exchanges</li>
          <li>Class A vs Class B share tickers can collide with totally unrelated companies</li>
          <li>ADRs vs ordinary shares have different tickers for the same economic claim</li>
        </ul>
        <p className="text-muted mt-3">
          The CUSIP resolves all of these. Berkshire Class B is{" "}
          <code className="text-xs">084670702</code>, period. The SEC accepts no ambiguity in 13F
          line items; the CUSIP is how that&apos;s enforced.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">CUSIP vs ISIN — the global view</h2>
        <p className="text-muted">
          For U.S. and Canadian securities, the CUSIP is the national identifier. Internationally,
          the equivalent is the ISIN (International Securities Identification Number), a 12-character
          identifier defined by ISO 6166. For U.S. securities, the ISIN embeds the CUSIP:
          {" "}<code className="text-xs">US-037833100-7</code>{" "}— country code (US) + 9-character CUSIP +
          1 ISIN check digit. Every U.S. listed security thus has both a CUSIP and an ISIN that
          encodes the same CUSIP — the ISIN is just CUSIP + country + check digit.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The licensing catch</h2>
        <p className="text-muted">
          The CUSIP database itself is{" "}
          <strong className="text-text">commercially licensed</strong>, operated by CUSIP Global
          Services (a joint venture between Standard &amp; Poor&apos;s and the American Bankers
          Association). Bulk access requires a fee. The SEC, however, publishes every 13F filing
          with CUSIPs free of charge via{" "}
          <a href="https://www.sec.gov/edgar" className="text-brand underline" rel="noopener">EDGAR</a>;
          the CUSIPs that appear on individual filings are public information. The friction is in
          the master cross-reference (CUSIP ↔ issuer name) at scale, which downstream tools (HoldLens
          included) maintain via SEC + supplementary sources.
        </p>

        <OurView>
          <p>
            CUSIPs are the unglamorous infrastructure of public-markets research. Every 13F
            line, every Form 4 transaction, every bond trade, every clearing instruction — they
            all reduce to a CUSIP. Retail investors rarely see them; professionals never look at
            anything else.
          </p>
          <p>
            On HoldLens, the CUSIP is invisible to the reader by design — we resolve each 13F
            CUSIP to the canonical ticker and company name. But the underlying identity is the
            CUSIP, not the ticker. When you read a HoldLens position, the SEC accession number +
            CUSIP combination is the citation-grade proof of what we&apos;re showing you.
          </p>
        </OurView>

        <p className="text-muted text-sm border-l-2 border-border pl-4 mt-6">
          Pure-reference encyclopedic entry for Form 13F (where CUSIPs are reported) on our sister
          site:{" "}
          <a href="https://secfilingdex.com/learn/13f/" className="text-brand underline" rel="noopener">
            secfilingdex.com/learn/13f
          </a>
          {" "}— SEC regulatory citation + every 13F variant.
        </p>

        <InvestingBooks
          heading="Foundational reading on securities analysis"
          sub="CUSIPs are the plumbing; these books are the architecture. Graham, Lynch, Munger — the foundations."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. See <a href="/methodology" className="underline">methodology</a> for
          how we parse CUSIPs from every 13F filing.
        </p>

        <CiteThisPage />
        <LearnReadNext currentSlug="cusip-explained" />

        <ShareStrip url="https://holdlens.com/learn/cusip-explained" title="What is a CUSIP?" />

        <AdSlot format="horizontal" priority="secondary" />

        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text mb-3">See CUSIP-tagged 13F holdings on HoldLens</h2>
          <p className="text-sm text-muted leading-relaxed">
            Every <a href="/" className="text-brand hover:underline">live position</a> on HoldLens
            is keyed to the SEC&apos;s reported CUSIP, with cross-references to ticker and issuer
            for human-readable navigation. Sister property cataloging every form type:{" "}
            <a href="https://secfilingdex.com/" className="text-brand hover:underline">SecFilingDex</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
