"use client";
import { useEffect, useState } from "react";

// v1.39 SinceLastVisit — honest return-motivator.
//
// What it does, what it doesn't do:
// - Reads `holdlens:last-visit` from localStorage on mount.
// - First visit (no stored timestamp): stores now, renders NOTHING. No
//   first-impression banner. The user sees the product; the motivator is
//   a returning-visitor reward only.
// - Gap < 48h: renders nothing. We don't nag users who are in a session.
// - Gap ≥ 48h: renders a cyan "insight"-coloured banner stating the real
//   human gap and the latest 13F filing the site has. No fake counts, no
//   urgency timers, no manufactured FOMO — literally the truth about what
//   changed since they were last here.
// - Dismissible. Dismissal sets the last-visit cursor to now so the banner
//   doesn't reappear until there's another ≥ 48h gap.
//
// Why cyan (the new `insight` token, v1.39): distinct from brand amber
// (Pro/CTA), emerald (buy), rose (sell). Insight cyan reads as "here's a
// fact you care about" without shouting.
//
// Respects NEVER-BREAK-TRUST + NEVER-DECREASE-RETURN-PROBABILITY:
//   - No fake counts (the `latestQuarter` prop is sourced from real EDGAR data)
//   - No scarcity language
//   - Dismissible with one click
//   - Silent on first visit (doesn't erode the initial impression)
//   - Doesn't block any interaction
//   - Lives in the reserved vertical space only after hydration, so no
//     first-paint CLS

type Props = {
  /** Most recent 13F quarter the site has data for, human form (e.g. "Q4 2025"). */
  latestQuarter: string;
  /** ISO date the most recent 13F was filed (YYYY-MM-DD). */
  latestFilingDate: string;
};

const STORAGE_KEY = "holdlens:last-visit";
// 48 hours — below this we treat the visitor as in-session, no banner.
const MIN_GAP_MS = 48 * 60 * 60 * 1000;

function humanGap(ms: number): string {
  const days = Math.round(ms / (1000 * 60 * 60 * 24));
  if (days <= 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const weeks = Math.round(days / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }
  const months = Math.round(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export default function SinceLastVisit({ latestQuarter, latestFilingDate }: Props) {
  const [visible, setVisible] = useState(false);
  const [gapText, setGapText] = useState("");

  useEffect(() => {
    const now = Date.now();
    let stored: number | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = parseInt(raw, 10);
        if (Number.isFinite(parsed) && parsed > 0) stored = parsed;
      }
    } catch {
      // localStorage disabled / private mode — stay silent, same effect.
      return;
    }

    if (stored === null) {
      // First visit. Store and stay quiet.
      try {
        localStorage.setItem(STORAGE_KEY, String(now));
      } catch {
        /* ignore */
      }
      return;
    }

    const gap = now - stored;
    if (gap < MIN_GAP_MS) return;

    setGapText(humanGap(gap));
    setVisible(true);
    // Don't refresh the cursor yet — we only move it on dismiss or when the
    // user actually scrolls past the banner (page interaction = engagement).
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside
      className="mx-auto max-w-5xl px-6"
      aria-label="Welcome back — what's changed since your last visit"
    >
      <div className="mt-6 mb-4 rounded-card border border-insight/30 bg-surface-insight p-4 flex items-start gap-3">
        <span
          className="mt-0.5 inline-block w-2 h-2 rounded-full bg-insight shrink-0"
          aria-hidden
        />
        <div className="flex-1 min-w-0 text-sm">
          <div className="font-semibold text-text">
            Welcome back. Last here {gapText}.
          </div>
          <div className="text-muted mt-1">
            Latest 13F on file:{" "}
            <span className="text-text font-semibold">{latestQuarter}</span>
            <span className="text-dim"> · filed {latestFilingDate}</span>
            <span className="mx-2 text-dim">·</span>
            <a
              href="/activity"
              className="text-insight hover:underline whitespace-nowrap"
            >
              See what changed →
            </a>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="text-xs text-dim hover:text-text transition px-2 py-1 rounded-md shrink-0"
          aria-label="Dismiss welcome-back banner"
        >
          Dismiss
        </button>
      </div>
    </aside>
  );
}
