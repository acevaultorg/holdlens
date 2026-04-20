import type { Metadata } from "next";
import { topTickers, TICKER_INDEX } from "@/lib/tickers";
import { MANAGERS } from "@/lib/managers";
import { MANAGER_QUALITY } from "@/lib/signals";

// /compare — directory landing (v0.87). The parent `/compare` route
// previously 404'd even though `/compare/aapl-vs-googl` and
// `/compare/managers/warren-buffett-vs-bill-ackman` both resolve. Users
// hitting /compare from intuition, bookmarks, or trimmed URLs landed on
// the default Next.js 404 with no way forward. This landing page gives
// them the two real comparison surfaces: stock pairs and manager pairs,
// plus a curated starter grid so they don't have to hand-construct a URL.

export const metadata: Metadata = {
  title: "Compare — stocks + managers side-by-side",
  description:
    "Two ways to compare on HoldLens: stock pair (e.g. AAPL vs GOOGL) or manager pair (e.g. Buffett vs Ackman). Pick one and see hedge fund ownership overlap, shared tickers, and per-position conviction.",
};

export default function CompareIndex() {
  const topTix = topTickers(8);

  // Match `/compare/[pair]/page.tsx` TOP_N=15 so every curated stock pair
  // renders a link to a pre-rendered page (no 404 from a ticker outside the
  // generated top-15 × top-15 = 210 grid).
  const top15Symbols = new Set(topTickers(15).map((t) => t.symbol));
  const rawStockPairs: Array<[string, string]> = [
    ["AAPL", "GOOGL"],
    ["META", "AMZN"],
    ["NVDA", "MSFT"],
    ["JPM", "BAC"],
    ["V", "MA"],
    ["BRK.B", "AAPL"],
  ];
  const stockPairs = rawStockPairs.filter(
    ([a, b]) => top15Symbols.has(a) && top15Symbols.has(b),
  ).slice(0, 4);

  // Match `/compare/managers/[pair]/page.tsx` generateStaticParams — top 15
  // managers by quality ≥8. Anything else won't have a pre-rendered detail
  // page, so we never render a link outside that set.
  const top15Mgrs = MANAGERS
    .filter((m) => (MANAGER_QUALITY[m.slug] ?? 6) >= 8)
    .slice(0, 15);
  const managerPairs: [string, string][] = [];
  for (let i = 0; i < top15Mgrs.length && managerPairs.length < 8; i++) {
    for (let j = i + 1; j < top15Mgrs.length && managerPairs.length < 8; j++) {
      managerPairs.push([top15Mgrs[i].slug, top15Mgrs[j].slug]);
    }
  }
  const curatedMgrPairs = managerPairs.slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Compare · Two modes
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Compare side-by-side.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-12">
        Pick two stocks, or pick two managers. HoldLens shows exact hedge-fund
        ownership overlap, shared conviction, and the names only one side holds.
      </p>

      {/* Two-mode grid */}
      <div className="grid md:grid-cols-2 gap-5 mb-14">
        <a
          href="/compare/aapl-vs-googl"
          className="rounded-2xl border border-brand/30 bg-brand/5 p-6 hover:border-brand hover:bg-brand/10 transition block"
        >
          <div className="text-[10px] uppercase tracking-widest font-bold text-brand mb-2">
            Stock pair
          </div>
          <div className="text-xl font-bold mb-2">Two stocks, side-by-side</div>
          <p className="text-sm text-muted leading-relaxed mb-4">
            Compare owner counts, sector, conviction, and managers holding both.
            Format: <span className="font-mono text-text">/compare/TICKER-vs-TICKER</span>
          </p>
          <div className="text-brand text-sm font-semibold">Open AAPL vs GOOGL →</div>
        </a>

        <a
          href="/compare/managers"
          className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-6 hover:border-emerald-400 hover:bg-emerald-400/10 transition block"
        >
          <div className="text-[10px] uppercase tracking-widest font-bold text-emerald-400 mb-2">
            Manager pair
          </div>
          <div className="text-xl font-bold mb-2">Two managers, side-by-side</div>
          <p className="text-sm text-muted leading-relaxed mb-4">
            See which tickers both hold, overlap %, and the names only one side
            owns. Start from the overlap matrix or pick a pair directly.
          </p>
          <div className="text-emerald-400 text-sm font-semibold">Open overlap matrix →</div>
        </a>
      </div>

      {/* Curated stock pairs */}
      <section className="mb-14">
        <div className="flex items-end justify-between mb-5 flex-wrap gap-2">
          <div>
            <div className="text-[11px] uppercase tracking-widest font-bold text-brand mb-1">Popular stock pairs</div>
            <h2 className="text-2xl font-bold">Pick two — see who owns what</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stockPairs.map(([a, b]) => {
            const ta = TICKER_INDEX[a];
            const tb = TICKER_INDEX[b];
            return (
              <a
                key={`${a}-${b}`}
                href={`/compare/${a.toLowerCase()}-vs-${b.toLowerCase()}`}
                className="rounded-2xl border border-border bg-panel p-4 hover:border-brand/40 transition block"
              >
                <div className="font-mono font-bold text-base text-brand mb-1">
                  {a} <span className="text-dim font-sans">vs</span> {b}
                </div>
                <div className="text-xs text-muted leading-snug">
                  {ta?.name ?? a} · {tb?.name ?? b}
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Curated manager pairs */}
      <section className="mb-14">
        <div className="flex items-end justify-between mb-5 flex-wrap gap-2">
          <div>
            <div className="text-[11px] uppercase tracking-widest font-bold text-emerald-400 mb-1">Popular manager pairs</div>
            <h2 className="text-2xl font-bold">How much do they agree?</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {curatedMgrPairs.map(([a, b]) => {
            const ma = MANAGERS.find((m) => m.slug === a);
            const mb = MANAGERS.find((m) => m.slug === b);
            return (
              <a
                key={`${a}-${b}`}
                href={`/compare/managers/${a}-vs-${b}`}
                className="rounded-2xl border border-border bg-panel p-4 hover:border-emerald-400/60 transition block"
              >
                <div className="font-bold text-base text-text mb-1">
                  {ma?.name?.split(" ").slice(-1)[0] ?? a}{" "}
                  <span className="text-dim font-normal">vs</span>{" "}
                  {mb?.name?.split(" ").slice(-1)[0] ?? b}
                </div>
                <div className="text-xs text-muted leading-snug">
                  {ma?.fund} · {mb?.fund}
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Browse-more strip */}
      <section className="rounded-2xl border border-border bg-panel p-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <div className="text-[11px] uppercase tracking-widest font-bold text-brand mb-2">All stocks</div>
            <p className="text-sm text-muted mb-3">
              {Object.keys(TICKER_INDEX).length} tickers available. Pick any two.
            </p>
            <a href="/ticker" className="text-brand text-sm font-semibold hover:underline">
              Browse every stock →
            </a>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-widest font-bold text-emerald-400 mb-2">All managers</div>
            <p className="text-sm text-muted mb-3">
              {MANAGERS.length} superinvestors tracked. Overlap matrix shows every pair&rsquo;s shared count.
            </p>
            <a href="/overlap" className="text-emerald-400 text-sm font-semibold hover:underline">
              Open overlap matrix →
            </a>
          </div>
        </div>
      </section>

      <p className="text-xs text-dim mt-8 text-center">
        Ownership data derived from SEC Form 13F filings. Not investment advice.
      </p>
    </div>
  );
}
