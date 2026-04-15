import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import FoundersNudge from "@/components/FoundersNudge";
import { MANAGERS } from "@/lib/managers";
import { MERGED_MOVES, QUARTER_LABELS, type Quarter } from "@/lib/moves";
import { MANAGER_QUALITY } from "@/lib/signals";
import { getConviction, formatSignedScore } from "@/lib/conviction";
import { TICKER_INDEX } from "@/lib/tickers";

// /biggest-buys — the single trades that moved a portfolio most.
//
// Different from /big-bets, which shows the largest CURRENT holdings.
// This page ranks the single BUY ACTIONS across the 8-quarter archive by
// portfolioImpactPct AFTER the move. Someone going from 0% to 12% of
// their book in NVDA is a much louder signal than someone sitting on an
// existing 15% position — conviction is revealed at the point of
// decision, not the point of snapshot.

export const metadata: Metadata = {
  title: "Biggest buys — the single trades that moved a portfolio most",
  description:
    "The largest single new or add actions across HoldLens's 8-quarter archive, ranked by portfolio impact. Where smart money went all-in.",
  alternates: { canonical: "https://holdlens.com/biggest-buys" },
  openGraph: {
    title: "HoldLens biggest buys — the all-in trades",
    description:
      "8 quarters of the loudest conviction trades from 30 tracked superinvestors.",
    url: "https://holdlens.com/biggest-buys",
    type: "article",
  },
  robots: { index: true, follow: true },
};

type BigBuy = {
  slug: string;
  managerName: string;
  fund: string;
  quality: number;
  quarter: string;
  quarterLabel: string;
  ticker: string;
  name: string;
  action: "new" | "add";
  deltaPct?: number;
  portfolioImpactPct: number;
  note?: string;
  convictionScore: number;
  sector?: string;
  currentOwnerCount: number;
};

function computeBigBuys(): BigBuy[] {
  const managerBySlug = new Map(MANAGERS.map((m) => [m.slug, m]));
  const out: BigBuy[] = [];

  for (const mv of MERGED_MOVES) {
    if (mv.action !== "new" && mv.action !== "add") continue;
    if (mv.portfolioImpactPct == null) continue;
    if (mv.portfolioImpactPct < 4) continue;

    const m = managerBySlug.get(mv.managerSlug);
    if (!m) continue;
    const ticker = mv.ticker.toUpperCase();
    const conv = getConviction(ticker);
    const td = TICKER_INDEX[ticker];

    out.push({
      slug: m.slug,
      managerName: m.name,
      fund: m.fund,
      quality: MANAGER_QUALITY[m.slug] ?? 6,
      quarter: mv.quarter,
      quarterLabel: QUARTER_LABELS[mv.quarter as Quarter] ?? mv.quarter,
      ticker,
      name: mv.name || td?.name || ticker,
      action: mv.action,
      deltaPct: mv.deltaPct,
      portfolioImpactPct: mv.portfolioImpactPct,
      note: mv.note,
      convictionScore: conv.score,
      sector: td?.sector,
      currentOwnerCount: td?.ownerCount ?? 0,
    });
  }

  out.sort(
    (a, b) =>
      b.portfolioImpactPct - a.portfolioImpactPct ||
      b.quality - a.quality ||
      b.convictionScore - a.convictionScore,
  );
  return out;
}

