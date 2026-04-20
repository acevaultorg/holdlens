import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import TickerLogo from "@/components/TickerLogo";
import { MANAGERS } from "@/lib/managers";
import { MERGED_MOVES, QUARTER_LABELS, type Quarter } from "@/lib/moves";
import { MANAGER_QUALITY } from "@/lib/signals";
import { getConviction, formatSignedScore } from "@/lib/conviction";
import { TICKER_INDEX } from "@/lib/tickers";

// /fresh-conviction — new positions on tickers no one else in the fleet
// owns. This is a third axis next to /biggest-buys (intensity) and
// /first-movers (timing): rarity. When a high-quality manager opens a
// position in a name nobody else holds, they are saying out loud "I see
// something here nobody else does." That's the highest-signal trade a
// 13F can produce — contrarian by construction.

export const metadata: Metadata = {
  title: "Fresh conviction — new trades nobody else is on",
  description:
    "New positions opened by tracked superinvestors in tickers currently held by ≤2 other managers. The rarest, most contrarian buys of the 8-quarter archive.",
  alternates: { canonical: "https://holdlens.com/fresh-conviction" },
  openGraph: {
    title: "HoldLens fresh conviction — lonely-but-confident trades",
    description:
      "New buys in tickers nobody else in the fleet holds. Contrarian by construction.",
    url: "https://holdlens.com/fresh-conviction",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  robots: { index: true, follow: true },
};

type FreshTrade = {
  slug: string;
  managerName: string;
  fund: string;
  quality: number;
  quarter: string;
  quarterLabel: string;
  ticker: string;
  name: string;
  portfolioImpactPct?: number;
  note?: string;
  convictionScore: number;
  sector?: string;
  currentOwnerCount: number;
  loneliness: number; // 3 - currentOwnerCount (lower owner count = higher loneliness)
};

function computeFresh(): FreshTrade[] {
  const managerBySlug = new Map(MANAGERS.map((m) => [m.slug, m]));
  const out: FreshTrade[] = [];

  for (const mv of MERGED_MOVES) {
    if (mv.action !== "new") continue;

    const ticker = mv.ticker.toUpperCase();
    const td = TICKER_INDEX[ticker];
    const currentOwnerCount = td?.ownerCount ?? 0;

    // "Fresh" = ticker is currently held by ≤2 managers in the fleet today.
    // If it's held by 3+, the buy has already joined a crowd and belongs on
    // /biggest-buys or /crowded-trades instead.
    if (currentOwnerCount > 2) continue;

    const m = managerBySlug.get(mv.managerSlug);
    if (!m) continue;
    const conv = getConviction(ticker);

    out.push({
      slug: m.slug,
      managerName: m.name,
      fund: m.fund,
      quality: MANAGER_QUALITY[m.slug] ?? 6,
      quarter: mv.quarter,
      quarterLabel: QUARTER_LABELS[mv.quarter as Quarter] ?? mv.quarter,
      ticker,
      name: mv.name || td?.name || ticker,
      portfolioImpactPct: mv.portfolioImpactPct,
      note: mv.note,
      convictionScore: conv.score,
      sector: td?.sector,
      currentOwnerCount,
      loneliness: 3 - currentOwnerCount,
    });
  }

  // Rank: loneliness desc (fewer owners = rarer), then manager quality desc,
  // then portfolio impact desc (bigger bets on rare names = louder signal).
  out.sort(
    (a, b) =>
      b.loneliness - a.loneliness ||
      b.quality - a.quality ||
      (b.portfolioImpactPct ?? 0) - (a.portfolioImpactPct ?? 0),
  );
  return out;
}

export default function FreshConvictionPage() {
  const all = computeFresh();
  const total = all.length;
  const top10 = all.slice(0, 10);
  const completelyAlone = all.filter((t) => t.currentOwnerCount === 0).length;
  const pairedOnly = all.filter((t) => t.currentOwnerCount === 1).length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Fresh conviction · rarest buys
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        The trades nobody else is on
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        Across 8 quarters of 13F filings,{" "}
        <span className="text-brand font-semibold">{total}</span> new positions
        were opened in tickers currently held by two managers or fewer.{" "}
        <span className="text-emerald-400 font-semibold">{completelyAlone}</span>{" "}
        of them are held by <span className="text-text">zero</span> other
        managers &mdash; completely alone on the trade.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        Dataroma shows consensus &mdash; the tickers everyone owns. HoldLens
        shows <span className="text-text">rarity</span>: the positions a single
        high-quality manager opened while everyone else was looking the other
        way. When the conviction gap is that wide, the thesis is worth reading.
      </p>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-brand">{total}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Lonely new trades
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-emerald-400">
            {completelyAlone}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Zero other owners
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-5">
          <div className="text-3xl font-bold tabular-nums text-text">{pairedOnly}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Held by one other mgr
          </div>
        </div>
      </div>

      {/* Top 10 cards */}
      {top10.length > 0 && (
        <section className="mb-12">
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
            Top 10 · the loneliest conviction
          </div>
          <h2 className="text-2xl font-bold mb-4">Rarest new trades, ranked</h2>
          <div className="space-y-4">
            {top10.map((t, i) => (
              <div
                key={`${t.slug}-${t.ticker}-${t.quarter}`}
                className="rounded-2xl border border-brand/30 bg-brand/5 p-5"
              >
                <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
                  <div className="flex items-baseline gap-3">
                    <div className="text-[10px] uppercase tracking-widest text-brand font-bold">
                      #{i + 1}
                    </div>
                    <a
                      href={`/investor/${t.slug}`}
                      className="text-base font-bold text-text hover:text-brand transition"
                    >
                      {t.managerName}
                    </a>
                    <span className="text-dim text-[11px]">· {t.fund}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      q{t.quality}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3 text-[11px] tabular-nums">
                    {t.slug === "warren-buffett" ? (
                      <span className="text-text">{t.quarterLabel}</span>
                    ) : (
                      <a
                        href={`/investor/${t.slug}/q/${t.quarter.toLowerCase()}`}
                        className="text-text hover:text-brand transition"
                      >
                        {t.quarterLabel}
                      </a>
                    )}
                    <span className="text-dim">·</span>
                    <span className="font-semibold text-emerald-400">NEW</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <a
                    href={`/signal/${t.ticker}`}
                    className="inline-flex items-center gap-2 text-2xl font-mono font-bold text-text hover:text-brand transition"
                  >
                    <TickerLogo symbol={t.ticker} size={28} />
                    {t.ticker}
                  </a>
                  <div className="text-sm text-dim truncate max-w-[18rem]">
                    {t.name}
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-2xl font-bold tabular-nums text-brand">
                      {t.currentOwnerCount === 0
                        ? "ALONE"
                        : `${t.currentOwnerCount} other${
                            t.currentOwnerCount === 1 ? "" : "s"
                          }`}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-dim">
                      in fleet today
                    </div>
                  </div>
                </div>
                {t.note && (
                  <p className="text-[11px] text-muted italic mt-2 leading-relaxed">
                    &ldquo;{t.note}&rdquo;
                  </p>
                )}
                <div className="flex items-baseline gap-3 text-[10px] text-dim mt-2 flex-wrap">
                  {t.sector && <span>Sector: {t.sector}</span>}
                  <span>
                    ConvictionScore:{" "}
                    <span
                      className={`font-semibold ${
                        t.convictionScore >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {formatSignedScore(t.convictionScore)}
                    </span>
                  </span>
                  {t.portfolioImpactPct != null && (
                    <span>
                      Book impact:{" "}
                      <span className="text-text font-semibold">
                        {t.portfolioImpactPct.toFixed(1)}%
                      </span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <AdSlot format="horizontal" />

      {/* Full table */}
      <section className="mt-12">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Full list · every rare new trade
        </div>
        <h2 className="text-2xl font-bold mb-4">
          Every new position in a lonely name
        </h2>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Manager</th>
                <th className="px-4 py-3 text-left">Ticker</th>
                <th className="px-4 py-3 text-left">Quarter</th>
                <th className="px-4 py-3 text-right">Others</th>
                <th className="px-4 py-3 text-right">Book %</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Conviction</th>
              </tr>
            </thead>
            <tbody>
              {/* Capped at 200 rows — full HTML was ~1.2 MB. */}
              {all.slice(0, 200).map((t, i) => (
                <tr
                  key={`${t.slug}-${t.ticker}-${t.quarter}-${i}`}
                  className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                >
                  <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`/investor/${t.slug}`}
                      className="text-xs font-semibold text-text hover:text-brand transition"
                    >
                      {t.managerName}
                    </a>
                    <div className="text-[10px] text-dim truncate max-w-[11rem]">
                      q{t.quality} · {t.fund}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`/signal/${t.ticker}`}
                      className="font-mono font-semibold text-brand hover:underline"
                    >
                      {t.ticker}
                    </a>
                    <div className="text-[10px] text-dim truncate max-w-[10rem]">
                      {t.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-text whitespace-nowrap">
                    {t.slug === "warren-buffett" ? (
                      <span>{t.quarterLabel}</span>
                    ) : (
                      <a
                        href={`/investor/${t.slug}/q/${t.quarter.toLowerCase()}`}
                        className="hover:text-brand transition"
                      >
                        {t.quarterLabel}
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-[11px]">
                    <span
                      className={`font-semibold ${
                        t.currentOwnerCount === 0
                          ? "text-emerald-400"
                          : "text-brand"
                      }`}
                    >
                      {t.currentOwnerCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-text font-semibold">
                    {t.portfolioImpactPct != null
                      ? `${t.portfolioImpactPct.toFixed(1)}%`
                      : "—"}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-semibold tabular-nums hidden md:table-cell ${
                      t.convictionScore >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {formatSignedScore(t.convictionScore)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Methodology */}
      <section className="mt-12 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          How fresh conviction is detected
        </div>
        <h2 className="text-xl font-bold mb-3">Rarity filter on top-holdings index</h2>
        <ul className="text-sm text-muted space-y-2 leading-relaxed mb-4">
          <li>
            <span className="text-text font-semibold">1. Action filter.</span>{" "}
            Only <span className="text-text">new</span> actions count &mdash;
            adds to existing positions live on /biggest-buys.
          </li>
          <li>
            <span className="text-text font-semibold">2. Rarity filter.</span>{" "}
            The ticker must currently be held as a top holding by{" "}
            <span className="text-text">two or fewer</span> managers across the
            entire HoldLens fleet. Above that threshold, the name has already
            joined a crowd.
          </li>
          <li>
            <span className="text-text font-semibold">3. Ranking.</span>{" "}
            Loneliness (3 &minus; current owner count) descending, tiebroken by
            manager quality, then book impact.
          </li>
        </ul>
        <p className="text-sm text-muted leading-relaxed">
          This page is deliberately the opposite of{" "}
          <a href="/consensus" className="underline">/consensus</a> and{" "}
          <a href="/crowded-trades" className="underline">/crowded-trades</a>.
          Consensus measures agreement. Fresh conviction measures isolation &mdash;
          the rarest, highest-signal bets in the archive.
        </p>
      </section>

      <p className="text-xs text-dim mt-12">
        Not investment advice. Rarity computed against current top-holdings
        index.{" "}
        <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
