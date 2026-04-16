import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import { MERGED_MOVES, QUARTERS, QUARTER_LABELS, type Quarter } from "@/lib/moves";
import { TICKER_INDEX } from "@/lib/tickers";
import { getConviction, formatSignedScore } from "@/lib/conviction";

// /accelerators — aggregate smart-money ownership growing quarter over quarter.
//
// /trend-streak measures whether a single manager keeps buying the same name.
// /accelerators measures whether the ENTIRE smart-money fleet is net-adding
// to a name, and for how many quarters in a row. This is the "crowd forming"
// signal — distinct from /crowded-trades (a snapshot) and /trend-streak
// (a per-manager streak).
//
// Algorithm:
//   For each ticker, for each of the 8 tracked quarters, compute
//       netDelta(q) = (# new + # add) - (# trim + # exit)
//   Walk quarters oldest → newest, count the longest run of positive
//   netDelta. Tickers with 3+ quarter positive runs are accelerators.
//
// Sort order: longest run desc, then sum of positive deltas, then current
// ConvictionScore.

export const metadata: Metadata = {
  title: "Accelerators — tickers where smart money keeps net-adding",
  description:
    "Tickers where the entire superinvestor fleet has net-added for 3+ consecutive quarters. The crowd forming around smart money — not yet crowded.",
  alternates: { canonical: "https://holdlens.com/accelerators" },
  openGraph: {
    title: "HoldLens accelerators — the crowd forming",
    description:
      "Tickers where aggregate smart-money ownership keeps growing, quarter after quarter.",
    url: "https://holdlens.com/accelerators",
    type: "article",
  },
  robots: { index: true, follow: true },
};

type Accelerator = {
  ticker: string;
  name: string;
  sector?: string;
  runLength: number;
  runStart: string;
  runEnd: string;
  runSum: number;             // total of positive deltas during the run
  latestDelta: number;        // delta in the most recent quarter (may be 0)
  ownerCount: number;
  convictionScore: number;
  perQuarter: { q: string; delta: number; inRun: boolean }[];
};

const QORDER: readonly Quarter[] = [
  "2024-Q1",
  "2024-Q2",
  "2024-Q3",
  "2024-Q4",
  "2025-Q1",
  "2025-Q2",
  "2025-Q3",
  "2025-Q4",
] as const;

function computeAccelerators(): Accelerator[] {
  // Bucket moves: ticker → quarter → { buys, sells }
  const bucket: Map<string, Map<string, { buys: number; sells: number }>> = new Map();
  for (const m of MERGED_MOVES) {
    const t = m.ticker.toUpperCase();
    if (!bucket.has(t)) bucket.set(t, new Map());
    const inner = bucket.get(t)!;
    const key = m.quarter;
    if (!inner.has(key)) inner.set(key, { buys: 0, sells: 0 });
    const cell = inner.get(key)!;
    if (m.action === "new" || m.action === "add") cell.buys++;
    else cell.sells++;
  }

  const out: Accelerator[] = [];
  for (const [ticker, inner] of bucket) {
    // Build aligned delta series over QORDER
    const series = QORDER.map((q) => {
      const cell = inner.get(q);
      const delta = cell ? cell.buys - cell.sells : 0;
      return { q: String(q), delta };
    });

    // Find the LONGEST run of strictly positive consecutive deltas
    // anchored to the most recent quarters (prefer runs that include the
    // latest quarter when there's a tie).
    let bestRunStart = -1;
    let bestRunLen = 0;
    let i = 0;
    while (i < series.length) {
      if (series[i].delta > 0) {
        let j = i;
        while (j < series.length && series[j].delta > 0) j++;
        const len = j - i;
        // Prefer the latest run of the same length
        if (len >= bestRunLen) {
          bestRunLen = len;
          bestRunStart = i;
        }
        i = j;
      } else {
        i++;
      }
    }

    if (bestRunLen < 2) continue;

    const runSlice = series.slice(bestRunStart, bestRunStart + bestRunLen);
    const runSum = runSlice.reduce((s, r) => s + r.delta, 0);
    const latestDelta = series[series.length - 1].delta;

    const tk = TICKER_INDEX[ticker];
    const conv = getConviction(ticker);

    const perQuarter = series.map((r, idx) => ({
      ...r,
      inRun: idx >= bestRunStart && idx < bestRunStart + bestRunLen,
    }));

    out.push({
      ticker,
      name: tk?.name ?? ticker,
      sector: tk?.sector,
      runLength: bestRunLen,
      runStart: String(runSlice[0].q),
      runEnd: String(runSlice[runSlice.length - 1].q),
      runSum,
      latestDelta,
      ownerCount: tk?.ownerCount ?? 0,
      convictionScore: conv.score,
      perQuarter,
    });
  }

  out.sort(
    (a, b) =>
      b.runLength - a.runLength ||
      b.runSum - a.runSum ||
      b.convictionScore - a.convictionScore,
  );
  return out;
}

