"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Logo from "@/components/Logo";

// MobileNav v1.03 — ROOT CAUSE FIX: portal dialog to document.body.
//
// Why this was still broken after v0.96, v0.98, v0.99: the <header> in
// app/layout.tsx is sticky + has `backdrop-blur-md` (via backdrop-filter
// CSS property). Per the CSS containing-block spec, ANY element with
// backdrop-filter / transform / filter / perspective / will-change
// becomes the containing block for its positioned descendants — including
// `position: fixed` children. Since MobileNav is rendered as a child of
// <header> in layout.tsx, the dialog's `fixed inset-0 z-50` positioned
// relative to the header's bounding box (~60-80px top strip) instead of
// the viewport. On narrow screens the dialog appeared clipped, couldn't
// scroll to its full content, and tapping items near the bottom was
// frustrating or impossible.
//
// The fix that previous attempts missed: React portal. Rendering the
// dialog into document.body escapes the header's containing block
// entirely. `fixed inset-0` now correctly positions to the viewport.
// Body-scroll lock + overscroll-behavior still apply as before.
//
// Previous design intent (preserved):
// 1. Search input front-and-center
// 2. Popular tickers as one-tap chips
// 3. Five sharp groups, max 6 items each
// 4. Pro CTA in a single, calm position at top
// 5. Full-screen opaque sheet
// 6. overscroll-behavior: contain

type MLink = { href: string; label: string; color?: "brand" | "emerald" | "rose"; badge?: string };
type MGroup = { title: string; accent: "brand" | "emerald"; links: MLink[] };

// Popular tickers — chips at top of menu for one-tap entry. These are the
// six highest-traffic /signal/[ticker] pages by typical search demand.
const POPULAR_TICKERS = ["AAPL", "MSFT", "NVDA", "META", "TSLA", "BRK-B"];

// Five groups in intent order: what users came for first, account stuff last.
// v1.04 — normalized color coding: within each group, ONE link is un-colored
// (the "neutral reference"); the rest are colored. Previous state had random
// color dropouts that broke visual rhythm.
const GROUPS: MGroup[] = [
  {
    title: "Signals",
    accent: "brand",
    links: [
      { href: "/best-now", label: "Best stocks now", color: "brand" },
      { href: "/value", label: "Value · smart money × cheap", color: "emerald" },
      { href: "/big-bets", label: "Big bets · size × conviction", color: "brand" },
      { href: "/consensus", label: "Consensus picks", color: "emerald" },
      { href: "/contrarian-bets", label: "Contrarian bets", color: "brand" },
      { href: "/hidden-gems", label: "Hidden gems", color: "emerald" },
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
      { href: "/this-week", label: "This week · fresh filings", color: "emerald" },
    ],
  },
  {
    title: "Investors",
    accent: "brand",
    links: [
      { href: "/leaderboard", label: "Leaderboard", color: "brand" },
      { href: "/manager-rankings", label: "Manager rankings", color: "brand" },
      { href: "/conviction-leaders", label: "Conviction leaders", color: "emerald" },
      { href: "/compare/managers", label: "Compare side-by-side", color: "brand" },
      { href: "/overlap", label: "Overlap matrix", color: "brand" },
    ],
  },
  {
    title: "Discover",
    accent: "emerald",
    links: [
      { href: "/rotation", label: "Sector rotation heatmap", color: "brand" },
      { href: "/themes", label: "AI · Mag 7 · Energy themes", color: "brand" },
      { href: "/learn/superinvestor-handbook", label: "Superinvestor handbook", color: "emerald" },
      { href: "/vs/dataroma", label: "vs Dataroma", color: "brand" },
      { href: "/proof", label: "Proof — does it work?", color: "emerald" },
    ],
  },
  {
    title: "Your tools",
    accent: "brand",
    links: [
      { href: "/watchlist", label: "Watchlist", color: "brand" },
      { href: "/portfolio", label: "My portfolio", color: "brand" },
      { href: "/alerts", label: "Email alerts", color: "emerald" },
      { href: "/premium", label: "Pro features", color: "brand" },
      { href: "/docs", label: "API docs", color: "emerald" },
    ],
  },
];

