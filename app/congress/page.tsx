import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import TickerLogo from "@/components/TickerLogo";
import {
  CONGRESS_MEMBERS,
  topByActivity,
  topNetBuyers,
  byChamber,
  byParty,
  recentTradesAll,
  formatRange,
  formatAmount,
} from "@/lib/congress";

// /congress/ — landing for the Congressional Stock Trades sub-vertical.
// The retail-investor question this answers: "what is Congress trading?"
// Per the STOCK Act (2012) every member of the House and Senate must
// disclose stock transactions within 45 days. We aggregate the most-active
// traders + most-recent disclosures.

export const metadata: Metadata = {
  title:
    "Congressional Stock Trade Tracker — STOCK Act disclosures from House + Senate",
  description:
    "Every disclosed stock trade by U.S. House and Senate members under the STOCK Act. Pelosi, Tuberville, McCaul, Khanna, and more — sortable by activity, party, chamber, recency. Sourced from the official House Clerk and Senate eFD.",
  alternates: { canonical: "https://holdlens.com/congress" },
  openGraph: {
    title: "HoldLens Congress Tracker — STOCK Act disclosures",
    description:
      "Disclosed stock trades by U.S. House + Senate members under the STOCK Act.",
    url: "https://holdlens.com/congress",
    type: "article",
    images: [
      { url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens" },
    ],
  },
  robots: { index: true, follow: true },
};

export default function CongressLanding() {
  const topActivity = topByActivity(8);
  const topBuyers = topNetBuyers(6);
  const recentTrades = recentTradesAll(12);
  const senate = byChamber("Senate");
  const house = byChamber("House");
  const democrat = byParty("D");
  const republican = byParty("R");

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Congressional Stock Trade Tracker",
    description:
      "STOCK Act-disclosed stock trades by U.S. House and Senate members.",
    url: "https://holdlens.com/congress",
    numberOfItems: CONGRESS_MEMBERS.length,
    isPartOf: {
      "@type": "WebSite",
      name: "HoldLens",
      url: "https://holdlens.com",
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Congress", item: "https://holdlens.com/congress" },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Congressional trades · STOCK Act disclosure
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        What is Congress trading?
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-8">
        Every U.S. House and Senate member must disclose stock transactions
        within 45 days under the STOCK Act of 2012. We aggregate the most
        active traders, recent trades, and per-member portfolios across both
        chambers — sourced directly from the House Clerk and Senate Office of
        Public Records.
      </p>

      <aside
        className="mt-2 mb-12 rounded-card border border-insight/30 bg-surface-insight p-4"
        aria-label="HoldLens read on congressional trades"
      >
        <div className="text-[10px] uppercase tracking-widest text-insight font-bold mb-1.5">
          HoldLens read
        </div>
        <p className="text-sm text-text leading-relaxed">
          {CONGRESS_MEMBERS.length} members tracked — {senate.length} Senate,{" "}
          {house.length} House · {democrat.length} D, {republican.length} R.
          Most active disclosed trader on the list:{" "}
          <span className="font-bold">{topActivity[0].name}</span> with roughly{" "}
          <span className="font-bold tabular-nums">
            {formatAmount(
              topActivity[0].estimatedNetBuysUsdLow +
                topActivity[0].estimatedNetSellsUsdLow,
            )}
          </span>{" "}
          in disclosed trading activity. STOCK Act discloses dollar
          <em>ranges</em> — not exact amounts — so estimates use the bracket
          low end.
        </p>
      </aside>

      {/* Most active */}
      <section className="mb-14">
        <div className="flex items-end justify-between mb-5 flex-wrap gap-2">
          <div>
            <div className="text-[11px] uppercase tracking-widest font-bold text-brand mb-1">
              Most active disclosures
            </div>
            <h2 className="text-2xl font-bold">Top by trading activity</h2>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Member</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Chamber</th>
                <th className="px-4 py-3 text-right">Activity</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Net buys</th>
              </tr>
            </thead>
            <tbody>
              {topActivity.map((m, i) => (
                <tr
                  key={m.slug}
                  className="border-b border-border last:border-0 hover:bg-bg/30 transition"
                >
                  <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`/congress/${m.slug}/`}
                      className="font-semibold text-text hover:text-brand"
                    >
                      {m.name}
                    </a>
                    <div className="text-[11px] text-dim">
                      {m.chamber} · {m.party}-{m.state}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted hidden sm:table-cell">
                    <PartyPill party={m.party} />
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold">
                    {formatAmount(
                      m.estimatedNetBuysUsdLow + m.estimatedNetSellsUsdLow,
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums hidden md:table-cell">
                    <span
                      className={
                        m.estimatedNetBuysUsdLow > m.estimatedNetSellsUsdLow
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }
                    >
                      {formatAmount(
                        m.estimatedNetBuysUsdLow - m.estimatedNetSellsUsdLow,
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AdSlot format="horizontal" />

      {/* Recent trades */}
      <section className="my-14">
        <div className="mb-5">
          <div className="text-[11px] uppercase tracking-widest font-bold text-brand mb-1">
            Latest disclosures
          </div>
          <h2 className="text-2xl font-bold">Recent congressional trades</h2>
        </div>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">Member</th>
                <th className="px-4 py-3 text-left">Ticker</th>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Range</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Trade date</th>
              </tr>
            </thead>
            <tbody>
              {recentTrades.map((t, i) => (
                <tr
                  key={`${t.memberSlug}-${t.transactionDate}-${t.ticker}-${i}`}
                  className="border-b border-border last:border-0 hover:bg-bg/30 transition"
                >
                  <td className="px-4 py-3">
                    <a href={`/congress/${t.memberSlug}/`} className="font-semibold text-text hover:text-brand">
                      {t.memberName}
                    </a>
                    <div className="text-[11px] text-dim">
                      {t.chamber} · {t.party}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`/ticker/${t.ticker}/`}
                      className="inline-flex items-center gap-2 font-mono font-bold text-brand hover:underline"
                    >
                      <TickerLogo symbol={t.ticker} size={20} />
                      {t.ticker}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <ActionPill action={t.action} />
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums hidden sm:table-cell">
                    {formatRange(t.amountRangeMin, t.amountRangeMax)}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-muted tabular-nums hidden md:table-cell">
                    {t.transactionDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Net buyers */}
      <section className="my-14">
        <div className="mb-5">
          <div className="text-[11px] uppercase tracking-widest font-bold text-emerald-400 mb-1">
            Most net-bullish
          </div>
          <h2 className="text-2xl font-bold">Top net buyers</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topBuyers.map((m) => (
            <a
              key={m.slug}
              href={`/congress/${m.slug}/`}
              className="block rounded-2xl border border-border bg-panel p-5 hover:border-brand/40 transition"
            >
              <div className="text-sm font-bold text-text mb-1">{m.name}</div>
              <div className="text-[11px] text-dim mb-3">
                {m.chamber} · {m.party}-{m.state}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-dim mb-1">
                Net buys (low end)
              </div>
              <div className="text-2xl font-bold tabular-nums text-emerald-400">
                {formatAmount(
                  Math.max(
                    0,
                    m.estimatedNetBuysUsdLow - m.estimatedNetSellsUsdLow,
                  ),
                )}
              </div>
              <div className="text-[11px] text-dim mt-2 truncate">
                {m.topSectors.join(" · ")}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-border bg-panel p-6">
        <h2 className="text-lg font-bold mb-3">How to read this data</h2>
        <p className="text-sm text-muted leading-relaxed mb-3">
          The <strong>STOCK Act of 2012</strong> requires every U.S.
          Congressmember (and certain executive-branch officials) to file
          Periodic Transaction Reports for every stock, bond, or
          futures-and-options trade above $1,000 within 45 days.
          Disclosures are filed in dollar <em>ranges</em>, not exact amounts —
          so estimates use the bracket low end conservatively.
        </p>
        <p className="text-sm text-muted leading-relaxed mb-4">
          Spouses and dependent children's trades are also disclosed. Some
          members hold portfolios in qualified blind trusts where they
          theoretically don't direct transactions — but trust trades still
          appear in disclosure.
        </p>
        <div className="flex gap-3 flex-wrap text-sm">
          <a href="/learn/congressional-stock-trading-stock-act" className="text-brand hover:underline">
            → How the STOCK Act works
          </a>
          <a href="/insiders" className="text-brand hover:underline">
            → Corporate insider trades (Form 4)
          </a>
        </div>
      </section>
    </div>
  );
}

function PartyPill({ party }: { party: "D" | "R" | "I" }) {
  const styles = {
    D: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    R: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    I: "bg-dim/10 text-dim border-dim/30",
  };
  return (
    <span
      className={`inline-block text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${styles[party]}`}
    >
      {party}
    </span>
  );
}

function ActionPill({
  action,
}: {
  action: "buy" | "sell" | "exchange" | "partial-sell";
}) {
  const styles: Record<string, string> = {
    buy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    sell: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    exchange: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    "partial-sell": "bg-rose-500/10 text-rose-400 border-rose-500/30",
  };
  return (
    <span
      className={`inline-block text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${styles[action]}`}
    >
      {action}
    </span>
  );
}
