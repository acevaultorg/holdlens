"use client";
import { useEffect, useState } from "react";
import { getQuote, fmtPrice, type LiveQuote as LiveQuoteData } from "@/lib/live";

// 52-week range visualizer for the signal dossier. Renders a gradient bar
// from green (52w low) to red (52w high) with a vertical brand-colored needle
// at the current price. Adds a "value tier" label so users can tell at a
// glance whether the stock is cheap relative to its own year. Pairs with the
// /value page which uses the same formula, but rendered inline per-ticker.
//
// SSR-safe — renders a skeleton bar until getQuote returns.

type Props = { symbol: string };

type Tier = {
  label: string;
  color: string;
  bg: string;
  border: string;
  hint: string;
};

function tierFor(pctAboveLow: number): Tier {
  if (pctAboveLow <= 10) {
    return {
      label: "Deep value",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/50",
      hint: "Trading within 10% of its 52-week low.",
    };
  }
  if (pctAboveLow <= 20) {
    return {
      label: "Near low",
      color: "text-emerald-400",
      bg: "bg-emerald-400/5",
      border: "border-emerald-400/30",
      hint: "Closer to the low than the high of its 52w range.",
    };
  }
  if (pctAboveLow <= 35) {
    return {
      label: "Discounted",
      color: "text-text",
      bg: "bg-panel",
      border: "border-border",
      hint: "Moderate discount to recent highs.",
    };
  }
  if (pctAboveLow <= 60) {
    return {
      label: "Mid-range",
      color: "text-muted",
      bg: "bg-panel",
      border: "border-border",
      hint: "Trading in the middle of its 52w range.",
    };
  }
  if (pctAboveLow <= 85) {
    return {
      label: "Near high",
      color: "text-amber-400",
      bg: "bg-amber-400/5",
      border: "border-amber-400/30",
      hint: "Momentum — trading in the upper third of its range.",
    };
  }
  return {
    label: "At highs",
    color: "text-rose-400",
    bg: "bg-rose-400/5",
    border: "border-rose-400/30",
    hint: "Within 15% of the 52-week high. Expensive relative to its own year.",
  };
}

export default function Signal52wRange({ symbol }: Props) {
  const [q, setQ] = useState<LiveQuoteData | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const data = await getQuote(symbol);
      if (cancelled) return;
      if (data) {
        setQ(data);
        setState("ok");
      } else {
        setState("err");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [symbol]);

  if (state === "loading") {
    return (
      <div className="rounded-2xl border border-border bg-panel p-5">
        <div className="h-3 w-32 rounded bg-border/60 animate-pulse mb-4" />
        <div className="h-2 w-full rounded-full bg-border/60 animate-pulse" />
      </div>
    );
  }

  if (state === "err" || !q || !(q.weekHigh52 > q.weekLow52)) {
    // Graceful fallback — live data missing, render nothing visible.
    return null;
  }

  const rangePct = ((q.price - q.weekLow52) / (q.weekHigh52 - q.weekLow52)) * 100;
  const clamped = Math.max(0, Math.min(100, rangePct));
  const pctAboveLow = ((q.price - q.weekLow52) / q.weekLow52) * 100;
  const pctBelowHigh = ((q.weekHigh52 - q.price) / q.weekHigh52) * 100;
  const tier = tierFor(clamped);

  return (
    <div className={`rounded-2xl border ${tier.border} ${tier.bg} p-5`}>
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text">
            52-week range
          </h3>
          <span
            className={`text-[10px] uppercase tracking-wider font-bold ${tier.color} border ${tier.border} rounded px-1.5 py-0.5`}
          >
            {tier.label}
          </span>
        </div>
        <div className={`text-xs ${tier.color} font-semibold tabular-nums`}>
          {clamped.toFixed(0)}% of range
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-dim mb-1.5 tabular-nums">
        <span>
          52w low{" "}
          <span className="text-text font-semibold">
            {fmtPrice(q.weekLow52, q.currency)}
          </span>
        </span>
        <span className="text-text font-semibold">
          {fmtPrice(q.price, q.currency)}
        </span>
        <span>
          52w high{" "}
          <span className="text-text font-semibold">
            {fmtPrice(q.weekHigh52, q.currency)}
          </span>
        </span>
      </div>

      <div className="relative h-2 w-full rounded-full bg-bg overflow-hidden border border-border">
        <div
          className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400"
          style={{ opacity: 0.35 }}
        />
        <div
          className="absolute top-0 h-full w-[3px] bg-brand shadow-lg"
          style={{ left: `calc(${clamped}% - 1.5px)` }}
          aria-label={`Current price is ${clamped.toFixed(0)}% from low to high`}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
        <div>
          <div className="text-[9px] uppercase tracking-wider text-dim font-semibold mb-0.5">
            Above 52w low
          </div>
          <div className="font-bold tabular-nums text-emerald-400">
            +{pctAboveLow.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-wider text-dim font-semibold mb-0.5">
            Below 52w high
          </div>
          <div className="font-bold tabular-nums text-rose-400">
            −{pctBelowHigh.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-wider text-dim font-semibold mb-0.5">
            Verdict
          </div>
          <div className={`font-bold ${tier.color}`}>{tier.label}</div>
        </div>
      </div>

      <p className="mt-3 pt-3 border-t border-border text-[11px] text-dim leading-relaxed">
        {tier.hint}{" "}
        <a href="/value" className="text-brand hover:underline">
          See every smart-money pick near its 52-week low →
        </a>
      </p>
    </div>
  );
}
