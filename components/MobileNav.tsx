"use client";
import { useEffect, useState } from "react";

// Hamburger menu for mobile (< md = 768px). At md+ the desktop nav is visible
// and this component renders nothing. Below md, this is the only nav surface
// — so it must include EVERY link a user could want.

type MLink = { href: string; label: string; color?: "brand" | "emerald" | "rose" };
type MGroup = { title: string; accent: "brand" | "emerald"; links: MLink[] };

// Grouped mobile navigation (v0.80) — replaces the previous 39-link wall +
// 10-link secondary with five clearly labelled sections. Fewer total links
// than before (curated to the highest-conviction entry points), and every
// link sits under a named group header so users can find what they need by
// scanning section titles, not by reading every label.
const GROUPS: MGroup[] = [
  {
    title: "Signals",
    accent: "brand",
    links: [
      { href: "/best-now", label: "Best stocks now", color: "brand" },
      { href: "/value", label: "Value — smart money × 52w low", color: "emerald" },
      { href: "/big-bets", label: "Big bets", color: "brand" },
      { href: "/consensus", label: "Consensus picks", color: "emerald" },
      { href: "/contrarian-bets", label: "Contrarian bets", color: "brand" },
      { href: "/hidden-gems", label: "Hidden gems", color: "emerald" },
      { href: "/fresh-conviction", label: "Fresh conviction", color: "brand" },
    ],
  },
  {
    title: "Moves",
    accent: "emerald",
    links: [
      { href: "/biggest-buys", label: "Biggest buys", color: "emerald" },
      { href: "/biggest-sells", label: "Biggest sells", color: "rose" },
      { href: "/new-positions", label: "New positions", color: "emerald" },
      { href: "/exits", label: "Exits", color: "rose" },
      { href: "/this-week", label: "This week" },
      { href: "/activity", label: "Full activity" },
    ],
  },
  {
    title: "Managers",
    accent: "brand",
    links: [
      { href: "/leaderboard", label: "Leaderboard" },
      { href: "/manager-rankings", label: "Rankings", color: "brand" },
      { href: "/conviction-leaders", label: "Conviction leaders", color: "emerald" },
      { href: "/overlap", label: "Overlap", color: "brand" },
      { href: "/concentration", label: "Concentration", color: "brand" },
      { href: "/by-philosophy", label: "By philosophy", color: "emerald" },
      { href: "/compare/managers", label: "Compare" },
    ],
  },
  {
    title: "Discover",
    accent: "emerald",
    links: [
      { href: "/rotation", label: "Sector rotation", color: "brand" },
      { href: "/proof", label: "Proof — does it work?", color: "emerald" },
      { href: "/vs/dataroma", label: "vs Dataroma", color: "brand" },
      { href: "/learn/superinvestor-handbook", label: "Handbook", color: "emerald" },
      { href: "/themes", label: "Themes" },
      { href: "/trend-streak", label: "Trend streaks", color: "emerald" },
      { href: "/reversals", label: "Reversals", color: "emerald" },
    ],
  },
  {
    title: "Product",
    accent: "brand",
    links: [
      { href: "/pricing", label: "Pro pricing", color: "brand" },
      { href: "/premium", label: "Pro features", color: "brand" },
      { href: "/portfolio", label: "My portfolio", color: "brand" },
      { href: "/watchlist", label: "Watchlist" },
      { href: "/alerts", label: "Email alerts" },
      { href: "/simulate", label: "Backtest" },
      { href: "/screener", label: "Screener" },
      { href: "/docs", label: "API docs" },
      { href: "/learn", label: "Learn" },
    ],
  },
];

const LEGAL_LINKS: { href: string; label: string }[] = [
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/methodology", label: "Methodology" },
  { href: "/changelog", label: "Changelog" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

function linkColorClass(color?: "brand" | "emerald" | "rose"): string {
  switch (color) {
    case "brand":
      return "text-brand";
    case "emerald":
      return "text-emerald-400";
    case "rose":
      return "text-rose-400";
    default:
      return "text-text";
  }
}

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

            {/* Grouped sections — Signals / Moves / Managers / Discover / Product */}
            {GROUPS.map((grp, idx) => (
              <div
                key={grp.title}
                className={`px-6 py-4${idx > 0 ? " border-t border-border" : ""}`}
              >
                <div
                  className={`text-[10px] uppercase tracking-widest font-bold mb-3 ${
                    grp.accent === "emerald" ? "text-emerald-400" : "text-brand"
                  }`}
                >
                  {grp.title}
                </div>
                <ul className="space-y-1">
                  {grp.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`block py-2.5 text-base font-semibold ${linkColorClass(
                          link.color
                        )} hover:opacity-80 transition`}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Legal + meta strip */}
            <div className="px-6 py-4 border-t border-border">
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-dim">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="hover:text-text transition"
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
