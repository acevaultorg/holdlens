import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import FoundersNudge from "@/components/FoundersNudge";
import TickerLogo from "@/components/TickerLogo";
import FundLogo from "@/components/FundLogo";
import { getAllMovesEnriched, LATEST_QUARTER, QUARTER_LABELS } from "@/lib/moves";
import { TICKER_INDEX, SECTOR_MAP } from "@/lib/tickers";
import { MANAGER_QUALITY } from "@/lib/signals";
import { getConviction, convictionLabel, formatSignedScore } from "@/lib/conviction";

export const metadata: Metadata = {
  title: "New positions — fresh money from 30 superinvestors",
  description:
    "Every brand-new position opened by tracked superinvestors this quarter. Fresh conviction plays ranked by position size × manager quality × ConvictionScore. Dataroma lists new buys; HoldLens ranks them.",
  alternates: { canonical: "https://holdlens.com/new-positions" },
  openGraph: {
    title: "New positions · HoldLens",
    description: "Fresh money from the best investors this quarter, ranked.",
  },
};

type NewPosRow = {
  rank: number;
  managerSlug: string;
  managerName: string;
  managerFund: string;
  managerQuality: number;
  ticker: string;
  name: string;
  sector: string;
  positionPct: number;
  convictionScore: number;
  convictionDirection: "BUY" | "SELL" | "NEUTRAL";
  combinedScore: number;
  note?: string;
};

