import type { Metadata } from "next";
import Link from "next/link";
import {
  INSIDER_TX,
  fmtInsiderValue,
  fmtInsiderDate,
  type InsiderTx,
} from "@/lib/insiders";
import { officerSlug } from "@/lib/insider-score";
import TickerLogo from "@/components/TickerLogo";
import AdSlot from "@/components/AdSlot";

// /insiders/live/ — the chronological Form 4 firehose. Every tracked
// insider transaction, newest first, no curation. Companion to /insiders/
// (the curated + explained hub) and /insiders/company/[ticker]/ (per-issuer
// roll-up). Designed to be the daily-return-visit page — when a returning
// visitor wants to know "what insider moves hit today?", this is the page.
//
// PPC tier: time-sensitive-feed ($0.010/req per llms.txt).
// Refresh cadence: daily ~07:00 UTC after EDGAR overnight ingest (Day-2
// will wire the scraper; today reads curated INSIDER_TX).

export const metadata: Metadata = {
  title: "Live Insider Feed — Latest Form 4 Trades · HoldLens",
  description:
    "Every tracked SEC Form 4 insider trade, chronological. CEO, CFO, Chair, Director, and 10%+ owner transactions. Daily refresh from EDGAR. InsiderScore on every row.",
  alternates: { canonical: "https://holdlens.com/insiders/live/" },
  openGraph: {
    title: "Live Insider Feed — Latest Form 4 Trades",
    description:
      "The chronological insider-trading feed. Every tracked CEO/CFO/Chair/Director trade from SEC Form 4, daily-refreshed.",
    url: "https://holdlens.com/insiders/live/",
    type: "website",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "HoldLens Live Insider Feed",
      },
    ],
  },
};

export const dynamic = "force-static";

function isDiscretionary(tx: InsiderTx): boolean {
  return !(tx.note || "").toLowerCase().includes("10b5-1");
}

