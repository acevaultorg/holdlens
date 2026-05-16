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
  title: "What is SEC EDGAR? — Plain English guide for investors",
  description:
    "EDGAR is the SEC's public filing database. Every 10-K, 13F, Form 4, and 8-K filed since 1993 lives there for free. Here's how to use it, what to ignore, and where it falls short.",
  alternates: { canonical: "https://holdlens.com/learn/edgar-explained" },
  openGraph: {
    title: "What is SEC EDGAR?",
    description:
      "EDGAR is the SEC's public filing database. Every 10-K, 13F, Form 4, and 8-K filed since 1993 lives there for free.",
    url: "https://holdlens.com/learn/edgar-explained",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "What is SEC EDGAR?",
    description:
      "EDGAR is the SEC's public filing database — every 10-K, 13F, Form 4, 8-K since 1993, free.",
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
      { "@type": "ListItem", position: 3, name: "What is SEC EDGAR?", item: "https://holdlens.com/learn/edgar-explained" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "What is SEC EDGAR? — Plain English guide for investors",
    description: "Plain English explainer of the SEC's public filing database.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/edgar-explained",
    datePublished: "2026-05-16",
    dateModified: "2026-05-16",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    about: [
      {
        "@type": "DefinedTerm",
        name: "EDGAR",
        description:
          "Electronic Data Gathering, Analysis, and Retrieval. The SEC's public-filing database, mandatory for substantially all corporate filings since May 1996.",
      },
      {
        "@type": "DefinedTerm",
        name: "Accession Number",
        description:
          "EDGAR's primary key for every filing. 18-digit format: filer CIK (10 digits) + year (2) + sequence (6). Stable, citation-grade, never re-used.",
      },
      {
        "@type": "DefinedTerm",
        name: "CIK",
        description:
          "Central Index Key. The 10-digit unique identifier the SEC assigns to every filer (corporation, fund, individual). Permanent across the filer's lifetime in the regulatory system.",
      },
      {
        "@type": "DefinedTerm",
        name: "Full-Text Search",
        description:
          "EDGAR's free-text search across filing bodies, available at efts.sec.gov. Covers filings since 2001. The single most underused free research tool in the public-markets universe.",
      },
    ],
  },
];

