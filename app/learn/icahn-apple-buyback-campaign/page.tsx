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
  title: "Carl Icahn's Apple buyback campaign — 2013-2016 long-side activism via 13F + 13D",
  description:
    "In 2013, Carl Icahn took a $3.6B position in Apple and pushed publicly for the company to accelerate share repurchases. The campaign returned ~$2B+ in gains over 3 years and is a clean SEC-filing-trail case of long-side activism.",
  alternates: { canonical: "https://holdlens.com/learn/icahn-apple-buyback-campaign" },
  openGraph: {
    title: "Carl Icahn's Apple buyback campaign",
    description:
      "2013-2016 long-side activism: 13F + 13D filings tell the full story.",
    url: "https://holdlens.com/learn/icahn-apple-buyback-campaign",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Carl Icahn's Apple buyback campaign",
    description: "Long-side activism explained from the SEC public record.",
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
      { "@type": "ListItem", position: 3, name: "Icahn Apple campaign", item: "https://holdlens.com/learn/icahn-apple-buyback-campaign" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Carl Icahn's Apple buyback campaign — 2013-2016 long-side activism via 13F + 13D",
    description: "Historical analysis of Carl Icahn's 2013-2016 Apple campaign.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/icahn-apple-buyback-campaign",
    datePublished: "2026-05-16",
    dateModified: "2026-05-16",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    citation: [
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000921669&type=13F-HR",
      "https://en.wikipedia.org/wiki/Carl_Icahn",
      "https://en.wikipedia.org/wiki/Apple_Inc.",
    ],
    about: [
      {
        "@type": "Person",
        name: "Carl Icahn",
        url: "https://holdlens.com/investor/carl-icahn",
      },
      {
        "@type": "Corporation",
        name: "Apple Inc.",
      },
      {
        "@type": "Organization",
        name: "Icahn Enterprises",
      },
      {
        "@type": "DefinedTerm",
        name: "Activist long",
        description:
          "An activist campaign argued from the LONG side — accumulate a meaningful equity stake, then publicly pressure management for specific capital-allocation changes (here: accelerated share buybacks). Distinct from activist shorts (Ackman/Herbalife) which argue for share-price decline.",
      },
      {
        "@type": "DefinedTerm",
        name: "Share repurchase",
        description:
          "A corporation buying its own shares from the public market, retiring them or holding as treasury stock. Reduces share count; mechanically raises EPS at constant net income. Icahn's Apple campaign argued Apple's then-cash hoard was best deployed as accelerated repurchases vs M&A or dividends.",
      },
      {
        "@type": "DefinedTerm",
        name: "Form 4 vs 13F disclosure",
        description:
          "Icahn's Apple position was disclosed via 13F filings from Icahn Enterprises (institutional, quarterly). Apple insiders' personal trades — Tim Cook's individual transactions — were disclosed separately via Form 4 (real-time, 2-business-day). Icahn was an external investor, not an insider; his trail is 13F only.",
      },
    ],
  },
];

