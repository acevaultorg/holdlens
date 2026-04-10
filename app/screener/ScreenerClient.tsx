"use client";
import { useEffect, useMemo, useState } from "react";
import LiveQuote from "@/components/LiveQuote";
import { getQuotes, type LiveQuote as LiveQuoteData } from "@/lib/live";
import { getGrandPortfolio } from "@/lib/signals";

type Row = ReturnType<typeof getGrandPortfolio>[number];

type SortKey = "score" | "owners" | "dayChange" | "ticker";
type DirectionFilter = "all" | "up" | "down";

const SECTORS = [
  "All sectors",
  "Technology",
  "Financials",
  "Consumer Discretionary",
  "Consumer Staples",
  "Healthcare",
  "Energy",
  "Industrials",
  "Communication",
  "Materials",
  "Real Estate",
  "Utilities",
];

export default function ScreenerClient() {
  const [sector, setSector] = useState<string>("All sectors");
  const [minOwners, setMinOwners] = useState<number>(1);
  const [minScore, setMinScore] = useState<number>(0);
  const [direction, setDirection] = useState<DirectionFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("score");

  // Base dataset from the grand portfolio (deterministic, built at render time)
  const allRows = useMemo(() => getGrandPortfolio(), []);

  // Live quotes for all screener rows
  const [quotes, setQuotes] = useState<Record<string, LiveQuoteData | null>>({});
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const symbols = allRows.map((r) => r.ticker);
      const q = await getQuotes(symbols, "1mo");
      if (!cancelled) setQuotes(q);
    }
    load();
    const id = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [allRows]);

  const filtered = useMemo(() => {
    let out = allRows.filter((r) => {
      if (sector !== "All sectors" && r.sector !== sector) return false;
      if (r.ownerCount < minOwners) return false;
      if (r.weightedScore < minScore) return false;
      if (direction !== "all") {
        const q = quotes[r.ticker.toUpperCase()];
        if (!q) return false;
        if (direction === "up" && q.dayChangePct < 0) return false;
        if (direction === "down" && q.dayChangePct >= 0) return false;
      }
      return true;
    });

    // Sort
    out = [...out].sort((a, b) => {
      if (sortKey === "score") return b.weightedScore - a.weightedScore;
      if (sortKey === "owners") return b.ownerCount - a.ownerCount;
      if (sortKey === "dayChange") {
        const qa = quotes[a.ticker.toUpperCase()]?.dayChangePct ?? -Infinity;
        const qb = quotes[b.ticker.toUpperCase()]?.dayChangePct ?? -Infinity;
        return qb - qa;
      }
      return a.ticker.localeCompare(b.ticker);
    });

    return out;
  }, [allRows, sector, minOwners, minScore, direction, quotes, sortKey]);

  const maxOwners = Math.max(...allRows.map((r) => r.ownerCount));
  const maxScore = Math.ceil(Math.max(...allRows.map((r) => r.weightedScore)) / 100) * 100;

  return (
    <>
      {/* Filters */}
      <div className="rounded-2xl border border-border bg-panel p-5 mb-6 grid md:grid-cols-4 gap-5">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-dim font-semibold mb-1.5">
            Sector
          </label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-brand outline-none"
          >
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-dim font-semibold mb-1.5">
            Min tracked owners:{" "}
            <span className="text-brand font-bold">{minOwners}</span>
          </label>
          <input
            type="range"
            min={1}
            max={maxOwners}
            value={minOwners}
            onChange={(e) => setMinOwners(Number(e.target.value))}
            className="w-full accent-brand"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-dim font-semibold mb-1.5">
            Min weighted score:{" "}
            <span className="text-brand font-bold">{minScore.toFixed(0)}</span>
          </label>
          <input
            type="range"
            min={0}
            max={maxScore}
            step={10}
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-full accent-brand"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-dim font-semibold mb-1.5">
            Day change
          </label>
          <div className="flex gap-1">
            {(["all", "up", "down"] as DirectionFilter[]).map((d) => (
              <button
                key={d}
                onClick={() => setDirection(d)}
                className={`flex-1 text-xs font-semibold px-2 py-2 rounded-md transition ${
                  d === direction
                    ? d === "up"
                      ? "bg-emerald-400 text-black"
                      : d === "down"
                      ? "bg-rose-400 text-black"
                      : "bg-brand text-black"
                    : "text-muted border border-border hover:border-brand/40"
                }`}
                aria-pressed={d === direction}
              >
                {d === "all" ? "All" : d === "up" ? "Up" : "Down"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
        <div className="text-sm text-muted">
          <span className="text-text font-semibold">{filtered.length}</span> of {allRows.length} stocks match
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-dim font-semibold">Sort</span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="bg-bg border border-border rounded-md px-2 py-1 text-xs text-text focus:border-brand outline-none"
          >
            <option value="score">Weighted score</option>
            <option value="owners">Owner count</option>
            <option value="dayChange">Day change %</option>
            <option value="ticker">Ticker A-Z</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-panel overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-dim text-sm">
            No stocks match these filters. Loosen the constraints.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-dim text-xs uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3">Ticker</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Company</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Sector</th>
                <th className="text-right px-5 py-3">Price · Today</th>
                <th className="text-right px-5 py-3">Owners</th>
                <th className="text-right px-5 py-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 100).map((r: Row) => (
                <tr key={r.ticker} className="border-b border-border last:border-0 hover:bg-bg/40 transition">
                  <td className="px-5 py-3 font-mono font-semibold">
                    <a href={`/signal/${r.ticker}`} className="text-brand hover:underline">{r.ticker}</a>
                  </td>
                  <td className="px-5 py-3 text-text hidden md:table-cell truncate max-w-xs">{r.name}</td>
                  <td className="px-5 py-3 text-dim hidden md:table-cell">{r.sector}</td>
                  <td className="px-5 py-3 text-right">
                    <LiveQuote symbol={r.ticker} size="sm" refreshMs={0} />
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums font-semibold">{r.ownerCount}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted">{r.weightedScore.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filtered.length > 100 && (
        <p className="text-xs text-dim mt-3 text-center">
          Showing top 100 of {filtered.length}. Tighten filters to narrow further.
        </p>
      )}
    </>
  );
}
