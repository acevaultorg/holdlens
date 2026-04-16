import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import { MERGED_MOVES } from "@/lib/moves";
import { MANAGERS } from "@/lib/managers";
import { TICKER_INDEX } from "@/lib/tickers";
import { getManagerTickerTrend } from "@/lib/signals";
import { getConviction, formatSignedScore } from "@/lib/conviction";

// /trend-streak — multi-quarter compounding leaderboard.
//
// A superinvestor who buys a ticker ONCE is a data point.
// A superinvestor who buys the SAME ticker 3, 4, 5 quarters in a row
// is a compounding thesis — they keep increasing as more information
// comes in. This is the single strongest smart-money signal after
// conviction itself, and it is completely missing from Dataroma.
//
// Columns:
//   - streak (# of consecutive same-direction quarters)
//   - direction (buying | selling)
//   - manager
//   - ticker + live ConvictionScore
//   - window of quarters covered
//
// A 6-quarter buy streak is the ceiling (we track 8 quarters of data).
// A 3+ streak in either direction is flagged as a compounder / capitulator.

export const metadata: Metadata = {
  title: "Trend streaks — multi-quarter compounding conviction",
  description:
    "Superinvestors who have bought — or sold — the same ticker for 3+ consecutive quarters. The single strongest signal Dataroma doesn't surface.",
  alternates: { canonical: "https://holdlens.com/trend-streak" },
  openGraph: {
    title: "HoldLens trend streaks — compounding conviction",
    description:
      "Smart money's multi-quarter buying and selling streaks, ranked by depth.",
    url: "https://holdlens.com/trend-streak",
    type: "article",
  },
  robots: { index: true, follow: true },
};

type Streak = {
  slug: string;
  managerName: string;
  fund: string;
  ticker: string;
  tickerName: string;
  direction: "buying" | "selling";
  streak: number;
  quarters: string[];
  convictionScore: number;
};

function computeStreaks(): Streak[] {
  const managerBySlug = new Map(MANAGERS.map((m) => [m.slug, m]));

  // Unique (managerSlug, ticker) pairs seen in MERGED_MOVES
  const seen = new Set<string>();
  for (const m of MERGED_MOVES) {
    seen.add(`${m.managerSlug}::${m.ticker.toUpperCase()}`);
  }

  const out: Streak[] = [];
  for (const key of seen) {
    const [slug, ticker] = key.split("::");
    const trend = getManagerTickerTrend(slug, ticker);
    if (trend.streak < 2) continue;
    if (trend.direction !== "buying" && trend.direction !== "selling") continue;

    const mgr = managerBySlug.get(slug);
    const tk = TICKER_INDEX[ticker];
    const conv = getConviction(ticker);

    out.push({
      slug,
      managerName: mgr?.name ?? slug,
      fund: mgr?.fund ?? "",
      ticker,
      tickerName: tk?.name ?? ticker,
      direction: trend.direction,
      streak: trend.streak,
      quarters: trend.quarters,
      convictionScore: conv.score,
    });
  }

  // Sort: longest streak first, then by conviction magnitude
  out.sort(
    (a, b) =>
      b.streak - a.streak ||
      Math.abs(b.convictionScore) - Math.abs(a.convictionScore),
  );
  return out;
}

