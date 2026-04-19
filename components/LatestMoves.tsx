import { MANAGERS } from "@/lib/managers";
import { getAllMovesEnriched, QUARTER_LABELS, LATEST_QUARTER, type Quarter } from "@/lib/moves";
import { getConviction } from "@/lib/conviction";
import { TICKER_INDEX } from "@/lib/tickers";
import { scoreColor } from "@/lib/signal-colors";
import SectorBadge from "@/components/SectorBadge";
import TickerLogo from "@/components/TickerLogo";
import FundLogo from "@/components/FundLogo";
import SinceFilingDelta from "@/components/SinceFilingDelta";

// <LatestMoves /> — homepage engagement lever, ported from Dataroma's biggest
// time-on-site pattern. Reads enriched MERGED_MOVES at build time, takes the
// top 8 highest-portfolio-impact moves across all tracked managers, and
// renders them with action-coded rows (emerald for buy/add, rose for
// exit/trim). Each row links to the relevant /investor and /signal pages so
// it doubles as an internal-link cluster for SEO.
//
// Server component — zero client JS, zero runtime cost. Works inside the
// Next.js static export.

type Row = {
  quarter: Quarter;
  /** ISO filing date (YYYY-MM-DD) — used by SinceFilingDelta for per-move P&L. */
  filedAt: string;
  ticker: string;
  sector: string | null;
  managerName: string;
  managerSlug: string;
  fund: string;
  action: "new" | "add" | "trim" | "exit";
  impact: number;
  convictionScore: number;
};

// v1.48.3 — TRIM badge migrated from amber → rose-soft. Amber is reserved
// fleet-wide for brand / Pro / primary-CTA signals (the v1.05 palette
// discipline). Using amber for TRIM conflated "HoldLens brand" with "data
// semantic" — a sighted user scanning the page could read amber as
// "something important" when the intended meaning is "directional bearish,
// softer than EXIT." Rose-soft preserves the 4-tier bull/bear grammar:
//   NEW   → bright emerald (new conviction)
//   ADD   → soft emerald   (reinforced conviction)
//   TRIM  → soft rose      (directional bearish, partial)
//   EXIT  → bright rose    (full exit)
// Text-color stays full rose-400 (matches ADD's full emerald-400) so the
// direction reads instantly; bg + border alpha encodes magnitude.
function actionStyle(action: Row["action"]): string {
  if (action === "new") return "bg-emerald-400/15 text-emerald-400 border-emerald-400/30";
  if (action === "add") return "bg-emerald-400/10 text-emerald-400 border-emerald-400/25";
  if (action === "trim") return "bg-rose-400/10 text-rose-400 border-rose-400/25";
  return "bg-rose-400/15 text-rose-400 border-rose-400/30";
}

function actionLabel(action: Row["action"]): string {
  if (action === "new") return "NEW";
  if (action === "add") return "ADD";
  if (action === "trim") return "TRIM";
  return "EXIT";
}

// Manager → ticker of that manager's OWN listed holding company. Moves on
// these are trivially large (they're the manager buying/trimming their own
// vehicle) but not an edge the reader can act on. Matches the `(own)` filter
// pattern already used by /big-bets via topHoldings names.
const OWN_HOLDINGS: Record<string, string> = {
  "carl-icahn": "IEP",
};

function computeRows(): Row[] {
  const moves = getAllMovesEnriched();
  const out: Row[] = [];
  for (const mv of moves) {
    const impact = mv.portfolioImpactPct ?? 0;
    if (impact <= 5) continue;
    if (OWN_HOLDINGS[mv.managerSlug] === mv.ticker) continue;
    const mgr = MANAGERS.find((m) => m.slug === mv.managerSlug);
    if (!mgr) continue;
    const td = TICKER_INDEX[mv.ticker];
    out.push({
      quarter: mv.quarter as Quarter,
      filedAt: mv.filedAt,
      ticker: mv.ticker,
      sector: td?.sector ?? null,
      managerName: mgr.name,
      managerSlug: mgr.slug,
      fund: mgr.fund,
      action: mv.action,
      impact: Math.round(impact * 10) / 10,
      convictionScore: getConviction(mv.ticker).score,
    });
  }
  // Sort by impact desc, then by quarter desc (newer first on ties)
  out.sort((a, b) => {
    if (b.impact !== a.impact) return b.impact - a.impact;
    return b.quarter.localeCompare(a.quarter);
  });
  return out.slice(0, 8);
}