export default function AcceleratorsPage() {
  const all = computeAccelerators();
  const threePlus = all.filter((a) => a.runLength >= 3);
  const twoQ = all.filter((a) => a.runLength === 2);
  const longest = all[0]?.runLength ?? 0;
  const top9 = threePlus.slice(0, 9);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Accelerators · crowd forming
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Where the smart-money crowd is forming — not yet crowded.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        {threePlus.length} tickers where the <span className="text-text font-semibold">entire
        superinvestor fleet</span> has net-added for{" "}
        <span className="text-emerald-400 font-semibold">3 or more consecutive quarters</span>.
        An aggregate-level compounding signal that /crowded-trades (snapshot) and
        /trend-streak (per-manager) both miss.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        Longest run in the window: <span className="text-text font-semibold">{longest}
        quarters</span>. An accelerator is different from a crowded trade — the crowd is still
        forming, and by the time /crowded-trades flags it, the first-movers have already
        been paid.
      </p>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-emerald-400">
            {threePlus.length}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            3Q+ accelerators
          </div>
        </div>
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-brand">{twoQ.length}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            2Q accelerators
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-5">
          <div className="text-3xl font-bold tabular-nums text-text">{longest}Q</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Longest run
          </div>
        </div>
      </div>

      {/* Top cards */}
      {top9.length > 0 && (
        <section className="mb-12">
          <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3">
            Top {top9.length} · longest accelerators
          </div>
          <h2 className="text-2xl font-bold mb-4">The crowd is forming here</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {top9.map((a) => (
              <a
                key={a.ticker}
                href={`/signal/${a.ticker}`}
                className="block rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5 hover:bg-emerald-400/10 transition"
              >
                <div className="flex items-baseline justify-between">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-emerald-400">
                    {a.runLength}Q run
                  </div>
                  <div className="text-sm font-bold tabular-nums text-emerald-400">
                    {formatSignedScore(a.convictionScore)}
                  </div>
                </div>
                <div className="mt-2 text-2xl font-bold text-text">{a.ticker}</div>
                <div className="text-xs text-dim truncate">{a.name}</div>
                <div className="mt-3 text-[11px] text-muted">
                  Net +{a.runSum} owners · {a.ownerCount} holders
                </div>
                <div className="mt-1 text-[10px] text-dim font-mono truncate">
                  {a.runStart} → {a.runEnd}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Full table */}
      <section className="mt-12">
        <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3">
          Full list · {all.length} accelerators (2Q+)
        </div>
        <h2 className="text-2xl font-bold mb-4">Every accelerator, longest run first</h2>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Run</th>
                <th className="px-4 py-3 text-left">Ticker</th>
                <th className="px-4 py-3 text-right">Net +</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Owners</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Window</th>
                <th className="px-4 py-3 text-right">Conviction</th>
              </tr>
            </thead>
            <tbody>
              {/* Capped at top 200 — prior render was ~770 KB uncapped. */}
              {all.slice(0, 200).map((a, i) => (
                <tr
                  key={a.ticker}
                  className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                >
                  <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-bold ${
                        a.runLength >= 3
                          ? "bg-emerald-400/15 text-emerald-400 border border-emerald-400/30"
                          : "bg-brand/15 text-brand border border-brand/30"
                      }`}
                    >
                      {a.runLength}Q ↑
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`/signal/${a.ticker}`}
                      className="font-mono font-semibold text-brand hover:underline"
                    >
                      {a.ticker}
                    </a>
                    <div className="text-[11px] text-dim truncate max-w-[14rem]">
                      {a.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-emerald-400 font-semibold">
                    +{a.runSum}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums hidden md:table-cell text-text">
                    {a.ownerCount}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-[10px] text-muted font-mono whitespace-nowrap">
                    {a.runStart} → {a.runEnd}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-semibold tabular-nums ${
                      a.convictionScore >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {formatSignedScore(a.convictionScore)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AdSlot format="horizontal" />

      {/* Sparkline detail for top 6 */}
      {threePlus.slice(0, 6).length > 0 && (
        <section className="mt-12">
          <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3">
            Per-quarter net delta · top 6
          </div>
          <h2 className="text-2xl font-bold mb-4">See the run form</h2>
          <div className="space-y-3">
            {threePlus.slice(0, 6).map((a) => (
              <div
                key={a.ticker}
                className="rounded-xl border border-border bg-panel p-4"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <div>
                    <a
                      href={`/signal/${a.ticker}`}
                      className="font-bold text-text hover:text-brand text-base"
                    >
                      {a.ticker}
                    </a>
                    <span className="text-[11px] text-dim ml-2">· {a.name}</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold tabular-nums">
                    {a.runLength}Q · +{a.runSum}
                  </div>
                </div>
                <div className="flex gap-1">
                  {a.perQuarter.map((p) => {
                    const cls = p.inRun
                      ? "bg-emerald-400/40 border-emerald-400/70 text-emerald-400"
                      : p.delta > 0
                      ? "bg-emerald-400/10 border-emerald-400/25 text-emerald-400"
                      : p.delta < 0
                      ? "bg-rose-400/10 border-rose-400/25 text-rose-400"
                      : "bg-bg/40 border-border text-dim";
                    return (
                      <div
                        key={p.q}
                        className={`flex-1 rounded border px-2 py-1 text-center text-[10px] font-mono ${cls}`}
                        title={`${QUARTER_LABELS[p.q as Quarter]}: net ${p.delta >= 0 ? "+" : ""}${p.delta}`}
                      >
                        {p.q.slice(2).replace("-", "")}
                        <div className="text-[10px] font-bold tabular-nums">
                          {p.delta >= 0 ? "+" : ""}
                          {p.delta}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Methodology */}
      <section className="mt-12 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          How accelerators are computed
        </div>
        <h2 className="text-xl font-bold mb-3">Aggregate net flow, walked forward</h2>
        <ul className="text-sm text-muted space-y-2 leading-relaxed mb-4">
          <li>
            <span className="text-text font-semibold">1. Per-quarter net delta.</span>{" "}
            For every ticker and every tracked quarter, count smart-money{" "}
            <span className="text-emerald-400">new + add</span> actions and subtract{" "}
            <span className="text-rose-400">trim + exit</span> actions. Positive means the
            fleet net-added that quarter.
          </li>
          <li>
            <span className="text-text font-semibold">2. Longest positive run.</span>{" "}
            Walk the 8-quarter series oldest → newest and find the longest contiguous run
            of strictly positive deltas. Ties break toward the most recent run.
          </li>
          <li>
            <span className="text-text font-semibold">3. Flag 3Q+.</span>{" "}
            Runs of 2 quarters are listed but not emphasized. Runs of 3+ quarters are
            accelerators — distinct from /crowded-trades (ownership snapshot) and
            /trend-streak (per-manager streak).
          </li>
        </ul>
        <p className="text-sm text-muted leading-relaxed">
          The sparkline band in the per-quarter section shades the run itself in solid
          emerald; quarters outside the run are faint. The window runs from 2024-Q1
          through the latest filed quarter.
        </p>
      </section>

      <p className="text-xs text-dim mt-12">
        Not investment advice. 13F filings are delayed 45 days and report long-only
        positions. <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
