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
  title: "Bill Ackman's Herbalife short — the 2012-2018 activist campaign explained",
  description:
    "Pershing Square's billion-dollar short of Herbalife was a six-year activist campaign that ended with Ackman closing the position in 2018 at a loss. The trade structure, the public-record evidence, and what it reveals.",
  alternates: { canonical: "https://holdlens.com/learn/ackman-herbalife-short" },
  openGraph: {
    title: "Bill Ackman's Herbalife short",
    description:
      "Six-year activist campaign, billion-dollar position. Trade structure + public record.",
    url: "https://holdlens.com/learn/ackman-herbalife-short",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bill Ackman's Herbalife short",
    description: "Pershing Square's 2012-2018 short campaign explained from public records.",
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
      { "@type": "ListItem", position: 3, name: "Ackman Herbalife short", item: "https://holdlens.com/learn/ackman-herbalife-short" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Bill Ackman's Herbalife short — the 2012-2018 activist campaign explained",
    description: "Historical analysis of Pershing Square's Herbalife short campaign.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/ackman-herbalife-short",
    datePublished: "2026-05-16",
    dateModified: "2026-05-16",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "Bill Ackman",
      "Pershing Square",
      "Herbalife",
      "activist short",
      "multi-level marketing",
      "short squeeze",
      "Carl Icahn",
      "FTC investigation",
    ],
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "HoldLens famous trades — public-record case studies",
      url: "https://holdlens.com/learn",
    },
    citation: [
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001336528&type=13F-HR",
      "https://en.wikipedia.org/wiki/Bill_Ackman",
      "https://en.wikipedia.org/wiki/Herbalife_Nutrition",
    ],
    about: [
      {
        "@type": "Person",
        name: "Bill Ackman",
        url: "https://holdlens.com/investor/bill-ackman",
      },
      {
        "@type": "Organization",
        name: "Pershing Square Capital Management",
      },
      {
        "@type": "DefinedTerm",
        name: "Activist short",
        description:
          "A short position paired with a public campaign — research reports, press conferences, regulatory complaints — explicitly arguing for the target's decline. Ackman's Herbalife position (2012-2018) is the canonical public-record example.",
      },
      {
        "@type": "DefinedTerm",
        name: "Multi-level marketing (MLM)",
        description:
          "A distribution model where independent representatives earn commissions on both retail sales and downstream recruiter sales. Ackman's thesis argued Herbalife's commission structure functionally rewarded recruitment over retail — a pyramid pattern under FTC scrutiny.",
      },
      {
        "@type": "DefinedTerm",
        name: "Short squeeze",
        description:
          "An adverse price spike against a short position, often driven by counter-buying by other large investors. Carl Icahn's parallel long position in Herbalife — disclosed via 13F — became the structural source of the squeeze that eventually closed Ackman's campaign at a loss.",
      },
    ],
  },
];

