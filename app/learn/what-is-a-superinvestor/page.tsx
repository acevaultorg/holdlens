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
  title: "What is a superinvestor? Origin, meaning, how to track one",
  description:
    "A superinvestor is an investor with a long, audited record of beating the market — the term comes from Warren Buffett's 1984 essay 'The Superinvestors of Graham-and-Doddsville'. Here's the original definition, what the word means today, and how superinvestor portfolios are tracked through SEC 13F filings.",
  alternates: { canonical: "https://holdlens.com/learn/what-is-a-superinvestor" },
  openGraph: {
    title: "What is a superinvestor?",
    description:
      "From Buffett's 1984 Graham-and-Doddsville essay to modern 13F tracking — what the term means and who earns it.",
    url: "https://holdlens.com/learn/what-is-a-superinvestor",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "What is a superinvestor?",
    description: "The 1984 origin of the term, what it means today, and how superinvestor portfolios are tracked.",
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
      { "@type": "ListItem", position: 3, name: "What is a superinvestor?", item: "https://holdlens.com/learn/what-is-a-superinvestor" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "What is a superinvestor? Origin, meaning, and how to track one",
    description:
      "Plain-English guide to the term 'superinvestor' — its origin in Warren Buffett's 1984 Graham-and-Doddsville essay, what it means in modern usage, and how superinvestor portfolios are tracked through quarterly SEC 13F filings.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/what-is-a-superinvestor",
    datePublished: "2026-06-11",
    dateModified: "2026-06-11",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "superinvestor",
      "what is a superinvestor",
      "Superinvestors of Graham-and-Doddsville",
      "track superinvestor portfolios",
      "13F tracking",
      "value investing",
    ],
    citation: [
      "https://www8.gsb.columbia.edu/articles/columbia-business/superinvestors",
      "https://www.sec.gov/divisions/investment/13ffaq",
      "https://www.investor.gov/introduction-investing/investing-basics/glossary/form-13f",
    ],
    about: [
      {
        "@type": "DefinedTerm",
        name: "Superinvestor",
        description:
          "An informal term — not an SEC or legal category — for an investor with a long, publicly documented record of outperforming the market across multiple cycles. Popularized by Warren Buffett's 1984 essay 'The Superinvestors of Graham-and-Doddsville', which profiled value investors trained in the Benjamin Graham tradition.",
      },
      {
        "@type": "DefinedTerm",
        name: "The Superinvestors of Graham-and-Doddsville",
        description:
          "A 1984 essay by Warren Buffett, adapted from a talk at Columbia Business School marking the 50th anniversary of Graham and Dodd's Security Analysis. It presented the audited long-term records of value investors who shared one intellectual origin — buying businesses below appraised value — as a rebuttal to the claim that market-beating records are luck.",
      },
      {
        "@type": "DefinedTerm",
        name: "13F tracking",
        description:
          "Following an institutional manager's disclosed US long positions through their quarterly SEC Form 13F filings — the public mechanism that makes modern superinvestor tracking possible, subject to a 45-day lag and a long-only view.",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://holdlens.com/learn/what-is-a-superinvestor#faq",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is 'superinvestor' an official designation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. There is no SEC, FINRA, or legal definition of a superinvestor. It is an informal label for investors with long, publicly documented records of outperformance, popularized by Warren Buffett's 1984 essay 'The Superinvestors of Graham-and-Doddsville'.",
        },
      },
      {
        "@type": "Question",
        name: "How can I see what a superinvestor owns?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "If they manage at least $100 million in 13(f) securities, they must file SEC Form 13F within 45 days of each quarter-end. The filing lists their US long positions — but not short positions, foreign-listed holdings, or cash — and is always at least 45 days stale by the time it is public.",
        },
      },
      {
        "@type": "Question",
        name: "Who were the original superinvestors?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Buffett's 1984 essay presented the audited records of value investors trained in the Graham-and-Dodd tradition — including Walter Schloss, Tom Knapp of Tweedy, Browne, Bill Ruane of the Sequoia Fund, and Charlie Munger — each of whom compounded well above the market for one to three decades.",
        },
      },
    ],
  },
];

export default function WhatIsASuperinvestorPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/learn" className="text-xs text-muted hover:text-text">← Learn</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">What is a superinvestor?</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          A superinvestor is an investor with a <strong className="text-text">long, publicly documented record of
          beating the market</strong> — across cycles, not one lucky streak. The term comes from Warren
          Buffett&rsquo;s 1984 essay{" "}
          <a href="https://www8.gsb.columbia.edu/articles/columbia-business/superinvestors" className="text-brand underline" rel="noopener">
            &ldquo;The Superinvestors of Graham-and-Doddsville&rdquo;
          </a>. It is not an official designation — no regulator certifies it. Today the word usually
          means a manager whose portfolio you can follow through quarterly{" "}
          <a href="/learn/what-is-a-13f" className="text-brand underline">13F filings</a>, which is exactly
          what HoldLens does for its tracked cohort of 30.
        </TldrCard>

        <p className="text-lg text-muted">
          &ldquo;Superinvestor&rdquo; is an informal title that has to be <strong className="text-text">earned in public</strong>:
          a multi-decade, verifiable record of outperformance, usually built with a concentrated,
          low-turnover portfolio.
        </p>

        <AuthorByline date="2026-06-11" />

        <h2 className="text-2xl font-bold mt-10 mb-3">Where the word comes from (1984)</h2>
        <p className="text-muted">
          In 1984, Columbia Business School hosted a debate marking the 50th anniversary of Graham and
          Dodd&rsquo;s <em>Security Analysis</em>. The efficient-market side argued that market-beating records
          are statistical noise — flip enough coins and someone lands twenty heads. Buffett&rsquo;s response,
          later published as <em>The Superinvestors of Graham-and-Doddsville</em>, was an empirical
          counterpunch: he presented the audited records of value investors who all came from one
          &ldquo;intellectual village&rdquo; — students and colleagues of Benjamin Graham.
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside mt-3">
          <li><strong className="text-text">Walter Schloss</strong> — 28 years of compounding well above the S&amp;P, from a one-room office.</li>
          <li><strong className="text-text">Tom Knapp</strong> — Tweedy, Browne&rsquo;s deep-value partnership record.</li>
          <li><strong className="text-text">Bill Ruane</strong> — the Sequoia Fund, launched for Buffett&rsquo;s own partners in 1970.</li>
          <li><strong className="text-text">Charlie Munger</strong> — concentrated, volatile, and far ahead of the index over 14 years.</li>
        </ul>
        <p className="text-muted mt-3">
          Buffett&rsquo;s point was not that these records were miracles — it was that they shared a single
          explainable method: buying businesses for less than their appraised value. If the records were
          luck, they would not cluster in one intellectual lineage.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">What the word means today</h2>
        <p className="text-muted">
          Modern usage is broader than the Graham-and-Dodd village. When investors talk about
          &ldquo;tracking superinvestors&rdquo; today, they usually mean a few dozen institutional managers with
          three things in common:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside mt-3">
          <li><strong className="text-text">A long, audited record</strong> — typically 15+ years of public performance, across at least two full market cycles.</li>
          <li><strong className="text-text">Concentration</strong> — portfolios where the top 10 positions carry real weight, so each disclosed holding reflects a deliberate judgment rather than index padding.</li>
          <li><strong className="text-text">A traceable paper trail</strong> — they manage enough US equity (over $100&nbsp;million in 13(f) securities) that the SEC requires quarterly disclosure of their long book.</li>
        </ul>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-10 mb-3">How superinvestors are tracked in practice</h2>
        <p className="text-muted">
          The entire modern practice rests on one SEC form. Institutional managers exercising discretion
          over <strong className="text-text">$100&nbsp;million or more in 13(f) securities</strong> must file{" "}
          <a href="/learn/what-is-a-13f" className="text-brand underline">Form 13F</a> within 45 days of each
          quarter-end, listing their US long positions. That single requirement makes it possible to
          reconstruct — four times a year — what Buffett, Klarman, Ackman, Li Lu, or Tepper actually own.
        </p>
        <p className="text-muted mt-3">
          The same mechanism defines the limits of tracking. A 13F shows{" "}
          <a href="/learn/why-13f-doesnt-show-shorts" className="text-brand underline">no short positions</a>, no
          foreign-listed holdings, no cash, and no cost basis — and it is{" "}
          <a href="/learn/45-day-lag-explained" className="text-brand underline">at least 45 days stale</a> on the
          day it becomes public. Anyone presenting 13F data as a real-time copy-trading feed is
          overselling it; see <a href="/learn/copy-trading-myth" className="text-brand underline">the copy-trading myth</a>.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">How HoldLens curates its cohort of 30</h2>
        <p className="text-muted">
          There are thousands of 13F filers; following all of them is noise. HoldLens tracks a fixed
          cohort of <strong className="text-text">30 managers</strong> selected on the superinvestor criteria above:
          multi-decade records, genuinely concentrated books, low turnover, and clean 13F traceability.
          Every quarter, their filings are parsed and aggregated into the{" "}
          <a href="/learn/conviction-score-explained" className="text-brand underline">ConvictionScore</a> — a
          descriptive −100&nbsp;to&nbsp;+100 measure of net cohort buying or selling per stock. It describes
          what the cohort <em>did</em>; it is not a recommendation of what anyone should do.
        </p>

        <OurView>
          <p>
            The word &ldquo;superinvestor&rdquo; gets diluted when it is applied to anyone who had three good
            years. We hold the 1984 bar: the record has to be long enough — and built through enough
            different markets — that skill is the only plausible explanation left standing.
          </p>
          <p>
            That bar is also why we keep the tracked cohort small. Thirty managers with real records and
            concentrated books produce a readable consensus signal. Three hundred filers would produce an
            index — and an index of everyone is information about no one.
          </p>
        </OurView>

        <InvestingBooks
          heading="Read the superinvestors in their own words"
          sub="The records in Buffett's 1984 essay all trace back to one book — Graham. These are the primary texts the tracked cohort actually learned from."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. Historical records summarized from Warren Buffett&rsquo;s 1984 essay
          &ldquo;The Superinvestors of Graham-and-Doddsville&rdquo; and SEC Form 13F guidance; verify against the
          primary sources linked above. See <a href="/methodology" className="underline">methodology</a> for how the
          HoldLens cohort is selected and scored.
        </p>

        <CiteThisPage />
        <LearnReadNext currentSlug="what-is-a-superinvestor" />

        <ShareStrip url="https://holdlens.com/learn/what-is-a-superinvestor" title="What is a superinvestor?" />

        <AdSlot format="horizontal" priority="secondary" />

        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text mb-3">Follow the tracked cohort on HoldLens</h2>
          <p className="text-sm text-muted leading-relaxed">
            <a href="/investor/" className="text-brand hover:underline">All 30 tracked superinvestors</a>
            {" — every manager's current 13F portfolio, quarterly changes, and concentration profile. "}
            <a href="/leaderboard/" className="text-brand hover:underline">Manager leaderboard</a>
            {". Related explainers: "}
            <a href="/learn/superinvestor-handbook" className="text-brand hover:underline">the Superinvestor Handbook</a>
            {", "}
            <a href="/learn/warren-buffett-method" className="text-brand hover:underline">the Warren Buffett method</a>
            {", "}
            <a href="/learn/do-hedge-fund-signals-work" className="text-brand hover:underline">do 13F signals actually predict returns?</a>
            {"."}
          </p>
        </section>
      </div>
    </div>
  );
}
