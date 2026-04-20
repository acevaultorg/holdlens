import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import TickerLogo from "@/components/TickerLogo";
import {
  topBuybacks,
  topBuybackYields,
  recentAuthorizations,
  buybacksBySector,
  formatBuybackAmount,
  BUYBACK_PROGRAMS,
} from "@/lib/buybacks";

// /buybacks/ — landing for the Corporate Buyback Tracker sub-vertical.
// The one question a retail investor asks: "which companies are repurchasing
// their own stock most aggressively?" This page answers it three ways —
// largest dollar volume, highest yield (buyback $ / market cap), and newest
// authorizations (forward-looking supply of buying power).

export const metadata: Metadata = {
  title:
    "Corporate Buyback Tracker — biggest share-repurchase programs in the S&P 500",
  description:
    "Every major public-company buyback program tracked from SEC 10-K + 8-K filings: total dollar volume, buyback yield, authorization size, remaining capacity. Apple, Alphabet, Meta, NVIDIA, JPMorgan, and more. SEC-sourced, updated quarterly.",
  alternates: { canonical: "https://holdlens.com/buybacks" },
  openGraph: {
    title: "HoldLens Buyback Tracker — biggest S&P buyback programs",
    description:
      "SEC-sourced corporate buyback tracking. Dollar volume, buyback yield, authorization size across top public companies.",
    url: "https://holdlens.com/buybacks",
    type: "article",
    images: [
      { url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" },
    ],
  },
  robots: { index: true, follow: true },
};

export default function BuybacksLanding() {
  const top10 = topBuybacks(10);
  const topYield = topBuybackYields(5);
  const recent = recentAuthorizations(5);
  const bySector = buybacksBySector();
  const totalProgramsTracked = BUYBACK_PROGRAMS.length;
  const totalFy24Dollars = BUYBACK_PROGRAMS.reduce(
    (acc, p) => acc + p.latestFyRepurchased,
    0,
  );

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Corporate Buyback Tracker",
    description:
      "SEC-sourced corporate share-repurchase programs for major public companies. Dollar volume, yield, authorization size.",
    url: "https://holdlens.com/buybacks",
    numberOfItems: totalProgramsTracked,
    isPartOf: {
      "@type": "WebSite",
      name: "HoldLens",
      url: "https://holdlens.com",
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Buybacks", item: "https://holdlens.com/buybacks" },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Hero */}
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Corporate Buybacks · SEC-sourced
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Every major buyback, in one place.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-8">
        Share-repurchase programs across the S&amp;P 500, pulled from each
        company&rsquo;s 10-K cash-flow statement and 8-K authorization
        announcements. Dollar volume, buyback yield, remaining authorization.
        No sales pitches, no CNBC hype cycles &mdash; just the SEC disclosure.
      </p>

      <aside
        className="mt-2 mb-12 rounded-card border border-insight/30 bg-surface-insight p-4"
        aria-label="HoldLens read on buybacks"
      >
        <div className="text-[10px] uppercase tracking-widest text-insight font-bold mb-1.5">
          HoldLens read
        </div>
        <p className="text-sm text-text leading-relaxed">
          The {totalProgramsTracked} tracked companies repurchased{" "}
          <span className="font-bold tabular-nums">
            {formatBuybackAmount(totalFy24Dollars)}
          </span>{" "}
          of their own stock in the latest fiscal year. Apple leads with{" "}
          <span className="font-bold tabular-nums">
            {formatBuybackAmount(top10[0].latestFyRepurchased)}
          </span>
          ; JPMorgan&rsquo;s buyback yield is highest at{" "}
          <span className="font-bold tabular-nums">
            {topYield[0].buybackYieldPct}%
          </span>{" "}
          of market cap.
        </p>
      </aside>

      {/* Top dollar volume */}
      <section className="mb-14">
        <div className="flex items-end justify-between mb-5 flex-wrap gap-2">
          <div>
            <div className="text-[11px] uppercase tracking-widest font-bold text-brand mb-1">
              Biggest dollar volume
            </div>
            <h2 className="text-2xl font-bold">Top repurchasers, latest fiscal year</h2>
          </div>
          <a href="/buybacks/yield" className="text-sm text-brand hover:underline">
            See by yield →
          </a>
        </div>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Ticker</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Sector</th>
                <th className="px-4 py-3 text-right">Repurchased</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Yield</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Auth remaining</th>
              </tr>
            </thead>
            <tbody>
              {top10.map((p, i) => (
                <tr
                  key={p.ticker}
                  className="border-b border-border last:border-0 hover:bg-bg/30 transition"
                >
                  <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`/buybacks/${p.ticker}/`}
                      className="inline-flex items-center gap-2 font-mono font-bold text-brand hover:underline"
                    >
                      <TickerLogo symbol={p.ticker} size={20} />
                      {p.ticker}
                    </a>
                    <div className="text-[11px] text-dim">{p.companyName}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted hidden md:table-cell">
                    {p.sector}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold">
                    {formatBuybackAmount(p.latestFyRepurchased)}
                    <div className="text-[10px] text-dim font-normal">{p.latestFyLabel}</div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums hidden sm:table-cell">
                    {p.buybackYieldPct != null ? `${p.buybackYieldPct}%` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums hidden md:table-cell">
                    {p.authRemainingEstimate
                      ? formatBuybackAmount(p.authRemainingEstimate)
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AdSlot format="horizontal" />

      {/* Recent authorizations — forward-looking */}
      <section className="my-14">
        <div className="flex items-end justify-between mb-5 flex-wrap gap-2">
          <div>
            <div className="text-[11px] uppercase tracking-widest font-bold text-emerald-400 mb-1">
              Forward-looking supply
            </div>
            <h2 className="text-2xl font-bold">Newly announced authorizations</h2>
          </div>
          <a href="/buybacks/largest-authorizations" className="text-sm text-brand hover:underline">
            All authorizations →
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recent.map((p) => (
            <a
              key={p.ticker}
              href={`/buybacks/${p.ticker}/`}
              className="block rounded-2xl border border-border bg-panel p-5 hover:border-brand/40 transition"
            >
              <div className="flex items-center gap-2 mb-3">
                <TickerLogo symbol={p.ticker} size={24} />
                <div className="font-mono font-bold text-brand">{p.ticker}</div>
              </div>
              <div className="text-[11px] uppercase tracking-wider text-dim mb-1">
                Authorization
              </div>
              <div className="text-2xl font-bold tabular-nums mb-1">
                {p.authorizationSize ? formatBuybackAmount(p.authorizationSize) : "—"}
              </div>
              <div className="text-xs text-muted">Announced {p.authDate}</div>
            </a>
          ))}
        </div>
      </section>

      {/* By sector */}
      <section className="my-14">
        <div className="mb-5">
          <div className="text-[11px] uppercase tracking-widest font-bold text-brand mb-1">
            Sector rollup
          </div>
          <h2 className="text-2xl font-bold">Buybacks by sector</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(bySector)
            .sort((a, b) => {
              const sumA = a[1].reduce((acc, p) => acc + p.latestFyRepurchased, 0);
              const sumB = b[1].reduce((acc, p) => acc + p.latestFyRepurchased, 0);
              return sumB - sumA;
            })
            .map(([sector, programs]) => {
              const total = programs.reduce((acc, p) => acc + p.latestFyRepurchased, 0);
              return (
                <div
                  key={sector}
                  className="rounded-2xl border border-border bg-panel p-5"
                >
                  <div className="text-sm font-bold text-text mb-2">{sector}</div>
                  <div className="text-[11px] uppercase tracking-wider text-dim mb-1">
                    FY repurchased, {programs.length} companies
                  </div>
                  <div className="text-xl font-bold tabular-nums text-brand mb-3">
                    {formatBuybackAmount(total)}
                  </div>
                  <div className="text-xs text-muted truncate">
                    {programs.map((p) => p.ticker).join(" · ")}
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* Methodology + learn */}
      <section className="mt-16 rounded-2xl border border-border bg-panel p-6">
        <h2 className="text-lg font-bold mb-3">How to read this data</h2>
        <p className="text-sm text-muted leading-relaxed mb-3">
          Dollar-volume and yield figures come from each company&rsquo;s 10-K
          cash-flow-from-financing statement (line: &ldquo;repurchases of common stock&rdquo;).
          Authorizations are board-approved limits announced via 8-K filings — they cap
          how much can be repurchased before renewal, not what will be.
          Authorization size doesn&rsquo;t predict execution.
        </p>
        <p className="text-sm text-muted leading-relaxed mb-4">
          Every row on this page links to the underlying SEC filing.
        </p>
        <div className="flex gap-3 flex-wrap text-sm">
          <a href="/learn/buybacks-vs-dividends" className="text-brand hover:underline">
            → Buybacks vs dividends
          </a>
          <a href="/learn/how-to-read-buyback-disclosures" className="text-brand hover:underline">
            → How to read buyback disclosures
          </a>
        </div>
      </section>
    </div>
  );
}
