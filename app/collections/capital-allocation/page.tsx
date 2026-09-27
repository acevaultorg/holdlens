import InvestingBooks from "@/components/InvestingBooks";
import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";

export const metadata: Metadata = {
  title: "Capital allocation + corporate finance | HoldLens",
  description:
    "Five essays on adjacent public-markets topics — buybacks vs dividends, how to read buyback disclosures, short interest, ETF overlap, and congressional stock trading under the STOCK Act.",
  alternates: { canonical: "https://holdlens.com/collections/capital-allocation" },
  openGraph: {
    title: "Capital allocation + corporate finance — HoldLens",
    description: "Five essays on adjacent public-markets topics.",
    url: "https://holdlens.com/collections/capital-allocation",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — capital allocation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Capital allocation + corporate finance",
    description: "Buybacks, dividends, short interest, ETF overlap, STOCK Act.",
    images: ["/og/home.png"],
  },
};

const ITEMS = [
  { slug: "buybacks-vs-dividends", title: "Buybacks vs dividends", blurb: "Both return capital. Tax + flexibility + long-term compounding tradeoffs." },
  { slug: "how-to-read-buyback-disclosures", title: "How to read buyback disclosures", blurb: "Where the real numbers live in 10-K, 10-Q, and 8-K filings." },
  { slug: "short-interest-explained", title: "Short interest + squeeze setups", blurb: "What short interest measures, days-to-cover math, smart-money signal layer." },
  { slug: "etf-overlap-explained", title: "ETF overlap explained", blurb: "Why owning VOO + VTI + QQQ + SPY delivers far less diversification than you think." },
  { slug: "congressional-stock-trading-stock-act", title: "Congressional stock trading and the STOCK Act", blurb: "What the STOCK Act requires, how disclosures show ranges, how to read them." },
];

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Collections", item: "https://holdlens.com/collections" },
      { "@type": "ListItem", position: 3, name: "Capital allocation", item: "https://holdlens.com/collections/capital-allocation" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Capital allocation + corporate finance",
    description: "Five essays on adjacent public-markets topics.",
    url: "https://holdlens.com/collections/capital-allocation",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    datePublished: "2026-05-16",
    dateModified: "2026-05-16",
    inLanguage: "en-US",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: ITEMS.length,
      itemListElement: ITEMS.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://holdlens.com/learn/${t.slug}`,
        name: t.title,
      })),
    },
  },
];

export default function CapitalAllocationCollectionPage() {
  return <> {(
    <div className="max-w-3xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/collections" className="text-xs text-muted hover:text-text">← Collections</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Collections · Capital allocation</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">Capital allocation + corporate finance</h1>
      <p className="text-lg text-muted leading-relaxed mb-10">
        Five essays on adjacent public-markets topics. Buybacks vs dividends, how to read
        buyback disclosures in 10-K/Q + 8-K filings, short interest and days-to-cover math,
        the diversification-illusion of stacking large-cap ETFs, and how to read congressional
        stock-trade disclosures under the 2012 STOCK Act.
      </p>
      <div className="grid sm:grid-cols-2 gap-3 mb-12">
        {ITEMS.map((t) => (
          <a key={t.slug} href={`/learn/${t.slug}`} className="block rounded-card border border-border bg-surface p-4 hover:border-brand/60 hover:bg-brand/5 transition-all duration-base ease-swift group">
            <div className="text-sm font-bold text-text group-hover:text-brand transition-colors leading-snug">{t.title}</div>
            <p className="text-xs text-muted mt-1 leading-relaxed">{t.blurb}</p>
          </a>
        ))}
      </div>
      <AdSlot format="in-article" priority="primary" />
    </div>
  )} <div className="mx-auto max-w-5xl px-6"><InvestingBooks heading="Reading for your research" sub="Optional background reading on interpreting company disclosures and investing methods. These books do not validate a signal or predict returns." showAudible={false} limit={2} /></div> </>;
}
