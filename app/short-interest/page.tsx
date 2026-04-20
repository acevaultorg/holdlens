import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import TickerLogo from "@/components/TickerLogo";
import {
  SHORT_POSITIONS,
  topByPctFloat,
  topByDaysToCover,
  biggestBuilds,
  biggestUnwinds,
  formatShares,
  formatPct,
} from "@/lib/short-interest";

export const metadata: Metadata = {
  title: "Short Interest Tracker — most-shorted U.S. stocks (FINRA-sourced)",
  description:
    "Bi-monthly short-interest disclosure for the most heavily shorted U.S. equities. % of float, days-to-cover, biggest position builds and covers. FINRA / NYSE / Nasdaq-sourced.",
  alternates: { canonical: "https://holdlens.com/short-interest" },
  openGraph: {
    title: "HoldLens Short Interest Tracker — FINRA-sourced",
    description:
      "Most-shorted U.S. equities, % of float, days-to-cover. Updated bi-monthly.",
    url: "https://holdlens.com/short-interest",
    type: "article",
    images: [
      { url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens" },
    ],
  },
  robots: { index: true, follow: true },
};

export default function ShortInterestLanding() {
  const byPctFloat = topByPctFloat(10);
  const byDtc = topByDaysToCover(8);
  const builds = biggestBuilds(6);
  const unwinds = biggestUnwinds(6);

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Short Interest Tracker",
    description:
      "FINRA-sourced short-interest data for most-shorted U.S. equities.",
    url: "https://holdlens.com/short-interest",
    numberOfItems: SHORT_POSITIONS.length,
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
      { "@type": "ListItem", position: 2, name: "Short Interest", item: "https://holdlens.com/short-interest" },
    ],
  };

  const settlementDate = byPctFloat[0]?.settlementDate ?? "—";

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Short interest · FINRA / NYSE / Nasdaq
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Who&rsquo;s being shorted hardest right now.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-8">
        FINRA requires every member firm to disclose short positions twice a
        month. We aggregate the most-shorted U.S. equities — by % of float,
        days-to-cover, and recent change. The same data the &ldquo;short
        squeeze&rdquo; setups are built from.
      </p>

      <aside
        className="mt-2 mb-12 rounded-card border border-insight/30 bg-surface-insight p-4"
        aria-label="HoldLens read on short interest"
      >
        <div className="text-[10px] uppercase tracking-widest text-insight font-bold mb-1.5">
          HoldLens read
        </div>
        <p className="text-sm text-text leading-relaxed">
          {SHORT_POSITIONS.length} tracked positions as of{" "}
          <span className="font-bold tabular-nums">{settlementDate}</span>.
          Highest %-of-float on the list:{" "}
          <span className="font-bold tabular-nums">
            {byPctFloat[0].ticker} at {byPctFloat[0].shortInterestPctFloat.toFixed(1)}%
          </span>
          . Highest days-to-cover:{" "}
          <span className="font-bold tabular-nums">
            {byDtc[0].ticker} at {byDtc[0].daysToCover.toFixed(1)} days
          </span>
          . High DTC + high %-of-float = the classic squeeze setup, but high
          short interest also means the smart money has high conviction the
          stock falls.
        </p>
      </aside>

      {/* Highest %-of-float */}
      <section className="mb-14">
        <div className="flex items-end justify-between mb-5 flex-wrap gap-2">
          <div>
            <div className="text-[11px] uppercase tracking-widest font-bold text-rose-400 mb-1">
              Highest concentration
            </div>
            <h2 className="text-2xl font-bold">Top by % of float</h2>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Ticker</th>
                <th className="px-4 py-3 text-right">% of float</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Shares short</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">DTC</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Δ</th>
              </tr>
            </thead>
            <tbody>
              {byPctFloat.map((p, i) => (
                <tr
                  key={p.ticker}
                  className="border-b border-border last:border-0 hover:bg-bg/30 transition"
                >
                  <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`/short-interest/${p.ticker}/`}
                      className="inline-flex items-center gap-2 font-mono font-bold text-brand hover:underline"
                    >
                      <TickerLogo symbol={p.ticker} size={20} />
                      {p.ticker}
                    </a>
                    <div className="text-[11px] text-dim">{p.companyName}</div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-rose-400">
                    {p.shortInterestPctFloat.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums hidden sm:table-cell">
                    {formatShares(p.shortInterestShares)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums hidden md:table-cell">
                    {p.daysToCover.toFixed(1)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right tabular-nums hidden md:table-cell ${
                      p.changeVsPriorPct >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {formatPct(p.changeVsPriorPct)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AdSlot format="horizontal" />

      {/* Days-to-cover */}
      <section className="my-14">
        <div className="mb-5">
          <div className="text-[11px] uppercase tracking-widest font-bold text-amber-400 mb-1">
            Liquidity-adjusted squeeze risk
          </div>
          <h2 className="text-2xl font-bold">Highest days-to-cover</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {byDtc.map((p) => (
            <a
              key={p.ticker}
              href={`/short-interest/${p.ticker}/`}
              className="block rounded-2xl border border-border bg-panel p-4 hover:border-brand/40 transition"
            >
              <div className="flex items-center gap-2 mb-3">
                <TickerLogo symbol={p.ticker} size={20} />
                <div className="font-mono font-bold text-brand">{p.ticker}</div>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-dim mb-1">
                Days to cover
              </div>
              <div className="text-2xl font-bold tabular-nums text-amber-400">
                {p.daysToCover.toFixed(1)}
              </div>
              <div className="text-[11px] text-dim mt-1">
                {p.shortInterestPctFloat.toFixed(1)}% float
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Builds + Unwinds two-column */}
      <section className="my-14 grid md:grid-cols-2 gap-6">
        <div>
          <div className="text-[11px] uppercase tracking-widest font-bold text-rose-400 mb-2">
            Shorts adding
          </div>
          <h2 className="text-xl font-bold mb-4">Biggest builds</h2>
          <div className="space-y-2">
            {builds.map((p) => (
              <a
                key={p.ticker}
                href={`/short-interest/${p.ticker}/`}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-panel px-4 py-3 hover:border-brand/40 transition"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <TickerLogo symbol={p.ticker} size={20} />
                  <div className="min-w-0">
                    <div className="font-mono font-bold text-brand text-sm">{p.ticker}</div>
                    <div className="text-[11px] text-dim truncate">{p.companyName}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold tabular-nums text-rose-400">
                    {formatPct(p.changeVsPriorPct)}
                  </div>
                  <div className="text-[10px] text-dim">vs prior</div>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-widest font-bold text-emerald-400 mb-2">
            Shorts covering
          </div>
          <h2 className="text-xl font-bold mb-4">Biggest unwinds</h2>
          <div className="space-y-2">
            {unwinds.map((p) => (
              <a
                key={p.ticker}
                href={`/short-interest/${p.ticker}/`}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-panel px-4 py-3 hover:border-brand/40 transition"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <TickerLogo symbol={p.ticker} size={20} />
                  <div className="min-w-0">
                    <div className="font-mono font-bold text-brand text-sm">{p.ticker}</div>
                    <div className="text-[11px] text-dim truncate">{p.companyName}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold tabular-nums text-emerald-400">
                    {formatPct(p.changeVsPriorPct)}
                  </div>
                  <div className="text-[10px] text-dim">vs prior</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-border bg-panel p-6">
        <h2 className="text-lg font-bold mb-3">How to read this data</h2>
        <p className="text-sm text-muted leading-relaxed mb-3">
          <strong>Short interest</strong> is the total shares sold short but not
          yet repurchased. <strong>% of float</strong> divides that by the
          publicly tradable share count — anything above 20% is heavily shorted.{" "}
          <strong>Days-to-cover (DTC)</strong> is shares-short divided by
          average daily trading volume — how many days at normal volume it would
          take to repurchase every shorted share.
        </p>
        <p className="text-sm text-muted leading-relaxed mb-4">
          High short interest is BOTH a squeeze setup AND a smart-money
          conviction signal. GameStop in 2021 was an example of the squeeze
          dynamic; Beyond Meat&rsquo;s persistent 40%+ short interest is an
          example of the conviction signal.
        </p>
        <div className="flex gap-3 flex-wrap text-sm">
          <a href="/learn/short-interest-explained" className="text-brand hover:underline">
            → How short interest works
          </a>
          <a href="/insiders" className="text-brand hover:underline">
            → Insider buys
          </a>
        </div>
      </section>
    </div>
  );
}
