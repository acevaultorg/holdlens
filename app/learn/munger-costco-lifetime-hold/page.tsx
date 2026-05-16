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
  title: "Charlie Munger's Costco position — the multi-decade hold of his career",
  description:
    "Charlie Munger held Costco shares from at least 1997 until his death in November 2023. He sat on the Costco board for 25+ years. The position is one of the cleanest examples of long-duration concentrated value investing in the public record.",
  alternates: { canonical: "https://holdlens.com/learn/munger-costco-lifetime-hold" },
  openGraph: {
    title: "Charlie Munger's Costco position",
    description:
      "Multi-decade concentrated position. Board seat. Public-record trail of the canonical Munger trade.",
    url: "https://holdlens.com/learn/munger-costco-lifetime-hold",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Charlie Munger's Costco position",
    description: "The multi-decade hold that defined Munger's investing reputation.",
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
      { "@type": "ListItem", position: 3, name: "Munger Costco hold", item: "https://holdlens.com/learn/munger-costco-lifetime-hold" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Charlie Munger's Costco position — the multi-decade hold of his career",
    description: "Historical analysis of Charlie Munger's long-duration Costco position.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/munger-costco-lifetime-hold",
    datePublished: "2026-05-16",
    dateModified: "2026-05-16",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    citation: [
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000783412&type=13F-HR",
      "https://en.wikipedia.org/wiki/Charlie_Munger",
      "https://en.wikipedia.org/wiki/Costco",
    ],
    about: [
      {
        "@type": "Person",
        name: "Charlie Munger",
        url: "https://holdlens.com/investor",
      },
      {
        "@type": "Corporation",
        name: "Costco Wholesale Corporation",
      },
      {
        "@type": "Organization",
        name: "Daily Journal Corporation",
      },
      {
        "@type": "DefinedTerm",
        name: "Membership-renewal moat",
        description:
          "Costco's structural durability comes from its 90%+ annual membership renewal rate — an annuity-like revenue stream independent of merchandise margin. Munger cited this loop (low merchandise margins → loyal members → high renewals → pricing power → low merchandise margins) as the canonical self-reinforcing positive feedback system.",
      },
      {
        "@type": "DefinedTerm",
        name: "Pricing-power inversion",
        description:
          "Costco voluntarily caps merchandise margins at ~14% and passes scale economics to members rather than capturing them as profit. The inversion: caps on per-item margin produce uncapped membership-base growth, which produces uncapped cumulative annuity revenue.",
      },
      {
        "@type": "DefinedTerm",
        name: "Form 4 + DEF 14A trail",
        description:
          "Munger's 1997-2023 Costco position is one of the cleanest verifiable long-duration insider trails in the SEC record. Every personal share transaction filed via Form 4 within 2 business days; annual beneficial-ownership disclosure in Costco's DEF 14A proxy. Anyone can reconstruct the position quarter-by-quarter from EDGAR alone.",
      },
    ],
  },
];

