import type { Metadata } from "next";

// Ship #9 v1 — Sector Rotation Analyzer hub. Per HOLDLENS_MASTER_ROADMAP,
// the rotation surface is covered by two existing routes: /rotation (the
// quarterly heatmap) and /sector/[slug] (per-sector deep-dives, singular
// prefix). Ship #9 needs the unified /sectors/ (plural) HUB page — a
// clear landing that consolidates both into one navigable entry point.
//
// No new data pipeline. Aggregates existing routes + GICS sector grid.

export const metadata: Metadata = {
  title: "Sector rotation — where smart money is moving by quarter",
  description:
    "Quarterly institutional sector flows + per-sector superinvestor positioning across all 11 GICS sectors. Aggregated from tracked 13F filings. Free, no signup.",
  alternates: { canonical: "https://holdlens.com/sectors" },
  openGraph: {
    title: "Sector rotation — where smart money is moving",
    description:
      "Quarterly institutional sector flows + per-sector superinvestor positioning. Free.",
    url: "https://holdlens.com/sectors",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sector rotation by quarter",
  },
};

type SectorEntry = {
  slug: string;
  name: string;
  tint: string; // tailwind text color for the badge accent
  blurb: string;
};

const SECTORS: SectorEntry[] = [
  {
    slug: "technology",
    name: "Technology",
    tint: "text-sky-400",
    blurb:
      "The most-crowded tracked sector — AAPL, MSFT, META, GOOGL, NVDA. See which superinvestors are adding or trimming.",
  },
  {
    slug: "financials",
    name: "Financials",
    tint: "text-emerald-400",
    blurb:
      "Banks, insurers, asset managers. Buffett's long-time sweet spot — BAC, AXP, MCO.",
  },
  {
    slug: "energy",
    name: "Energy",
    tint: "text-amber-400",
    blurb:
      "CVX, OXY, and the E&P majors. Sharp rotation when oil regimes shift.",
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    tint: "text-rose-400",
    blurb:
      "Pharma, payers, devices. Slow-money sector — positions tend to persist across quarters.",
  },
  {
    slug: "consumer-discretionary",
    name: "Consumer Discretionary",
    tint: "text-orange-400",
    blurb:
      "CMG, NKE, HLT, QSR. Activist territory (Ackman, Icahn) and growth compounders.",
  },
  {
    slug: "consumer-staples",
    name: "Consumer Staples",
    tint: "text-teal-400",
    blurb:
      "Coke, Kraft, household names. The defensive anchor on most tracked portfolios.",
  },
  {
    slug: "industrials",
    name: "Industrials",
    tint: "text-indigo-400",
    blurb: "Rails, airlines, defense, aerospace. Cycle-sensitive flows.",
  },
  {
    slug: "materials",
    name: "Materials",
    tint: "text-lime-400",
    blurb: "Miners, chemicals, packaging. Commodity-cycle positioning.",
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    tint: "text-pink-400",
    blurb: "REIT exposure — typically modest in tracked portfolios.",
  },
  {
    slug: "communication",
    name: "Communication",
    tint: "text-violet-400",
    blurb:
      "META, GOOGL, DIS, T. Often large weights on tech-adjacent portfolios.",
  },
  {
    slug: "utilities",
    name: "Utilities",
    tint: "text-cyan-400",
    blurb:
      "Regulated + renewable utilities. Low-beta defensive book anchor.",
  },
];

const BREADCRUMB_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
    { "@type": "ListItem", position: 2, name: "Sectors", item: "https://holdlens.com/sectors" },
  ],
};

const COLLECTION_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Sector rotation — where smart money is moving",
  description:
    "Quarterly institutional sector flows + per-sector superinvestor positioning across all 11 GICS sectors.",
  url: "https://holdlens.com/sectors",
  inLanguage: "en-US",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: SECTORS.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://holdlens.com/sector/${s.slug}`,
      name: `${s.name} — tracked investor positioning`,
    })),
  },
};

