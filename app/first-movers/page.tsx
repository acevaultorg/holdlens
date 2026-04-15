import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import { MANAGERS } from "@/lib/managers";
import { MERGED_MOVES, QUARTERS, QUARTER_LABELS, type Quarter } from "@/lib/moves";
import { MANAGER_QUALITY } from "@/lib/signals";
import { TICKER_INDEX } from "@/lib/tickers";
import { getConviction, formatSignedScore } from "@/lib/conviction";

// /first-movers — who bought this name FIRST, before the crowd?
//
// Dataroma lets you see who holds a ticker TODAY. It does not tell you
// who held it FIRST. That's the entire premise of "smart money":
// the first-mover captures the asymmetric upside. By the time 10
// superinvestors own a name, the crowd has arrived — the first three
// had the real insight.
//
// Algorithm:
//   1. For every ticker that has at least 1 action="new" record in the
//      8-quarter move history, find the earliest quarter containing a
//      new-position entry.
//   2. Managers with a "new" record in that earliest quarter are
//      "first movers" on that ticker.
//   3. "Crowd arrival" = the next quarter with any additional "new"
//      record on the same ticker. Quarters between first move and
//      crowd arrival = "lead quarters" (the first mover's alone-time).
//   4. "Late movers" = all subsequent "new" records on the same ticker.
//
// Ranking:
//   a. currentOwnerCount desc (the bet worked — crowd came)
//   b. leadQuarters desc (bigger moat)
//   c. firstMoverQuality desc (higher-quality first movers weighted more)

export const metadata: Metadata = {
  title: "First movers — who bought before the crowd arrived",
  description:
    "Across HoldLens's 8-quarter archive, the managers who entered names like NVDA, META, and UBER first — before the rest of smart money piled in.",
  alternates: { canonical: "https://holdlens.com/first-movers" },
  openGraph: {
    title: "HoldLens first movers — bought first, crowd came second",
    description:
      "8 quarters of 13F history. The managers who were early on the names that matter.",
    url: "https://holdlens.com/first-movers",
    type: "article",
  },
  robots: { index: true, follow: true },
};

// QUARTERS is newest-first. Chronological = reversed.
const CHRONO: readonly Quarter[] = [...QUARTERS].reverse();
const QINDEX: Record<string, number> = Object.fromEntries(
  CHRONO.map((q, i) => [q, i]),
);

type FirstMover = {
  slug: string;
  name: string;
  fund: string;
  quality: number;
  portfolioImpactPct?: number;
  note?: string;
};

type LateMover = {
  slug: string;
  name: string;
  fund: string;
  quality: number;
  quarter: string;
  lagQuarters: number; // how many quarters after first-move quarter
};

type TickerFirstMove = {
  ticker: string;
  name: string;
  firstQuarter: string;
  firstQuarterLabel: string;
  firstMovers: FirstMover[];
  lateMovers: LateMover[];
  crowdQuarter?: string;       // next quarter with a new-record after first
  leadQuarters: number;        // (crowdQuarter index) - (firstQuarter index), or CHRONO.length - firstIdx if no crowd yet
  currentOwnerCount: number;   // from TICKER_INDEX (top-holdings snapshot)
  currentTotalConviction: number;
  firstMoverQualityAvg: number;
  convictionScore: number;
  sector?: string;
};

