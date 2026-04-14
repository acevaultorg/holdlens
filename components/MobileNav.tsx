"use client";
import { useEffect, useState } from "react";

// Hamburger menu for mobile (< md = 768px). At md+ the desktop nav is visible
// and this component renders nothing. Below md, this is the only nav surface
// — so it must include EVERY link a user could want.

const PRIMARY_LINKS: { href: string; label: string; brand?: boolean; emerald?: boolean; rose?: boolean }[] = [
  { href: "/best-now", label: "Best stocks now", brand: true },
  { href: "/value", label: "Smart money × 52w low", emerald: true },
  { href: "/big-bets", label: "Big bets · size × conviction", brand: true },
  { href: "/proof", label: "Proof — does it work?", emerald: true },
  { href: "/portfolio", label: "My portfolio", brand: true },
  { href: "/buys", label: "Buys", emerald: true },
  { href: "/sells", label: "Sells", rose: true },
  { href: "/this-week", label: "This week" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/screener", label: "Screener" },
  { href: "/activity", label: "Activity" },
  { href: "/insiders", label: "Insider activity", emerald: true },
  { href: "/grand", label: "Grand portfolio" },
  { href: "/investor", label: "Investors" },
  { href: "/ticker", label: "Stocks" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/alerts", label: "Alerts" },
];

const SECONDARY_LINKS: { href: string; label: string }[] = [
  { href: "/profile", label: "Profile" },
  { href: "/compare/managers", label: "Compare managers" },
  { href: "/top-picks", label: "Top picks" },
  { href: "/simulate", label: "Backtest" },
  { href: "/learn", label: "Learn" },
  { href: "/faq", label: "FAQ" },
  { href: "/docs", label: "API docs" },
  { href: "/about", label: "About" },
  { href: "/methodology", label: "Methodology" },
  { href: "/changelog", label: "Changelog" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  // Close menu on Escape key
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    // Lock body scroll when menu open
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-panel text-text hover:border-brand/40 transition"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && (
        <div
          className="md:hidden fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          {/* Backdrop */}
          <button
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            aria-label="Close menu"
            tabIndex={-1}
          />

          {/* Slide-down panel */}
          <div className="absolute inset-x-0 top-0 max-h-full overflow-y-auto bg-bg border-b border-border shadow-2xl">
            {/* Top bar with logo + close */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <a href="/" className="flex items-center gap-2 font-semibold text-lg text-text">
                <span className="text-brand">◉</span> HoldLens
              </a>
              <button
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-panel text-text hover:border-brand/40 transition"
                aria-label="Close menu"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Pro CTA at the very top */}
            <a
              href="/pricing"
              onClick={() => setOpen(false)}
              className="block mx-6 mt-5 mb-2 rounded-xl border border-brand bg-brand/10 p-4 hover:bg-brand/20 transition"
            >
              <div className="text-xs uppercase tracking-widest font-bold text-brand mb-1">
                Pro · Founders rate
              </div>
              <div className="text-base font-bold text-text">Lock in $9/mo for life →</div>
            </a>

            {/* Primary links */}
            <div className="px-6 py-4">
              <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mb-2">
                Smart money
              </div>
              <ul className="space-y-1">
                {PRIMARY_LINKS.map((link) => {
                  const color = link.emerald
                    ? "text-emerald-400"
                    : link.rose
                    ? "text-rose-400"
                    : link.brand
                    ? "text-brand"
                    : "text-text";
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`block py-3 text-base font-semibold ${color} hover:opacity-80 transition`}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Secondary links */}
            <div className="px-6 py-4 border-t border-border">
              <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mb-2">
                More
              </div>
              <ul className="space-y-1">
                {SECONDARY_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block py-2 text-sm text-muted hover:text-text transition"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-6 py-4 border-t border-border text-[11px] text-dim text-center">
              Tap outside or press Esc to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}