export default function SectorsHub() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(COLLECTION_LD) }} />

      <a href="/" className="text-xs text-muted hover:text-text">← HoldLens</a>

      <header className="mt-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
          Sector rotation
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Where smart money is moving, by sector
        </h1>
        <p className="text-muted text-lg mt-4 leading-relaxed">
          The 11 GICS sectors — aggregated across every 13F filing we track. See which sectors superinvestors rotated INTO last quarter, which they rotated OUT of, and how the positioning compares across cycles.
        </p>
      </header>

      <section className="mt-10">
        <a
          href="/rotation"
          className="block rounded-2xl border border-brand/40 bg-brand/5 p-5 hover:bg-brand/10 transition group"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-brand mb-1">
                Quarterly heatmap
              </div>
              <div className="text-lg font-bold group-hover:text-brand transition">
                See sector-level net flows across every tracked quarter
              </div>
              <div className="text-xs text-muted mt-1">
                Heatmap · $ flows by manager × sector × quarter
              </div>
            </div>
            <div className="text-brand text-sm font-semibold">Open heatmap →</div>
          </div>
        </a>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Pick a sector</h2>
        <p className="text-muted mb-6 text-sm">
          Every sector has a dedicated page showing current tracked positioning, biggest buyers, biggest sellers, and crowded trades.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {SECTORS.map((s) => (
            <a
              key={s.slug}
              href={`/sector/${s.slug}`}
              className="rounded-xl border border-border bg-panel p-4 hover:border-brand hover:bg-panel-hi transition block group"
            >
              <div
                className={`text-[10px] uppercase tracking-widest font-bold mb-2 ${s.tint}`}
              >
                {s.name}
              </div>
              <div className="text-sm text-muted leading-relaxed group-hover:text-text transition">
                {s.blurb}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-3">Method</h2>
        <div className="rounded-xl border border-border bg-panel p-5 text-sm text-muted leading-relaxed space-y-2">
          <p>
            Sector classifications follow the Global Industry Classification Standard (GICS) 11-sector framework used by S&amp;P and MSCI. We map every tracked 13F ticker to its GICS sector via a curated `SECTOR_MAP` in `lib/tickers.ts`; unmapped or ambiguous tickers fall into the "Other" bucket rather than being force-classified.
          </p>
          <p>
            Quarterly flows are computed from the 13F-HR move deltas in our EDGAR mirror (45-day filing lag applies). "Rotation" = net quarterly change across all tracked investors in a sector, weighted by portfolio-impact percentage rather than raw share count — a 1% position for Berkshire counts more than a 10% trim from a $50M fund.
          </p>
          <p>
            13F long-only scope: shorts, cash, and non-US holdings are not reported. Sector rotation reads reflect the long equity side only.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">Related</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <a href="/investor/" className="rounded-xl border border-border bg-panel p-4 hover:border-brand transition block">
            <div className="text-brand text-xs uppercase tracking-widest font-bold mb-1">Superinvestors</div>
            <div className="font-semibold text-text">All 30 tracked managers + full portfolios</div>
          </a>
          <a href="/themes" className="rounded-xl border border-border bg-panel p-4 hover:border-brand transition block">
            <div className="text-brand text-xs uppercase tracking-widest font-bold mb-1">Themes</div>
            <div className="font-semibold text-text">AI, Energy, Banks, Mag 7 — cross-sector clusters</div>
          </a>
          <a href="/biggest-buys" className="rounded-xl border border-border bg-panel p-4 hover:border-brand transition block">
            <div className="text-brand text-xs uppercase tracking-widest font-bold mb-1">Biggest buys</div>
            <div className="font-semibold text-text">This quarter&apos;s highest-conviction adds</div>
          </a>
          <a href="/biggest-sells" className="rounded-xl border border-border bg-panel p-4 hover:border-brand transition block">
            <div className="text-brand text-xs uppercase tracking-widest font-bold mb-1">Biggest sells</div>
            <div className="font-semibold text-text">Conviction collapses + capitulations</div>
          </a>
        </div>
      </section>

      <p className="mt-16 text-xs text-dim">
        Data sourced from SEC 13F-HR filings via EDGAR. 45-day filing lag applies. Long equity positions only. Not investment advice.
      </p>
    </div>
  );
}
