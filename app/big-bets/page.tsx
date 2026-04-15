import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import LiveQuote from "@/components/LiveQuote";
import CsvExportButton from "@/components/CsvExportButton";
import FoundersNudge from "@/components/FoundersNudge";
import { MANAGERS } from "@/lib/managers";
import { getConviction, convictionLabel, formatSignedScore } from "@/lib/conviction";
import { getManagerROI } from "@/lib/manager-roi";

export const metadata: Metadata = {
  title: "Big Bets — where the best investors bet biggest",
  description:
    "The most concentrated high-conviction positions across 30 tracked superinvestors. Combines position size with the ConvictionScore signal so you see the bets with BOTH size and consensus behind them.",
  alternates: { canonical: "https://holdlens.com/big-bets" },
  openGraph: {
    title: "Big Bets · HoldLens",
    description:
      "Where smart money bets biggest AND the data agrees. Position size × ConvictionScore, ranked.",
  },
};

// A single manager-holding row enriched with conviction + combined bet score.
type BigBet = {
  rank: number;
  managerSlug: string;
  managerName: string;
  managerFund: string;
  managerQuality: number; // 0-10
  ticker: string;
  name: string;
  sector?: string;
  positionPct: number;
  convictionScore: number; // signed −100..+100
  convictionLabel: string;
  convictionColor: string;
  ownerCount: number;
  expectedReturnPct: number | null;
  combinedScore: number; // positionPct × max(0, convictionScore)
};

