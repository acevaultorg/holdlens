import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import { MANAGERS } from "@/lib/managers";
import { getConviction, formatSignedScore } from "@/lib/conviction";

// /concentration — who's most concentrated in their biggest bet?
//
// A 25% concentration in the top position says "I am screaming conviction on
// this one stock". A 4% concentration in the top position says "I'm
// diversified, nothing here is a conviction bet".
//
// Warren Buffett is famously concentrated — 40%+ in Apple at the peak.
// Seth Klarman is famously the opposite — dozens of small positions, each
// hedged. Who else is where?
//
// Dataroma shows individual portfolios but doesn't rank managers by
// concentration. This page does.

export const metadata: Metadata = {
  title: "Portfolio concentration — who's betting the farm on one stock?",
  description:
    "Superinvestors ranked by portfolio concentration: top-1 position size, top-3 triangulated conviction, top-5 concentration slice. Who's all-in vs diversified.",
  alternates: { canonical: "https://holdlens.com/concentration" },
  openGraph: {
    title: "HoldLens concentration — who's all-in vs diversified",
    description: "Managers ranked by top-1/top-3/top-5 portfolio concentration.",
    url: "https://holdlens.com/concentration",
    type: "article",
  },
  robots: { index: true, follow: true },
};

type ConcentrationRow = {
  slug: string;
  name: string;
  fund: string;
  top1Pct: number;
  top1Ticker: string;
  top1Conv: number;
  top3Pct: number;
  top5Pct: number;
  holdings: number;
};

function computeConcentration(): ConcentrationRow[] {
  const out: ConcentrationRow[] = [];
  for (const m of MANAGERS) {
    const holdings = [...m.topHoldings].sort((a, b) => b.pct - a.pct);
    if (holdings.length === 0) continue;
    const top1 = holdings[0];
    const top3Pct = holdings.slice(0, 3).reduce((s, h) => s + h.pct, 0);
    const top5Pct = holdings.slice(0, 5).reduce((s, h) => s + h.pct, 0);
    const top1Conv = getConviction(top1.ticker).score;
    out.push({
      slug: m.slug,
      name: m.name,
      fund: m.fund,
      top1Pct: Math.round(top1.pct * 10) / 10,
      top1Ticker: top1.ticker,
      top1Conv,
      top3Pct: Math.round(top3Pct * 10) / 10,
      top5Pct: Math.round(top5Pct * 10) / 10,
      holdings: holdings.length,
    });
  }
  out.sort((a, b) => b.top1Pct - a.top1Pct);
  return out;
}

