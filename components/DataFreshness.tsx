"use client";
import { useEffect, useState } from "react";

// DataFreshness — shows today's date, days-since last 13F filing, and
// days-until the next refresh. Lives in the footer freshness band so users
// always know where they stand on data age. Client-rendered because "today"
// depends on the user's clock — build-time would drift.
//
// 13F rule: filings due 45 days after quarter-end.
//   Q4 2025 ends 2025-12-31 → deadline 2026-02-14 (complete)
//   Q1 2026 ends 2026-03-31 → deadline 2026-05-15

const CURRENT_QUARTER_LABEL = "Q4 2025";
const CURRENT_FILED_AT = "2026-02-14"; // deadline for the current quarter
const NEXT_QUARTER_LABEL = "Q1 2026";
const NEXT_FILED_AT = "2026-05-15";

function daysBetween(a: Date, b: Date): number {
  const MS = 1000 * 60 * 60 * 24;
  return Math.round((b.getTime() - a.getTime()) / MS);
}

function formatToday(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DataFreshness() {
  // SSR renders the static label; client upgrades on mount.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  if (!now) {
    // SSR / pre-hydration — show the static quarter pair, no drift.
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>
          Data current: <span className="text-text font-semibold">{CURRENT_QUARTER_LABEL}</span> · filed {CURRENT_FILED_AT}
        </span>
      </div>
    );
  }

  const filedDate = new Date(CURRENT_FILED_AT + "T00:00:00");
  const nextDate = new Date(NEXT_FILED_AT + "T00:00:00");
  const daysSince = Math.max(0, daysBetween(filedDate, now));
  const daysUntil = daysBetween(now, nextDate);

  return (
    <div className="flex items-center gap-2 flex-wrap" suppressHydrationWarning>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
      <span>
        Today: <span className="text-text font-semibold">{formatToday(now)}</span>
      </span>
      <span className="text-dim/60">·</span>
      <span>
        Data: <span className="text-text font-semibold">{CURRENT_QUARTER_LABEL}</span>{" "}
        <span className="text-dim">({daysSince}d old)</span>
      </span>
      <span className="text-dim/60">·</span>
      <span>
        Next:{" "}
        <span className="text-text font-semibold">
          {NEXT_QUARTER_LABEL}
        </span>{" "}
        <span className="text-dim">
          {daysUntil > 0 ? `in ${daysUntil}d` : daysUntil === 0 ? "today" : `overdue ${-daysUntil}d`}
        </span>
      </span>
    </div>
  );
}