export default function NewPositionsPage() {
  // 1. All "new" action moves in the latest quarter.
  const moves = getAllMovesEnriched().filter(
    (m) => m.action === "new" && m.quarter === LATEST_QUARTER,
  );

  // 2. Enrich with ticker metadata + conviction + quality, then score.
  const rows: Omit<NewPosRow, "rank">[] = moves.map((m) => {
    const t = TICKER_INDEX[m.ticker];
    const conv = getConviction(m.ticker);
    const quality = MANAGER_QUALITY[m.managerSlug] ?? 6;
    const positionPct = m.portfolioImpactPct ?? 0;
    // Combined score: size × quality × (1 + max(0, conv)/100)
    // A high-conviction 10% new bet from a tier-10 manager dominates.
    const combined =
      positionPct * quality * (1 + Math.max(0, conv.score) / 100);
    return {
      managerSlug: m.managerSlug,
      managerName: m.managerName,
      managerFund: m.managerFund,
      managerQuality: quality,
      ticker: m.ticker,
      name: t?.name ?? m.ticker,
      sector: SECTOR_MAP[m.ticker] ?? "Other",
      positionPct,
      convictionScore: conv.score,
      convictionDirection: conv.direction,
      combinedScore: Math.round(combined * 10) / 10,
      note: m.note,
    };
  });

  // 3. Sort by combined score, take top 50.
  rows.sort((a, b) => b.combinedScore - a.combinedScore);
  const topRows: NewPosRow[] = rows.slice(0, 50).map((r, i) => ({
    rank: i + 1,
    ...r,
  }));

  // 4. Derived: count new positions per sector for the side panel.
  const sectorCounts: Record<string, number> = {};
  for (const r of rows) {
    sectorCounts[r.sector] = (sectorCounts[r.sector] ?? 0) + 1;
  }
  const sortedSectors = Object.entries(sectorCounts).sort(
    (a, b) => b[1] - a[1],
  );

  // 5. Derived: manager with most new positions.
  const managerCounts: Record<string, { name: string; count: number }> = {};
  for (const r of rows) {
    const key = r.managerSlug;
    if (!managerCounts[key]) managerCounts[key] = { name: r.managerName, count: 0 };
    managerCounts[key].count += 1;
  }
  const busiestManagers = Object.values(managerCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-block text-[10px] font-bold uppercase tracking-widest text-black bg-brand rounded-full px-3 py-1 mb-4">
          Fresh money · {QUARTER_LABELS[LATEST_QUARTER]}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          New positions from the best investors
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          Every brand-new position opened this quarter across 30 tracked
          superinvestors, ranked by a combined signal:{" "}
          <code className="text-brand bg-panel px-1.5 py-0.5 rounded text-sm">
            position % × manager quality × (1 + ConvictionScore/100)
          </code>
          . Fresh money with size and consensus behind it sits at the top.
        </p>
        <p className="text-dim text-sm max-w-2xl mt-3">
          {rows.length} new positions this quarter · top 50 shown · Dataroma lists
          new buys chronologically, HoldLens ranks them.
        </p>
      </div>

      {/* Top 3 hero cards */}
      {topRows.length >= 3 && (
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {topRows.slice(0, 3).map((r) => (
            <a
              key={`hero-${r.rank}-${r.managerSlug}-${r.ticker}`}
              href={`/signal/${r.ticker}`}
              className="rounded-2xl border border-brand/30 bg-brand/5 hover:border-brand hover:bg-brand/10 transition p-5 block"
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand mb-1">
                #{r.rank} · {r.managerFund}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <TickerLogo symbol={r.ticker} size={32} />
                <div className="text-2xl font-bold text-text">{r.ticker}</div>
              </div>
              <div className="text-xs text-muted mb-3 line-clamp-1">{r.name}</div>
              <div className="flex items-baseline gap-3 flex-wrap text-xs">
                <span className="text-text font-semibold">
                  {r.positionPct.toFixed(1)}% position
                </span>
                <span className="text-dim">·</span>
                <span className="text-brand font-semibold">
                  {formatSignedScore(r.convictionScore)}
                </span>
              </div>
              {r.note && (
                <p className="text-xs text-dim italic mt-3 line-clamp-2">
                  &ldquo;{r.note}&rdquo;
                </p>
              )}
            </a>
          ))}
        </div>
      )}

      {/* Main table */}
      <div className="rounded-2xl border border-border bg-panel overflow-hidden mb-10">
        <div className="px-6 py-4 border-b border-border flex items-baseline justify-between gap-3 flex-wrap">
          <h2 className="text-lg font-bold">Top 50 new positions, ranked</h2>
          <div className="text-xs text-dim">
            Filed {QUARTER_LABELS[LATEST_QUARTER]}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-bg">
              <tr className="text-[10px] uppercase tracking-widest text-dim">
                <th className="text-left px-4 py-3 font-semibold">#</th>
                <th className="text-left px-4 py-3 font-semibold">Ticker</th>
                <th className="text-left px-4 py-3 font-semibold">Manager</th>
                <th className="text-right px-4 py-3 font-semibold">Position</th>
                <th className="text-right px-4 py-3 font-semibold">Score</th>
                <th className="text-right px-4 py-3 font-semibold">
                  Combined
                </th>
              </tr>
            </thead>
            <tbody>
              {topRows.map((r) => {
                const label = convictionLabel(r.convictionScore);
                return (
                  <tr
                    key={`${r.rank}-${r.managerSlug}-${r.ticker}`}
                    className="border-t border-border hover:bg-bg/40 transition"
                  >
                    <td className="px-4 py-3 text-dim font-mono text-xs">
                      {r.rank}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`/signal/${r.ticker}`}
                        className="inline-flex items-center gap-2 text-brand font-bold hover:underline"
                      >
                        <TickerLogo symbol={r.ticker} size={20} />
                        {r.ticker}
                      </a>
                      <div className="text-[11px] text-dim line-clamp-1 max-w-[200px] ml-7">
                        {r.name}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`/investor/${r.managerSlug}`}
                        className="inline-flex items-center gap-2 text-text hover:text-brand transition"
                      >
                        <FundLogo slug={r.managerSlug} name={r.managerName} size={20} />
                        {r.managerName}
                      </a>
                      <div className="text-[11px] text-dim">
                        {r.managerFund}
                        {r.managerQuality >= 9 && (
                          <span className="ml-1.5 text-emerald-400 font-bold">
                            ★
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-text font-semibold">
                      {r.positionPct.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span
                        className={
                          r.convictionScore > 0
                            ? "text-emerald-400 font-semibold"
                            : r.convictionScore < 0
                              ? "text-rose-400 font-semibold"
                              : "text-dim"
                        }
                        title={label.label}
                      >
                        {formatSignedScore(r.convictionScore)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-brand font-bold">
                      {r.combinedScore.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <FoundersNudge tone="emerald" context="You're reading every fresh position the best portfolio managers opened last quarter." />
      <AdSlot format="in-article" className="mb-10" />

      {/* Split panel: sector breakdown + busiest managers */}
      <div className="grid md:grid-cols-2 gap-5 mb-10">
        <div className="rounded-2xl border border-border bg-panel p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-dim mb-4">
            Where fresh money went, by sector
          </h3>
          <div className="space-y-2">
            {sortedSectors.map(([sector, count]) => {
              const pct = (count / rows.length) * 100;
              return (
                <div
                  key={sector}
                  className="flex items-center gap-3"
                >
                  <div className="w-32 text-xs text-text truncate">
                    {sector}
                  </div>
                  <div className="flex-1 h-2 bg-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="w-8 text-right text-xs text-dim tabular-nums">
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-panel p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-dim mb-4">
            Busiest managers — most new positions
          </h3>
          <div className="space-y-3">
            {busiestManagers.map((m, i) => (
              <div
                key={m.name}
                className="flex items-baseline justify-between gap-3"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-dim font-mono w-4">
                    {i + 1}
                  </span>
                  <span className="text-text text-sm">{m.name}</span>
                </div>
                <span className="text-brand font-bold tabular-nums">
                  {m.count}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-dim mt-4 pt-4 border-t border-border">
            Managers rotating hardest this quarter. Cross-reference with{" "}
            <a href="/leaderboard" className="text-brand hover:underline">
              /leaderboard
            </a>{" "}
            to see whose new bets tend to work out.
          </p>
        </div>
      </div>

      {/* Why this beats Dataroma */}
      <section className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-6 md:p-8 mb-10">
        <h2 className="text-xl font-bold mb-3">Why this beats Dataroma</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>
            <span className="text-emerald-400 font-bold">Dataroma</span> lists
            new buys chronologically, one manager at a time.
          </li>
          <li>
            <span className="text-emerald-400 font-bold">HoldLens</span> ranks
            every new position by{" "}
            <em>size × quality × conviction</em> so the bets that matter float
            to the top.
          </li>
          <li>
            Sector breakdown + busiest-managers panel show where fresh money is
            concentrating — the early signal that starts sector rotations.
          </li>
          <li>
            Every row cross-links to the full ConvictionScore breakdown on{" "}
            <code className="text-brand bg-panel px-1 rounded">
              /signal/[ticker]
            </code>
            .
          </li>
        </ul>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-brand bg-brand/5 p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Trade with the smartest money</h2>
        <p className="text-muted text-sm max-w-lg mx-auto mb-6">
          New positions are the freshest signal. For the full conviction story
          start with{" "}
          <a href="/best-now" className="text-brand hover:underline">
            Best stocks now
          </a>
          ,{" "}
          <a href="/big-bets" className="text-brand hover:underline">
            Big bets
          </a>
          , and{" "}
          <a href="/rotation" className="text-brand hover:underline">
            Sector rotation
          </a>
          .
        </p>
        <div className="flex flex-wrap gap-3 justify-center text-xs">
          <a
            href="/best-now"
            className="px-3 py-2 rounded-lg border border-border bg-panel hover:border-brand/40 text-brand font-semibold"
          >
            /best-now
          </a>
          <a
            href="/big-bets"
            className="px-3 py-2 rounded-lg border border-border bg-panel hover:border-brand/40 text-brand font-semibold"
          >
            /big-bets
          </a>
          <a
            href="/value"
            className="px-3 py-2 rounded-lg border border-border bg-panel hover:border-brand/40 text-emerald-400 font-semibold"
          >
            /value
          </a>
          <a
            href="/rotation"
            className="px-3 py-2 rounded-lg border border-border bg-panel hover:border-brand/40 text-brand font-semibold"
          >
            /rotation
          </a>
          <a
            href="/compare/managers"
            className="px-3 py-2 rounded-lg border border-border bg-panel hover:border-brand/40 text-text font-semibold"
          >
            /compare/managers
          </a>
        </div>
      </section>
    </div>
  );
}
