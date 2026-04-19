import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import CsvExportButton from "@/components/CsvExportButton";
import { MANAGERS } from "@/lib/managers";
import { MANAGER_QUALITY } from "@/lib/signals";
import { getConviction, formatSignedScore } from "@/lib/conviction";

// /overlap — which superinvestor PAIRS own the same names?
//
// Dataroma lets you browse a single manager. /compare/managers lets you
// diff two. /overlap answers the meta-question: across all 30 tracked
// superinvestors, which PAIRS have the highest conviction overlap, and
// what do they jointly own?
//
// Algorithm:
//   For every pair (A, B), compute:
//     sharedTickers = topHoldings(A) ∩ topHoldings(B)
//     jaccard = |shared| / |union|
//     weightedShared = Σ min(A.pct(t), B.pct(t)) for t in shared
//   Rank pairs by: shared count desc, then weightedShared desc, then
//   average manager quality desc.

export const metadata: Metadata = {
  title: "Overlap — which superinvestor pairs own the same stocks",
  description:
    "Every manager pair from HoldLens's 30 tracked superinvestors ranked by shared holdings. Discover who thinks alike.",
  alternates: { canonical: "https://holdlens.com/overlap" },
  openGraph: {
    title: "HoldLens overlap — who thinks alike",
    description:
      "Superinvestor pair rankings: shared top holdings, Jaccard overlap, and joint conviction.",
    url: "https://holdlens.com/overlap",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  robots: { index: true, follow: true },
};

type SharedHolding = {
  ticker: string;
  name: string;
  pctA: number;
  pctB: number;
  convictionScore: number;
};

type Pair = {
  slugA: string;
  nameA: string;
  fundA: string;
  qualityA: number;
  slugB: string;
  nameB: string;
  fundB: string;
  qualityB: number;
  shared: SharedHolding[];
  sharedCount: number;
  unionCount: number;
  jaccard: number;
  weightedShared: number;     // Σ min(pctA, pctB)
  combinedQuality: number;
};

function computePairs(): Pair[] {
  const out: Pair[] = [];

  for (let i = 0; i < MANAGERS.length; i++) {
    for (let j = i + 1; j < MANAGERS.length; j++) {
      const A = MANAGERS[i];
      const B = MANAGERS[j];

      const mapA = new Map<string, (typeof A.topHoldings)[number]>();
      for (const h of A.topHoldings) mapA.set(h.ticker.toUpperCase(), h);
      const mapB = new Map<string, (typeof B.topHoldings)[number]>();
      for (const h of B.topHoldings) mapB.set(h.ticker.toUpperCase(), h);

      const shared: SharedHolding[] = [];
      for (const [t, hA] of mapA) {
        const hB = mapB.get(t);
        if (!hB) continue;
        const conv = getConviction(t);
        shared.push({
          ticker: t,
          name: hA.name,
          pctA: hA.pct,
          pctB: hB.pct,
          convictionScore: conv.score,
        });
      }
      if (shared.length === 0) continue;

      const unionTickers = new Set<string>();
      for (const h of A.topHoldings) unionTickers.add(h.ticker.toUpperCase());
      for (const h of B.topHoldings) unionTickers.add(h.ticker.toUpperCase());

      const jaccard = shared.length / unionTickers.size;
      const weightedShared = shared.reduce(
        (s, h) => s + Math.min(h.pctA, h.pctB),
        0,
      );
      const qA = MANAGER_QUALITY[A.slug] ?? 6;
      const qB = MANAGER_QUALITY[B.slug] ?? 6;

      shared.sort((a, b) => b.convictionScore - a.convictionScore);

      out.push({
        slugA: A.slug,
        nameA: A.name,
        fundA: A.fund,
        qualityA: qA,
        slugB: B.slug,
        nameB: B.name,
        fundB: B.fund,
        qualityB: qB,
        shared,
        sharedCount: shared.length,
        unionCount: unionTickers.size,
        jaccard,
        weightedShared,
        combinedQuality: qA + qB,
      });
    }
  }

  out.sort(
    (a, b) =>
      b.sharedCount - a.sharedCount ||
      b.weightedShared - a.weightedShared ||
      b.combinedQuality - a.combinedQuality,
  );
  return out;
}

export default function OverlapPage() {
  const pairs = computePairs();
  const withShared = pairs.length;
  const totalPossible = (MANAGERS.length * (MANAGERS.length - 1)) / 2;
  const top6 = pairs.slice(0, 6);
  const maxShared = pairs[0]?.sharedCount ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Overlap · who thinks alike
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Which superinvestors own the same stocks?
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        Across <span className="text-text font-semibold">{totalPossible}</span> possible
        manager pairs, <span className="text-brand font-semibold">{withShared}</span> share
        at least one top holding. Ranked by shared-holding count, then by joint weight in
        both portfolios.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-6">
        Dataroma lets you browse one manager at a time. HoldLens overlap surfaces the
        consensus lattice — if two independent managers with different philosophies both
        pile into the same name, that's a stronger signal than either holding alone.
      </p>
      <div className="mb-10 flex items-center gap-2 flex-wrap">
        <CsvExportButton
          endpoint="/api/v1/overlap.json"
          filename="holdlens-overlap"
          label="Export overlap matrix CSV"
        />
        <span className="text-xs text-dim">Free download — no signup.</span>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-brand">{withShared}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Overlapping pairs
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-emerald-400">
            {maxShared}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Max shared holdings
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-5">
          <div className="text-3xl font-bold tabular-nums text-text">{totalPossible}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Total possible pairs
          </div>
        </div>
      </div>

      {/* Top 6 pair cards */}
      {top6.length > 0 && (
        <section className="mb-12">
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
            Top {top6.length} · highest overlap pairs
          </div>
          <h2 className="text-2xl font-bold mb-4">The deepest consensus</h2>
          <div className="space-y-4">
            {top6.map((p, i) => (
              <div
                key={`${p.slugA}-${p.slugB}`}
                className="rounded-2xl border border-brand/30 bg-brand/5 p-5"
              >
                <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
                  <div className="flex items-baseline gap-3">
                    <div className="text-[10px] uppercase tracking-widest text-brand font-bold">
                      #{i + 1}
                    </div>
                    <a
                      href={`/investor/${p.slugA}`}
                      className="text-base font-bold text-text hover:text-brand transition"
                    >
                      {p.nameA}
                    </a>
                    <span className="text-dim">×</span>
                    <a
                      href={`/investor/${p.slugB}`}
                      className="text-base font-bold text-text hover:text-brand transition"
                    >
                      {p.nameB}
                    </a>
                  </div>
                  <div className="flex items-baseline gap-3 text-[11px] tabular-nums">
                    <span className="text-emerald-400 font-semibold">
                      {p.sharedCount} shared
                    </span>
                    <span className="text-dim">·</span>
                    <span className="text-text">{(p.jaccard * 100).toFixed(0)}% Jaccard</span>
                    <span className="text-dim">·</span>
                    <span className="text-brand">
                      {p.weightedShared.toFixed(1)}% joint weight
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-dim mb-3">
                  {p.fundA} · q{p.qualityA}
                  <span className="mx-2">×</span>
                  {p.fundB} · q{p.qualityB}
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* Nested per-pair shared-ticker list — cap at 30 per pair to prevent
                      the top-6 panel from exploding when a pair shares 50+ tickers. */}
                  {p.shared.slice(0, 30).map((h) => (
                    <a
                      key={h.ticker}
                      href={`/signal/${h.ticker}`}
                      className="inline-flex items-center gap-1.5 rounded border border-border bg-bg/40 px-2 py-1 text-[11px] hover:border-brand transition"
                    >
                      <span className="font-mono font-semibold text-text">{h.ticker}</span>
                      <span className="text-dim">
                        {h.pctA.toFixed(1)}% / {h.pctB.toFixed(1)}%
                      </span>
                      <span
                        className={`font-semibold tabular-nums ${
                          h.convictionScore >= 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {formatSignedScore(h.convictionScore)}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <AdSlot format="horizontal" />

      {/* Full table */}
      {pairs.length > 0 && (
        <section className="mt-12">
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
            Full list · {pairs.length} overlapping pairs
          </div>
          <h2 className="text-2xl font-bold mb-4">Every overlap, sorted by shared count</h2>
          <div className="rounded-2xl border border-border bg-panel overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-bg/40 border-b border-border">
                <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Manager A</th>
                  <th className="px-4 py-3 text-left">Manager B</th>
                  <th className="px-4 py-3 text-right">Shared</th>
                  <th className="px-4 py-3 text-right hidden md:table-cell">Jaccard</th>
                  <th className="px-4 py-3 text-right hidden lg:table-cell">Joint wt</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">Top shared</th>
                </tr>
              </thead>
              <tbody>
                {/* Capped at top 200 pairs — ~870 manager pair combinations total. */}
                {pairs.slice(0, 200).map((p, i) => (
                  <tr
                    key={`${p.slugA}-${p.slugB}`}
                    className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                  >
                    <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`/investor/${p.slugA}`}
                        className="text-xs font-semibold text-text hover:text-brand transition"
                      >
                        {p.nameA}
                      </a>
                      <div className="text-[10px] text-dim truncate max-w-[11rem]">
                        q{p.qualityA}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`/investor/${p.slugB}`}
                        className="text-xs font-semibold text-text hover:text-brand transition"
                      >
                        {p.nameB}
                      </a>
                      <div className="text-[10px] text-dim truncate max-w-[11rem]">
                        q{p.qualityB}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span className="inline-flex items-center rounded px-2 py-0.5 text-[11px] font-bold bg-brand/15 text-brand border border-brand/30">
                        {p.sharedCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-text hidden md:table-cell">
                      {(p.jaccard * 100).toFixed(0)}%
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-brand font-semibold hidden lg:table-cell">
                      {p.weightedShared.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {p.shared.slice(0, 3).map((h) => (
                          <span
                            key={h.ticker}
                            className="text-[10px] font-mono text-dim"
                          >
                            {h.ticker}
                          </span>
                        ))}
                        {p.shared.length > 3 && (
                          <span className="text-[10px] text-dim">
                            +{p.shared.length - 3}
                          </span>
                        )}
                      </div>
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
          How overlap is computed
        </div>
        <h2 className="text-xl font-bold mb-3">Three numbers per pair</h2>
        <ul className="text-sm text-muted space-y-2 leading-relaxed mb-4">
          <li>
            <span className="text-text font-semibold">1. Shared count.</span>{" "}
            The primary ranking. How many tickers appear in{" "}
            <span className="text-text">both</span> managers&rsquo; top-holdings lists.
            A higher count means deeper consensus.
          </li>
          <li>
            <span className="text-text font-semibold">2. Jaccard overlap.</span>{" "}
            Shared / union. A correction for portfolio breadth &mdash; two managers with 20
            holdings each sharing 5 is a 14% Jaccard; two managers with 10 holdings each
            sharing 5 is 33%. Penalizes the &ldquo;big book wins by default&rdquo; effect.
          </li>
          <li>
            <span className="text-text font-semibold">3. Joint weight.</span>{" "}
            For every shared ticker, take the <span className="text-text">smaller</span>{" "}
            of the two managers&rsquo; position weights and sum. This tells you how much of
            both portfolios the shared book actually represents &mdash; the depth of the
            shared conviction, not just the breadth.
          </li>
        </ul>
        <p className="text-sm text-muted leading-relaxed">
          Pair cards in the top section show every shared ticker with both managers&rsquo;
          position sizes and the live ConvictionScore. Click through to the signal page
          for the shared thesis &mdash; these are the names with cross-philosophy conviction.
        </p>
      </section>

      <p className="text-xs text-dim mt-12">
        Not investment advice. Top holdings are the curated top 10-20 per manager;
        some minor positions are not scored.{" "}
        <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