export default function TrendStreakPage() {
  const all = computeStreaks();
  const compounders = all.filter((s) => s.direction === "buying");
  const capitulators = all.filter((s) => s.direction === "selling");

  const threePlusBuys = compounders.filter((s) => s.streak >= 3);
  const threePlusSells = capitulators.filter((s) => s.streak >= 3);

  const longestBuy = compounders[0]?.streak ?? 0;
  const longestSell = capitulators[0]?.streak ?? 0;

  const topCompoundersForCards = threePlusBuys.slice(0, 9);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Trend streaks · multi-quarter compounding
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Who keeps buying — quarter after quarter after quarter?
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        A single buy is a data point.{" "}
        <span className="text-emerald-400 font-semibold">Three in a row</span> is a thesis
        compounding in real time. These are the{" "}
        <span className="text-text font-semibold">{threePlusBuys.length}</span> manager ×
        ticker pairs with a 3+ quarter buying streak, plus the{" "}
        <span className="text-rose-400 font-semibold">{threePlusSells.length}</span> with a
        3+ quarter selling streak.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        Dataroma shows you what was bought last quarter. HoldLens shows you what is{" "}
        <span className="text-text">being</span> bought — a direction, not a snapshot.
      </p>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-4 mb-12">
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-emerald-400">
            {threePlusBuys.length}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            3Q+ buy streaks
          </div>
        </div>
        <div className="rounded-2xl border border-rose-400/30 bg-rose-400/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-rose-400">
            {threePlusSells.length}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            3Q+ sell streaks
          </div>
        </div>
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-brand">{longestBuy}Q</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Longest buy
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-5">
          <div className="text-3xl font-bold tabular-nums text-text">{longestSell}Q</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Longest sell
          </div>
        </div>
      </div>

      {/* Top compounders cards */}
      {topCompoundersForCards.length > 0 && (
        <section className="mb-12">
          <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3">
            The compounders · top {topCompoundersForCards.length}
          </div>
          <h2 className="text-2xl font-bold mb-4">Smart money that keeps adding</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {topCompoundersForCards.map((s) => (
              <a
                key={`${s.slug}-${s.ticker}`}
                href={`/signal/${s.ticker}`}
                className="block rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5 hover:bg-emerald-400/10 transition"
              >
                <div className="flex items-baseline justify-between">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-emerald-400">
                    {s.streak}Q streak
                  </div>
                  <div className="text-sm font-bold tabular-nums text-emerald-400">
                    {formatSignedScore(s.convictionScore)}
                  </div>
                </div>
                <div className="mt-2 text-2xl font-bold text-text">{s.ticker}</div>
                <div className="text-xs text-dim truncate">{s.tickerName}</div>
                <div className="mt-3 text-[11px] text-text font-semibold truncate">
                  {s.managerName}
                </div>
                <div className="text-[10px] text-dim truncate">{s.fund}</div>
                <div className="mt-2 text-[10px] text-muted font-mono truncate">
                  {s.quarters.join(" → ")}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Full compounders table */}
      {compounders.length > 0 && (
        <section className="mt-12">
          <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3">
            Full list · all {compounders.length} buy streaks
          </div>
          <h2 className="text-2xl font-bold mb-4">Every buy streak, longest first</h2>
          <div className="rounded-2xl border border-border bg-panel overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-bg/40 border-b border-border">
                <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Streak</th>
                  <th className="px-4 py-3 text-left">Ticker</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Manager</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">Quarters</th>
                  <th className="px-4 py-3 text-right">Conviction</th>
                </tr>
              </thead>
              <tbody>
                {compounders.map((s, i) => (
                  <tr
                    key={`${s.slug}-${s.ticker}`}
                    className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                  >
                    <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded px-2 py-0.5 text-[11px] font-bold bg-emerald-400/15 text-emerald-400 border border-emerald-400/30">
                        {s.streak}Q ↑
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`/signal/${s.ticker}`}
                        className="font-mono font-semibold text-brand hover:underline"
                      >
                        {s.ticker}
                      </a>
                      <div className="text-[11px] text-dim truncate max-w-[12rem]">
                        {s.tickerName}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <a
                        href={`/investor/${s.slug}`}
                        className="text-text hover:text-brand transition text-xs font-semibold"
                      >
                        {s.managerName}
                      </a>
                      <div className="text-[10px] text-dim truncate max-w-[12rem]">
                        {s.fund}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-[10px] text-muted font-mono whitespace-nowrap">
                      {s.quarters.join(" → ")}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-semibold tabular-nums ${
                        s.convictionScore >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {formatSignedScore(s.convictionScore)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <AdSlot format="horizontal" />

      {/* Full capitulators table */}
      {capitulators.length > 0 && (
        <section className="mt-12">
          <div className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-3">
            The capitulators · all {capitulators.length} sell streaks
          </div>
          <h2 className="text-2xl font-bold mb-4">Who keeps walking away?</h2>
          <div className="rounded-2xl border border-border bg-panel overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-bg/40 border-b border-border">
                <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Streak</th>
                  <th className="px-4 py-3 text-left">Ticker</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Manager</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">Quarters</th>
                  <th className="px-4 py-3 text-right">Conviction</th>
                </tr>
              </thead>
              <tbody>
                {capitulators.map((s, i) => (
                  <tr
                    key={`${s.slug}-${s.ticker}`}
                    className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                  >
                    <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded px-2 py-0.5 text-[11px] font-bold bg-rose-400/15 text-rose-400 border border-rose-400/30">
                        {s.streak}Q ↓
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`/signal/${s.ticker}`}
                        className="font-mono font-semibold text-brand hover:underline"
                      >
                        {s.ticker}
                      </a>
                      <div className="text-[11px] text-dim truncate max-w-[12rem]">
                        {s.tickerName}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <a
                        href={`/investor/${s.slug}`}
                        className="text-text hover:text-brand transition text-xs font-semibold"
                      >
                        {s.managerName}
                      </a>
                      <div className="text-[10px] text-dim truncate max-w-[12rem]">
                        {s.fund}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-[10px] text-muted font-mono whitespace-nowrap">
                      {s.quarters.join(" → ")}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-semibold tabular-nums ${
                        s.convictionScore >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {formatSignedScore(s.convictionScore)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Methodology */}
      <section className="mt-12 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          How streaks are computed
        </div>
        <h2 className="text-xl font-bold mb-3">Walk 8 quarters, count consecutive same-direction moves</h2>
        <ul className="text-sm text-muted space-y-2 leading-relaxed mb-4">
          <li>
            <span className="text-text font-semibold">1. 8-quarter window.</span>{" "}
            HoldLens tracks 2024-Q1 through 2025-Q4 &mdash; two full fiscal years of 13F data.
          </li>
          <li>
            <span className="text-text font-semibold">2. Walk forward.</span>{" "}
            For every (manager, ticker) pair, step through quarters oldest → newest. A{" "}
            <span className="text-emerald-400">new</span> or{" "}
            <span className="text-emerald-400">add</span> action counts as buying; a{" "}
            <span className="text-rose-400">trim</span> or{" "}
            <span className="text-rose-400">exit</span> counts as selling.
          </li>
          <li>
            <span className="text-text font-semibold">3. Reset on direction change.</span>{" "}
            A buyer who trims next quarter resets the streak to 1 in the selling direction.
            Only pure same-direction runs accumulate.
          </li>
          <li>
            <span className="text-text font-semibold">4. Streak ≥ 2 listed, ≥ 3 flagged.</span>{" "}
            A 2-quarter streak is interesting. A 3+ streak is a thesis compounding.
          </li>
        </ul>
        <p className="text-sm text-muted leading-relaxed">
          The ConvictionScore column is the <a href="/methodology" className="text-brand hover:underline">
          current unified score</a> — streak depth feeds into it directly (Layer 4:
          trend-streak compounding). A long streak + high ConvictionScore means the
          signal is both broad and deep.
        </p>
      </section>

      <p className="text-xs text-dim mt-12">
        Not investment advice. 13F filings are delayed 45 days and report long-only
        positions. <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
