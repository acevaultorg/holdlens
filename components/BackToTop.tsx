"use client";

import { useEffect, useState } from "react";

// BackToTop (v0.81) — floating round button, bottom-right, shows once the
// user has scrolled past 1200px. Essential on HoldLens's long signal
// dossier pages (/signal/[ticker] is ~10k px, /investor/[slug] similar).
// Keyboard-reachable, respects prefers-reduced-motion, SSR-safe.
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 1200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-30 w-11 h-11 rounded-full bg-panel border border-border text-text hover:bg-brand hover:text-black hover:border-brand transition shadow-lg ${
        visible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5 mx-auto"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  );
}
