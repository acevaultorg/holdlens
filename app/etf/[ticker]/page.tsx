import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import TickerLogo from "@/components/TickerLogo";
import TickerLink from "@/components/TickerLink";
import ShareStrip from "@/components/ShareStrip";
import { ETFS, getEtf, formatAum } from "@/lib/etfs";

export async function generateStaticParams() {
  return ETFS.map((e) => ({ ticker: e.ticker }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticker: string }>;
}): Promise<Metadata> {
  const { ticker } = await params;
  const e = getEtf(ticker);
  if (!e) return { title: "ETF not tracked" };
  const top = e.topHoldings.slice(0, 5).map((h) => h.ticker).join(", ");
  return {
    title: `${e.ticker} holdings — ${e.name} top positions (${top})`,
    description: `${e.name} top-10 holdings: ${top}. AUM ${formatAum(e.aumUsd)}, expense ratio ${e.expenseRatioPct}%. Sourced from ${e.issuer}'s official disclosure ${e.asOfDate}.`,
    alternates: { canonical: `https://holdlens.com/etf/${e.ticker}` },
    openGraph: {
      title: `${e.ticker} holdings · ${e.name}`,
      description: `Top-10 holdings with weights. ${formatAum(e.aumUsd)} AUM.`,
      url: `https://holdlens.com/etf/${e.ticker}`,
      type: "article",
    },
    robots: { index: true, follow: true },
  };
}