function computeFirstMovers(): TickerFirstMove[] {
  const byTicker = new Map<
    string,
    {
      ticker: string;
      name: string;
      // quarter → managers who opened a new position that quarter
      newsByQ: Map<string, { slug: string; portfolioImpactPct?: number; note?: string }[]>;
    }
  >();

  for (const mv of MERGED_MOVES) {
    if (mv.action !== "new") continue;
    const key = mv.ticker.toUpperCase();
    if (!byTicker.has(key)) {
      byTicker.set(key, {
        ticker: key,
        name: mv.name || TICKER_INDEX[key]?.name || key,
        newsByQ: new Map(),
      });
    }
    const cell = byTicker.get(key)!;
    if (!cell.newsByQ.has(mv.quarter)) {
      cell.newsByQ.set(mv.quarter, []);
    }
    cell.newsByQ.get(mv.quarter)!.push({
      slug: mv.managerSlug,
      portfolioImpactPct: mv.portfolioImpactPct,
      note: mv.note,
    });
  }

  const managerBySlug = new Map(MANAGERS.map((m) => [m.slug, m]));

  const out: TickerFirstMove[] = [];
  for (const [ticker, cell] of byTicker) {
    // Chronological sort of the quarters that contain a "new" record
    const quarters = Array.from(cell.newsByQ.keys()).sort(
      (a, b) => (QINDEX[a] ?? 99) - (QINDEX[b] ?? 99),
    );
    if (quarters.length === 0) continue;

    const firstQ = quarters[0];
    const firstIdx = QINDEX[firstQ] ?? 0;
    const firstEntries = cell.newsByQ.get(firstQ) || [];
    const firstMovers: FirstMover[] = firstEntries
      .map((e): FirstMover | null => {
        const m = managerBySlug.get(e.slug);
        if (!m) return null;
        return {
          slug: m.slug,
          name: m.name,
          fund: m.fund,
          quality: MANAGER_QUALITY[m.slug] ?? 6,
          portfolioImpactPct: e.portfolioImpactPct,
          note: e.note,
        };
      })
      .filter((x): x is FirstMover => x !== null);

    // Skip if no first movers resolved (all slugs unknown, unlikely)
    if (firstMovers.length === 0) continue;

    const crowdQuarter = quarters[1];
    const leadQuarters = crowdQuarter
      ? (QINDEX[crowdQuarter] ?? CHRONO.length) - firstIdx
      : CHRONO.length - firstIdx;

    const lateMovers: LateMover[] = [];
    for (let qi = 1; qi < quarters.length; qi++) {
      const q = quarters[qi];
      const lagQuarters = (QINDEX[q] ?? 0) - firstIdx;
      for (const e of cell.newsByQ.get(q) || []) {
        const m = managerBySlug.get(e.slug);
        if (!m) continue;
        lateMovers.push({
          slug: m.slug,
          name: m.name,
          fund: m.fund,
          quality: MANAGER_QUALITY[m.slug] ?? 6,
          quarter: q,
          lagQuarters,
        });
      }
    }

    const td = TICKER_INDEX[ticker];
    const conv = getConviction(ticker);
    const firstMoverQualityAvg =
      firstMovers.reduce((s, m) => s + m.quality, 0) / firstMovers.length;

    out.push({
      ticker,
      name: cell.name,
      firstQuarter: firstQ,
      firstQuarterLabel: QUARTER_LABELS[firstQ as Quarter] ?? firstQ,
      firstMovers,
      lateMovers,
      crowdQuarter,
      leadQuarters,
      currentOwnerCount: td?.ownerCount ?? firstMovers.length,
      currentTotalConviction: td?.totalConviction ?? 0,
      firstMoverQualityAvg,
      convictionScore: conv.score,
      sector: td?.sector,
    });
  }

  out.sort(
    (a, b) =>
      b.currentOwnerCount - a.currentOwnerCount ||
      b.leadQuarters - a.leadQuarters ||
      b.firstMoverQualityAvg - a.firstMoverQualityAvg ||
      b.convictionScore - a.convictionScore,
  );
  return out;
}

