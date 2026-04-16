import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import CsvExportButton from "@/components/CsvExportButton";
import FoundersNudge from "@/components/FoundersNudge";
import TickerLogo from "@/components/TickerLogo";
import { MERGED_MOVES, QUARTERS } from "@/lib/moves";
import { TICKER_INDEX, topTickers } from "@/lib/tickers";
import { getConviction, formatSignedScore, convictionLabel } from "@/lib/conviction";

// /consensus — the positive signal. Tickers where smart money is both
// WIDELY owned (≥5 tier-1 managers in their top holdings) AND the unified
// conviction model is positive AND recent flow is net buying. The ones
// everyone can agree on right now.
//
// This is the counter-signal to /contrarian-bets (debate) and the positive
// slice of /crowded-trades (piled in). When you see a name here, it means
// the model and the managers agree.

export const metadata: Metadata = {
  title: "Consensus picks — where every superinvestor agrees",
  description:
    "Tickers with ≥5 superinvestor owners, positive smart-money conviction, and net-buying flow. The collective smart-money BUY signal.",
  alternates: { canonical: "https://holdlens.com/consensus" },
  openGraph: {
    title: "HoldLens consensus picks — where smart money agrees",
    description:
      "The stocks smart money agrees on RIGHT NOW — high owner count, positive conviction, net buying.",
    url: "https://holdlens.com/consensus",
    type: "article",
  },
  robots: { index: true, follow: true },
};

type ConsensusRow = {
  ticker: string;
  name: string;
  sector: string;
  ownerCount: number;
  convictionScore: number;
  recentBuyers: number;
  recentSellers: number;
  netFlow: number;
  score: number; // composite ranking score
};

function lastTwoQuarters(): Set<string> {
  return new Set<string>(QUARTERS.slice(0, 2));
}

function computeConsensus(): ConsensusRow[] {
  const last2 = lastTwoQuarters();
  const flowByTicker = new Map<string, { buy: number; sell: number }>();
  for (const mv of MERGED_MOVES) {
    if (!last2.has(mv.quarter)) continue;
    const rec = flowByTicker.get(mv.ticker) ?? { buy: 0, sell: 0 };
    if (mv.action === "new" || mv.action === "add") rec.buy += 1;
    else if (mv.action === "trim" || mv.action === "exit") rec.sell += 1;
    flowByTicker.set(mv.ticker, rec);
  }

  const out: ConsensusRow[] = [];
  for (const t of topTickers(50)) {
    if (t.ownerCount < 5) continue; // must be widely held
    const conv = getConviction(t.symbol);
    if (conv.score <= 0) continue; // must be bullish
    const flow = flowByTicker.get(t.symbol) ?? { buy: 0, sell: 0 };
    const netFlow = flow.buy - flow.sell;
    if (netFlow < 0) continue; // must be net buying or flat
    // Composite: owner count (depth) × conviction (strength) + flow nudge
    const score = t.ownerCount * 10 + conv.score + netFlow * 2;
    out.push({
      ticker: t.symbol,
      name: t.name,
      sector: t.sector ?? "Other",
      ownerCount: t.ownerCount,
      convictionScore: conv.score,
      recentBuyers: flow.buy,
      recentSellers: flow.sell,
      netFlow,
      score: Math.round(score * 10) / 10,
    });
  }
  out.sort((a, b) => b.score - a.score);
  return out;
}

