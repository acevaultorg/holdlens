import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import TickerLogo from "@/components/TickerLogo";
import FundLogo from "@/components/FundLogo";
import { TICKER_INDEX, type TickerData } from "@/lib/tickers";
import { getConviction, formatSignedScore } from "@/lib/conviction";
import { MERGED_MOVES, QUARTERS, QUARTER_LABELS, type Quarter } from "@/lib/moves";
import { MANAGERS } from "@/lib/managers";

// /sector/[slug] — richer sector deep-dive.
//
// The old version was a lean stub: h1 + one table. Dataroma has nothing
// comparable for sector-level smart-money signal. This page adds:
//   - aggregate stats strip (tickers, owners, avg conviction, latest-2Q net flow)
//   - top-3 conviction podium (best picks in this sector)
//   - full ticker table WITH ConvictionScore column
//   - recent 4Q buy/sell split for the sector
//   - top managers overweight in the sector

const SECTORS = [
  "Technology", "Financials", "Energy", "Healthcare",
  "Consumer Discretionary", "Consumer Staples", "Industrials",
  "Materials", "Real Estate", "Communication", "Utilities",
];

function slugify(s: string) { return s.toLowerCase().replace(/\s+/g, "-"); }
function unslug(s: string) {
  return SECTORS.find((sec) => slugify(sec) === s);
}

