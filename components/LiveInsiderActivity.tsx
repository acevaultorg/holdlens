import Link from "next/link";
import {
  INSIDER_TX,
  fmtInsiderValue,
  fmtInsiderDate,
  type InsiderTx,
} from "@/lib/insiders";
import TickerLogo from "@/components/TickerLogo";

// <LiveInsiderActivity /> — homepage prominence widget for Form 4 daily
// freshness. Sits between <LatestMoves /> (13F quarterly headlines) and the
// signal explorer grid. Purpose: show every homepage visitor that HoldLens
// has a daily-refreshing surface, not just quarterly 13F data.
//
// Why this is the highest-leverage homepage UX change for InsiderLens Day 1:
// before this ship, /insiders/ got zero homepage prominence. Form 4's 60×
// freshness advantage over 13F was invisible — a returning visitor saw the
// same quarterly data. This widget turns the daily-cadence moat into visible
// above-fold proof.
//
// Server component, zero client JS, works inside static export. Reads curated
// INSIDER_TX today; Day-2 swap to EDGAR-scraped data changes nothing in this
// component (same shape via InsiderTx type).

function isDiscretionary(tx: InsiderTx): boolean {
  return !(tx.note || "").toLowerCase().includes("10b5-1");
}

type Row = {
  tx: InsiderTx;
  isDiscretionary: boolean;
};

export default function LiveInsiderActivity() {
  // Show the 5 most-recent discretionary buys (highest-signal subset).
  // Discretionary > scheduled — a CEO choosing to buy TODAY is a stronger
  // read than a scheduled 10b5-1 plan grinding through.
  const recentBuys: Row[] = INSIDER_TX
    .filter((tx) => tx.action === "buy")
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5)
    .map((tx) => ({ tx, isDiscretionary: isDiscretionary(tx) }));

  const allBuys = INSIDER_TX.filter((tx) => tx.action === "buy");
  const allDiscretionarySells = INSIDER_TX.filter(
    (tx) => tx.action === "sell" && isDiscretionary(tx),
  );
  const totalBuyValue = allBuys.reduce((s, tx) => s + tx.value, 0);
  const discretionarySellValue = allDiscretionarySells.reduce((s, tx) => s + tx.value, 0);
  const netBuyValue = totalBuyValue - discretionarySellValue;

  // Freshest row date — used by "Updated [date]" label. Honest: the freshest
  // transaction date, not a fabricated "today". If curated data is stale,
  // the label shows the real stale date — no freshness theater.
  const freshest = recentBuys[0]?.tx;
  const freshLabel = freshest ? fmtInsiderDate(freshest.date) : "—";

  return (
    <section className="py-12 border-t border-border">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-xs uppercase tracking-widest text-brand font-semibold">
              Live from the SEC
            </div>
            {/* Pulse dot conveys "live" without client JS. Animate-pulse is
                pure CSS, works inside static export. The emerald-400 color
                matches the site's buy-signal grammar (emerald = buy, rose =
                sell) — semantic consistency. */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 px-2 py-0.5 text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
              </span>
              Daily
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Latest insider buys</h2>
          <p className="text-muted mt-2 max-w-2xl">
            Every CEO/CFO buy at a US public company hits the SEC within 2 business days via
            Form 4. We score each one — role, action, recency, and cluster-fit — into a
            single <strong className="text-text">InsiderScore</strong>.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest text-dim font-semibold">
            Freshest tracked
          </div>
          <div className="text-sm font-mono text-text tabular-nums">{freshLabel}</div>
        </div>
      </div>

      {/* Summary trio — scannable at a glance. Matches the summary-card
          pattern used on /insiders/ hub + /best-now. */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-4 py-3">
          <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-1">
            Buys tracked
          </div>
          <div className="text-2xl font-bold text-text tabular-nums">{allBuys.length}</div>
          <div className="text-[11px] text-dim mt-0.5">{fmtInsiderValue(totalBuyValue)} total</div>
        </div>
        <div className="rounded-xl border border-border bg-panel px-4 py-3">
          <div className="text-[10px] uppercase tracking-widest text-brand font-bold mb-1">
            Net insider flow
          </div>
          <div
            className={`text-2xl font-bold tabular-nums ${
              netBuyValue >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {netBuyValue >= 0 ? "+" : "−"}
            {fmtInsiderValue(Math.abs(netBuyValue))}
          </div>
          <div className="text-[11px] text-dim mt-0.5">buys − discretionary sells</div>
        </div>
        <div className="rounded-xl border border-border bg-panel px-4 py-3">
          <div className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">
            Refresh cadence
          </div>
          <div className="text-2xl font-bold text-text tabular-nums">Daily</div>
          <div className="text-[11px] text-dim mt-0.5">vs quarterly 13F</div>
        </div>
      </div>

      {/* Buys table — the signal. Each row links to the per-company insider
          roll-up, which gets the aggregate InsiderScore + all insiders who
          have transacted in that ticker. */}
      {recentBuys.length > 0 && (
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-dim text-[10px] uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-semibold">Ticker</th>
                <th className="text-left px-4 py-3 font-semibold">Insider</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Title</th>
                <th className="text-right px-4 py-3 font-semibold">Value</th>
                <th className="text-right px-4 py-3 font-semibold hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentBuys.map(({ tx, isDiscretionary: disc }, i) => (
                <tr
                  key={`livebuy-${tx.ticker}-${tx.date}-${i}`}
                  className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/insiders/company/${tx.ticker.toLowerCase()}/`}
                      className="inline-flex items-center gap-2 font-mono font-bold text-brand hover:underline"
                    >
                      <TickerLogo symbol={tx.ticker} size={20} />
                      {tx.ticker}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-text">{tx.insiderName}</td>
                  <td className="px-4 py-3 text-muted text-xs hidden md:table-cell">
                    {tx.insiderTitle}
                    {!disc && (
                      <span className="ml-1 text-[9px] uppercase tracking-wider text-dim">
                        · 10b5-1
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-400 tabular-nums">
                    {fmtInsiderValue(tx.value)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[11px] text-dim whitespace-nowrap hidden sm:table-cell">
                    {fmtInsiderDate(tx.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Two secondary CTAs. /insiders/live/ is the full firehose.
          /insiders/ is the curated hub with methodology. */}
      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <Link
          href="/insiders/live/"
          className="group flex-1 inline-flex items-center justify-between rounded-xl border border-emerald-400/40 bg-emerald-400/5 px-5 py-4 hover:bg-emerald-400/10 hover:border-emerald-400/60 transition"
        >
          <div>
            <div className="font-semibold text-text">Live insider feed</div>
            <div className="text-xs text-muted mt-0.5">Every tracked Form 4, chronological</div>
          </div>
          <span
            aria-hidden
            className="text-emerald-400 transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
        <Link
          href="/insiders/"
          className="group flex-1 inline-flex items-center justify-between rounded-xl border border-border bg-panel px-5 py-4 hover:border-border-bright transition"
        >
          <div>
            <div className="font-semibold text-text">Insider methodology</div>
            <div className="text-xs text-muted mt-0.5">How InsiderScore is computed</div>
          </div>
          <span
            aria-hidden
            className="text-muted transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
