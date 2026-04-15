import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import { MANAGERS } from "@/lib/managers";
import { getConviction, formatSignedScore, convictionLabel } from "@/lib/conviction";

// /conviction-leaders — managers ranked by average ConvictionScore of their
// top holdings.
//
// What this answers: "Whose top 10 stock picks have the strongest unified
// −100..+100 ConvictionScore right now?" Equivalent to asking, "Whose
// ENTIRE portfolio is the smart-money model bullish on?"
//
// This is a forward-looking signal — quality reflects recent activity,
// insider data, multi-quarter trend, and crowding penalty. A manager whose
// top holdings each score high means the smart-money model agrees with
// every one of their bets. A manager whose top holdings score low means the
// smart-money model thinks they're holding losers — even if they have a
// great long-term track record.
//
// Server component, computed at build time. Excludes "(own)" holdings
// (e.g., Icahn's IEP) so the score reflects judgment on OTHER stocks.

export const metadata: Metadata = {
  title: "Conviction leaders — superinvestors with the strongest current picks",
  description: `Managers ranked by the average ConvictionScore of their top 10 stock picks. Whose entire portfolio does the unified −100..+100 smart-money model agree with right now?`,
  alternates: { canonical: "https://holdlens.com/conviction-leaders" },
  openGraph: {
    title: "HoldLens conviction leaders — whose picks score highest",
    description:
      "Managers ranked by average ConvictionScore across their top holdings. Forward-looking signal, not just track record.",
    url: "https://holdlens.com/conviction-leaders",
    type: "article",
  },
  robots: { index: true, follow: true },
};

type ConvictionLeader = {
  slug: string;
  name: string;
  fund: string;
  picksScored: number;
  avgScore: number;
  topPicks: { ticker: string; score: number; pct: number }[];
  bestPick: { ticker: string; score: number; pct: number } | null;
  worstPick: { ticker: string; score: number; pct: number } | null;
  weightedAvgScore: number; // weighted by position pct — what it actually means for the portfolio
};

function isOwnHolding(name: string): boolean {
  return name.toLowerCase().includes("(own)");
}

function computeLeaders(): ConvictionLeader[] {
  const leaders: ConvictionLeader[] = [];

  for (const mgr of MANAGERS) {
    // Filter out "(own)" holdings — IEP for Icahn, etc.
    const eligible = mgr.topHoldings.filter((h) => !isOwnHolding(h.name));
    if (eligible.length === 0) continue;

    const scored = eligible.map((h) => {
      const conv = getConviction(h.ticker);
      return { ticker: h.ticker, score: conv.score, pct: h.pct };
    });

    const sumScore = scored.reduce((s, p) => s + p.score, 0);
    const avgScore = sumScore / scored.length;

    // Position-pct weighted avg: a +60 score on a 25%-of-portfolio bet
    // matters more than a +60 on a 1.8% bet.
    const sumPct = scored.reduce((s, p) => s + p.pct, 0);
    const weightedSum = scored.reduce((s, p) => s + p.score * p.pct, 0);
    const weightedAvgScore = sumPct > 0 ? weightedSum / sumPct : 0;

    const sortedByScore = [...scored].sort((a, b) => b.score - a.score);
    const bestPick = sortedByScore[0] ?? null;
    const worstPick = sortedByScore[sortedByScore.length - 1] ?? null;

    leaders.push({
      slug: mgr.slug,
      name: mgr.name,
      fund: mgr.fund,
      picksScored: scored.length,
      avgScore: Math.round(avgScore * 10) / 10,
      weightedAvgScore: Math.round(weightedAvgScore * 10) / 10,
      topPicks: sortedByScore.slice(0, 3),
      bestPick,
      worstPick,
    });
  }

  // Sort by weighted average — what the manager's actual portfolio leans on
  leaders.sort((a, b) => b.weightedAvgScore - a.weightedAvgScore);
  return leaders;
}

