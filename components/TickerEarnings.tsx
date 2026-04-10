"use client";
import { useEffect, useState } from "react";
import { getEarnings, fmtEarningsRelative, fmtEarningsDate, type EarningsInfo } from "@/lib/earnings";

export default function TickerEarnings({ symbol }: { symbol: string }) {
  const [data, setData] = useState<EarningsInfo | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");

  useEffect(() => {
    let cancelled = false;
    getEarnings(symbol).then((d) => {
      if (cancelled) return;
      if (d && (d.nextEarningsDate || d.epsEstimate)) {
        setData(d);
        setState("ok");
      } else {
        setState("err");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [symbol]);

  if (state === "loading") {
    return (
      <div className="rounded-2xl border border-border bg-panel p-5 h-28 animate-pulse" aria-label="loading earnings" />
    );
  }

  if (state === "err" || !data) {
    return null; // Silent — earnings data is additive, not load-bearing
  }

  const upcoming = data.nextEarningsDate && data.nextEarningsDate > Date.now() / 1000;
  const relative = fmtEarningsRelative(data.nextEarningsDate);
  const isSoon = upcoming && data.nextEarningsDate! - Date.now() / 1000 < 14 * 86400;

  return (
    <div className={`rounded-2xl border p-5 ${isSoon ? "border-brand/50 bg-brand/5" : "border-border bg-panel"}`}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className={`text-xs uppercase tracking-widest font-semibold mb-1 ${isSoon ? "text-brand" : "text-dim"}`}>
            {upcoming ? "Next earnings" : "Last reported"}
          </div>
          <div className="text-2xl font-bold tabular-nums">
            {fmtEarningsDate(data.nextEarningsDate)}
          </div>
          {relative && <div className="text-sm text-muted mt-0.5">{relative}</div>}
        </div>
        {(data.epsEstimate != null || data.epsActual != null) && (
          <div className="text-right">
            <div className="text-xs uppercase tracking-widest text-dim font-semibold mb-1">
              EPS {data.epsActual != null ? "actual" : "estimate"}
            </div>
            <div className="text-xl font-bold tabular-nums text-text">
              {(data.epsActual ?? data.epsEstimate)?.toFixed(2)}
            </div>
            {data.epsActual != null && data.epsEstimate != null && data.epsActual !== data.epsEstimate && (
              <div className={`text-xs mt-0.5 ${data.epsActual > data.epsEstimate ? "text-emerald-400" : "text-rose-400"}`}>
                {data.epsActual > data.epsEstimate ? "beat" : "miss"} {data.epsEstimate.toFixed(2)} est
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
