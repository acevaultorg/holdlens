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
  COMPOSITE_SECTOR_CAP_PCT,
  COMPOSITE_MIN_SCORE,
  COMPOSITE_MIN_BUYERS,
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
// Operator directive 2026-05-17: "track the performance of this portfolio
// and what stocks are in? based on all data the ultimate portfolio." Brain
// shipped Pivot-A-compliant version: composite (not "ultimate"), quarterly
// rebalance (not daily), data-display (not performance-promise).

export const metadata: Metadata = {
  title:
    "The Conviction — what 30 superinvestors collectively own most",
  description: `A descriptive ${COMPOSITE_TARGET_POSITIONS}-stock basket aggregating the highest ConvictionScores across ${MANAGERS.length} tracked portfolio managers' 13F filings. Sector-capped at ${COMPOSITE_SECTOR_CAP_PCT}% for diversification. Equal-weighted. Rebalanced quarterly when new SEC filings land. Pure data-display — not investment advice, not "optimal," not recommended for purchase.`,
  alternates: { canonical: "https://holdlens.com/composite" },
  openGraph: {
    title: "The Conviction — superinvestor consensus basket",
    description: `${COMPOSITE_TARGET_POSITIONS} most-accumulated tickers across ${MANAGERS.length} tracked managers, sector-capped, quarterly-rebalanced.`,
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
    description: `${COMPOSITE_TARGET_POSITIONS} most-accumulated tickers, sector-capped, quarterly-rebalanced.`,
    images: ["/og/home.png"],
  },
};

