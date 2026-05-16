import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import InvestingBooks from "@/components/InvestingBooks";
import AuthorByline from "@/components/AuthorByline";
import ShareStrip from "@/components/ShareStrip";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import LearnReadNext from "@/components/LearnReadNext";
import FamousTradesBlock from "@/components/FamousTradesBlock";
import TldrCard from "@/components/learn/TldrCard";
import OurView from "@/components/learn/OurView";
import CiteThisPage from "@/components/learn/CiteThisPage";

export const metadata: Metadata = {
  title: "Michael Burry's Big Short — the 2005-2008 CDS trade that made Scion Capital",
  description:
    "Between 2005 and 2007, Michael Burry's Scion Capital purchased credit default swaps on subprime mortgage bonds. The trade returned roughly 489% net to investors when the housing market collapsed in 2007-2008.",
  alternates: { canonical: "https://holdlens.com/learn/burry-big-short" },
  openGraph: {
    title: "Michael Burry's Big Short",
    description:
      "Scion Capital's 2005-2008 housing CDS trade — historical analysis from public records.",
    url: "https://holdlens.com/learn/burry-big-short",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Michael Burry's Big Short",
    description: "The 2005-2008 CDS trade that made Scion Capital.",
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
      { "@type": "ListItem", position: 3, name: "Burry Big Short", item: "https://holdlens.com/learn/burry-big-short" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Michael Burry's Big Short — the 2005-2008 CDS trade that made Scion Capital",
    description: "Historical analysis of Michael Burry's housing-market short trade.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/burry-big-short",
    datePublished: "2026-05-16",
    dateModified: "2026-05-16",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "Michael Burry",
      "Scion Capital",
      "Big Short",
      "Credit Default Swap",
      "subprime mortgage",
      "2008 financial crisis",
      "Form 13F invisibility",
      "synthetic short",
    ],
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "HoldLens famous trades — public-record case studies",
      url: "https://holdlens.com/collections/famous-trades",
    },
    citation: [
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001296576&type=13F-HR",
      "https://en.wikipedia.org/wiki/Michael_Burry",
      "https://en.wikipedia.org/wiki/The_Big_Short_(book)",
    ],
    about: [
      {
        "@type": "Person",
        name: "Michael Burry",
        url: "https://holdlens.com/investor/michael-burry",
      },
      {
        "@type": "Organization",
        name: "Scion Capital",
      },
      {
        "@type": "DefinedTerm",
        name: "Credit Default Swap (CDS)",
        description:
          "A derivative contract that pays out if a specific bond defaults. Scion's 2005-2007 CDS positions on subprime mortgage tranches were the structural vehicle for the Big Short — the trade itself was a synthetic short via insurance on collapsing collateral, not a stock short.",
      },
      {
        "@type": "DefinedTerm",
        name: "Subprime mortgage tranche",
        description:
          "A risk-segmented slice of a residential mortgage-backed security (RMBS), rated investment-grade by the rating agencies despite being collateralized by loans to high-default-probability borrowers. The mispricing here — investment-grade ratings on junk collateral — is what Scion's CDS positions targeted.",
      },
      {
        "@type": "DefinedTerm",
        name: "Form 13F invisibility",
        description:
          "Form 13F requires disclosure of long equity positions in 13(f)-listed securities. CDS contracts, short positions, and derivatives generally are NOT 13F-disclosable. This is why Scion's Big Short does not appear in any 13F filing — the trade was structurally outside the 13F surface.",
      },
    ],
  },
];