export default function MungerCostcoPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Famous trades</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">Charlie Munger&apos;s Costco position</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Charlie Munger held{" "}
          <strong className="text-text">Costco Wholesale Corporation</strong> (NASDAQ: COST)
          shares from at least 1997 until his death in November 2023 — a 26+ year hold. He
          served on Costco&apos;s board of directors continuously over much of that period
          and famously called Costco{" "}
          <em>&quot;the most admirable capitalistic institution in the world.&quot;</em> The
          position is the canonical example of Munger&apos;s &quot;wonderful business held
          forever&quot; investing approach — and a study in why long-duration concentrated
          positioning can compound at rates other investing approaches structurally
          can&apos;t match.
        </TldrCard>

        <p className="text-lg text-muted">
          Charlie Munger&apos;s Costco position is one of the most-cited examples in modern
          concentrated value investing. Unlike Buffett&apos;s Coca-Cola trade — which was
          made through Berkshire Hathaway and disclosed via Berkshire&apos;s 13F filings —
          Munger&apos;s Costco position was held personally (and via Daily Journal
          Corporation, which Munger chaired). Its 13F visibility was therefore split
          between Daily Journal&apos;s filings and Munger&apos;s personal Form 4 / Form 5
          disclosures from his Costco board seat.
        </p>

        <AuthorByline date="2026-05-16" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The Costco board seat (1997-2023)</h2>
        <p className="text-muted">
          Munger joined the Costco board of directors in 1997 and remained on it
          continuously until shortly before his death in 2023. The board role created
          two parallel public-record obligations:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">Form 4 insider transaction reports</strong> — every Costco share Munger personally bought or sold from 1997 onward had to be disclosed within 2 business days via SEC Form 4</li>
          <li><strong className="text-text">Annual proxy ownership disclosure</strong> — Costco&apos;s annual DEF 14A proxy statement disclosed Munger&apos;s beneficial ownership of Costco shares</li>
        </ul>
        <p className="text-muted mt-3">
          These two filing sources together create one of the cleanest verifiable trails of
          a long-duration insider position in the public record. Anyone can reconstruct
          Munger&apos;s Costco position by quarter from SEC EDGAR alone.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">The thesis (in Munger&apos;s own words)</h2>
        <p className="text-muted">
          Across decades of Berkshire annual meetings, Daily Journal annual meetings, and
          various interviews, Munger described his Costco thesis in remarkably consistent
          terms:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">Member-loyalty moat</strong> — Costco&apos;s 90%+ membership-renewal rate created an annuity-like revenue stream independent of merchandise sales</li>
          <li><strong className="text-text">Pricing-power inversion</strong> — Costco voluntarily caps its merchandise margins at ~14%, passing scale economics to members rather than capturing them. This drives the renewal rate which drives the moat</li>
          <li><strong className="text-text">Operational excellence</strong> — Munger called Costco&apos;s execution &quot;a kind of self-correcting positive feedback loop&quot;</li>
          <li><strong className="text-text">Management quality</strong> — Munger cited Jim Sinegal (CEO 1983-2012) and the subsequent succession as exemplary of long-term-shareholder-oriented management</li>
          <li><strong className="text-text">Geographic optionality</strong> — international expansion (Mexico, Korea, Japan, Taiwan, UK, Spain, China) created decades of growth runway</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Daily Journal Corporation&apos;s 13F position</h2>
        <p className="text-muted">
          Beyond Munger&apos;s personal Costco holdings, Daily Journal Corporation (which
          Munger chaired) maintained a substantial Costco position visible in its 13F
          filings from 2009-2023. The Daily Journal 13F is one of the most-watched
          quarterly filings in the value-investing community precisely because of
          Munger&apos;s direct involvement in its capital allocation.
        </p>
        <p className="text-muted mt-3">
          Daily Journal&apos;s Costco position represented a meaningful percentage of its
          investment portfolio — often the largest single line item — across the entire
          decade-plus filing history. The position survived the 2008-09 financial crisis
          (Munger added during the panic), the 2020 COVID crash, and multiple Costco
          earnings-miss cycles. The hold-through-volatility pattern is itself instructive.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The return profile</h2>
        <p className="text-muted">
          Costco stock returned approximately 15-18% compounded annualized from the late
          1990s through 2023 — well above the S&amp;P 500&apos;s 9-10% over the same
          window. Munger&apos;s entry cost basis (split-adjusted) was in the $5-20 range
          across various purchase tranches; the position ended at $500-600+ per share when
          he died in November 2023. The mark-to-market gain over the full hold period
          was therefore in the 25-50× range, before counting Costco&apos;s dividend
          history.
        </p>
        <p className="text-muted mt-3">
          Like Buffett&apos;s Coca-Cola, the trade&apos;s return came primarily from
          two factors: (a) extreme duration, (b) the underlying business compounding
          earnings at high rates over decades. Neither factor is replicable through
          short-horizon trading; both are visible only in the long-form public record.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Reading Costco filings post-Munger</h2>
        <p className="text-muted">
          With Munger&apos;s passing in November 2023, the question of what happens to his
          Costco position is now answered partially through estate filings and Form 4
          disclosures of his successor trustees. Costco&apos;s board has a new composition;
          Daily Journal Corporation&apos;s portfolio is under new management. The
          quarter-by-quarter 13F + Form 4 trail will continue documenting the disposition
          of one of the most-watched long-duration positions in modern markets.
        </p>

        <OurView>
          <p>
            The Munger-Costco position is one of the cleanest examples in the SEC record
            of what concentrated long-duration value investing looks like in practice.
            The mechanics are simple — buy a wonderful business, hold it across decades
            regardless of macro noise — but the discipline required is uncommon. Most
            investors who claim to want to invest like Munger don&apos;t actually have the
            patience to hold a position through a 50% drawdown and add to it.
          </p>
          <p>
            For HoldLens tracking purposes, Daily Journal&apos;s 13F filings remain
            available in EDGAR as the public-record trail of how Munger allocated
            capital in his last decade. Costco itself remains one of the most-cited
            positions across the tracked-superinvestor universe; many of the 30 managers
            HoldLens tracks have Costco in their portfolios. The Munger thesis articulated
            decades ago turned out to be transferable enough that other top managers
            independently arrived at the same conclusion.
          </p>
        </OurView>

        <p className="text-muted text-sm border-l-2 border-border pl-4 mt-6">
          The Form 4 insider trades + 13F filings that document this position are
          catalogued on our sister site:{" "}
          <a href="https://secfilingdex.com/learn/form-4/" className="text-brand underline" rel="noopener">
            secfilingdex.com/learn/form-4
          </a>
          {" "}+ {" "}
          <a href="https://secfilingdex.com/learn/13f/" className="text-brand underline" rel="noopener">
            secfilingdex.com/learn/13f
          </a>
          .
        </p>

        <InvestingBooks
          heading="Foundational reading on concentrated value investing"
          sub="Munger's own Poor Charlie's Almanack is the definitive source on the framework that underwrote this position. Graham, Lynch, Buffett, Munger — the foundations."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. Historical analysis from SEC Form 4 + 13F filings + DEF
          14A proxy disclosures.{" "}
          <a href="/methodology" className="underline">Methodology</a>.
        </p>

        <CiteThisPage />
        <LearnReadNext currentSlug="munger-costco-lifetime-hold" />

        <ShareStrip url="https://holdlens.com/learn/munger-costco-lifetime-hold" title="Charlie Munger's Costco position" />

        <AdSlot format="horizontal" priority="secondary" />

        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text mb-3">See live tracked-manager holdings on HoldLens</h2>
          <p className="text-sm text-muted leading-relaxed">
            <a href="/investor" className="text-brand hover:underline">Daily Journal 13F dossier</a>
            {" — including the Costco position trail. Sister property cataloging every form variant: "}
            <a href="https://secfilingdex.com/" className="text-brand hover:underline">SecFilingDex</a>
            {"."}
          </p>
        </section>
      </div>
    </div>
  );
}
