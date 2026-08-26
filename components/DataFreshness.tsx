"use client";
import { useEffect, useState } from "react";

// DataFreshness — shows today's date, days-since last 13F filing, and
// days-until the next refresh. Lives in the footer freshness band so users
// always know where they stand on data age. Client-rendered because "today"
// depends on the user's clock — build-time would drift.
//
// 13F rule: filings due 45 days after quarter-end. All DERIVED — nothing hand-written.
//
// These were four literal constants. The quarter rolled over on 2026-08-14 and none of
// them moved, so on 2026-08-26 every page (this renders from app/layout.tsx) footer-
// stamped "Data current: Q1 2026 · filed 2026-05-15" and "Next: Q2 2026 overdue 12d",
// while the holdings data had held a complete Q2 for twelve days. On a site whose whole
// value is quarterly freshness — and which is read largely by AI answer engines that
// weight recency — a stale freshness stamp is worse than no stamp.
//
// Now read from lib/moves-types, where QUARTER_LABELS/QUARTER_FILED are themselves
// derived from QUARTERS, which scripts/check-quarters-cover-data.mjs proves at build time
// is the newest quarter in the holdings data. Ingest a quarter and this advances itself;
// forget to publish one and the build fails.
import { QUARTERS, QUARTER_LABELS, QUARTER_FILED, type Quarter } from "@/lib/moves-types";

const CURRENT_QUARTER = QUARTERS[0] as Quarter;
const CURRENT_QUARTER_LABEL = QUARTER_LABELS[CURRENT_QUARTER];
const CURRENT_FILED_AT = QUARTER_FILED[CURRENT_QUARTER];

// The next quarter is deliberately NOT in QUARTERS (it has no data yet), so its label and
// deadline are computed rather than looked up.
const [_y, _n] = CURRENT_QUARTER.split("-Q").map(Number);
const NEXT_Q = _n === 4 ? `${_y + 1}-Q1` : `${_y}-Q${_n + 1}`;
const NEXT_QUARTER_LABEL = `Q${NEXT_Q.split("-Q")[1]} ${NEXT_Q.split("-Q")[0]}`;
const NEXT_FILED_AT = (() => {
  const [y, n] = NEXT_Q.split("-Q").map(Number);
  const end = new Date(Date.UTC(y, [2, 5, 8, 11][n - 1] + 1, 0));
  end.setUTCDate(end.getUTCDate() + 45);
  return end.toISOString().slice(0, 10);
})();

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