export default function AckmanHerbalifePage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Famous trades</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">Bill Ackman&apos;s Herbalife short</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          In December 2012, Bill Ackman&apos;s{" "}
          <strong className="text-text">Pershing Square Capital Management</strong> publicly
          disclosed a roughly <strong className="text-text">$1 billion short position</strong> in
          Herbalife (NYSE: HLF), alleging the company operated as a pyramid scheme. The
          campaign ran for nearly six years and included regulatory testimony, public
          presentations, congressional letters, and ultimately a <em>loss</em> when Ackman
          closed the position in February 2018. The trade is one of the most-documented
          public-activism short campaigns in modern markets.
        </TldrCard>

        <p className="text-lg text-muted">
          The Herbalife campaign was unusual in being conducted almost entirely in
          public. Ackman&apos;s 342-slide December 2012 presentation, his testimony to
          the FTC, and Pershing Square&apos;s subsequent disclosures created a multi-year
          public-record case study in activist shorting — and in the asymmetries between
          short positioning, public-relations campaigns, and market dynamics.
        </p>

        <AuthorByline date="2026-05-16" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The thesis (December 2012)</h2>
        <p className="text-muted">
          Ackman&apos;s public presentation argued Herbalife was a pyramid scheme operating
          as a multi-level marketing company. The core claims:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">Distributor economics</strong> — the overwhelming majority of distributors lost money or earned negligible amounts</li>
          <li><strong className="text-text">Recruitment-driven structure</strong> — distributor commissions depended primarily on signing up new distributors, not selling product to genuine consumers</li>
          <li><strong className="text-text">Inventory loading</strong> — distributors at higher tiers earned commissions on inventory purchased by lower-tier distributors, regardless of whether that inventory ever reached actual consumers</li>
          <li><strong className="text-text">FTC vulnerability</strong> — Ackman argued the FTC would eventually classify Herbalife as a pyramid scheme under the Koscot precedent and shut it down</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">The counter-trade — Carl Icahn long</h2>
        <p className="text-muted">
          Within weeks of Ackman&apos;s short disclosure, Carl Icahn announced a long
          position in Herbalife. Icahn ultimately accumulated approximately 24% of the
          company across 2013-2018, becoming the largest single shareholder. The Icahn-
          Ackman confrontation included a famous CNBC live exchange in January 2013.
        </p>
        <p className="text-muted mt-3">
          Other activists took sides: Daniel Loeb&apos;s Third Point was briefly long; Bob
          Chapman&apos;s Chapman Capital was long; Stiritz&apos;s position varied. The
          Herbalife trade became a multi-activist battleground where 13D filings from
          opposing managers told the public-record story of who was on which side at any
          given moment.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">The FTC settlement (2016)</h2>
        <p className="text-muted">
          In July 2016, the FTC settled with Herbalife. The settlement required:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>$200 million payment to former Herbalife distributors</li>
          <li>Restructuring of the compensation plan to tie commissions to verified retail sales (not just distributor purchases)</li>
          <li>Reduced reliance on inventory-loading-style sales</li>
        </ul>
        <p className="text-muted mt-3">
          The FTC did NOT classify Herbalife as a pyramid scheme — the core legal claim
          in Ackman&apos;s thesis. This was the inflection point that materially undermined
          the short thesis. The stock did NOT crash to zero; Herbalife continued operating;
          Pershing Square&apos;s mark-to-market position deteriorated.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The unwind (February 2018)</h2>
        <p className="text-muted">
          On February 28, 2018, Pershing Square disclosed it had closed the Herbalife
          short. Ackman publicly acknowledged the position had ended at a substantial
          loss. The cumulative cost is generally estimated by analysts at hundreds of
          millions of dollars — interest costs, premium-pay on the put options that
          replaced direct shorts late in the campaign, and the mark-to-market loss
          itself.
        </p>
        <p className="text-muted mt-3">
          The disclosure ended one of the most-watched short campaigns in modern public
          markets. Herbalife stock subsequently traded higher; Carl Icahn exited his
          position in 2021 at material gain.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">What this reveals about 13F-tracking</h2>
        <p className="text-muted">
          Like Burry&apos;s subprime short, the Ackman Herbalife short was NOT visible on
          Form 13F. Short positions are excluded from the 13(f) securities list. The
          Pershing Square 13F filings during the 2012-2018 period showed the LONG side of
          the book — primarily concentrated long positions in Restaurant Brands, Mondelez,
          Lowe&apos;s, and other names. The Herbalife short was visible only through:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>Pershing Square&apos;s public investor letters and Q&amp;A sessions</li>
          <li>The December 2012 presentation (released publicly)</li>
          <li>Subsequent FTC and congressional testimony</li>
          <li>13D filings from the OTHER side (Icahn&apos;s long disclosures)</li>
          <li>Pershing Square&apos;s later put-option positions (which DID appear on 13F as derivatives, late in the campaign)</li>
        </ul>

        <OurView>
          <p>
            The Herbalife campaign is the case study for why short-side activism is
            structurally different from long-side activism. Long activists have time on
            their side; positions can ride out multi-year drawdowns. Short activists pay
            quarterly costs (borrow, premium, regulatory friction) that compound while
            waiting for the thesis to play out. Even when the underlying thesis is
            partially correct — Herbalife DID get FTC settlement, did restructure
            compensation — the trade can still lose money if the path to thesis-realization
            is too long or partial.
          </p>
          <p>
            For HoldLens tracking purposes, the Pershing Square 13F during the campaign
            is itself instructive: it shows what Ackman was buying with the cash NOT
            committed to Herbalife shorts. The complete picture of Ackman&apos;s
            positioning required reading the 13F long-side AND the public-record short
            side. 13F alone never told the whole story.
          </p>
        </OurView>

        <p className="text-muted text-sm border-l-2 border-border pl-4 mt-6">
          Pure-reference encyclopedic entry for Form 13F + 13D activist filings on our
          sister site:{" "}
          <a href="https://secfilingdex.com/learn/13d-vs-13g/" className="text-brand underline" rel="noopener">
            secfilingdex.com/learn/13d-vs-13g
          </a>
          {" "}— 13D filings from both sides of the Herbalife battle are catalogued there.
        </p>

        <InvestingBooks
          heading="Foundational reading on activist investing"
          sub="The Ackman-Herbalife saga is referenced in essentially every modern activist-investing primer. Graham, Lynch, Munger — the foundations."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. Historical analysis from public 13F + 13D filings,
          investor letters, FTC settlement documents.{" "}
          <a href="/methodology" className="underline">Methodology</a>.
        </p>

        <CiteThisPage />
        <FamousTradesBlock currentSlug="ackman-herbalife-short" />
        <LearnReadNext currentSlug="ackman-herbalife-short" />

        <ShareStrip url="https://holdlens.com/learn/ackman-herbalife-short" title="Bill Ackman's Herbalife short" />

        <AdSlot format="horizontal" priority="secondary" />

        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text mb-3">See Pershing Square&apos;s current holdings on HoldLens</h2>
          <p className="text-sm text-muted leading-relaxed">
            <a href="/investor/bill-ackman" className="text-brand hover:underline">Live Pershing Square 13F dossier</a>
            {" — Ackman's current long positions. Sister property cataloging every form variant: "}
            <a href="https://secfilingdex.com/" className="text-brand hover:underline">SecFilingDex</a>
            {"."}
          </p>
        </section>
      </div>
    </div>
  );
}
