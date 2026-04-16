// Desktop nav — visible at md (768px) and up.
// Replaces the previous flat 27-link overflow with 4 primary flat links + 4
// grouped dropdowns. Pure server component. Dropdowns use Tailwind `group`
// + `group-hover` + `group-focus-within` so they open on hover AND on
// keyboard focus (a11y). No client JS needed.

import GlobalSearch from "@/components/GlobalSearch";

type NavLink = {
  href: string;
  label: string;
  desc?: string;
  color?: "brand" | "emerald" | "rose" | "muted";
};

type NavGroup = {
  label: string;
  color?: "brand" | "emerald" | "rose";
  links: NavLink[];
};

// Primary — always visible, the strongest entry points.
const PRIMARY: NavLink[] = [
  { href: "/best-now", label: "Best now", color: "brand" },
  { href: "/value", label: "Value", color: "emerald" },
  { href: "/big-bets", label: "Big bets", color: "brand" },
  { href: "/rotation", label: "Rotation", color: "brand" },
];

// Grouped — collapsed into dropdowns.
const SIGNALS: NavGroup = {
  label: "Signals",
  color: "brand",
  links: [
    { href: "/conviction-leaders", label: "Conviction leaders", desc: "Weighted top picks", color: "emerald" },
    { href: "/consensus", label: "Consensus picks", desc: "≥5 tier-1 managers agree", color: "emerald" },
    { href: "/crowded-trades", label: "Crowded trades", desc: "Consensus risk", color: "rose" },
    { href: "/contrarian-bets", label: "Contrarian bets", desc: "Smart money split", color: "brand" },
    { href: "/hidden-gems", label: "Hidden gems", desc: "Quiet conviction", color: "emerald" },
    { href: "/fresh-conviction", label: "Fresh conviction", desc: "Lonely new trades", color: "brand" },
    { href: "/first-movers", label: "First movers", desc: "Before the crowd", color: "brand" },
    { href: "/reversals", label: "Reversals", desc: "Smart money changes mind", color: "emerald" },
    { href: "/trend-streak", label: "Trend streaks", desc: "Multi-quarter compounding", color: "emerald" },
    { href: "/accelerators", label: "Accelerators", desc: "Crowd forming", color: "brand" },
  ],
};

const MOVES: NavGroup = {
  label: "Moves",
  color: "emerald",
  links: [
    { href: "/biggest-buys", label: "Biggest buys", desc: "All-in conviction trades", color: "emerald" },
    { href: "/biggest-sells", label: "Biggest sells", desc: "Conviction collapses", color: "rose" },
    { href: "/new-positions", label: "New positions", desc: "Fresh money", color: "emerald" },
    { href: "/exits", label: "Exits", desc: "Capitulation feed", color: "rose" },
    { href: "/this-week", label: "This week", desc: "Most recent filings" },
    { href: "/activity", label: "Activity", desc: "All moves, unfiltered" },
    { href: "/buys", label: "All buys", color: "emerald" },
    { href: "/sells", label: "All sells", color: "rose" },
  ],
};

const MANAGERS: NavGroup = {
  label: "Managers",
  links: [
    { href: "/leaderboard", label: "Leaderboard", desc: "Top managers by activity" },
    { href: "/manager-rankings", label: "Rankings", desc: "Skill × activity × CAGR", color: "brand" },
    { href: "/by-philosophy", label: "By philosophy", desc: "Value, growth, macro…", color: "emerald" },
    { href: "/overlap", label: "Overlap", desc: "Who thinks alike", color: "brand" },
    { href: "/compare/managers", label: "Compare" },
    { href: "/concentration", label: "Concentration", desc: "All-in vs diversified", color: "brand" },
    { href: "/investor", label: "All investors" },
  ],
};

