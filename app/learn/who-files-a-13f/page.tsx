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
  title: "Who has to file a 13F? The $100 million threshold explained",
  description:
    "Any institutional investment manager with over $100 million in 13(f) securities must file a 13F within 45 days of quarter-end. Here's exactly who qualifies, how the threshold is measured, and who is exempt.",
  alternates: { canonical: "https://holdlens.com/learn/who-files-a-13f" },
  openGraph: {
    title: "Who has to file a 13F?",
    description:
      "The $100 million threshold, who counts as an institutional investment manager, and the 45-day deadline — explained in plain English.",
    url: "https://holdlens.com/learn/who-files-a-13f",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Who has to file a 13F?",
    description: "The $100 million threshold and the 45-day deadline, explained.",
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
      { "@type": "ListItem", position: 3, name: "Who has to file a 13F?", item: "https://holdlens.com/learn/who-files-a-13f" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Who has to file a 13F? The $100 million threshold explained",
    description:
      "Plain-English guide to Form 13F filing requirements: the $100 million threshold, the definition of an institutional investment manager, and the 45-day deadline.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/who-files-a-13f",
    datePublished: "2026-05-29",
    dateModified: "2026-05-29",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "13F filing requirements",
      "13F threshold",
      "$100 million threshold",
      "institutional investment manager",
      "who has to file a 13F",
      "Rule 13f-1",
      "Section 13(f)",
    ],
    citation: [
      "https://www.sec.gov/divisions/investment/13ffaq",
      "https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.13f-1",
      "https://www.sec.gov/divisions/investment/13flists.htm",
    ],
    about: [
      {
        "@type": "DefinedTerm",
        name: "Institutional investment manager",
        description:
          "Under Section 13(f)(6)(A) of the Securities Exchange Act of 1934, an entity that invests in or buys and sells securities for its own account, or a natural person or entity that exercises investment discretion over the account of any other person. Includes hedge funds, mutual fund advisers, pension funds, banks, insurance companies, and registered investment advisers.",
      },
      {
        "@type": "DefinedTerm",
        name: "$100 million Section 13(f) threshold",
        description:
          "The reporting threshold in Rule 13f-1: a manager that exercises investment discretion over $100 million or more in Section 13(f) securities on the last trading day of any month of a calendar year must file Form 13F for that year's fourth quarter and the first three quarters of the following year.",
      },
      {
        "@type": "DefinedTerm",
        name: "Section 13(f) securities",
        description:
          "The class of securities that count toward the threshold and must be disclosed — primarily US exchange-listed and NASDAQ-quoted equities, certain equity options and warrants, shares of closed-end funds and ETFs, and some convertibles. The SEC publishes the Official List of Section 13(f) Securities each quarter.",
      },
      {
        "@type": "DefinedTerm",
        name: "Form 13F-NT",
        description:
          "A notice filing used when an institutional manager's Section 13(f) holdings are reported on another manager's Form 13F-HR, rather than a holdings report itself.",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://holdlens.com/learn/who-files-a-13f#faq",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do I have to file a 13F?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Only if you exercise investment discretion over $100 million or more in Section 13(f) securities (mostly US-listed stocks). An individual investing their own money under that threshold does not file a 13F. The obligation applies to institutional investment managers — funds, advisers, banks, insurers — not to ordinary retail accounts.",
        },
      },
      {
        "@type": "Question",
        name: "What is the 13F filing threshold?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "$100 million in Section 13(f) securities, measured on the last trading day of any month in a calendar year. Crossing it triggers a filing for that year's Q4 and the following three quarters, each due within 45 days of quarter-end.",
        },
      },
      {
        "@type": "Question",
        name: "Is the 13F threshold still $100 million?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The SEC proposed raising it to $3.5 billion in 2020, but that proposal was not adopted. The threshold has remained $100 million since 1978.",
        },
      },
    ],
  },
];