export default function ConvictionLeadersPage() {
  const leaders = computeLeaders();
  const top20 = leaders.slice(0, 20);
  const top3 = leaders.slice(0, 3);

  // Average across all leaders for the "above/below average" verdict
  const avgAcrossAll =
    leaders.reduce((s, l) => s + l.weightedAvgScore, 0) / Math.max(1, leaders.length);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Conviction leaders · weighted by position size
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        Whose entire portfolio does smart money agree with?
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        {leaders.length} managers ranked by the position-weighted average{" "}
        <span className="text-brand font-semibold">ConvictionScore</span> of their top
        holdings. A high score means the unified −100..+100 smart-money model agrees
        with every one of their biggest bets, right now.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        Forward-looking, not historical. Position-weighted so a +60 score on a 25%
        position counts more than +60 on a 2% position. &ldquo;(Own)&rdquo; holdings
        excluded.
      </p>

      {/* Top-3 podium */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {top3.map((l, i) => (
          <PodiumCard key={l.slug} rank={i + 1} leader={l} />
        ))}
      </div>

      {/* Full top-20 table */}
      <section className="mt-12">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Full ranking · top 20
        </div>
        <h2 className="text-2xl font-bold mb-3">
          Position-weighted conviction
        </h2>
        <p className="text-muted text-sm mb-6 max-w-2xl">
          Each manager&rsquo;s top holdings (excluding their own company) scored on the
          unified −100..+100 ConvictionScale, then weighted by position size and
          averaged.
        </p>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Manager</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Picks</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Avg</th>
                <th className="px-4 py-3 text-right">Weighted avg</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Best pick</th>
              </tr>
            </thead>
            <tbody>
              {top20.map((l, i) => {
                const tone =
                  l.weightedAvgScore >= 30
                    ? "text-emerald-400"
                    : l.weightedAvgScore >= 0
                    ? "text-text"
                    : "text-rose-400";
                return (
                  <tr
                    key={l.slug}
                    className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                  >
                    <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`/investor/${l.slug}`}
                        className="font-semibold text-text hover:text-brand transition"
                      >
                        {l.name}
                      </a>
                      <div className="text-[11px] text-dim truncate max-w-[16rem]">
                        {l.fund}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-text hidden sm:table-cell">
                      {l.picksScored}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted hidden md:table-cell">
                      {formatSignedScore(l.avgScore)}
                    </td>
                    <td className={`px-4 py-3 text-right tabular-nums font-bold ${tone}`}>
                      {formatSignedScore(l.weightedAvgScore)}
                    </td>
                    <td className="px-4 py-3 text-left text-xs text-muted hidden lg:table-cell">
                      {l.bestPick && (
                        <a
                          href={`/signal/${l.bestPick.ticker}`}
                          className="hover:text-brand"
                        >
                          <span className="font-semibold text-brand">
                            {l.bestPick.ticker}
                          </span>{" "}
                          <span className="tabular-nums opacity-80">
                            {formatSignedScore(l.bestPick.score)}
                          </span>
                        </a>
                      )}
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
          How this is computed
        </div>
        <h2 className="text-xl font-bold mb-3">
          Position-weighted average
        </h2>
        <div className="rounded-lg bg-bg/40 border border-border p-4 mb-4 font-mono text-xs text-text">
          weightedAvg = Σ(score × pct) / Σ(pct)
        </div>
        <p className="text-sm text-muted leading-relaxed mb-3">
          For each manager, every top-10 holding (excluding &ldquo;(own)&rdquo;
          companies like Icahn&rsquo;s IEP) gets the unified −100..+100
          ConvictionScore. We then average those scores weighted by the size of
          each position in the portfolio. A 25%-of-portfolio +60 conviction beats
          a 2% +60 conviction.
        </p>
        <p className="text-sm text-muted leading-relaxed">
          This is a <em>forward-looking</em> signal, distinct from{" "}
          <a href="/leaderboard" className="text-brand hover:underline">/leaderboard</a>{" "}
          (historical 10y alpha) and{" "}
          <a href="/manager-rankings" className="text-brand hover:underline">/manager-rankings</a>{" "}
          (skill × activity composite). Average across all {leaders.length} leaders:{" "}
          <span className="text-text font-semibold tabular-nums">
            {formatSignedScore(Math.round(avgAcrossAll * 10) / 10)}
          </span>
          .
        </p>
      </section>

      <p className="text-xs text-dim mt-12">
        ConvictionScore methodology:{" "}
        <a href="/methodology" className="underline">methodology</a>. Not investment
        advice. Updates with each new 13F filing cycle.
      </p>
    </div>
  );
}

function PodiumCard({ rank, leader }: { rank: number; leader: ConvictionLeader }) {
  const tone = leader.weightedAvgScore >= 0 ? "emerald" : "rose";
  const medal =
    rank === 1
      ? "border-brand bg-brand/10 text-brand"
      : rank === 2
      ? `border-${tone}-400/40 bg-${tone}-400/5 text-${tone}-400`
      : "border-border bg-panel text-muted";
  const labelInfo = convictionLabel(leader.weightedAvgScore);
  return (
    <a
      href={`/investor/${leader.slug}`}
      className={`block rounded-2xl border p-6 hover:opacity-90 transition ${medal}`}
    >
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">
          Rank #{rank}
        </div>
        <div className="text-[10px] font-semibold opacity-80">
          {leader.picksScored} picks
        </div>
      </div>
      <div className="font-bold text-text text-lg leading-tight">{leader.name}</div>
      <div className="text-xs text-muted mb-4 truncate">{leader.fund}</div>
      <div className="flex items-baseline gap-3">
        <div>
          <div className="text-3xl font-bold tabular-nums">
            {formatSignedScore(leader.weightedAvgScore)}
          </div>
          <div className="text-[10px] uppercase tracking-wider opacity-70">
            Weighted avg
          </div>
        </div>
        <div className="text-right ml-auto">
          <div className="text-[10px] uppercase tracking-wider opacity-70 mb-0.5">
            {labelInfo.label}
          </div>
          {leader.bestPick && (
            <div className="text-xs">
              top:{" "}
              <span className="font-semibold tabular-nums text-text">
                {leader.bestPick.ticker} {formatSignedScore(leader.bestPick.score)}
              </span>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
