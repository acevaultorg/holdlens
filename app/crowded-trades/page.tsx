import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import { topTickers } from "@/lib/tickers";
import { MERGED_MOVES, QUARTERS } from "@/lib/moves";
import { getConviction, formatSignedScore } from "@/lib/conviction";

// /crowded-trades — tickers with the most superinvestors piled in, split by
// whether the smart-money model is still bullish or starting to unwind.
//
// Dataroma shows you "who owns what" but doesn't tell you when a crowded
// trade is about to crack. Our version adds three columns they can't:
//   1. ConvictionScore (−100..+100) — is the model still bullish?
//   2. Recent buyers vs sellers (last 2 quarters)
//   3. Net direction badge — unwinding, loading, or stable
//
// The tickers at the TOP are the most dangerous — high ownership means if
// smart money starts selling, the exit is crowded.
//
// Server component, zero client JS.

export const metadata: Metadata = {
  title: "Crowded trades — where is smart money piled in?",
  description:
    "Tickers with the most superinvestors owning them, ranked by ownership and split by recent buyer/seller activity. The unwind signal Dataroma can't show.",
  alternates: { canonical: "https://holdlens.com/crowded-trades" },
  openGraph: {
    title: "HoldLens crowded trades — which smart-money bets are about to crack?",
    description:
      "Highest-ownership tickers ranked by owners × conviction, split by recent buyer vs seller activity.",
    url: "https://holdlens.com/crowded-trades",
    type: "article",
  },
  robots: { index: true, follow: true },
};

type CrowdedRow = {
  symbol: string;
  name: string;
  ownerCount: number;
  convictionScore: number;
  recentBuyers: number;
  recentSellers: number;
  netDirection: "loading" | "unwinding" | "stable";
  sector: string;
  totalConvictionPct: number;
};

function lastTwoQuarters(): Set<string> {
  // QUARTERS is newest-first ["2025-Q4", "2025-Q3", ...]. Use Set<string> to
  // sidestep the readonly-tuple literal-type narrowing trap.
  return new Set<string>(QUARTERS.slice(0, 2));
}

function computeCrowdedTrades(): CrowdedRow[] {
  const top = topTickers(30); // top 30 by owner count
  const last2 = lastTwoQuarters();

  // Index MERGED_MOVES by ticker for the last 2 quarters.
  const movesByTicker = new Map<string, { buyers: number; sellers: number }>();
  for (const mv of MERGED_MOVES) {
    if (!last2.has(mv.quarter)) continue;
    const rec = movesByTicker.get(mv.ticker) ?? { buyers: 0, sellers: 0 };
    if (mv.action === "new" || mv.action === "add") rec.buyers += 1;
    else if (mv.action === "trim" || mv.action === "exit") rec.sellers += 1;
    movesByTicker.set(mv.ticker, rec);
  }

  const rows: CrowdedRow[] = top.map((t) => {
    const conv = getConviction(t.symbol);
    const recent = movesByTicker.get(t.symbol) ?? { buyers: 0, sellers: 0 };
    const net = recent.buyers - recent.sellers;
    const netDirection: CrowdedRow["netDirection"] =
      net > 0 ? "loading" : net < 0 ? "unwinding" : "stable";
    return {
      symbol: t.symbol,
      name: t.name,
      ownerCount: t.ownerCount,
      convictionScore: conv.score,
      recentBuyers: recent.buyers,
      recentSellers: recent.sellers,
      netDirection,
      sector: t.sector ?? "Other",
      totalConvictionPct: Math.round(t.totalConviction * 10) / 10,
    };
  });

  return rows;
}

