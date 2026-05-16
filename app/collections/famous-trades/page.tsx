import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";

export const metadata: Metadata = {
  title: "Famous trades — public-record case studies | HoldLens",
  description:
    "Eight historical trades reconstructable from SEC EDGAR alone: Berkshire/Coca-Cola, Berkshire/Apple, Berkshire/Bank of America, Burry/Big Short, Ackman/Herbalife, Soros-Druckenmiller/GBP, Munger/Costco, Icahn/Apple. Each essay traces the trade through 13F, Form 4, and DEF 14A filings.",
  alternates: { canonical: "https://holdlens.com/collections/famous-trades" },
  openGraph: {
    title: "Famous trades — public-record case studies",
    description:
      "Eight historical trades reconstructable from SEC EDGAR alone. Each essay traces the trade through 13F, Form 4, and DEF 14A filings.",
    url: "https://holdlens.com/collections/famous-trades",
    type: "website",
    images: [
      { url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — famous trades, public-record case studies" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Famous trades — public-record case studies",
    description: "Eight historical trades reconstructable from SEC EDGAR alone.",
    images: ["/og/home.png"],
  },
};

type Trade = {
  slug: string;
  title: string;
  blurb: string;
  period: string;
  protagonist: string;
};

const TRADES: Trade[] = [
  {
    slug: "buffett-coca-cola-trade",
    title: "Warren Buffett's Coca-Cola trade",
    blurb:
      "Berkshire Hathaway accumulated ~6.7% of Coca-Cola for $1.3B in 1988-89. The position has been untouched for 37 years; current mark-to-market is ~$28B before dividends.",
    period: "1988-1989 entry · ongoing",
    protagonist: "Warren Buffett · Berkshire Hathaway",
  },
  {
    slug: "buffett-apple-position",
    title: "Warren Buffett's Apple position",
    blurb:
      "Berkshire built Apple into its largest-ever equity position from a Q1 2016 ~9.8M-share entry. Peaked at ~5.5% of Apple's outstanding stock and ~50% of Berkshire's public-equity portfolio. Partial trim in 2024; still Berkshire's #1 holding.",
    period: "2016 entry · 2024 partial trim · ongoing",
    protagonist: "Warren Buffett · Berkshire Hathaway",
  },
  {
    slug: "buffett-bank-of-america-2011",
    title: "Warren Buffett's Bank of America 2011 deal",
    blurb:
      "August 2011: Berkshire invested $5B in BAC preferred stock + warrants for 700M common shares at $7.14 strike. Six years later Berkshire exercised the warrants at ~$13B paper gain. The canonical 'structured private investment' template, joining Goldman 2008 + GE 2008 + Heinz 2013.",
    period: "2011 deal · 2017 warrant exercise · 2024 partial trim · ongoing",
    protagonist: "Warren Buffett · Berkshire Hathaway",
  },
  {
    slug: "burry-big-short",
    title: "Michael Burry's Big Short",
    blurb:
      "Scion Capital bought CDS on subprime mortgage bonds 2005-2007. Trade returned ~489% net to investors. Visible only in Burry's letters + the Lewis book — NOT in any 13F (CDS aren't 13F-disclosable).",
    period: "2005-2008",
    protagonist: "Michael Burry · Scion Capital",
  },
  {
    slug: "ackman-herbalife-short",
    title: "Bill Ackman's Herbalife short",
    blurb:
      "Pershing Square's ~$1B short of Herbalife ran six years and ended at a loss in 2018. One of the most-documented public-activism short campaigns in modern markets.",
    period: "2012-2018",
    protagonist: "Bill Ackman · Pershing Square",
  },
  {
    slug: "soros-druckenmiller-gbp-1992",
    title: "Black Wednesday — the Quantum Fund pound trade",
    blurb:
      "September 16, 1992: the day Quantum Fund's ~$10B GBP short broke the Bank of England. Roughly $1B net in a single day. FX trades are 13F-invisible — the entire trade is reconstructable only from public reporting + memoirs.",
    period: "1992-09-16 (single day)",
    protagonist: "George Soros · Stanley Druckenmiller · Quantum Fund",
  },
  {
    slug: "munger-costco-lifetime-hold",
    title: "Charlie Munger's Costco position",
    blurb:
      "26+ year hold from 1997 to 2023, plus continuous Costco board service. The cleanest verifiable long-duration insider trail in the SEC record — every share documented via Form 4 + DEF 14A.",
    period: "1997-2023",
    protagonist: "Charlie Munger · Daily Journal Corporation",
  },
  {
    slug: "icahn-apple-buyback-campaign",
    title: "Carl Icahn's Apple buyback campaign",
    blurb:
      "$3.6B Apple position + public letter to Tim Cook arguing for accelerated buybacks. Closed 2016 with ~$2B realized gain. The cleanest 13F-traceable activist-long case study in modern markets.",
    period: "2013-2016",
    protagonist: "Carl Icahn · Icahn Enterprises",
  },
];

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Collections", item: "https://holdlens.com/collections" },
      { "@type": "ListItem", position: 3, name: "Famous trades", item: "https://holdlens.com/collections/famous-trades" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Famous trades — public-record case studies",
    description:
      "Eight historical trades reconstructable from SEC EDGAR alone. Each essay traces the trade through 13F, Form 4, and DEF 14A filings.",
    url: "https://holdlens.com/collections/famous-trades",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    datePublished: "2026-05-16",
    dateModified: "2026-05-16",
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "HoldLens",
      url: "https://holdlens.com",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: TRADES.length,
      itemListElement: TRADES.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://holdlens.com/learn/${t.slug}`,
        name: t.title,
      })),
    },
  },
];

