import type { Metadata } from "next";
import Link from "next/link";
import { getAllOverlapPairs, getTopOverlapPairs } from "@/lib/fund-overlap-pairs";
import { MANAGERS } from "@/lib/managers";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Fund overlap — which superinvestors hold the same stocks",
  description:
    "All pairwise overlap between 30 tracked superinvestors. 435 manager pairs, ranked by joint conviction. Find the consensus stocks across value, growth, contrarian, and activist investing styles.",
  alternates: { canonical: "https://holdlens.com/fund-overlap/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Fund overlap — where superinvestors agree",
    description: "Every pairwise overlap across 30 tracked investors. 435 pages of unique 13F intersection data.",
    url: "https://holdlens.com/fund-overlap/",
    type: "website",
  },
};

export default function FundOverlapHub() {
  const allPairs = getAllOverlapPairs();
  const substantive = allPairs.filter((p) => p.overlapCount >= 2);
  const top = getTopOverlapPairs(30).filter((p) => p.overlapCount >= 2);

  // Group: pairs containing each manager (for nav)
  const byManager = new Map<string, typeof top>();
  for (const m of MANAGERS) {
    byManager.set(m.slug, [] as typeof top);
  }
  for (const p of substantive) {
    byManager.get(p.a.slug)?.push(p);
    byManager.get(p.b.slug)?.push(p);
  }

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://holdlens.com/fund-overlap/",
    url: "https://holdlens.com/fund-overlap/",
    name: "HoldLens Fund Overlap — pairwise 13F intersection across 30 superinvestors",
    description: "All pairwise portfolio overlap across tracked superinvestors. Each pair is a unique data page showing shared 13F-disclosed positions.",
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://holdlens.com/",
      name: "HoldLens",
      url: "https://holdlens.com/",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: substantive.length,
      itemListElement: top.slice(0, 20).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Article",
          "@id": `https://holdlens.com/fund-overlap/${p.slug}/`,
          url: `https://holdlens.com/fund-overlap/${p.slug}/`,
          headline: `${p.a.name} and ${p.b.name} — shared holdings`,
        },
      })),
    },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        {substantive.length} pairwise overlap pages
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5">
        Where superinvestors agree —{" "}
        <span className="text-muted">stock-by-stock</span>
      </h1>
      <p className="text-lg text-muted mb-8 max-w-3xl leading-relaxed">
        Every pair of HoldLens-tracked superinvestors, ranked by joint
        conviction in shared 13F-disclosed positions. Each page is a
        unique 13F intersection — what one of the world&apos;s best
        investors AND another both currently hold.
      </p>
      <p className="text-base text-text mb-10 max-w-3xl leading-relaxed">
        Single-investor watchlists tell you one perspective. Two investors
        independently holding the same stock is a stronger signal — both
        ran their own due diligence, both sized the position. The pages
        below rank the highest-conviction pairs and let you drill into
        any combination.
      </p>

      <h2 className="text-2xl font-bold mb-4">Top 30 highest-conviction pairs</h2>
      <div className="rounded-2xl border border-border overflow-hidden mb-12">
        <table className="w-full text-sm">
          <thead className="bg-panel">
            <tr className="border-b border-border">
              <th className="text-left p-3 font-semibold w-12">#</th>
              <th className="text-left p-3 font-semibold">Pair</th>
              <th className="text-right p-3 font-semibold hidden sm:table-cell">Shared</th>
              <th className="text-right p-3 font-semibold">Joint conviction</th>
            </tr>
          </thead>
          <tbody>
            {top.map((p, i) => (
              <tr key={p.slug} className="border-b border-border/40 last:border-b-0 hover:bg-bg/30">
                <td className="p-3 text-muted tabular-nums">{i + 1}</td>
                <td className="p-3">
                  <Link
                    href={`/fund-overlap/${p.slug}/`}
                    className="font-semibold text-brand hover:underline"
                  >
                    {p.a.name} &amp; {p.b.name}
                  </Link>
                  <div className="text-xs text-muted mt-0.5">
                    {p.shared.slice(0, 3).map((s) => s.ticker).join(", ")}
                    {p.shared.length > 3 ? "…" : ""}
                  </div>
                </td>
                <td className="p-3 text-right tabular-nums hidden sm:table-cell">{p.overlapCount}</td>
                <td className="p-3 text-right tabular-nums font-semibold">{p.jointConviction.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mb-4">Browse by investor</h2>
      <p className="text-sm text-muted mb-5">
        Pick any tracked investor to see their full overlap fingerprint —
        every other investor they share holdings with, sorted by joint conviction.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MANAGERS.map((m) => {
          const pairs = byManager.get(m.slug) ?? [];
          const topPair = pairs
            .slice()
            .sort((a, b) => b.jointConviction - a.jointConviction)[0];
          if (!topPair) return null;
          return (
            <div
              key={m.slug}
              className="rounded-xl border border-border bg-panel p-4 hover:border-brand/40 transition"
            >
              <div className="font-semibold text-text mb-1">{m.name}</div>
              <div className="text-xs text-muted mb-2">
                {pairs.length} pairs · top match:
              </div>
              <Link
                href={`/fund-overlap/${topPair.slug}/`}
                className="block text-sm text-brand hover:underline truncate"
              >
                vs {topPair.a.slug === m.slug ? topPair.b.name : topPair.a.name} ({topPair.jointConviction.toFixed(0)}%)
              </Link>
            </div>
          );
        })}
      </div>

      <section className="mt-16 rounded-2xl border border-border bg-panel p-6">
        <h2 className="text-lg font-bold mb-3">How joint conviction is computed</h2>
        <p className="text-sm text-text leading-relaxed mb-3">
          Joint conviction is the sum of both investors&apos; portfolio
          weights in shared positions. If Buffett holds Apple at 22% and
          Druckenmiller holds Apple at 8%, that single ticker contributes
          30 to their joint conviction. Joint conviction reflects how
          aligned two portfolios are, weighted by position size — not
          just whether they share names.
        </p>
        <p className="text-sm text-muted leading-relaxed">
          Pages with fewer than 2 shared positions are not generated.
          Data lag: positions reflect each investor&apos;s most recent
          SEC Form 13F filing (45-day filing lag). 13F excludes shorts,
          most options, and foreign-domiciled holdings. This is descriptive
          analysis of public filings — not investment advice.
        </p>
      </section>

      <div className="mt-12 border-t border-border pt-6 text-sm">
        <Link href="/overlap/" className="text-muted hover:text-brand">
          See the original overlap rankings (legacy view) →
        </Link>
      </div>
    </div>
  );
}