export default function BiggestBuysPage() {
  const all = computeBigBuys();
  const total = all.length;
  const top10 = all.slice(0, 10);
  const newTrades = all.filter((b) => b.action === "new").length;
  const top5Pct = all.filter((b) => b.portfolioImpactPct >= 10).length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Biggest buys · the all-in trades
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        Where did smart money go all-in?
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        Across 8 quarters of 13F filings,{" "}
        <span className="text-brand font-semibold">{total}</span> buy actions from
        HoldLens&rsquo;s tracked superinvestors landed above{" "}
        <span className="text-text font-semibold">4% of portfolio</span> after the
        trade. <span className="text-emerald-400 font-semibold">{newTrades}</span> were
        brand-new positions. <span className="text-text font-semibold">{top5Pct}</span>{" "}
        pushed past 10% &mdash; conviction bets, not nibbles.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        Dataroma shows the current holdings list. HoldLens shows the conviction{" "}
        <span className="text-text">decision</span> &mdash; the quarter a manager
        committed, and how big the bet was at that moment. Both matter, but the
        decision quarter is where the thesis lives.
      </p>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-brand">{total}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Conviction-sized buys
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-emerald-400">
            {newTrades}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Brand-new positions
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-5">
          <div className="text-3xl font-bold tabular-nums text-text">{top5Pct}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Crossed 10% of book
          </div>
        </div>
      </div>

      {/* Top 10 cards */}
      {top10.length > 0 && (
        <section className="mb-12">
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
            Top 10 · the loudest conviction
          </div>
          <h2 className="text-2xl font-bold mb-4">All-in trades, ranked</h2>
          <div className="space-y-4">
            {top10.map((b, i) => (
              <div
                key={`${b.slug}-${b.ticker}-${b.quarter}`}
                className="rounded-2xl border border-brand/30 bg-brand/5 p-5"
              >
                <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
                  <div className="flex items-baseline gap-3">
                    <div className="text-[10px] uppercase tracking-widest text-brand font-bold">
                      #{i + 1}
                    </div>
                    <a
                      href={`/investor/${b.slug}`}
                      className="text-base font-bold text-text hover:text-brand transition"
                    >
                      {b.managerName}
                    </a>
                    <span className="text-dim text-[11px]">· {b.fund}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      q{b.quality}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3 text-[11px] tabular-nums">
                    <span className="text-text">{b.quarterLabel}</span>
                    <span className="text-dim">·</span>
                    <span
                      className={`font-semibold ${
                        b.action === "new" ? "text-emerald-400" : "text-brand"
                      }`}
                    >
                      {b.action === "new" ? "NEW" : `ADD +${b.deltaPct ?? "?"}%`}
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline gap-3 mb-2">
                  <a
                    href={`/signal/${b.ticker}`}
                    className="text-2xl font-mono font-bold text-text hover:text-brand transition"
                  >
                    {b.ticker}
                  </a>
                  <div className="text-sm text-dim truncate max-w-[18rem]">
                    {b.name}
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-2xl font-bold tabular-nums text-brand">
                      {b.portfolioImpactPct.toFixed(1)}%
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-dim">
                      of book
                    </div>
                  </div>
                </div>
                {b.note && (
                  <p className="text-[11px] text-muted italic mt-2 leading-relaxed">
                    &ldquo;{b.note}&rdquo;
                  </p>
                )}
                <div className="flex items-baseline gap-3 text-[10px] text-dim mt-2">
                  {b.sector && <span>Sector: {b.sector}</span>}
                  <span>
                    ConvictionScore:{" "}
                    <span
                      className={`font-semibold ${
                        b.convictionScore >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {formatSignedScore(b.convictionScore)}
                    </span>
                  </span>
                  {b.currentOwnerCount > 0 && (
                    <span>Currently owned by {b.currentOwnerCount} managers</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <FoundersNudge tone="emerald" context="You're reading every single trade that pushed past 10% of a manager's book." />
      <AdSlot format="horizontal" />

      {/* Full table */}
      <section className="mt-12">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Full list · every 4%+ buy
        </div>
        <h2 className="text-2xl font-bold mb-4">Every conviction buy, sorted by book impact</h2>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Manager</th>
                <th className="px-4 py-3 text-left">Ticker</th>
                <th className="px-4 py-3 text-left">Quarter</th>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-4 py-3 text-right">Book %</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Conviction</th>
              </tr>
            </thead>
            <tbody>
              {/* Capped at 200 rows — full HTML was ~850 KB. */}
              {all.slice(0, 200).map((b, i) => (
                <tr
                  key={`${b.slug}-${b.ticker}-${b.quarter}-${i}`}
                  className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                >
                  <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`/investor/${b.slug}`}
                      className="text-xs font-semibold text-text hover:text-brand transition"
                    >
                      {b.managerName}
                    </a>
                    <div className="text-[10px] text-dim truncate max-w-[11rem]">
                      q{b.quality} · {b.fund}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`/signal/${b.ticker}`}
                      className="font-mono font-semibold text-brand hover:underline"
                    >
                      {b.ticker}
                    </a>
                    <div className="text-[10px] text-dim truncate max-w-[10rem]">
                      {b.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-text whitespace-nowrap">
                    {b.quarterLabel}
                  </td>
                  <td className="px-4 py-3 text-[11px]">
                    <span
                      className={`font-semibold ${
                        b.action === "new" ? "text-emerald-400" : "text-brand"
                      }`}
                    >
                      {b.action === "new" ? "NEW" : `ADD ${b.deltaPct ? `+${b.deltaPct}%` : ""}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-brand font-semibold">
                    {b.portfolioImpactPct.toFixed(1)}%
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-semibold tabular-nums hidden md:table-cell ${
                      b.convictionScore >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {formatSignedScore(b.convictionScore)}
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
          How biggest buys are calculated
        </div>
        <h2 className="text-xl font-bold mb-3">Post-trade portfolio impact, 4% floor</h2>
        <ul className="text-sm text-muted space-y-2 leading-relaxed mb-4">
          <li>
            <span className="text-text font-semibold">1. Action filter.</span>{" "}
            Only <span className="text-text">new</span> and{" "}
            <span className="text-text">add</span> actions count. Trims and exits
            live on <a href="/exits" className="underline">/exits</a>.
          </li>
          <li>
            <span className="text-text font-semibold">2. Portfolio-impact floor.</span>{" "}
            The position must represent at least 4% of the manager&rsquo;s book{" "}
            <span className="text-text">after the trade</span>. 4% is the threshold
            below which buys look like nibbles. Above 4%, the manager is declaring
            a thesis.
          </li>
          <li>
            <span className="text-text font-semibold">3. Ranking.</span>{" "}
            Post-trade portfolio-impact desc, tiebroken by manager quality, then
            live ConvictionScore.
          </li>
        </ul>
        <p className="text-sm text-muted leading-relaxed">
          Dataroma ranks by current-snapshot weight. HoldLens lets you see the
          moment a manager committed &mdash; the decision quarter is where the
          reasoning was freshest and the conviction highest.
        </p>
      </section>

      <p className="text-xs text-dim mt-12">
        Not investment advice. Portfolio-impact values are sourced from parsed 13F
        filings and manager disclosures.{" "}
        <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
