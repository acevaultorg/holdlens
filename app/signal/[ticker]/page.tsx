import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LiveQuote from "@/components/LiveQuote";
import LiveChart from "@/components/LiveChart";
import TickerActivity from "@/components/TickerActivity";
import TickerNews from "@/components/TickerNews";
import StarButton from "@/components/StarButton";
import { TICKER_INDEX, getTicker } from "@/lib/tickers";
import { getTickerSignals, getTickerTrend, ratingLabel, MANAGER_QUALITY } from "@/lib/signals";
import { MANAGERS } from "@/lib/managers";
import { QUARTER_LABELS, LATEST_QUARTER } from "@/lib/moves";

export async function generateStaticParams() {
  return Object.keys(TICKER_INDEX).map((ticker) => ({ ticker }));
}

export async function generateMetadata({ params }: { params: Promise<{ ticker: string }> }): Promise<Metadata> {
  const { ticker } = await params;
  const t = getTicker(ticker);
  if (!t) return { title: "Signal not found" };
  return {
    title: `${t.symbol} signal — what the smart money is doing on ${t.name}`,
    description: `Full buy/sell dossier for ${t.symbol}: recommendation score, trend, activity feed, news, live chart. Powered by ${MANAGERS.length} best portfolio managers in the world.`,
    openGraph: {
      title: `${t.symbol} · HoldLens Signal`,
      description: `Buy/sell recommendation for ${t.name}.`,
    },
  };
}

