import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import FoundersNudge from "@/components/FoundersNudge";
import CsvExportButton from "@/components/CsvExportButton";
import TickerLogo from "@/components/TickerLogo";
import { MERGED_MOVES, QUARTERS, QUARTER_LABELS, type Quarter } from "@/lib/moves";
import { MANAGERS } from "@/lib/managers";
import { TICKER_INDEX } from "@/lib/tickers";
import { getConviction, formatSignedScore } from "@/lib/conviction";

// /contrarian-bets — the disagreement signal.
//
// Tickers where, in the last 4 quarters of 13F filings, at least 2
// superinvestors were BUYING (new or add) AND at least 2 were SELLING
// (trim or exit) in roughly the same window. These are the tickers where
// smart money is actively arguing — the most interesting bets in the book.
//
// Dataroma shows you who owns what. It can't show you WHERE THE DEBATE IS.
// This page does.
//
// Server component — zero client JS.

export const metadata: Metadata = {
  title: "Contrarian bets — where smart money disagrees",
  description:
    "Tickers where ≥2 superinvestors are buying while ≥2 others are selling. The disagreement signal Dataroma can't show. Updated each filing cycle.",
  alternates: { canonical: "https://holdlens.com/contrarian-bets" },
  openGraph: {
    title: "HoldLens contrarian bets — where is smart money split?",
    description:
      "Tickers where tier-1 managers are actively arguing: ≥2 buying, ≥2 selling, last 4 quarters.",
    url: "https://holdlens.com/contrarian-bets",
    type: "article",
  },
  robots: { index: true, follow: true },
};

type ManagerMove = { slug: string; name: string; action: "buy" | "sell"; quarter: string };

type Contrarian = {
  ticker: string;
  name: string;
  buyers: ManagerMove[];
  sellers: ManagerMove[];
  convictionScore: number;
  total: number;
};

function lastFourQuarters(): Set<string> {
  return new Set<string>(QUARTERS.slice(0, 4));
}

function managerName(slug: string): string {
  return MANAGERS.find((m) => m.slug === slug)?.name ?? slug;
}

function computeContrarians(): Contrarian[] {
  const last4 = lastFourQuarters();

  // Bucket every move from last 4Q by ticker → { buyers: Set<slug>, sellers: Set<slug> }
  const bucket = new Map<
    string,
    { buyers: Map<string, string>; sellers: Map<string, string> }
  >();

  for (const mv of MERGED_MOVES) {
    if (!last4.has(mv.quarter)) continue;
    if (!bucket.has(mv.ticker)) {
      bucket.set(mv.ticker, { buyers: new Map(), sellers: new Map() });
    }
    const rec = bucket.get(mv.ticker)!;
    const isBuy = mv.action === "new" || mv.action === "add";
    const isSell = mv.action === "trim" || mv.action === "exit";
    if (isBuy) {
      // Keep the earliest (newest) quarter per manager
      if (!rec.buyers.has(mv.managerSlug)) rec.buyers.set(mv.managerSlug, mv.quarter);
    } else if (isSell) {
      if (!rec.sellers.has(mv.managerSlug)) rec.sellers.set(mv.managerSlug, mv.quarter);
    }
  }

  const out: Contrarian[] = [];
  for (const [ticker, rec] of bucket) {
    if (rec.buyers.size < 2 || rec.sellers.size < 2) continue;
    const td = TICKER_INDEX[ticker];
    const conv = getConviction(ticker);
    const buyers: ManagerMove[] = [];
    for (const [slug, quarter] of rec.buyers) {
      buyers.push({ slug, name: managerName(slug), action: "buy", quarter });
    }
    const sellers: ManagerMove[] = [];
    for (const [slug, quarter] of rec.sellers) {
      sellers.push({ slug, name: managerName(slug), action: "sell", quarter });
    }
    out.push({
      ticker,
      name: td?.name ?? ticker,
      buyers,
      sellers,
      convictionScore: conv.score,
      total: rec.buyers.size + rec.sellers.size,
    });
  }

  // Sort: most total disagreement activity first, break ties by absolute conviction
  out.sort(
    (a, b) => b.total - a.total || Math.abs(b.convictionScore) - Math.abs(a.convictionScore),
  );
  return out;
}

