"use client";
// BacktestProof — the trust-builder.
//
// For each historical quarter, fetches the live chart for every recommended
// ticker (via the Worker proxy), computes the realized return from the filing
// date to today, and displays:
//   - Average realized return per quarter
//   - Hit rate (% of picks that beat S&P 500 over the same period)
//   - Best pick / worst pick
//   - Aggregate "$1k → $X" projection
//
// The honest test: if the model picked stocks that LOST money, this page shows
// it. Trust is built by being right when nobody's looking, not by curating
// after the fact.

import { useEffect, useMemo, useState } from "react";
import { getQuote } from "@/lib/live";
import { computeRealizedReturn, annualizedReturn, type BacktestQuarter } from "@/lib/backtest";
import type { ConvictionScore } from "@/lib/conviction";

type TickerResult = {
  ticker: string;
  name: string;
  conviction: ConvictionScore;
  startPrice: number | null;
  currentPrice: number | null;
  returnPct: number | null;
  daysHeld: number | null;
};

type QuarterResult = {
  quarter: string;
  label: string;
  filedAt: string;
  filedAtEpoch: number;
  rows: TickerResult[];
  spyReturnPct: number | null;
  avgReturnPct: number;
  hitRate: number;
  alphaVsSpy: number;
};

export default function BacktestProof({ quarters }: { quarters: BacktestQuarter[] }) {
  const [results, setResults] = useState<QuarterResult[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ok" | "partial">("loading");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const out: QuarterResult[] = [];
      for (const q of quarters) {
        // Fetch SPY chart once per quarter
        const spyQuote = await getQuote("SPY", "2y");
        const spyReturn =
          spyQuote && spyQuote.chart.length > 0
            ? computeRealizedReturn(spyQuote.chart, q.filedAtEpoch)
            : null;

        const rows: TickerResult[] = [];
        for (const c of q.topBuys) {
          const quote = await getQuote(c.ticker, "2y");
          if (cancelled) return;
          if (!quote) {
            rows.push({
              ticker: c.ticker,
              name: c.name,
              conviction: c,
              startPrice: null,
              currentPrice: null,
              returnPct: null,
              daysHeld: null,
            });
            continue;
          }
          const realized = computeRealizedReturn(quote.chart, q.filedAtEpoch);
          rows.push({
            ticker: c.ticker,
            name: c.name,
            conviction: c,
            startPrice: realized?.startPrice ?? null,
            currentPrice: quote.price,
            returnPct: realized?.returnPct ?? null,
            daysHeld: realized?.daysHeld ?? null,
          });
        }

        const validReturns = rows.filter((r) => r.returnPct != null);
        const avgReturnPct =
          validReturns.length > 0
            ? validReturns.reduce((s, r) => s + (r.returnPct as number), 0) / validReturns.length
            : 0;
        const spyPct = spyReturn?.returnPct ?? null;
        const hits =
          spyPct != null
            ? validReturns.filter((r) => (r.returnPct as number) > spyPct).length
            : 0;
        const hitRate = validReturns.length > 0 ? hits / validReturns.length : 0;
        const alphaVsSpy = spyPct != null ? avgReturnPct - spyPct : 0;

        out.push({
          quarter: q.quarter,
          label: q.label,
          filedAt: q.filedAt,
          filedAtEpoch: q.filedAtEpoch,
          rows,
          spyReturnPct: spyPct,
          avgReturnPct,
          hitRate,
          alphaVsSpy,
        });
      }
      if (cancelled) return;
      setResults(out);
      const anyMissing = out.some((q) => q.rows.some((r) => r.returnPct == null));
      setLoadState(anyMissing ? "partial" : "ok");
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [quarters]);

  // Aggregate hero stats
  const aggregate = useMemo(() => {
    if (results.length === 0) return null;
    const allValid = results.flatMap((q) => q.rows.filter((r) => r.returnPct != null));
    if (allValid.length === 0) return null;
    const avgReturn = allValid.reduce((s, r) => s + (r.returnPct as number), 0) / allValid.length;
    const avgDays = allValid.reduce((s, r) => s + (r.daysHeld as number), 0) / allValid.length;
    const annualized = annualizedReturn(avgReturn, avgDays);

    // SPY aggregate from per-quarter returns
    const spyValid = results.filter((q) => q.spyReturnPct != null);
    const avgSpy =
      spyValid.length > 0
        ? spyValid.reduce((s, q) => s + (q.spyReturnPct as number), 0) / spyValid.length
        : 0;
    const alpha = avgReturn - avgSpy;

    // Hit rate
    const hitsCount = results.reduce((s, q) => {
      const sp = q.spyReturnPct ?? 0;
      return s + q.rows.filter((r) => r.returnPct != null && (r.returnPct as number) > sp).length;
    }, 0);
    const hitRate = allValid.length > 0 ? hitsCount / allValid.length : 0;

    // Best / worst
    const sortedByReturn = [...allValid].sort((a, b) => (b.returnPct as number) - (a.returnPct as number));
    const best = sortedByReturn[0];
    const worst = sortedByReturn[sortedByReturn.length - 1];

    // $1k projection — applied across all picks equal-weighted
    const oneKResult = 1000 * (1 + avgReturn / 100);

    return {
      avgReturn,
      avgSpy,
      alpha,
      annualized,
      hitRate,
      best,
      worst,
      oneKResult,
      pickCount: allValid.length,
    };
  }, [results]);

  if (loadState === "loading" || !aggregate) {
    return (
      <div className="rounded-2xl border border-border bg-panel p-10 text-center">
        <div className="inline-block h-8 w-8 animate-pulse rounded-full bg-brand/30" />
        <div className="text-sm text-dim mt-4">Loading realized returns from Yahoo Finance...</div>
        <div className="text-[11px] text-dim mt-1">Computing how each historical pick has performed since its filing date</div>
      </div>
    );
  }

  const beatsSpy = aggregate.alpha >= 0;

  return (
    <div className="space-y-8">
      {/* Hero result card */}
      <div className={`rounded-2xl border p-8 ${beatsSpy ? "border-emerald-400/40 bg-emerald-400/5" : "border-rose-400/40 bg-rose-400/5"}`}>
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Recommender backtest · realized
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          {beatsSpy ? "✅" : "❌"} The model{" "}
          <span className={beatsSpy ? "text-emerald-400" : "text-rose-400"}>
            {beatsSpy ? "beat" : "lagged"}
          </span>{" "}
          the S&P
        </h2>
        <p className="text-muted text-base mb-6 max-w-2xl">
          If you'd bought every BUY signal HoldLens recommended at each historical 13F filing date
          in equal weight (up to 5 per quarter, filtered to only scores ≥30), here's what your
          portfolio would look like today.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat
            label="Avg realized return"
            value={`${aggregate.avgReturn >= 0 ? "+" : ""}${aggregate.avgReturn.toFixed(1)}%`}
            color={aggregate.avgReturn >= 0 ? "emerald" : "rose"}
          />
          <Stat
            label="S&P 500 over same"
            value={`${aggregate.avgSpy >= 0 ? "+" : ""}${aggregate.avgSpy.toFixed(1)}%`}
            color="muted"
          />
          <Stat
            label="Alpha"
            value={`${aggregate.alpha >= 0 ? "+" : ""}${aggregate.alpha.toFixed(1)}%`}
            color={aggregate.alpha >= 0 ? "emerald" : "rose"}
            big
          />
          <Stat
            label="Hit rate"
            value={`${(aggregate.hitRate * 100).toFixed(0)}%`}
            color={aggregate.hitRate >= 0.5 ? "emerald" : "rose"}
          />
        </div>

        {/* $1k projection */}
        <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">If you'd invested $1,000</div>
            <div className="text-2xl font-bold tabular-nums mt-1">
              ${aggregate.oneKResult.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </div>
            <div className="text-[11px] text-dim mt-0.5">across {aggregate.pickCount} picks, equal-weight</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">Annualized return</div>
            <div className={`text-2xl font-bold tabular-nums mt-1 ${aggregate.annualized >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {aggregate.annualized >= 0 ? "+" : ""}
              {aggregate.annualized.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">Best vs worst pick</div>
            <div className="text-sm font-bold tabular-nums mt-1">
              <span className="text-emerald-400">+{aggregate.best?.returnPct?.toFixed(0)}% {aggregate.best?.ticker}</span>
              <span className="text-dim"> · </span>
              <span className="text-rose-400">{aggregate.worst?.returnPct?.toFixed(0)}% {aggregate.worst?.ticker}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Per-quarter breakdown */}
      {results.map((q) => (
        <div key={q.quarter} className="rounded-2xl border border-border bg-panel overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-baseline justify-between gap-4 flex-wrap">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-brand font-semibold">
                As of {q.label}
              </div>
              <div className="text-xs text-muted mt-0.5">
                Filed {q.filedAt} · model knew only data ≤ this quarter
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-dim">Quarter alpha</div>
              <div className={`text-2xl font-bold tabular-nums ${q.alphaVsSpy >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {q.alphaVsSpy >= 0 ? "+" : ""}
                {q.alphaVsSpy.toFixed(1)}%
              </div>
              <div className="text-[10px] text-dim">
                vs S&P {q.spyReturnPct != null ? `${q.spyReturnPct >= 0 ? "+" : ""}${q.spyReturnPct.toFixed(1)}%` : "—"}
              </div>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead className="text-dim text-[10px] uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3">Ticker</th>
                <th className="text-right px-5 py-3 hidden md:table-cell">Score at quarter</th>
                <th className="text-right px-5 py-3 hidden md:table-cell">Start price</th>
                <th className="text-right px-5 py-3 hidden md:table-cell">Current</th>
                <th className="text-right px-5 py-3">Realized</th>
              </tr>
            </thead>
            <tbody>
              {q.rows.map((r) => {
                const beats = r.returnPct != null && q.spyReturnPct != null && r.returnPct > q.spyReturnPct;
                return (
                  <tr key={r.ticker} className="border-b border-border last:border-0">
                    <td className="px-5 py-3">
                      <a href={`/signal/${r.ticker}`} className="font-mono font-bold text-brand hover:underline">
                        {r.ticker}
                      </a>
                      <div className="text-[11px] text-dim">{r.name}</div>
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-muted hidden md:table-cell">
                      {r.conviction.score}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-muted hidden md:table-cell">
                      {r.startPrice != null ? `$${r.startPrice.toFixed(2)}` : "—"}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-text hidden md:table-cell">
                      {r.currentPrice != null ? `$${r.currentPrice.toFixed(2)}` : "—"}
                    </td>
                    <td className={`px-5 py-3 text-right tabular-nums font-bold ${
                      r.returnPct == null ? "text-dim" :
                      r.returnPct >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}>
                      {r.returnPct != null
                        ? `${r.returnPct >= 0 ? "+" : ""}${r.returnPct.toFixed(1)}%`
                        : "—"}
                      {beats && <span className="ml-1 text-[10px] text-emerald-400/80">★</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}

      {loadState === "partial" && (
        <p className="text-xs text-dim text-center">
          Some realized returns are missing — Yahoo data wasn&apos;t available for that ticker/date combination.
          The aggregate above only counts picks with complete data.
        </p>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  color,
  big,
}: {
  label: string;
  value: string;
  color: "emerald" | "rose" | "muted";
  big?: boolean;
}) {
  const colorClass =
    color === "emerald" ? "text-emerald-400" : color === "rose" ? "text-rose-400" : "text-muted";
  const sizeClass = big ? "text-3xl md:text-4xl" : "text-2xl";
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">{label}</div>
      <div className={`${sizeClass} font-bold tabular-nums mt-1 ${colorClass}`}>{value}</div>
    </div>
  );
}