export default function ConsensusPage() {
  const rows = computeConsensus();
  const top3 = rows.slice(0, 3);
  const top20 = rows.slice(0, 20);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3">
        Consensus picks · where smart money agrees
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        The stocks smart money agrees on.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        {rows.length} tickers that pass all three filters at once:{" "}
        <span className="text-emerald-400 font-semibold">≥5 owners</span>,{" "}
        <span className="text-emerald-400 font-semibold">positive conviction</span>, and{" "}
        <span className="text-emerald-400 font-semibold">net buying</span> over the last 2
        quarters.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-6">
        When every filter agrees, you&rsquo;re not chasing a contrarian edge — you&rsquo;re
        riding a collective bet. Less upside, less downside, but higher conviction that
        the trade is right.
      </p>
      <div className="mb-10 flex items-center gap-2 flex-wrap">
        <CsvExportButton
          endpoint="/api/v1/consensus.json"
          filename="holdlens-consensus"
          label="Export consensus CSV"
        />
        <span className="text-xs text-dim">Free download — no signup.</span>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel p-10 text-center">
          <div className="text-lg font-semibold text-text mb-2">
            No tickers pass all three filters this cycle
          </div>
          <p className="text-sm text-dim">
            Smart money is split. Check{" "}
            <a href="/contrarian-bets" className="text-brand underline">
              /contrarian-bets
            </a>{" "}
            for the disagreement signal instead.
          </p>
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {top3.map((r, i) => {
              const labelInfo = convictionLabel(r.convictionScore);
              const ring =
                i === 0
                  ? "border-emerald-400 bg-emerald-400/10"
                  : "border-emerald-400/30 bg-emerald-400/5";
              return (
                <a
                  key={r.ticker}
                  href={`/signal/${r.ticker}`}
                  className={`block rounded-2xl border p-6 hover:opacity-90 transition ${ring}`}
                >
                  <div className="flex items-baseline justify-between mb-3">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-emerald-400">
                      Consensus #{i + 1}
                    </div>
                    <div className="text-[10px] font-bold tabular-nums text-emerald-400">
                      {r.ownerCount} owners
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TickerLogo symbol={r.ticker} size={28} />
                    <div className="text-2xl font-bold text-text">{r.ticker}</div>
                  </div>
                  <div className="text-xs text-dim truncate mb-4">{r.name}</div>
                  <div className="flex items-baseline gap-3">
                    <div>
                      <div className="text-3xl font-bold tabular-nums text-emerald-400">
                        {formatSignedScore(r.convictionScore)}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-dim">
                        conviction
                      </div>
                    </div>
                    <div className="text-right ml-auto">
                      <div className="text-[10px] uppercase tracking-wider text-dim mb-0.5">
                        {labelInfo.label}
                      </div>
                      <div className="text-xs text-emerald-400">
                        +{r.netFlow} net ({r.recentBuyers}B/{r.recentSellers}S)
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Full list */}
          <section className="mt-12">
            <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3">
              Top 20 consensus picks
            </div>
            <h2 className="text-2xl font-bold mb-3">Owners × conviction × flow</h2>
            <div className="rounded-2xl border border-border bg-panel overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-bg/40 border-b border-border">
                  <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">Ticker</th>
                    <th className="px-4 py-3 text-right">Owners</th>
                    <th className="px-4 py-3 text-right">Conviction</th>
                    <th className="px-4 py-3 text-right hidden sm:table-cell">Net flow</th>
                    <th className="px-4 py-3 text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {top20.map((r, i) => (
                    <tr
                      key={r.ticker}
                      className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                    >
                      <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                      <td className="px-4 py-3">
                        <a
                          href={`/signal/${r.ticker}`}
                          className="font-semibold text-text hover:text-brand transition"
                        >
                          {r.ticker}
                        </a>
                        <div className="text-[11px] text-dim truncate max-w-[16rem]">
                          {r.name} · {r.sector}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-bold text-text">
                        {r.ownerCount}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold text-emerald-400">
                        {formatSignedScore(r.convictionScore)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-emerald-400 hidden sm:table-cell">
                        +{r.netFlow}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-bold text-brand">
                        {r.score.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <FoundersNudge tone="emerald" context="You're looking at tickers where ≥5 superinvestors agree and all signals point the same way." />
      <AdSlot format="horizontal" />

      <section className="mt-12 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2">
          How consensus is scored
        </div>
        <h2 className="text-xl font-bold mb-3">All three filters must agree</h2>
        <div className="rounded-lg bg-bg/40 border border-border p-4 mb-4 font-mono text-xs text-text">
          consensusScore = ownerCount × 10 + convictionScore + netFlow × 2
        </div>
        <p className="text-sm text-muted leading-relaxed mb-3">
          A ticker only qualifies if <strong>all three</strong> filters agree:
          (1) ≥5 tier-1 managers own it in their top holdings,
          (2) unified ConvictionScore is positive,
          (3) last 2 quarters show net buying (new+add ≥ trim+exit).
        </p>
        <p className="text-sm text-muted leading-relaxed">
          For the disagreement signal, see{" "}
          <a href="/contrarian-bets" className="text-brand hover:underline">/contrarian-bets</a>
          . For the full crowding matrix (including negative conviction), see{" "}
          <a href="/crowded-trades" className="text-brand hover:underline">/crowded-trades</a>
          .
        </p>
      </section>

      <p className="text-xs text-dim mt-12">
        Consensus ≠ guaranteed upside. Even agreeing smart money can be wrong.{" "}
        <a href="/methodology" className="underline">Methodology</a>. Not investment advice.
      </p>
    </div>
  );
}
