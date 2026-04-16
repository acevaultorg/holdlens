import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import TickerLogo from "@/components/TickerLogo";
import { MANAGERS } from "@/lib/managers";
import { MERGED_MOVES, QUARTERS, QUARTER_LABELS, type Quarter } from "@/lib/moves";
import { MANAGER_QUALITY } from "@/lib/signals";
import { getConviction, formatSignedScore } from "@/lib/conviction";

// /reversals — when a manager changes their mind.
//
// Three patterns across the 8-quarter archive:
//   1. WHIPSAW — "new" then "exit" within the window. The thesis broke.
//   2. COMEBACK — "exit" then "new" within the window. Thesis repaired or
//                 a second bite of a name they already know.
//   3. FLIP-FLOP — "new" and "exit" both appear multiple times.
//
// Comebacks are the rarest and most interesting. An experienced manager
// walking back an exit is a very loud signal about a name — they already
// had the thesis, they sold it, and now they're back for round two.

export const metadata: Metadata = {
  title: "Reversals — when smart money changes its mind",
  description:
    "Across HoldLens's 8-quarter archive, the superinvestors who exited a name and then came back — and the ones whose thesis broke. Rare and newsworthy.",
  alternates: { canonical: "https://holdlens.com/reversals" },
  openGraph: {
    title: "HoldLens reversals — when smart money changes its mind",
    description:
      "Exit then re-entry. New then exit. The patterns that reveal real conviction.",
    url: "https://holdlens.com/reversals",
    type: "article",
  },
  robots: { index: true, follow: true },
};

const CHRONO: readonly Quarter[] = [...QUARTERS].reverse();
const QINDEX: Record<string, number> = Object.fromEntries(
  CHRONO.map((q, i) => [q, i]),
);

type Reversal = {
  slug: string;
  managerName: string;
  fund: string;
  quality: number;
  ticker: string;
  name: string;
  pattern: "comeback" | "whipsaw";
  events: { quarter: string; action: string; impact?: number }[];
  firstQuarter: string;
  lastQuarter: string;
  gapQuarters: number;
  convictionScore: number;
};

function computeReversals(): Reversal[] {
  const managerBySlug = new Map(MANAGERS.map((m) => [m.slug, m]));
  // (slug → ticker → chronological events)
  const buckets = new Map<
    string,
    Map<string, { quarter: string; action: string; impact?: number; name?: string }[]>
  >();

  for (const mv of MERGED_MOVES) {
    if (mv.action !== "new" && mv.action !== "exit") continue;
    if (!buckets.has(mv.managerSlug)) {
      buckets.set(mv.managerSlug, new Map());
    }
    const mgrMap = buckets.get(mv.managerSlug)!;
    const key = mv.ticker.toUpperCase();
    if (!mgrMap.has(key)) mgrMap.set(key, []);
    mgrMap.get(key)!.push({
      quarter: mv.quarter,
      action: mv.action,
      impact: mv.portfolioImpactPct,
      name: mv.name,
    });
  }

  const out: Reversal[] = [];
  for (const [slug, mgrMap] of buckets) {
    const m = managerBySlug.get(slug);
    if (!m) continue;
    const quality = MANAGER_QUALITY[slug] ?? 6;

    for (const [ticker, events] of mgrMap) {
      // Sort chronologically (QINDEX ascending = oldest first)
      events.sort((a, b) => (QINDEX[a.quarter] ?? 99) - (QINDEX[b.quarter] ?? 99));
      if (events.length < 2) continue;

      // Detect pattern
      const actionSeq = events.map((e) => e.action[0]).join(""); // "ne", "en", "nen", etc.
      let pattern: "comeback" | "whipsaw" | null = null;
      if (actionSeq.startsWith("e") && actionSeq.includes("n")) pattern = "comeback";
      else if (actionSeq.startsWith("n") && actionSeq.includes("e")) pattern = "whipsaw";
      if (!pattern) continue;

      const firstQ = events[0].quarter;
      const lastQ = events[events.length - 1].quarter;
      const gapQuarters = (QINDEX[lastQ] ?? 0) - (QINDEX[firstQ] ?? 0);
      const conv = getConviction(ticker);

      out.push({
        slug,
        managerName: m.name,
        fund: m.fund,
        quality,
        ticker,
        name: events[0].name || ticker,
        pattern,
        events: events.map((e) => ({
          quarter: QUARTER_LABELS[e.quarter as Quarter] ?? e.quarter,
          action: e.action,
          impact: e.impact,
        })),
        firstQuarter: firstQ,
        lastQuarter: lastQ,
        gapQuarters,
        convictionScore: conv.score,
      });
    }
  }

  out.sort((a, b) => {
    // Comebacks first (rarer)
    if (a.pattern !== b.pattern) return a.pattern === "comeback" ? -1 : 1;
    return b.gapQuarters - a.gapQuarters || b.quality - a.quality;
  });
  return out;
}

