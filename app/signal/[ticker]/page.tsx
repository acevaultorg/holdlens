import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LiveQuote from "@/components/LiveQuote";
import LiveChart from "@/components/LiveChart";
import TickerActivity from "@/components/TickerActivity";
import TickerNews from "@/components/TickerNews";
import TickerEarnings from "@/components/TickerEarnings";
import InsiderActivity from "@/components/InsiderActivity";
import StarButton from "@/components/StarButton";
import SocialShare from "@/components/SocialShare";
import SignalShareCard from "@/components/SignalShareCard";
import AffiliateCTA from "@/components/AffiliateCTA";
import AdSlot from "@/components/AdSlot";
import TrendBadge from "@/components/TrendBadge";
import { TICKER_INDEX, getTicker } from "@/lib/tickers";
import { getTickerSignals, getTickerTrend, getNetSignal, ratingLabel, MANAGER_QUALITY } from "@/lib/signals";
import { formatSignedScore, convictionLabel } from "@/lib/conviction";
import { MANAGERS } from "@/lib/managers";
import { QUARTER_LABELS, LATEST_QUARTER } from "@/lib/moves";

export async function generateStaticParams() {
  return Object.keys(TICKER_INDEX).map((ticker) => ({ ticker }));
}

export async function generateMetadata({ params }: { params: Promise<{ ticker: string }> }): Promise<Metadata> {
  const { ticker } = await params;
  const t = getTicker(ticker);
  if (!t) return { title: "Signal not found" };

  // Compute a one-line verdict from the unified signed score
  const net = getNetSignal(t.symbol);
  let verdictLine = `${t.ownerCount} of the best portfolio managers in the world hold ${t.symbol}.`;
  if (net) {
    if (net.direction === "BUY") {
      verdictLine = `${t.symbol} unified signal: ${formatSignedScore(net.score)} on a −100..+100 scale (${convictionLabel(net.score).label}).`;
    } else if (net.direction === "SELL") {
      verdictLine = `${t.symbol} unified signal: ${formatSignedScore(net.score)} on a −100..+100 scale (${convictionLabel(net.score).label}).`;
    }
  }

  const url = `https://holdlens.com/signal/${t.symbol}`;
  const title = `${t.symbol} signal — what smart money is doing on ${t.name}`;
  const description = `${verdictLine} Full buy/sell dossier: multi-quarter trend, activity, news, live chart.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${t.symbol} · HoldLens Signal`,
      description,
      url,
      siteName: "HoldLens",
      type: "article",
      images: [{ url: `/og/signal/${t.symbol}.png`, width: 1200, height: 630, alt: `${t.symbol} signal — ${verdictLine}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.symbol} · HoldLens Signal`,
      description,
      creator: "@holdlens",
      images: [`/og/signal/${t.symbol}.png`],
    },
    robots: { index: true, follow: true },
  };
}

