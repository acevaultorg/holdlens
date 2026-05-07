import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MANAGERS } from "@/lib/managers";
import { topReplicatingETFs } from "@/lib/etf-overlap";
import { LATEST_FILINGS } from "@/lib/filings";
import ShareStrip from "@/components/ShareStrip";

type ManagerParams = { manager: string };

export async function generateStaticParams(): Promise<ManagerParams[]> {
  return MANAGERS.map((m) => ({ manager: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ManagerParams>;
}): Promise<Metadata> {
  const { manager } = await params;
  const m = MANAGERS.find((x) => x.slug === manager);
  if (!m) return { title: "Manager not found" };

  const top = topReplicatingETFs(m, 1);
  const topETF = top[0];
  const titleAnswer = topETF
    ? `${topETF.etf.ticker} (${topETF.etf.name})`
    : `none of the 12 tracked ETFs has a top-10 overlap`;

  const title = `Which ETF replicates ${m.name}'s portfolio? — closest match: ${topETF?.etf.ticker ?? "none"}`;
  const description = `Portfolio-overlap analysis for ${m.name} (${m.fund}) against 12 major US ETFs. Closest top-10 match: ${titleAnswer}. Free analysis with cited holdings.`;
  const canonical = `https://holdlens.com/etf-by-superinvestor/${m.slug}/`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      images: [{ url: "/og/home.png", width: 1200, height: 630, alt: `${m.name} ETF replication` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: ["/og/home.png"],
    },
  };
}

export default async function ManagerETFPage({
  params,
}: {
  params: Promise<ManagerParams>;
}) {
  const { manager } = await params;
  const m = MANAGERS.find((x) => x.slug === manager);
  if (!m) notFound();

  const overlaps = topReplicatingETFs(m, 5);
  const topMatch = overlaps[0];
  const otherManagers = MANAGERS.filter((x) => x.slug !== m.slug).slice(0, 6);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
      { "@type": "ListItem", position: 2, name: "ETF by superinvestor", item: "https://holdlens.com/etf-by-superinvestor/" },
      { "@type": "ListItem", position: 3, name: m.name, item: `https://holdlens.com/etf-by-superinvestor/${m.slug}/` },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Which ETF replicates ${m.name}'s portfolio?`,
    description: topMatch
      ? `Closest top-10 overlap: ${topMatch.etf.ticker} (${topMatch.etf.name}) with overlap score ${topMatch.score.toFixed(1)}.`
      : `No tracked ETF has top-10 overlap with ${m.name}'s holdings.`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://holdlens.com/etf-by-superinvestor/${m.slug}/`,
    },
    datePublished: "2026-04-28",
    dateModified: "2026-04-28",
    publisher: { "@id": "https://holdlens.com/#organization" },
  };

  return (
    <div className="max-w-4xl mx-auto px-8 sm:px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />

      <nav className="text-xs text-muted">
        <Link href="/etf-by-superinvestor/" className="hover:text-text">ETF by superinvestor</Link>
        <span className="mx-2">→</span>
        <span className="text-text">{m.name}</span>
      </nav>

      <header className="mt-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
          ETF replication · {m.name}
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Which ETF replicates {m.name}&apos;s portfolio?
        </h1>
        {topMatch ? (
          <p className="text-muted text-lg mt-4 leading-relaxed">
            <strong className="text-text">{topMatch.etf.ticker}</strong> ({topMatch.etf.name}) has the highest top-10 overlap with {m.name}&apos;s {m.fund} portfolio — overlap score{" "}
            <strong className="text-text font-mono tabular-nums">{topMatch.score.toFixed(1)}</strong>{" "}
            across {topMatch.sharedTickers.length} shared holdings. Below: full ranked list of 5 closest ETFs and per-ticker contribution breakdown.
          </p>
        ) : (
          <p className="text-muted text-lg mt-4 leading-relaxed">
            None of the 12 tracked ETFs has top-10 overlap with {m.name}&apos;s portfolio. {m.name} runs concentrated positions outside the most-AUM index ETF universe — common for activist or contrarian managers whose conviction picks aren&apos;t in S&P-500-tracking funds.
          </p>
        )}
      </header>

      <ShareStrip
        title={
          topMatch
            ? `Closest ETF to ${m.name}'s portfolio: ${topMatch.etf.ticker} — overlap ${topMatch.score.toFixed(1)} on ${topMatch.sharedTickers.length} shared top-10 names`
            : `${m.name}'s portfolio doesn't overlap any of the 12 tracked US ETFs`
        }
        url={`https://holdlens.com/etf-by-superinvestor/${m.slug}/`}
      />

      {/* Visible-text freshness signal — schema dateModified above is opaque
          to LLMs without a paired plain-text date. Shows manager's latest
          13F filing date (the upstream input that the overlap analysis
          depends on). Aleyda Solis C9 (Fresh). */}
      {(() => {
        const filing = LATEST_FILINGS[m.slug];
        if (!filing?.latestDate) return null;
        return (
          <div className="mt-4 text-xs text-dim">
            Data verified {filing.latestDate} · based on {m.name}&apos;s {filing.quarter} 13F
            filing
            {filing.edgarUrl && (
              <>
                {" · "}
                <a
                  href={filing.edgarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-text underline"
                >
                  view on SEC EDGAR
                </a>
              </>
            )}
          </div>
        );
      })()}

      {topMatch && (
        <section className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-5 py-5">
              <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-2">
                Closest ETF
              </div>
              <div className="text-2xl font-bold text-text font-mono">{topMatch.etf.ticker}</div>
              <div className="text-xs text-dim mt-1">{topMatch.etf.name}</div>
            </div>
            <div className="rounded-xl border border-border bg-panel px-5 py-5">
              <div className="text-[10px] uppercase tracking-widest text-brand font-bold mb-2">
                Overlap score
              </div>
              <div className="text-2xl font-bold text-text tabular-nums">{topMatch.score.toFixed(1)}</div>
              <div className="text-xs text-dim mt-1">{topMatch.sharedTickers.length} shared top-10 names</div>
            </div>
            <div className="rounded-xl border border-border bg-panel px-5 py-5">
              <div className="text-[10px] uppercase tracking-widest text-muted font-bold mb-2">
                ETF expense ratio
              </div>
              <div className="text-2xl font-bold text-text tabular-nums">
                {topMatch.etf.expenseRatioPct.toFixed(2)}%
              </div>
              <div className="text-xs text-dim mt-1">annual fee</div>
            </div>
          </div>
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Top 5 ETFs ranked by overlap</h2>
        {overlaps.length === 0 ? (
          <div className="rounded-xl border border-border bg-panel p-5 text-sm text-muted leading-relaxed">
            No ETFs have any top-10 overlap with {m.name}&apos;s holdings. Closest matches would require expanding to mid-AUM ETFs (Day-2 expansion of HoldLens ETF coverage).
          </div>
        ) : (
          <div className="space-y-3">
            {overlaps.map((r, i) => (
              <div key={r.etf.ticker} className="rounded-xl border border-border bg-panel p-5">
                <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <span className="text-xs text-dim mr-2">#{i + 1}</span>
                    <Link
                      href={`/etf/${r.etf.ticker}/`}
                      className="text-xl font-bold font-mono text-text hover:text-brand"
                    >
                      {r.etf.ticker}
                    </Link>
                    <span className="text-sm text-muted ml-2">{r.etf.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                      Overlap score
                    </div>
                    <div className="font-mono text-lg font-bold text-emerald-400 tabular-nums">
                      {r.score.toFixed(1)}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted mb-2">
                  Shared top-10 holdings ({r.sharedTickers.length}):
                </div>
                <div className="flex flex-wrap gap-2">
                  {r.sharedTickers.map((t) => (
                    <span
                      key={t.ticker}
                      className="rounded border border-border bg-bg px-2 py-1 text-xs font-mono"
                      title={`${m.name}: ${t.managerPct}% · ${r.etf.ticker}: ${t.etfWeightPct}%`}
                    >
                      {t.ticker}{" "}
                      <span className="text-dim">
                        {t.managerPct}% × {t.etfWeightPct}%
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">{m.name}&apos;s investment philosophy</h2>
        <div className="rounded-xl border border-border bg-panel p-5 text-sm text-muted leading-relaxed">
          {m.philosophy}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">Other superinvestor ETF replications</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {otherManagers.map((other) => (
            <li key={other.slug}>
              <Link
                href={`/etf-by-superinvestor/${other.slug}/`}
                className="block rounded-xl border border-border bg-panel p-4 hover:border-brand transition"
              >
                <div className="font-semibold text-text">{other.name}</div>
                <div className="text-xs text-muted mt-1">{other.fund}</div>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/etf-by-superinvestor/"
          className="inline-block mt-4 text-sm text-brand hover:underline"
        >
          See all 30 superinvestor ETF replications →
        </Link>
      </section>

      <footer className="mt-16 pt-8 border-t border-border text-xs text-dim">
        <p>
          Top-10 vs top-10 overlap analysis. Manager 13F holdings are quarterly + lagged ~45 days; ETF holdings are daily-disclosed. Score is a snapshot heuristic, not investment advice. Investing in any ETF carries fees + risks; consult a qualified advisor.
        </p>
      </footer>
    </div>
  );
}
