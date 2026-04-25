"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// EngagementTracker v1 — fires the three AAERA signals AUG audit 2026-04-20
// flagged as missing from Plausible: scroll-depth (25/50/75/100), 90s active
// time, returning-session detection (d7/d30).
//
// Why this exists: AUG.md baseline marked engagement (0.20) + retention
// (0.10) as cold-start specifically because the underlying events were not
// firing. Every Oracle projection past that point would be vibes-based per
// `~/.claude/rules/learn-from-data.md` ("If you projected it, measure it").
// This component closes the measurement gap so weekly AUG drift monitoring
// (CSIL #13) has real signal instead of "Low — no direct instrumentation;
// placeholder" rows.
//
// Events (match `rules/aceusergrowth.md` v3 Part 14 schema):
//   scroll                  { depth: 25 | 50 | 75 | 100 }
//   time_on_page_90s        { seconds: 90 }      — active time only
//   returning_session_d7    { days_since: N }    — last seen ≤7 days ago
//   returning_session_d30   { days_since: N }    — last seen 8-30 days ago
//   activated               { method, pages_viewed } — first non-bouncer signal
//
// Ad-blocker safe: every fire is `window.plausible?.(...)` — if the script is
// blocked the call is a no-op. No fallback tracker, privacy-first.
//
// Per-route reset: scroll depth + time-on-page state resets on pathname
// change so each route is measured independently. Returning-session fires
// once per pathname load.
//
// Cost: one scroll listener (passive) + one 1s interval per route. Tear-down
// in cleanup. Negligible CPU/battery on every device tested.

declare global {
  interface Window {
    plausible?: (
      name: string,
      opts?: { props?: Record<string, string | number> }
    ) => void;
  }
}

const STORAGE_KEY = "holdlens_last_seen_ts";
const D7_MS = 7 * 24 * 60 * 60 * 1000;
const D30_MS = 30 * 24 * 60 * 60 * 1000;
const ACTIVE_TIME_THRESHOLD_SEC = 90;
const SCROLL_THRESHOLDS = [25, 50, 75, 100] as const;

// Activation: HoldLens is a database/calculator hybrid (per AUG rubric);
// canonical activation signal is "user viewed ≥3 data pages in session".
// Time-on-page 90s is treated as a parallel activation signal — a user who
// reads one page deeply has activated even without browsing more.
const ACTIVATION_PAGES_THRESHOLD = 3;
const SESSION_PAGES_KEY = "holdlens_session_pages";
const SESSION_ACTIVATED_KEY = "holdlens_session_activated";

function fireActivation(method: string, pagesViewed: number): void {
  try {
    if (sessionStorage.getItem(SESSION_ACTIVATED_KEY)) return;
    window.plausible?.("activated", {
      props: { method, pages_viewed: pagesViewed },
    });
    sessionStorage.setItem(SESSION_ACTIVATED_KEY, "1");
  } catch {
    // sessionStorage blocked — non-fatal.
  }
}

export default function EngagementTracker() {
  const pathname = usePathname();
  const firedScroll = useRef<Set<number>>(new Set());
  const firedActiveTime = useRef(false);

  // Returning-session detection — fires once per pathname load.
  // Also increments per-session pageview counter and fires `activated` when
  // the database-archetype threshold (≥3 pages/session) is crossed.
  useEffect(() => {
    try {
      const last = localStorage.getItem(STORAGE_KEY);
      const now = Date.now();
      if (last) {
        const diff = now - parseInt(last, 10);
        const days = Math.round(diff / (24 * 60 * 60 * 1000));
        if (diff > 0 && diff <= D7_MS) {
          window.plausible?.("returning_session_d7", {
            props: { days_since: days },
          });
        } else if (diff > D7_MS && diff <= D30_MS) {
          window.plausible?.("returning_session_d30", {
            props: { days_since: days },
          });
        }
      }
      localStorage.setItem(STORAGE_KEY, String(now));
    } catch {
      // localStorage blocked (private mode, third-party-cookie restrictions) — non-fatal.
    }

    // Per-session pageview counter + activation trigger.
    try {
      const prev = parseInt(sessionStorage.getItem(SESSION_PAGES_KEY) || "0", 10);
      const next = prev + 1;
      sessionStorage.setItem(SESSION_PAGES_KEY, String(next));
      if (next >= ACTIVATION_PAGES_THRESHOLD) {
        fireActivation("pages_viewed_threshold", next);
      }
    } catch {
      // sessionStorage blocked — non-fatal.
    }
  }, [pathname]);

  // Scroll depth — fire 25/50/75/100 once each per pathname.
  useEffect(() => {
    firedScroll.current = new Set();
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const percent = (window.scrollY / max) * 100;
      for (const threshold of SCROLL_THRESHOLDS) {
        if (percent >= threshold && !firedScroll.current.has(threshold)) {
          firedScroll.current.add(threshold);
          window.plausible?.("scroll", { props: { depth: threshold } });
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Active time on page — accumulate seconds while visible+focused; fire
  // `time_on_page_90s` exactly once when crossed.
  useEffect(() => {
    firedActiveTime.current = false;
    let activeSeconds = 0;
    let lastTick = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - lastTick) / 1000;
      lastTick = now;
      if (
        document.visibilityState === "visible" &&
        document.hasFocus() &&
        elapsed < 5 // skip large gaps (sleep, long idle); keeps "active" honest
      ) {
        activeSeconds += elapsed;
        if (
          activeSeconds >= ACTIVE_TIME_THRESHOLD_SEC &&
          !firedActiveTime.current
        ) {
          firedActiveTime.current = true;
          window.plausible?.("time_on_page_90s", {
            props: { seconds: ACTIVE_TIME_THRESHOLD_SEC },
          });
          // Parallel activation signal — deep single-page reading also
          // activates a user who hasn't crossed the 3-page threshold yet.
          let pagesSoFar = 1;
          try {
            pagesSoFar = parseInt(
              sessionStorage.getItem(SESSION_PAGES_KEY) || "1",
              10
            );
          } catch {
            // sessionStorage blocked — fall back to 1.
          }
          fireActivation("time_on_page_90s", pagesSoFar);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
