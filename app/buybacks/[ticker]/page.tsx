import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import TickerLogo from "@/components/TickerLogo";
import LiveQuote from "@/components/LiveQuote";
import {
  BUYBACK_PROGRAMS,
  getBuyback,
  formatBuybackAmount,
  topBuybackYields,
} from "@/lib/buybacks";
import { getTicker } from "@/lib/tickers";

// /buybacks/[ticker] — per-company deep-dive on a single buyback program.
// Pulls the full detail row + adjacent comparisons (rank in top dollar,
// rank in yield) + a direct link to the underlying SEC filing so every
// claim on the page is one click from verification.

export async function generateStaticParams() {
  return BUYBACK_PROGRAMS.map((p) => ({ ticker: p.ticker }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticker: string }>;
}): Promise<Metadata> {
  const { ticker } = await params;
  const p = getBuyback(ticker);
  if (!p) return { title: "Buyback program not found" };
  const url = `https://holdlens.com/buybacks/${p.ticker}`;
  const title = `${p.ticker} buyback tracker — ${formatBuybackAmount(p.latestFyRepurchased)} repurchased in ${p.latestFyLabel}`;
  const description = `${p.companyName} (${p.ticker}) share-repurchase program. ${formatBuybackAmount(p.latestFyRepurchased)} in ${p.latestFyLabel}${p.authorizationSize ? `, $${(p.authorizationSize / 1e9).toFixed(0)}B board authorization` : ""}${p.buybackYieldPct != null ? `, ${p.buybackYieldPct}% buyback yield` : ""}. SEC-sourced from ${p.source.filingType} filed ${p.source.filingDate}.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${p.ticker} buyback program · HoldLens`,
      description,
      url,
      siteName: "HoldLens",
      type: "article",
      images: [{ url: "/og/home.png", width: 1200, height: 630, alt: `${p.ticker} buyback program` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.ticker} buyback program · HoldLens`,
      description,
      creator: "@holdlens",
      images: ["/og/home.png"],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BuybackTickerPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const p = getBuyback(ticker);
  if (!p) notFound();

  const rankDollar =
    [...BUYBACK_PROGRAMS]
      .sort((a, b) => b.latestFyRepurchased - a.latestFyRepurchased)
      .findIndex((x) => x.ticker === p.ticker) + 1;
  const rankYield =
    topBuybackYields().findIndex((x) => x.ticker === p.ticker) + 1;

  const pageUrl = `https://holdlens.com/buybacks/${p.ticker}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${p.ticker} buyback tracker — ${formatBuybackAmount(p.latestFyRepurchased)} repurchased in ${p.latestFyLabel}`,
    description: `${p.companyName} share-repurchase program details, SEC-sourced.`,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    url: pageUrl,
    author: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com" },
    publisher: {
      "@type": "Organization",
      name: "HoldLens",
      url: "https://holdlens.com",
      logo: { "@type": "ImageObject", url: "https://holdlens.com/logo.png" },
    },
    about: {
      "@type": "Corporation",
      name: p.companyName,
      tickerSymbol: p.ticker,
      industry: p.sector,
    },
    keywords: [p.ticker, p.companyName, "buyback", "share repurchase", "SEC 10-K"].join(", "),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com/" },
      { "@type": "ListItem", position: 2, name: "Buybacks", item: "https://holdlens.com/buybacks" },
      { "@type": "ListItem", position: 3, name: p.ticker, item: pageUrl },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <a href="/buybacks" className="text-xs text-muted hover:text-text">
        ← All buybacks
      </a>

      <div className="mt-3 flex items-start gap-3 flex-wrap">
        <TickerLogo symbol={p.ticker} size={44} />
        <div>
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-1">
            Buyback tracker · {p.latestFyLabel}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            <span className="text-brand">{p.ticker}</span>{" "}
            <span className="text-muted">buyback program</span>
          </h1>
          <p className="text-muted mt-1">
            {p.companyName} · {p.sector}
            {getTicker(p.ticker) && (
              <>
                {" · "}
                <a
                  href={`/ticker/${p.ticker}/`}
                  className="hover:text-brand transition"
                >
                  See full ticker page
                </a>
              </>
            )}
          </p>
        </div>
      </div>

      {/* HoldLens read — extractable quote-ready sentence for LLMs */}
      <aside
        className="mt-6 rounded-card border border-insight/30 bg-surface-insight p-4"
        aria-label={`HoldLens read on ${p.ticker} buyback program`}
      >
        <div className="text-[10px] uppercase tracking-widest text-insight font-bold mb-1.5">
          HoldLens read
        </div>
        <p className="text-sm text-text leading-relaxed">
          <span className="font-semibold">{p.ticker}</span> repurchased{" "}
          <span className="font-bold tabular-nums text-emerald-400">
            {formatBuybackAmount(p.latestFyRepurchased)}
          </span>{" "}
          of its own stock in {p.latestFyLabel} &mdash; #{rankDollar} by dollar
          volume among HoldLens-tracked programs
          {p.buybackYieldPct != null && (
            <>
              , a <span className="font-bold">{p.buybackYieldPct}%</span> buyback
              yield (rank #{rankYield})
            </>
          )}
          .{" "}
          {p.authorizationSize && p.authDate && (
            <>
              The board&rsquo;s active authorization is{" "}
              <span className="font-bold tabular-nums">
                {formatBuybackAmount(p.authorizationSize)}
              </span>{" "}
              (approved {p.authDate})
              {p.authRemainingEstimate != null && (
                <>
                  {" "}
                  with roughly{" "}
                  <span className="font-bold tabular-nums">
                    {formatBuybackAmount(p.authRemainingEstimate)}
                  </span>{" "}
                  estimated remaining
                </>
              )}
              .
            </>
          )}
        </p>
      </aside>

      {/* Key metrics grid */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-panel p-4">
          <div className="text-[10px] uppercase tracking-wider text-dim mb-1">
            {p.latestFyLabel} repurchased
          </div>
          <div className="text-2xl font-bold tabular-nums">
            {formatBuybackAmount(p.latestFyRepurchased)}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-panel p-4">
          <div className="text-[10px] uppercase tracking-wider text-dim mb-1">
            5y average
          </div>
          <div className="text-2xl font-bold tabular-nums">
            {p.trailing5yAverage ? formatBuybackAmount(p.trailing5yAverage) : "—"}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-panel p-4">
          <div className="text-[10px] uppercase tracking-wider text-dim mb-1">
            Authorization
          </div>
          <div className="text-2xl font-bold tabular-nums">
            {p.authorizationSize ? formatBuybackAmount(p.authorizationSize) : "—"}
          </div>
          {p.authDate && (
            <div className="text-[11px] text-dim mt-1">Approved {p.authDate}</div>
          )}
        </div>
        <div className="rounded-xl border border-border bg-panel p-4">
          <div className="text-[10px] uppercase tracking-wider text-dim mb-1">
            Buyback yield
          </div>
          <div className="text-2xl font-bold tabular-nums text-emerald-400">
            {p.buybackYieldPct != null ? `${p.buybackYieldPct}%` : "—"}
          </div>
        </div>
      </div>

      {/* Live quote */}
      <div className="mt-8">
        <LiveQuote symbol={p.ticker} />
      </div>

      <AdSlot format="horizontal" />

      {/* Source */}
      <section className="mt-10 rounded-2xl border border-border bg-panel p-6">
        <h2 className="text-lg font-bold mb-3">Source</h2>
        <p className="text-sm text-muted leading-relaxed mb-3">
          Data from {p.source.filingType} filed{" "}
          <span className="font-semibold text-text">{p.source.filingDate}</span>.
          {p.source.note && <> {p.source.note}</>}
        </p>
        <a
          href={p.source.edgarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand text-sm hover:underline"
        >
          → View filing on SEC EDGAR
        </a>
      </section>

      {/* Methodology reminder + learn cross-link */}
      <section className="mt-6 text-sm text-dim leading-relaxed">
        Buyback authorization ≠ execution. Board authorizations cap the
        maximum dollars that can be repurchased; actual pace varies with price
        and capital allocation decisions. See our{" "}
        <a href="/learn/how-to-read-buyback-disclosures" className="text-brand hover:underline">
          methodology guide
        </a>{" "}
        for a full explainer, or compare against{" "}
        <a href="/learn/buybacks-vs-dividends" className="text-brand hover:underline">
          buybacks vs dividends
        </a>
        .
      </section>
    </div>
  );
}