export default function FamousTradesCollectionPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">
        Collections · Famous trades
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
        Famous trades — public-record case studies
      </h1>
      <p className="text-lg text-muted leading-relaxed mb-10">
        Eight historical trades reconstructable from SEC EDGAR alone. Each essay traces the
        trade through 13F filings, Form 4 insider disclosures, and DEF 14A proxy statements —
        showing exactly what the public record reveals AND what it structurally cannot show
        (CDS positions, FX trades, derivatives, and shorts are all 13F-invisible).
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {TRADES.map((t) => (
          <a
            key={t.slug}
            href={`/learn/${t.slug}`}
            className="block rounded-card border border-border bg-surface p-5 hover:border-brand/60 hover:bg-brand/5 transition-all duration-base ease-swift group"
          >
            <div className="text-[10px] uppercase tracking-widest text-brand font-semibold mb-1">
              {t.period}
            </div>
            <h2 className="text-base font-bold text-text group-hover:text-brand transition-colors leading-snug mb-1">
              {t.title}
            </h2>
            <div className="text-xs text-muted/80 mb-2">{t.protagonist}</div>
            <p className="text-sm text-muted leading-relaxed">{t.blurb}</p>
            <div className="text-xs text-brand font-semibold mt-3">
              Read the deep-dive →
            </div>
          </a>
        ))}
      </div>

      <AdSlot format="in-article" priority="primary" />

      <section className="mt-12 rounded-2xl border border-border bg-surface-muted p-6">
        <h2 className="text-base font-bold text-text mb-2">Why these six</h2>
        <p className="text-sm text-muted leading-relaxed">
          Each trade is famous AND fully verifiable from SEC EDGAR filings (or, where the
          structure is outside 13F, from primary-source published material — letters, books,
          academic reconstructions). The collection deliberately mixes 13F-visible trades
          (Buffett, Ackman, Munger, Icahn) with 13F-invisible trades (Burry's CDS,
          Soros-Druckenmiller's FX short) to demonstrate the boundary of what institutional
          disclosure can and cannot show.
        </p>
      </section>

      <p className="text-xs text-dim pt-8 border-t border-border mt-12">
        Not investment advice. Historical analysis from SEC Form 4 + 13F filings + DEF 14A
        proxy disclosures, supplemented by published primary sources where the trade
        structure was outside 13F.{" "}
        <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