export default function BurryBigShortPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Famous trades</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">Michael Burry&apos;s Big Short</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Between 2005 and 2007, Michael Burry&apos;s{" "}
          <strong className="text-text">Scion Capital</strong> purchased credit default swaps
          (CDS) referencing subprime mortgage bonds. When the housing market collapsed in
          2007-2008, the trade returned approximately{" "}
          <strong className="text-text">489% net to investors</strong> over the fund&apos;s
          life. The position was NOT visible on Form 13F — CDS are derivatives outside the
          13(f) securities list — but the broader trade is one of the most-studied
          short-thesis cases in modern investment history.
        </TldrCard>

        <p className="text-lg text-muted">
          Michael Burry&apos;s 2005-2008 subprime trade is documented in detail in Michael
          Lewis&apos;s <em>The Big Short</em> (2010), Burry&apos;s own 2008 investor letters,
          and a 2010 New York Times op-ed Burry wrote describing the thesis. What follows is
          a factual reconstruction from those public sources — useful both as historical
          context AND as a worked example of what 13F filings CAN&apos;T show you.
        </p>

        <AuthorByline date="2026-05-16" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The thesis (2005-06)</h2>
        <p className="text-muted">
          Burry&apos;s thesis, developed by reading actual mortgage-backed-security
          prospectuses, rested on four observations:
        </p>
        <ol className="text-muted space-y-2 list-decimal list-inside">
          <li><strong className="text-text">Underwriting deterioration</strong> — no-doc, stated-income, and option-ARM loans had grown from negligible to majority share of new origination</li>
          <li><strong className="text-text">Adjustable-rate reset cliff</strong> — many 2004-2006 vintage loans had 2-3 year teaser rates resetting to materially higher payments in 2007-2008</li>
          <li><strong className="text-text">Geographic concentration</strong> — subprime origination was concentrated in California, Florida, Arizona, Nevada — markets with the largest price appreciation and weakest fundamentals</li>
          <li><strong className="text-text">Rating-agency mispricing</strong> — BBB-tranches of mortgage securitizations were rated to imply default rates incompatible with the underlying loan-pool characteristics</li>
        </ol>

        <h2 className="text-2xl font-bold mt-10 mb-3">The trade structure</h2>
        <p className="text-muted">
          The trade vehicle was credit default swaps — specifically, CDS on individual
          residential mortgage-backed securities (RMBS) tranches and on the broader ABX
          subprime index. Mechanics:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">Long the CDS</strong> — Burry paid quarterly premiums to dealers (Goldman Sachs, Deutsche Bank, others) for protection against default on specific RMBS tranches</li>
          <li><strong className="text-text">Mark-to-market drag</strong> — as house prices kept rising in 2006, the CDS premiums went up; Burry&apos;s monthly P&amp;L marks LOOKED like losses despite the underlying thesis strengthening</li>
          <li><strong className="text-text">Investor revolt</strong> — Scion LPs threatened redemptions in 2006-07 as Burry continued paying premium against rising market</li>
          <li><strong className="text-text">Defaults begin Q1 2007</strong> — early subprime defaults hit New Century, Fremont General, others; CDS premiums began converging to par on the bad tranches</li>
          <li><strong className="text-text">Massive realization 2007-08</strong> — as Bear Stearns failed (March 2008) and Lehman (September 2008), the CDS protection paid out as ratings cascaded down and underlying tranches defaulted</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Why this trade isn&apos;t in 13F filings</h2>
        <p className="text-muted">
          Credit default swaps are NOT 13(f) securities. The trade is visible only in: (a)
          Burry&apos;s own investor letters and quarterly commentary, (b) court filings from
          subsequent CDO-related litigation, (c) regulatory disclosures from the
          counterparty dealers, and (d) Michael Lewis&apos;s book reconstruction.
          Form 13F would have shown only Burry&apos;s LONG equity positions during the
          period — primarily a value-style portfolio of insurance and financial stocks,
          some of which BURRY SUBSEQUENTLY SHORTED but the shorts didn&apos;t appear on
          13F either.
        </p>
        <p className="text-muted mt-3">
          This is one of the cleanest illustrations of the 13F transparency gap: a trade
          that defined a fund&apos;s career was structurally invisible to public-filing-
          based research. The complete picture required reading investor letters AND public
          filings AND counterparty disclosures together.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-10 mb-3">Outcome and aftermath</h2>
        <p className="text-muted">
          Scion Capital posted a return of approximately 489% net of fees over its life,
          most of which came from the 2007-08 housing CDS trade unwind. Burry closed
          Scion to outside investors in 2008 and continued managing his own capital
          through Scion Asset Management, which has been a regular 13F filer since
          2013 — these are the filings HoldLens currently tracks for Burry.
        </p>
        <p className="text-muted mt-3">
          Burry has since publicly disclosed shorts on the SPY ETF, Tesla, semiconductors,
          and various individual names in subsequent years. Some of these shorts appear on
          13F filings as put-option positions; some are visible only in his X posts;
          some never surface publicly until disclosed in retrospect.
        </p>

        <OurView>
          <p>
            The Big Short is the canonical example of why 13F-based research has a
            structural ceiling. Form 13F shows long US equity positions only — no
            shorts, no CDS, no foreign securities, no most derivatives. A fund manager
            running a substantial market-neutral or short-biased strategy will appear
            on 13F as a partial picture, often dramatically smaller than their actual
            economic footprint.
          </p>
          <p>
            For HoldLens reading: Burry&apos;s current Scion Asset Management 13F is
            useful for tracking his long-side positioning, but it is NOT the complete
            picture of what Scion is doing. The 13F is a window, not the room. Use it
            for the directional read on long-side exposure; use Burry&apos;s own
            commentary (X posts, occasional letters) for the strategic context that
            13F structurally can&apos;t carry.
          </p>
        </OurView>

        <p className="text-muted text-sm border-l-2 border-border pl-4 mt-6">
          Pure-reference encyclopedic entry for Form 13F (where Burry&apos;s long positions
          are reported) on our sister site:{" "}
          <a href="https://secfilingdex.com/learn/13f/" className="text-brand underline" rel="noopener">
            secfilingdex.com/learn/13f
          </a>
          {" "}— including the 13(f) securities list that defines what 13F can and can&apos;t
          show.
        </p>

        <InvestingBooks
          heading="Foundational reading on short-thesis investing"
          sub="Michael Lewis's The Big Short is the canonical book on this trade specifically. These foundations (Graham, Lynch, Munger) frame the value-investing lens Burry built his analysis on."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. Historical analysis from public investor letters + SEC
          filings + counterparty disclosures.{" "}
          <a href="/methodology" className="underline">Methodology</a>.
        </p>

        <CiteThisPage />
        <FamousTradesBlock currentSlug="burry-big-short" />
        <LearnReadNext currentSlug="burry-big-short" />

        <ShareStrip url="https://holdlens.com/learn/burry-big-short" title="Michael Burry's Big Short" />

        <AdSlot format="horizontal" priority="secondary" />

        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text mb-3">See Burry&apos;s current Scion holdings on HoldLens</h2>
          <p className="text-sm text-muted leading-relaxed">
            <a href="/investor/michael-burry" className="text-brand hover:underline">Live Scion 13F dossier</a>
            {" — Burry's current long positions, quarter by quarter. Sister property: "}
            <a href="https://secfilingdex.com/" className="text-brand hover:underline">SecFilingDex</a>
            {"."}
          </p>
        </section>
      </div>
    </div>
  );
}
