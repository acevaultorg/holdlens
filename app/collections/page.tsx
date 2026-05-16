import type { Metadata } from "next";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";

export const metadata: Metadata = {
  title: "Collections — topical clusters across /learn | HoldLens",
  description:
    "Four topical collections covering all 34 HoldLens /learn essays: famous trades, SEC filing mechanics, HoldLens signals + methodology, and capital allocation.",
  alternates: { canonical: "https://holdlens.com/collections" },
  openGraph: {
    title: "HoldLens Collections — 34 essays across 4 topical clusters",
    description:
      "Four topical collections covering all 34 HoldLens /learn essays.",
    url: "https://holdlens.com/collections",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens Collections" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HoldLens Collections",
    description: "34 essays across 4 topical clusters.",
    images: ["/og/home.png"],
  },
};

type Collection = {
  slug: string;
  name: string;
  description: string;
  count: number;
};

const COLLECTIONS: Collection[] = [
  {
    slug: "famous-trades",
    name: "Famous trades",
    description:
      "Eight historical trades reconstructable from SEC EDGAR alone — Berkshire/KO, Berkshire/Apple, Berkshire/BAC 2011, Burry/Big Short, Ackman/Herbalife, Soros-Druckenmiller/GBP, Munger/Costco, Icahn/Apple.",
    count: 8,
  },
  {
    slug: "sec-filing-mechanics",
    name: "SEC filing mechanics",
    description:
      "Plain-English guides to the SEC forms that produce HoldLens's data: 13F, Form 4, DEF 14A, 13D/13G, Rule 144, EDGAR, and CUSIPs.",
    count: 11,
  },
  {
    slug: "signals-and-methodology",
    name: "HoldLens signals + methodology",
    description:
      "How HoldLens computes ConvictionScore, InsiderScore, Event Score, and why no single SEC filing tells the whole story.",
    count: 10,
  },
  {
    slug: "capital-allocation",
    name: "Capital allocation + corporate finance",
    description:
      "Buybacks, dividends, short interest, ETF overlap, congressional stock trading — adjacent topics for serious public-markets readers.",
    count: 5,
  },
];

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Collections", item: "https://holdlens.com/collections" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "HoldLens Collections — topical clusters",
    description:
      "Four topical collections grouping the 34 HoldLens /learn essays by theme.",
    url: "https://holdlens.com/collections",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    datePublished: "2026-05-16",
    dateModified: "2026-05-16",
    inLanguage: "en-US",
  },
];

export default function CollectionsIndexPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">
        Collections
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
        Topical collections across /learn
      </h1>
      <p className="text-lg text-muted leading-relaxed mb-10">
        Every HoldLens /learn essay is grouped into one of four topical clusters. Each
        collection has its own hub page; the full /learn index (34 essays) is at{" "}
        <a href="/learn" className="text-brand underline">/learn</a>.
      </p>

      <div className="space-y-3 mb-12">
        {COLLECTIONS.map((c) => (
          <a
            key={c.slug}
            href={`/collections/${c.slug}`}
            className="block rounded-card border border-border bg-surface p-5 hover:border-brand/60 hover:bg-brand/5 transition-all duration-base ease-swift group"
          >
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <h2 className="text-lg font-bold text-text group-hover:text-brand transition-colors">
                {c.name}
              </h2>
              <span className="text-xs text-muted/80 shrink-0">{c.count} essays</span>
            </div>
            <p className="text-sm text-muted leading-relaxed">{c.description}</p>
            <div className="text-xs text-brand font-semibold mt-3">
              Browse the collection →
            </div>
          </a>
        ))}
      </div>

      <p className="text-xs text-dim pt-8 border-t border-border mt-8">
        Machine-readable index of all 34 essays:{" "}
        <a href="/api/v1/learn.json" className="underline">
          /api/v1/learn.json
        </a>
        {" — includes collection groupings for LLM retrieval."}
      </p>
    </div>
  );
}