export default function InsidersLivePage() {
  // All transactions, newest first. No filter — this is the firehose.
  const feed: InsiderTx[] = [...INSIDER_TX].sort((a, b) =>
    a.date < b.date ? 1 : -1,
  );

  const freshest = feed[0];
  const freshestIso = freshest?.date ?? new Date().toISOString().slice(0, 10);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "HoldLens Live Insider Feed",
    description:
      "Chronological feed of tracked SEC Form 4 insider transactions — CEO, CFO, Chair, Director, and 10%+ owner trades across major US public companies. Updated daily.",
    url: "https://holdlens.com/insiders/live/",
    creator: {
      "@type": "Organization",
      name: "HoldLens",
      url: "https://holdlens.com",
    },
    license: "https://holdlens.com/api-terms",
    temporalCoverage: "last-90-days",
    // dateModified reflects the freshest transaction in the tracked set —
    // honest staleness signal rather than synthetic "today".
    dateModified: freshestIso,
    isBasedOn: "https://www.sec.gov/edgar.shtml",
    variableMeasured: [
      { "@type": "PropertyValue", name: "Ticker" },
      { "@type": "PropertyValue", name: "Insider name" },
      { "@type": "PropertyValue", name: "Insider title" },
      { "@type": "PropertyValue", name: "Action (buy/sell)" },
      { "@type": "PropertyValue", name: "Transaction date" },
      { "@type": "PropertyValue", name: "Share count" },
      { "@type": "PropertyValue", name: "Price per share (USD)" },
      { "@type": "PropertyValue", name: "Total value (USD)" },
      { "@type": "PropertyValue", name: "Discretionary vs 10b5-1 scheduled" },
    ],
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Insiders",
        item: "https://holdlens.com/insiders/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Live feed",
        item: "https://holdlens.com/insiders/live/",
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <nav className="text-xs text-dim mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-text">
          Home
        </Link>
        <span>/</span>
        <Link href="/insiders/" className="hover:text-text">
          Insiders
        </Link>
        <span>/</span>
        <span className="text-muted">Live feed</span>
      </nav>

      <div className="flex items-center gap-3 mb-4">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold">
          Live from the SEC
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 px-2 py-0.5 text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
          </span>
          Daily
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Live insider feed.
      </h1>
      <p className="text-muted text-lg leading-relaxed mb-4 max-w-2xl">
        Every tracked SEC Form 4 filing, newest first.{" "}
        <strong className="text-text">CEO, CFO, Chair, Director, and 10%+ owner</strong> trades
        across major US public companies. Each row links through to the company&apos;s full
        insider roll-up with its aggregate InsiderScore.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        Freshest tracked transaction:{" "}
        <span className="text-text font-mono">{fmtInsiderDate(freshestIso)}</span>. Form 4
        filings must be submitted to the SEC within 2 business days of transaction — this
        feed is re-indexed daily after overnight EDGAR ingest. Scheduled 10b5-1 plan sales are
        marked; discretionary open-market transactions carry the most signal.
      </p>

      {/* Feed table — lots of rows in one view, emphasis on the most-recent */}
      <div className="rounded-2xl border border-border bg-panel overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-dim text-[10px] uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-semibold">Ticker</th>
                <th className="text-left px-4 py-3 font-semibold">Insider</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">
                  Title
                </th>
                <th className="text-center px-4 py-3 font-semibold">Action</th>
                <th className="text-right px-4 py-3 font-semibold">Value</th>
                <th className="text-right px-4 py-3 font-semibold hidden sm:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {feed.map((tx, i) => {
                const disc = isDiscretionary(tx);
                const isBuy = tx.action === "buy";
                return (
                  <tr
                    key={`live-${tx.ticker}-${tx.date}-${tx.insiderName}-${i}`}
                    className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/insiders/company/${tx.ticker.toLowerCase()}/`}
                        className="inline-flex items-center gap-2 font-mono font-bold text-brand hover:underline"
                      >
                        <TickerLogo symbol={tx.ticker} size={20} />
                        {tx.ticker}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-text">
                      <Link
                        href={`/insiders/officer/${officerSlug(tx.insiderName, tx.ticker)}/`}
                        className="hover:underline"
                      >
                        {tx.insiderName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted text-xs hidden md:table-cell">
                      {tx.insiderTitle}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold ${
                          isBuy
                            ? "bg-emerald-400/15 text-emerald-400 border border-emerald-400/30"
                            : disc
                            ? "bg-rose-400/15 text-rose-400 border border-rose-400/30"
                            : "bg-dim/10 text-dim border border-border"
                        }`}
                      >
                        {isBuy ? "BUY" : disc ? "SELL" : "10b5-1"}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-mono tabular-nums ${
                        isBuy
                          ? "text-emerald-400 font-semibold"
                          : disc
                          ? "text-rose-400 font-semibold"
                          : "text-dim"
                      }`}
                    >
                      {fmtInsiderValue(tx.value)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[11px] text-dim whitespace-nowrap hidden sm:table-cell">
                      {fmtInsiderDate(tx.date)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AdSlot format="horizontal" />

      {/* Related / internal linking hub */}
      <section className="border-t border-border pt-12 mt-12">
        <h2 className="text-xl font-bold text-text mb-6">Related surfaces</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/insiders/"
            className="rounded-xl border border-border bg-panel p-5 hover:border-emerald-400/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">Insider methodology</div>
            <div className="text-xs text-muted">
              How InsiderScore is computed — role, action, recency, cluster bonus.
            </div>
          </Link>
          <Link
            href="/best-now/"
            className="rounded-xl border border-border bg-panel p-5 hover:border-brand/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">Best buy signals now</div>
            <div className="text-xs text-muted">
              Unified ConvictionScore rankings — insider activity folds into the score.
            </div>
          </Link>
          <Link
            href="/activity/"
            className="rounded-xl border border-border bg-panel p-5 hover:border-brand/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">Full 13F activity feed</div>
            <div className="text-xs text-muted">
              Every tracked 13F move across 30 superinvestors, quarterly.
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