export default function BigBetsPage() {
  // Enumerate every manager × every topHolding, compute conviction for each ticker
  // once per appearance, and derive the combined bet score.
  const rows: Omit<BigBet, "rank">[] = [];
  for (const m of MANAGERS) {
    const roi = getManagerROI(m.slug);
    const quality = roi?.quality0to10 ?? 6;
    for (const h of m.topHoldings) {
      // Skip a manager's own holding company (IEP etc.) — that's not a "bet"
      if (h.name.toLowerCase().includes("(own)")) continue;
      const conv = getConviction(h.ticker);
      // Combined score: position size gated by conviction. Negative conviction
      // scores zero out (big-bets is buy-side only — sells are on /sells).
      const combined = h.pct * Math.max(0, conv.score);
      const label = convictionLabel(conv.score);
      rows.push({
        managerSlug: m.slug,
        managerName: m.name,
        managerFund: m.fund,
        managerQuality: quality,
        ticker: h.ticker,
        name: h.name,
        sector: conv.sector,
        positionPct: h.pct,
        convictionScore: conv.score,
        convictionLabel: label.label,
        convictionColor: label.color,
        ownerCount: conv.ownerCount,
        expectedReturnPct: conv.expectedReturnPct,
        combinedScore: combined,
      });
    }
  }

  // Primary ranking: combined bet score (positive only, highest first).
  const primary: BigBet[] = rows
    .filter((r) => r.combinedScore > 0)
    .sort((a, b) => b.combinedScore - a.combinedScore)
    .slice(0, 50)
    .map((r, i) => ({ ...r, rank: i + 1 }));

  // Secondary ranking: concentrated contrarian bets — large position (≥8%)
  // AND low ownerCount (≤3) AND positive conviction. These are the "lone wolf"
  // high-conviction plays where one great manager is betting big on a stock
  // nobody else has found yet.
  const contrarian: BigBet[] = rows
    .filter(
      (r) =>
        r.positionPct >= 8 &&
        r.ownerCount <= 3 &&
        r.convictionScore > 0
    )
    .sort((a, b) => b.positionPct - a.positionPct)
    .slice(0, 20)
    .map((r, i) => ({ ...r, rank: i + 1 }));

  const maxCombined = Math.max(1, ...primary.map((r) => r.combinedScore));
  // Tracks first-occurrence tickers so we can anchor to them from /signal/[ticker]
  const seenTickers = new Set<string>();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Big Bets · size × conviction
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        Where the best investors <span className="text-brand">bet biggest</span>.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        The most concentrated high-conviction positions across the {MANAGERS.length} tracked superinvestors.
        Position size multiplied by our signed ConvictionScore — so a bet only ranks high if it has
        <em> both</em> size <em>and</em> consensus behind it.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-6">
        Bet score = position% × ConvictionScore (buy-side only). A 20% position at +80 conviction beats
        a 20% position at +30 conviction, and both beat a 3% "spray and pray" position at +90. Dataroma
        lists top holdings. HoldLens tells you which of those top holdings are actually backed by the cross-manager signal.
      </p>

      <div className="mb-10 flex flex-wrap items-center gap-3">
        <CsvExportButton
          filename="holdlens-big-bets.csv"
          label="Download big bets CSV"
          rows={primary.map((r) => ({
            rank: r.rank,
            manager: r.managerName,
            fund: r.managerFund,
            manager_quality: r.managerQuality,
            ticker: r.ticker,
            name: r.name,
            sector: r.sector || "",
            position_pct: r.positionPct.toFixed(1),
            conviction_score: r.convictionScore,
            conviction_label: r.convictionLabel,
            owner_count: r.ownerCount,
            expected_return_pct: r.expectedReturnPct ?? "",
            combined_bet_score: r.combinedScore.toFixed(0),
          }))}
        />
        <a
          href="/best-now"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
        >
          ← See all conviction rankings
        </a>
      </div>

      <FoundersNudge context="You're analysing where the world's best investors put their biggest bets." />
      <AdSlot format="horizontal" className="mb-10" />

      <div className="rounded-2xl border border-border bg-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-dim text-xs uppercase tracking-wider">
            <tr className="border-b border-border">
              <th className="text-left px-5 py-4 w-10">#</th>
              <th className="text-left px-5 py-4">Manager</th>
              <th className="text-left px-5 py-4">Ticker</th>
              <th className="text-right px-5 py-4 hidden md:table-cell">Price · Today</th>
              <th className="text-right px-5 py-4">Position</th>
              <th className="text-right px-5 py-4 hidden sm:table-cell">Conviction</th>
              <th className="text-right px-5 py-4">Bet score</th>
            </tr>
          </thead>
          <tbody>
            {primary.map((r) => {
              const barPct = (r.combinedScore / maxCombined) * 100;
              const convColor =
                r.convictionColor === "emerald"
                  ? "text-emerald-400"
                  : r.convictionColor === "rose"
                  ? "text-rose-400"
                  : "text-muted";
              // First occurrence of this ticker gets a hash anchor so
              // /signal/[ticker] can deep-link here via /big-bets#AAPL
              const isFirstOccurrence = !seenTickers.has(r.ticker);
              if (isFirstOccurrence) seenTickers.add(r.ticker);
              return (
                <tr
                  key={`${r.managerSlug}-${r.ticker}`}
                  id={isFirstOccurrence ? r.ticker.toLowerCase() : undefined}
                  className="border-b border-border last:border-0 hover:bg-bg/40 transition align-top"
                >
                  <td className="px-5 py-3 text-dim tabular-nums">{r.rank}</td>
                  <td className="px-5 py-3">
                    <a
                      href={`/investor/${r.managerSlug}`}
                      className="text-text hover:text-brand font-semibold truncate block max-w-[10rem]"
                    >
                      {r.managerName}
                    </a>
                    <div className="text-xs text-dim truncate max-w-[10rem]">{r.managerFund}</div>
                  </td>
                  <td className="px-5 py-3">
                    <a
                      href={`/signal/${r.ticker}`}
                      className="font-mono font-bold text-brand hover:underline"
                    >
                      {r.ticker}
                    </a>
                    <div className="text-xs text-muted truncate max-w-[12rem]">{r.name}</div>
                  </td>
                  <td className="px-5 py-3 text-right hidden md:table-cell">
                    <LiveQuote symbol={r.ticker} size="sm" refreshMs={0} />
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums font-semibold">
                    {r.positionPct.toFixed(1)}%
                  </td>
                  <td className={`px-5 py-3 text-right tabular-nums hidden sm:table-cell ${convColor}`}>
                    <div className="font-bold">{formatSignedScore(r.convictionScore)}</div>
                    <div className="text-[10px] uppercase tracking-wider opacity-80">
                      {r.convictionLabel}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right w-40">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-bg overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-brand"
                          style={{ width: `${Math.max(4, barPct)}%` }}
                        />
                      </div>
                      <span className="tabular-nums font-semibold w-14 text-right">
                        {Math.round(r.combinedScore).toLocaleString()}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-dim mt-8 max-w-2xl">
        ConvictionScore is HoldLens's unified −100..+100 signal combining smart-money consensus, insider activity,
        track record, trend streak, concentration, and dissent. Only positions with positive conviction are shown
        (sells are on <a href="/sells" className="underline">/sells</a>). A manager's own holding company (e.g. IEP
        for Icahn) is excluded.
      </p>

      {/* Contrarian big bets — lone-wolf concentration in low-ownership names */}
      {contrarian.length > 0 && (
        <section className="mt-16">
          <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
            <h2 className="text-2xl font-bold">Lone-wolf big bets</h2>
            <div className="text-xs text-dim">Concentration ≥8% · ownership ≤3</div>
          </div>
          <p className="text-muted text-sm mb-6 max-w-2xl">
            Where a tier-1 manager is betting big on a stock almost nobody else tracks. Fewer eyes = more potential
            alpha — and far more risk. These are the contrarian concentration plays where consensus hasn't arrived yet.
          </p>
          <div className="rounded-2xl border border-border bg-panel overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-dim text-xs uppercase tracking-wider">
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-4 w-10">#</th>
                  <th className="text-left px-5 py-4">Manager</th>
                  <th className="text-left px-5 py-4">Ticker</th>
                  <th className="text-right px-5 py-4">Position</th>
                  <th className="text-right px-5 py-4 hidden sm:table-cell">Owners</th>
                  <th className="text-right px-5 py-4 hidden md:table-cell">Conviction</th>
                </tr>
              </thead>
              <tbody>
                {contrarian.map((r) => {
                  const convColor =
                    r.convictionColor === "emerald"
                      ? "text-emerald-400"
                      : "text-muted";
                  return (
                    <tr
                      key={`c-${r.managerSlug}-${r.ticker}`}
                      className="border-b border-border last:border-0 hover:bg-bg/40 transition align-top"
                    >
                      <td className="px-5 py-3 text-dim tabular-nums">{r.rank}</td>
                      <td className="px-5 py-3">
                        <a
                          href={`/investor/${r.managerSlug}`}
                          className="text-text hover:text-brand font-semibold truncate block max-w-[10rem]"
                        >
                          {r.managerName}
                        </a>
                        <div className="text-xs text-dim truncate max-w-[10rem]">{r.managerFund}</div>
                      </td>
                      <td className="px-5 py-3">
                        <a
                          href={`/signal/${r.ticker}`}
                          className="font-mono font-bold text-brand hover:underline"
                        >
                          {r.ticker}
                        </a>
                        <div className="text-xs text-muted truncate max-w-[12rem]">{r.name}</div>
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums font-semibold">
                        {r.positionPct.toFixed(1)}%
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-muted hidden sm:table-cell">
                        {r.ownerCount}
                      </td>
                      <td className={`px-5 py-3 text-right tabular-nums hidden md:table-cell ${convColor}`}>
                        {formatSignedScore(r.convictionScore)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="mt-16 rounded-2xl border border-border bg-panel p-8">
        <h2 className="text-2xl font-bold mb-3">Why this beats Dataroma</h2>
        <ul className="text-muted space-y-2 text-sm">
          <li>
            <span className="text-brand font-semibold">Combined score, not just size.</span> Dataroma shows each
            manager's top holdings in isolation. HoldLens multiplies position size by the cross-manager
            ConvictionScore so a 20% bet in a +80 consensus name ranks above a 20% bet in a −20 name.
          </li>
          <li>
            <span className="text-brand font-semibold">Lone-wolf detection.</span> A separate ranking surfaces
            concentrated positions in low-ownership names — the anti-crowding play where a tier-1 manager found
            something before the consensus did.
          </li>
          <li>
            <span className="text-brand font-semibold">One click to full thesis.</span> Click any ticker to see
            the full signed −100..+100 ConvictionScore breakdown, insider activity, and five-year projected return.
          </li>
        </ul>
      </section>
    </div>
  );
}