export default function WhoFiles13FPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/learn" className="text-xs text-muted hover:text-text">← Learn</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">Who has to file a 13F?</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Any <strong className="text-text">institutional investment manager</strong> that exercises
          investment discretion over <strong className="text-text">$100 million or more</strong> in
          Section 13(f) securities must file Form 13F with the SEC within{" "}
          <strong className="text-text">45 days</strong> of each quarter-end (
          <a href="https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.13f-1" className="text-brand underline" rel="noopener">Rule 13f-1</a>).
          That is a low bar — it captures hedge funds, mutual fund advisers, pension funds, banks,
          insurers, and RIAs alike, so well over 5,000 managers file every quarter. An individual
          trading their own account below $100M does not file one.
        </TldrCard>

        <p className="text-lg text-muted">
          A 13F must be filed by any <strong className="text-text">institutional investment manager</strong>{" "}
          with over <strong className="text-text">$100 million</strong> in US-listed equity assets under
          its investment discretion. It is a filing requirement triggered by size, not by fund type.
        </p>

        <AuthorByline date="2026-05-29" />

        <h2 className="text-2xl font-bold mt-10 mb-3">Who counts as an &ldquo;institutional investment manager&rdquo;?</h2>
        <p className="text-muted">
          The term comes from <a href="https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.13f-1" className="text-brand underline" rel="noopener">Section 13(f)</a> of the
          Securities Exchange Act of 1934. It is broader than &ldquo;hedge fund.&rdquo; It covers any entity that
          invests in securities for its own account, plus anyone exercising investment discretion over
          someone else&rsquo;s account, including:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>Hedge funds and their management companies (Berkshire, Pershing Square, Scion, Baupost)</li>
          <li>Mutual fund and ETF advisers</li>
          <li>Pension funds and endowments</li>
          <li>Banks, trust companies, and insurance companies</li>
          <li>Registered investment advisers (RIAs)</li>
        </ul>
        <p className="text-muted mt-3">
          This is why HoldLens can track <a href="/" className="text-brand underline">30+ superinvestors</a> at all:
          they are legally required to publish their long US-equity book four times a year.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">How the $100 million threshold actually works</h2>
        <p className="text-muted">
          The trigger is not your assets on December 31. Under{" "}
          <a href="https://www.sec.gov/divisions/investment/13ffaq" className="text-brand underline" rel="noopener">Rule 13f-1</a>, a manager
          must file if it held <strong className="text-text">$100 million or more in Section 13(f) securities on the
          last trading day of any month</strong> during a calendar year. Crossing it once means:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>You file a 13F for that year&rsquo;s <strong className="text-text">fourth quarter</strong>, and</li>
          <li>You keep filing for the <strong className="text-text">first three quarters of the following year</strong> — even if you drop back below $100M.</li>
        </ul>
        <p className="text-muted mt-3">
          Only <strong className="text-text">Section 13(f) securities</strong> count toward the $100M — not bonds, not cash, not
          private holdings, not non-US stocks. The SEC publishes the{" "}
          <a href="https://www.sec.gov/divisions/investment/13flists.htm" className="text-brand underline" rel="noopener">Official List of Section 13(f) Securities</a>{" "}
          each quarter so managers know exactly what qualifies.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-10 mb-3">When is it due?</h2>
        <p className="text-muted">
          Within <strong className="text-text">45 days after each calendar quarter-end</strong> — the same deadlines that
          create the famous 45-day lag:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>Q1 (Jan&ndash;Mar) → due May 15</li>
          <li>Q2 (Apr&ndash;Jun) → due August 14</li>
          <li>Q3 (Jul&ndash;Sep) → due November 14</li>
          <li>Q4 (Oct&ndash;Dec) → due February 14</li>
        </ul>
        <p className="text-muted mt-3">
          More on why that gap matters: <a href="/learn/45-day-lag-explained" className="text-brand underline">the 45-day lag explained</a>.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">13F-HR, 13F-NT, and amendments</h2>
        <p className="text-muted">A filer&rsquo;s obligation can show up under different form types:</p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">13F-HR</strong> — the holdings report; the actual position list.</li>
          <li><strong className="text-text">13F-NT</strong> — a notice filing, used when the manager&rsquo;s holdings are reported on <em>another</em> manager&rsquo;s 13F-HR (common with sub-advisers).</li>
          <li><strong className="text-text">13F-HR/A</strong> — an amendment correcting or adding to a prior holdings report.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Confidential treatment — the legal way to hide a position</h2>
        <p className="text-muted">
          A filer can request <strong className="text-text">confidential treatment</strong> to delay disclosing specific
          positions, typically while it is still accumulating a stake and wants to avoid being
          front-run. The SEC reviews these requests; Berkshire Hathaway has used the mechanism more
          than once. Once granted time expires (or the request is denied), the position appears in an
          amended filing.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Who does <em>not</em> file a 13F?</h2>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>Individuals managing their own money below $100M — the vast majority of retail investors.</li>
          <li>Managers whose 13(f) holdings never cross $100M on a month-end.</li>
          <li>Funds holding only non-US equities, bonds, crypto, or private assets — none of those are 13(f) securities.</li>
          <li>Short-only or derivatives-only books — 13Fs disclose long equity positions, so a manager with no reportable long 13(f) securities has nothing to report.</li>
        </ul>

        <OurView>
          <p>
            The $100 million threshold is the single most underrated fact about 13F data. It is
            extraordinarily low for an institutional bar set in 1978 and never indexed to inflation,
            so the filer pool is enormous and noisy — thousands of pension sub-advisers and index-hugging
            RIAs file the exact same form as Buffett. The signal is not &ldquo;an institution filed,&rdquo; it is
            <em> which</em> institution, and how concentrated and persistent its book is.
          </p>
          <p>
            That is why HoldLens does not treat every 13F filer equally. We curate a short list of
            managers with demonstrated skill and conviction, then score each holding by portfolio
            weight and multi-quarter trend — separating the handful of filings worth reading from the
            5,000+ that are mostly index padding.
          </p>
        </OurView>

        <InvestingBooks
          heading="Foundational reading on securities analysis"
          sub="Now that you know who has to disclose, the books below are where the disciplined filers learned to allocate — Graham, Lynch, Munger."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. Filing requirements summarized from SEC Rule 13f-1 and the SEC 13F FAQ;
          verify against the primary sources linked above. See <a href="/methodology" className="underline">methodology</a> for how we parse
          and score every filing.
        </p>

        <CiteThisPage />
        <LearnReadNext currentSlug="who-files-a-13f" />

        <ShareStrip url="https://holdlens.com/learn/who-files-a-13f" title="Who has to file a 13F?" />

        <AdSlot format="horizontal" priority="secondary" />

        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text mb-3">See who actually files, live on HoldLens</h2>
          <p className="text-sm text-muted leading-relaxed">
            <a href="/" className="text-brand hover:underline">Live 13F tracker</a>
            {" — every quarterly filing from 30+ tracked managers, scored on the −100..+100 ConvictionScore. "}
            <a href="/manager-rankings/" className="text-brand hover:underline">Manager rankings</a>
            {", "}
            <a href="/new-positions/" className="text-brand hover:underline">new positions</a>
            {". Related explainers: "}
            <a href="/learn/what-is-a-13f" className="text-brand hover:underline">what is a 13F</a>
            {", "}
            <a href="/learn/how-to-read-a-13f" className="text-brand hover:underline">how to read one</a>
            {", "}
            <a href="/learn/45-day-lag-explained" className="text-brand hover:underline">the 45-day lag</a>
            {"."}
          </p>
        </section>
      </div>
    </div>
  );
}