export default function ConcentrationPage() {
  const rows = computeConcentration();
  const topConcentrated = rows.slice(0, 3);
  const topDiversified = [...rows].sort((a, b) => a.top1Pct - b.top1Pct).slice(0, 3);

  const avgTop1 = rows.reduce((s, r) => s + r.top1Pct, 0) / Math.max(1, rows.length);
  const avgTop3 = rows.reduce((s, r) => s + r.top3Pct, 0) / Math.max(1, rows.length);
  const avgTop5 = rows.reduce((s, r) => s + r.top5Pct, 0) / Math.max(1, rows.length);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Concentration · who's betting the farm?
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        How concentrated is each superinvestor&rsquo;s biggest bet?
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        {rows.length} managers ranked by <span className="text-brand font-semibold">top-1
        position size</span>. A 25% top-1 is screaming conviction. A 4% top-1 is
        professional diversification.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        Fleet averages: top-1{" "}
        <span className="text-text font-semibold tabular-nums">{avgTop1.toFixed(1)}%</span> ·{" "}
        top-3 <span className="text-text font-semibold tabular-nums">{avgTop3.toFixed(1)}%</span> ·{" "}
        top-5 <span className="text-text font-semibold tabular-nums">{avgTop5.toFixed(1)}%</span>.
      </p>

      {/* Two hero blocks */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Most concentrated */}
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-6">
          <div className="text-[10px] uppercase tracking-widest font-bold text-brand mb-3">
            Most concentrated · screaming conviction
          </div>
          <ol className="space-y-3">
            {topConcentrated.map((r, i) => (
              <li key={r.slug}>
                <a
                  href={`/investor/${r.slug}`}
                  className="flex items-baseline justify-between gap-3 rounded-lg px-3 py-2 hover:bg-bg/40 transition"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-dim tabular-nums w-5 shrink-0">
                        {i + 1}.
                      </span>
                      <span className="font-semibold text-text text-sm truncate">
                        {r.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-dim truncate ml-7">
                      top: {r.top1Ticker}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold tabular-nums text-brand">
                      {r.top1Pct}%
                    </div>
                    <div className="text-[10px] text-dim tabular-nums">top-1</div>
                  </div>
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Most diversified */}
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-6">
          <div className="text-[10px] uppercase tracking-widest font-bold text-emerald-400 mb-3">
            Most diversified · small bets, many names
          </div>
          <ol className="space-y-3">
            {topDiversified.map((r, i) => (
              <li key={r.slug}>
                <a
                  href={`/investor/${r.slug}`}
                  className="flex items-baseline justify-between gap-3 rounded-lg px-3 py-2 hover:bg-bg/40 transition"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-dim tabular-nums w-5 shrink-0">
                        {i + 1}.
                      </span>
                      <span className="font-semibold text-text text-sm truncate">
                        {r.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-dim truncate ml-7">
                      top: {r.top1Ticker}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold tabular-nums text-emerald-400">
                      {r.top1Pct}%
                    </div>
                    <div className="text-[10px] text-dim tabular-nums">top-1</div>
                  </div>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Full table */}
      <section className="mt-12">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Full ranking · all {rows.length} managers
        </div>
        <h2 className="text-2xl font-bold mb-3">
          Top-1 · top-3 · top-5 concentration
        </h2>
        <p className="text-muted text-sm mb-6 max-w-2xl">
          Sorted by top-1 position size. Conviction is the current smart-money
          ConvictionScore on the manager&rsquo;s top-1 holding — are they AND the model
          aligned?
        </p>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Manager</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Top 1</th>
                <th className="px-4 py-3 text-right">Top-1%</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Top-3%</th>
                <th className="px-4 py-3 text-right hidden lg:table-cell">Top-5%</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Top-1 conv</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const tone =
                  r.top1Pct >= 25
                    ? "text-brand font-bold"
                    : r.top1Pct >= 15
                    ? "text-text font-semibold"
                    : "text-muted";
                const convTone =
                  r.top1Conv >= 30
                    ? "text-emerald-400"
                    : r.top1Conv >= 0
                    ? "text-text"
                    : "text-rose-400";
                return (
                  <tr
                    key={r.slug}
                    className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                  >
                    <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`/investor/${r.slug}`}
                        className="font-semibold text-text hover:text-brand transition"
                      >
                        {r.name}
                      </a>
                      <div className="text-[11px] text-dim truncate max-w-[14rem]">
                        {r.fund}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <a
                        href={`/signal/${r.top1Ticker}`}
                        className="text-xs font-semibold text-brand hover:underline"
                      >
                        {r.top1Ticker}
                      </a>
                    </td>
                    <td className={`px-4 py-3 text-right tabular-nums ${tone}`}>
                      {r.top1Pct}%
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-text hidden sm:table-cell">
                      {r.top3Pct}%
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted hidden lg:table-cell">
                      {r.top5Pct}%
                    </td>
                    <td
                      className={`px-4 py-3 text-right tabular-nums font-semibold hidden md:table-cell ${convTone}`}
                    >
                      {formatSignedScore(r.top1Conv)}
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
          How concentration is measured
        </div>
        <h2 className="text-xl font-bold mb-3">Portfolio weight, nothing exotic</h2>
        <p className="text-sm text-muted leading-relaxed mb-3">
          For each manager, we take their top holdings as disclosed in the most recent
          13F filing and compute three metrics:
        </p>
        <ul className="text-sm text-muted space-y-1 mb-4 ml-4">
          <li>
            <span className="text-text font-semibold">Top-1%</span> — the portfolio weight
            of their single largest position
          </li>
          <li>
            <span className="text-text font-semibold">Top-3%</span> — the combined weight
            of their three largest positions
          </li>
          <li>
            <span className="text-text font-semibold">Top-5%</span> — the combined weight
            of their five largest positions
          </li>
        </ul>
        <p className="text-sm text-muted leading-relaxed">
          This is a static snapshot, not a time series. See{" "}
          <a href="/conviction-leaders" className="text-brand hover:underline">
            /conviction-leaders
          </a>{" "}
          for the position-weighted conviction ranking (different question: is the model
          bullish on their concentrated bets?).
        </p>
      </section>

      <p className="text-xs text-dim mt-12">
        Based on publicly filed 13Fs, which report long-only positions. Hedges and shorts
        are invisible. Not investment advice.{" "}
        <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
