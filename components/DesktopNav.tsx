// Desktop nav — visible at md (768px) and up.
//
// v1.60 — 7-item entity-centric primary nav per "ultimate HoldLens" spec
// 2026-04-20. Replaces v1.50's signal-centric "Best/Value/BigBets/Rotation
// + Signals/Moves/Managers/More" arrangement with the entity nouns that
// match how users + LLMs ask: Investors · Stocks · Insiders · Markets ·
// Signals · Research · About. Each dropdown collects the existing routes
// under the matching entity without inventing new surfaces — the 98
// shipped top-level routes already map cleanly to the 7 nouns.
//
// Why the change:
// - SEO/GEO: entity nouns are what Google SGE + LLM-answer engines extract
//   from site taxonomies. "Superinvestors" under an "Investors" hub
//   crawls cleaner than under a "Managers" group that splits with "More".
// - Mental model: first-time visitors ask "who do I want to follow"
//   (investor), "which stock" (stock), "what insiders did" (insiders).
//   The prior signal-centric nav answered "what signal" first, which
//   works for returning users but misses the cold-start mental model.
// - Directive: operator 2026-04-20 "ultimate HoldLens" spec explicitly
//   names the 7 primary items.
//
// Preserved from v1.50:
// - Pure server component (no client JS for the menu itself)
// - Dropdowns open on hover + keyboard focus (Tailwind `group` +
//   group-hover + group-focus-within), a11y friendly
// - Hover bridge (-top-2 inset-x-0 h-2) so cursor travel doesn't close
// - Semantic color discipline: `brand` reserved for Pro/CTA only;
//   `emerald` = buy/bullish; `rose` = sell/bearish; `sky` = mixed.
//   Neutral default for category nouns (no hue rotation per category).

import GlobalSearch from "@/components/GlobalSearch";

type NavLink = {
  href: string;
  label: string;
  desc?: string;
  color?: "brand" | "emerald" | "rose" | "muted" | "sky";
};

type NavGroup = {
  label: string;
  links: NavLink[];
};

// 7 entity-centric groups. Neutral headers — content + weight carry
// hierarchy, not hue (per design system's reserved-use rule).

const INVESTORS: NavGroup = {
  label: "Investors",
  links: [
    { href: "/investor", label: "All investors", desc: "30 tracked superinvestors" },
    { href: "/leaderboard", label: "Leaderboard", desc: "Top managers by activity" },
    { href: "/manager-rankings", label: "Manager rankings", desc: "Skill × activity × CAGR" },
    { href: "/conviction-leaders", label: "Conviction leaders", desc: "Weighted top picks", color: "emerald" },
    { href: "/by-philosophy", label: "By philosophy", desc: "Value, growth, activist, macro", color: "emerald" },
    { href: "/concentration", label: "Concentration", desc: "All-in vs diversified" },
    { href: "/overlap", label: "Overlap matrix", desc: "Who thinks alike" },
    { href: "/compare/managers", label: "Compare side-by-side" },
    { href: "/similar-to", label: "Similar portfolios", desc: "Jaccard similarity" },
    { href: "/activist", label: "Activist funds (13D/G)", desc: "Campaigns + outcomes" },
    { href: "/simulate", label: "Backtest a manager", color: "emerald" },
  ],
};

const STOCKS: NavGroup = {
  label: "Stocks",
  links: [
    { href: "/top-picks", label: "Top picks", desc: "Most-owned across managers" },
    { href: "/biggest-buys", label: "Biggest buys", desc: "All-in conviction trades", color: "emerald" },
    { href: "/biggest-sells", label: "Biggest sells", desc: "Conviction collapses", color: "rose" },
    { href: "/new-positions", label: "New positions", desc: "Fresh money", color: "emerald" },
    { href: "/exits", label: "Exits", desc: "Full capitulations", color: "rose" },
    { href: "/crowded-trades", label: "Crowded trades", desc: "Consensus + unwind risk" },
    { href: "/consensus", label: "Consensus picks", desc: "≥5 managers agree", color: "emerald" },
    { href: "/screener", label: "Stock screener" },
    { href: "/sectors", label: "By sector (GICS)" },
    { href: "/watchlist", label: "My watchlist", color: "brand" },
  ],
};

const INSIDERS: NavGroup = {
  label: "Insiders",
  links: [
    { href: "/insiders", label: "All insider activity", desc: "Form 4 firehose", color: "emerald" },
    { href: "/insiders?filter=buys", label: "Recent insider buys", desc: "CEO/CFO/director trades", color: "emerald" },
    { href: "/insiders?filter=sells", label: "Recent insider sells", color: "rose" },
    { href: "/insiders?filter=cluster", label: "Cluster buys", desc: "3+ insiders same ticker", color: "emerald" },
    { href: "/congress", label: "Congressional trades", desc: "STOCK Act disclosures" },
    { href: "/congress?view=leaderboard", label: "STOCK Act leaderboard", desc: "Members by activity" },
  ],
};

