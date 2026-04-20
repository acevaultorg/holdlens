import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import TickerLogo from "@/components/TickerLogo";
import TickerLink from "@/components/TickerLink";
import {
  ETFS,
  topEtfsByAum,
  etfsByCategory,
  formatAum,
} from "@/lib/etfs";

export const metadata: Metadata = {
  title: "ETF Holdings Tracker — which ETFs hold which stocks",
  description:
    "Daily-disclosed top holdings for 12 major US ETFs: VOO, VTI, SPY, QQQ, IWM, SCHD, VYM, XLK, XLF, XLE, ARKK, JEPI. By AUM, category, and holdings overlap. Sourced from each issuer's official disclosures.",
  alternates: { canonical: "https://holdlens.com/etf" },
  openGraph: {
    title: "HoldLens ETF Tracker — holdings + overlap",
    description:
      "Top holdings for 12 major US ETFs. Sourced from issuer disclosures.",
    url: "https://holdlens.com/etf",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens" }],
  },
  robots: { index: true, follow: true },
};

export default function EtfLanding() {
  const byAum = topEtfsByAum();
  const byCat = etfsByCategory();
  const totalAum = ETFS.reduce((s, e) => s + e.aumUsd, 0);

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "ETF Holdings Tracker",
    description: "Top holdings for 12 major US ETFs with daily-disclosed positions.",
    url: "https://holdlens.com/etf",
    numberOfItems: ETFS.length,
    isPartOf: { "@type": "WebSite", name: "HoldLens", url: "https://holdlens.com" },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "ETFs", item: "https://holdlens.com/etf" },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        ETF Holdings · Daily-disclosed
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Which ETFs hold which stocks.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-8">
        12 largest US-listed ETFs with their top-10 holdings verified against
        each issuer&rsquo;s official disclosure. Sortable by AUM + category +
        which ETFs hold a given ticker. No derived estimates.
      </p>

      <aside
        className="mt-2 mb-12 rounded-card border border-insight/30 bg-surface-insight p-4"
        aria-label="HoldLens read on ETF coverage"
      >
        <div className="text-[10px] uppercase tracking-widest text-insight font-bold mb-1.5">
          HoldLens read
        </div>
        <p className="text-sm text-text leading-relaxed">
          {ETFS.length} tracked ETFs totaling{" "}
          <span className="font-bold tabular-nums">{formatAum(totalAum)}</span>{" "}
          in assets under management. Largest on the list:{" "}
          <span className="font-bold">{byAum[0].ticker}</span> at{" "}
          <span className="font-bold tabular-nums">{formatAum(byAum[0].aumUsd)}</span>.
          Most concentrated: <span className="font-bold">XLK</span> (top-3 holdings
          sum to ~43% of fund — Apple + Microsoft + NVIDIA).
        </p>
      </aside>

      {/* By AUM */}
      <section className="mb-14">
        <div className="mb-5">
          <div className="text-[11px] uppercase tracking-widest font-bold text-brand mb-1">
            By size
          </div>
          <h2 className="text-2xl font-bold">Top ETFs by AUM</h2>
        </div>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Ticker</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-right">AUM</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Expense</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Top holding</th>
              </tr>
            </thead>
            <tbody>
              {byAum.map((e, i) => (
                <tr
                  key={e.ticker}
                  className="border-b border-border last:border-0 hover:bg-bg/30 transition"
                >
                  <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`/etf/${e.ticker}/`}
                      className="inline-flex items-center gap-2 font-mono font-bold text-brand hover:underline"
                    >
                      <TickerLogo symbol={e.ticker} size={20} />
                      {e.ticker}
                    </a>
                    <div className="text-[11px] text-dim">{e.name}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted hidden md:table-cell">
                    {e.category}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold">
                    {formatAum(e.aumUsd)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums hidden sm:table-cell text-xs text-muted">
                    {e.expenseRatioPct.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-xs hidden md:table-cell">
                    <span className="font-mono font-semibold text-text">
                      {e.topHoldings[0].ticker}
                    </span>{" "}
                    <span className="text-dim">
                      {e.topHoldings[0].weightPct.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AdSlot format="horizontal" />

      {/* By category */}
      <section className="my-14">
        <div className="mb-5">
          <div className="text-[11px] uppercase tracking-widest font-bold text-brand mb-1">
            By category
          </div>
          <h2 className="text-2xl font-bold">Coverage by strategy</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(byCat).map(([cat, etfs]) => (
            <div key={cat} className="rounded-2xl border border-border bg-panel p-5">
              <div className="text-sm font-bold text-text mb-2">{cat}</div>
              <div className="text-[11px] text-dim mb-3">
                {etfs.length} ETF{etfs.length === 1 ? "" : "s"}
              </div>
              <div className="space-y-2">
                {etfs.map((e) => (
                  <a
                    key={e.ticker}
                    href={`/etf/${e.ticker}/`}
                    className="flex items-center justify-between gap-2 text-sm hover:text-brand transition"
                  >
                    <span className="font-mono font-semibold">{e.ticker}</span>
                    <span className="text-xs text-dim tabular-nums">
                      {formatAum(e.aumUsd)}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Most-held stocks across all tracked ETFs */}
      <section className="my-14">
        <div className="mb-5">
          <div className="text-[11px] uppercase tracking-widest font-bold text-emerald-400 mb-1">
            ETF consensus
          </div>
          <h2 className="text-2xl font-bold">Most-held stocks across all ETFs</h2>
          <p className="text-muted text-sm mt-2">
            Stocks appearing in the most tracked ETFs&rsquo; top-10 holdings.
          </p>
        </div>
        <MostHeldGrid />
      </section>

      <section className="mt-16 rounded-2xl border border-border bg-panel p-6">
        <h2 className="text-lg font-bold mb-3">How to read this data</h2>
        <p className="text-sm text-muted leading-relaxed mb-3">
          Every ETF on this page cites its issuer&rsquo;s official
          holdings-disclosure page. ETFs disclose their full holdings daily
          (unlike mutual funds, which are quarterly via SEC N-PORT). Weights
          shown are percentage of ETF total net assets; they drift daily with
          price moves.
        </p>
        <p className="text-sm text-muted leading-relaxed mb-4">
          Cross-linking: every ticker page on HoldLens shows which tracked
          ETFs hold it (where applicable). ConvictionScore for a ticker
          weights institutional 13F + ETF consensus to de-duplicate
          passive-index flows from active-manager conviction.
        </p>
        <div className="flex gap-3 flex-wrap text-sm">
          <a href="/learn/etf-overlap-explained" className="text-brand hover:underline">
            → How ETF overlap works
          </a>
          <a href="/investor" className="text-brand hover:underline">
            → Active manager portfolios (13F)
          </a>
        </div>
      </section>
    </div>
  );
}

function MostHeldGrid() {
  // Compute most-held across all tracked ETFs' top-10 holdings.
  const counts = new Map<string, { count: number; name: string; totalWeight: number }>();
  for (const e of ETFS) {
    for (const h of e.topHoldings) {
      const prev = counts.get(h.ticker) ?? { count: 0, name: h.name, totalWeight: 0 };
      counts.set(h.ticker, {
        count: prev.count + 1,
        name: h.name,
        totalWeight: prev.totalWeight + h.weightPct,
      });
    }
  }
  const top = [...counts.entries()]
    .map(([ticker, v]) => ({ ticker, ...v }))
    .sort((a, b) => b.count - a.count || b.totalWeight - a.totalWeight)
    .slice(0, 12);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {top.map((s) => (
        <TickerLink
          key={s.ticker}
          symbol={s.ticker}
          className="block rounded-2xl border border-border bg-panel p-4 hover:border-brand/40 transition"
        >
          <div className="flex items-center gap-2 mb-2">
            <TickerLogo symbol={s.ticker} size={22} />
            <div className="font-mono font-bold text-brand">{s.ticker}</div>
          </div>
          <div className="text-[11px] text-dim mb-2 truncate">{s.name}</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">
              In <span className="font-bold text-text">{s.count}</span> ETFs
            </span>
            <span className="text-brand tabular-nums">
              Σ{s.totalWeight.toFixed(1)}%
            </span>
          </div>
        </TickerLink>
      ))}
    </div>
  );
}
