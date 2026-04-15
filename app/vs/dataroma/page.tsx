import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";

// /vs/dataroma — the honest comparison.
//
// People searching "dataroma alternative", "dataroma vs X", or "free
// 13F tracker" land here. The goal is NOT to trash Dataroma — it's a
// respected free resource that pioneered this space. The goal is to
// show honestly where HoldLens adds something Dataroma doesn't.
//
// Every row is a specific, verifiable feature claim. If something we
// DON'T have, it's marked honestly so we don't look like dishonest
// marketing.

export const metadata: Metadata = {
  title: "HoldLens vs Dataroma — honest feature comparison",
  description:
    "An honest, feature-by-feature comparison of HoldLens and Dataroma for tracking superinvestors and 13F filings. Where does each one win?",
  alternates: { canonical: "https://holdlens.com/vs/dataroma" },
  openGraph: {
    title: "HoldLens vs Dataroma — feature comparison",
    description:
      "Honest comparison: where HoldLens adds forward-looking signals Dataroma can't show, and where Dataroma still wins.",
    url: "https://holdlens.com/vs/dataroma",
    type: "article",
  },
  robots: { index: true, follow: true },
};

type Comparison = {
  category: string;
  feature: string;
  description: string;
  holdlens: "yes" | "no" | "partial";
  dataroma: "yes" | "no" | "partial";
  href?: string;
  winner?: "holdlens" | "dataroma" | "tie";
};

const ROWS: Comparison[] = [
  // === Core coverage ===
  {
    category: "Core",
    feature: "13F holdings feed",
    description: "The basic table: who owns what, what %, latest filings.",
    holdlens: "yes",
    dataroma: "yes",
    winner: "tie",
  },
  {
    category: "Core",
    feature: "Recent activity stream",
    description: "All buys and sells in one chronological feed.",
    holdlens: "yes",
    dataroma: "yes",
    href: "/activity",
    winner: "tie",
  },
  {
    category: "Core",
    feature: "Historical filings archive",
    description: "Back-catalog of 13F quarters to walk portfolio history.",
    holdlens: "partial",
    dataroma: "yes",
    winner: "dataroma",
  },
  {
    category: "Core",
    feature: "Number of tracked managers",
    description: "How many portfolios are in the database.",
    holdlens: "partial",
    dataroma: "yes",
    winner: "dataroma",
  },

  // === Forward-looking signals (our wedge) ===
  {
    category: "Forward-looking",
    feature: "Unified −100..+100 ConvictionScore",
    description:
      "One signed number per ticker combining recent activity, insider data, multi-quarter trend, and crowding penalty.",
    holdlens: "yes",
    dataroma: "no",
    href: "/methodology",
    winner: "holdlens",
  },
  {
    category: "Forward-looking",
    feature: "Position-weighted conviction leaders",
    description:
      "Managers ranked by the weighted conviction of their top picks — whose portfolio the model agrees with right now.",
    holdlens: "yes",
    dataroma: "no",
    href: "/conviction-leaders",
    winner: "holdlens",
  },
  {
    category: "Forward-looking",
    feature: "Consensus picks (owners + conviction + flow)",
    description:
      "Tickers with ≥5 owners, positive conviction, and net-buying flow in the same window.",
    holdlens: "yes",
    dataroma: "no",
    href: "/consensus",
    winner: "holdlens",
  },
  {
    category: "Forward-looking",
    feature: "Contrarian bets (buyers vs sellers cross-tab)",
    description:
      "Tickers where ≥2 managers are buying while ≥2 others are selling. The disagreement signal.",
    holdlens: "yes",
    dataroma: "no",
    href: "/contrarian-bets",
    winner: "holdlens",
  },
  {
    category: "Forward-looking",
    feature: "Crowded trades with unwind warning",
    description:
      "Most-owned tickers split by recent buyer vs seller flow. Flags when a crowd starts to exit.",
    holdlens: "yes",
    dataroma: "no",
    href: "/crowded-trades",
    winner: "holdlens",
  },

  // === Manager metadata & rankings ===
  {
    category: "Rankings",
    feature: "Historical 10y alpha leaderboard",
    description: "Managers ranked by measurable alpha vs S&P 500.",
    holdlens: "yes",
    dataroma: "yes",
    href: "/leaderboard",
    winner: "tie",
  },
  {
    category: "Rankings",
    feature: "Skill × activity composite ranking",
    description:
      "Quiet alpha vs big names side by side, weighted by how actively the manager is currently trading.",
    holdlens: "yes",
    dataroma: "no",
    href: "/manager-rankings",
    winner: "holdlens",
  },
  {
    category: "Rankings",
    feature: "Portfolio concentration ranking",
    description:
      "Managers ranked by top-1/top-3/top-5 position weight — who's betting the farm vs diversifying.",
    holdlens: "yes",
    dataroma: "no",
    href: "/concentration",
    winner: "holdlens",
  },

  // === Ticker-level depth ===
  {
    category: "Signals",
    feature: "Per-ticker 8-quarter breadth sparkline",
    description:
      "True cumulative owner count over 8 quarters — is smart money quietly accumulating or quietly leaving?",
    holdlens: "yes",
    dataroma: "no",
    href: "/signal/AAPL",
    winner: "holdlens",
  },
  {
    category: "Signals",
    feature: "Per-ticker 8-quarter buy/sell sparkline",
    description:
      "8-quarter bar chart of distinct buyers above zero, distinct sellers below zero.",
    holdlens: "yes",
    dataroma: "no",
    winner: "holdlens",
  },
  {
    category: "Signals",
    feature: "Live quote + 52-week range on each signal page",
    description:
      "Current price and 52w range next to the conviction score, updated every 60 seconds.",
    holdlens: "yes",
    dataroma: "no",
    winner: "holdlens",
  },

  // === UX ===
  {
    category: "UX",
    feature: "Modern mobile-responsive design",
    description: "Works on phone without zooming or pinching.",
    holdlens: "yes",
    dataroma: "partial",
    winner: "holdlens",
  },
  {
    category: "UX",
    feature: "Dark mode by default",
    description: "Easier on the eyes for long research sessions.",
    holdlens: "yes",
    dataroma: "no",
    winner: "holdlens",
  },
  {
    category: "UX",
    feature: "Global keyboard search",
    description: "Jump to any ticker or manager without navigating.",
    holdlens: "yes",
    dataroma: "partial",
    winner: "holdlens",
  },

  // === Cost ===
  {
    category: "Cost",
    feature: "Free tier",
    description: "All core data accessible without a login.",
    holdlens: "yes",
    dataroma: "yes",
    winner: "tie",
  },
  {
    category: "Cost",
    feature: "Pro tier with extra features",
    description: "Watchlists, alerts, backtests, API access.",
    holdlens: "yes",
    dataroma: "no",
    href: "/pricing",
    winner: "holdlens",
  },
];

