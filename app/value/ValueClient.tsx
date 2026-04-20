"use client";

// The killer combo: smart-money BUY signals that are ALSO near their 52-week low.
// This is the single most-requested Dataroma feature that Dataroma doesn't provide:
// "What are the best investors buying that also happens to be cheap right now?"
//
// Pre-computed list (buy candidates by conviction score) comes from the server.
// Quotes + 52w-low filter run client-side so we get fresh live prices.

import { useEffect, useMemo, useState } from "react";
import LiveQuote from "@/components/LiveQuote";
import SinceFilingDelta from "@/components/SinceFilingDelta";
import CsvExportButton from "@/components/CsvExportButton";
import { getQuotes, type LiveQuote as LiveQuoteData } from "@/lib/live";
import { LATEST_QUARTER, QUARTER_FILED } from "@/lib/moves-types";

export type ValueCandidate = {
  ticker: string;
  name: string;
  sector?: string;
  score: number;
  buyerCount: number;
  sellerCount: number;
  ownerCount: number;
  expectedReturnPct: number | null;
  topBuyers: { slug: string; name: string; cagr: number; positionPct: number }[];
};

type Threshold = 15 | 25 | 40 | 100;

function pctAbove52wLow(q: LiveQuoteData | null | undefined): number | null {
  if (!q || !q.weekLow52 || q.weekLow52 <= 0) return null;
  return ((q.price - q.weekLow52) / q.weekLow52) * 100;
}

function pctBelow52wHigh(q: LiveQuoteData | null | undefined): number | null {
  if (!q || !q.weekHigh52 || q.weekHigh52 <= 0) return null;
  return ((q.weekHigh52 - q.price) / q.weekHigh52) * 100;
}