export default function EdgarExplainedPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">What is SEC EDGAR?</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          EDGAR is the U.S. Securities and Exchange Commission&apos;s public filing database — the
          single source of truth for every 10-K, 10-Q, 13F, Form 4, 8-K, S-1, and ~200 other form
          types filed by public companies, mutual funds, and registered investment advisers since
          1993. It is{" "}
          <a
            href="https://www.sec.gov/edgar"
            className="text-brand underline"
            rel="noopener"
          >
            free, public, and machine-readable
          </a>{" "}— a remarkable piece of regulatory infrastructure. Every fact on HoldLens traces back
          to an EDGAR accession number. Learning to read EDGAR directly is the highest-leverage skill
          in public-markets research.
        </TldrCard>

        <p className="text-lg text-muted">
          EDGAR stands for{" "}
          <strong className="text-text">Electronic Data Gathering, Analysis, and Retrieval</strong>.
          It is the SEC&apos;s public filing system, mandatory for substantially all corporate filings
          since May 1996, and the canonical source for every disclosure HoldLens analyzes.
        </p>

        <AuthorByline date="2026-05-16" />

        <h2 className="text-2xl font-bold mt-10 mb-3">A 60-second tour of EDGAR</h2>
        <p className="text-muted">
          Open{" "}
          <a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany" className="text-brand underline" rel="noopener">
            sec.gov/cgi-bin/browse-edgar
          </a>{" "}
          and type any company name. EDGAR returns the filer&apos;s page, showing every filing in
          reverse chronological order. Click any filing to see the underlying documents — typically
          an HTML version of the form, plus XML and JSON twins. Every page has a permanent URL keyed
          by <strong className="text-text">accession number</strong>, the 18-digit citation-grade
          identifier you&apos;ll see throughout HoldLens.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">The three EDGAR surfaces worth knowing</h2>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>
            <strong className="text-text">Filer page</strong> —{" "}
            <code className="text-xs">/cgi-bin/browse-edgar?action=getcompany&amp;CIK=X</code>. Every
            filing the entity has ever submitted, filterable by form type.
          </li>
          <li>
            <strong className="text-text">Full-text search</strong> —{" "}
            <code className="text-xs">efts.sec.gov</code>. Search across filing bodies (not just
            metadata). Underused: this is how you find every 10-K that mentions &quot;customer
            concentration&quot; or every 8-K with &quot;CFO transition&quot;.
          </li>
          <li>
            <strong className="text-text">Real-time feed</strong> —{" "}
            <code className="text-xs">/Archives/edgar/usgaap.rss</code> and form-type-specific feeds.
            Every new filing appears within ~30 seconds of SEC ingest.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Where EDGAR falls short</h2>
        <p className="text-muted">
          EDGAR is a delivery layer, not an analytics layer. It does not:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>Aggregate positions across quarters (every 13F is a snapshot in isolation)</li>
          <li>Compare filings across filers (no &quot;show me every fund that owns AAPL&quot;)</li>
          <li>Score signal strength (every disclosure has equal visual weight)</li>
          <li>Surface time-series (changes are not pre-computed; you diff manually)</li>
          <li>Filter the noise (every restated, amended, and withdrawn filing remains visible)</li>
        </ul>
        <p className="text-muted mt-3">
          Tools like HoldLens and{" "}
          <a href="https://secfilingdex.com/" className="text-brand underline" rel="noopener">
            SecFilingDex
          </a>{" "}exist because EDGAR&apos;s raw surface is unfit for time-series, cross-filer, or
          signal-graded research. EDGAR is the data; the value is in how you arrange it.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-10 mb-3">How HoldLens uses EDGAR</h2>
        <p className="text-muted">
          Every position, every transaction, every score on HoldLens traces back to an EDGAR
          accession number. We pull the raw XML or JSON twin for each filing as it&apos;s ingested,
          parse the structured fields (filer, holdings, transaction details), and arrange them in
          the dimensions retail readers actually want: by quarter, by manager, by ticker, by
          conviction direction. The source URL is one click away on every result page; you can
          always verify what we&apos;ve computed against the underlying SEC document.
        </p>

        <OurView>
          <p>
            EDGAR is one of the great unsung successes of federal regulatory infrastructure. It
            launched in 1984 as a pilot, became mandatory for all filers in May 1996, and has
            operated essentially continuously ever since with negligible downtime. Every public-
            markets researcher in America uses it. Every quant fund consumes it. Every retail
            investor with the patience to learn it gets access to the exact same primary-source
            data that hedge funds pay six-figure data licenses to acquire pre-parsed.
          </p>
          <p>
            The disclosure ethos of the U.S. capital markets — full, fair, prompt — is implemented
            primarily through EDGAR. When you read a 10-K on sec.gov, you are exercising the
            specific civic infrastructure that distinguishes U.S. markets from most of the world.
            The data is free; the work is reading it.
          </p>
        </OurView>

        <p className="text-muted text-sm border-l-2 border-border pl-4 mt-6">
          Pure-reference encyclopedic entries for every SEC form type on our sister site:{" "}
          <a href="https://secfilingdex.com/learn/" className="text-brand underline" rel="noopener">
            secfilingdex.com/learn
          </a>
          {" "}— catalog + regulatory citations for 10-K, 10-Q, 8-K, 13F, Form 4, S-1, 11-K, 13H,
          NT 10-K, F-1, Form 144, DEF 14A, and more.
        </p>

        <InvestingBooks
          heading="Foundational reading on securities analysis"
          sub="EDGAR is where the documents live; these books are how to read what's inside them. Graham, Lynch, Munger — the foundations."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. See <a href="/methodology" className="underline">methodology</a> for
          how we parse and score every EDGAR filing.
        </p>

        <CiteThisPage />
        <LearnReadNext currentSlug="edgar-explained" />

        <ShareStrip url="https://holdlens.com/learn/edgar-explained" title="What is SEC EDGAR?" />

        <AdSlot format="horizontal" priority="secondary" />

        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text mb-3">See EDGAR filings live on HoldLens</h2>
          <p className="text-sm text-muted leading-relaxed">
            <a href="/" className="text-brand hover:underline">Live ConvictionScore</a>
            {" — every EDGAR-sourced 13F filing from 30 tracked managers, scored on the −100..+100 scale. "}
            <a href="/manager-rankings/" className="text-brand hover:underline">Manager rankings</a>
            {", "}
            <a href="/big-bets/" className="text-brand hover:underline">biggest bets</a>
            {", "}
            <a href="/new-positions/" className="text-brand hover:underline">new positions</a>
            {". Sister property cataloging every filing variant: "}
            <a href="https://secfilingdex.com/" className="text-brand hover:underline">SecFilingDex</a>
            {"."}
          </p>
        </section>
      </div>
    </div>
  );
}