export default function FirstMoversPage() {
  const rows = computeFirstMovers();
  const totalTickers = rows.length;
  const crowdCame = rows.filter((r) => r.lateMovers.length > 0).length;
  const maxLead = rows[0]?.leadQuarters ?? 0;
  const topCrowd = rows.filter((r) => r.currentOwnerCount >= 3).slice(0, 8);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        First movers · bought before the crowd
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        Who bought it first?
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        Across HoldLens&rsquo;s 8-quarter archive,{" "}
        <span className="text-text font-semibold">{totalTickers}</span> tickers have at
        least one new-position entry. On{" "}
        <span className="text-brand font-semibold">{crowdCame}</span> of those, a second
        manager followed in a later quarter &mdash; that&rsquo;s the crowd arriving.
        The names below are sorted by how many superinvestors now own them,
        tiebroken by first-mover lead time.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        Dataroma shows who holds what today. It does not show who had the insight
        first. HoldLens keeps 8 quarters of move history, so you can separate the
        first-mover from the late add. The first-mover&rsquo;s return is asymmetric &mdash;
        the crowd pays retail.
      </p>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-brand">{totalTickers}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Tickers with a new-position entry
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-emerald-400">
            {crowdCame}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Where the crowd followed
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-5">
          <div className="text-3xl font-bold tabular-nums text-text">
            {maxLead}Q
          </div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Longest first-mover lead
          </div>
        </div>
      </div>

      {/* Top cards */}
      {topCrowd.length > 0 && (
        <section className="mb-12">
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
            Top {topCrowd.length} · where the bet paid off
          </div>
          <h2 className="text-2xl font-bold mb-4">First movers, crowd followed</h2>
          <div className="space-y-4">
            {topCrowd.map((r, i) => (
              <div
                key={r.ticker}
                className="rounded-2xl border border-brand/30 bg-brand/5 p-5"
              >
                <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
                  <div className="flex items-baseline gap-3">
                    <div className="text-[10px] uppercase tracking-widest text-brand font-bold">
                      #{i + 1}
                    </div>
                    <a
                      href={`/signal/${r.ticker}`}
                      className="text-xl font-bold font-mono text-text hover:text-brand transition"
                    >
                      {r.ticker}
                    </a>
                    <div className="text-sm text-dim truncate max-w-[14rem]">
                      {r.name}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-3 text-[11px] tabular-nums">
                    <span className="text-emerald-400 font-semibold">
                      {r.currentOwnerCount} own now
                    </span>
                    <span className="text-dim">·</span>
                    <span className="text-brand font-semibold">
                      {r.leadQuarters}Q lead
                    </span>
                    <span className="text-dim">·</span>
                    <span
                      className={`font-semibold ${
                        r.convictionScore >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {formatSignedScore(r.convictionScore)}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-dim mb-3">
                  First opened{" "}
                  <span className="text-text font-semibold">{r.firstQuarterLabel}</span>
                  {r.crowdQuarter && (
                    <>
                      {" "}· crowd arrived{" "}
                      <span className="text-text font-semibold">
                        {QUARTER_LABELS[r.crowdQuarter as Quarter] ?? r.crowdQuarter}
                      </span>
                    </>
                  )}
                </div>
                <div className="mb-3">
                  <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mb-1">
                    First movers
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {r.firstMovers.map((m) => (
                      <a
                        key={m.slug}
                        href={`/investor/${m.slug}`}
                        className="inline-flex items-center gap-2 rounded border border-emerald-400/30 bg-emerald-400/5 px-3 py-1.5 hover:border-emerald-400 transition text-[11px]"
                      >
                        <span className="font-semibold text-text">{m.name}</span>
                        <span className="text-dim">· {m.fund}</span>
                        <span className="text-emerald-400 font-semibold">q{m.quality}</span>
                      </a>
                    ))}
                  </div>
                </div>
                {r.lateMovers.length > 0 && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mb-1">
                      Then the crowd ({r.lateMovers.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {r.lateMovers.map((m) => (
                        <span
                          key={`${m.slug}-${m.quarter}`}
                          className="inline-flex items-center gap-1.5 rounded border border-border bg-bg/40 px-2 py-1 text-[10px]"
                        >
                          <span className="text-text">{m.name}</span>
                          <span className="text-dim">
                            · +{m.lagQuarters}Q ({QUARTER_LABELS[m.quarter as Quarter] ?? m.quarter})
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <AdSlot format="horizontal" />

      {/* Full table */}
      <section className="mt-12">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Full list · every first-mover entry
        </div>
        <h2 className="text-2xl font-bold mb-4">
          All {rows.length} tickers with an opening quarter on record
        </h2>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Ticker</th>
                <th className="px-4 py-3 text-left">First opened</th>
                <th className="px-4 py-3 text-left">First movers</th>
                <th className="px-4 py-3 text-right">Lead</th>
                <th className="px-4 py-3 text-right">Owns now</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Conviction</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.ticker}
                  className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                >
                  <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`/signal/${r.ticker}`}
                      className="font-mono font-semibold text-brand hover:underline"
                    >
                      {r.ticker}
                    </a>
                    <div className="text-[11px] text-dim truncate max-w-[11rem]">
                      {r.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-text whitespace-nowrap">
                    {r.firstQuarterLabel}
                  </td>
                  <td className="px-4 py-3 text-[11px]">
                    <div className="flex flex-wrap gap-1">
                      {r.firstMovers.slice(0, 3).map((m) => (
                        <span
                          key={m.slug}
                          className="text-emerald-400 font-semibold"
                        >
                          {m.name.split(" ").slice(-1)[0]}
                          {m.quality >= 8 ? "*" : ""}
                        </span>
                      ))}
                      {r.firstMovers.length > 3 && (
                        <span className="text-dim">+{r.firstMovers.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-brand font-semibold">
                    {r.leadQuarters}Q
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-text">
                    {r.currentOwnerCount}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-semibold tabular-nums hidden md:table-cell ${
                      r.convictionScore >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {formatSignedScore(r.convictionScore)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-dim mt-3">
          <span className="text-emerald-400">*</span> first-mover is a quality-8+
          manager (top tier). Lead column counts quarters between the first
          &ldquo;new&rdquo; record and the next one (or end of archive if crowd
          hasn&rsquo;t arrived).
        </p>
      </section>

      {/* Methodology */}
      <section className="mt-12 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          How first movers are identified
        </div>
        <h2 className="text-xl font-bold mb-3">8-quarter moving-window, new-action only</h2>
        <ul className="text-sm text-muted space-y-2 leading-relaxed mb-4">
          <li>
            <span className="text-text font-semibold">1. New-position entries only.</span>{" "}
            We scan every 13F filing in the 8-quarter window (Q1 2024 → Q4 2025) for
            action=&quot;new&quot; records. Adds on top of existing positions don&rsquo;t
            count &mdash; we want the manager who opened the book.
          </li>
          <li>
            <span className="text-text font-semibold">2. Earliest-quarter rule.</span>{" "}
            For each ticker with at least one new entry, the earliest quarter in the
            archive with any new record defines the first-mover cohort. Managers in
            that quarter are first movers. Everyone later is the late wave.
          </li>
          <li>
            <span className="text-text font-semibold">3. Lead quarters.</span>{" "}
            The gap between the first-mover quarter and the next quarter with any new
            record on the same ticker. If no crowd has arrived, lead = quarters from
            first-move to the end of the archive.
          </li>
          <li>
            <span className="text-text font-semibold">4. Sorting.</span>{" "}
            Current owner count desc (the bet worked, crowd came), then lead quarters
            desc (bigger moat), then first-mover quality average desc (higher-quality
            pick), then ConvictionScore.
          </li>
        </ul>
        <p className="text-sm text-muted leading-relaxed">
          The 8-quarter window is a hard limit of the current archive &mdash; if a manager
          opened a position in 2022 and the archive only starts in Q1 2024, they are
          treated as an established holder, not a first mover. This is a known bias
          and the archive will extend as quarters close.
        </p>
      </section>

      <p className="text-xs text-dim mt-12">
        Not investment advice. First-mover status reflects archive coverage, not
        the full public history of a position.{" "}
        <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
