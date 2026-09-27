import InvestingBooks from "@/components/InvestingBooks";
import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import CsvExportButton from "@/components/CsvExportButton";
import MethodologyDisclaimer from "@/components/MethodologyDisclaimer";
import DataFreshness from "@/components/DataFreshness";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import {
  getComposite,
  COMPOSITE_TARGET_POSITIONS,
  COMPOSITE_MAX_PER_SECTOR,
  COMPOSITE_MIN_SCORE,
} from "@/lib/composite";
import { hasTickerPage } from "@/lib/tickers";
import { MANAGERS } from "@/lib/managers";
import { convictionLabel, formatSignedScore } from "@/lib/conviction";

// /composite — "The Conviction" — a descriptive aggregate of which
// tickers tracked superinvestors collectively own most. Pivot A compliant:
// data-display, not advice. Quarterly rebalance (NOT daily/hourly — RIA
// territory). No verdict labels, no "optimal" / "ultimate" / "highest ROI"
// framing. Composite serves curious readers; brain does not recommend
// readers buy this basket.
//
// Methodology v2 (2026-05-19): uses ALL available data — every ticker with
// positive ConvictionScore across 9 time-decayed quarters, no arbitrary
// buyer-count floor, no arbitrary score floor beyond "net-accumulation
// positive". Sector-count cap (≤8 per sector ≈ 27% by count) for
// concentration discipline. Conviction-weighted sizing — slot ∝ score.

export const metadata: Metadata = {
  title:
    "The Conviction — what 30 superinvestors collectively own most",
  description: `A descriptive ${COMPOSITE_TARGET_POSITIONS}-stock basket aggregating the highest ConvictionScores across ${MANAGERS.length} tracked portfolio managers' 13F filings. Conviction-weighted — each slot scales with cross-manager accumulation intensity. Sector-count cap (≤${COMPOSITE_MAX_PER_SECTOR} per sector) for concentration discipline. Rebalanced quarterly when new SEC filings land. Pure data-display — not investment advice, not "optimal," not recommended for purchase.`,
  alternates: { canonical: "https://holdlens.com/composite" },
  openGraph: {
    title: "The Conviction — superinvestor consensus basket",
    description: `${COMPOSITE_TARGET_POSITIONS} most-accumulated tickers across ${MANAGERS.length} tracked managers, conviction-weighted, sector-count-capped, quarterly-rebalanced.`,
    url: "https://holdlens.com/composite",
    type: "article",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "The Conviction — 30 superinvestors aggregated",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Conviction",
    description: `${COMPOSITE_TARGET_POSITIONS} most-accumulated tickers, conviction-weighted, sector-count-capped, quarterly-rebalanced.`,
    images: ["/og/home.png"],
  },
};

