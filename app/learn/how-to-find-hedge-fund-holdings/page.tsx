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
  title: "How to find what hedge funds are buying (free, via SEC EDGAR)",
  description:
    "Hedge fund holdings are public. Here's the exact free way to find any manager's positions on SEC EDGAR — search, the 13F-HR information table, and how to read it — plus the limits you need to know before you act on it.",
  alternates: { canonical: "https://holdlens.com/learn/how-to-find-hedge-fund-holdings" },
  openGraph: {
    title: "How to find what hedge funds are buying",
    description:
      "The free, step-by-step way to pull any manager's holdings from SEC EDGAR — and the limits of the data.",
    url: "https://holdlens.com/learn/how-to-find-hedge-fund-holdings",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to find what hedge funds are buying",
    description: "The free, step-by-step way to pull holdings from SEC EDGAR.",
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
      { "@type": "ListItem", position: 3, name: "How to find what hedge funds are buying", item: "https://holdlens.com/learn/how-to-find-hedge-fund-holdings" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to find a hedge fund's holdings on SEC EDGAR",
    description: "Find any institutional manager's reported US-equity positions for free, using the SEC's EDGAR system.",
    step: [
      { "@type": "HowToStep", name: "Search the manager on EDGAR", text: "Go to SEC EDGAR full-text search and enter the management company's name (e.g., 'Berkshire Hathaway', 'Scion Asset Management')." },
      { "@type": "HowToStep", name: "Open the latest 13F-HR filing", text: "On the company's filing page, filter the filing type to 13F-HR — the holdings report. Open the most recent one." },
      { "@type": "HowToStep", name: "Read the information table", text: "The information table lists every reported position: issuer name, CUSIP, market value, and shares. This is the manager's long US-equity book as of quarter-end." },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "How to find what hedge funds are buying (free, via SEC EDGAR)",
    description:
      "Step-by-step guide to finding any institutional manager's reported holdings on SEC EDGAR, how to read the 13F-HR information table, and the limits of the data.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/how-to-find-hedge-fund-holdings",
    datePublished: "2026-05-29",
    dateModified: "2026-05-29",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "how to find hedge fund holdings",
      "what hedge funds are buying",
      "where do hedge funds report holdings",
      "SEC EDGAR 13F",
      "13F-HR information table",
      "track hedge fund stocks",
    ],
    citation: [
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=13F",
      "https://www.sec.gov/divisions/investment/13ffaq",
    ],
    about: [
      {
        "@type": "DefinedTerm",
        name: "SEC EDGAR",
        description:
          "The SEC's Electronic Data Gathering, Analysis, and Retrieval system — the free public database where all required corporate and institutional filings, including Form 13F, are published.",
      },
      {
        "@type": "DefinedTerm",
        name: "13F-HR information table",
        description:
          "The structured table inside a 13F holdings report that lists each reported position by issuer, CUSIP, market value, and share count.",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://holdlens.com/learn/how-to-find-hedge-fund-holdings#faq",
    mainEntity: [
      {
        "@type": "Question",
        name: "Where do hedge funds report their holdings?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "On SEC EDGAR, the SEC's free public filing database. Institutional managers with over $100 million in US-listed equities file Form 13F-HR each quarter, listing their long positions. Anyone can read it.",
        },
      },
      {
        "@type": "Question",
        name: "Is it free to see what hedge funds are buying?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Every 13F filing is free to read on SEC EDGAR. Aggregator tools charge for convenience, scoring, and history, but the raw data is public and costs nothing.",
        },
      },
      {
        "@type": "Question",
        name: "How current is hedge fund holdings data?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Not current. 13F holdings are filed within 45 days of quarter-end, so any position you see is 6 weeks to 4 months old, and short positions are never shown. Use the data for pattern recognition, not real-time copying.",
        },
      },
    ],
  },
];

