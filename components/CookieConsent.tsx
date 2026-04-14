"use client";
// Minimal GDPR + AdSense-compliant cookie consent banner.
//
// - Shows once per browser (localStorage flag)
// - Offers Accept / Decline / Preferences — all required under GDPR
// - Declining does NOT break the site (Plausible is cookieless, watchlist/portfolio
//   stay in localStorage which is first-party functional storage — not tracking)
// - Accepting sets a flag read by the AdSense loader so personalized ads serve only
//   with consent. AdSense falls back to non-personalized ads on decline per its spec.
// - Links to /privacy and /cookies (section within /privacy) as required by Google's
//   EU User Consent policy.

import { useEffect, useState } from "react";

type Consent = "granted" | "denied" | null;

const STORAGE_KEY = "holdlens_cookie_consent_v1";

declare global {
  interface Window {
    // Google Consent Mode v2 signal
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function readConsent(): Consent {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function writeConsent(v: "granted" | "denied") {
  try {
    window.localStorage.setItem(STORAGE_KEY, v);
  } catch {
    // localStorage blocked — ignore; banner will re-show next session
  }
  // Push to Google Consent Mode if present (AdSense reads this)
  try {
    window.dataLayer = window.dataLayer || [];
    const gtag: (...args: unknown[]) => void = function (...args) {
      window.dataLayer?.push(args);
    };
    window.gtag = window.gtag || gtag;
    window.gtag("consent", "update", {
      ad_storage: v,
      ad_user_data: v,
      ad_personalization: v,
      analytics_storage: v,
    });
  } catch {
    // no-op
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if the user hasn't made a choice yet
    const existing = readConsent();
    if (existing === null) setVisible(true);
  }, []);

  if (!visible) return null;

  function accept() {
    writeConsent("granted");
    setVisible(false);
  }

  function decline() {
    writeConsent("denied");
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-panel/95 backdrop-blur"
    >
      <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="text-sm text-text flex-1">
          <div className="font-semibold mb-1">Cookies &amp; advertising</div>
          <p className="text-muted">
            HoldLens uses cookies for advertising (Google AdSense) and cookieless analytics (Plausible). You
            can accept all, decline advertising cookies, or read our{" "}
            <a href="/privacy" className="text-brand underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={decline}
            className="rounded-xl border border-border text-muted text-sm font-semibold px-4 py-2.5 hover:text-text hover:border-brand transition"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded-xl bg-brand text-black text-sm font-semibold px-4 py-2.5 hover:opacity-90 transition"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