export default async function SignalPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const t = getTicker(ticker);
  if (!t) notFound();

  const { buy, sell } = getTickerSignals(t.symbol);
  const trend = getTickerTrend(t.symbol);

  const buyRating = buy ? ratingLabel(buy.score) : null;
  const sellRating = sell ? ratingLabel(sell.score) : null;

  // Verdict: the direction with the higher score wins, but if both are low, NEUTRAL
  let verdict: "BUY" | "SELL" | "NEUTRAL" = "NEUTRAL";
  let verdictScore = 0;
  let verdictColor = "text-muted border-border bg-panel";
  if (buy && (!sell || buy.score > sell.score + 10)) {
    verdict = "BUY";
    verdictScore = buy.score;
    verdictColor = "text-emerald-400 border-emerald-400/40 bg-emerald-400/5";
  } else if (sell && (!buy || sell.score > buy.score + 10)) {
    verdict = "SELL";
    verdictScore = sell.score;
    verdictColor = "text-rose-400 border-rose-400/40 bg-rose-400/5";
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <a href={`/ticker/${t.symbol}`} className="text-xs text-muted hover:text-text">
        ← Full ticker page
      </a>

      {/* Header */}
      <div className="mt-4 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
            Signal dossier · {QUARTER_LABELS[LATEST_QUARTER]}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            <span className="text-brand">{t.symbol}</span>
          </h1>
          <p className="text-muted text-lg mt-2">{t.name} · {t.sector}</p>
        </div>
        <StarButton symbol={t.symbol} size="lg" />
      </div>

      {/* The verdict — the "should I buy or sell?" answer */}
      <div className={`mt-8 rounded-2xl border p-6 md:p-8 ${verdictColor}`}>
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-widest font-bold opacity-80">
              HoldLens verdict
            </div>
            <div className="text-5xl md:text-6xl font-bold tracking-tight mt-2">{verdict}</div>
            {verdictScore > 0 && (
              <div className="text-sm mt-2 opacity-80">
                Confidence: <span className="font-bold">{verdictScore}/100</span>
              </div>
            )}
          </div>
          <div className="max-w-sm">
            <div className="text-sm leading-relaxed opacity-90">
              {verdict === "BUY" && buy && (
                <>
                  <span className="font-semibold">{buy.buyerCount} tracked manager{buy.buyerCount > 1 ? "s" : ""}</span>{" "}
                  buying{" "}
                  {trend.consistentBuyers.length > 0 && (
                    <>
                      with{" "}
                      <span className="font-semibold">
                        {trend.consistentBuyers.length} on a {Math.max(...trend.consistentBuyers.map((b) => b.streak))}+
                        quarter streak
                      </span>
                      .
                    </>
                  )}{" "}
                  {buyRating && <span className="font-semibold uppercase">{buyRating.label} signal.</span>}
                </>
              )}
              {verdict === "SELL" && sell && (
                <>
                  <span className="font-semibold">{sell.sellerCount} tracked manager{sell.sellerCount > 1 ? "s" : ""}</span>{" "}
                  selling.{" "}
                  {sellRating && <span className="font-semibold uppercase">{sellRating.label} sell signal.</span>}
                </>
              )}
              {verdict === "NEUTRAL" && "Mixed or absent signals. Smart money is not decisively moving."}
            </div>
          </div>
        </div>
      </div>

      {/* Live price + chart */}
      <section className="mt-8">
        <LiveQuote symbol={t.symbol} size="xl" />
      </section>

      <section className="mt-8">
        <LiveChart symbol={t.symbol} defaultRange="1y" />
      </section>

      {/* Trend — consecutive-quarter signals */}
      {(trend.consistentBuyers.length > 0 || trend.consistentSellers.length > 0) && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-3">Multi-quarter conviction</h2>
          <p className="text-muted text-sm mb-6 max-w-2xl">
            Managers who have been moving the same direction on {t.symbol} for 2+ consecutive quarters. Streaks
            matter far more than single-quarter moves — they reveal thesis conviction, not reactive trading.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {trend.consistentBuyers.length > 0 && (
              <TrendColumn kind="buy" entries={trend.consistentBuyers} />
            )}
            {trend.consistentSellers.length > 0 && (
              <TrendColumn kind="sell" entries={trend.consistentSellers} />
            )}
          </div>
        </section>
      )}

      {/* Activity feed */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">Smart money activity</h2>
        <p className="text-muted text-sm mb-6 max-w-2xl">
          Every tracked 13F move on {t.symbol} — grouped by quarter, ranked by manager quality.
        </p>
        <TickerActivity symbol={t.symbol} />
      </section>

      {/* News */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">Latest news</h2>
        <p className="text-muted text-sm mb-6 max-w-2xl">
          Recent headlines for {t.symbol} — context for the moves above.
        </p>
        <TickerNews symbol={t.symbol} count={8} />
      </section>

      {/* Ownership */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">Current ownership</h2>
        <p className="text-muted text-sm mb-6 max-w-2xl">
          {t.ownerCount} tracked superinvestor{t.ownerCount > 1 ? "s" : ""} currently hold {t.symbol} as a top
          position.
        </p>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-dim text-xs uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3">Manager</th>
                <th className="text-right px-5 py-3">% Portfolio</th>
              </tr>
            </thead>
            <tbody>
              {[...t.owners].sort((a, b) => b.pct - a.pct).map((o) => (
                <tr key={o.slug} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">
                    <a href={`/investor/${o.slug}`} className="text-text hover:text-brand transition font-semibold">
                      {o.manager}
                    </a>
                    <div className="text-xs text-dim mt-0.5 max-w-md">{o.thesis}</div>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-brand font-semibold">
                    {o.pct.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-xs text-dim mt-12">
        HoldLens Signal combines multi-factor recommendation scoring with live prices, multi-quarter trend detection,
        and real-time news. Not investment advice.{" "}
        <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}

function TrendColumn({
  kind,
  entries,
}: {
  kind: "buy" | "sell";
  entries: { slug: string; streak: number }[];
}) {
  const accent = kind === "buy" ? "text-emerald-400" : "text-rose-400";
  const title = kind === "buy" ? "Consecutive-quarter BUYERS" : "Consecutive-quarter SELLERS";

  return (
    <div className="rounded-2xl border border-border bg-panel p-5">
      <div className={`text-[10px] uppercase tracking-widest font-bold mb-3 ${accent}`}>{title}</div>
      <ul className="space-y-2">
        {entries.map((e) => {
          const mgr = MANAGERS.find((m) => m.slug === e.slug);
          const quality = MANAGER_QUALITY[e.slug] ?? 6;
          return (
            <li key={e.slug}>
              <a
                href={`/investor/${e.slug}`}
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-bg/40 transition"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-text text-sm truncate">
                    {mgr?.name || e.slug}
                  </div>
                  <div className="text-xs text-dim truncate">{mgr?.fund}</div>
                </div>
                <div className="flex items-center gap-2">
                  {quality >= 9 && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-brand bg-brand/10 border border-brand/30 rounded px-1.5 py-0.5">
                      T1
                    </span>
                  )}
                  <span className={`text-sm font-bold tabular-nums ${accent}`}>
                    {e.streak}Q
                  </span>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
