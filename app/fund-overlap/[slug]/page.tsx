import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOverlapPair, getAllOverlapPairs } from "@/lib/fund-overlap-pairs";
import TickerLink from "@/components/TickerLink";
import { getConviction, formatSignedScore } from "@/lib/conviction";

// /fund-overlap/[a-vs-b] — per-pair detail pages.
//
// 435 deterministic pages (C(30,2)). Each carries UNIQUE data — the
// intersection of two real EDGAR-disclosed portfolios. Passes CSIL #30
// thin-content gate: per page has ≥3 shared tickers minimum (filter
// below), real position %, real Jaccard score, real per-ticker
// ConvictionScore lookup.
//
// Compounds: LLM-citation gravity for "stocks Buffett AND Munger own",
// "where Burry and Klarman overlap", "value-investor consensus picks."
// Per `rules/aceusergrowth.md` v3 Part 23 LLM-citation 10-char checklist:
//   1. Accessible (static export, no JS-gated content) ✓
//   2. Useful (data nobody else aggregates this way) ✓
//   4. Extractable (table with sortable named columns) ✓
//   6. Corroborated (numbers verifiable in SEC EDGAR filings) ✓
//   8. Differentiated (cross-pair conviction analysis — unique angle) ✓

export const dynamic = "force-static";

export async function generateStaticParams() {
  const pairs = getAllOverlapPairs();
  // Only generate pages for pairs with substantive overlap (≥2 shared
  // tickers). This is the CSIL #30 substance floor in practice — pairs
  // with 0-1 shared tickers would be thin pages and risk an HCU flag.
  return pairs
    .filter((p) => p.overlapCount >= 2)
    .map((p) => ({ slug: p.slug }));
}

type Params = { slug: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  const pair = getOverlapPair(slug);
  if (!pair) {
    return { title: "Pair not found — HoldLens" };
  }
  const desc = `${pair.a.name} and ${pair.b.name} both hold ${pair.overlapCount} of the same stocks. Combined conviction: ${pair.jointConviction.toFixed(1)}% of portfolio. Top shared: ${pair.shared.slice(0, 3).map((s) => s.ticker).join(", ")}.`;
  return {
    title: `${pair.a.name} vs ${pair.b.name} — shared stocks both own`,
    description: desc.slice(0, 159),
    alternates: { canonical: `https://holdlens.com/fund-overlap/${slug}/` },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${pair.a.name} and ${pair.b.name} — what they both own`,
      description: desc,
      url: `https://holdlens.com/fund-overlap/${slug}/`,
      type: "article",
    },
  };
}

