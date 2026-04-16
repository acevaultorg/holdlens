import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import {
  MERGED_MOVES,
  QUARTERS,
  QUARTER_LABELS,
  QUARTER_FILED,
  type Quarter,
  type Move,
} from "@/lib/moves";
import { MANAGERS } from "@/lib/managers";
import { TICKER_INDEX } from "@/lib/tickers";
import { getConviction, formatSignedScore } from "@/lib/conviction";

// /quarter/[slug] — time-boxed quarter snapshot. Dataroma's historical archive
// has always been its biggest moat. These pages close the gap by giving each
// of the last 8 tracked quarters its own URL + a full digest of what smart
// money did that quarter: top new positions, top adds, top trims, top exits,
// active managers, most-traded tickers, and sector net flow.
//
// URL shape matches search intent: /quarter/2025-q3 — i.e. "13f q3 2025".

function slugToQuarter(slug: string): Quarter | null {
  // slug looks like "2025-q3" → match QUARTERS (format "2025-Q3")
  const upper = slug.toUpperCase();
  return (QUARTERS as readonly string[]).includes(upper) ? (upper as Quarter) : null;
}

function quarterToSlug(q: Quarter): string {
  return q.toLowerCase();
}

export async function generateStaticParams() {
  return QUARTERS.map((q) => ({ slug: quarterToSlug(q) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const q = slugToQuarter(slug);
  if (!q) return { title: "Quarter not found" };
  const label = QUARTER_LABELS[q];
  return {
    title: `${label} superinvestor 13F digest · top buys, exits, and new positions`,
    description: `Every tracked 13F move filed in ${label}: top new positions, biggest adds, full exits, sector net flow, and which managers were most active.`,
    alternates: { canonical: `https://holdlens.com/quarter/${slug}` },
    openGraph: {
      title: `${label} · HoldLens quarter digest`,
      description: `Smart-money 13F recap for ${label}: what they bought, sold, and exited.`,
      url: `https://holdlens.com/quarter/${slug}`,
      type: "article",
    },
    robots: { index: true, follow: true },
  };
}

type ManagerActivity = {
  slug: string;
  name: string;
  fund: string;
  moves: number;
  buys: number;
  sells: number;
};

type TickerActivity = {
  ticker: string;
  name: string;
  sector?: string;
  buyers: number;
  sellers: number;
  conviction: number;
};

export default async function QuarterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const quarter = slugToQuarter(slug);
  if (!quarter) notFound();

  const label = QUARTER_LABELS[quarter];
  const filedAt = QUARTER_FILED[quarter];
  const moves: Move[] = MERGED_MOVES.filter((m) => m.quarter === quarter);
  if (moves.length === 0) notFound();

  // --- buckets by action ---
  const news = moves.filter((m) => m.action === "new");
  const adds = moves.filter((m) => m.action === "add");
  const trims = moves.filter((m) => m.action === "trim");
  const exits = moves.filter((m) => m.action === "exit");

  const buyCount = news.length + adds.length;
  const sellCount = trims.length + exits.length;
  const netAction = buyCount - sellCount;
  const uniqueTickers = new Set(moves.map((m) => m.ticker)).size;
  const activeManagers = new Set(moves.map((m) => m.managerSlug)).size;

  // --- top active managers in this quarter ---
  const managerMap = new Map<string, ManagerActivity>();
  for (const m of moves) {
    const rec =
      managerMap.get(m.managerSlug) ??
      (() => {
        const mgr = MANAGERS.find((x) => x.slug === m.managerSlug);
        return {
          slug: m.managerSlug,
          name: mgr?.name ?? m.managerSlug,
          fund: mgr?.fund ?? "",
          moves: 0,
          buys: 0,
          sells: 0,
        };
      })();
    rec.moves += 1;
    if (m.action === "new" || m.action === "add") rec.buys += 1;
    else rec.sells += 1;
    managerMap.set(m.managerSlug, rec);
  }
  const topManagers = Array.from(managerMap.values())
    .sort((a, b) => b.moves - a.moves)
    .slice(0, 10);

  // --- most-traded tickers in this quarter ---
  const tickerMap = new Map<string, TickerActivity>();
  for (const m of moves) {
    const rec =
      tickerMap.get(m.ticker) ??
      (() => {
        const td = TICKER_INDEX[m.ticker];
        return {
          ticker: m.ticker,
          name: m.name ?? td?.name ?? m.ticker,
          sector: td?.sector,
          buyers: 0,
          sellers: 0,
          conviction: getConviction(m.ticker).score,
        };
      })();
    if (m.action === "new" || m.action === "add") rec.buyers += 1;
    else rec.sellers += 1;
    tickerMap.set(m.ticker, rec);
  }
  const topTraded = Array.from(tickerMap.values())
    .sort((a, b) => b.buyers + b.sellers - (a.buyers + a.sellers))
    .slice(0, 15);

  // --- sector net flow (quick aggregate) ---
  const sectorMap = new Map<string, { buys: number; sells: number }>();
  for (const m of moves) {
    const sector = TICKER_INDEX[m.ticker]?.sector ?? "Other";
    const rec = sectorMap.get(sector) ?? { buys: 0, sells: 0 };
    if (m.action === "new" || m.action === "add") rec.buys += 1;
    else rec.sells += 1;
    sectorMap.set(sector, rec);
  }
  const sectorRows = Array.from(sectorMap.entries())
    .map(([name, v]) => ({ name, ...v, net: v.buys - v.sells }))
    .sort((a, b) => b.net - a.net);

  // --- adjacent quarters for nav ---
  const idx = QUARTERS.indexOf(quarter);
  const prev = idx + 1 < QUARTERS.length ? QUARTERS[idx + 1] : null; // older
  const next = idx > 0 ? QUARTERS[idx - 1] : null; // newer

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <a href="/this-week" className="text-xs text-muted hover:text-text">← Activity feed</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-3">
        Quarter digest
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        {label} — superinvestor 13F recap
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        {moves.length} tracked 13F moves filed by{" "}
        <span className="text-text font-semibold">{activeManagers}</span> managers across{" "}
        <span className="text-text font-semibold">{uniqueTickers}</span> tickers. Filed with
        the SEC on <span className="text-text">{filedAt}</span>.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        {news.length} new positions · {adds.length} adds · {trims.length} trims ·{" "}
        <span className="text-rose-400">{exits.length} exits</span>. Net action:{" "}
        <span
          className={`font-semibold tabular-nums ${
            netAction >= 0 ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {netAction >= 0 ? "+" : ""}
          {netAction}
        </span>
        .
      </p>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="rounded-2xl border border-border bg-panel p-5">
          <div className="text-3xl font-bold tabular-nums text-text">{moves.length}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Total moves
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-emerald-400">{buyCount}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Buys (new + add)
          </div>
        </div>
        <div className="rounded-2xl border border-rose-400/30 bg-rose-400/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-rose-400">{sellCount}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Sells (trim + exit)
          </div>
        </div>
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-brand">{news.length}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Fresh money
          </div>
        </div>
      </div>

      {/* Top new positions */}
      {news.length > 0 && (
        <section className="mb-12">
          <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3">
            Fresh money · top new positions
          </div>
          <h2 className="text-2xl font-bold mb-4">What they bought for the first time</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {news.slice(0, 9).map((m, i) => {
              const mgr = MANAGERS.find((x) => x.slug === m.managerSlug);
              return (
                <a
                  key={`${m.ticker}-${m.managerSlug}-${i}`}
                  href={`/signal/${m.ticker}`}
                  className="block rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-4 hover:bg-emerald-400/10 transition"
                >
                  <div className="flex items-baseline justify-between">
                    <div className="font-bold text-text text-base">{m.ticker}</div>
                    <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
                      NEW
                    </div>
                  </div>
                  <div className="text-[11px] text-dim truncate mt-0.5">
                    {m.name ?? TICKER_INDEX[m.ticker]?.name ?? m.ticker}
                  </div>
                  <div className="text-xs text-muted mt-2 truncate">
                    <span className="text-text">{mgr?.name ?? m.managerSlug}</span>
                    {m.portfolioImpactPct ? (
                      <span className="text-dim"> · {m.portfolioImpactPct.toFixed(1)}%</span>
                    ) : null}
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Top exits */}
      {exits.length > 0 && (
        <section className="mb-12">
          <div className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-3">
            Full exits · capitulation feed
          </div>
          <h2 className="text-2xl font-bold mb-4">What they fully walked away from</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {exits.slice(0, 9).map((m, i) => {
              const mgr = MANAGERS.find((x) => x.slug === m.managerSlug);
              return (
                <a
                  key={`${m.ticker}-${m.managerSlug}-${i}`}
                  href={`/signal/${m.ticker}`}
                  className="block rounded-xl border border-rose-400/30 bg-rose-400/5 p-4 hover:bg-rose-400/10 transition"
                >
                  <div className="flex items-baseline justify-between">
                    <div className="font-bold text-text text-base">{m.ticker}</div>
                    <div className="text-[10px] uppercase tracking-wider text-rose-400 font-bold">
                      EXIT
                    </div>
                  </div>
                  <div className="text-[11px] text-dim truncate mt-0.5">
                    {m.name ?? TICKER_INDEX[m.ticker]?.name ?? m.ticker}
                  </div>
                  <div className="text-xs text-muted mt-2 truncate">
                    <span className="text-text">{mgr?.name ?? m.managerSlug}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      <AdSlot format="horizontal" />

      {/* Most-traded tickers */}
      <section className="mt-12 mb-12">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Most-traded · buyers vs sellers in {label}
        </div>
        <h2 className="text-2xl font-bold mb-4">The 15 tickers that moved most</h2>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">Ticker</th>
                <th className="px-4 py-3 text-right">Buyers</th>
                <th className="px-4 py-3 text-right">Sellers</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Net</th>
                <th className="px-4 py-3 text-right hidden lg:table-cell">Conviction</th>
              </tr>
            </thead>
            <tbody>
              {topTraded.map((t) => {
                const net = t.buyers - t.sellers;
                return (
                  <tr
                    key={t.ticker}
                    className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                  >
                    <td className="px-4 py-3">
                      <a
                        href={`/signal/${t.ticker}`}
                        className="font-mono font-semibold text-brand hover:underline"
                      >
                        {t.ticker}
                      </a>
                      <div className="text-[11px] text-dim truncate max-w-[14rem]">
                        {t.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-emerald-400 font-semibold">
                      {t.buyers}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-rose-400 font-semibold">
                      {t.sellers}
                    </td>
                    <td
                      className={`px-4 py-3 text-right tabular-nums font-semibold hidden md:table-cell ${
                        net >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {net >= 0 ? "+" : ""}
                      {net}
                    </td>
                    <td
                      className={`px-4 py-3 text-right tabular-nums font-semibold hidden lg:table-cell ${
                        t.conviction >= 0 ? "text-text" : "text-rose-400"
                      }`}
                    >
                      {formatSignedScore(t.conviction)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Most active managers */}
      <section className="mb-12">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Active managers · who moved most
        </div>
        <h2 className="text-2xl font-bold mb-4">Top 10 busiest managers in {label}</h2>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Manager</th>
                <th className="px-4 py-3 text-right">Moves</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Buys</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Sells</th>
              </tr>
            </thead>
            <tbody>
              {topManagers.map((m, i) => (
                <tr
                  key={m.slug}
                  className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                >
                  <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`/investor/${m.slug}`}
                      className="font-semibold text-text hover:text-brand transition"
                    >
                      {m.name}
                    </a>
                    <div className="text-[11px] text-dim truncate max-w-[14rem]">
                      {m.fund}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-text font-semibold">
                    {m.moves}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-emerald-400 hidden md:table-cell">
                    {m.buys}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-rose-400 hidden md:table-cell">
                    {m.sells}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sector net flow */}
      {sectorRows.length > 0 && (
        <section className="mb-12">
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
            Sector net flow · {label}
          </div>
          <h2 className="text-2xl font-bold mb-4">Where the capital went</h2>
          <div className="rounded-2xl border border-border bg-panel overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-bg/40 border-b border-border">
                <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                  <th className="px-4 py-3 text-left">Sector</th>
                  <th className="px-4 py-3 text-right">Buys</th>
                  <th className="px-4 py-3 text-right">Sells</th>
                  <th className="px-4 py-3 text-right">Net</th>
                </tr>
              </thead>
              <tbody>
                {sectorRows.map((s) => (
                  <tr
                    key={s.name}
                    className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                  >
                    <td className="px-4 py-3 text-text font-semibold">{s.name}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-emerald-400">
                      {s.buys}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-rose-400">
                      {s.sells}
                    </td>
                    <td
                      className={`px-4 py-3 text-right tabular-nums font-semibold ${
                        s.net >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {s.net >= 0 ? "+" : ""}
                      {s.net}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Adjacent quarter nav */}
      <section className="mt-16 mb-10 grid sm:grid-cols-2 gap-4">
        {prev ? (
          <a
            href={`/quarter/${quarterToSlug(prev)}`}
            className="rounded-2xl border border-border bg-panel p-5 hover:border-brand/60 hover:bg-brand/5 transition"
          >
            <div className="text-[10px] uppercase tracking-widest text-dim font-semibold mb-1">
              ← Previous quarter
            </div>
            <div className="text-lg font-bold text-text">{QUARTER_LABELS[prev]}</div>
          </a>
        ) : (
          <div />
        )}
        {next ? (
          <a
            href={`/quarter/${quarterToSlug(next)}`}
            className="rounded-2xl border border-border bg-panel p-5 hover:border-brand/60 hover:bg-brand/5 transition text-right"
          >
            <div className="text-[10px] uppercase tracking-widest text-dim font-semibold mb-1">
              Next quarter →
            </div>
            <div className="text-lg font-bold text-text">{QUARTER_LABELS[next]}</div>
          </a>
        ) : (
          <div />
        )}
      </section>

      {/* All quarters nav */}
      <section className="mb-12 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          All tracked quarters
        </div>
        <div className="flex flex-wrap gap-2">
          {QUARTERS.map((q) => {
            const active = q === quarter;
            return (
              <a
                key={q}
                href={`/quarter/${quarterToSlug(q)}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  active
                    ? "bg-brand/15 border-brand text-brand"
                    : "border-border bg-bg/40 text-muted hover:border-brand/40 hover:text-text"
                }`}
              >
                {QUARTER_LABELS[q]}
              </a>
            );
          })}
        </div>
      </section>

      <p className="text-xs text-dim mt-12">
        Based on publicly filed 13Fs for {label}, filed with the SEC on{" "}
        <span className="text-text">{filedAt}</span>. 13Fs report long-only U.S. equity
        positions. Not investment advice.{" "}
        <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
