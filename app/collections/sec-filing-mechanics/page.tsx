import InvestingBooks from "@/components/InvestingBooks";
import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";

export const metadata: Metadata = {
  title: "SEC filing mechanics — plain-English form guides | HoldLens",
  description:
    "Eleven plain-English guides to the SEC forms HoldLens uses: 13F, Form 4, DEF 14A, 13D/13G, Rule 144, EDGAR, and CUSIPs. The 'how' beneath every signal we publish.",
  alternates: { canonical: "https://holdlens.com/collections/sec-filing-mechanics" },
  openGraph: {
    title: "SEC filing mechanics — HoldLens",
    description: "Eleven plain-English guides to the SEC forms HoldLens uses.",
    url: "https://holdlens.com/collections/sec-filing-mechanics",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — SEC filing mechanics" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEC filing mechanics — HoldLens",
    description: "Plain-English form guides for serious public-markets readers.",
    images: ["/og/home.png"],
  },
};

const ITEMS = [
  { slug: "edgar-explained", title: "What is SEC EDGAR?", blurb: "The SEC's public filing database — every 10-K, 13F, Form 4 since 1993, free." },
  { slug: "what-is-a-13f", title: "What is a 13F filing?", blurb: "Plain English guide to SEC Form 13F." },
  { slug: "how-to-read-a-13f", title: "How to read a 13F in 5 minutes", blurb: "Step-by-step with real Berkshire examples." },
  { slug: "45-day-lag-explained", title: "The 45-day lag in 13F filings", blurb: "Why every 13F is six weeks late by design." },
  { slug: "13f-vs-13d-vs-13g", title: "13F vs 13D vs 13G", blurb: "Three SEC filings, three signals." },
  { slug: "13d-vs-13g-activist-filings", title: "13D vs 13G — activist vs passive", blurb: "When an investor crosses 5%, which filing they pick reveals intent." },
  { slug: "13f-securities-list", title: "The 13(f) securities list", blurb: "What counts as a 13F holding — and what doesn't." },
  { slug: "form-4-vs-13f", title: "Form 4 vs 13F", blurb: "Insider trades vs institutional portfolios — two SEC filings, two signals." },
  { slug: "proxy-voting-def-14a", title: "Proxy voting and DEF 14A", blurb: "The definitive proxy statement — read the 1-page summary in 10 minutes." },
  { slug: "rule-144-holding-period", title: "Rule 144 holding period", blurb: "When corporate insiders can sell — 6-month vs 12-month rules." },
  { slug: "cusip-explained", title: "What is a CUSIP?", blurb: "The 9-character identifier behind every 13F line item." },
];

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Collections", item: "https://holdlens.com/collections" },
      { "@type": "ListItem", position: 3, name: "SEC filing mechanics", item: "https://holdlens.com/collections/sec-filing-mechanics" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "SEC filing mechanics",
    description: "Eleven plain-English guides to the SEC forms HoldLens uses.",
    url: "https://holdlens.com/collections/sec-filing-mechanics",
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

export default function SecFilingMechanicsCollectionPage() {
  return <> {(
    <div className="max-w-3xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/collections" className="text-xs text-muted hover:text-text">← Collections</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Collections · SEC filing mechanics</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">SEC filing mechanics</h1>
      <p className="text-lg text-muted leading-relaxed mb-10">
        Eleven plain-English guides to the SEC forms HoldLens uses to produce its data. Read
        these in order to understand the structural difference between Form 13F (institutional
        quarterly), Form 4 (insider real-time), DEF 14A (annual proxy), and the 5%-stake
        filings (13D activist, 13G passive). Every fact on HoldLens traces back to one of
        these forms.
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
      <p className="text-xs text-dim pt-8 border-t border-border mt-12">
        Sister-site reference for every SEC form ever filed:{" "}
        <a href="https://secfilingdex.com" className="text-brand underline" rel="noopener">
          SecFilingDex
        </a>
        .
      </p>
    </div>
  )} <div className="mx-auto max-w-5xl px-6"><InvestingBooks heading="Reading for your research" sub="Optional background reading on interpreting company disclosures and investing methods. These books do not validate a signal or predict returns." showAudible={false} limit={2} /></div> </>;
}
