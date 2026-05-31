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
  title: "What is a corporate insider? SEC definition, plain English",
  description:
    "An insider is a company's officer, director, or 10%+ owner — they must report their own-company trades on SEC Form 4 within 2 business days. Here's the exact definition, the Form 3/4/5 rules, and how legal insider trading differs from illegal.",
  alternates: { canonical: "https://holdlens.com/learn/what-is-an-insider" },
  openGraph: {
    title: "What is a corporate insider?",
    description:
      "Officers, directors, and 10%+ owners — who counts, what they must report, and how legal insider trading differs from illegal.",
    url: "https://holdlens.com/learn/what-is-an-insider",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "What is a corporate insider?",
    description: "Officers, directors, 10%+ owners — the SEC definition explained.",
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
      { "@type": "ListItem", position: 3, name: "What is a corporate insider?", item: "https://holdlens.com/learn/what-is-an-insider" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "What is a corporate insider? SEC definition, plain English",
    description:
      "Plain-English guide to who counts as a corporate insider under SEC rules, the Form 3/4/5 reporting obligations, and the line between legal and illegal insider trading.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/what-is-an-insider",
    datePublished: "2026-05-29",
    dateModified: "2026-05-29",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "corporate insider",
      "what is an insider",
      "Section 16",
      "Form 4",
      "officer director 10% owner",
      "insider trading",
      "material non-public information",
    ],
    citation: [
      "https://www.sec.gov/about/forms/form4data.pdf",
      "https://www.investor.gov/introduction-investing/investing-basics/glossary/insider-trading",
      "https://www.law.cornell.edu/uscode/text/15/78p",
    ],
    about: [
      {
        "@type": "DefinedTerm",
        name: "Corporate insider",
        description:
          "Under Section 16 of the Securities Exchange Act of 1934, an officer or director of a public company, or a beneficial owner of more than 10% of a registered class of the company's equity securities. The securities laws also treat people with a fiduciary duty and access to material non-public information (e.g., lawyers, bankers, consultants) as temporary insiders.",
      },
      {
        "@type": "DefinedTerm",
        name: "Form 4",
        description:
          "The SEC form a Section 16 insider must file within two business days of a change in their ownership of the company's stock — a buy, sale, option exercise, or grant. The basis for HoldLens InsiderScore tracking.",
      },
      {
        "@type": "DefinedTerm",
        name: "Material non-public information (MNPI)",
        description:
          "Information that a reasonable investor would consider important to a trading decision and that has not been disclosed to the public. Trading on MNPI in breach of a duty is illegal insider trading.",
      },
      {
        "@type": "DefinedTerm",
        name: "Rule 10b5-1 plan",
        description:
          "A pre-arranged written trading plan that sets the amount, price, and timing of future trades in advance, providing insiders an affirmative defense against insider-trading liability for trades made under it.",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://holdlens.com/learn/what-is-an-insider#faq",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who counts as a corporate insider?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Under SEC Section 16, a company's officers, its directors, and any beneficial owner of more than 10% of a class of its equity securities. People with a fiduciary duty and access to material non-public information — lawyers, bankers, accountants, consultants — are treated as temporary insiders for insider-trading purposes.",
        },
      },
      {
        "@type": "Question",
        name: "Is insider trading legal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Insiders are allowed to buy and sell their own company's stock — it is legal as long as they are not trading on material non-public information and they report each trade on SEC Form 4 within two business days. Trading on undisclosed material information in breach of a duty is illegal insider trading.",
        },
      },
      {
        "@type": "Question",
        name: "When must an insider report a trade?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Within two business days of the transaction, on Form 4. Insiders also file Form 3 when they first become an insider and Form 5 for certain deferred or exempt transactions annually.",
        },
      },
    ],
  },
];