export default function HowToFindHoldingsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/learn" className="text-xs text-muted hover:text-text">← Learn</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">How to find what hedge funds are buying</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Hedge fund holdings are <strong className="text-text">public and free</strong>. Any institutional manager with
          over $100M in US equities files a quarterly <strong className="text-text">Form 13F-HR</strong> on{" "}
          <a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=13F" className="text-brand underline" rel="noopener">SEC EDGAR</a>{" "}
          listing every long position. Search the manager&rsquo;s name, open the latest 13F-HR, and read the
          information table. The catches: the data is 6 weeks to 4 months old (45-day lag) and shows
          longs only — no shorts. Aggregators just save you the manual work and add scoring + history.
        </TldrCard>

        <p className="text-lg text-muted">
          You do not need a paid service to see what hedge funds own. Every position above the reporting
          threshold is filed with the SEC and published, for free, on <strong className="text-text">EDGAR</strong>.
        </p>

        <AuthorByline date="2026-05-29" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The free way, step by step</h2>
        <ol className="text-muted space-y-3 list-decimal list-inside">
          <li>
            <strong className="text-text">Search the manager on EDGAR.</strong> Open{" "}
            <a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=13F" className="text-brand underline" rel="noopener">SEC EDGAR</a>{" "}
            and search the <em>management company&rsquo;s</em> legal name (e.g., &ldquo;Berkshire Hathaway Inc&rdquo;,
            &ldquo;Scion Asset Management&rdquo;, &ldquo;Pershing Square Capital Management&rdquo;) — not the founder&rsquo;s name.
          </li>
          <li>
            <strong className="text-text">Filter to 13F-HR.</strong> On the filer&rsquo;s page, set the filing type to
            <strong className="text-text"> 13F-HR</strong> (the holdings report) and open the most recent one.
          </li>
          <li>
            <strong className="text-text">Read the information table.</strong> Every position is listed with issuer
            name, CUSIP, market value, and shares — the manager&rsquo;s long US-equity book as of quarter-end.
            (See <a href="/learn/how-to-read-a-13f" className="text-brand underline">how to read a 13F</a> for what each field means.)
          </li>
        </ol>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-10 mb-3">Why the raw filing is painful</h2>
        <p className="text-muted">
          EDGAR gives you one manager, one quarter, in a plain table keyed by CUSIP rather than ticker. To
          answer the questions people actually want — <em>what did this manager buy or sell versus last
          quarter? which stocks do several managers agree on? who is accumulating despite the headlines?</em>
          — you have to pull multiple quarters for multiple managers, map CUSIPs to tickers, and diff them
          by hand. That is the work an aggregator does for you.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Read this before you act on it</h2>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">It&rsquo;s late.</strong> The <a href="/learn/45-day-lag-explained" className="text-brand underline">45-day lag</a> means the trade is weeks to months old before you see it.</li>
          <li><strong className="text-text">It&rsquo;s long-only.</strong> <a href="/learn/why-13f-doesnt-show-shorts" className="text-brand underline">Shorts, swaps, and hedges are invisible</a>, so a visible long is not proof of a directional bet.</li>
          <li><strong className="text-text">Not every manager matters.</strong> Over 5,000 institutions file the same form; the signal is in <em>which</em> manager and how concentrated and persistent the position is.</li>
        </ul>

        <OurView>
          <p>
            We are not here to gatekeep public data — the steps above genuinely work, and for a single
            manager and quarter, EDGAR is all you need. What costs time is everything past that: CUSIP
            mapping, quarter-over-quarter diffs, cross-manager consensus, and separating concentrated
            conviction from index padding across thousands of filings.
          </p>
          <p>
            That is the only thing HoldLens adds: we parse every filing from a curated set of managers,
            map it, diff it, and score each position on a single −100..+100 ConvictionScore so you can read
            the pattern in seconds instead of an evening. The underlying data is, and always will be, free
            on EDGAR.
          </p>
        </OurView>

        <InvestingBooks
          heading="Foundational reading on securities analysis"
          sub="Finding the holdings is the easy part — knowing what to do with them is the discipline. Graham, Lynch, Munger taught it."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. Filing mechanics summarized from SEC EDGAR and the SEC 13F FAQ; verify against
          the primary sources linked above. See <a href="/methodology" className="underline">methodology</a> for how we parse and score every filing.
        </p>

        <CiteThisPage />
        <LearnReadNext currentSlug="how-to-find-hedge-fund-holdings" />

        <ShareStrip url="https://holdlens.com/learn/how-to-find-hedge-fund-holdings" title="How to find what hedge funds are buying" />

        <AdSlot format="horizontal" priority="secondary" />

        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text mb-3">Skip the manual work</h2>
          <p className="text-sm text-muted leading-relaxed">
            <a href="/" className="text-brand hover:underline">HoldLens</a>
            {" parses 30+ tracked managers' filings into one −100..+100 ConvictionScore. "}
            <a href="/best-now/" className="text-brand hover:underline">Highest conviction now</a>
            {", "}
            <a href="/consensus/" className="text-brand hover:underline">consensus picks</a>
            {", "}
            <a href="/new-positions/" className="text-brand hover:underline">new positions</a>
            {". Or learn more: "}
            <a href="/learn/what-is-a-13f" className="text-brand hover:underline">what is a 13F</a>
            {", "}
            <a href="/learn/how-to-read-a-13f" className="text-brand hover:underline">how to read one</a>
            {"."}
          </p>
        </section>
      </div>
    </div>
  );
}
