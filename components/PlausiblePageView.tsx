"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

// PlausiblePageView v1.0 — manual pageview fire on every route.
//
// WHY THIS EXISTS: from v0.86 (commit a75e659a0) onward, holdlens.com loaded
// Plausible via `<Script src=".../script.outbound-links.tagged-events.js"
// strategy="afterInteractive" defer />`. The combination of Next.js 15's
// Script loader deferring injection until after-interactive AND the explicit
// `defer` attribute creates a race — Plausible's init code checks
// `document.readyState` to decide when to fire its initial pageview, but by
// the time the script executes under this setup the readyState has
// transitioned past the window where the internal trigger is scheduled.
// Observed in production 2026-04-17: `plausible.io/js/...` loads 200, zero
// `/api/event` pageview POSTs on any route, for any navigation type.
//
// That meant:
//   - Every pageview since v0.86 deploy was UNCOUNTED in Plausible.
//   - Outbound-links + tagged-events still fire (those hook onto DOM events
//     that happen after init), so GA4 etc. appear partly functional — but
//     the core pageview metric was silently 0.
//   - Attribution on the Founders launch window was effectively blind.
//
// FIX: manually call `window.plausible("pageview")` on mount AND on every
// pathname/search-params change. Covers:
//   - Initial hard-nav: useEffect on first mount fires once the script is
//     available (we wait via a short retry if plausible() isn't defined yet).
//   - Next.js Link soft-nav: pathname/searchParams change triggers the
//     dep-array effect, which fires a fresh pageview the same way the
//     standard Plausible docs recommend for SPA-ish apps.
//
// This component mounts once in app/layout.tsx, renders null, and costs
// ~nothing (a single effect per route). No analytics event is lost.

export default function PlausiblePageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Wait up to ~1.5s for the Plausible script to finish loading. Most of
    // the time it's already ready (strategy="afterInteractive" puts it in
    // the head as deferred); in rare slow-network cases we poll briefly.
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 15; // 15 × 100ms = 1.5s
    const tryFire = () => {
      if (cancelled) return;
      const p = (window as unknown as { plausible?: (name: string) => void })
        .plausible;
      if (typeof p === "function") {
        p("pageview");
        return;
      }
      if (attempts++ < maxAttempts) {
        setTimeout(tryFire, 100);
      }
      // After 1.5s without a plausible() function, give up silently — the
      // script is probably blocked by an adblocker. That's expected and
      // non-fatal.
    };
    tryFire();
    return () => {
      cancelled = true;
    };
  }, [pathname, searchParams]);

  return null;
}