export default function CrowdedTradesPage() {
  const rows = computeCrowdedTrades();
  const top20 = rows.slice(0, 20);

  // Hero callout: highest-ownership ticker that's net-unwinding. The crack
  // in the foundation.
  const unwinding = rows.filter((r) => r.netDirection === "unwinding");
  const topUnwind = unwinding[0] ?? null;

  // Counter-signal: highest-ownership ticker where smart money is STILL
  // loading. The strongest collective bet right now.
  const loading = rows.filter((r) => r.netDirection === "loading");
  const topLoad = loading[0] ?? null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Crowded trades · ownership × conviction × flow
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        Where is smart money piled in?
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        The {rows.length} tickers owned by the most superinvestors in our coverage, split by
        recent <span className="text-emerald-400 font-semibold">buyer</span> vs{" "}
        <span className="text-rose-400 font-semibold">seller</span> activity over the last
        two quarters.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        Crowded ≠ good. The tickers at the top are the most dangerous — high ownership
        means if smart money starts selling, the exit door is narrow.
      </p>

      {/* Two hero callouts side by side */}
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {topUnwind && (
          <div className="rounded-2xl border border-rose-400/40 bg-rose-400/5 p-6">
            <div className="text-[10px] uppercase tracking-widest font-bold text-rose-400 mb-2">
              Crack in the foundation
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <a
                  href={`/signal/${topUnwind.symbol}`}
                  className="text-2xl font-bold text-text hover:text-brand transition"
                >
                  {topUnwind.symbol}
                </a>
                <div className="text-xs text-muted mt-0.5 truncate max-w-[14rem]">
                  {topUnwind.name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold tabular-nums text-rose-400">
                  {topUnwind.ownerCount}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                  owners
                </div>
              </div>
            </div>
            <p className="text-sm text-muted mt-3 leading-relaxed">
              <span className="font-semibold text-rose-400">
                {topUnwind.recentSellers} sellers
              </span>{" "}
              vs <span className="font-semibold">{topUnwind.recentBuyers} buyer(s)</span>{" "}
              in the last 2 quarters. Conviction:{" "}
              <span className="font-semibold tabular-nums">
                {formatSignedScore(topUnwind.convictionScore)}
              </span>
              . The crowded exit is starting.
            </p>
          </div>
        )}

        {topLoad && (
          <div className="rounded-2xl border border-emerald-400/40 bg-emerald-400/5 p-6">
            <div className="text-[10px] uppercase tracking-widest font-bold text-emerald-400 mb-2">
              Still loading
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <a
                  href={`/signal/${topLoad.symbol}`}
                  className="text-2xl font-bold text-text hover:text-brand transition"
                >
                  {topLoad.symbol}
                </a>
                <div className="text-xs text-muted mt-0.5 truncate max-w-[14rem]">
                  {topLoad.name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold tabular-nums text-emerald-400">
                  {topLoad.ownerCount}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                  owners
                </div>
              </div>
            </div>
            <p className="text-sm text-muted mt-3 leading-relaxed">
              <span className="font-semibold text-emerald-400">
                {topLoad.recentBuyers} buyers
              </span>{" "}
              vs <span className="font-semibold">{topLoad.recentSellers} seller(s)</span>{" "}
              last 2 quarters. Conviction:{" "}
              <span className="font-semibold tabular-nums">
                {formatSignedScore(topLoad.convictionScore)}
              </span>
              . Smart money is still piling in.
            </p>
          </div>
        )}
      </div>

      {/* Full top-20 table */}
      <section className="mt-12">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Top 20 most-owned tickers
        </div>
        <h2 className="text-2xl font-bold mb-3">Ownership × conviction × flow</h2>
        <p className="text-muted text-sm mb-6 max-w-2xl">
          Sorted by owner count. Conviction is the unified −100..+100 smart-money score.
          Flow splits recent buyers from sellers over the last 2 quarters of 13F filings.
        </p>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Ticker</th>
                <th className="px-4 py-3 text-right">Owners</th>
                <th className="px-4 py-3 text-right">Conviction</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Buyers</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Sellers</th>
                <th className="px-4 py-3 text-right">Flow</th>
              </tr>
            </thead>
            <tbody>
              {top20.map((r, i) => {
                const convTone =
                  r.convictionScore >= 30
                    ? "text-emerald-400"
                    : r.convictionScore >= 0
                    ? "text-text"
                    : "text-rose-400";
                const flowBadge =
                  r.netDirection === "loading"
                    ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400"
                    : r.netDirection === "unwinding"
                    ? "bg-rose-400/10 border-rose-400/30 text-rose-400"
                    : "bg-bg/40 border-border text-dim";
                return (
                  <tr
                    key={r.symbol}
                    className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                  >
                    <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`/signal/${r.symbol}`}
                        className="font-semibold text-text hover:text-brand transition"
                      >
                        {r.symbol}
                      </a>
                      <div className="text-[11px] text-dim truncate max-w-[16rem]">
                        {r.name} · {r.sector}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold text-brand">
                      {r.ownerCount}
                    </td>
                    <td
                      className={`px-4 py-3 text-right tabular-nums font-semibold ${convTone}`}
                    >
                      {formatSignedScore(r.convictionScore)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-emerald-400 hidden sm:table-cell">
                      {r.recentBuyers}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-rose-400 hidden sm:table-cell">
                      {r.recentSellers}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase tracking-wider border rounded px-2 py-0.5 ${flowBadge}`}
                      >
                        {r.netDirection}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <AdSlot format="horizontal" />

      {/* Methodology */}
      <section className="mt-12 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          How flow is computed
        </div>
        <h2 className="text-xl font-bold mb-3">Buyers minus sellers, last 2 quarters</h2>
        <p className="text-sm text-muted leading-relaxed mb-3">
          For each ticker, we count distinct superinvestors who <em>initiated</em> or{" "}
          <em>added to</em> a position over the last 2 quarters of 13F filings (buyers),
          and those who <em>trimmed</em> or <em>exited</em> (sellers). Net positive =
          loading, net negative = unwinding, zero = stable.
        </p>
        <p className="text-sm text-muted leading-relaxed">
          Ownership counts reflect the top 10 positions of each manager we track. See{" "}
          <a href="/signal/AAPL" className="text-brand hover:underline">signal pages</a>{" "}
          for the full flow history on any ticker, or{" "}
          <a href="/conviction-leaders" className="text-brand hover:underline">
            /conviction-leaders
          </a>{" "}
          for whose entire portfolio the smart-money model agrees with.
        </p>
      </section>

      <p className="text-xs text-dim mt-12">
        Crowded-trade warning: high ownership concentration means liquidity risk on the
        exit. Not investment advice.{" "}
        <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
