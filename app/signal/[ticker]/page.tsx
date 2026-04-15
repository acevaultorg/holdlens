import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LiveQuote from "@/components/LiveQuote";
import LiveChart from "@/components/LiveChart";
import Signal52wRange from "@/components/Signal52wRange";
import SignalQuarterlyActivity from "@/components/SignalQuarterlyActivity";
import OwnerCountSparkline from "@/components/OwnerCountSparkline";
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
import FoundersNudge from "@/components/FoundersNudge";
import RelatedSignals from "@/components/RelatedSignals";
import BrokerCta from "@/components/BrokerCta";
import TickerLogo from "@/components/TickerLogo";
import FundLogo from "@/components/FundLogo";
import { TICKER_INDEX, getTicker } from "@/lib/tickers";
import { getTickerSignals, getTickerTrend, getNetSignal, ratingLabel, MANAGER_QUALITY } from "@/lib/signals";
import { formatSignedScore, convictionLabel, getConviction } from "@/lib/conviction";
import { MANAGERS } from "@/lib/managers";
import { QUARTER_LABELS, LATEST_QUARTER } from "@/lib/moves";

// ---------- GLOBAL BIG-BETS RANK CACHE ----------
// Same formula as /big-bets page: for every (manager, holding) excluding
// managers' own companies, combined score = positionPct × max(0, conviction).
// Ranks all bets globally; exposes per-ticker rank for the highest-scoring
// bet on that ticker. Module-level cached so all 94 signal pages share
// one computation during static export.
type TickerRankInfo = { rank: number; total: number; topOwner: string; topOwnerSlug: string };
let _rankCache: Map<string, TickerRankInfo> | null = null;
function getBigBetsRankInfo(ticker: string): TickerRankInfo | null {
  if (!_rankCache) {
    type Row = { mgrSlug: string; mgrName: string; ticker: string; combined: number };
    const rows: Row[] = [];
    for (const m of MANAGERS) {
      for (const h of m.topHoldings) {
        if (h.name.toLowerCase().includes("(own)")) continue;
        const conv = getConviction(h.ticker);
        const combined = h.pct * Math.max(0, conv.score);
        if (combined > 0) rows.push({ mgrSlug: m.slug, mgrName: m.name, ticker: h.ticker, combined });
      }
    }
    rows.sort((a, b) => b.combined - a.combined);
    const cache = new Map<string, TickerRankInfo>();
    rows.forEach((r, idx) => {
      if (!cache.has(r.ticker)) {
        cache.set(r.ticker, { rank: idx + 1, total: rows.length, topOwner: r.mgrName, topOwnerSlug: r.mgrSlug });
      }
    });
    _rankCache = cache;
  }
  return _rankCache.get(ticker.toUpperCase()) ?? null;
}

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

  // JSON-LD structured data — one Article schema for the dossier itself
  // (unlocks Google Article rich results) plus a BreadcrumbList (unlocks
  // breadcrumb rich results). The Article uses the unified ConvictionScore
  // verdict as the headline so search snippets surface the actual BUY/SELL
  // signal rather than a generic title. Zero page-weight cost — one inline
  // <script type="application/ld+json"> tag per page.
  const signalUrl = `https://holdlens.com/signal/${t.symbol}`;
  const headline =
    verdict === "BUY"
      ? `${t.symbol} BUY signal — smart money conviction ${formatSignedScore(signedScore)}`
      : verdict === "SELL"
      ? `${t.symbol} SELL signal — smart money conviction ${formatSignedScore(signedScore)}`
      : `${t.symbol} signal — what ${t.ownerCount} tracked superinvestors are doing on ${t.name}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description: `${t.name} (${t.symbol}) 13F signal dossier · Unified −100..+100 ConvictionScore · ${QUARTER_LABELS[LATEST_QUARTER]}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": signalUrl },
    url: signalUrl,
    image: [`https://holdlens.com/og/signal/${t.symbol}.png`],
    author: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com" },
    publisher: {
      "@type": "Organization",
      name: "HoldLens",
      url: "https://holdlens.com",
      logo: { "@type": "ImageObject", url: "https://holdlens.com/logo.png" },
    },
    about: {
      "@type": "Corporation",
      name: t.name,
      tickerSymbol: t.symbol,
      ...(t.sector ? { industry: t.sector } : {}),
    },
    keywords: [t.symbol, t.name, "13F", "superinvestors", "smart money", "stock signal", verdict].join(", "),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com/" },
      { "@type": "ListItem", position: 2, name: "Signals", item: "https://holdlens.com/signal" },
      { "@type": "ListItem", position: 3, name: t.symbol, item: signalUrl },
    ],
  };
  const verdictColor =
    verdict === "BUY"
      ? "text-emerald-400 border-emerald-400/40 bg-emerald-400/5"
      : verdict === "SELL"
      ? "text-rose-400 border-rose-400/40 bg-rose-400/5"
      : "text-muted border-border bg-panel";

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* JSON-LD — Article + BreadcrumbList for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <a href={`/ticker/${t.symbol}`} className="text-xs text-muted hover:text-text">
        ← Full ticker page
      </a>

      {/* Header */}
      <div className="mt-4 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
            Signal dossier · {QUARTER_LABELS[LATEST_QUARTER]}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight flex items-center gap-3 flex-wrap">
            <TickerLogo symbol={t.symbol} size={48} />
            <span className="text-brand">{t.symbol}</span>
          </h1>
          <p className="text-muted text-lg mt-2">
            {t.name}
            {t.sector && (
              <> · <a
                href={`/sector/${t.sector.toLowerCase().replace(/\s+/g, "-")}`}
                className="hover:text-brand transition"
              >{t.sector}</a></>
            )}
          </p>
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

      {/* 52-week range visualizer — value context for the live price */}
      <section className="mt-6">
        <Signal52wRange symbol={t.symbol} />
      </section>

      {/* 8-quarter buy/sell activity sparkline — historical context for the verdict */}
      <section className="mt-6">
        <SignalQuarterlyActivity symbol={t.symbol} />
      </section>

      {/* Ownership breadth — 8Q owner_count over time, rebuilt from
          MERGED_MOVES. Complements the activity chart above: activity =
          flow (who's moving), breadth = state (how many hold). */}
      <section className="mt-6">
        <OwnerCountSparkline symbol={t.symbol} />
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

      {/* Bet-size view — who's betting biggest, visualized. Replaces the
          plain ownership table with a horizontal bar chart so the reader
          immediately sees conviction differentials. Also surfaces this
          ticker's global rank in /big-bets (size × conviction screen). */}
      <section className="mt-12">
        <div className="flex items-baseline justify-between mb-3 gap-3 flex-wrap">
          <h2 className="text-2xl font-bold">Who&rsquo;s betting biggest on {t.symbol}</h2>
          <div className="flex items-center gap-3 flex-wrap">
            {t.sector && (
              <a
                href={`/sector/${t.sector.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-xs font-semibold text-dim hover:text-brand hover:underline whitespace-nowrap transition"
              >
                {t.sector} sector →
              </a>
            )}
            {(() => {
              const rankInfo = getBigBetsRankInfo(t.symbol);
              if (!rankInfo) return null;
              return (
                <a
                  href={`/big-bets#${t.symbol.toLowerCase()}`}
                  className="text-xs font-semibold text-brand hover:underline whitespace-nowrap"
                >
                  → Ranks #{rankInfo.rank} of {rankInfo.total} tracked bets
                </a>
              );
            })()}
          </div>
        </div>
        <p className="text-muted text-sm mb-6 max-w-2xl">
          Each bar is one manager&rsquo;s position size in {t.symbol} as a % of their portfolio. Longer bar
          = bigger conviction bet. T1 badge marks the highest-quality track records.
        </p>
        {(() => {
          const sortedOwners = [...t.owners].sort((a, b) => b.pct - a.pct);
          const maxPct = sortedOwners[0]?.pct ?? 1;
          return (
            <div className="rounded-2xl border border-border bg-panel p-5">
              <div className="space-y-4">
                {sortedOwners.map((o) => {
                  const widthPct = maxPct > 0 ? Math.max(2, (o.pct / maxPct) * 100) : 0;
                  const quality = MANAGER_QUALITY[o.slug] ?? 6;
                  const tier1 = quality >= 9;
                  return (
                    <div key={o.slug}>
                      <div className="flex items-baseline justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <FundLogo slug={o.slug} name={o.manager} size={20} />
                          <a
                            href={`/investor/${o.slug}`}
                            className="text-sm font-semibold text-text hover:text-brand transition truncate"
                          >
                            {o.manager}
                          </a>
                          {tier1 && (
                            <span className="text-[9px] font-bold uppercase tracking-wider text-brand bg-brand/10 border border-brand/30 rounded px-1.5 py-0.5 shrink-0">
                              T1
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-bold tabular-nums text-brand">
                          {o.pct.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-bg/60 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${tier1 ? "bg-brand" : "bg-emerald-400/70"}`}
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                      {o.thesis && (
                        <div className="text-xs text-dim mt-1.5 max-w-2xl italic">&ldquo;{o.thesis}&rdquo;</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </section>

      {/* Related smart-money signals — same-sector top conviction + co-owned
          tickers. Creates ~940 cross-link edges across the 94 signal pages
          (each page outlinks to 10 sibling signals), dramatically widening
          internal authority flow + time-on-site. */}
      <RelatedSignals symbol={t.symbol} />

      {/* Mid-page ad slot */}
      <FoundersNudge context={`You're reading the full smart-money dossier on ${t.symbol}.`} />
      <BrokerCta ticker={t.symbol} />
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
