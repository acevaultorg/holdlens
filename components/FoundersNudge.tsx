"use client";

import { useEffect, useState } from "react";
import { isProUser } from "@/lib/pro";

// <FoundersNudge /> — compact, tasteful founders-rate CTA wired into
// high-intent ranked pages (/best-now, /big-bets, /consensus, /signal/*,
// /investor/*). The goal is NOT a popup — it's a contextual inline card
// the reader has already "earned" by reading this far.
//
// Respects:
//   - Pro users (returns null — already paying, no sell)
//   - Dismissals (localStorage "holdlens_nudge_dismissed_v1" for 30 days)
//   - Mobile + desktop (same compact layout)
//
// Rationale: HoldLens paywalls nothing. Every CSV, every signal, every
// ranking is free. Pro's wedge is "no ads + weekly digest + EDGAR-wide
// universe + priority support". Users who already see the depth-of-
// value here are the ones most likely to subscribe — so the nudge lives
// on the pages where they've just consumed depth.

const NUDGE_KEY = "holdlens_nudge_dismissed_v1";
const DISMISS_DAYS = 30;

function shouldRender(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(NUDGE_KEY);
    if (!raw) return true;
    const parsed = JSON.parse(raw) as { at?: number };
    if (!parsed.at) return true;
    const ageDays = (Date.now() - parsed.at) / (1000 * 60 * 60 * 24);
    return ageDays >= DISMISS_DAYS;
  } catch {
    return true;
  }
}

function dismiss() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NUDGE_KEY, JSON.stringify({ at: Date.now() }));
    window.dispatchEvent(new CustomEvent("holdlens:nudge:dismissed"));
  } catch {
    /* swallow */
  }
}

const STRIPE_LINK =
  process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_FOUNDERS ||
  process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ||
  "/pricing";

export default function FoundersNudge({
  tone = "brand",
  context = "You're reading 13F analysis — the data behind smart-money moves.",
}: {
  // "rose" tone added for risk/warning contexts (/crowded-trades, /biggest-sells).
  tone?: "brand" | "emerald" | "rose";
  context?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [pro, setPro] = useState(false);

  useEffect(() => {
    setPro(isProUser());
    setVisible(shouldRender());
    const onDismiss = () => setVisible(false);
    const onProChange = () => setPro(isProUser());
    window.addEventListener("holdlens:nudge:dismissed", onDismiss);
    window.addEventListener("holdlens:pro:activated", onProChange);
    window.addEventListener("holdlens:pro:deactivated", onProChange);
    return () => {
      window.removeEventListener("holdlens:nudge:dismissed", onDismiss);
      window.removeEventListener("holdlens:pro:activated", onProChange);
      window.removeEventListener("holdlens:pro:deactivated", onProChange);
    };
  }, []);

  function handleClick() {
    try {
      window.plausible?.("founders_nudge_click", { props: { tone } });
    } catch {
      /* analytics never break the click */
    }
  }

  if (pro || !visible) return null;

  // v1.08 — softened variant uses only accentText; removed the filled
  // buttonBg/accent-border block that made the card loud. Card is now
  // neutral panel with one accent-bordered CTA.
  const accentText =
    tone === "emerald" ? "text-emerald-400" : tone === "rose" ? "text-rose-400" : "text-brand";

  // v1.08 — softened copy + visual per operator directive: "Pro should never
  // harm user growth." Prior "Lock in €9/mo" + bold amber card was selling,
  // not informing. New version leads with "Everything stays free" so the
  // free product feels complete, not crippled. Pro is positioned as optional
  // support — an invitation, not a pitch.
  return (
    <aside
      className={`my-8 rounded-xl border border-border bg-panel/60 p-5 md:p-6`}
      aria-label="Optional Pro support"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className={`text-[10px] uppercase tracking-widest font-semibold ${accentText} mb-2 opacity-80`}>
            Optional · Pro supporter
          </div>
          <div className="text-base md:text-lg font-semibold text-text leading-snug">
            Everything stays free.{" "}
            <span className="text-muted font-normal">
              Pro adds email alerts, weekly digest, and the EDGAR-wide 80+ manager
              universe — for readers who want to support the work.
            </span>
          </div>
          <p className="text-xs text-dim mt-2 leading-relaxed">
            €9/mo founders rate · first 100 subscribers · cancel anytime. {context}
          </p>
        </div>
        <div className="flex gap-2 items-center flex-wrap justify-end shrink-0">
          <a
            href={STRIPE_LINK}
            onClick={handleClick}
            className={`border ${accentText === "text-brand" ? "border-brand/40 hover:bg-brand/10" : accentText === "text-emerald-400" ? "border-emerald-400/40 hover:bg-emerald-400/10" : "border-rose-400/40 hover:bg-rose-400/10"} ${accentText} font-semibold rounded-lg px-4 py-2 text-sm transition whitespace-nowrap`}
          >
            See Pro →
          </a>
          {/* v1.12 — mobile tap-target fix. Prior text-xs inline button
              was ~50×16 px. Now padded to meet 36×36 min for touch. */}
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex items-center justify-center min-h-[36px] px-2 text-xs text-dim hover:text-text transition rounded-md"
            aria-label="Dismiss this nudge for 30 days"
          >
            Dismiss
          </button>
        </div>
      </div>
    </aside>
  );
}