export default function ContrarianBetsPage() {
  const rows = computeContrarians();
  const top = rows.slice(0, 20);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Contrarian bets · where smart money is split
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Where is smart money arguing?
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        {rows.length} tickers where{" "}
        <span className="text-emerald-400 font-semibold">≥2 superinvestors were buying</span>{" "}
        while <span className="text-rose-400 font-semibold">≥2 others were selling</span>{" "}
        over the last 4 quarters. The active-disagreement signal.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-6">
        Consensus bets are safer but less interesting. Contrarian bets are where one side of
        the smart-money trade is wrong — and when a consensus forms, it moves the price.
      </p>
      <div className="mb-10 flex items-center gap-2 flex-wrap">
        <CsvExportButton
          endpoint="/api/v1/contrarian.json"
          filename="holdlens-contrarian"
          label="Export contrarian CSV"
        />
        <span className="text-xs text-dim">Free download — no signup.</span>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel p-10 text-center">
          <div className="text-lg font-semibold text-text mb-2">
            No open contrarian bets this window
          </div>
          <p className="text-sm text-dim max-w-md mx-auto">
            Smart money is unusually aligned across the tickers we track. Check back next
            filing cycle.
          </p>
        </div>
      ) : (
        <>
          {/* Top 3 cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {top.slice(0, 3).map((r) => (
              <ContrarianCard key={r.ticker} row={r} />
            ))}
          </div>

          {/* Full list */}
          <section className="mt-12">
            <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
              Full list · top 20
            </div>
            <h2 className="text-2xl font-bold mb-3">Every active debate</h2>
            <p className="text-muted text-sm mb-6 max-w-2xl">
              Sorted by total disagreement activity. Click any ticker for the full
              conviction breakdown.
            </p>
            <div className="space-y-3">
              {top.map((r) => (
                <ContrarianRow key={r.ticker} row={r} />
              ))}
            </div>
          </section>
        </>
      )}

      <FoundersNudge tone="brand" context="You're seeing where smart money actively disagrees — the most interesting bets on the table." />
      <AdSlot format="horizontal" />

      {/* Methodology */}
      <section className="mt-12 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          How we find contrarian bets
        </div>
        <h2 className="text-xl font-bold mb-3">
          Overlap of buyers and sellers, last 4 quarters
        </h2>
        <p className="text-sm text-muted leading-relaxed mb-3">
          We scan every distinct 13F move across the last 4 quarters ({" "}
          {QUARTERS.slice(0, 4)
            .map((q) => QUARTER_LABELS[q as Quarter])
            .join(", ")}
          ) for each ticker. A ticker qualifies as contrarian if ≥2 superinvestors were
          buying (new or add) AND ≥2 others were selling (trim or exit) in the same
          window.
        </p>
        <p className="text-sm text-muted leading-relaxed">
          This is the inverse of{" "}
          <a href="/crowded-trades" className="text-brand hover:underline">
            /crowded-trades
          </a>{" "}
          (where everyone is piled in the same direction). It&rsquo;s also the signal
          Dataroma can&rsquo;t show — their leaderboards don&rsquo;t cross-tab buyers and
          sellers.
        </p>
      </section>

      <p className="text-xs text-dim mt-12">
        Contrarian bets carry high variance — one side of every disagreement is wrong.
        Not investment advice.{" "}
        <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}

function ContrarianCard({ row }: { row: Contrarian }) {
  const tone =
    row.convictionScore >= 0 ? "border-emerald-400/30" : "border-rose-400/30";
  return (
    <a
      href={`/signal/${row.ticker}`}
      className={`block rounded-2xl border ${tone} bg-panel p-5 hover:opacity-90 transition`}
    >
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <TickerLogo symbol={row.ticker} size={22} />
          <div className="text-lg font-bold text-text">{row.ticker}</div>
        </div>
        <div
          className={`text-sm font-bold tabular-nums shrink-0 ${
            row.convictionScore >= 0 ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {formatSignedScore(row.convictionScore)}
        </div>
      </div>
      <div className="text-xs text-dim truncate mb-3">{row.name}</div>
      <div className="flex items-baseline gap-3 text-sm">
        <div>
          <span className="text-emerald-400 font-bold tabular-nums">{row.buyers.length}</span>{" "}
          <span className="text-[10px] uppercase tracking-wider text-dim">buy</span>
        </div>
        <div className="text-dim text-lg">·</div>
        <div>
          <span className="text-rose-400 font-bold tabular-nums">{row.sellers.length}</span>{" "}
          <span className="text-[10px] uppercase tracking-wider text-dim">sell</span>
        </div>
      </div>
    </a>
  );
}

function ContrarianRow({ row }: { row: Contrarian }) {
  const convTone = row.convictionScore >= 0 ? "text-emerald-400" : "text-rose-400";
  return (
    <div className="rounded-2xl border border-border bg-panel p-5 hover:bg-bg/30 transition">
      <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-baseline gap-3">
          <a
            href={`/signal/${row.ticker}`}
            className="text-xl font-bold text-text hover:text-brand transition"
          >
            {row.ticker}
          </a>
          <span className="text-xs text-dim truncate max-w-[16rem]">{row.name}</span>
        </div>
        <div className="flex items-baseline gap-3 text-xs">
          <span className={`font-bold tabular-nums ${convTone}`}>
            {formatSignedScore(row.convictionScore)}
          </span>
          <span className="text-dim uppercase tracking-wider">conviction</span>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-1">
            Buying ({row.buyers.length})
          </div>
          <div className="space-y-1">
            {row.buyers.slice(0, 5).map((b) => (
              <div key={b.slug} className="flex items-baseline justify-between">
                <a
                  href={`/investor/${b.slug}`}
                  className="text-text text-xs hover:text-brand transition truncate"
                >
                  {b.name}
                </a>
                <span className="text-[10px] text-dim tabular-nums">
                  {QUARTER_LABELS[b.quarter as Quarter] ?? b.quarter}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-rose-400 font-bold mb-1">
            Selling ({row.sellers.length})
          </div>
          <div className="space-y-1">
            {row.sellers.slice(0, 5).map((s) => (
              <div key={s.slug} className="flex items-baseline justify-between">
                <a
                  href={`/investor/${s.slug}`}
                  className="text-text text-xs hover:text-brand transition truncate"
                >
                  {s.name}
                </a>
                <span className="text-[10px] text-dim tabular-nums">
                  {QUARTER_LABELS[s.quarter as Quarter] ?? s.quarter}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