export default function IcahnApplePage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Famous trades</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">Carl Icahn&apos;s Apple buyback campaign</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Between August 2013 and April 2016, Carl Icahn accumulated approximately{" "}
          <strong className="text-text">$3.6 billion</strong> in Apple (NASDAQ: AAPL) shares
          and ran a public campaign pressuring Apple&apos;s board to accelerate share
          repurchases. The campaign was conducted via public tweets, an open letter to Tim
          Cook, and continuous accumulation visible in 13F filings. Icahn exited the
          position in April 2016 with approximately{" "}
          <strong className="text-text">$2 billion in realized gains</strong>. Unlike many
          activist trades, the entire campaign is reconstructable from SEC EDGAR alone.
        </TldrCard>

        <p className="text-lg text-muted">
          The 2013-2016 Icahn Apple campaign is one of the cleanest SEC-filing-trail
          examples of long-side activism in modern markets. Every accumulation tranche
          appeared on 13F filings within 45 days; the open letter to Cook was a public
          document; the exit was disclosed via 13F position reduction. The full trade
          can be reconstructed from quarterly filings, no insider information or
          private commentary required.
        </p>

        <AuthorByline date="2026-05-16" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The opening (August 2013)</h2>
        <p className="text-muted">
          Icahn announced the position on August 13, 2013, via a tweet:{" "}
          <em>&quot;We currently have a large position in @apple. We believe the company
          to be extremely undervalued.&quot;</em> The tweet immediately moved Apple stock
          ~5% on the day — illustrating the market impact of activist position disclosures.
        </p>
        <p className="text-muted mt-3">
          The position appeared on Icahn Capital&apos;s subsequent 13F filings. Initial
          tranche: approximately 4.7 million shares (split-adjusted), valued at ~$1.7
          billion at the time. Icahn continued accumulating into Q4 2013 and Q1 2014.
          Peak position: approximately 53 million shares (split-adjusted), valued at
          ~$5+ billion at peak quarterly mark-to-market.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">The thesis</h2>
        <p className="text-muted">
          Icahn&apos;s thesis, articulated through Twitter, open letters, and Sohn
          Conference presentations:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">Cash hoard misallocation</strong> — Apple held ~$150B+ in cash and securities, growing approximately $20B/year; the cash earned essentially zero return and was massively under-deployed</li>
          <li><strong className="text-text">Buyback ROI calculus</strong> — at 12-14x P/E with sustained earnings growth, accelerated buybacks would produce 14-18% IRR for retained-share holders — far above the cash&apos;s yield</li>
          <li><strong className="text-text">Capital-return philosophy</strong> — Icahn argued the cash represented value not being returned to shareholders; an aggressive buyback would be the most-efficient distribution mechanism</li>
          <li><strong className="text-text">Repatriation arbitrage</strong> — Apple could borrow domestically at low rates and use it to fund buybacks while leaving offshore cash undisturbed</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">The October 2013 open letter</h2>
        <p className="text-muted">
          On October 24, 2013, Icahn published an open letter to Tim Cook proposing a
          $150 billion accelerated tender offer. The letter, posted publicly on{" "}
          <em>Shareholders&apos; Square Table</em>, was a structured argument for the
          repurchase math, not a hostile demand. It explicitly endorsed Cook&apos;s
          leadership while pushing for a specific capital-allocation action.
        </p>
        <p className="text-muted mt-3">
          The letter was unusual because it: (a) named a specific dollar amount, (b)
          included the rationale derivation transparently, (c) was published rather than
          sent privately. Apple did NOT immediately accept the proposed tender size but
          DID announce subsequent repurchase-program expansions throughout 2013-2016.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-10 mb-3">Apple&apos;s response</h2>
        <p className="text-muted">
          Apple&apos;s board did not directly cite Icahn&apos;s campaign in its capital-
          return decisions, but the timing of subsequent buyback-program expansions
          aligned with the Icahn pressure:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">April 2013</strong> — buyback program expanded from $10B to $60B (before Icahn entered)</li>
          <li><strong className="text-text">April 2014</strong> — expanded to $90B</li>
          <li><strong className="text-text">April 2015</strong> — expanded to $140B</li>
          <li><strong className="text-text">April 2016</strong> — expanded to $175B</li>
        </ul>
        <p className="text-muted mt-3">
          Apple has continued aggressive buybacks since, returning approximately $700+
          billion to shareholders through 2024. The buyback machinery that emerged in
          the Icahn-campaign window has continued operating at scale for nearly a
          decade after his exit.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">The exit (April 2016)</h2>
        <p className="text-muted">
          Icahn disclosed his Apple exit on April 28, 2016. The reason given publicly:
          concerns about Apple&apos;s exposure to China, including potential regulatory
          friction and competitive dynamics. The exit was visible in Icahn Capital&apos;s
          subsequent 13F filing as a complete elimination of the Apple position.
        </p>
        <p className="text-muted mt-3">
          The realized gain on the position was approximately $2 billion. Some critics
          noted that Apple stock continued appreciating significantly after Icahn&apos;s
          exit — the position would have been worth multiples more if held to 2020+
          (Apple traded $30 split-adjusted at Icahn&apos;s exit; subsequently passed
          $190+ in late 2024 after additional splits and accumulation).
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Why this trade is the cleanest activist case for 13F-tracking</h2>
        <p className="text-muted">
          Three properties make Icahn&apos;s Apple campaign the canonical SEC-filing-trail
          activist case:
        </p>
        <ol className="text-muted space-y-2 list-decimal list-inside">
          <li><strong className="text-text">Long-only position</strong> — entirely visible on 13F (unlike Burry&apos;s CDS shorts or Soros&apos;s FX)</li>
          <li><strong className="text-text">Stayed below 5%</strong> — never crossed 5% threshold requiring Schedule 13D, so 13F was the disclosure mechanism throughout</li>
          <li><strong className="text-text">Public letters + open communication</strong> — the activist intent was disclosed via Icahn&apos;s own public statements, not inferred from filings</li>
        </ol>
        <p className="text-muted mt-3">
          The full trade — entry, thesis, accumulation tranche by tranche, peak,
          and exit — can be reconstructed from publicly-available SEC EDGAR
          documents alone. This makes it a teaching case for understanding what
          13F-based research can show vs. what it cannot.
        </p>

        <OurView>
          <p>
            The Icahn Apple campaign sits at the intersection of three types of
            visibility that rarely align in activist investing: SEC filings show the
            position, public communication shows the thesis, market response shows the
            company&apos;s reaction. For a HoldLens-style 13F tracker, this is the
            cleanest possible example of why aggregating quarterly 13F + public
            commentary can produce real understanding of what an activist is doing —
            even though the 13F by itself shows only position size, not intent.
          </p>
          <p>
            The contrast with Ackman&apos;s Herbalife short (same era, opposite side,
            structurally different) is instructive. Ackman&apos;s short was invisible
            to 13F; Icahn&apos;s long was fully visible. Both involved public-record
            activism. Same era; structurally opposite SEC trails. The Form 13F regime
            is asymmetric by design — it surfaces long activism cleanly and short
            activism not at all.
          </p>
        </OurView>

        <p className="text-muted text-sm border-l-2 border-border pl-4 mt-6">
          The 13F + Schedule 13D filings that document activist campaigns are
          catalogued on our sister site:{" "}
          <a href="https://secfilingdex.com/learn/13d-vs-13g/" className="text-brand underline" rel="noopener">
            secfilingdex.com/learn/13d-vs-13g
          </a>
          {" "}— including the 5% threshold rules that determine when 13D is required.
        </p>

        <InvestingBooks
          heading="Foundational reading on activist investing"
          sub="Icahn's career is referenced in nearly every modern activist-investing primer. The Apple campaign is one of the most-studied cases. Graham, Lynch, Munger — the foundations."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. Historical analysis from SEC Form 13F filings + public
          letters + Apple corporate disclosures.{" "}
          <a href="/methodology" className="underline">Methodology</a>.
        </p>

        <CiteThisPage />
        <LearnReadNext currentSlug="icahn-apple-buyback-campaign" />

        <ShareStrip url="https://holdlens.com/learn/icahn-apple-buyback-campaign" title="Carl Icahn's Apple buyback campaign" />

        <AdSlot format="horizontal" priority="secondary" />

        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text mb-3">See Icahn Capital&apos;s current holdings on HoldLens</h2>
          <p className="text-sm text-muted leading-relaxed">
            <a href="/investor/carl-icahn" className="text-brand hover:underline">Live Icahn Capital 13F dossier</a>
            {" — Carl Icahn's current long positions, quarter by quarter. Sister property: "}
            <a href="https://secfilingdex.com/" className="text-brand hover:underline">SecFilingDex</a>
            {"."}
          </p>
        </section>
      </div>
    </div>
  );
}