export default function ValueClient({ candidates }: { candidates: ValueCandidate[] }) {
  const [threshold, setThreshold] = useState<Threshold>(25);
  const [quotes, setQuotes] = useState<Record<string, LiveQuoteData | null>>({});
  const [loading, setLoading] = useState(true);

  // Fetch quotes for the full candidate list on mount (and refresh every 60s).
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const syms = candidates.map((c) => c.ticker);
      const q = await getQuotes(syms, "1y");
      if (!cancelled) {
        setQuotes(q);
        setLoading(false);
      }
    }
    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [candidates]);

  // Join candidates with live quotes, filter by threshold, sort by a blended
  // value score: score * (1 - pct/100) — higher conviction AND closer to low wins.
  const rows = useMemo(() => {
    const joined = candidates
      .map((c) => {
        const q = quotes[c.ticker.toUpperCase()];
        const pctLow = pctAbove52wLow(q);
        const pctHigh = pctBelow52wHigh(q);
        return { c, q, pctLow, pctHigh };
      })
      .filter((r) => r.pctLow != null && r.pctLow <= threshold);

    // Blend: conviction × discount. score is 0..100; discount is 0..1.
    // Closer to 52w low → bigger discount → larger blended number.
    joined.sort((a, b) => {
      const ap = a.pctLow ?? 0;
      const bp = b.pctLow ?? 0;
      const aBlend = a.c.score * (1 - ap / (threshold + 5));
      const bBlend = b.c.score * (1 - bp / (threshold + 5));
      return bBlend - aBlend;
    });

    return joined;
  }, [candidates, quotes, threshold]);

  const quoted = Object.keys(quotes).length;

  return (
    <>
      {/* Threshold segmented control */}
      <div className="rounded-2xl border border-border bg-panel p-5 mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mb-1.5">
              52-week low proximity
            </div>
            <div className="text-sm text-muted">
              Show buy signals trading{" "}
              <span className="text-text font-semibold">≤{threshold}%</span> above their 52-week low.
            </div>
          </div>
          <div className="flex gap-1">
            {([15, 25, 40, 100] as Threshold[]).map((t) => (
              <button
                key={t}
                onClick={() => setThreshold(t)}
                className={`text-xs font-semibold px-3 py-2 rounded-md transition ${
                  t === threshold
                    ? "bg-brand text-black"
                    : "text-muted border border-border hover:border-brand/40"
                }`}
                aria-pressed={t === threshold}
              >
                {t === 100 ? "All buys" : `≤${t}%`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results summary + CSV export */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="text-sm text-muted">
          {loading ? (
            <span className="text-dim">Loading live prices…</span>
          ) : (
            <>
              <span className="text-text font-semibold">{rows.length}</span> value opportunit
              {rows.length === 1 ? "y" : "ies"} of {candidates.length} buy candidates
              {quoted < candidates.length && (
                <span className="text-dim"> · {quoted}/{candidates.length} priced</span>
              )}
            </>
          )}
        </div>
        {rows.length > 0 && (
          <CsvExportButton
            filename="holdlens-value-signals.csv"
            label="Download CSV"
            rows={rows.map((r, i) => ({
              rank: i + 1,
              ticker: r.c.ticker,
              name: r.c.name,
              sector: r.c.sector || "",
              conviction_score: r.c.score,
              buyers: r.c.buyerCount,
              sellers: r.c.sellerCount,
              owners: r.c.ownerCount,
              expected_return_pct: r.c.expectedReturnPct ?? "",
              price: r.q?.price.toFixed(2) ?? "",
              pct_above_52w_low: r.pctLow != null ? r.pctLow.toFixed(1) : "",
              pct_below_52w_high: r.pctHigh != null ? r.pctHigh.toFixed(1) : "",
              week_52_low: r.q?.weekLow52.toFixed(2) ?? "",
              week_52_high: r.q?.weekHigh52.toFixed(2) ?? "",
            }))}
          />
        )}
      </div>

      {/* Results list */}
      {loading ? (
        <div className="rounded-2xl border border-border bg-panel p-10 text-center text-dim">
          Fetching live prices for {candidates.length} buy candidates…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel p-10 text-center text-muted">
          <div className="text-lg font-semibold text-text mb-2">
            Nothing qualifies at ≤{threshold}% above 52-week low.
          </div>
          <div className="text-sm text-dim">
            Loosen the threshold — the smart money isn&apos;t buying anything deeply discounted right now.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r, i) => {
            const pct = r.pctLow ?? 0;
            // Gradient bar showing where price sits in the 52w range.
            const rangePct = r.q && r.q.weekHigh52 > r.q.weekLow52
              ? ((r.q.price - r.q.weekLow52) / (r.q.weekHigh52 - r.q.weekLow52)) * 100
              : 0;
            const valueTier =
              pct <= 10
                ? { label: "Deep value", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/50" }
                : pct <= 20
                ? { label: "Near low", color: "text-emerald-400", bg: "bg-emerald-400/5", border: "border-emerald-400/30" }
                : pct <= 35
                ? { label: "Discounted", color: "text-text", bg: "bg-panel", border: "border-border" }
                : { label: "Above low", color: "text-muted", bg: "bg-panel", border: "border-border" };

            return (
              <a
                key={r.c.ticker}
                href={`/signal/${r.c.ticker}`}
                className={`block rounded-2xl border ${valueTier.border} ${valueTier.bg} p-5 transition group hover:border-brand`}
              >
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="text-3xl font-bold text-dim tabular-nums w-10 shrink-0">
                    {i + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <div className="font-mono text-2xl font-bold text-brand group-hover:underline">
                        {r.c.ticker}
                      </div>
                      <div className="text-text">{r.c.name}</div>
                      {r.c.sector && (
                        <span className="text-[10px] uppercase tracking-wider text-dim border border-border rounded px-1.5 py-0.5">
                          {r.c.sector}
                        </span>
                      )}
                      <span
                        className={`text-[10px] uppercase tracking-wider font-bold ${valueTier.color} border ${valueTier.border} rounded px-1.5 py-0.5`}
                      >
                        {valueTier.label}
                      </span>
                    </div>
                    <div className="text-xs text-muted">
                      <LiveQuote symbol={r.c.ticker} size="sm" refreshMs={0} />
                      <SinceFilingDelta
                        ticker={r.c.ticker}
                        filedAt={QUARTER_FILED[LATEST_QUARTER]}
                        leadingSeparator
                      />
                      <span className="mx-2 text-dim">·</span>
                      {r.c.buyerCount} buying
                      {r.c.sellerCount > 0 && (
                        <span className="text-rose-400/80"> · {r.c.sellerCount} selling</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold tabular-nums text-emerald-400">
                      +{r.c.score}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">
                      Conviction
                    </div>
                  </div>
                </div>

                {/* 52-week range visualizer */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-[10px] text-dim mb-1.5">
                    <span>52w low {r.q ? `$${r.q.weekLow52.toFixed(2)}` : ""}</span>
                    <span className={valueTier.color}>
                      +{pct.toFixed(0)}% above low
                    </span>
                    <span>52w high {r.q ? `$${r.q.weekHigh52.toFixed(2)}` : ""}</span>
                  </div>
                  <div className="relative h-1.5 w-full rounded-full bg-bg overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400"
                      style={{ width: "100%", opacity: 0.25 }}
                    />
                    <div
                      className="absolute top-0 h-full w-1 bg-brand shadow-lg"
                      style={{ left: `${Math.max(0, Math.min(100, rangePct))}%` }}
                      aria-label={`Price is ${rangePct.toFixed(0)}% of the way from low to high`}
                    />
                  </div>
                </div>

                {/* Expected return + top buyers */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  {r.c.expectedReturnPct != null && (
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-dim font-semibold mb-0.5">
                        Expected return
                      </div>
                      <div className="font-bold tabular-nums text-emerald-400">
                        +{r.c.expectedReturnPct}%/yr
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-dim font-semibold mb-0.5">
                      Discount to high
                    </div>
                    <div className="font-bold tabular-nums text-text">
                      {r.pctHigh != null ? `−${r.pctHigh.toFixed(0)}%` : "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-dim font-semibold mb-0.5">
                      Total owners
                    </div>
                    <div className="font-bold tabular-nums text-text">{r.c.ownerCount}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-dim font-semibold mb-0.5">
                      Value score
                    </div>
                    <div className="font-bold tabular-nums text-brand">
                      {Math.round(r.c.score * (1 - pct / (threshold + 5)))}
                    </div>
                  </div>
                </div>

                {/* Top buyers */}
                {r.c.topBuyers.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {r.c.topBuyers.map((b) => (
                      <span
                        key={b.slug}
                        className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border border-border bg-bg/40 text-muted"
                      >
                        <span className="text-text font-semibold">
                          {b.name.split(" ").slice(-1)[0]}
                        </span>
                        <span className="text-dim tabular-nums">{b.cagr.toFixed(0)}% CAGR</span>
                      </span>
                    ))}
                  </div>
                )}
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}
