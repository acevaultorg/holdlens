import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import FoundersNudge from "@/components/FoundersNudge";
import TickerLogo from "@/components/TickerLogo";
import { MANAGERS } from "@/lib/managers";
import { MERGED_MOVES, QUARTER_LABELS, type Quarter } from "@/lib/moves";
import { MANAGER_QUALITY } from "@/lib/signals";
import { getConviction, formatSignedScore } from "@/lib/conviction";
import { TICKER_INDEX } from "@/lib/tickers";

// /biggest-sells — conviction collapses, ranked.
//
// Mirror of /biggest-buys but on the disposal side. For a trim, the signal
// is the magnitude of the cut (deltaPct). For an exit, the conviction
// reversal is total — we treat those as effective -100% cuts and show
// them alongside the biggest trims. Combined, this page answers:
// "Which positions did smart money just walk away from?"

export const metadata: Metadata = {
  title: "Biggest sells — when smart money walks away",
  description:
    "The largest single exit and trim actions across HoldLens's 8-quarter archive, ranked by magnitude. Where smart money lost conviction.",
  alternates: { canonical: "https://holdlens.com/biggest-sells" },
  openGraph: {
    title: "HoldLens biggest sells — conviction collapses",
    description:
      "8 quarters of the loudest exit trades from 30 tracked superinvestors.",
    url: "https://holdlens.com/biggest-sells",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  robots: { index: true, follow: true },
};

type BigSell = {
  slug: string;
  managerName: string;
  fund: string;
  quality: number;
  quarter: string;
  quarterLabel: string;
  ticker: string;
  name: string;
  action: "trim" | "exit";
  deltaPct: number; // negative: -100 for exits, deltaPct for trims
  remainingPct?: number; // what's left (exits=0, trims=portfolioImpactPct)
  note?: string;
  convictionScore: number;
  sector?: string;
  currentOwnerCount: number;
};

function computeBigSells(): BigSell[] {
  const managerBySlug = new Map(MANAGERS.map((m) => [m.slug, m]));
  const out: BigSell[] = [];

  for (const mv of MERGED_MOVES) {
    if (mv.action !== "trim" && mv.action !== "exit") continue;
    const m = managerBySlug.get(mv.managerSlug);
    if (!m) continue;

    // For trims: skip anything less than a 15% cut — noise floor.
    // For exits: include all, since a full exit is always meaningful.
    if (mv.action === "trim") {
      if (mv.deltaPct == null) continue;
      if (mv.deltaPct > -15) continue; // trim less than 15% is a nibble
    }

    const ticker = mv.ticker.toUpperCase();
    const conv = getConviction(ticker);
    const td = TICKER_INDEX[ticker];
    const effectiveDelta = mv.action === "exit" ? -100 : (mv.deltaPct ?? 0);

    out.push({
      slug: m.slug,
      managerName: m.name,
      fund: m.fund,
      quality: MANAGER_QUALITY[m.slug] ?? 6,
      quarter: mv.quarter,
      quarterLabel: QUARTER_LABELS[mv.quarter as Quarter] ?? mv.quarter,
      ticker,
      name: mv.name || td?.name || ticker,
      action: mv.action,
      deltaPct: effectiveDelta,
      remainingPct: mv.action === "exit" ? 0 : mv.portfolioImpactPct,
      note: mv.note,
      convictionScore: conv.score,
      sector: td?.sector,
      currentOwnerCount: td?.ownerCount ?? 0,
    });
  }

  // Sort: most-negative deltaPct first (biggest cut), tiebreak by manager
  // quality (higher quality = stronger signal), then by remaining book %
  // (bigger remaining position means the trim came off a heavier bet).
  out.sort(
    (a, b) =>
      a.deltaPct - b.deltaPct ||
      b.quality - a.quality ||
      (b.remainingPct ?? 0) - (a.remainingPct ?? 0),
  );
  return out;
}

export default function BiggestSellsPage() {
  const all = computeBigSells();
  const total = all.length;
  const top10 = all.slice(0, 10);
  const exits = all.filter((b) => b.action === "exit").length;
  const deepTrims = all.filter((b) => b.action === "trim" && b.deltaPct <= -40).length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-3">
        Biggest sells · conviction collapses
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        When smart money walked away
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        Across 8 quarters of 13F filings,{" "}
        <span className="text-rose-400 font-semibold">{total}</span> sell actions
        from HoldLens&rsquo;s tracked superinvestors crossed the noise floor.{" "}
        <span className="text-rose-400 font-semibold">{exits}</span> were total
        exits &mdash; conviction reversals.{" "}
        <span className="text-text font-semibold">{deepTrims}</span> trims cut 40%
        or more of the remaining position.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        Dataroma shows current holdings. HoldLens shows the moment a manager
        said <span className="text-text">enough</span> &mdash; which quarter the
        thesis broke, and how hard they hit the exit. Exits are the loudest
        signal a 13F can send.
      </p>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="rounded-2xl border border-rose-400/30 bg-rose-400/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-rose-400">{total}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Big sells &amp; exits
          </div>
        </div>
        <div className="rounded-2xl border border-rose-400/30 bg-rose-400/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-rose-400">{exits}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Full conviction reversals
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-5">
          <div className="text-3xl font-bold tabular-nums text-text">{deepTrims}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Cut 40%+
          </div>
        </div>
      </div>

      {/* Top 10 cards */}
      {top10.length > 0 && (
        <section className="mb-12">
          <div className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-3">
            Top 10 · the loudest exits
          </div>
          <h2 className="text-2xl font-bold mb-4">Walk-away trades, ranked</h2>
          <div className="space-y-4">
            {top10.map((b, i) => (
              <div
                key={`${b.slug}-${b.ticker}-${b.quarter}`}
                className="rounded-2xl border border-rose-400/30 bg-rose-400/5 p-5"
              >
                <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
                  <div className="flex items-baseline gap-3">
                    <div className="text-[10px] uppercase tracking-widest text-rose-400 font-bold">
                      #{i + 1}
                    </div>
                    <a
                      href={`/investor/${b.slug}`}
                      className="text-base font-bold text-text hover:text-brand transition"
                    >
                      {b.managerName}
                    </a>
                    <span className="text-dim text-[11px]">· {b.fund}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      q{b.quality}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3 text-[11px] tabular-nums">
                    {b.slug === "warren-buffett" ? (
                      <span className="text-text">{b.quarterLabel}</span>
                    ) : (
                      <a
                        href={`/investor/${b.slug}/q/${b.quarter.toLowerCase()}`}
                        className="text-text hover:text-brand transition"
                      >
                        {b.quarterLabel}
                      </a>
                    )}
                    <span className="text-dim">·</span>
                    <span className="font-semibold text-rose-400">
                      {b.action === "exit" ? "EXIT" : `TRIM ${b.deltaPct}%`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <a
                    href={`/signal/${b.ticker}`}
                    className="inline-flex items-center gap-2 text-2xl font-mono font-bold text-text hover:text-brand transition"
                  >
                    <TickerLogo symbol={b.ticker} size={28} />
                    {b.ticker}
                  </a>
                  <div className="text-sm text-dim truncate max-w-[18rem]">
                    {b.name}
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-2xl font-bold tabular-nums text-rose-400">
                      {b.deltaPct}%
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-dim">
                      {b.action === "exit" ? "closed" : "cut"}
                    </div>
                  </div>
                </div>
                {b.note && (
                  <p className="text-[11px] text-muted italic mt-2 leading-relaxed">
                    &ldquo;{b.note}&rdquo;
                  </p>
                )}
                <div className="flex items-baseline gap-3 text-[10px] text-dim mt-2 flex-wrap">
                  {b.sector && <span>Sector: {b.sector}</span>}
                  <span>
                    ConvictionScore:{" "}
                    <span
                      className={`font-semibold ${
                        b.convictionScore >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {formatSignedScore(b.convictionScore)}
                    </span>
                  </span>
                  {b.remainingPct != null && b.action === "trim" && (
                    <span>
                      Remaining:{" "}
                      <span className="text-text font-semibold">
                        {b.remainingPct.toFixed(1)}% of book
                      </span>
                    </span>
                  )}
                  {b.currentOwnerCount > 0 && (
                    <span>Still held by {b.currentOwnerCount} managers</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <FoundersNudge tone="rose" context="You're seeing the single biggest conviction collapses — every trim and exit ranked by size." />
      <AdSlot format="horizontal" />

      {/* Full table */}
      {/* Full table — capped at top 200 to keep the HTML page under ~500 KB.
          Previously rendered all 1300+ rows = 3.5 MB of HTML. The long tail is
          still accessible per-quarter via /quarter/[slug] and per-manager via
          /investor/[slug]/q/[quarter]. */}
      <section className="mt-12">
        <div className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-3">
          Full list · top 200 meaningful sells
        </div>
        <h2 className="text-2xl font-bold mb-1">Top 200 big sells, sorted by magnitude</h2>
        <p className="text-xs text-dim mb-4">
          Showing the 200 most significant cuts out of {all.length.toLocaleString("en-US")} total. For the complete
          long tail, drill into <a href="/quarter/2025-q4" className="text-brand hover:underline">/quarter/2025-q4</a> or
          a specific manager's <a href="/investor" className="text-brand hover:underline">investor page</a>.
        </p>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Manager</th>
                <th className="px-4 py-3 text-left">Ticker</th>
                <th className="px-4 py-3 text-left">Quarter</th>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-4 py-3 text-right">Cut</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Conviction</th>
              </tr>
            </thead>
            <tbody>
              {all.slice(0, 200).map((b, i) => (
                <tr
                  key={`${b.slug}-${b.ticker}-${b.quarter}-${i}`}
                  className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                >
                  <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`/investor/${b.slug}`}
                      className="text-xs font-semibold text-text hover:text-brand transition"
                    >
                      {b.managerName}
                    </a>
                    <div className="text-[10px] text-dim truncate max-w-[11rem]">
                      q{b.quality} · {b.fund}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`/signal/${b.ticker}`}
                      className="font-mono font-semibold text-brand hover:underline"
                    >
                      {b.ticker}
                    </a>
                    <div className="text-[10px] text-dim truncate max-w-[10rem]">
                      {b.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-text whitespace-nowrap">
                    {b.slug === "warren-buffett" ? (
                      <span>{b.quarterLabel}</span>
                    ) : (
                      <a
                        href={`/investor/${b.slug}/q/${b.quarter.toLowerCase()}`}
                        className="hover:text-brand transition"
                      >
                        {b.quarterLabel}
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[11px]">
                    <span className="font-semibold text-rose-400">
                      {b.action === "exit" ? "EXIT" : "TRIM"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-rose-400 font-semibold">
                    {b.deltaPct}%
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-semibold tabular-nums hidden md:table-cell ${
                      b.convictionScore >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {formatSignedScore(b.convictionScore)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Methodology */}
      <section className="mt-12 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-2">
          How biggest sells are ranked
        </div>
        <h2 className="text-xl font-bold mb-3">
          Exits treated as -100% cuts, trims ≥15% counted
        </h2>
        <ul className="text-sm text-muted space-y-2 leading-relaxed mb-4">
          <li>
            <span className="text-text font-semibold">1. Action filter.</span>{" "}
            Only <span className="text-text">trim</span> and{" "}
            <span className="text-text">exit</span> actions count. New buys and
            adds live on{" "}
            <a href="/biggest-buys" className="underline">/biggest-buys</a>.
          </li>
          <li>
            <span className="text-text font-semibold">2. Trim floor.</span> Trims
            under 15% are dropped &mdash; tax-lot rebalancing noise. Above 15%
            the manager is actively reducing conviction, not rebalancing.
          </li>
          <li>
            <span className="text-text font-semibold">3. Exits as -100%.</span>{" "}
            A full exit is the loudest possible sell signal, so every exit is
            mapped to a -100% magnitude and bubbles to the top alongside deep
            trims.
          </li>
          <li>
            <span className="text-text font-semibold">4. Ranking.</span>{" "}
            Most-negative magnitude first, tiebroken by manager quality and
            remaining book weight.
          </li>
        </ul>
        <p className="text-sm text-muted leading-relaxed">
          Paired with <a href="/biggest-buys" className="underline">/biggest-buys</a>,
          this gives the complete picture: where capital flowed in, and where it
          bled out. Together they reveal what the smartest managers believe
          right now &mdash; and what they no longer believe.
        </p>
      </section>

      <p className="text-xs text-dim mt-12">
        Not investment advice. deltaPct values are sourced from parsed 13F
        filings.{" "}
        <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
