import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import FoundersNudge from "@/components/FoundersNudge";
import FundLogo from "@/components/FundLogo";
import { MANAGERS } from "@/lib/managers";
import { getAllManagerROI, SP500_CAGR_10Y } from "@/lib/manager-roi";
import { ALL_MOVES, QUARTERS } from "@/lib/moves";

// /manager-rankings — the active-skill ranking.
//
// Distinct from /leaderboard, which ranks managers purely by historical 10y
// alpha. This page combines THREE inputs to surface managers who are BOTH
// proven AND currently playing:
//
//   composite = quality0to10 × max(1, cagr10y) × activityFactor
//
// Where activityFactor = 1 + (movesLast4Q / 20) — a tiny boost for managers
// who actually moved in the last four quarters. Pure historical winners
// who've gone quiet drop down the list; quiet alpha that's still actively
// trading rises up.
//
// The page splits the ranking into two columns side-by-side:
//   • Big names — household-familiar to retail investors
//   • Quiet alpha — high-skill managers most retail investors don't know
//
// This is the answer to a Dataroma blind spot: their leaderboard is just a
// scrollable list. Ours says "here are the people you've heard of vs. here
// are the people you SHOULD have heard of, both ranked by composite skill."
//
// Server component — zero client JS.

export const metadata: Metadata = {
  title: "Manager rankings — best active superinvestors by skill × activity",
  description: `Composite ranking of ${MANAGERS.length} of the best active portfolio managers in the world: 10-year alpha × current activity × track record. Big names vs quiet alpha, side by side.`,
  alternates: { canonical: "https://holdlens.com/manager-rankings" },
  openGraph: {
    title: "HoldLens manager rankings — skill × activity composite",
    description: "Big names vs quiet alpha. The active-skill ranking Dataroma can't show.",
    url: "https://holdlens.com/manager-rankings",
    type: "article",
  },
  robots: { index: true, follow: true },
};

// Curated list of slugs that retail investors universally recognize.
// These are the names you see in the financial press every week. Everyone
// else on the list is "quiet alpha" — high-skill managers most retail
// investors have never heard of.
const HOUSEHOLD_NAMES = new Set<string>([
  "warren-buffett",
  "bill-ackman",
  "carl-icahn",
  "michael-burry",
  "david-einhorn",
  "stanley-druckenmiller",
  "david-tepper",
  "seth-klarman",
  "howard-marks",
  "monish-pabrai",
  "joel-greenblatt",
  "prem-watsa",
  "bill-nygren",
]);

type RankedManager = {
  slug: string;
  name: string;
  fund: string;
  cagr10y: number;
  alpha10y: number;
  winRate: number;
  quality0to10: number;
  movesLast4Q: number;
  activityFactor: number;
  composite: number;
  household: boolean;
};

function lastFourQuarters(): Set<string> {
  // QUARTERS is newest-first ["2025-Q4", "2025-Q3", ...]. Take the first 4.
  // Use string Set to sidestep the readonly-tuple literal-type narrowing.
  return new Set<string>(QUARTERS.slice(0, 4));
}

function computeRankings(): RankedManager[] {
  const allROI = getAllManagerROI();
  const last4 = lastFourQuarters();

  // Count moves per manager across the last 4 quarters.
  const movesByMgr = new Map<string, number>();
  for (const move of ALL_MOVES) {
    if (!last4.has(move.quarter)) continue;
    movesByMgr.set(move.managerSlug, (movesByMgr.get(move.managerSlug) ?? 0) + 1);
  }

  const ranked: RankedManager[] = [];
  for (const roi of allROI) {
    const mgr = MANAGERS.find((m) => m.slug === roi.slug);
    if (!mgr) continue;
    if (roi.cagr10y <= 0) continue; // skip managers with no return data
    const movesLast4Q = movesByMgr.get(roi.slug) ?? 0;
    const activityFactor = 1 + movesLast4Q / 20;
    // Composite — emphasize quality, multiply by historical CAGR (clamped at
    // 1 so a tiny return doesn't zero out a great manager), then nudge by
    // recent activity. Round to 2 decimals for stable display sorting.
    const composite = roi.quality0to10 * Math.max(1, roi.cagr10y) * activityFactor;
    ranked.push({
      slug: roi.slug,
      name: mgr.name,
      fund: mgr.fund,
      cagr10y: roi.cagr10y,
      alpha10y: roi.alpha10y,
      winRate: roi.winRate,
      quality0to10: roi.quality0to10,
      movesLast4Q,
      activityFactor: Math.round(activityFactor * 100) / 100,
      composite: Math.round(composite * 10) / 10,
      household: HOUSEHOLD_NAMES.has(roi.slug),
    });
  }

  ranked.sort((a, b) => b.composite - a.composite);
  return ranked;
}

