"use client";

import { useEffect, useState } from "react";
import { getQuote } from "@/lib/live";

// <SinceFilingDelta /> — client component. Renders the price delta for
// a ticker since a specific filing date, e.g. "+18.3% since filing".
//
// The single highest-leverage retention primitive on the site: 13F data
// is static (filings don't change between quarters), but this number
// moves every day the market is open. A user seeing "Buffett bought OXY,
// +12% since filing" gets a live P&L context for a months-old signal.
//
// Shares the getQuote() sessionStorage cache with LiveQuote, so when
// rendered next to LiveQuote on the same row there's ZERO extra network
// cost — we just reach into the same 1-year chart response and extract
// the close on or before filedAt.
//
// Silent failure on any error (missing data, API unreachable, future
// filing date): render nothing. Never breaks the page.

type Props = {
  ticker: string;
  /** ISO date string (YYYY-MM-DD) — the 13F filing date to compare against. */
  filedAt: string;
  /** Optional trailing label. Default: "since filing". */
  label?: string;
  /** Compact variant — no label, just the percentage. */
  compact?: boolean;
  /**
   * When true, render a leading " · " separator (wrapped in mx-2 text-dim)
   * BEFORE the delta, but only when the delta actually resolves to a value.
   * Lets callers drop the component inline without worrying about orphan
   * separators when the fetch hasn't resolved yet or fails silently.
   */
  leadingSeparator?: boolean;
};

export default function SinceFilingDelta({
  ticker,
  filedAt,
  label = "since filing",
  compact = false,
  leadingSeparator = false,
}: Props) {
  const [deltaPct, setDeltaPct] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const filedMs = new Date(filedAt).getTime();
        if (!Number.isFinite(filedMs) || filedMs > Date.now()) return;

        // 1y range matches the default LiveQuote fetch — same cache entry.
        // If filedAt is >9 months ago, LiveQuote's 1y range may just barely
        // reach it; the fallback below handles the boundary gracefully.
        const q = await getQuote(ticker);
        if (cancelled || !q || !q.chart?.length) return;

        // Find the most-recent close on or BEFORE filedAt.
        // Yahoo timestamps are seconds; convert to ms for comparison.
        const cutoff = filedMs;
        let filingPrice = 0;
        for (const pt of q.chart) {
          const tMs = pt.t * 1000;
          if (tMs <= cutoff && pt.c > 0) filingPrice = pt.c;
          if (tMs > cutoff) break;
        }
        if (filingPrice <= 0 || q.price <= 0) return;

        const delta = ((q.price - filingPrice) / filingPrice) * 100;
        if (!cancelled) setDeltaPct(delta);
      } catch {
        // Silent — this is ambient retention UX, never a blocker
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ticker, filedAt]);

  if (deltaPct === null) return null;

  // Dead zone ±0.5% reads as flat; above / below is up / down respectively
  const tone =
    deltaPct > 0.5 ? "emerald" : deltaPct < -0.5 ? "rose" : "dim";
  const colorClass =
    tone === "emerald"
      ? "text-emerald-400"
      : tone === "rose"
      ? "text-rose-400"
      : "text-dim";
  const sign = deltaPct > 0 ? "+" : "";
  const filedLabel = new Date(filedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      {leadingSeparator && <span className="mx-2 text-dim">·</span>}
      <span
        className={`tabular-nums font-semibold ${colorClass}`}
        title={`Price ${deltaPct >= 0 ? "up" : "down"} ${Math.abs(deltaPct).toFixed(
          1
        )}% since this filing landed on ${filedLabel}`}
      >
        {sign}
        {deltaPct.toFixed(1)}%
        {!compact && <span className="font-normal opacity-70"> {label}</span>}
      </span>
    </>
  );
}
