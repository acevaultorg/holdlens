import Link from "next/link";
import {
  CURATED_EVENTS,
  EVENT_ITEMS_BY_CODE,
  fmtEventDate,
  getRecentEvents,
} from "@/lib/events";
import TickerLogo from "@/components/TickerLogo";

// <RecentMaterialEvents /> — homepage prominence widget for SEC 8-K material
// events. Third and last freshness layer in the HoldLens SEC Signals trilogy:
//
//   <LatestMoves />          — 13F, quarterly       (existing)
//   <LiveInsiderActivity />  — Form 4, daily        (InsiderLens Day-1)
//   <RecentMaterialEvents /> — 8-K, intra-day       (THIS WIDGET, Ship #7 Day-1)
//
// Sits directly after <LiveInsiderActivity /> and before the signal explorer
// grid. Purpose: make the full SEC Signals trilogy visible above the fold so
// a homepage visitor understands HoldLens tracks every angle of smart-money
// disclosure — positions (13F), people (Form 4), and events (8-K).
//
// Server component, zero client JS, works in static export. Reads curated
// CURATED_EVENTS today; Day-2 EDGAR scraper swap changes nothing here — same
// Form8KEvent shape flows through.

export default function RecentMaterialEvents() {
  // Most-recent 5 material events across all tracked tickers.
  const events = getRecentEvents(5);

  const totalEvents = CURATED_EVENTS.length;
  const distinctTickers = new Set(CURATED_EVENTS.map((e) => e.ticker.toUpperCase())).size;
  const distinctItemCodes = new Set(CURATED_EVENTS.map((e) => e.itemCode)).size;

  const freshest = events[0];
  const freshLabel = freshest ? fmtEventDate(freshest.filedAt) : "—";

  return (
    <section className="py-12 border-t border-border">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-xs uppercase tracking-widest text-brand font-semibold">
              Every material event, from the filing
            </div>
            {/* LIVE badge — the strongest freshness signal on the homepage.
                Only 8-K events can fire intra-day (vs daily Form 4 / quarterly
                13F). The color grammar mirrors the other two trilogy widgets:
                emerald = positive/freshness, rose = negative, brand = live. */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 border border-brand/30 px-2 py-0.5 text-[10px] uppercase tracking-widest text-brand font-bold">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand"></span>
              </span>
              Live
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Latest material events</h2>
          <p className="text-muted mt-2 max-w-2xl">
            Every public company must disclose material events on SEC Form 8-K within 4
            business days — bankruptcies, cybersecurity incidents, M&amp;A, CEO changes,
            earnings. We classify + score each one with the branded{" "}
            <strong className="text-text">EventScore</strong>.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest text-dim font-semibold">
            Freshest tracked
          </div>
          <div className="text-sm font-mono text-text tabular-nums">{freshLabel}</div>
        </div>
      </div>

      {/* Summary trio mirrors the pattern used by LiveInsiderActivity so the
          trilogy reads as visually coupled. */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="rounded-xl border border-brand/30 bg-brand/5 px-4 py-3">
          <div className="text-[10px] uppercase tracking-widest text-brand font-bold mb-1">
            Events tracked
          </div>
          <div className="text-2xl font-bold text-text tabular-nums">{totalEvents}</div>
          <div className="text-[11px] text-dim mt-0.5">{distinctTickers} companies</div>
        </div>
        <div className="rounded-xl border border-border bg-panel px-4 py-3">
          <div className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">
            Item types
          </div>
          <div className="text-2xl font-bold text-text tabular-nums">{distinctItemCodes}</div>
          <div className="text-[11px] text-dim mt-0.5">distinct categories</div>
        </div>
        <div className="rounded-xl border border-border bg-panel px-4 py-3">
          <div className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">
            Refresh cadence
          </div>
          <div className="text-2xl font-bold text-text tabular-nums">Intra-day</div>
          <div className="text-[11px] text-dim mt-0.5">vs daily Form 4 · quarterly 13F</div>
        </div>
      </div>

      {/* Latest-events table — each row links to the per-company events page
          (where the full 8-K timeline lives) and to the per-item-type page
          (e.g., all cybersecurity incidents). */}
      {events.length > 0 && (
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-dim text-[10px] uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-semibold">Ticker</th>
                <th className="text-left px-4 py-3 font-semibold">Event</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">
                  Item
                </th>
                <th className="text-right px-4 py-3 font-semibold hidden sm:table-cell">
                  Filed
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((e, i) => {
                const meta = EVENT_ITEMS_BY_CODE[e.itemCode];
                return (
                  <tr
                    key={`event-${e.ticker}-${e.filedAt}-${i}`}
                    className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/events/company/${e.ticker.toLowerCase()}/`}
                        className="inline-flex items-center gap-2 font-mono font-bold text-brand hover:underline"
                      >
                        <TickerLogo symbol={e.ticker} size={20} />
                        {e.ticker}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-text">
                      <Link
                        href={`/events/company/${e.ticker.toLowerCase()}/`}
                        className="hover:underline"
                      >
                        {e.headline}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted text-xs hidden md:table-cell">
                      <Link
                        href={`/events/type/${meta.slug}/`}
                        className="inline-block rounded border border-border/60 bg-bg/40 px-2 py-0.5 text-[10px] uppercase tracking-wider hover:border-brand/40 hover:text-text transition"
                      >
                        {e.itemCode} · {meta.label}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[11px] text-dim whitespace-nowrap hidden sm:table-cell">
                      {fmtEventDate(e.filedAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <Link
          href="/events/live/"
          className="group flex-1 inline-flex items-center justify-between rounded-xl border border-brand/40 bg-brand/5 px-5 py-4 hover:bg-brand/10 hover:border-brand/60 transition"
        >
          <div>
            <div className="font-semibold text-text">Live events firehose</div>
            <div className="text-xs text-muted mt-0.5">
              Every tracked 8-K filing, newest first
            </div>
          </div>
          <span
            aria-hidden
            className="text-brand transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
        <Link
          href="/events/"
          className="group flex-1 inline-flex items-center justify-between rounded-xl border border-border bg-panel px-5 py-4 hover:border-border-bright transition"
        >
          <div>
            <div className="font-semibold text-text">EventScore methodology</div>
            <div className="text-xs text-muted mt-0.5">
              How material events are classified + scored
            </div>
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