export default function ManagerRankingsPage() {
  const ranked = computeRankings();
  const bigNames = ranked.filter((r) => r.household);
  const quietAlpha = ranked.filter((r) => !r.household);

  // The single biggest gap: highest-composite quiet-alpha that beats every
  // big name on alpha. This is the "you should know this person" callout.
  const topQuietAlpha = quietAlpha[0];
  const topBigName = bigNames[0];
  const quietBeatsBig =
    topQuietAlpha && topBigName && topQuietAlpha.alpha10y > topBigName.alpha10y;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Manager rankings · skill × activity composite
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        The best active superinvestors, ranked.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        {ranked.length} of the best portfolio managers in the world, ranked by a
        composite of <span className="text-brand font-semibold">10-year quality</span> ×{" "}
        <span className="text-brand font-semibold">CAGR</span> ×{" "}
        <span className="text-brand font-semibold">recent activity</span>. Quiet alpha
        rises; reputation alone doesn&rsquo;t.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        S&amp;P 500 10-year CAGR (benchmark):{" "}
        <span className="text-text font-semibold tabular-nums">{SP500_CAGR_10Y}%</span>.
        Activity = distinct 13F moves over the last 4 quarters.
      </p>

      {/* Hero callout — quiet alpha that beats big names */}
      {quietBeatsBig && (
        <div className="rounded-2xl border border-emerald-400/40 bg-emerald-400/5 p-6 mb-12">
          <div className="text-[10px] uppercase tracking-widest font-bold text-emerald-400 mb-2">
            The name you should know
          </div>
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <div>
              <a
                href={`/investor/${topQuietAlpha.slug}`}
                className="text-2xl font-bold text-text hover:text-brand transition"
              >
                {topQuietAlpha.name}
              </a>
              <div className="text-sm text-muted mt-0.5">{topQuietAlpha.fund}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold tabular-nums text-emerald-400">
                +{topQuietAlpha.alpha10y.toFixed(1)}%
              </div>
              <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                10y alpha vs S&amp;P
              </div>
            </div>
          </div>
          <p className="text-sm text-muted mt-3 leading-relaxed">
            Quiet alpha — beats {topBigName.name}&rsquo;s {topBigName.alpha10y.toFixed(1)}% by{" "}
            <span className="font-semibold text-emerald-400 tabular-nums">
              {(topQuietAlpha.alpha10y - topBigName.alpha10y).toFixed(1)} pts
            </span>
            . {topQuietAlpha.movesLast4Q} moves in the last 4 quarters — actively playing.
          </p>
        </div>
      )}

      {/* Side-by-side: big names vs quiet alpha */}
      <div className="grid lg:grid-cols-2 gap-6 mb-12">
        <RankColumn
          title="Big names"
          subtitle="Household-familiar superinvestors"
          accent="text-brand"
          border="border-brand/30"
          rows={bigNames}
        />
        <RankColumn
          title="Quiet alpha"
          subtitle="High-skill managers most retail investors don't know"
          accent="text-emerald-400"
          border="border-emerald-400/30"
          rows={quietAlpha}
        />
      </div>

      <FoundersNudge tone="brand" context="You're reading the composite ranking of the best active portfolio managers in the world." />
      <AdSlot format="horizontal" />

      {/* Full unified ranking */}
      <section className="mt-12">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Full unified ranking
        </div>
        <h2 className="text-2xl font-bold mb-3">
          All {ranked.length} ranked by composite
        </h2>
        <p className="text-muted text-sm mb-6 max-w-2xl">
          One list, one ranking. Reputation gets no bonus — only verifiable returns and
          current trading activity move the score.
        </p>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Manager</th>
                <th className="px-4 py-3 text-right">Quality</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">CAGR</th>
                <th className="px-4 py-3 text-right">Alpha</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Win rate</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">4Q moves</th>
                <th className="px-4 py-3 text-right">Composite</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((r, i) => (
                <tr
                  key={r.slug}
                  className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                >
                  <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`/investor/${r.slug}`}
                      className="inline-flex items-center gap-2 font-semibold text-text hover:text-brand transition"
                    >
                      <FundLogo slug={r.slug} name={r.name} size={24} />
                      {r.name}
                    </a>
                    {r.household && (
                      <span className="ml-2 text-[9px] font-bold uppercase tracking-wider text-brand bg-brand/10 border border-brand/30 rounded px-1.5 py-0.5">
                        Big name
                      </span>
                    )}
                    <div className="text-[11px] text-dim truncate max-w-[16rem]">
                      {r.fund}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-text">
                    {r.quality0to10.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-text hidden sm:table-cell">
                    {r.cagr10y.toFixed(1)}%
                  </td>
                  <td
                    className={`px-4 py-3 text-right tabular-nums font-semibold ${
                      r.alpha10y >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {r.alpha10y >= 0 ? "+" : ""}
                    {r.alpha10y.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-text hidden md:table-cell">
                    {Math.round(r.winRate * 100)}%
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted hidden md:table-cell">
                    {r.movesLast4Q}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-bold text-brand">
                    {r.composite.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Why this beats Dataroma */}
      <section className="mt-12 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          Why this beats Dataroma
        </div>
        <h2 className="text-xl font-bold mb-3">Activity is half the story</h2>
        <p className="text-sm text-muted leading-relaxed mb-4">
          Most superinvestor sites rank by AUM, name recognition, or pure historical
          return. Those rankings are stale by the time you read them. Our composite
          adds a third dimension — recent activity — so a manager with great history
          who hasn&rsquo;t made a move in two years drops down the list, and a quiet
          high-alpha manager who&rsquo;s actively trading rises.
        </p>
        <p className="text-sm text-muted leading-relaxed">
          Side by side: <span className="text-brand font-semibold">Big names</span> are
          the household-familiar superinvestors. <span className="text-emerald-400 font-semibold">Quiet alpha</span>{" "}
          are the managers most retail investors haven&rsquo;t heard of — yet routinely
          beat the people they have.
        </p>
      </section>

      <p className="text-xs text-dim mt-12">
        Composite formula:{" "}
        <code className="text-text bg-bg/40 border border-border rounded px-1.5 py-0.5">
          quality0to10 × max(1, cagr10y) × (1 + movesLast4Q / 20)
        </code>
        . Quality 0-10 is computed from real returns (see{" "}
        <a href="/leaderboard" className="underline">/leaderboard</a> for the formula).
        Activity is distinct 13F moves over the last 4 quarters of public filings.
        Not investment advice. <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}

function RankColumn({
  title,
  subtitle,
  accent,
  border,
  rows,
}: {
  title: string;
  subtitle: string;
  accent: string;
  border: string;
  rows: RankedManager[];
}) {
  return (
    <div className={`rounded-2xl border ${border} bg-panel p-5`}>
      <div className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${accent}`}>
        {title}
      </div>
      <div className="text-xs text-dim mb-4">{subtitle}</div>
      <ol className="space-y-3">
        {rows.map((r, i) => (
          <li key={r.slug}>
            <a
              href={`/investor/${r.slug}`}
              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-bg/40 transition"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-xs text-dim tabular-nums w-5 shrink-0">
                  {i + 1}.
                </span>
                <FundLogo slug={r.slug} name={r.name} size={24} />
                <div className="min-w-0">
                  <div className="font-semibold text-text text-sm truncate">
                    {r.name}
                  </div>
                  <div className="text-[11px] text-dim truncate">{r.fund}</div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-sm font-bold tabular-nums ${accent}`}>
                  {r.composite.toFixed(1)}
                </div>
                <div
                  className={`text-[10px] tabular-nums ${
                    r.alpha10y >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {r.alpha10y >= 0 ? "+" : ""}
                  {r.alpha10y.toFixed(1)}% α
                </div>
              </div>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
