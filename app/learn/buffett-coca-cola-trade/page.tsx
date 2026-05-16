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
  title: "Warren Buffett's Coca-Cola trade — the 1988 position that defined modern Berkshire",
  description:
    "Between 1988 and 1989, Berkshire Hathaway acquired roughly 6.7% of Coca-Cola for $1.3 billion. Today the same position is worth ~$28 billion. The trade's mechanics, timing, and what 13F filings of the period reveal.",
  alternates: { canonical: "https://holdlens.com/learn/buffett-coca-cola-trade" },
  openGraph: {
    title: "Warren Buffett's Coca-Cola trade",
    description:
      "Berkshire's 1988-89 Coke purchase: $1.3B invested, now ~$28B position. Trade mechanics + 13F-filed evidence.",
    url: "https://holdlens.com/learn/buffett-coca-cola-trade",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Warren Buffett's Coca-Cola trade",
    description: "Berkshire's 1988-89 Coke purchase explained from the 13F record.",
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
      { "@type": "ListItem", position: 3, name: "Buffett Coca-Cola trade", item: "https://holdlens.com/learn/buffett-coca-cola-trade" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Warren Buffett's Coca-Cola trade — the 1988 position that defined modern Berkshire",
    description: "Historical analysis of Berkshire Hathaway's 1988-89 Coca-Cola purchase.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/buffett-coca-cola-trade",
    datePublished: "2026-05-16",
    dateModified: "2026-05-16",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    citation: [
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001067983&type=13F-HR",
      "https://en.wikipedia.org/wiki/Berkshire_Hathaway",
      "https://en.wikipedia.org/wiki/The_Coca-Cola_Company",
    ],
    about: [
      {
        "@type": "Person",
        name: "Warren Buffett",
        url: "https://holdlens.com/investor/warren-buffett",
      },
      {
        "@type": "Corporation",
        name: "Berkshire Hathaway",
      },
      {
        "@type": "Corporation",
        name: "The Coca-Cola Company",
      },
      {
        "@type": "DefinedTerm",
        name: "Concentrated long-duration value position",
        description:
          "An investment style — exemplified by Berkshire's Coca-Cola trade — of identifying a wonderful business at fair price and holding for decades regardless of macro volatility. Compounds at the underlying business's earnings-growth rate, not at trading-volatility rates.",
      },
      {
        "@type": "DefinedTerm",
        name: "13F-traceable accumulation",
        description:
          "A purchase pattern fully reconstructable from sequential 13F filings (quarterly). Berkshire's 1988-89 KO accumulation appears across four 13F-HR filings, each one disclosing the incremental share count at quarter-end.",
      },
      {
        "@type": "DefinedTerm",
        name: "Cost basis ($1.3B)",
        description:
          "Berkshire's cumulative investment in Coca-Cola across 1988-89: approximately $1.3 billion for ~6.7% of outstanding shares. The position has been untouched since; current mark-to-market is ~$28 billion before counting 37 years of dividends.",
      },
    ],
  },
];