const MORE: NavGroup = {
  label: "More",
  links: [
    { href: "/portfolio", label: "My portfolio", color: "brand" },
    { href: "/proof", label: "Proof — does it work?", color: "emerald" },
    { href: "/vs/dataroma", label: "vs Dataroma", color: "brand" },
    { href: "/themes", label: "Themes — AI, Energy…", color: "brand" },
    { href: "/quarter/2025-q4", label: "Quarterly digests" },
    { href: "/screener", label: "Screener" },
    { href: "/top-picks", label: "Top picks" },
    { href: "/insiders", label: "Insider activity", color: "emerald" },
    { href: "/watchlist", label: "Watchlist" },
    { href: "/simulate", label: "Backtest" },
    { href: "/learn/superinvestor-handbook", label: "Handbook", desc: "The 10-section 13F guide", color: "emerald" },
    { href: "/learn", label: "Learn" },
    { href: "/docs", label: "API docs" },
    { href: "/faq", label: "FAQ" },
  ],
};

const GROUPS: NavGroup[] = [SIGNALS, MOVES, MANAGERS, MORE];

function colorClass(color?: "brand" | "emerald" | "rose" | "muted"): string {
  switch (color) {
    case "brand":
      return "hover:text-brand";
    case "emerald":
      return "hover:text-emerald-400";
    case "rose":
      return "hover:text-rose-400";
    case "muted":
    default:
      return "hover:text-text";
  }
}

function triggerColor(color?: "brand" | "emerald" | "rose"): string {
  switch (color) {
    case "brand":
      return "group-hover:text-brand group-focus-within:text-brand";
    case "emerald":
      return "group-hover:text-emerald-400 group-focus-within:text-emerald-400";
    case "rose":
      return "group-hover:text-rose-400 group-focus-within:text-rose-400";
    default:
      return "group-hover:text-text group-focus-within:text-text";
  }
}

export default function DesktopNav() {
  return (
    <nav className="hidden md:flex items-center gap-5 text-sm text-muted" aria-label="Main">
      {PRIMARY.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={`transition font-semibold ${colorClass(link.color)}`}
        >
          {link.label}
        </a>
      ))}

      {GROUPS.map((grp) => (
        <div key={grp.label} className="relative group">
          <button
            type="button"
            className={`inline-flex items-center gap-1 transition font-semibold cursor-pointer ${triggerColor(grp.color)}`}
            aria-haspopup="menu"
          >
            {grp.label}
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="opacity-70 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
            >
              <polyline points="2,4 5,7 8,4" />
            </svg>
          </button>

          {/* Dropdown panel — hidden until hover OR keyboard focus inside the group */}
          <div
            className="invisible opacity-0 translate-y-1 pointer-events-none
                       group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
                       group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto
                       absolute top-full left-1/2 -translate-x-1/2 mt-2
                       min-w-[240px] max-w-[320px] rounded-xl border border-border bg-panel/95 backdrop-blur shadow-2xl
                       transition duration-150
                       z-40"
            role="menu"
          >
            {/* Invisible hover bridge so the dropdown doesn't close when the cursor
                travels from the trigger to the panel (2px gap is enough to break it). */}
            <div className="absolute -top-2 inset-x-0 h-2" aria-hidden />

            <ul className="p-2">
              {grp.links.map((link) => (
                <li key={link.href} role="none">
                  <a
                    href={link.href}
                    role="menuitem"
                    className={`block rounded-lg px-3 py-2 transition ${colorClass(link.color)} hover:bg-bg/70 focus:bg-bg/70 focus:outline-none focus:ring-2 focus:ring-brand/40`}
                  >
                    <div className="font-semibold text-text">{link.label}</div>
                    {link.desc && (
                      <div className="text-[11px] text-dim leading-tight mt-0.5">
                        {link.desc}
                      </div>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {/* v1.08 — Pro link softened. Prior brand-amber bordered button was
          the loudest element in the nav on every page; violated operator's
          "Pro ≠ harm user growth" directive. Now a plain nav link with a
          subtle amber dot — discoverable but not demanding. */}
      <a
        href="/pricing"
        className="ml-1 inline-flex items-center gap-1.5 text-muted hover:text-text transition font-semibold"
        aria-label="HoldLens Pro — optional subscription"
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand/70" aria-hidden />
        Pro
      </a>
      <GlobalSearch />
    </nav>
  );
}