export default function WhatIsAnInsiderPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/learn" className="text-xs text-muted hover:text-text">← Learn</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">What is a corporate insider?</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          A corporate insider is a company&rsquo;s <strong className="text-text">officer, director, or 10%+ owner</strong> (SEC
          {" "}<a href="https://www.law.cornell.edu/uscode/text/15/78p" className="text-brand underline" rel="noopener">Section 16</a>).
          Insiders are allowed to trade their own company&rsquo;s stock — legally — but they must report
          every trade on <strong className="text-text">Form 4 within two business days</strong>. What&rsquo;s illegal is
          trading on material non-public information in breach of a duty. Those public Form 4 reports
          are exactly what HoldLens reads to track insider buying and selling.
        </TldrCard>

        <p className="text-lg text-muted">
          A corporate insider is someone with a formal relationship to a public company that gives them
          a duty to its shareholders: its <strong className="text-text">officers, directors, and beneficial owners of more
          than 10%</strong> of a class of its stock.
        </p>

        <AuthorByline date="2026-05-29" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The three core insiders (Section 16)</h2>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">Officers</strong> — CEO, CFO, president, principal accounting officer, and other policy-making executives.</li>
          <li><strong className="text-text">Directors</strong> — every member of the board.</li>
          <li><strong className="text-text">10%+ beneficial owners</strong> — any person or entity holding more than 10% of a registered class of the company&rsquo;s equity.</li>
        </ul>
        <p className="text-muted mt-3">
          These are <em>statutory</em> insiders under <a href="https://www.law.cornell.edu/uscode/text/15/78p" className="text-brand underline" rel="noopener">Section 16</a> of the
          Securities Exchange Act of 1934. They carry ongoing reporting duties whether or not they ever
          trade on inside information.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Temporary insiders</h2>
        <p className="text-muted">
          The securities laws also treat outsiders with a <strong className="text-text">fiduciary duty and access to
          material non-public information</strong> as insiders for trading purposes — company lawyers,
          investment bankers, accountants, and consultants. If they trade on what they learn through that
          relationship, the same insider-trading rules apply.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-10 mb-3">What insiders must report</h2>
        <p className="text-muted">Section 16 insiders file three SEC forms:</p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">Form 3</strong> — initial statement, filed when someone first becomes an insider.</li>
          <li><strong className="text-text">Form 4</strong> — filed within <strong className="text-text">two business days</strong> of any change in ownership: a buy, a sale, an option exercise, or a grant.</li>
          <li><strong className="text-text">Form 5</strong> — an annual catch-up for certain deferred or exempt transactions.</li>
        </ul>
        <p className="text-muted mt-3">
          Form 4 is the one that matters for signal: a near-real-time, public record of what the people
          who run the company are doing with their own money. See{" "}
          <a href="/learn/form-4-vs-13f" className="text-brand underline">Form 4 vs 13F</a> for how insider
          filings differ from institutional ones.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Legal vs illegal insider trading</h2>
        <p className="text-muted">
          A common misconception is that &ldquo;insider trading&rdquo; is always illegal. It is not. Insiders buy
          and sell their own stock constantly, and it is perfectly legal — <em>as long as</em> they are not
          trading on <strong className="text-text">material non-public information (MNPI)</strong> in breach of a duty, and they
          disclose the trade on Form 4. Many insiders use a{" "}
          <strong className="text-text">Rule 10b5-1 plan</strong> — a pre-scheduled trading plan set up in advance — which
          provides a legal defense by removing their discretion over timing.
        </p>
        <p className="text-muted mt-3">
          <strong className="text-text">Illegal</strong> insider trading is the narrower act of trading on undisclosed material
          information while owing a duty to keep it confidential.
        </p>

        <OurView>
          <p>
            Not all insider trades carry equal information. A scheduled 10b5-1 sale by a CFO is mostly
            noise — diversification, tax bills, option expiries. An <em>open-market, discretionary purchase</em>,
            especially when several insiders at the same company buy within days of each other, is the
            rarer and more interesting event: insiders almost never have to buy, so when they choose to,
            it reflects a view.
          </p>
          <p>
            That is why HoldLens&rsquo;s InsiderScore weights trades by the insider&rsquo;s role, by whether the
            transaction was a discretionary buy or a routine sale, by recency, and by clustering — rather
            than counting every Form 4 the same. The goal is to separate the handful of meaningful signals
            from the thousands of mechanical filings.
          </p>
        </OurView>

        <InvestingBooks
          heading="Foundational reading on securities analysis"
          sub="Insider filings are one input among many. The books below are where disciplined investors learned to weigh evidence — Graham, Lynch, Munger."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. Definitions summarized from SEC Section 16 and SEC Form 3/4/5 guidance;
          verify against the primary sources linked above. See <a href="/methodology" className="underline">methodology</a> for how we parse
          and score every filing.
        </p>

        <CiteThisPage />
        <LearnReadNext currentSlug="what-is-an-insider" />

        <ShareStrip url="https://holdlens.com/learn/what-is-an-insider" title="What is a corporate insider?" />

        <AdSlot format="horizontal" priority="secondary" />

        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text mb-3">Track insider trades live on HoldLens</h2>
          <p className="text-sm text-muted leading-relaxed">
            <a href="/insiders/" className="text-brand hover:underline">Form 4 insider firehose</a>
            {" — every CEO/CFO/director trade, scored by role, action, and clustering on the InsiderScore. "}
            <a href="/insiders/live/" className="text-brand hover:underline">Recent insider activity</a>
            {". Related explainers: "}
            <a href="/learn/form-4-vs-13f" className="text-brand hover:underline">Form 4 vs 13F</a>
            {", "}
            <a href="/learn/insider-score-explained" className="text-brand hover:underline">how InsiderScore works</a>
            {", "}
            <a href="/learn/congressional-stock-trading-stock-act" className="text-brand hover:underline">congressional trading</a>
            {"."}
          </p>
        </section>
      </div>
    </div>
  );
}