export default function BuffettCokeTradeePage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Famous trades</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">Warren Buffett&apos;s Coca-Cola trade</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Between Q4 1988 and Q3 1989, Warren Buffett&apos;s Berkshire Hathaway acquired
          approximately <strong className="text-text">6.7% of The Coca-Cola Company</strong> for
          a total cost basis of roughly <strong className="text-text">$1.3 billion</strong>. The
          position is still held today, untouched. Its current market value is approximately{" "}
          <strong className="text-text">$28 billion</strong> — a 21× gain over 37 years, before
          counting decades of dividends. It is the single most-studied trade in modern
          value-investing history.
        </TldrCard>

        <p className="text-lg text-muted">
          Berkshire Hathaway&apos;s position in <strong className="text-text">The Coca-Cola
          Company</strong> (NYSE: KO) is one of the four founding pillars of modern Berkshire
          (the others: Geico, American Express, and the wholly-owned operating businesses). The
          trade itself was assembled across three quarters in 1988-89, fully disclosed via SEC
          Form 13F filings, and has remained essentially unchanged since.
        </p>

        <AuthorByline date="2026-05-16" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The trade structure</h2>
        <p className="text-muted">
          The acquisition was assembled in three tranches, visible in Berkshire&apos;s 13F
          filings of the period:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">Q4 1988</strong> — Berkshire disclosed an initial 14.2 million-share position</li>
          <li><strong className="text-text">Q1 1989</strong> — position increased to 23.4 million shares</li>
          <li><strong className="text-text">Q3 1989</strong> — final accumulation to 28 million shares</li>
        </ul>
        <p className="text-muted mt-3">
          Adjusted for the 1996 and 2012 2-for-1 splits, this final 28 million share count
          became <strong className="text-text">400 million shares</strong>. Berkshire has not
          materially changed the position size in either direction since.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">The thesis</h2>
        <p className="text-muted">
          Buffett described his Coca-Cola thesis at length in the 1989 Berkshire annual letter.
          The framing rests on five durable factors:
        </p>
        <ol className="text-muted space-y-2 list-decimal list-inside">
          <li><strong className="text-text">Brand moat</strong> — Coca-Cola&apos;s trademark and global distribution were uniquely difficult to replicate</li>
          <li><strong className="text-text">Pricing power</strong> — the syrup-side margin structure compounded as the company internationalized</li>
          <li><strong className="text-text">Capital efficiency</strong> — minimal incremental capital required to grow earnings</li>
          <li><strong className="text-text">Management quality</strong> — Roberto Goizueta (CEO 1981-1997) had a clear shareholder-value framework</li>
          <li><strong className="text-text">Geographic optionality</strong> — international per-capita consumption was a fraction of US levels with decades of runway</li>
        </ol>

        <h2 className="text-2xl font-bold mt-10 mb-3">What the 13F record shows</h2>
        <p className="text-muted">
          Every Berkshire 13F filing since Q4 1988 has carried the Coca-Cola position. The
          1996 split was reflected in the share-count line; the 2012 split similarly. There
          were no quarters of trimming, no rebalancing, no tax-loss harvesting. The position
          is exactly what Buffett wrote about in 1989 — a long-duration capital allocation
          to a single business he believed would compound earnings for decades.
        </p>
        <p className="text-muted mt-3">
          Berkshire has, however, sold partial positions in other long-held names (Wells
          Fargo, IBM, Procter &amp; Gamble received different treatment over time). The
          Coca-Cola untouched status is therefore deliberate, not default.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The dividend compound</h2>
        <p className="text-muted">
          A frequently-overlooked component of the trade&apos;s return: dividends. Coca-Cola
          has paid an increasing dividend every year since 1963 (the company is a{" "}
          <em>Dividend Aristocrat</em> well past the 60-year threshold). Berkshire&apos;s
          400 million shares × Coca-Cola&apos;s current ~$1.94/share annual dividend = roughly{" "}
          <strong className="text-text">$776 million per year</strong> in dividend income to
          Berkshire alone — and that dividend has grown for decades.
        </p>
        <p className="text-muted mt-3">
          Cumulative dividends received by Berkshire on the Coca-Cola position since
          1988 exceed the original $1.3 billion cost basis several times over. The mark-
          to-market gain ($28B) is therefore separate from the income return (also
          multi-billion in cumulative dividends).
        </p>

        <OurView>
          <p>
            The Coca-Cola trade is one of the most-cited examples in long-duration
            equity investing because of three properties that rarely coincide: it was
            (a) large enough at entry to actually move Berkshire&apos;s book, (b) held
            long enough that compounding became the dominant return component, and (c)
            documented sufficiently in the SEC 13F record that the timeline is verifiable
            to the quarter.
          </p>
          <p>
            For 13F-tracking purposes on HoldLens, the Coca-Cola line in Berkshire&apos;s
            quarterly filings is the longest-running unchanged position in the
            tracked-superinvestor universe. Looking at the position&apos;s share count
            across 145+ consecutive 13F filings is itself a useful exercise in
            understanding what &quot;long-term holder&quot; means in practice — the
            position has weathered the dot-com bust, the 2008 financial crisis,
            COVID-19, and multiple management transitions at Coca-Cola without
            Berkshire changing exposure.
          </p>
        </OurView>

        <p className="text-muted text-sm border-l-2 border-border pl-4 mt-6">
          The 13F filings that document this trade are catalogued on our sister site:{" "}
          <a href="https://secfilingdex.com/learn/13f/" className="text-brand underline" rel="noopener">
            secfilingdex.com/learn/13f
          </a>
          {" "}— form variants + regulatory citation. View Berkshire&apos;s live position on
          HoldLens at{" "}
          <a href="/investor/warren-buffett" className="text-brand underline">
            /investor/warren-buffett
          </a>.
        </p>

        <InvestingBooks
          heading="Foundational reading on Buffett's investing approach"
          sub="The Coca-Cola trade is the case study these books all return to. Graham, Lynch, Munger — the foundations Buffett built on."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. Historical analysis of a publicly-disclosed SEC 13F position.{" "}
          <a href="/methodology" className="underline">Methodology</a>.
        </p>

        <CiteThisPage />
        <LearnReadNext currentSlug="buffett-coca-cola-trade" />

        <ShareStrip url="https://holdlens.com/learn/buffett-coca-cola-trade" title="Warren Buffett's Coca-Cola trade" />

        <AdSlot format="horizontal" priority="secondary" />

        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text mb-3">See Berkshire&apos;s live holdings on HoldLens</h2>
          <p className="text-sm text-muted leading-relaxed">
            <a href="/investor/warren-buffett" className="text-brand hover:underline">Live Berkshire 13F dossier</a>
            {" — Coca-Cola alongside every other position. Sister property cataloging every form variant: "}
            <a href="https://secfilingdex.com/" className="text-brand hover:underline">SecFilingDex</a>
            {"."}
          </p>
        </section>
      </div>
    </div>
  );
}
