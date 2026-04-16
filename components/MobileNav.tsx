"use client";
import { useEffect, useRef, useState } from "react";

// MobileNav v0.99 — 10/10 mobile UX rewrite. Below md (<768px) this is the
// only nav surface, so it must answer every "what can this site do" question
// in 2 seconds without scrolling.
//
// Design principles applied:
// 1. Search input front-and-center — financial-tracker users land on mobile
//    looking up specific tickers more often than they browse.
// 2. Popular tickers as one-tap chips — six highest-traffic symbols, no
//    typing required for the common case.
// 3. Five sharp groups, max 6 items each (was 7-9 in v0.96) — cuts total
//    from ~40 links to ~28 with better intent labels.
// 4. Pro CTA in a single, calm position at top — no flashing, no upsells
//    embedded mid-list (anti-dark-pattern floor).
// 5. Full-screen opaque sheet — no nested-fixed iOS bug surface (v0.98 fix).
// 6. overscroll-behavior: contain — momentum scroll doesn't chain to body.

type MLink = { href: string; label: string; color?: "brand" | "emerald" | "rose"; badge?: string };
type MGroup = { title: string; accent: "brand" | "emerald"; links: MLink[] };

// Popular tickers — chips at top of menu for one-tap entry. These are the
// six highest-traffic /signal/[ticker] pages by typical search demand.
const POPULAR_TICKERS = ["AAPL", "MSFT", "NVDA", "META", "TSLA", "BRK-B"];

// Five groups in intent order: what users came for first, account stuff last.
const GROUPS: MGroup[] = [
  {
    title: "Signals",
    accent: "brand",
    links: [
      { href: "/best-now", label: "Best stocks now", color: "brand" },
      { href: "/value", label: "Value · smart money × cheap", color: "emerald" },
      { href: "/big-bets", label: "Big bets · size × conviction", color: "brand" },
      { href: "/consensus", label: "Consensus picks", color: "emerald" },
      { href: "/contrarian-bets", label: "Contrarian bets" },
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
      { href: "/this-week", label: "This week" },
    ],
  },
  {
    title: "Investors",
    accent: "brand",
    links: [
      { href: "/leaderboard", label: "Leaderboard" },
      { href: "/manager-rankings", label: "Manager rankings", color: "brand" },
      { href: "/conviction-leaders", label: "Conviction leaders", color: "emerald" },
      { href: "/compare/managers", label: "Compare side-by-side" },
      { href: "/overlap", label: "Overlap matrix" },
    ],
  },
  {
    title: "Discover",
    accent: "emerald",
    links: [
      { href: "/rotation", label: "Sector rotation heatmap", color: "brand" },
      { href: "/themes", label: "AI · Mag 7 · Energy themes" },
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
      { href: "/alerts", label: "Email alerts" },
      { href: "/premium", label: "Pro features" },
      { href: "/docs", label: "API docs" },
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
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Close menu on Escape key + lock body scroll while open
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
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

      {open && (
        // Full-screen opaque sheet (v0.98 pattern) with internal scroll.
        <div
          className="md:hidden fixed inset-0 z-50 overflow-y-auto bg-bg"
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
              >
                <span className="text-brand text-lg leading-none">◉</span> HoldLens
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

            {/* Search — the #1 missing primitive on mobile until v0.99.
                Submits to /signal/{TICKER}; non-coverage tickers land on the
                graceful notFound() flow upstream. */}
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

              {/* Popular ticker chips — one-tap to top demand */}
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

            {/* Pro CTA — single, prominent, calm. No countdown timers,
                no flashing badges, no urgency theater (anti-dark-pattern). */}
            <a
              href="/pricing"
              onClick={() => setOpen(false)}
              className="block mx-5 mt-5 mb-2 rounded-xl border border-brand bg-brand/10 p-4 hover:bg-brand/15 transition"
            >
              <div className="text-[10px] uppercase tracking-widest font-bold text-brand mb-1">
                Pro · Founders rate
              </div>
              <div className="text-[15px] font-bold text-text leading-tight">
                Lock in €9/mo for life →
              </div>
              <div className="text-xs text-dim mt-1">
                First 100 subscribers · cancel anytime
              </div>
            </a>

            {/* Five intent-grouped sections */}
            {GROUPS.map((grp, idx) => (
              <div
                key={grp.title}
                className={`px-5 py-4${idx > 0 ? " border-t border-border" : ""}`}
              >
                <div
                  className={`text-[10px] uppercase tracking-widest font-bold mb-2 ${
                    grp.accent === "emerald" ? "text-emerald-400" : "text-brand"
                  }`}
                >
                  {grp.title}
                </div>
                <ul className="space-y-0.5">
                  {grp.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-between gap-3 py-3 text-[15px] font-semibold ${linkColorClass(
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
              </div>
            ))}

            {/* Legal — small, single row, low contrast. Always reachable
                without dominating the menu's content hierarchy. */}
            <div className="px-5 py-5 border-t border-border">
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

            {/* Spacer for iOS bottom safe area + final breathing room */}
            <div className="h-12" aria-hidden />
          </div>
        </div>
      )}
    </>
  );
}