const MARKETS: NavGroup = {
  label: "Markets",
  links: [
    { href: "/etf", label: "ETFs", desc: "Holdings + flows" },
    { href: "/overlap", label: "ETF / fund overlap" },
    { href: "/rotation", label: "Sector rotation", desc: "Institutional flow heatmap", color: "sky" },
    { href: "/sectors", label: "Sector breakdown" },
    { href: "/short-interest", label: "Short interest", desc: "Squeeze watch" },
    { href: "/buybacks", label: "Corporate buybacks", desc: "Authorizations + execution" },
    { href: "/dividend-tax", label: "Dividend tax by country", desc: "Treaty withholding calc" },
    { href: "/activist", label: "Activist campaigns" },
    { href: "/themes", label: "Themes", desc: "AI · Mag 7 · Energy · Banks" },
    { href: "/quarter/2025-q4", label: "Quarterly digest", desc: "Latest filing cycle" },
  ],
};

const SIGNALS: NavGroup = {
  label: "Signals",
  links: [
    { href: "/best-now", label: "Best stocks now", desc: "Top ConvictionScores", color: "brand" },
    { href: "/value", label: "Value", desc: "Smart money × cheap", color: "emerald" },
    { href: "/big-bets", label: "Big bets", desc: "Size × conviction" },
    { href: "/hidden-gems", label: "Hidden gems", desc: "Quiet conviction", color: "emerald" },
    { href: "/contrarian-bets", label: "Contrarian bets", desc: "Smart money split", color: "sky" },
    { href: "/fresh-conviction", label: "Fresh conviction", desc: "Lonely new trades", color: "emerald" },
    { href: "/first-movers", label: "First movers", desc: "Before the crowd" },
    { href: "/reversals", label: "Reversals", desc: "Smart money changes mind", color: "emerald" },
    { href: "/trend-streak", label: "Trend streaks", desc: "Multi-quarter compounding", color: "emerald" },
    { href: "/accelerators", label: "Accelerators", desc: "Crowd forming", color: "emerald" },
    { href: "/activity", label: "Activity feed", desc: "All moves, unfiltered" },
    { href: "/this-week", label: "This week", desc: "Latest filings" },
  ],
};

const RESEARCH: NavGroup = {
  label: "Research",
  links: [
    { href: "/learn", label: "Learning center", desc: "11+ explainer articles" },
    { href: "/learn/superinvestor-handbook", label: "Superinvestor handbook", color: "emerald" },
    { href: "/methodology", label: "Methodology", desc: "How ConvictionScore is built" },
    { href: "/proof", label: "Proof — does it work?", color: "emerald" },
    { href: "/quarterly", label: "Quarterly State of Institutions" },
    { href: "/press-kit", label: "Press kit + media" },
    { href: "/changelog", label: "Changelog" },
  ],
};

const ABOUT: NavGroup = {
  label: "About",
  links: [
    { href: "/about", label: "About HoldLens", desc: "Team + mission" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
    { href: "/docs", label: "API docs" },
    { href: "/for-ai", label: "For AI / LLM agents", color: "sky" },
    { href: "/api-terms", label: "API terms" },
    { href: "/pricing", label: "Pricing", color: "brand" },
    { href: "/premium", label: "Pro features" },
    { href: "/alerts", label: "Email alerts" },
  ],
};

const GROUPS: NavGroup[] = [INVESTORS, STOCKS, INSIDERS, MARKETS, SIGNALS, RESEARCH, ABOUT];

function colorClass(color?: "brand" | "emerald" | "rose" | "muted" | "sky"): string {
  switch (color) {
    case "brand":
      return "hover:text-brand";
    case "emerald":
      return "hover:text-signal-buy";
    case "rose":
      return "hover:text-signal-sell";
    case "sky":
      return "hover:text-info";
    case "muted":
    default:
      return "hover:text-text";
  }
}

export default function DesktopNav() {
  return (
    <nav
      className="hidden md:flex items-center gap-3 lg:gap-4 text-sm text-muted"
      aria-label="Main"
    >
      {GROUPS.map((grp) => (
        <div key={grp.label} className="relative group">
          <button
            type="button"
            className="inline-flex items-center gap-1 transition font-semibold cursor-pointer group-hover:text-text group-focus-within:text-text"
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
                       min-w-[260px] max-w-[340px] rounded-xl border border-border bg-panel/95 backdrop-blur shadow-2xl
                       transition duration-150
                       z-40"
            role="menu"
          >
            {/* Invisible hover bridge so the dropdown doesn't close when the cursor
                travels from the trigger to the panel (2px gap is enough to break it). */}
            <div className="absolute -top-2 inset-x-0 h-2" aria-hidden />

            <ul className="p-2">
              {grp.links.map((link) => (
                <li key={link.href + link.label} role="none">
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

      {/* Pro pill — subdued, discoverable. Amber dot + "Pro · €9" pricing
          disclosure (v19.2) removes the ambiguity between free-core hero
          copy and a bare "Pro" link that read as upsell-without-context. */}
      <a
        href="/pricing"
        className="ml-1 inline-flex items-center gap-1.5 text-muted hover:text-text transition font-semibold"
        aria-label="HoldLens Pro — optional €9/mo subscription"
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand/70" aria-hidden />
        <span>Pro</span>
        <span className="text-dim font-normal">· €9</span>
      </a>
      <GlobalSearch />
    </nav>
  );
}
