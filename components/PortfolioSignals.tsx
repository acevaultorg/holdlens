"use client";
// Cross-references the user's portfolio against the HoldLens recommendation model.
// Shows: how many holdings have BUY signals, SELL signals, NEUTRAL, missing data.
// Lists the actionable rows so the user immediately knows what to do.
//
// This is the killer hook for the entire site: it makes the recommendation model
// PERSONAL — not "what should anyone buy" but "what should YOU do with what
// you already own". All signals use the unified signed −100..+100 scale.
//
// v1.91 perf-fix: switched from importing getNetSignal (which transitively
// pulled in 10MB of EDGAR JSON via lib/moves → lib/edgar-data) to fetching
// the precomputed /api/v1/scores.json (23KB, generated at build time by
// scripts/generate-api-json.ts). Pre-fix this single client component
// caused the /portfolio/ page JS bundle to be 8.7MB. Post-fix it's normal.

import { useEffect, useState } from "react";
import { getProfile, subscribeProfile } from "@/lib/profile";

// v1.91 perf-fix: inlined formatSignedScore (4-line function) instead of
// importing from @/lib/conviction. The import was the second leak — conviction.ts
// transitively pulled in 10MB of EDGAR JSON via lib/moves → lib/edgar-data.
function formatSignedScore(score: number): string {
  if (score > 0) return `+${score}`;
  if (score < 0) return `−${Math.abs(score)}`;
  return "0";
}

type SignalLite = {
  direction: "BUY" | "SELL" | "NEUTRAL" | string;
  score: number;
};

type RowSignal = {
  ticker: string;
  signal: SignalLite | null;
};

type ScoresApiItem = {
  ticker: string;
  score: number;
  direction: string;
  // (other fields exist but unused here)
};

type ScoresApiResponse = {
  data: ScoresApiItem[];
  meta?: unknown;
};

let scoresCachePromise: Promise<Map<string, SignalLite>> | null = null;

function getScoresLookup(): Promise<Map<string, SignalLite>> {
  if (!scoresCachePromise) {
    scoresCachePromise = fetch("/api/v1/scores.json", {
      // Cache aggressively — scores update on each deploy
      cache: "force-cache",
    })
      .then((r) => {
        if (!r.ok) throw new Error(`scores.json HTTP ${r.status}`);
        return r.json() as Promise<ScoresApiResponse>;
      })
      .then((j) => {
        const m = new Map<string, SignalLite>();
        for (const item of j.data) {
          m.set(item.ticker.toUpperCase(), { direction: item.direction, score: item.score });
        }
        return m;
      })
      .catch((err) => {
        // On fetch failure, return empty map — component shows "Not in coverage"
        // for everything but doesn't crash. The whole component renders null
        // when rows.length === 0 anyway, so this is graceful.
        // eslint-disable-next-line no-console
        console.warn("[PortfolioSignals] failed to load scores.json", err);
        return new Map<string, SignalLite>();
      });
  }
  return scoresCachePromise;
}

export default function PortfolioSignals() {
  const [rows, setRows] = useState<RowSignal[]>([]);
  const [mounted, setMounted] = useState(false);
  const [scoresMap, setScoresMap] = useState<Map<string, SignalLite> | null>(null);

  // Load the scores lookup once on mount (cached after first call).
  useEffect(() => {
    let cancelled = false;
    setMounted(true);
    getScoresLookup().then((m) => {
      if (!cancelled) setScoresMap(m);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Recompute rows whenever the user's portfolio OR scores lookup changes.
  useEffect(() => {
    if (!scoresMap) return;
    const compute = () => {
      const holdings = getProfile().holdings;
      setRows(
        holdings.map((h) => ({
          ticker: h.ticker.toUpperCase(),
          signal: scoresMap.get(h.ticker.toUpperCase()) ?? null,
        })),
      );
    };
    compute();
    return subscribeProfile(compute);
  }, [scoresMap]);

  if (!mounted || rows.length === 0) return null;

  const buys = rows.filter((r) => r.signal?.direction === "BUY");
  const sells = rows.filter((r) => r.signal?.direction === "SELL");
  const neutrals = rows.filter((r) => r.signal?.direction === "NEUTRAL");
  const noData = rows.filter((r) => !r.signal);

  return (
    <div className="rounded-2xl border border-brand/30 bg-brand/5 p-6">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
        Smart money signals on your portfolio
      </div>
      <h2 className="text-2xl font-bold mb-4">
        {buys.length} of your {rows.length} holdings have <span className="text-emerald-400">BUY</span> signals
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <SignalCount label="BUY signals" count={buys.length} color="emerald" />
        <SignalCount label="SELL signals" count={sells.length} color="rose" />
        <SignalCount label="Neutral" count={neutrals.length} color="muted" />
        <SignalCount label="Not in coverage" count={noData.length} color="dim" />
      </div>

      {/* Actionable rows */}
      {buys.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold mb-2">
            ✓ Smart money agrees with you
          </div>
          <div className="flex flex-wrap gap-2">
            {buys.map((r) => (
              <a
                key={r.ticker}
                href={`/signal/${r.ticker}`}
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-400 font-semibold hover:bg-emerald-400/20 transition"
              >
                {r.ticker}
                <span className="text-[10px] tabular-nums opacity-80">{formatSignedScore(r.signal?.score ?? 0)}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {sells.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-wider text-rose-400 font-bold mb-2">
            ⚠ Smart money is exiting
          </div>
          <div className="flex flex-wrap gap-2">
            {sells.map((r) => (
              <a
                key={r.ticker}
                href={`/signal/${r.ticker}`}
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-rose-400/30 bg-rose-400/10 text-rose-400 font-semibold hover:bg-rose-400/20 transition"
              >
                {r.ticker}
                <span className="text-[10px] tabular-nums opacity-80">{formatSignedScore(r.signal?.score ?? 0)}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {(neutrals.length > 0 || noData.length > 0) && (
        <div className="text-xs text-dim mt-3">
          {neutrals.length > 0 && (
            <span>
              {neutrals.length} neutral ({neutrals.map((r) => r.ticker).join(", ")}).
            </span>
          )}
          {noData.length > 0 && (
            <span className="ml-2">
              {noData.length} not tracked yet ({noData.map((r) => r.ticker).join(", ")}).
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function SignalCount({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: "emerald" | "rose" | "muted" | "dim";
}) {
  const colorClass =
    color === "emerald"
      ? "text-emerald-400"
      : color === "rose"
      ? "text-rose-400"
      : color === "muted"
      ? "text-muted"
      : "text-dim";
  return (
    <div className="rounded-lg bg-bg/40 border border-border p-3 text-center">
      <div className={`text-2xl font-bold tabular-nums ${colorClass}`}>{count}</div>
      <div className="text-[10px] uppercase tracking-wider text-dim mt-1 font-semibold">{label}</div>
    </div>
  );
}