export default async function FundOverlapPair({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const pair = getOverlapPair(slug);
  if (!pair) notFound();
  if (pair.overlapCount < 2) notFound();

  const url = `https://holdlens.com/fund-overlap/${slug}/`;
  // Per-ticker ConvictionScore enrichment, with try/catch so a single
  // bad-data ticker can't crash the whole 435-page surface.
  const sharedWithScores = pair.shared.slice(0, 25).map((h) => {
    try {
      const conv = getConviction(h.ticker);
      return { ...h, score: conv.signedScore, label: conv.label };
    } catch {
      return { ...h, score: 0, label: "n/a" };
    }
  });

  // Article schema — JointInvestmentReport. Factual headline (Pivot A safe).
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": url,
    headline: `${pair.a.name} and ${pair.b.name} — shared stock holdings comparison`,
    description: `Comparison of EDGAR-filed 13F portfolios. ${pair.overlapCount} shared tickers, ${(pair.jaccard * 100).toFixed(1)}% Jaccard overlap.`,
    datePublished: "2026-05-13T00:00:00Z",
    dateModified: new Date().toISOString(),
    inLanguage: "en-US",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://holdlens.com/",
      name: "HoldLens",
      url: "https://holdlens.com/",
    },
    publisher: {
      "@type": "Organization",
      name: "HoldLens",
      url: "https://holdlens.com/",
    },
    author: {
      "@type": "Organization",
      name: "HoldLens editorial",
      url: "https://holdlens.com/about/",
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
      { "@type": "ListItem", position: 2, name: "Fund overlap", item: "https://holdlens.com/fund-overlap/" },
      { "@type": "ListItem", position: 3, name: `${pair.a.name} vs ${pair.b.name}`, item: url },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <nav className="text-xs uppercase tracking-widest text-muted mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">HoldLens</Link>
        <span className="mx-2">›</span>
        <Link href="/fund-overlap/" className="hover:text-brand">Fund overlap</Link>
      </nav>

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Portfolio overlap · pairwise 13F intersection
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        {pair.a.name}{" "}
        <span className="text-muted text-2xl sm:text-3xl">&middot;</span>{" "}
        {pair.b.name}
        <br />
        <span className="text-2xl sm:text-3xl font-semibold text-muted">
          what they both own
        </span>
      </h1>
      <p className="text-lg text-muted mb-8 leading-relaxed">
        Both {pair.a.name} ({pair.a.fund}) and {pair.b.name} ({pair.b.fund})
        hold {pair.overlapCount} of the same stocks per their latest 13F
        filings — a Jaccard overlap of {(pair.jaccard * 100).toFixed(1)}%
        across portfolios of {pair.sizeA} and {pair.sizeB} positions.
        Combined position weight in shared names: {pair.jointConviction.toFixed(1)}%
        of each investor's portfolio capacity.
      </p>

      <div className="rounded-2xl border-2 border-border bg-panel p-5 md:p-6 mb-10">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-text">{pair.overlapCount}</div>
            <div className="text-xs uppercase tracking-widest text-muted mt-1">
              Shared tickers
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-text">{(pair.jaccard * 100).toFixed(1)}%</div>
            <div className="text-xs uppercase tracking-widest text-muted mt-1">
              Jaccard overlap
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-text">{pair.jointConviction.toFixed(1)}%</div>
            <div className="text-xs uppercase tracking-widest text-muted mt-1">
              Joint conviction
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Shared positions, ranked by joint conviction</h2>
      <p className="text-sm text-muted mb-5 leading-relaxed">
        Joint conviction = {pair.a.name}&apos;s portfolio weight +{" "}
        {pair.b.name}&apos;s portfolio weight. A stock that both investors
        size heavily ranks higher than one both hold marginally. Position
        weight reflects each investor&apos;s most recent 13F filing
        (45-day SEC lag applies; filings can be 1-3 months old).
      </p>

      <div className="overflow-x-auto rounded-2xl border border-border bg-panel">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg/30">
              <th className="text-left p-3 font-semibold">Ticker</th>
              <th className="text-right p-3 font-semibold">{pair.a.name.split(" ").slice(-1)}</th>
              <th className="text-right p-3 font-semibold">{pair.b.name.split(" ").slice(-1)}</th>
              <th className="text-right p-3 font-semibold">Joint</th>
              <th className="text-right p-3 font-semibold">ConvictionScore</th>
            </tr>
          </thead>
          <tbody>
            {sharedWithScores.map((h) => (
              <tr key={h.ticker} className="border-b border-border/40 last:border-b-0 hover:bg-bg/30">
                <td className="p-3">
                  <TickerLink symbol={h.ticker} className="font-semibold text-brand hover:underline">
                    {h.ticker}
                  </TickerLink>
                  <span className="text-xs text-muted ml-2 hidden sm:inline">{h.name}</span>
                </td>
                <td className="p-3 text-right tabular-nums">{h.pctA.toFixed(1)}%</td>
                <td className="p-3 text-right tabular-nums">{h.pctB.toFixed(1)}%</td>
                <td className="p-3 text-right tabular-nums font-semibold">{h.combinedPct.toFixed(1)}%</td>
                <td className="p-3 text-right tabular-nums text-muted">
                  {formatSignedScore(h.score)}
                </td>
              </tr>
            ))}
            {pair.shared.length > 25 && (
              <tr>
                <td colSpan={5} className="p-3 text-center text-xs text-muted">
                  Showing top 25 of {pair.overlapCount} shared positions.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <section className="mt-10 rounded-2xl border border-border bg-panel p-5">
        <h2 className="text-lg font-bold mb-3">Compare individually</h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href={`/investor/${pair.a.slug}/`}
            className="rounded-md bg-brand px-4 py-2 font-semibold text-bg hover:bg-brand/90 transition"
          >
            {pair.a.name}&apos;s full portfolio →
          </Link>
          <Link
            href={`/investor/${pair.b.slug}/`}
            className="rounded-md border border-brand px-4 py-2 font-semibold text-brand hover:bg-brand/5 transition"
          >
            {pair.b.name}&apos;s full portfolio →
          </Link>
        </div>
      </section>

      <section className="mt-10 text-sm text-muted leading-relaxed">
        <p>
          <strong className="text-text">Data note.</strong> Position
          percentages are derived from each investor&apos;s most recent
          SEC Form 13F filing (45-day lag), filtered to disclosed long
          positions only. 13F filings exclude short positions, options
          (mostly), foreign-domiciled holdings, and positions below the
          reporting threshold. Joint conviction is a descriptive sum, not
          a recommendation. Per HoldLens compliance: this page is
          factual portfolio comparison, not investment advice. Always
          verify against the source filing before acting.
        </p>
      </section>

      <div className="mt-12 border-t border-border pt-6 text-sm">
        <Link href="/fund-overlap/" className="text-muted hover:text-brand">
          ← All overlap pairs
        </Link>
      </div>
    </div>
  );
}