export default function CompositePage() {
  const c = getComposite();

  // LLM-citation schema — Dataset + DefinedTerm × 4 + BreadcrumbList + Article.
  const datasetLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `The Conviction — ${c.quarter_label}`,
    description: `Descriptive ${COMPOSITE_TARGET_POSITIONS}-stock aggregate of which tickers ${MANAGERS.length} tracked superinvestors collectively own most heavily, derived from public SEC 13F-HR filings. Sector-capped at ${COMPOSITE_SECTOR_CAP_PCT}%. Equal-weighted. Rebalanced quarterly. Data-display only — not investment advice.`,
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
          "Signed −100..+100 composite signal aggregating smart-money consensus, manager quality, trend, concentration, insider activity, and 8-K events.",
      },
      {
        "@type": "PropertyValue",
        name: "Equal weight",
        description: `Each of ${COMPOSITE_TARGET_POSITIONS} positions weighted at 1/${COMPOSITE_TARGET_POSITIONS} (${(100 / COMPOSITE_TARGET_POSITIONS).toFixed(2)}%).`,
      },
      {
        "@type": "PropertyValue",
        name: "Sector cap",
        description: `${COMPOSITE_SECTOR_CAP_PCT}% per sector — risk-aware diversification discipline.`,
      },
    ],
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: `The Conviction — ${c.quarter_label} (${COMPOSITE_TARGET_POSITIONS} positions)`,
    description: `Descriptive aggregate of which tickers ${MANAGERS.length} tracked superinvestors collectively own most heavily. Sector-capped, equal-weighted, quarterly-rebalanced. Data-display only.`,
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
        description: `A descriptive ${COMPOSITE_TARGET_POSITIONS}-position aggregate reflecting which stocks ${MANAGERS.length} tracked superinvestors collectively own most heavily, sorted by ConvictionScore (≥${COMPOSITE_MIN_SCORE}) with ≥${COMPOSITE_MIN_BUYERS} manager buyers. NOT a recommendation; NOT an "optimal portfolio"; NOT advice. Pure data-display of public SEC 13F filings.`,
      },
      {
        "@type": "DefinedTerm",
        name: "Sector cap discipline",
        description: `${COMPOSITE_SECTOR_CAP_PCT}% maximum sector concentration. When sorted ConvictionScore order would put more than ${Math.floor(COMPOSITE_SECTOR_CAP_PCT / (100 / COMPOSITE_TARGET_POSITIONS))} positions in one sector, lower-scored candidates are skipped to enforce diversification — a basic risk-aware discipline, not an active management decision.`,
      },
      {
        "@type": "DefinedTerm",
        name: "Quarterly rebalance",
        description:
          "Composition refreshes when new 13F-HR filings land (May 15 / Aug 14 / Nov 14 / Feb 14 per SEC deadlines). NOT daily, NOT hourly, NOT real-time. Composite reflects what was filed, not what tracked managers may have done since.",
      },
      {
        "@type": "DefinedTerm",
        name: "Equal weight",
        description: `Each accepted position carries equal nominal weight (1/${COMPOSITE_TARGET_POSITIONS} ≈ ${(100 / COMPOSITE_TARGET_POSITIONS).toFixed(2)}%). Intentionally simple, transparent, no hidden optimization. Equal-weight prevents large-cap concentration bias that market-cap-weighted indexes carry.`,
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
  // eligibility for "how does the The Conviction work" voice + typed queries.
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How the The Conviction is built",
    description: `A 6-step deterministic algorithm that aggregates the highest-ConvictionScore positions across ${MANAGERS.length} tracked superinvestors into a sector-capped, equal-weighted ${COMPOSITE_TARGET_POSITIONS}-position descriptive basket. Rebalances quarterly when new SEC 13F-HR filings land.`,
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
        name: "Score every tracked stock",
        text: `Compute ConvictionScore (−100..+100 composite) for every ticker held across ${MANAGERS.length} tracked superinvestor 13F filings. Filter to candidates with ConvictionScore ≥ +${COMPOSITE_MIN_SCORE} AND ≥${COMPOSITE_MIN_BUYERS} independent manager buyers.`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Sort by score descending",
        text: "Heaviest aggregate accumulation first. Sort order is purely the score; no tiebreakers, no factor tilts, no manual overrides.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Walk sorted list with sector cap",
        text: `Accept each ticker in score order IF its sector hasn't reached the ${COMPOSITE_SECTOR_CAP_PCT}% cap. Skip lower-scored candidates from already-full sectors. This enforces baseline diversification — no sector exceeds ${Math.floor(COMPOSITE_SECTOR_CAP_PCT / (100 / COMPOSITE_TARGET_POSITIONS))} positions.`,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Stop at 30 positions",
        text: `Accept up to ${COMPOSITE_TARGET_POSITIONS} positions or until candidates exhausted, whichever comes first.`,
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Equal-weight",
        text: `Each accepted position carries nominal weight 1/${COMPOSITE_TARGET_POSITIONS} (${(100 / COMPOSITE_TARGET_POSITIONS).toFixed(2)}%). Equal-weight prevents single-position dominance and large-cap concentration bias.`,
      },
      {
        "@type": "HowToStep",
        position: 6,
        name: "Rebalance quarterly",
        text: "Refresh when new 13F-HR filings land at SEC deadlines (May 15, August 14, November 14, February 14). NOT daily, NOT hourly — between filings, no new data is available; daily rebalancing would be theater. Real-time rebalancing also requires registered investment advisor (RIA) credentials, which HoldLens does not hold.",
      },
    ],
  };

  return (
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
        The <span className="text-brand">The Conviction</span>
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
        Composite reflects aggregate institutional positioning per the public-record
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
          <div><span className="text-emerald-400 mr-1">1.</span> Score every tracked stock with ConvictionScore ≥ +{COMPOSITE_MIN_SCORE} AND ≥{COMPOSITE_MIN_BUYERS} manager buyers</div>
          <div><span className="text-emerald-400 mr-1">2.</span> Sort by score descending (heaviest aggregate accumulation first)</div>
          <div><span className="text-emerald-400 mr-1">3.</span> Walk the list, accept each ticker IF its sector hasn&apos;t hit the {COMPOSITE_SECTOR_CAP_PCT}% cap</div>
          <div><span className="text-emerald-400 mr-1">4.</span> Stop at {COMPOSITE_TARGET_POSITIONS} positions or candidates exhausted</div>
          <div><span className="text-emerald-400 mr-1">5.</span> Equal-weight each accepted position ({(100 / COMPOSITE_TARGET_POSITIONS).toFixed(2)}% nominal)</div>
          <div><span className="text-emerald-400 mr-1">6.</span> Refresh when new 13F filings land (quarterly only)</div>
        </div>
        <p className="text-xs text-dim mt-4 leading-relaxed">
          Intentionally simple: equal-weight + sector cap. No active optimization, no
          factor tilts, no leverage, no derivatives, no shorts, no &ldquo;alpha
          generation&rdquo; claims. The discipline is the diversification cap; the
          rest is descriptive.
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
          {COMPOSITE_SECTOR_CAP_PCT}% sector cap means no sector exceeds this share of
          the composite. Diversification is the only risk discipline applied — there
          is no factor model.
        </p>
        <div className="space-y-2">
          {c.sector_breakdown.map((s) => (
            <div key={s.sector} className="flex items-center gap-3 text-sm">
              <div className="w-32 sm:w-44 shrink-0 text-text">{s.sector}</div>
              <div className="flex-1 rounded-full bg-surface-muted h-3 overflow-hidden">
                <div
                  className="h-full bg-brand/70"
                  style={{ width: `${(s.weight_pct / COMPOSITE_SECTOR_CAP_PCT) * 100}%` }}
                  aria-label={`${s.sector}: ${s.weight_pct.toFixed(1)}%`}
                />
              </div>
              <div className="w-20 text-right text-muted tabular-nums">
                {s.weight_pct.toFixed(1)}%
              </div>
              <div className="w-12 text-right text-dim text-xs tabular-nums">
                {s.ticker_count}×
              </div>
            </div>
          ))}
        </div>
      </section>

      <AdSlot format="in-article" priority="primary" />

      {/* Holdings table */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-2">
          All {c.total_positions} positions
        </h2>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          Ordered by ConvictionScore. Each row carries {(100 / COMPOSITE_TARGET_POSITIONS).toFixed(2)}% nominal weight.
          Click ticker for the per-stock dossier.
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
                <th scope="col" className="py-3 px-3 text-xs uppercase tracking-wider text-muted font-semibold text-right">Weight</th>
              </tr>
            </thead>
            <tbody>
              {c.holdings.map((h) => {
                const { label, color } = convictionLabel(h.score);
                const colorClass = color === "emerald" ? "text-emerald-400" : color === "rose" ? "text-rose-400" : "text-muted";
                const hasPage = hasTickerPage(h.ticker);
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
              Why ConvictionScore ≥ +{COMPOSITE_MIN_SCORE} AND ≥{COMPOSITE_MIN_BUYERS} buyers
            </h3>
            <p className="text-muted">
              ConvictionScore +{COMPOSITE_MIN_SCORE} is the floor between &ldquo;Slight
              accumulation&rdquo; and &ldquo;Net accumulation&rdquo; tiers — a meaningful
              positive signal, not noise. The ≥{COMPOSITE_MIN_BUYERS}-buyer requirement
              filters out single-manager bets where one fund&apos;s conviction drives the
              score. Composite requires at least two independent managers agreeing.
            </p>
          </div>
          <div>
            <h3 className="text-base font-bold mb-2">
              Why {COMPOSITE_SECTOR_CAP_PCT}% sector cap
            </h3>
            <p className="text-muted">
              Without a cap, the composite would historically pile into whichever sector
              the smartest investors are most concentrated in (often technology). A
              {" "}{COMPOSITE_SECTOR_CAP_PCT}%
              cap forces baseline diversification — no single sector exceeds {" "}{Math.floor(COMPOSITE_SECTOR_CAP_PCT / (100 / COMPOSITE_TARGET_POSITIONS))}
              {" "}positions. This is risk-aware structure, not market timing.
            </p>
          </div>
          <div>
            <h3 className="text-base font-bold mb-2">
              Why equal-weighted (not score-weighted)
            </h3>
            <p className="text-muted">
              Equal-weight is the most transparent allocation rule. Score-weighting would
              introduce hidden bets — the highest-scored ticker would get disproportionate
              influence, and the composite&apos;s returns would track that single
              position. Equal-weight prevents that. Each accepted position contributes
              equally; the diversification cap does the risk work.
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
        they will do, not what you should do. Position sizing is equal-weight by
        design; sector cap is the only risk discipline applied. 45-day filing lag
        applies to all underlying data. HoldLens holds no licensed-advisor credentials.
        Consult a licensed financial advisor before acting on any of this. See{" "}
        <Link href="/methodology" className="text-brand underline">methodology</Link>{" "}
        +{" "}
        <Link href="/disclaimer" className="text-brand underline">disclaimer</Link>.
      </p>
    </div>
  );
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