export default async function SignalPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const t = getTicker(ticker);
  if (!t) notFound();

  const { buy, sell } = getTickerSignals(t.symbol);
  const trend = getTickerTrend(t.symbol);
  const net = getNetSignal(t.symbol);

  const buyRating = buy ? ratingLabel(buy.score) : null;
  const sellRating = sell ? ratingLabel(sell.score) : null;

  // Verdict from the unified ConvictionScore — single signed −100..+100 scale
  const verdict: "BUY" | "SELL" | "NEUTRAL" = net?.direction ?? "NEUTRAL";
  const signedScore = net?.score ?? 0;
  const verdictColor =
    verdict === "BUY"
      ? "text-emerald-400 border-emerald-400/40 bg-emerald-400/5"
      : verdict === "SELL"
      ? "text-rose-400 border-rose-400/40 bg-rose-400/5"
      : "text-muted border-border bg-panel";

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
              HoldLens verdict · single −100..+100 scale
            </div>
            <div className="flex items-end gap-3 mt-2 flex-wrap">
              <div className="text-5xl md:text-6xl font-bold tracking-tight">{verdict}</div>
              <TrendBadge ticker={t.symbol} size="md" />
            </div>
            <div className="text-sm mt-2 opacity-80">
              Score: <span className="font-bold tabular-nums text-2xl">{formatSignedScore(signedScore)}</span>
              <span className="opacity-60"> / {signedScore >= 0 ? "+100" : "−100"}</span>
            </div>
            <div className="text-[11px] mt-1 opacity-70">
              {convictionLabel(signedScore).label}
            </div>
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

      {/* Unified score breakdown — show the math */}
      {net && (
        <section className="mt-6 rounded-2xl border border-border bg-panel p-5">
          <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-brand font-semibold mb-1">
                Unified ConvictionScore · −100..+100
              </div>
              <div className="text-xs text-muted">
                Smart money + insider + track record + trend + concentration + contrarian − dissent − crowding
              </div>
            </div>
            <div className={`text-2xl font-bold tabular-nums ${verdict === "BUY" ? "text-emerald-400" : verdict === "SELL" ? "text-rose-400" : "text-muted"}`}>
              {formatSignedScore(net.score)}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <BreakdownStat label="Buy component" value={`+${net.breakdown.buyComponent}`} positive />
            <BreakdownStat label="Dissent penalty" value={`−${net.breakdown.dissentPenalty}`} negative={net.breakdown.dissentPenalty > 0} />
            <BreakdownStat
              label="Unanimity bonus"
              value={net.breakdown.unanimityBonus > 0 ? `+${net.breakdown.unanimityBonus}` : "0"}
              positive={net.breakdown.unanimityBonus > 0}
            />
            <BreakdownStat
              label="Quality differential"
              value={`${net.breakdown.qualityDifferential >= 0 ? "+" : ""}${net.breakdown.qualityDifferential}`}
              positive={net.breakdown.qualityDifferential > 0}
              negative={net.breakdown.qualityDifferential < 0}
            />
            <BreakdownStat label="Info density" value={`+${net.breakdown.informationDensity}`} positive />
            <BreakdownStat label="Buyers / Sellers" value={`${net.buyerCount} / ${net.sellerCount}`} />
          </div>
        </section>
      )}

      {/* Viral share card — the single-click "tweet this verdict" unlock.
          Placed here (after verdict + score breakdown, before the chart) so
          the user sees the shareable artefact while the verdict is fresh. */}
      <section className="mt-8">
        <SignalShareCard
          ticker={t.symbol}
          name={t.name}
          sector={t.sector}
          verdict={verdict}
          score={signedScore}
          convictionLabel={convictionLabel(signedScore).label}
          buyerCount={net?.buyerCount ?? 0}
          sellerCount={net?.sellerCount ?? 0}
          topStreak={
            verdict === "BUY"
              ? trend.consistentBuyers.reduce((m, b) => Math.max(m, b.streak), 0)
              : verdict === "SELL"
              ? trend.consistentSellers.reduce((m, s) => Math.max(m, s.streak), 0)
              : 0
          }
          ownerCount={t.ownerCount}
        />
      </section>

      {/* Live price + chart */}
      <section className="mt-8">
        <LiveQuote symbol={t.symbol} size="xl" />
      </section>

      <section className="mt-8">
        <LiveChart symbol={t.symbol} defaultRange="1y" />
      </section>

      {/* Earnings calendar */}
      <section className="mt-6">
        <TickerEarnings symbol={t.symbol} />
      </section>

      {/* Affiliate CTA — primary revenue surface, placed right after the verdict */}
      <AffiliateCTA symbol={t.symbol} />

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

      {/* Insider activity */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">Insider activity</h2>
        <p className="text-muted text-sm mb-6 max-w-2xl">
          What the company's own executives and directors are doing — buys are highly bullish.
        </p>
        <InsiderActivity symbol={t.symbol} />
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

      {/* Mid-page ad slot */}
      <AdSlot format="in-article" />

      {/* Share */}
      <section className="mt-12">
        <SocialShare
          path={`/signal/${t.symbol}`}
          tweet={
            verdict === "BUY"
              ? `🟢 BUY signal on ${t.symbol} — score ${formatSignedScore(signedScore)} on a −100..+100 scale. Full dossier on HoldLens:`
              : verdict === "SELL"
              ? `🔴 SELL signal on ${t.symbol} — score ${formatSignedScore(signedScore)} on a −100..+100 scale. Full dossier on HoldLens:`
              : `What ${MANAGERS.length} of the best portfolio managers in the world are doing on ${t.symbol} — full dossier on HoldLens:`
          }
          label={`Share the ${t.symbol} signal`}
        />
      </section>

      <p className="text-xs text-dim mt-12">
        The HoldLens signal dossier shows the unified −100..+100 ConvictionScore alongside live prices, multi-quarter
        trend detection, insider activity, and real-time news. Not investment advice.{" "}
        <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}

function BreakdownStat({
  label,
  value,
  positive,
  negative,
}: {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  const color = positive ? "text-emerald-400" : negative ? "text-rose-400" : "text-text";
  return (
    <div className="rounded-lg bg-bg/40 border border-border p-2.5">
      <div className="text-[9px] uppercase tracking-wider text-dim font-semibold mb-1">{label}</div>
      <div className={`text-base font-bold tabular-nums ${color}`}>{value}</div>
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
