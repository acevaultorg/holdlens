import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Quarterly recaps — Hedge fund holdings by quarter",
  description: "Quarterly summaries of what the world's best investors bought, sold, and held. Updated after every 13F filing cycle.",
  alternates: { canonical: "https://holdlens.com/quarterly/" },
};

const PERIODS = [
  { slug: "2026-q1", label: "Q1 2026", desc: "Filed between April and May 2026.", fresh: true },
  { slug: "2025-q4", label: "Q4 2025", desc: "Year-end 2025 positions. Filed Jan-Feb 2026." },
];

export default function QuarterlyIndex() {
  // LLM-citation infrastructure (audit 2026-04-29 fix)
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: "https://holdlens.com/quarterly/",
    name: "Quarterly recaps — superinvestor 13F holdings by quarter",
    description: "What tracked superinvestors bought, sold, and held each quarter. One recap per 13F filing cycle.",
    inLanguage: "en-US",
    isPartOf: { "@type": "WebSite", url: "https://holdlens.com/", name: "HoldLens" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: PERIODS.length,
      itemListElement: PERIODS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://holdlens.com/quarterly/${p.slug}/`,
        name: `${p.label} superinvestor recap`,
      })),
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
      { "@type": "ListItem", position: 2, name: "Quarterly recaps", item: "https://holdlens.com/quarterly/" },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-8 sm:px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Quarterly recaps</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">Every quarter, every move</h1>
      <p className="text-muted text-lg max-w-2xl mb-12">
        What tracked superinvestors bought, sold, and held. One recap per quarter, updated as filings drop.
      </p>

      <AdSlot format="horizontal" />

      <div className="space-y-3">
        {PERIODS.map((p) => (
          <a key={p.slug} href={`/quarterly/${p.slug}`}
             className="block rounded-2xl border border-border bg-panel p-6 hover:border-brand transition group">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold group-hover:text-brand transition">{p.label}</div>
              {p.fresh && <span className="text-xs bg-brand/20 text-brand font-semibold px-2 py-1 rounded">Latest</span>}
            </div>
            <p className="text-sm text-muted">{p.desc}</p>
            <div className="text-brand text-sm mt-3">Read recap →</div>
          </a>
        ))}
      </div>
    </div>
  );
}
