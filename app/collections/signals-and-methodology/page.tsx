import InvestingBooks from "@/components/InvestingBooks";
import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";

export const metadata: Metadata = {
  title: "Signals + methodology — how HoldLens scores | HoldLens",
  description:
    "Ten essays on HoldLens's scoring methodology: ConvictionScore, InsiderScore, Event Score, the SEC signals trilogy, and the limits of 13F-based signal generation.",
  alternates: { canonical: "https://holdlens.com/collections/signals-and-methodology" },
  openGraph: {
    title: "Signals + methodology — HoldLens",
    description: "Ten essays on how HoldLens scores SEC-filing data.",
    url: "https://holdlens.com/collections/signals-and-methodology",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — signals + methodology" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Signals + methodology — HoldLens",
    description: "How ConvictionScore, InsiderScore, and Event Score work.",
    images: ["/og/home.png"],
  },
};

const ITEMS = [
  { slug: "superinvestor-handbook", title: "The Superinvestor Handbook", blurb: "The full 10-section guide — 13F filings, conviction signals, copy-trading myths." },
  { slug: "what-is-alpha", title: "What is alpha?", blurb: "The hedge fund edge explained without jargon." },
  { slug: "conviction-score-explained", title: "What is a Conviction Score?", blurb: "How to tell a real bet from index padding." },
  { slug: "insider-score-explained", title: "What is the Insider Score?", blurb: "The Form 4 insider-transaction metric synthesizing the tracked-superinvestor universe." },
  { slug: "event-score-explained", title: "What is the Event Score?", blurb: "8-K material events on a unified scale; item taxonomy + weight calibration." },
  { slug: "sec-signals-trilogy", title: "The SEC signals trilogy", blurb: "13F + Form 4 + 8-K read together; why no single filing tells the whole story." },
  { slug: "do-hedge-fund-signals-work", title: "Do 13F signals actually predict returns?", blurb: "Original backtest — 221 ticker-quarter pairs, r = −0.12." },
  { slug: "copy-trading-myth", title: "The copy-trading myth", blurb: "Why mechanically copying Buffett underperforms the underlying portfolio." },
  { slug: "warren-buffett-method", title: "The Warren Buffett method", blurb: "Which Buffett principles are actually transferable." },
  { slug: "survivorship-bias-in-hedge-funds", title: "Survivorship bias in hedge funds", blurb: "Why every hedge fund performance number you read is probably an overestimate." },
];

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Collections", item: "https://holdlens.com/collections" },
      { "@type": "ListItem", position: 3, name: "Signals + methodology", item: "https://holdlens.com/collections/signals-and-methodology" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Signals + methodology",
    description: "Ten essays on how HoldLens scores SEC-filing data.",
    url: "https://holdlens.com/collections/signals-and-methodology",
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

export default function SignalsMethodologyCollectionPage() {
  return <> {(
    <div className="max-w-3xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/collections" className="text-xs text-muted hover:text-text">← Collections</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Collections · Signals + methodology</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">Signals + methodology</h1>
      <p className="text-lg text-muted leading-relaxed mb-10">
        Ten essays on how HoldLens computes its scores and why no single SEC filing tells the
        whole story. Start with The Superinvestor Handbook, then dig into ConvictionScore,
        InsiderScore, and the SEC signals trilogy. Includes our honest original-research
        finding: 13F signals alone don&apos;t predict forward returns (r = −0.12 across 221
        ticker-quarter pairs).
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
