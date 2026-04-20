"use client";
import { useMemo, useEffect, useState } from "react";
import LiveQuote from "@/components/LiveQuote";
import CsvExportButton from "@/components/CsvExportButton";
import { getQuotes, type LiveQuote as LiveQuoteData } from "@/lib/live";

export type GrandRow = {
  ticker: string;
  name: string;
  sector?: string;
  ownerCount: number;
  aggregatePct: number;
  weightedScore: number;
  topOwners: { slug: string; name: string; pct: number; quality: number }[];
};

type Row = GrandRow;

type SortKey = "score" | "owners" | "dayChange" | "ticker" | "above52wLow";
type DirectionFilter = "all" | "up" | "down";
type ValueFilter = "any" | "near_low" | "near_high";

type SavedFilter = {
  sector: string;
  minOwners: number;
  minScore: number;
  direction: DirectionFilter;
  sortKey: SortKey;
  valueFilter?: ValueFilter;
};

const SAVE_KEY = "holdlens_screener_filter_v1";

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

export default function ScreenerClient({ rows }: { rows: GrandRow[] }) {
  const [sector, setSector] = useState<string>("All sectors");
  const [minOwners, setMinOwners] = useState<number>(1);
  const [minScore, setMinScore] = useState<number>(0);
  const [direction, setDirection] = useState<DirectionFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [valueFilter, setValueFilter] = useState<ValueFilter>("any");
  const [savedState, setSavedState] = useState<"idle" | "saved" | "loaded">("idle");
  const [hasSaved, setHasSaved] = useState(false);

  // Load saved filter on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        setHasSaved(true);
        const f: SavedFilter = JSON.parse(raw);
        setSector(f.sector);
        setMinOwners(f.minOwners);
        setMinScore(f.minScore);
        setDirection(f.direction);
        setSortKey(f.sortKey);
        if (f.valueFilter) setValueFilter(f.valueFilter);
        setSavedState("loaded");
        setTimeout(() => setSavedState("idle"), 1500);
      }
    } catch {
      // ignore
    }
  }, []);

  function saveFilter() {
    if (typeof window === "undefined") return;
    const f: SavedFilter = { sector, minOwners, minScore, direction, sortKey, valueFilter };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(f));
      setHasSaved(true);
      setSavedState("saved");
      setTimeout(() => setSavedState("idle"), 1500);
    } catch {
      // quota
    }
  }

  function clearSaved() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(SAVE_KEY);
    setHasSaved(false);
    setSector("All sectors");
    setMinOwners(1);
    setMinScore(0);
    setDirection("all");
    setSortKey("score");
    setValueFilter("any");
  }

  // % above 52-week low — lower = closer to the bottom = better value hunting.
  function pctAbove52wLow(q: LiveQuoteData | null | undefined): number | null {
    if (!q || !q.weekLow52 || q.weekLow52 <= 0) return null;
    return ((q.price - q.weekLow52) / q.weekLow52) * 100;
  }

  // Base dataset from the grand portfolio — pre-computed server-side and
  // passed as prop so client bundle doesn't pull edgar-data JSON.
  const allRows = rows;

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
      if (valueFilter !== "any") {
        const q = quotes[r.ticker.toUpperCase()];
        const pct = pctAbove52wLow(q);
        if (pct == null) return false;
        if (valueFilter === "near_low" && pct > 25) return false;
        if (valueFilter === "near_high" && pct < 75) return false;
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
      if (sortKey === "above52wLow") {
        // ascending: closest to 52w low first (best value)
        const pa = pctAbove52wLow(quotes[a.ticker.toUpperCase()]) ?? Infinity;
        const pb = pctAbove52wLow(quotes[b.ticker.toUpperCase()]) ?? Infinity;
        return pa - pb;
      }
      return a.ticker.localeCompare(b.ticker);
    });

    return out;
  }, [allRows, sector, minOwners, minScore, direction, quotes, sortKey, valueFilter]);

  const maxOwners = Math.max(...allRows.map((r) => r.ownerCount));
  const maxScore = Math.ceil(Math.max(...allRows.map((r) => r.weightedScore)) / 100) * 100;

  return (
    <>
      {/* Filters */}
      <div className="rounded-2xl border border-border bg-panel p-5 mb-6 space-y-5">
      <div className="grid md:grid-cols-4 gap-5">
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

      {/* Value filter — % above 52-week low. The Dataroma power feature. */}
      <div>
        <label className="block text-[10px] uppercase tracking-wider text-dim font-semibold mb-1.5">
          52-week range position
        </label>
        <div className="flex gap-1 flex-wrap">
          {(
            [
              { v: "any" as ValueFilter, label: "Any", hint: "" },
              { v: "near_low" as ValueFilter, label: "Near 52w low", hint: "≤25% above low — value hunting" },
              { v: "near_high" as ValueFilter, label: "Near 52w high", hint: "≥75% above low — momentum" },
            ]
          ).map((opt) => (
            <button
              key={opt.v}
              onClick={() => setValueFilter(opt.v)}
              title={opt.hint}
              className={`text-xs font-semibold px-3 py-2 rounded-md transition ${
                opt.v === valueFilter
                  ? "bg-brand text-black"
                  : "text-muted border border-border hover:border-brand/40"
              }`}
              aria-pressed={opt.v === valueFilter}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      </div>

      {/* Save filter + CSV export actions */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={saveFilter}
            className="inline-flex items-center gap-2 text-xs font-semibold text-text border border-border hover:border-brand/40 rounded-lg px-3 py-2 bg-panel transition"
          >
            {savedState === "saved" ? "Saved ✓" : savedState === "loaded" ? "Loaded ✓" : "Save filter"}
          </button>
          {hasSaved && (
            <button
              onClick={clearSaved}
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-rose-400 border border-border hover:border-rose-400/40 rounded-lg px-3 py-2 bg-panel transition"
            >
              Clear saved
            </button>
          )}
          <CsvExportButton
            filename="holdlens-screener-results.csv"
            label="Download CSV"
            rows={filtered.map((r, i) => {
              const q = quotes[r.ticker.toUpperCase()];
              const pct52wLow = pctAbove52wLow(q);
              return {
                rank: i + 1,
                ticker: r.ticker,
                name: r.name,
                sector: r.sector || "",
                owner_count: r.ownerCount,
                weighted_score: r.weightedScore.toFixed(1),
                day_change_pct: q?.dayChangePct.toFixed(2) ?? "",
                price: q?.price.toFixed(2) ?? "",
                pct_above_52w_low: pct52wLow != null ? pct52wLow.toFixed(1) : "",
                week_52_low: q?.weekLow52.toFixed(2) ?? "",
                week_52_high: q?.weekHigh52.toFixed(2) ?? "",
              };
            })}
          />
        </div>
        <span className="text-[10px] text-dim hidden sm:inline">
          Filter saves on this device — auto-loads next visit
        </span>
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
            <option value="above52wLow">Closest to 52w low</option>
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
                <th className="text-left px-5 py-3 hidden lg:table-cell">Sector</th>
                <th className="text-right px-5 py-3">Price · Today</th>
                <th className="text-right px-5 py-3 hidden sm:table-cell" title="% above 52-week low — lower = closer to bottom">52w low</th>
                <th className="text-right px-5 py-3">Owners</th>
                <th className="text-right px-5 py-3 hidden md:table-cell">Score</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 100).map((r: Row) => {
                const q = quotes[r.ticker.toUpperCase()];
                const pct52 = pctAbove52wLow(q);
                const pctColor =
                  pct52 == null
                    ? "text-dim"
                    : pct52 <= 15
                    ? "text-emerald-400"
                    : pct52 <= 40
                    ? "text-text"
                    : pct52 >= 85
                    ? "text-rose-400"
                    : "text-muted";
                return (
                  <tr key={r.ticker} className="border-b border-border last:border-0 hover:bg-bg/40 transition">
                    <td className="px-5 py-3 font-mono font-semibold">
                      <a href={`/signal/${r.ticker}`} className="text-brand hover:underline">{r.ticker}</a>
                    </td>
                    <td className="px-5 py-3 text-text hidden md:table-cell truncate max-w-xs">{r.name}</td>
                    <td className="px-5 py-3 text-dim hidden lg:table-cell">{r.sector}</td>
                    <td className="px-5 py-3 text-right">
                      <LiveQuote symbol={r.ticker} size="sm" refreshMs={0} />
                    </td>
                    <td className={`px-5 py-3 text-right tabular-nums hidden sm:table-cell ${pctColor}`}>
                      {pct52 != null ? `+${pct52.toFixed(0)}%` : "—"}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums font-semibold">{r.ownerCount}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-muted hidden md:table-cell">{r.weightedScore.toFixed(0)}</td>
                  </tr>
                );
              })}
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
