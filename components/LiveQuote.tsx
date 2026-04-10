"use client";
import { useEffect, useState } from "react";
import { getQuote, fmtPrice, fmtPct, fmtMarketCap, type LiveQuote as LiveQuoteData } from "@/lib/live";

type Size = "sm" | "md" | "lg" | "xl";

type Props = {
  symbol: string;
  size?: Size;
  /** Show 52w range, market cap, exchange. Default: false for inline, true for xl. */
  expanded?: boolean;
  /** Refresh interval in ms. Default 60000. Set 0 to disable. */
  refreshMs?: number;
};

export default function LiveQuote({ symbol, size = "md", expanded, refreshMs = 60000 }: Props) {
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
      } else if (!q) {
        setState("err");
      }
    }

    load();
    if (refreshMs > 0) {
      const id = setInterval(load, refreshMs);
      return () => {
        cancelled = true;
        clearInterval(id);
      };
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, refreshMs]);

  const isXl = size === "xl" || expanded;

  if (state === "loading") {
    return <span className={skeletonClass(size)} aria-label={`loading ${symbol}`} />;
  }

  if (state === "err" || !q) {
    return <span className={textClass(size)}>—</span>;
  }

  const up = q.dayChange >= 0;
  const color = up ? "text-emerald-400" : "text-rose-400";

  if (isXl) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline gap-3 flex-wrap">
          <div className="text-4xl md:text-5xl font-bold tabular-nums tracking-tight">
            {fmtPrice(q.price, q.currency)}
          </div>
          <div className={`text-lg font-semibold tabular-nums ${color}`}>
            {up ? "▲" : "▼"} {fmtPrice(Math.abs(q.dayChange), q.currency)} ({fmtPct(q.dayChangePct)})
          </div>
          <LiveBadge />
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <span>
            52w range:{" "}
            <span className="text-text tabular-nums">
              {fmtPrice(q.weekLow52, q.currency)} – {fmtPrice(q.weekHigh52, q.currency)}
            </span>
          </span>
          <span>
            Market cap: <span className="text-text tabular-nums">{fmtMarketCap(q.marketCap)}</span>
          </span>
          {q.exchange && (
            <span>
              Exchange: <span className="text-text">{q.exchange}</span>
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-baseline gap-2 tabular-nums ${textClass(size)}`}>
      <span className="font-semibold text-text">{fmtPrice(q.price, q.currency)}</span>
      <span className={`font-semibold ${color}`}>{fmtPct(q.dayChangePct)}</span>
    </span>
  );
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2 py-0.5">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
      </span>
      Live
    </span>
  );
}

function textClass(size: Size) {
  switch (size) {
    case "sm":
      return "text-xs";
    case "md":
      return "text-sm";
    case "lg":
      return "text-base";
    default:
      return "text-sm";
  }
}

function skeletonClass(size: Size) {
  const h = size === "xl" ? "h-10 w-48" : size === "lg" ? "h-5 w-28" : size === "sm" ? "h-3 w-16" : "h-4 w-20";
  return `inline-block ${h} rounded bg-border/60 animate-pulse`;
}