export default function CompositePage() {
  const c = getComposite();
  const topWeightPct = c.holdings[0]?.weight_pct ?? 0;
  const bottomWeightPct = c.holdings[c.holdings.length - 1]?.weight_pct ?? 0;

  // LLM-citation schema — Dataset + DefinedTerm × 4 + BreadcrumbList + Article.
  const datasetLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `The Conviction — ${c.quarter_label}`,
    description: `Descriptive ${COMPOSITE_TARGET_POSITIONS}-stock aggregate of which tickers ${MANAGERS.length} tracked superinvestors collectively own most heavily, derived from public SEC 13F-HR filings. Conviction-weighted (slot ∝ score). Sector-count cap ≤${COMPOSITE_MAX_PER_SECTOR} positions per sector. Rebalanced quarterly. Data-display only — not investment advice.`,
    url: "https://holdlens.com/composite",
    keywords: [
      "13F",
      "superinvestor composite",
      "ConvictionScore",
      "SEC filings analysis",
      "consensus basket",
      "institutional holdings aggregate",
    ],
    creator: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    datePublished: c.rebalance_date,
    dateModified: c.generated_at.slice(0, 10),
    inLanguage: "en-US",
    license: "https://holdlens.com/api-terms",
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "ConvictionScore",
        description:
          "Signed −100..+100 composite signal aggregating smart-money consensus, manager quality, trend, concentration, insider activity, and 8-K events across 9 time-decayed quarters of 13F data.",
      },
      {
        "@type": "PropertyValue",
        name: "Conviction weight",
        description: `Each position's slot scales with its ConvictionScore (slot = score ÷ sum-of-selected-scores × 100). Higher-conviction tickers carry larger weight. Top position currently ${topWeightPct.toFixed(2)}%, bottom ${bottomWeightPct.toFixed(2)}%.`,
      },
      {
        "@type": "PropertyValue",
        name: "Sector count cap",
        description: `Maximum ${COMPOSITE_MAX_PER_SECTOR} positions per sector — concentration discipline by count. Lower-ranked candidates from already-full sectors are skipped.`,
      },
    ],
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: `The Conviction — ${c.quarter_label} (${COMPOSITE_TARGET_POSITIONS} positions)`,
    description: `Descriptive aggregate of which tickers ${MANAGERS.length} tracked superinvestors collectively own most heavily. Conviction-weighted, sector-count-capped, quarterly-rebalanced. Data-display only.`,
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/composite",
    datePublished: c.rebalance_date,
    dateModified: c.generated_at.slice(0, 10),
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "The Conviction",
      "superinvestor consensus",
      "13F aggregate",
      "ConvictionScore basket",
      "quarterly rebalance",
    ],
    isPartOf: {
      "@type": "WebSite",
      name: "HoldLens",
      url: "https://holdlens.com",
    },
    citation: [
      "https://www.sec.gov/edgar/searchedgar/companysearch.html",
      "https://en.wikipedia.org/wiki/Form_13F",
      "https://holdlens.com/methodology",
      "https://holdlens.com/learn/conviction-score-explained",
      "https://holdlens.com/scores",
    ],
    about: [
      {
        "@type": "DefinedTerm",
        name: "The Conviction",
        description: `A descriptive ${COMPOSITE_TARGET_POSITIONS}-position aggregate reflecting which stocks ${MANAGERS.length} tracked superinvestors collectively own most heavily, drawn from the universe of every ticker with positive ConvictionScore (≥${COMPOSITE_MIN_SCORE}). NOT a recommendation; NOT an "optimal portfolio"; NOT advice. Pure data-display of public SEC 13F filings.`,
      },
      {
        "@type": "DefinedTerm",
        name: "Sector count cap",
        description: `Maximum ${COMPOSITE_MAX_PER_SECTOR} positions per sector. When sorted ConvictionScore order would put more than ${COMPOSITE_MAX_PER_SECTOR} positions in one sector, lower-scored candidates are skipped to enforce diversification — a basic risk-aware discipline, not an active management decision.`,
      },
      {
        "@type": "DefinedTerm",
        name: "Quarterly rebalance",
        description:
          "Composition refreshes when new 13F-HR filings land (May 15 / Aug 14 / Nov 14 / Feb 14 per SEC deadlines). NOT daily, NOT hourly, NOT real-time. Composite reflects what was filed, not what tracked managers may have done since.",
      },
      {
        "@type": "DefinedTerm",
        name: "Conviction-weighted sizing",
        description: `Each accepted position's slot = its ConvictionScore ÷ sum-of-selected-scores × 100. Higher conviction = larger weight. Methodology v2 uses ALL available data (9 time-decayed quarters, 6 signal layers per ticker) — the score already incorporates buyer agreement, manager quality, trend streak, and insider cross-check, so the size reflects intensity rather than treating every position equally.`,
      },
    ],
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "The Conviction", item: "https://holdlens.com/composite" },
    ],
  };

  // Speakable schema — voice-search answer surface (AEO). Direct-answer
  // paragraph wrapped via cssSelector. Eligible for Google Assistant /
  // Siri / Alexa answer extraction.
  const speakableLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: "https://holdlens.com/composite",
    headline: `The Conviction — ${c.quarter_label}`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".composite-direct-answer"],
    },
  };

  // HowTo schema — AEO citation gold. Google Featured Snippet + AI Overview
  // eligibility for "how does The Conviction work" voice + typed queries.
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How The Conviction is built",
    description: `A 5-step deterministic algorithm that aggregates the highest-ConvictionScore positions across ${MANAGERS.length} tracked superinvestors into a sector-count-capped, conviction-weighted ${COMPOSITE_TARGET_POSITIONS}-position descriptive basket. Rebalances quarterly when new SEC 13F-HR filings land.`,
    totalTime: "PT0S",
    estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
    tool: [
      { "@type": "HowToTool", name: "Public SEC EDGAR 13F-HR filings" },
      { "@type": "HowToTool", name: "HoldLens ConvictionScore composite" },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Define the universe",
        text: `Every ticker with positive ConvictionScore (≥${COMPOSITE_MIN_SCORE}) across ${MANAGERS.length} tracked superinvestor 13F filings. ConvictionScore already aggregates 9 time-decayed quarters and 6 signal layers (smart money, contrarian flow, insider cross-check, trend streak, sector context, prior-score memory), so no arbitrary buyer-count floor is applied on top — the score itself is the gate.`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Sort by ConvictionScore descending",
        text: "Heaviest aggregate accumulation first. Sort order is purely the score; no tiebreakers, no factor tilts, no manual overrides.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Walk sorted list with sector-count cap",
        text: `Accept each ticker in score order IF its sector hasn't reached ${COMPOSITE_MAX_PER_SECTOR} positions. Skip lower-scored candidates from already-full sectors. This enforces baseline diversification — no sector exceeds ${COMPOSITE_MAX_PER_SECTOR}/${COMPOSITE_TARGET_POSITIONS} ≈ ${Math.round((COMPOSITE_MAX_PER_SECTOR / COMPOSITE_TARGET_POSITIONS) * 100)}% by count.`,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Stop at 30 positions",
        text: `Accept up to ${COMPOSITE_TARGET_POSITIONS} positions or until the positive-score universe is exhausted, whichever comes first.`,
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Conviction-weighted sizing",
        text: `Each accepted position's slot = its ConvictionScore ÷ sum-of-selected-scores × 100. Higher-conviction tickers carry larger weight. The score already encodes buyer agreement, manager quality, and trend strength via the underlying signal layers, so size reflects intensity of cross-manager accumulation — not a flat equal-share rule.`,
      },
      {
        "@type": "HowToStep",
        position: 6,
        name: "Rebalance quarterly",
        text: "Refresh when new 13F-HR filings land at SEC deadlines (May 15, August 14, November 14, February 14). NOT daily, NOT hourly — between filings, no new data is available; daily rebalancing would be theater. Real-time rebalancing also requires registered investment advisor (RIA) credentials, which HoldLens does not hold.",
      },
    ],
  };

  return <> {(
    <div className="max-w-6xl mx-auto px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />

      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-3 flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
        Live · {c.quarter_label} rebalance
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5 text-balance">
        The <span className="text-brand">Conviction</span>
      </h1>

      <p className="composite-direct-answer text-muted text-lg leading-relaxed max-w-3xl mb-3 text-pretty">
        A descriptive basket of <strong>{c.total_positions} tickers</strong> that{" "}
        {MANAGERS.length} tracked superinvestors{" "}
        <em>most aggressively accumulate</em> — drawn from a universe of{" "}
        {c.universe_size} positive-ConvictionScore positions across 9 quarters of 13F
        data (time-decayed, 6 signal layers), sector-capped at {COMPOSITE_MAX_PER_SECTOR} per
        sector, and <strong>conviction-weighted</strong> so each slot scales with the
        intensity of cross-manager accumulation.
      </p>

      <p className="text-dim text-sm leading-relaxed max-w-3xl mb-8">
        This is <strong>pure data-display</strong>, not investment advice. Not an
        &ldquo;optimal&rdquo; or &ldquo;ultimate&rdquo; portfolio. Not a buy
        recommendation. HoldLens has no licensed financial-advisor credentials. The
        Conviction reflects aggregate institutional positioning per the public-record
        13F snapshot — already 45 days lagged per SEC rules. Rebalances quarterly when
        new filings land, never daily or hourly. Read the{" "}
        <Link href="/methodology" className="text-brand underline">methodology</Link>{" "}
        +{" "}
        <Link href="#how-composed" className="text-brand underline">
          how this is composed
        </Link>{" "}
        below.
      </p>

      <DataFreshness />
      <MethodologyDisclaimer />

      {/* Quick stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <StatCard label="Positions" value={c.total_positions.toString()} />
        <StatCard label="Avg ConvictionScore" value={formatSignedScore(Math.round(c.avg_score))} tint="emerald" />
        <StatCard label="Sectors covered" value={c.sector_breakdown.length.toString()} />
        <StatCard
          label="Last rebalance"
          value={c.rebalance_date}
          sub={`next: ${c.next_rebalance_estimate.split(" (")[0]}`}
        />
      </div>

      {/* Methodology compact summary */}
      <section className="rounded-card border border-border bg-surface-muted p-5 mb-10">
        <h2 className="text-base font-bold text-text mb-3">How this is composed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted leading-relaxed">
          <div><span className="text-emerald-400 mr-1">1.</span> Universe: every tracked stock with ConvictionScore ≥ +{COMPOSITE_MIN_SCORE} (positive net-accumulation across 9 time-decayed quarters)</div>
          <div><span className="text-emerald-400 mr-1">2.</span> Sort by score descending (heaviest aggregate accumulation first)</div>
          <div><span className="text-emerald-400 mr-1">3.</span> Walk the list, accept each ticker IF its sector hasn&apos;t hit {COMPOSITE_MAX_PER_SECTOR} positions (count cap)</div>
          <div><span className="text-emerald-400 mr-1">4.</span> Stop at {COMPOSITE_TARGET_POSITIONS} positions or universe exhausted</div>
          <div><span className="text-emerald-400 mr-1">5.</span> Conviction-weighted: each slot = score ÷ sum-of-scores × 100 (higher conviction = larger weight)</div>
          <div><span className="text-emerald-400 mr-1">6.</span> Refresh when new 13F filings land (quarterly only)</div>
        </div>
        <p className="text-xs text-dim mt-4 leading-relaxed">
          Intentionally simple: conviction-weighted + sector-count cap. No active
          optimization, no factor tilts, no leverage, no derivatives, no shorts, no
          &ldquo;alpha generation&rdquo; claims. The discipline is the diversification
          cap; sizing reflects intensity of cross-manager accumulation.
        </p>
      </section>

      {/* Export + API links */}
      <div className="flex items-center gap-3 flex-wrap mb-10">
        <CsvExportButton
          endpoint="/api/v1/best-now.json"
          filename="holdlens-composite"
          label="Export as CSV"
        />
        <Link
          href="/api/v1/snapshot/latest.json"
          className="text-xs text-muted hover:text-brand underline"
        >
          JSON snapshot · /api/v1/snapshot/latest.json
        </Link>
        <Link
          href="/scores"
          className="text-xs text-muted hover:text-brand underline"
        >
          See all {/* dynamic could be replaced */}{c.total_positions}+ scored stocks · /scores
        </Link>
      </div>

      {/* Sector breakdown */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2">Sector breakdown</h2>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          Sector-count cap (max {COMPOSITE_MAX_PER_SECTOR} positions per sector ≈ {Math.round((COMPOSITE_MAX_PER_SECTOR / COMPOSITE_TARGET_POSITIONS) * 100)}% by count)
          forces baseline diversification. Bars below show aggregate weight per sector
          under the conviction-weighted sizing — actual share varies by the
          ConvictionScore intensity of each sector&apos;s positions.
        </p>
        <div className="space-y-2">
          {c.sector_breakdown.map((s) => {
            // Scale bar to the largest sector weight in the breakdown so the
            // visual fills the row without overflowing. Pure display, not data.
            const maxSectorWeight = c.sector_breakdown[0]?.weight_pct || 100;
            const barPct = Math.min(100, (s.weight_pct / maxSectorWeight) * 100);
            return (
              <div key={s.sector} className="flex items-center gap-3 text-sm">
                <div className="w-32 sm:w-44 shrink-0 text-text">{s.sector}</div>
                <div className="flex-1 rounded-full bg-surface-muted h-3 overflow-hidden">
                  <div
                    className="h-full bg-brand/70"
                    style={{ width: `${barPct}%` }}
                    aria-label={`${s.sector}: ${s.weight_pct.toFixed(1)}% of composite weight`}
                  />
                </div>
                <div className="w-20 text-right text-muted tabular-nums">
                  {s.weight_pct.toFixed(1)}%
                </div>
                <div className="w-12 text-right text-dim text-xs tabular-nums">
                  {s.ticker_count}×
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <AdSlot format="in-article" priority="primary" />

      {/* Holdings table */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-2">
          All {c.total_positions} positions
        </h2>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          Ordered by ConvictionScore. Weight scales with score — top position{" "}
          {topWeightPct.toFixed(2)}%, bottom {bottomWeightPct.toFixed(2)}%. Click ticker
          for the per-stock dossier.
        </p>
        <p className="text-xs text-dim mb-4">
          <strong className="text-muted">Buyer CAGR</strong> column shows the
          average 10-year historical compound annual return of the public-record
          managers who built each position (sources: Berkshire annual reports,
          PSH NAV, public mutual funds, partner letters). Backward-looking
          public data only — not a forecast, not a recommendation.
        </p>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto rounded-card border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border">
                <th scope="col" className="py-3 px-3 text-xs uppercase tracking-wider text-muted font-semibold w-12">#</th>
                <th scope="col" className="py-3 px-3 text-xs uppercase tracking-wider text-muted font-semibold">Ticker</th>
                <th scope="col" className="py-3 px-3 text-xs uppercase tracking-wider text-muted font-semibold">Company</th>
                <th scope="col" className="py-3 px-3 text-xs uppercase tracking-wider text-muted font-semibold hidden lg:table-cell">Sector</th>
                <th scope="col" className="py-3 px-3 text-xs uppercase tracking-wider text-muted font-semibold text-right">Score</th>
                <th scope="col" className="py-3 px-3 text-xs uppercase tracking-wider text-muted font-semibold hidden lg:table-cell">Tier</th>
                <th scope="col" className="py-3 px-3 text-xs uppercase tracking-wider text-muted font-semibold text-right">Buyers</th>
                <th
                  scope="col"
                  className="py-3 px-3 text-xs uppercase tracking-wider text-muted font-semibold text-right hidden xl:table-cell"
                  title="Average 10-year historical CAGR of the public-record managers who built this position. Backward-looking only — not a forecast."
                >
                  Buyer CAGR
                </th>
                <th scope="col" className="py-3 px-3 text-xs uppercase tracking-wider text-muted font-semibold text-right">Weight</th>
              </tr>
            </thead>
            <tbody>
              {c.holdings.map((h) => {
                const { label, color } = convictionLabel(h.score);
                const colorClass = color === "emerald" ? "text-emerald-400" : color === "rose" ? "text-rose-400" : "text-muted";
                const hasPage = hasTickerPage(h.ticker);
                const avgBuyerCagr =
                  h.topBuyers && h.topBuyers.length > 0
                    ? h.topBuyers.reduce((s, b) => s + b.cagr, 0) / h.topBuyers.length
                    : null;
                return (
                  <tr key={h.ticker} className="border-b border-border last:border-b-0 hover:bg-surface-muted transition-colors">
                    <td className="py-2.5 px-3 text-muted tabular-nums text-xs">{h.rank_in_composite}</td>
                    <td className="py-2.5 px-3">
                      {hasPage ? (
                        <Link href={`/ticker/${h.ticker}/`} className="text-brand hover:underline font-bold tabular-nums">
                          {h.ticker}
                        </Link>
                      ) : (
                        <span className="text-text font-bold tabular-nums">{h.ticker}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-text text-xs max-w-[220px] truncate">{h.name}</td>
                    <td className="py-2.5 px-3 text-muted text-xs hidden lg:table-cell">{h.sector || "—"}</td>
                    <td className={`py-2.5 px-3 text-right font-bold tabular-nums ${colorClass}`}>
                      {formatSignedScore(h.score)}
                    </td>
                    <td className={`py-2.5 px-3 text-xs hidden lg:table-cell ${colorClass}`}>{label}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 tabular-nums text-xs">{h.buyerCount}</td>
                    <td className="py-2.5 px-3 text-right text-muted tabular-nums text-xs hidden xl:table-cell">
                      {avgBuyerCagr != null ? `${avgBuyerCagr >= 0 ? "+" : ""}${avgBuyerCagr.toFixed(1)}%` : "—"}
                    </td>
                    <td className="py-2.5 px-3 text-right text-text tabular-nums text-xs">{h.weight_pct.toFixed(2)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-2">
          {c.holdings.map((h) => {
            const { label, color } = convictionLabel(h.score);
            const colorClass = color === "emerald" ? "text-emerald-400" : color === "rose" ? "text-rose-400" : "text-muted";
            const hasPage = hasTickerPage(h.ticker);
            return (
              <div key={h.ticker} className="rounded-card border border-border bg-surface p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-muted tabular-nums text-xs">#{h.rank_in_composite}</span>
                    {hasPage ? (
                      <Link href={`/ticker/${h.ticker}/`} className="text-brand font-bold tabular-nums">{h.ticker}</Link>
                    ) : (
                      <span className="text-text font-bold tabular-nums">{h.ticker}</span>
                    )}
                    <span className="text-dim text-xs">· {h.weight_pct.toFixed(2)}%</span>
                  </div>
                  <div className={`text-lg font-bold tabular-nums ${colorClass}`}>
                    {formatSignedScore(h.score)}
                  </div>
                </div>
                <div className="text-xs text-text mb-1 truncate">{h.name}</div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                  <span className={colorClass}>{label}</span>
                  {h.sector && (<><span className="text-dim">·</span><span>{h.sector}</span></>)}
                  <span className="text-dim">·</span>
                  <span><span className="text-emerald-400">{h.buyerCount}</span> buyers</span>
                  {h.topBuyers && h.topBuyers.length > 0 && (
                    <>
                      <span className="text-dim">·</span>
                      <span>
                        buyer CAGR{" "}
                        <span className="text-text tabular-nums">
                          {(() => {
                            const avg = h.topBuyers.reduce((s, b) => s + b.cagr, 0) / h.topBuyers.length;
                            return `${avg >= 0 ? "+" : ""}${avg.toFixed(1)}%`;
                          })()}
                        </span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why these specific rules */}
      <section id="how-composed" className="mt-16 pt-10 border-t border-border">
        <h2 className="text-2xl font-bold mb-4">Why these specific rules</h2>
        <div className="space-y-6 text-text leading-relaxed">
          <div>
            <h3 className="text-base font-bold mb-2">
              Why positive ConvictionScore (no arbitrary floors)
            </h3>
            <p className="text-muted">
              ConvictionScore already aggregates 9 time-decayed quarters of 13F data
              across 6 signal layers — smart-money consensus, contrarian flow, insider
              cross-check, trend streak, sector context, and prior-score persistence.
              That composite is the gate. Layering an extra &ldquo;≥+20 score&rdquo; or
              &ldquo;≥2 buyers&rdquo; floor on top would double-count what the score
              already encodes and discard real signal. The universe is every ticker
              with score ≥ +{COMPOSITE_MIN_SCORE} (net-accumulation positive). Currently{" "}
              {c.universe_size} candidates pass before the sector cap.
            </p>
          </div>
          <div>
            <h3 className="text-base font-bold mb-2">
              Why {COMPOSITE_MAX_PER_SECTOR}-per-sector count cap
            </h3>
            <p className="text-muted">
              Without a cap, the composite would historically pile into whichever sector
              the smartest investors are most concentrated in (often technology). Capping
              by <em>count</em> (≤{COMPOSITE_MAX_PER_SECTOR} positions per sector ≈{" "}
              {Math.round((COMPOSITE_MAX_PER_SECTOR / COMPOSITE_TARGET_POSITIONS) * 100)}%
              by count) forces baseline diversification independent of how heavy any
              individual position is. Count-based is simpler and more transparent than
              a weight-based cap — you can see at a glance how many positions a sector
              holds; the weight then varies by ConvictionScore intensity.
            </p>
          </div>
          <div>
            <h3 className="text-base font-bold mb-2">
              Why conviction-weighted (not equal-weight)
            </h3>
            <p className="text-muted">
              Methodology v1 used flat equal-weight (1/30 ≈ 3.33% each). v2 (live since
              2026-05-19) uses ALL available signal: a position&apos;s slot scales with
              its ConvictionScore (slot = score ÷ sum-of-selected-scores × 100). Higher
              conviction = larger weight. The score already encodes the multi-quarter,
              multi-signal evidence — equal-weight would discard that information. Top
              position currently {topWeightPct.toFixed(2)}%, bottom{" "}
              {bottomWeightPct.toFixed(2)}%. Sizing reflects intensity of cross-manager
              accumulation, not a uniform rule.
            </p>
          </div>
          <div>
            <h3 className="text-base font-bold mb-2">
              Why quarterly (not daily/hourly) rebalance
            </h3>
            <p className="text-muted">
              13F filings only emit every 90 days (SEC filing deadline = 45 days after
              quarter end). Daily/hourly rebalancing would be theater — no new data is
              available between quarters. Real-time rebalancing also requires registered
              investment-advisor (RIA) credentials, which HoldLens does not hold. The
              cadence is determined by the SEC&apos;s 13F rules, not by us.
            </p>
          </div>
          <div>
            <h3 className="text-base font-bold mb-2">
              What this composite is NOT
            </h3>
            <p className="text-muted">
              Not an &ldquo;optimal portfolio.&rdquo; Not a recommendation to buy or sell
              any security. Not a backtested-and-validated index. Not a registered
              investment product. Not real-time. ConvictionScore correlation with forward
              returns is r = −0.12 across 221 ticker-quarter pairs — no predictive signal.
              The composite is a <em>positioning tracker</em>: what tracked managers
              already did, aggregated and described. Anyone considering acting on it
              should consult a licensed financial advisor first.
            </p>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="mt-16 pt-10 border-t border-border">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>→ <Link href="/scores" className="text-brand underline">ConvictionScore rankings — every tracked stock</Link></li>
          <li>→ <Link href="/best-now" className="text-brand underline">Most-bought + most-sold this quarter</Link></li>
          <li>→ <Link href="/big-bets" className="text-brand underline">Big bets — top 100 by conviction × size</Link></li>
          <li>→ <Link href="/consensus" className="text-brand underline">Consensus — widely held + net buying</Link></li>
          <li>→ <Link href="/concentration" className="text-brand underline">Concentration — managers ranked by top-N weight</Link></li>
          <li>→ <Link href="/reports/2026-05-q1-2026-13f-signal-summary" className="text-brand underline">Q1 2026 13F signal summary</Link></li>
          <li>→ <Link href="/api/v1/snapshot/latest.json" className="text-brand underline">Snapshot JSON (LLM/dev)</Link></li>
          <li>→ <Link href="/learn/conviction-score-explained" className="text-brand underline">How ConvictionScore is computed</Link></li>
        </ul>
      </section>

      <p className="text-xs text-dim pt-8 border-t border-border mt-12 leading-relaxed">
        Not investment advice. The Conviction is a descriptive aggregate of
        public SEC 13F filings — what tracked managers <em>already did</em>, not what
        they will do, not what you should do. Position sizing is conviction-weighted
        (slot ∝ ConvictionScore); sector-count cap is the only risk discipline applied.
        45-day filing lag applies to all underlying data. HoldLens holds no
        licensed-advisor credentials. Consult a licensed financial advisor before
        acting on any of this. See{" "}
        <Link href="/methodology" className="text-brand underline">methodology</Link>{" "}
        +{" "}
        <Link href="/disclaimer" className="text-brand underline">disclaimer</Link>.
      </p>
    </div>
  )} <div className="mx-auto max-w-5xl px-6"><InvestingBooks heading="Reading for your research" sub="Optional background reading on interpreting company disclosures and investing methods. These books do not validate a signal or predict returns." showAudible={false} limit={2} /></div> </>;
}

// ---------- Components ----------

function StatCard({ label, value, sub, tint }: { label: string; value: string; sub?: string; tint?: "emerald" }) {
  const valColor = tint === "emerald" ? "text-emerald-400" : "text-text";
  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <div className="text-xs text-muted uppercase tracking-wider">{label}</div>
      <div className={`text-2xl font-bold ${valColor} tabular-nums mt-1`}>{value}</div>
      {sub && <div className="text-[10px] text-dim mt-1">{sub}</div>}
    </div>
  );
}
