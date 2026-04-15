"use client";

import { useEffect, useState } from "react";

// <FilingWaveBanner /> — thin site-wide band that surfaces the next 13F
// filing wave as a live countdown + funnel into /alerts email capture.
//
// Why this matters: HoldLens's data is structurally lagged by 45 days (SEC
// 13F rule). Between filing waves the site shows "old" data — a first-time
// visitor in April reads "Q4 2025" as stale. The countdown reframes that:
// "this IS the latest, and the next wave lands in N days, get notified."
// Turns the lag from a confusion into an anticipation + subscription lever.
//
// Design intent: non-intrusive. One row of height. Dismissible for 14 days
// via localStorage. Auto-hides once the deadline has passed. Not sticky, not
// fixed — just natural flow above hero. No popup, no countdown-timer dark
// pattern. Purely ambient context.

const STORAGE_KEY = "holdlens_filing_wave_banner_dismissed_v1";
const DISMISS_DAYS = 14;

// Next SEC 13F filing deadline for Q1 2026 (filed 45 days after quarter end).
// When this passes, the banner auto-hides and the next session's build should
// bump this to the following deadline (or a follow-up PR adds automatic calc).
const NEXT_DEADLINE_ISO = "2026-05-15";

function daysUntil(iso: string): number {
  const target = new Date(iso + "T00:00:00Z").getTime();
  const now = Date.now();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function wasRecentlyDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { at?: number };
    if (!parsed.at) return false;
    const ageDays = (Date.now() - parsed.at) / (1000 * 60 * 60 * 24);
    return ageDays < DISMISS_DAYS;
  } catch {
    return false;
  }
}

function dismiss() {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ at: Date.now() })
    );
  } catch {
    /* swallow */
  }
}

export default function FilingWaveBanner() {
  const [visible, setVisible] = useState(false);
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    // Hide after deadline passes + during dismissal window
    const d = daysUntil(NEXT_DEADLINE_ISO);
    if (d < 0) return;
    if (wasRecentlyDismissed()) return;
    setDays(d);
    setVisible(true);
  }, []);

  if (!visible || days === null) return null;

  const windowLabel =
    days <= 1
      ? "filings landing today"
      : days <= 4
      ? `wave in ${days} days`
      : `wave in ${days} days`;

  return (
    <div
      role="region"
      aria-label="Next 13F filing wave"
      className="border-b border-border bg-brand/5"
    >
      <div className="max-w-5xl mx-auto px-6 py-2 flex items-center justify-between gap-3 text-xs flex-wrap">
        <div className="text-muted">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand align-middle mr-2" />
          <span className="text-text font-semibold">Next 13F filings:</span>{" "}
          May&nbsp;11&ndash;15, 2026 <span className="text-dim">·</span>{" "}
          <span className="text-brand font-semibold">{windowLabel}</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/alerts"
            className="text-brand hover:text-text font-semibold transition"
          >
            Get the alert →
          </a>
          <button
            type="button"
            onClick={() => {
              dismiss();
              setVisible(false);
            }}
            className="text-dim hover:text-text transition"
            aria-label="Dismiss this banner for 14 days"
            title="Dismiss for 14 days"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