function Mark({ state }: { state: "yes" | "no" | "partial" }) {
  if (state === "yes") {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-400/15 border border-emerald-400/40 text-emerald-400 text-sm font-bold">
        ✓
      </span>
    );
  }
  if (state === "no") {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-400/10 border border-rose-400/30 text-rose-400/80 text-sm">
        ·
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-bg/40 border border-border text-dim text-[10px] font-semibold">
      ~
    </span>
  );
}

export default function VsDataromaPage() {
  const categories = [...new Set(ROWS.map((r) => r.category))];
  const holdlensWins = ROWS.filter((r) => r.winner === "holdlens").length;
  const dataromaWins = ROWS.filter((r) => r.winner === "dataroma").length;
  const ties = ROWS.filter((r) => r.winner === "tie").length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Honest comparison · no marketing spin
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        HoldLens vs Dataroma
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        Two tools for tracking superinvestors. One pioneered the space. The other adds a
        forward-looking smart-money model and a modern UX.{" "}
        <span className="text-text font-semibold">
          {holdlensWins} wins · {dataromaWins} wins · {ties} ties
        </span>
        .
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        Every row is a concrete feature, not a vague claim. If we don&rsquo;t have
        something Dataroma has, we mark it honestly — so you can pick the right tool for
        your job.
      </p>

      {/* Score summary */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-brand">{holdlensWins}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            HoldLens wins
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-5">
          <div className="text-3xl font-bold tabular-nums text-text">{ties}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Ties
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-5">
          <div className="text-3xl font-bold tabular-nums text-muted">{dataromaWins}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Dataroma wins
          </div>
        </div>
      </div>

      {/* Feature tables by category */}
      {categories.map((cat) => {
        const rows = ROWS.filter((r) => r.category === cat);
        return (
          <section key={cat} className="mb-10">
            <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
              {cat}
            </div>
            <div className="rounded-2xl border border-border bg-panel overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-bg/40 border-b border-border">
                  <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                    <th className="px-4 py-3 text-left">Feature</th>
                    <th className="px-3 py-3 text-center w-24">HoldLens</th>
                    <th className="px-3 py-3 text-center w-24">Dataroma</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.feature}
                      className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-baseline gap-2">
                          {r.href ? (
                            <a
                              href={r.href}
                              className="font-semibold text-text hover:text-brand transition"
                            >
                              {r.feature}
                            </a>
                          ) : (
                            <span className="font-semibold text-text">{r.feature}</span>
                          )}
                          {r.winner === "holdlens" && (
                            <span className="text-[9px] uppercase tracking-wider font-bold text-brand bg-brand/10 border border-brand/30 rounded px-1.5 py-0.5">
                              HoldLens wins
                            </span>
                          )}
                          {r.winner === "dataroma" && (
                            <span className="text-[9px] uppercase tracking-wider font-bold text-muted bg-bg/40 border border-border rounded px-1.5 py-0.5">
                              Dataroma wins
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted mt-1 max-w-xl">
                          {r.description}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center">
                        <Mark state={r.holdlens} />
                      </td>
                      <td className="px-3 py-4 text-center">
                        <Mark state={r.dataroma} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      <AdSlot format="horizontal" />

      {/* Summary */}
      <section className="mt-12 rounded-2xl border border-brand/30 bg-brand/5 p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          Bottom line
        </div>
        <h2 className="text-xl font-bold mb-3">Which should you use?</h2>
        <ul className="text-sm text-muted space-y-3 leading-relaxed">
          <li>
            <span className="text-text font-semibold">Use Dataroma when</span> you want a
            deep historical archive of every 13F filing across a large manager catalog,
            pure as-filed data, no editorial scoring.
          </li>
          <li>
            <span className="text-text font-semibold">Use HoldLens when</span> you want a
            forward-looking smart-money signal: a unified conviction score, consensus
            picks, contrarian bets, crowded-trade warnings, and a modern mobile UX.
          </li>
          <li>
            <span className="text-brand font-semibold">Use both</span> for the complete
            picture — Dataroma for the archive, HoldLens for the active signal.
          </li>
        </ul>
      </section>

      <p className="text-xs text-dim mt-12">
        Last updated {new Date().toISOString().slice(0, 10)}. Comparison is fact-based; if
        you spot an error, email us at hello@holdlens.com and we&rsquo;ll fix it within a
        business day. Not affiliated with Dataroma.
      </p>
    </div>
  );
}
