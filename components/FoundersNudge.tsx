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
  context = "You're reading premium 13F analysis.",
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

  const accent =
    tone === "emerald"
      ? "border-emerald-400/40 bg-emerald-400/5"
      : tone === "rose"
      ? "border-rose-400/40 bg-rose-400/5"
      : "border-brand/40 bg-brand/5";
  const accentText =
    tone === "emerald" ? "text-emerald-400" : tone === "rose" ? "text-rose-400" : "text-brand";
  const buttonBg =
    tone === "emerald" ? "bg-emerald-400" : tone === "rose" ? "bg-rose-400" : "bg-brand";

  return (
    <aside
      className={`my-8 rounded-2xl border ${accent} p-5 md:p-6`}
      aria-label="Founders rate offer"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className={`text-[10px] uppercase tracking-widest font-bold ${accentText} mb-2`}>
            Founders rate · first 100 subscribers
          </div>
          <div className="text-lg md:text-xl font-bold text-text leading-snug">
            €9/mo for life. <span className="text-dim font-normal text-sm">(normally €14/mo)</span>
          </div>
          <p className="text-sm text-muted mt-1.5 leading-relaxed">
            {context} Pro adds email alerts on every 13F filing, weekly digest, watchlist triggers, EDGAR-wide 80+ manager universe, and no ads ever.
          </p>
        </div>
        <div className="flex gap-2 items-center flex-wrap justify-end">
          <a
            href={STRIPE_LINK}
            onClick={handleClick}
            className={`${buttonBg} text-black font-bold rounded-lg px-4 py-2 text-sm hover:opacity-90 transition whitespace-nowrap`}
          >
            Lock in €9/mo →
          </a>
          <button
            type="button"
            onClick={dismiss}
            className="text-xs text-dim hover:text-text transition"
            aria-label="Dismiss this offer for 30 days"
          >
            Not now
          </button>
        </div>
      </div>
    </aside>
  );
}
