"use client";
import { useEffect, useState } from "react";
import { getQuotes, fmtMarketCap, fmtPct } from "@/lib/live";

type Holding = { ticker: string; sharesMn: number; pct: number };

type Props = {
  holdings: Holding[];
  label?: string;
};

type Totals = {
  value: number;
  dayChange: number;
  dayChangePct: number;
  coverage: number; // how many of the tickers we have live data for
  total: number;
};

export default function PortfolioValue({ holdings, label = "Portfolio value" }: Props) {
  const [totals, setTotals] = useState<Totals | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const symbols = holdings.map((h) => h.ticker);
      const quotes = await getQuotes(symbols, "1mo");
      if (cancelled) return;

      let value = 0;
      let prevValue = 0;
      let coverage = 0;

      for (const h of holdings) {
        const q = quotes[h.ticker.toUpperCase()];
        if (!q) continue;
        const shares = h.sharesMn * 1e6;
        value += q.price * shares;
        prevValue += q.prevClose * shares;
        coverage += 1;
      }

      if (coverage === 0) {
        setState("err");
        return;
      }

      const dayChange = value - prevValue;
      const dayChangePct = prevValue > 0 ? (dayChange / prevValue) * 100 : 0;
      setTotals({ value, dayChange, dayChangePct, coverage, total: holdings.length });
      setState("ok");
    }
    load();
    const id = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [holdings]);

  if (state === "loading") {
    return (
      <div className="rounded-2xl border border-border bg-panel p-6 animate-pulse h-24" aria-label="loading portfolio value" />
    );
  }

  if (state === "err" || !totals) {
    return (
      <div className="rounded-2xl border border-border bg-panel p-6 text-muted text-sm">
        Live portfolio value unavailable.
      </div>
    );
  }

  const up = totals.dayChange >= 0;
  const color = up ? "text-emerald-400" : "text-rose-400";

  return (
    <div className="rounded-2xl border border-border bg-panel p-6">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-1">{label}</div>
          <div className="text-3xl md:text-4xl font-bold tabular-nums">{fmtMarketCap(totals.value)}</div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-semibold tabular-nums ${color}`}>
            {up ? "▲" : "▼"} {fmtMarketCap(Math.abs(totals.dayChange))} ({fmtPct(totals.dayChangePct)})
          </div>
          <div className="text-xs text-dim mt-1">
            Today · {totals.coverage}/{totals.total} holdings priced live
          </div>
        </div>
      </div>
    </div>
  );
}