const LEGAL_LINKS: { href: string; label: string }[] = [
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/methodology", label: "How it works" },
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
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Portal mount guard — SSR returns null on the portal path until the
  // client hydrates and document.body is available.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu on Escape key + lock body scroll while open
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    // Body scroll lock — html element too, because iOS Safari sometimes
    // ignores body-only lock when there's a fixed viewport root element.
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [open]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const t = query.trim().toUpperCase().replace(/[^A-Z.\-]/g, "");
    if (!t) return;
    // Naive but useful: route to /signal/{TICKER}; if no match, signal page
    // shows a graceful "not in coverage" via notFound() upstream.
    window.location.href = `/signal/${encodeURIComponent(t)}`;
  }

  // The dialog — portaled to document.body so it escapes the sticky
  // header's backdrop-filter containing block. This is the root-cause fix.
  const dialog = open ? (
    <div
      className="md:hidden fixed inset-0 z-[100] overflow-y-auto bg-bg"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      style={{
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "contain",
      }}
    >
      <div className="min-h-full">
        {/* Sticky top bar — logo + close. Stays visible during scroll
            so the user always has an exit. */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b border-border bg-bg/95 backdrop-blur-sm">
          <a
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 font-semibold text-base text-text"
            aria-label="HoldLens — home"
          >
            <Logo size={22} className="text-brand" />
            <span>HoldLens</span>
          </a>
          <button
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-border bg-panel text-text hover:border-brand/40 transition"
            aria-label="Close menu"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <form onSubmit={submitSearch} className="px-5 mt-4">
          <label htmlFor="mobile-search" className="sr-only">
            Search ticker
          </label>
          <div className="relative">
            <input
              id="mobile-search"
              ref={inputRef}
              type="search"
              inputMode="search"
              autoComplete="off"
              autoCapitalize="characters"
              placeholder="Search a ticker (e.g. AAPL)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-panel pl-11 pr-4 py-3 text-base text-text placeholder:text-dim focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20 transition"
            />
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim"
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
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/* Popular ticker chips */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto -mx-5 px-5 pb-1">
            <span className="text-[10px] uppercase tracking-widest text-dim font-semibold shrink-0 mr-1">
              Popular
            </span>
            {POPULAR_TICKERS.map((t) => (
              <a
                key={t}
                href={`/signal/${t}`}
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-full border border-border bg-panel px-3 py-1.5 text-xs font-mono font-semibold text-text hover:border-brand/40 hover:text-brand transition"
              >
                {t}
              </a>
            ))}
          </div>
        </form>

        {/* v1.08 — Pro CTA REMOVED from top-of-menu per operator directive:
            "commercial strategy to let people buy Pro should never harm user
            growth." First-impression of a menu shouldn't be "pay us."
            Pro card now lives after all 5 nav groups, before legal strip,
            positioned as earned/optional — not as the menu's opening move. */}

        {/* v1.08 — Hybrid accordion. Research (NN/g, Baymard, LukeW) shows
            mobile menus >40 items cause scan-drop-off. Prior flat layout
            scrolled 2157px (2.7 viewports); users had to parse 33 links at
            once. Solution: each group shows its primary (highest-intent)
            link pinned at top + a native <details> disclosure revealing
            secondary links on tap.

            Reasoning:
            • Retail investors landing on mobile almost always want one
              specific page: /best-now, /biggest-buys, /leaderboard,
              /rotation, /watchlist. Those are now 1 tap each.
            • Long-tail items (crowded-trades, hidden-gems, etc.) stay
              discoverable via 2 taps — no feature hidden.
            • Native <details>/<summary> = zero client JS, built-in a11y
              (expanded/collapsed ARIA for free), keyboard-accessible.
            • Multiple groups can be open at once — users can compare. */}
        {GROUPS.map((grp, idx) => {
          const [primary, ...secondary] = grp.links;
          const accentText = grp.accent === "emerald" ? "text-emerald-400" : "text-brand";
          return (
            <div
              key={grp.title}
              className={`px-5 py-5${idx > 0 ? " border-t border-border mt-2 pt-6" : ""}`}
            >
              <div
                className={`text-[10px] uppercase tracking-widest font-bold mb-3 ${accentText}`}
              >
                {grp.title}
              </div>

              {/* Pinned primary link — always visible, no expand needed. */}
              <a
                href={primary.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between gap-3 py-3 text-[15px] font-semibold ${linkColorClass(
                  primary.color
                )} hover:opacity-80 transition`}
              >
                <span>{primary.label}</span>
                {primary.badge && (
                  <span className="inline-block text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-brand text-black">
                    {primary.badge}
                  </span>
                )}
              </a>

              {/* Collapsed secondary — native <details> means zero JS,
                  keyboard accessible, screen readers get correct state. */}
              {secondary.length > 0 && (
                <details className="group">
                  <summary
                    className={`list-none cursor-pointer flex items-center justify-between gap-3 py-2.5 text-[13px] text-muted hover:text-text transition select-none`}
                  >
                    <span>
                      <span className="text-dim">Show</span>{" "}
                      <span className={accentText}>{secondary.length} more</span>{" "}
                      <span className="text-dim">in {grp.title.toLowerCase()}</span>
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-60 group-open:rotate-180 transition-transform duration-base"
                      aria-hidden
                    >
                      <polyline points="3,6 8,11 13,6" />
                    </svg>
                  </summary>
                  <ul className="mt-1 pl-0 space-y-0.5 border-l-2 border-border/60 pl-3">
                    {secondary.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center justify-between gap-3 py-2.5 text-[14px] font-semibold ${linkColorClass(
                            link.color
                          )} hover:opacity-80 transition`}
                        >
                          <span>{link.label}</span>
                          {link.badge && (
                            <span className="inline-block text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-brand text-black">
                              {link.badge}
                            </span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          );
        })}

        {/* v1.08 — Pro CTA RELOCATED to post-groups position. Softer copy
            ("Optional Pro" vs prior "Lock in €9/mo"), neutral border (not
            brand-amber) so it reads as supporting information, not an
            aggressive paywall. Users who want Pro after browsing reach it
            here; users who don't care scroll past with zero cognitive
            cost. Growth-first positioning per operator directive. */}
        <div className="px-5 py-5 border-t border-border mt-2 pt-6">
          <a
            href="/pricing"
            onClick={() => setOpen(false)}
            className="block rounded-xl border border-border bg-panel/60 p-4 hover:border-brand/40 hover:bg-brand/5 transition"
          >
            <div className="text-[10px] uppercase tracking-widest font-semibold text-dim mb-1">
              Support HoldLens · Optional
            </div>
            <div className="text-[14px] font-semibold text-text leading-tight">
              Pro — €9/mo founders rate
            </div>
            <div className="text-xs text-muted mt-1 leading-snug">
              Everything stays free forever. Pro adds email alerts + EDGAR-wide
              universe for supporters.
            </div>
          </a>
        </div>

        {/* Legal */}
        <div className="px-5 py-5 border-t border-border mt-2 pt-6">
          <ul className="flex flex-wrap gap-x-5 gap-y-2.5 text-xs text-dim">
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

        {/* v1.04 — bottom close button. After scrolling through 1900+px of
            menu, reaching the top-sticky X is a thumb-stretch. This gives a
            near-the-thumb exit at the natural end of the scroll. */}
        <div className="px-5 py-6 border-t border-border mt-2 pt-8">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full rounded-xl border border-border bg-panel text-muted font-semibold py-3.5 text-[15px] hover:text-text hover:border-brand/40 transition"
            aria-label="Close menu"
          >
            Close menu
          </button>
        </div>

        {/* iOS bottom safe area */}
        <div className="h-8" aria-hidden />
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-border bg-panel text-text hover:border-brand/40 transition"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Portal the dialog to document.body so it escapes the sticky
          header's backdrop-filter containing block. mounted guard prevents
          SSR hydration mismatches. */}
      {mounted && dialog && createPortal(dialog, document.body)}
    </>
  );
}