export default function ReversalsPage() {
  const all = computeReversals();
  const comebacks = all.filter((r) => r.pattern === "comeback");
  const whipsaws = all.filter((r) => r.pattern === "whipsaw");

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Reversals · when smart money changes its mind
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Who changed their mind?
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        Across HoldLens&rsquo;s 8-quarter archive,{" "}
        <span className="text-emerald-400 font-semibold">{comebacks.length}</span>{" "}
        reversals are <span className="text-text">comebacks</span> &mdash; the manager
        exited the name and then opened a fresh position later.{" "}
        <span className="text-rose-400 font-semibold">{whipsaws.length}</span> are{" "}
        <span className="text-text">whipsaws</span> &mdash; the thesis broke within
        a few quarters of the entry.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        Dataroma doesn&rsquo;t mark either. HoldLens keeps the action history, so a
        manager walking BACK an exit is visible as what it is: the second-hardest
        decision in professional investing, after the first entry. Comebacks are
        rare and loud.
      </p>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-emerald-400">
            {comebacks.length}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Comebacks (exit → new)
          </div>
        </div>
        <div className="rounded-2xl border border-rose-400/30 bg-rose-400/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-rose-400">
            {whipsaws.length}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Whipsaws (new → exit)
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-5">
          <div className="text-3xl font-bold tabular-nums text-text">
            {all.length}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Total reversals
          </div>
        </div>
      </div>

      {/* Comebacks */}
      {comebacks.length > 0 ? (
        <section className="mb-16">
          <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3">
            Comebacks · second bite
          </div>
          <h2 className="text-2xl font-bold mb-4">They sold it. Then they bought it back.</h2>
          <p className="text-sm text-muted mb-5">
            The rarest pattern. An experienced manager returning to a name they already
            walked away from is admitting the first exit was wrong &mdash; or spotting a
            setup that matured. Either way, it&rsquo;s a conviction signal.
          </p>
          <div className="space-y-4">
            {/* Capped at top 50 comebacks — keeps HTML under ~300 KB. */}
            {comebacks.slice(0, 50).map((r, i) => (
              <div
                key={`${r.slug}-${r.ticker}-cb`}
                className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5"
              >
                <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
                  <div className="flex items-baseline gap-3">
                    <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                      #{i + 1}
                    </div>
                    <a
                      href={`/investor/${r.slug}`}
                      className="text-base font-bold text-text hover:text-emerald-400 transition"
                    >
                      {r.managerName}
                    </a>
                    <span className="text-dim text-[11px]">· {r.fund}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      q{r.quality}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3 text-[11px] tabular-nums">
                    <span className="text-text">{r.gapQuarters}Q gap</span>
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
                <div className="flex items-center gap-3 mb-3">
                  <a
                    href={`/signal/${r.ticker}`}
                    className="inline-flex items-center gap-2 text-xl font-mono font-bold text-text hover:text-emerald-400 transition"
                  >
                    <TickerLogo symbol={r.ticker} size={26} />
                    {r.ticker}
                  </a>
                  <div className="text-sm text-dim truncate max-w-[18rem]">{r.name}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {r.events.map((e, j) => (
                    <span
                      key={j}
                      className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 text-[10px] ${
                        e.action === "new"
                          ? "border-emerald-400/30 bg-emerald-400/5 text-emerald-400"
                          : "border-rose-400/30 bg-rose-400/5 text-rose-400"
                      }`}
                    >
                      <span className="font-semibold uppercase">{e.action}</span>
                      <span className="text-dim">· {e.quarter}</span>
                      {e.impact != null && (
                        <span className="text-text">· {e.impact.toFixed(1)}% book</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mb-16 rounded-2xl border border-border bg-panel p-8 text-center">
          <p className="text-muted">
            No comebacks detected in the current 8-quarter archive. The pattern is
            very rare &mdash; most managers walk away for good.
          </p>
        </section>
      )}

      <AdSlot format="horizontal" />

      {/* Whipsaws */}
      {whipsaws.length > 0 && (
        <section className="mt-12">
          <div className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-3">
            Whipsaws · thesis broke
          </div>
          <h2 className="text-2xl font-bold mb-4">They bought it. Then they walked.</h2>
          <p className="text-sm text-muted mb-5">
            Every professional investor gets these occasionally. The thesis
            didn&rsquo;t pan out and the discipline to cut the position is the
            job. Worth reading as a reminder that even the best superinvestors
            change their minds.
          </p>
          <div className="rounded-2xl border border-border bg-panel overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-bg/40 border-b border-border">
                <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Manager</th>
                  <th className="px-4 py-3 text-left">Ticker</th>
                  <th className="px-4 py-3 text-left">Entered</th>
                  <th className="px-4 py-3 text-left">Exited</th>
                  <th className="px-4 py-3 text-right">Held</th>
                  <th className="px-4 py-3 text-right hidden md:table-cell">Conviction</th>
                </tr>
              </thead>
              <tbody>
                {/* Capped at top 150 whipsaws — the unbounded map was the main bloat source. */}
                {whipsaws.slice(0, 150).map((r, i) => (
                  <tr
                    key={`${r.slug}-${r.ticker}-w`}
                    className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                  >
                    <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`/investor/${r.slug}`}
                        className="text-xs font-semibold text-text hover:text-brand transition"
                      >
                        {r.managerName}
                      </a>
                      <div className="text-[10px] text-dim truncate max-w-[11rem]">
                        q{r.quality} · {r.fund}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`/signal/${r.ticker}`}
                        className="font-mono font-semibold text-brand hover:underline"
                      >
                        {r.ticker}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-emerald-400 whitespace-nowrap">
                      {r.events[0]?.quarter}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-rose-400 whitespace-nowrap">
                      {r.events[r.events.length - 1]?.quarter}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-text">
                      {r.gapQuarters}Q
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
        </section>
      )}

      {/* Methodology */}
      <section className="mt-16 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          How reversals are detected
        </div>
        <h2 className="text-xl font-bold mb-3">new/exit action sequence, same manager × ticker</h2>
        <ul className="text-sm text-muted space-y-2 leading-relaxed mb-4">
          <li>
            <span className="text-text font-semibold">1. Action filter.</span>{" "}
            Only <span className="text-text">new</span> and{" "}
            <span className="text-text">exit</span> actions. Adds and trims
            don&rsquo;t count &mdash; a true reversal is going to zero and back.
          </li>
          <li>
            <span className="text-emerald-400 font-semibold">2. Comeback.</span>{" "}
            The first event is an exit and a later event is a new. The manager
            sold it completely, then later opened a fresh position in the same
            name. Rarest pattern in the archive.
          </li>
          <li>
            <span className="text-rose-400 font-semibold">3. Whipsaw.</span>{" "}
            The first event is a new and a later event is an exit. The manager
            opened the position and then walked within the 8-quarter window.
          </li>
          <li>
            <span className="text-text font-semibold">4. Gap quarters.</span>{" "}
            Distance between the first and last event in the sequence. Larger
            gap = more distance between the two decisions.
          </li>
        </ul>
        <p className="text-sm text-muted leading-relaxed">
          The archive only covers 8 quarters &mdash; reversals that span longer
          windows are not visible yet. As more quarters land, the comeback count
          will grow.
        </p>
      </section>

      <p className="text-xs text-dim mt-12">
        Not investment advice. Reversal detection is limited by archive coverage.{" "}
        <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
