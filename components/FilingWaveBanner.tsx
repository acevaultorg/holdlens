"use client";

import { useEffect, useState } from "react";
import { nextFilingDeadline } from "@/lib/filings";

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
//
// v1.01 — replaced hardcoded deadline with lib/filings.nextFilingDeadline()
// so the banner stays correct forever without manual updates. Every quarter
// the deadline auto-advances on its own.

const STORAGE_KEY = "holdlens_filing_wave_banner_dismissed_v1";
const DISMISS_DAYS = 14;

function daysUntil(iso: string): number {
  const target = new Date(iso + "T00:00:00Z").getTime();
  const now = Date.now();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function formatWindow(deadlineIso: string): string {
  // 13F filings typically land in the 4-5 days before the deadline — show as
  // a range like "May 11–15, 2026" instead of a single day.
  const end = new Date(deadlineIso + "T00:00:00Z");
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 4);
  const year = end.getUTCFullYear();
  const endMonthShort = end.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
  const startMonthShort = start.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
  const startDay = start.getUTCDate();
  const endDay = end.getUTCDate();
  if (startMonthShort === endMonthShort) {
    return `${endMonthShort} ${startDay}\u2013${endDay}, ${year}`;
  }
  return `${startMonthShort} ${startDay} \u2013 ${endMonthShort} ${endDay}, ${year}`;
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

type State = {
  days: number;
  windowLabel: string;
  quarterLabel: string;
};

export default function FilingWaveBanner() {
  const [state, setState] = useState<State | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (wasRecentlyDismissed()) return;
    const dl = nextFilingDeadline();
    const days = daysUntil(dl.date);
    if (days < 0) return; // should never happen — nextFilingDeadline always returns future
    setState({
      days,
      windowLabel: formatWindow(dl.date),
      quarterLabel: dl.quarter,
    });
    setVisible(true);
  }, []);

  if (!visible || !state) return null;

  const countdownLabel =
    state.days <= 0
      ? "filings landing today"
      : state.days === 1
      ? "wave tomorrow"
      : `wave in ${state.days} days`;

  return (
    <div
      role="region"
      aria-label={`Next 13F filing wave — ${state.quarterLabel}`}
      className="border-b border-border bg-surface-brand"
    >
      <div className="max-w-5xl mx-auto px-6 py-2 flex items-center justify-between gap-3 text-xs flex-wrap">
        <div className="text-muted">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand align-middle mr-2" />
          <span className="text-text font-semibold">Next {state.quarterLabel} filings:</span>{" "}
          {state.windowLabel} <span className="text-dim">·</span>{" "}
          <span className="text-brand font-semibold">{countdownLabel}</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/alerts"
            className="text-brand hover:text-text font-semibold transition plausible-event-name=FilingBanner+Click"
            data-source="filing-wave-banner"
          >
            Get the alert →
          </a>
          {/* v1.12 — tap-target fix. Prior × was 8×16 px (text-only button),
              far below WCAG AA minimum 44×44 and effectively untappable on
              phones. Mobile audit via Chrome MCP iframe at 390px vw confirmed
              the issue. Fix: explicit min-h + min-w + inline-flex centering +
              -mr-2 so visual position doesn't shift. Text character stays ×
              to preserve the visual language; only the hit area grows. */}
          <button
            type="button"
            onClick={() => {
              dismiss();
              setVisible(false);
              try {
                // Plausible custom event for dismissal — helps us learn whether
                // users consistently dismiss (banner is annoying) or rarely
                // dismiss (banner is valued). Silent if Plausible not loaded.
                (window as unknown as { plausible?: (name: string) => void }).plausible?.(
                  "FilingBanner Dismiss"
                );
              } catch {
                /* ignore */
              }
            }}
            className="-mr-2 inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-base leading-none text-dim hover:text-text transition rounded-md"
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