export default async function EtfDetailPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const e = getEtf(ticker);
  if (!e) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${e.name} (${e.ticker}) top holdings`,
    datePublished: e.asOfDate,
    dateModified: e.asOfDate,
    author: { "@type": "Organization", name: "HoldLens" },
    publisher: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com" },
    mainEntityOfPage: `https://holdlens.com/etf/${e.ticker}`,
    description: `Top-10 holdings for ${e.name}, verified against ${e.issuer} official disclosure.`,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "ETFs", item: "https://holdlens.com/etf" },
      { "@type": "ListItem", position: 3, name: e.ticker, item: `https://holdlens.com/etf/${e.ticker}` },
    ],
  };

  const top3Sum = e.topHoldings.slice(0, 3).reduce((s, h) => s + h.weightPct, 0);
  const topHoldingsList = e.topHoldings.slice(0, 5).map((h) => h.ticker).join(", ");

  // FAQPage JSON-LD + Speakable per rules/seo-geo-mastery.md Part 14.
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://holdlens.com/etf/${e.ticker}/#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: `What are the top holdings of ${e.ticker}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Top 5 holdings of ${e.name} (${e.ticker}): ${topHoldingsList}. Top-3 concentration: ${top3Sum.toFixed(1)}% of the fund. Full top-${e.topHoldings.length} list below with individual weights. Source: ${e.issuer} official disclosure as of ${e.asOfDate}.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the AUM of ${e.ticker}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${e.name} (${e.ticker}) has ${formatAum(e.aumUsd)} in assets under management with a ${e.expenseRatioPct.toFixed(2)}% expense ratio. Category: ${e.category}${e.sector ? ` (${e.sector} sector)` : ""}. Issuer: ${e.issuer}.`,
        },
      },
      {
        "@type": "Question",
        name: `How concentrated is ${e.ticker}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Top-3 holdings account for ${top3Sum.toFixed(1)}% of ${e.ticker}. The full top-${e.topHoldings.length} list spans the rest of the publicly disclosed portfolio. ${top3Sum > 30 ? "Above 30% top-3 = concentrated fund — single-position risk is meaningful." : top3Sum > 15 ? "15-30% top-3 = moderately concentrated." : "Below 15% top-3 = broadly diversified."}`,
        },
      },
      {
        "@type": "Question",
        name: `Where does HoldLens get ${e.ticker} data?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Holdings sourced from ${e.issuer}'s official ETF disclosure (refreshed daily by the issuer). HoldLens verified ${e.asOfDate}. ETF disclosure lag varies by issuer but is typically 1-3 business days. See /methodology for full source list.`,
        },
      },
    ],
  };
  const speakableLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `https://holdlens.com/etf/${e.ticker}/#speakable`,
    speakable: { "@type": "SpeakableSpecification", cssSelector: [".hl-etf-intro"] },
  };

  return (
    <div className="max-w-3xl mx-auto px-8 sm:px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableLd) }} />

      <a href="/etf" className="text-xs text-muted hover:text-text">
        ← All ETFs
      </a>

      <div className="mt-6 mb-3 text-xs uppercase tracking-widest text-brand font-semibold">
        {e.category}
        {e.sector ? ` · ${e.sector}` : ""} · {e.issuer}
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3 flex items-center gap-3 flex-wrap">
        <TickerLogo symbol={e.ticker} size={40} />
        <span className="text-brand">{e.ticker}</span>
      </h1>
      <p className="hl-etf-intro text-muted text-lg mb-8">{e.name}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <Stat label="AUM" value={formatAum(e.aumUsd)} />
        <Stat label="Expense" value={`${e.expenseRatioPct.toFixed(2)}%`} />
        <Stat label="Top holdings" value={`${e.topHoldings.length}`} />
        <Stat label="Top-3 concentration" value={`${top3Sum.toFixed(0)}%`} />
      </div>

      <ShareStrip
        title={`${e.ticker} (${e.name}) — top ${e.topHoldings.length} holdings + ${top3Sum.toFixed(0)}% top-3 concentration`}
        url={`https://holdlens.com/etf/${e.ticker}/`}
      />

      {/* Visible-text freshness — pairs with Article schema datePublished
          + dateModified above. Aleyda Solis C9. */}
      {e.asOfDate && (
        <div className="mt-4 text-xs text-dim">
          Data verified {e.asOfDate} · sourced from {e.issuer} official disclosure
        </div>
      )}

      <aside
        className="mb-10 rounded-card border border-insight/30 bg-surface-insight p-5"
        aria-label="HoldLens read"
      >
        <div className="text-[10px] uppercase tracking-widest text-insight font-bold mb-2">
          HoldLens read
        </div>
        <p className="text-sm text-text leading-relaxed">
          {e.name} ({e.ticker}) holds roughly{" "}
          <span className="font-bold tabular-nums">{formatAum(e.aumUsd)}</span>{" "}
          in assets with a{" "}
          <span className="font-bold tabular-nums">{e.expenseRatioPct}%</span>{" "}
          expense ratio. Top-3 positions sum to{" "}
          <span className="font-bold tabular-nums">{top3Sum.toFixed(0)}%</span>{" "}
          of the fund.{" "}
          {top3Sum > 30
            ? "Concentration is high — single-stock volatility drives substantial fund-level P&L."
            : "Distribution is relatively balanced — single-stock moves have limited fund-level impact."}
        </p>
      </aside>

      <AdSlot format="horizontal" />

      {/* Top holdings */}
      <section className="mt-12 mb-12">
        <h2 className="text-xl font-bold mb-3">
          {e.ticker} ({e.name}) top {e.topHoldings.length} disclosed holdings
        </h2>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Ticker</th>
                <th className="px-4 py-3 text-right">% Fund</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">
                  Position value
                </th>
              </tr>
            </thead>
            <tbody>
              {e.topHoldings.map((h, i) => (
                <tr
                  key={h.ticker}
                  className="border-b border-border last:border-0 hover:bg-bg/30 transition"
                >
                  <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                  <td className="px-4 py-3">
                    <TickerLink
                      symbol={h.ticker}
                      className="inline-flex items-center gap-2 font-mono font-bold text-brand hover:underline"
                    >
                      <TickerLogo symbol={h.ticker} size={20} />
                      {h.ticker}
                    </TickerLink>
                    <div className="text-[11px] text-dim">{h.name}</div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold">
                    {h.weightPct.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums hidden sm:table-cell text-xs text-muted">
                    {formatAum((e.aumUsd * h.weightPct) / 100)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-dim mt-3">
          As of {e.asOfDate}. Weights drift daily with price moves.
        </p>
      </section>

      {/* Source */}
      <section className="mt-10 mb-12">
        <h2 className="text-xl font-bold mb-3">Source disclosure</h2>
        <a
          href={e.source.issuerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl border border-border bg-panel p-5 hover:border-brand/40 transition"
        >
          <div className="text-[10px] uppercase tracking-wider text-dim mb-1">
            {e.issuer} · holdings disclosure
          </div>
          <div className="text-sm font-semibold text-brand mb-1 break-all">
            {e.source.issuerUrl} ↗
          </div>
          {e.source.note && (
            <div className="text-xs text-muted mt-2">{e.source.note}</div>
          )}
        </a>
      </section>

      {/* AEO FAQ — Frequently asked questions (mirrors faqLd JSON-LD). */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Frequently asked questions</h2>
        <div className="space-y-3">
          {(faqLd.mainEntity as Array<{ name: string; acceptedAnswer: { text: string } }>).map((q, i) => (
            <details key={i} className="rounded-xl border border-border bg-panel p-4">
              <summary className="cursor-pointer font-semibold text-text">{q.name}</summary>
              <p className="hl-faq-answer mt-3 text-sm text-muted leading-relaxed">{q.acceptedAnswer.text}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="text-xs text-dim mt-16">
        Holdings data from {e.issuer}&rsquo;s official ETF holdings-disclosure
        page as of {e.asOfDate}. ETFs publish full holdings daily; weights
        shown are snapshot. Not investment advice.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-panel px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-dim">{label}</div>
      <div className="text-base font-semibold mt-1 tabular-nums">{value}</div>
    </div>
  );
}
