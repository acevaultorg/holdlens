"use client";

import { useEffect, useState } from "react";

// <InstallPrompt /> — PWA install prompt for iOS Safari + Android Chrome.
// Ambient, low-pressure, DISMISSIBLE FOREVER on first tap of the × button.
//
// Why this exists:
//  - Chrome/Edge auto-fires the beforeinstallprompt event. We catch it and
//    show a single subtle bar at the bottom of the page.
//  - iOS Safari does NOT auto-prompt. If we don't show a hint, users never
//    discover the Share → Add to Home Screen path. On iOS we detect the
//    platform and render a gentle "Add to Home Screen" instruction.
//  - Installed PWA users open the app 5-10x more than bookmark users —
//    this is the single highest-leverage retention primitive per Retention
//    Oracle v1 (archetype = core_loop_improvement × +0.060).
//
// Design rules followed:
//  - NEVER modal. Modal-on-first-visit is a dark pattern that hurts
//    first-visit trust. A thin dismissible bar at the bottom respects
//    the user while still being visible.
//  - Appears AFTER 20 seconds on the page so the user has actually
//    engaged. First impression is what matters — don't ask before
//    they've seen the value.
//  - Dismissal sets holdlens_install_dismissed=1 in localStorage with
//    a 60-day TTL. After 60 days, if they're still using the site, we
//    may ask again — their needs may have changed.
//  - Hidden completely when the app is already running as a PWA
//    (window.matchMedia('(display-mode: standalone)').matches).
//
// Silent failure: if localStorage is blocked or the PWA API is
// unavailable, we render nothing. Never blocks the page.

const DISMISS_KEY = "holdlens_install_dismissed";
const DISMISS_TTL_DAYS = 60;
const SHOW_AFTER_MS = 20_000;

// Narrow types so we don't import the whole beforeinstallprompt event def.
interface BIPEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type Mode = "hidden" | "chrome" | "ios";

export default function InstallPrompt() {
  const [mode, setMode] = useState<Mode>("hidden");
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);

  useEffect(() => {
    // Respect prior dismissal (60-day TTL)
    try {
      const raw = localStorage.getItem(DISMISS_KEY);
      if (raw) {
        const ts = Number(raw);
        if (Number.isFinite(ts) && Date.now() - ts < DISMISS_TTL_DAYS * 864e5) {
          return;
        }
      }
    } catch {
      // localStorage blocked — don't try again, just return
      return;
    }

    // Already running as an installed PWA → never show.
    if (typeof window !== "undefined") {
      const standalone =
        window.matchMedia?.("(display-mode: standalone)").matches ||
        // iOS Safari sets navigator.standalone
        (window.navigator as unknown as { standalone?: boolean }).standalone;
      if (standalone) return;
    }

    // Chrome / Edge / modern Firefox: wait for beforeinstallprompt.
    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      // Wait SHOW_AFTER_MS before revealing so the user has engaged.
      setTimeout(() => setMode("chrome"), SHOW_AFTER_MS);
    };
    window.addEventListener("beforeinstallprompt", onBIP);

    // iOS Safari path: no BIP event fires. Detect iOS + Safari and show a
    // different UI (with a hint about the Share button). Same delay.
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
    const iosTimer = isIOS
      ? setTimeout(() => setMode("ios"), SHOW_AFTER_MS)
      : null;

    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // no-op
    }
    setMode("hidden");
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    setDeferred(null);
    setMode("hidden");
    // If accepted, the browser will fire appinstalled shortly — the bar is
    // already gone, no UI needed. If dismissed, respect that for 60 days.
    if (choice.outcome === "dismissed") {
      try {
        localStorage.setItem(DISMISS_KEY, String(Date.now()));
      } catch {}
    }
  }

  if (mode === "hidden") return null;

  return (
    <div
      role="dialog"
      aria-label="Install HoldLens as an app"
      className="fixed bottom-3 left-3 right-3 z-40 max-w-md mx-auto rounded-2xl border border-border bg-panel/95 backdrop-blur-md shadow-2xl px-4 py-3 text-sm text-text"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-8 h-8 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center text-brand font-bold">
          ⌂
        </div>
        <div className="flex-1 min-w-0">
          {mode === "chrome" ? (
            <>
              <div className="font-semibold leading-tight">
                Install HoldLens on your device
              </div>
              <div className="text-muted text-xs mt-0.5 leading-snug">
                Faster open + alert notifications at filing time.
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={install}
                  className="plausible-event-name=PWA+Install plausible-event-source=prompt rounded-btn bg-brand text-bg font-semibold px-3 py-1.5 text-xs hover:opacity-90 transition"
                >
                  Install app
                </button>
                <button
                  onClick={dismiss}
                  className="plausible-event-name=PWA+Dismiss rounded-btn text-dim hover:text-text text-xs px-2 py-1.5 transition"
                >
                  Not now
                </button>
              </div>
            </>
          ) : (
            // iOS path — no programmatic prompt; explain Share → Add to Home
            <>
              <div className="font-semibold leading-tight">
                Add HoldLens to your Home Screen
              </div>
              <div className="text-muted text-xs mt-0.5 leading-snug">
                Tap <span className="text-text font-semibold">Share</span> then{" "}
                <span className="text-text font-semibold">Add to Home Screen</span>. No account needed.
              </div>
              <div className="mt-2.5">
                <button
                  onClick={dismiss}
                  className="plausible-event-name=PWA+Dismiss+iOS rounded-btn text-dim hover:text-text text-xs px-2 py-1.5 transition"
                >
                  Got it
                </button>
              </div>
            </>
          )}
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="shrink-0 text-dim hover:text-text transition text-lg leading-none px-1 -mt-0.5"
        >
          ×
        </button>
      </div>
    </div>
  );
}