export default function LatestMoves() {
  const rows = computeRows();
  if (rows.length === 0) return null;

  return (
    <section className="py-16 border-t border-border">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
            Live from the filings
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">The biggest smart-money bets right now.</h2>
          <p className="text-muted mt-2 max-w-2xl">
            The eight single trades that moved the most portfolio weight across all {MANAGERS.length} tracked
            managers. When a superinvestor puts <span className="text-text font-semibold">5%+ of their book</span>{" "}
            behind one ticker in a single quarter, that&rsquo;s the signal everyone else chases.
          </p>
        </div>
        <a href="/alerts" className="text-sm text-brand hover:text-text font-semibold shrink-0">
          All alerts →
        </a>
      </div>

      <div className="rounded-2xl border border-border bg-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg/40 border-b border-border">
            <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
              <th className="px-4 py-3 text-left">Move</th>
              <th className="px-4 py-3 text-left">Ticker</th>
              <th className="px-4 py-3 text-left">Manager</th>
              <th className="px-4 py-3 text-right hidden sm:table-cell">Quarter</th>
              <th className="px-4 py-3 text-right">% of book</th>
              <th className="px-4 py-3 text-right hidden md:table-cell">Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={`${r.managerSlug}-${r.ticker}-${r.quarter}-${i}`}
                className="border-b border-border last:border-0 hover:bg-bg/40 transition"
              >
                <td className="px-4 py-3">
                  {/* v1.39 — NEW/ADD/TRIM/EXIT badge for the freshest filed
                      quarter gets `animate-pulse` so users instantly spot
                      which moves happened since they last visited. Only
                      LATEST_QUARTER pulses; prior quarters render static.
                      Subtle opacity oscillation only — no size change, no
                      color flash — so it reads as "alive" not "alarming". */}
                  <span
                    className={`inline-block text-[10px] font-bold uppercase tracking-wider border rounded px-1.5 py-0.5 ${actionStyle(r.action)} ${r.quarter === LATEST_QUARTER ? "animate-pulse" : ""}`}
                  >
                    {actionLabel(r.action)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`/signal/${r.ticker}`}
                    className="inline-flex items-center gap-2 font-mono font-semibold text-brand hover:underline"
                  >
                    <TickerLogo symbol={r.ticker} size={24} />
                    {r.ticker}
                  </a>
                  <div className="text-[10.5px] mt-0.5 ml-8">
                    <SinceFilingDelta
                      ticker={r.ticker}
                      filedAt={r.filedAt}
                      compact
                      range="2y"
                    />
                  </div>
                  {r.sector && (
                    <div className="mt-1 hidden sm:block ml-8">
                      <SectorBadge sector={r.sector} />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`/investor/${r.managerSlug}`}
                    className="inline-flex items-center gap-2 text-text hover:text-brand transition font-semibold"
                  >
                    <FundLogo slug={r.managerSlug} name={r.managerName} size={24} />
                    {r.managerName}
                  </a>
                  <div className="text-[11px] text-dim truncate max-w-[14rem] ml-8">{r.fund}</div>
                </td>
                <td className="px-4 py-3 text-right text-dim tabular-nums hidden sm:table-cell">
                  {QUARTER_LABELS[r.quarter]}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-bold text-text">
                  {r.impact.toFixed(1)}%
                </td>
                {/* v1.48.3 — magnitude-tiered score color via shared
                    `lib/signal-colors.ts`. Before: every +X or −X painted
                    full emerald/rose, erasing magnitude information. After:
                    |score| ≥40 full, ≥25 /85, <25 neutral text-muted. Eye
                    reads rank at a glance; text-muted for weak scores
                    encodes "below meaningful threshold, don't over-read."
                    Same helper used on BuySellSignals homepage cards for
                    palette consistency across both data surfaces. */}
                <td
                  className={`px-4 py-3 text-right tabular-nums font-semibold hidden md:table-cell ${scoreColor(r.convictionScore)}`}
                >
                  {r.convictionScore > 0 ? "+" : ""}
                  {r.convictionScore}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-dim mt-4">
        Sorted by single-move portfolio impact (position value as % of manager&rsquo;s filed book at that quarter).
        Source: SEC Form 13F. <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </section>
  );
}
