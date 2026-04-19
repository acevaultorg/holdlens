import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FundLogo from "@/components/FundLogo";
import { MANAGERS, getManager } from "@/lib/managers";
import { topSimilarInvestors } from "@/lib/similarity";

// Ship #8 v1 — Portfolio Similarity Scorer. Per-investor programmatic
// page showing the top-10 tracked superinvestors whose 13F portfolios
// most resemble this manager's (Jaccard on shared-ticker union).
//
// Discovery pattern: user lands on /investor/[X] via search, sees "you
// might also like" sidebar, clicks /similar-to/[X] for the full
// ranking, then drills into /investor/[Y] for the most similar peer.
// Retention loop closed without any additional acquisition cost.
//
// No new data pipeline. Uses existing EDGAR holdings + curated
// topHoldings via lib/similarity.ts (static-export-safe).

export async function generateStaticParams() {
  return MANAGERS.map((m) => ({ investor: m.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ investor: string }> },
): Promise<Metadata> {
  const { investor } = await params;
  const m = getManager(investor);
  if (!m) return { title: "Investor not found" };
  const title = `Investors who trade like ${m.name}`;
  const description = `The ${m.name} (${m.fund}) 13F portfolio matched against 29 other tracked superinvestors by shared-ticker overlap. See who runs the most similar book.`;
  return {
    title,
    description,
    alternates: {
      canonical: `https://holdlens.com/similar-to/${m.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://holdlens.com/similar-to/${m.slug}`,
      type: "article",
      images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: ["/og/home.png"],
    },
  };
}

export default async function SimilarToPage(
  { params }: { params: Promise<{ investor: string }> },
) {
  const { investor } = await params;
  const m = getManager(investor);
  if (!m) notFound();

  const scores = topSimilarInvestors(m.slug, 15);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
      { "@type": "ListItem", position: 2, name: "Similar investors", item: "https://holdlens.com/similar-to" },
      { "@type": "ListItem", position: 3, name: m.name, item: `https://holdlens.com/similar-to/${m.slug}` },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Investors who trade like ${m.name}`,
    description: `Shared-ticker Jaccard similarity between ${m.name} and 29 tracked superinvestors, ranked.`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://holdlens.com/similar-to/${m.slug}`,
    },
    datePublished: "2026-04-19",
    publisher: { "@id": "https://holdlens.com/#organization" },
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />

      <a href={`/investor/${m.slug}`} className="text-xs text-muted hover:text-text">← {m.name}'s full portfolio</a>

      <header className="mt-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
          Portfolio similarity
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Investors who trade like {m.name}
        </h1>
        <p className="text-muted text-lg mt-4 leading-relaxed">
          The 29 other tracked superinvestors ranked by shared-ticker overlap with {m.name}'s ({m.fund}) latest 13F portfolio. Jaccard similarity — the fraction of tickers held by both investors out of the union of tickers held by either.
        </p>
      </header>

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Top similar investors</h2>
        {scores.length === 0 ? (
          <div className="rounded-xl border border-border bg-panel p-5 text-sm text-muted">
            No similarity data yet — {m.name}'s portfolio may not have enough overlap with the tracked set.
          </div>
        ) : (
          <ol className="space-y-3">
            {scores.map((s, i) => {
              const peer = getManager(s.investor_b);
              if (!peer) return null;
              const pct = Math.round(s.jaccard * 100);
              return (
                <li key={s.investor_b} className="rounded-2xl border border-border bg-panel hover:border-brand/50 transition">
                  <a href={`/investor/${peer.slug}`} className="flex items-start gap-4 p-4 sm:p-5 group">
                    <div className="text-dim text-sm tabular-nums w-6 flex-none pt-1">{i + 1}</div>
                    <div className="flex-none">
                      <FundLogo slug={peer.slug} name={peer.name} size={36} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <div className="font-semibold text-text group-hover:text-brand transition">
                            {peer.name}
                          </div>
                          <div className="text-xs text-dim mt-0.5">{peer.fund}</div>
                        </div>
                        <div className="text-right flex-none">
                          <div className="text-xl font-bold text-brand tabular-nums">{pct}%</div>
                          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">Jaccard</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted mt-2">
                        {s.shared_count} shared of {s.union_count} total tickers
                        {s.shared_tickers.length > 0 && (
                          <>
                            {" — "}
                            <span className="text-text">
                              {s.shared_tickers.map((t, idx) => (
                                <span key={t}>
                                  {idx > 0 && <span className="text-dim"> · </span>}
                                  <span className="font-semibold">{t}</span>
                                </span>
                              ))}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </a>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">Method</h2>
        <div className="rounded-xl border border-border bg-panel p-5 text-sm text-muted leading-relaxed space-y-2">
          <p>
            <strong className="text-text">Jaccard similarity</strong> = |A ∩ B| / |A ∪ B| where A and B are the sets of tickers each investor holds in their most recent 13F filing.
          </p>
          <p>
            A score of 100% means both investors hold exactly the same tickers. A score of 0% means no overlap. In practice, tracked superinvestors rarely exceed 40% — they pick unique spots even within similar philosophies.
          </p>
          <p>
            Source data: SEC EDGAR 13F-HR filings, latest quarter available per investor. v1 uses unweighted Jaccard (set membership). v2 will add position-weighted similarity for a finer-grained score.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">Related</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <a href={`/investor/${m.slug}`} className="rounded-xl border border-border bg-panel p-4 hover:border-brand transition block">
            <div className="text-brand text-xs uppercase tracking-widest font-bold mb-1">Full portfolio</div>
            <div className="font-semibold text-text">{m.name}'s 13F positions</div>
          </a>
          <a href="/leaderboard" className="rounded-xl border border-border bg-panel p-4 hover:border-brand transition block">
            <div className="text-brand text-xs uppercase tracking-widest font-bold mb-1">All 30 superinvestors</div>
            <div className="font-semibold text-text">Ranked leaderboard</div>
          </a>
        </div>
      </section>

      <p className="mt-16 text-xs text-dim">
        Similarity computed from publicly filed 13F portfolios. 13F filings show long US equity positions only (no shorts, no cash, no non-US positions). Not investment advice.
      </p>
    </div>
  );
}