export async function generateStaticParams() {
  return SECTORS.map((sec) => ({ slug: slugify(sec) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sector = unslug(slug);
  if (!sector) return { title: "Sector not found" };
  const ogImage = `/og/sector/${slug}.png`;
  const desc = `${sector} sector smart-money dashboard: which tickers have the strongest ConvictionScore, recent 4Q buyer vs seller flow, and which superinvestors are overweight.`;
  return {
    title: `${sector} stocks held by superinvestors · conviction, flow & best picks`,
    description: desc,
    alternates: { canonical: `https://holdlens.com/sector/${slug}` },
    openGraph: {
      title: `${sector} · smart-money signal`,
      description: desc,
      url: `https://holdlens.com/sector/${slug}`,
      siteName: "HoldLens",
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${sector} smart-money signal` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${sector} · smart-money signal`,
      description: desc,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

type EnrichedTicker = TickerData & { convictionScore: number };

export default async function SectorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sector = unslug(slug);
  if (!sector) notFound();

  // --- all tickers in this sector, enriched with ConvictionScore ---
  const tickers: EnrichedTicker[] = Object.values(TICKER_INDEX)
    .filter((t) => t.sector === sector)
    .map((t) => ({ ...t, convictionScore: getConviction(t.symbol).score }))
    .sort(
      (a, b) =>
        b.convictionScore - a.convictionScore ||
        b.ownerCount - a.ownerCount ||
        b.totalConviction - a.totalConviction,
    );

  if (tickers.length === 0) notFound();

  const tickerSymbols = new Set(tickers.map((t) => t.symbol));

  // --- aggregate stats ---
  const totalOwners = tickers.reduce((s, t) => s + t.ownerCount, 0);
  const avgConviction =
    tickers.reduce((s, t) => s + t.convictionScore, 0) / tickers.length;
  const strongBuys = tickers.filter((t) => t.convictionScore >= 20).length;
  const strongSells = tickers.filter((t) => t.convictionScore <= -20).length;

  // --- recent 4Q buy/sell flow inside the sector ---
  const recentQuarters: string[] = QUARTERS.slice(0, 4) as unknown as string[];
  const recentSet = new Set<string>(recentQuarters);
  let buys = 0;
  let sells = 0;
  const quarterBreakdown: Record<string, { buys: number; sells: number }> = {};
  for (const q of recentQuarters) quarterBreakdown[q] = { buys: 0, sells: 0 };

  for (const mv of MERGED_MOVES) {
    if (!tickerSymbols.has(mv.ticker)) continue;
    if (!recentSet.has(mv.quarter)) continue;
    if (mv.action === "add" || mv.action === "new") {
      buys += 1;
      quarterBreakdown[mv.quarter].buys += 1;
    } else if (mv.action === "trim" || mv.action === "exit") {
      sells += 1;
      quarterBreakdown[mv.quarter].sells += 1;
    }
  }
  const netFlow = buys - sells;

  // --- top managers overweight in this sector ---
  // "overweight" = # of sector tickers held / total holdings, ranked desc
  type ManagerWeight = {
    slug: string;
    name: string;
    fund: string;
    sectorCount: number;
    totalCount: number;
    pctInSector: number;
    sectorPctWeight: number;
  };
  const managerWeights: ManagerWeight[] = MANAGERS.map((m) => {
    const sectorHolds = m.topHoldings.filter((h) => tickerSymbols.has(h.ticker));
    const sectorPctWeight = sectorHolds.reduce((s, h) => s + h.pct, 0);
    return {
      slug: m.slug,
      name: m.name,
      fund: m.fund,
      sectorCount: sectorHolds.length,
      totalCount: m.topHoldings.length,
      pctInSector:
        m.topHoldings.length > 0
          ? (sectorHolds.length / m.topHoldings.length) * 100
          : 0,
      sectorPctWeight,
    };
  })
    .filter((m) => m.sectorCount >= 1)
    .sort((a, b) => b.sectorPctWeight - a.sectorPctWeight)
    .slice(0, 10);

  const top3 = tickers.slice(0, 3);

  // v1.21 — CollectionPage + ItemList + BreadcrumbList. Sector page is a
  // hub aggregating tickers within one GICS sector; CollectionPage is the
  // correct schema.org type. ItemList enumerates the ranked tickers (top
  // 10 by ConvictionScore) so Google can surface sector-specific clusters
  // in knowledge-panel sitelinks. Publisher joins the site-wide @id.
  //
  // Shipped now because sector pages are first-seen by Google in this
  // evaluation cycle (post-GSC-verify 2026-04-16) — adding schema to a
  // first-crawled page is a positive-only signal, not a re-evaluation
  // reset. After this patch the site enters SEO FREEZE until week 16.
  const pageUrl = `https://holdlens.com/sector/${slug}`;
  const LD = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
        { "@type": "ListItem", position: 2, name: "Sectors", item: "https://holdlens.com/sector" },
        { "@type": "ListItem", position: 3, name: sector, item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${sector} stocks held by superinvestors`,
      description: `${sector} sector smart-money dashboard: which tickers have the strongest ConvictionScore, recent 4Q buyer vs seller flow, and which superinvestors are overweight.`,
      url: pageUrl,
      publisher: { "@id": "https://holdlens.com/#organization" },
      inLanguage: "en-US",
      image: `https://holdlens.com/og/sector/${slug}.png`,
      mainEntity: {
        "@type": "ItemList",
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: Math.min(10, tickers.length),
        itemListElement: tickers.slice(0, 10).map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://holdlens.com/signal/${t.symbol}`,
          name: `${t.symbol} — ${t.name}`,
        })),
      },
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }}
      />
      <a href="/ticker" className="text-xs text-muted hover:text-text">← All stocks</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-3">
        Sector · smart-money dashboard
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">{sector}</h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        {tickers.length} {sector.toLowerCase()} tickers held by tracked superinvestors,
        ranked by <span className="text-brand font-semibold">ConvictionScore</span> —
        not by popularity or market cap.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        Sector averages: conviction{" "}
        <span
          className={`font-semibold tabular-nums ${
            avgConviction >= 10
              ? "text-emerald-400"
              : avgConviction <= -10
              ? "text-rose-400"
              : "text-text"
          }`}
        >
          {formatSignedScore(Math.round(avgConviction))}
        </span>{" "}
        · {strongBuys} strong buys · {strongSells} strong sells.
      </p>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="rounded-2xl border border-border bg-panel p-5">
          <div className="text-3xl font-bold tabular-nums text-text">{tickers.length}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Tickers held
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-5">
          <div className="text-3xl font-bold tabular-nums text-text">{totalOwners}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Total owner slots
          </div>
        </div>
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5">
          <div
            className={`text-3xl font-bold tabular-nums ${
              avgConviction >= 0 ? "text-brand" : "text-rose-400"
            }`}
          >
            {formatSignedScore(Math.round(avgConviction))}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Avg conviction
          </div>
        </div>
        <div
          className={`rounded-2xl border p-5 ${
            netFlow >= 0
              ? "border-emerald-400/30 bg-emerald-400/5"
              : "border-rose-400/30 bg-rose-400/5"
          }`}
        >
          <div
            className={`text-3xl font-bold tabular-nums ${
              netFlow >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {netFlow >= 0 ? "+" : ""}{netFlow}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Net flow 4Q ({buys}↑ / {sells}↓)
          </div>
        </div>
      </div>

      {/* Top 3 hero */}
      {top3.length >= 3 && top3[0].convictionScore > 0 && (
        <section className="mb-12">
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
            Smart money&rsquo;s best picks in {sector}
          </div>
          <h2 className="text-2xl font-bold mb-4">Top 3 by ConvictionScore</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {top3.map((t, i) => (
              <a
                key={t.symbol}
                href={`/signal/${t.symbol}`}
                className="block rounded-2xl border border-brand/30 bg-brand/5 p-5 hover:bg-brand/10 transition"
              >
                <div className="flex items-baseline justify-between">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-brand">
                    #{i + 1}
                  </div>
                  <div
                    className={`text-lg font-bold tabular-nums ${
                      t.convictionScore >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {formatSignedScore(t.convictionScore)}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <TickerLogo symbol={t.symbol} size={32} />
                  <div className="text-2xl font-bold text-text">{t.symbol}</div>
                </div>
                <div className="text-xs text-dim truncate mt-1">{t.name}</div>
                <div className="text-[11px] text-muted mt-3">
                  {t.ownerCount} owner{t.ownerCount === 1 ? "" : "s"} · Σ{" "}
                  {t.totalConviction.toFixed(0)}%
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Recent 4Q flow breakdown */}
      <section className="mb-12">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Last 4 quarters · sector-wide flow
        </div>
        <h2 className="text-2xl font-bold mb-4">Buyers vs sellers inside {sector}</h2>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">Quarter</th>
                <th className="px-4 py-3 text-right">Buy actions</th>
                <th className="px-4 py-3 text-right">Sell actions</th>
                <th className="px-4 py-3 text-right">Net</th>
              </tr>
            </thead>
            <tbody>
              {recentQuarters.map((q) => {
                const row = quarterBreakdown[q];
                const net = row.buys - row.sells;
                return (
                  <tr
                    key={q}
                    className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                  >
                    <td className="px-4 py-3 font-semibold text-text">
                      {QUARTER_LABELS[q as Quarter] ?? q}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-emerald-400">
                      {row.buys}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-rose-400">
                      {row.sells}
                    </td>
                    <td
                      className={`px-4 py-3 text-right tabular-nums font-semibold ${
                        net >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {net >= 0 ? "+" : ""}{net}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <AdSlot format="horizontal" />

      {/* Full ticker table */}
      <section className="mt-12">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Full ranking · all {tickers.length} tickers
        </div>
        <h2 className="text-2xl font-bold mb-4">
          Every {sector.toLowerCase()} stock held, sorted by conviction
        </h2>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Ticker</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Company</th>
                <th className="px-4 py-3 text-right">Conviction</th>
                <th className="px-4 py-3 text-right">Owners</th>
                <th className="px-4 py-3 text-right hidden lg:table-cell">Σ %</th>
              </tr>
            </thead>
            <tbody>
              {tickers.map((t, i) => {
                const convTone =
                  t.convictionScore >= 20
                    ? "text-emerald-400 font-bold"
                    : t.convictionScore >= 0
                    ? "text-text font-semibold"
                    : t.convictionScore <= -20
                    ? "text-rose-400 font-bold"
                    : "text-muted";
                return (
                  <tr
                    key={t.symbol}
                    className="border-b border-border last:border-0 hover:bg-bg/50 transition"
                  >
                    <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3 font-mono font-semibold">
                      <a
                        href={`/signal/${t.symbol}`}
                        className="inline-flex items-center gap-2 text-brand hover:underline"
                      >
                        <TickerLogo symbol={t.symbol} size={22} />
                        {t.symbol}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-text hidden md:table-cell truncate max-w-[18rem]">
                      {t.name}
                    </td>
                    <td
                      className={`px-4 py-3 text-right tabular-nums ${convTone}`}
                    >
                      {formatSignedScore(t.convictionScore)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-text">
                      {t.ownerCount}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted hidden lg:table-cell">
                      {t.totalConviction.toFixed(0)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top managers overweight */}
      {managerWeights.length > 0 && (
        <section className="mt-12">
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
            Who&rsquo;s overweight {sector.toLowerCase()}?
          </div>
          <h2 className="text-2xl font-bold mb-4">
            Top 10 managers with the most {sector.toLowerCase()} exposure
          </h2>
          <div className="rounded-2xl border border-border bg-panel overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-bg/40 border-b border-border">
                <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Manager</th>
                  <th className="px-4 py-3 text-right">Positions</th>
                  <th className="px-4 py-3 text-right hidden md:table-cell">
                    % of portfolio
                  </th>
                </tr>
              </thead>
              <tbody>
                {managerWeights.map((m, i) => (
                  <tr
                    key={m.slug}
                    className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                  >
                    <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`/investor/${m.slug}`}
                        className="inline-flex items-center gap-2 font-semibold text-text hover:text-brand transition"
                      >
                        <FundLogo slug={m.slug} name={m.name} size={22} />
                        {m.name}
                      </a>
                      <div className="text-[11px] text-dim truncate max-w-[14rem] ml-8">
                        {m.fund}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-text">
                      {m.sectorCount}/{m.totalCount}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-brand font-semibold hidden md:table-cell">
                      {m.sectorPctWeight.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Other sectors cross-link (v0.93) — retention strip. Users who
          reach a /sector page and read the full dossier previously had
          no obvious next click besides the sticky nav or footer. Now
          they see the 10 sibling sectors one row up with hover-colour
          matched to each tone (brand/emerald/rose) so the eye can tell
          them apart at a glance. Closes the dead-end on a surface that
          gets organic SEO traffic ("technology stocks hedge funds",
          etc.) and is indexed in 11 OG images. */}
      <section className="mt-16 pt-10 border-t border-border">
        <div className="flex items-end justify-between mb-5 flex-wrap gap-2">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-brand font-semibold mb-1">
              More sectors
            </div>
            <h2 className="text-2xl font-bold">Where smart money is moving next</h2>
          </div>
          <a
            href="/rotation"
            className="text-sm text-brand hover:text-text font-semibold"
          >
            Full sector rotation heatmap →
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {SECTORS.filter((s) => s !== sector).map((s) => (
            <a
              key={s}
              href={`/sector/${slugify(s)}`}
              className="rounded-xl border border-border bg-panel p-3 hover:border-brand/40 hover:bg-bg/40 transition block"
            >
              <div className="text-sm font-semibold text-text leading-tight">{s}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Methodology */}
      <section className="mt-12 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          How this page is built
        </div>
        <h2 className="text-xl font-bold mb-3">Sector-level smart-money signal</h2>
        <p className="text-sm text-muted leading-relaxed mb-3">
          Tickers in this page are all the stocks in <span className="text-text">{sector}</span>{" "}
          currently held by at least one tracked superinvestor. Each is enriched with the
          unified <a href="/methodology" className="text-brand hover:underline">ConvictionScore</a>,
          a signed −100..+100 signal combining manager quality, consensus, recent flow,
          multi-quarter trend, insider activity, and a crowding penalty.
        </p>
        <p className="text-sm text-muted leading-relaxed">
          &ldquo;Net flow 4Q&rdquo; counts every 13F move inside the sector across the last
          four quarters — <span className="text-emerald-400">buys and adds count positive</span>,{" "}
          <span className="text-rose-400">trims and exits count negative</span>. Positive
          net flow means smart money is increasing exposure to {sector.toLowerCase()}.
        </p>
      </section>

      <p className="text-xs text-dim mt-12">
        Sector assignments are curated — see <code className="text-text bg-bg/40 px-1">lib/tickers.ts</code>{" "}
        SECTOR_MAP. Not investment advice. Based on publicly filed 13Fs, which are long-only
        and delayed 45 days. <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
