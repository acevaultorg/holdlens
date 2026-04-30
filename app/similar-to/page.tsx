import type { Metadata } from "next";
import Link from "next/link";
import FundLogo from "@/components/FundLogo";
import AdSlot from "@/components/AdSlot";
import FoundersNudge from "@/components/FoundersNudge";
import BrokerCta from "@/components/BrokerCta";
import { MANAGERS } from "@/lib/managers";

// /similar-to/ — index page. Lists all 30 tracked superinvestors as entry
// points to /similar-to/[investor]/ similarity rankings.
//
// Created v1.91 (2026-04-29) to fix a 404 in DesktopNav + MobileNav.
// Pre-fix the nav linked to /similar-to/ (no slug) which 404'd because only
// /similar-to/[investor]/ pages existed. This index pages closes the loop
// AND adds a discovery-rich landing page for the entire similarity feature.

export const metadata: Metadata = {
  title: "Similar portfolios — find the superinvestor most like another",
  description:
    "Cross-reference 30 tracked superinvestors by 13F portfolio overlap. Pick a manager, see who runs the most similar book — Jaccard similarity on shared-ticker union. Free.",
  alternates: { canonical: "https://holdlens.com/similar-to/" },
  openGraph: {
    title: "Similar portfolios — Jaccard overlap across 30 superinvestors",
    description:
      "Pick a manager. See who else runs the most similar 13F portfolio. Discover peers by shared-ticker overlap, not just style.",
    url: "https://holdlens.com/similar-to/",
    type: "website",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "HoldLens — 30 superinvestors, one ConvictionScore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Similar portfolios — Jaccard overlap across 30 superinvestors",
    description:
      "Pick a manager. See who else runs the most similar 13F portfolio.",
    images: ["/og/home.png"],
  },
};

export default function SimilarToIndexPage() {
  // Sort by manager name for deterministic, scannable list.
  const managers = [...MANAGERS].sort((a, b) => a.name.localeCompare(b.name));

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: "https://holdlens.com/similar-to/",
    name: "Similar portfolios — find which superinvestors run alike books",
    description:
      "Index of 30 tracked superinvestors. Each links to a portfolio-similarity ranking against the other 29 — Jaccard overlap on shared-ticker union of the 13F filings.",
    dateModified: new Date().toISOString().slice(0, 10),
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      url: "https://holdlens.com/",
      name: "HoldLens",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: managers.length,
      itemListElement: managers.map((m, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://holdlens.com/similar-to/${m.slug}`,
        name: `Investors who trade like ${m.name}`,
      })),
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
      { "@type": "ListItem", position: 2, name: "Similar portfolios", item: "https://holdlens.com/similar-to/" },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Similarity matrix
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Find which superinvestors <span className="text-brand">run similar books</span>.
      </h1>
      <p className="text-muted text-lg leading-relaxed max-w-2xl mb-3">
        Pick any tracked manager. See the top-10 peers whose 13F portfolios overlap
        the most by shared-ticker count.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        Methodology: Jaccard similarity on the union of held tickers — score
        = |A ∩ B| / |A ∪ B|. Lined up against curated topHoldings + EDGAR-wide
        holdings where available. Updated each quarterly 13F cycle.
      </p>

      <section className="mb-12">
        <h2 className="text-xs uppercase tracking-widest text-dim font-semibold mb-4">
          {managers.length} tracked managers — click to see who they trade like
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {managers.map((m) => (
            <Link
              key={m.slug}
              href={`/similar-to/${m.slug}`}
              className="rounded-xl border border-border bg-panel p-4 hover:border-brand/40 transition flex items-center gap-3"
            >
              <FundLogo slug={m.slug} name={m.fund} size={36} />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-text truncate">{m.name}</div>
                <div className="text-xs text-dim truncate">{m.fund}</div>
              </div>
              <span className="text-brand text-sm shrink-0">→</span>
            </Link>
          ))}
        </div>
      </section>

      <FoundersNudge tone="brand" context="You're cross-referencing portfolio overlap across 30 tracked smart-money managers." />
      <BrokerCta context="Want to mirror a manager whose book matches your style? Compare brokers with low-friction execution." />
      <AdSlot format="horizontal" />

      <section className="border-t border-border pt-10 mt-12">
        <h2 className="text-xl font-bold text-text mb-4">Related surfaces</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/overlap/"
            className="rounded-xl border border-border bg-panel p-5 hover:border-brand/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">Overlap matrix</div>
            <div className="text-xs text-muted">
              Pair-by-pair holding overlap across the entire fleet — every manager × every other.
            </div>
          </Link>
          <Link
            href="/by-philosophy/"
            className="rounded-xl border border-border bg-panel p-5 hover:border-brand/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">By philosophy</div>
            <div className="text-xs text-muted">
              Managers grouped by investing style — value, growth, macro, activist, quant.
            </div>
          </Link>
          <Link
            href="/manager-rankings/"
            className="rounded-xl border border-border bg-panel p-5 hover:border-brand/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">Manager rankings</div>
            <div className="text-xs text-muted">
              Composite ranking by 10y CAGR, AUM, conviction, and track record.
            </div>
          </Link>
        </div>
      </section>

      <p className="text-xs text-dim mt-12">
        Similarity is calculated on the most recent 13F filing per manager.
        Filings are delayed 45 days from quarter-end. Not investment advice.{" "}
        <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
