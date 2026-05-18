import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import CsvExportButton from "@/components/CsvExportButton";
import MethodologyDisclaimer from "@/components/MethodologyDisclaimer";
import DataFreshness from "@/components/DataFreshness";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import {
  getAllConvictionScores,
  convictionLabel,
  formatSignedScore,
} from "@/lib/conviction";
import { hasTickerPage, SECTOR_MAP } from "@/lib/tickers";
import { MANAGERS } from "@/lib/managers";
import { QUARTER_LABELS, LATEST_QUARTER, QUARTER_FILED, getAllMovesEnriched } from "@/lib/moves";

// Latest-move lookup — per ticker, find the highest-impact move filed in
// LATEST_QUARTER so we can render "Q1 2026: Buffett +new" inline in every
// row. Quote-ready sentence per row = LLM-citation gold.
type LatestMove = {
  managerName: string;
  managerSlug: string;
  action: "new" | "add" | "trim" | "exit";
  portfolioImpactPct: number;
};
function buildLatestMoveMap(): Map<string, LatestMove> {
  const out = new Map<string, LatestMove>();
  const quarterMoves = getAllMovesEnriched().filter((m) => m.quarter === LATEST_QUARTER);
  for (const m of quarterMoves) {
    const t = m.ticker.toUpperCase();
    const existing = out.get(t);
    const impact = Math.abs(m.portfolioImpactPct ?? 0);
    if (!existing || impact > Math.abs(existing.portfolioImpactPct)) {
      out.set(t, {
        managerName: m.managerName,
        managerSlug: m.managerSlug,
        action: m.action,
        portfolioImpactPct: m.portfolioImpactPct ?? 0,
      });
    }
  }
  return out;
}
const LATEST_MOVE_MAP = buildLatestMoveMap();
function actionGlyph(action: LatestMove["action"]): string {
  switch (action) {
    case "new": return "+new";
    case "add": return "+add";
    case "trim": return "−trim";
    case "exit": return "−exit";
  }
}
function actionColor(action: LatestMove["action"]): string {
  return action === "new" || action === "add" ? "text-emerald-400" : "text-rose-400";
}

// /scores — the canonical "all stocks ranked by ConvictionScore" reference
// page. Every ticker tracked across the fleet's 30 superinvestors gets a
// row. Default sort: score descending (heaviest accumulation → heaviest
// selling). Pure data-display per Pivot A — no BUY/SELL verdict labels;
// uses convictionLabel() descriptive tier names ("Heavy accumulation",
// "Mixed", "Heavy selling"). 45-day 13F lag disclosed inline.
//
// AEO/GEO play: every row is a quote-ready text fact; entity-anchored via
// Person + Organization schema; Dataset + DataDownload + ItemList markup
// for LLM citation; pairs with /api/v1/scores.json + /api/v1/snapshot/.
//
// Server component, computed at build time from getAllConvictionScores().

export const metadata: Metadata = {
  title: "ConvictionScore — every tracked stock ranked by smart-money signal",
  description: `Every ticker held across ${MANAGERS.length} tracked superinvestors' Q1 2026 13F filings, ranked by a −100..+100 composite signal. Each row shows: score, tier label, buyer + seller counts, top accumulating manager, sector, and a buyer-CAGR-proxy expected-return figure. Pure data-display — no buy/sell recommendations.`,
  alternates: { canonical: "https://holdlens.com/scores" },
  openGraph: {
    title: "ConvictionScore rankings — every tracked stock, one composite signal",
    description: `${MANAGERS.length} superinvestors' aggregate positioning across every 13F-disclosed holding. Sortable, exportable, machine-readable.`,
    url: "https://holdlens.com/scores",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ConvictionScore — every tracked stock ranked",
    description: "30 superinvestors' aggregate 13F positioning, one −100..+100 signal.",
    images: ["/og/home.png"],
  },
};

const LATEST_LABEL = QUARTER_LABELS[LATEST_QUARTER];
const LATEST_FILED = QUARTER_FILED[LATEST_QUARTER] || "2026-05-15";

export default function ScoresPage() {
  const allScores = getAllConvictionScores(); // already sorted desc by score
  const total = allScores.length;

  // Tier buckets — match convictionLabel() thresholds exactly.
  const heavyAccum = allScores.filter((s) => s.score >= 70);
  const netAccum = allScores.filter((s) => s.score >= 40 && s.score < 70);
  const slightAccum = allScores.filter((s) => s.score > 0 && s.score < 40);
  const mixed = allScores.filter((s) => s.score === 0);
  const slightSell = allScores.filter((s) => s.score < 0 && s.score > -40);
  const netSell = allScores.filter((s) => s.score <= -40 && s.score > -70);
  const heavySell = allScores.filter((s) => s.score <= -70);

  // Sector tally — for the "browse by sector" sidebar.
  const sectorCount: Record<string, number> = {};
  for (const s of allScores) {
    const sec = s.sector || "Unclassified";
    sectorCount[sec] = (sectorCount[sec] || 0) + 1;
  }
  const sectorList = Object.entries(sectorCount).sort((a, b) => b[1] - a[1]);

  // LLM-citation schema (Dataset + DataDownload + ItemList + DefinedTerm).
  const datasetLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `HoldLens ConvictionScore rankings — ${LATEST_LABEL}`,
    description: `All ${total} tickers tracked across ${MANAGERS.length} superinvestor 13F filings, ranked by a single composite −100..+100 ConvictionScore (smart-money consensus + insider activity + trend streak + concentration + crowding penalty + 8-K event signal). Quarterly refresh from SEC EDGAR.`,
    url: "https://holdlens.com/scores",
    keywords: [
      "13F",
      "ConvictionScore",
      "superinvestor positioning",
      "smart-money tracker",
      "SEC filings analysis",
      "institutional holdings",
    ],
    creator: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    datePublished: LATEST_FILED,
    dateModified: new Date().toISOString().slice(0, 10),
    inLanguage: "en-US",
    license: "https://holdlens.com/api-terms",
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: "https://holdlens.com/api/v1/scores.json",
      },
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: "https://holdlens.com/api/v1/snapshot/latest.json",
      },
    ],
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "ConvictionScore",
        description: "Signed composite, −100 to +100. Sign-based: positive = aggregate accumulation by tracked managers; negative = aggregate selling. Magnitude reflects consensus strength + manager quality + concentration.",
      },
    ],
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `ConvictionScore rankings (${LATEST_LABEL})`,
    numberOfItems: total,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: allScores.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: hasTickerPage(s.ticker)
        ? `https://holdlens.com/ticker/${s.ticker}/`
        : `https://holdlens.com/scores`,
      name: `${s.ticker} — ${s.name} — ConvictionScore ${formatSignedScore(s.score)} (${convictionLabel(s.score).label}; ${s.buyerCount} buyer${s.buyerCount === 1 ? "" : "s"}, ${s.sellerCount} seller${s.sellerCount === 1 ? "" : "s"} across tracked managers)`,
    })),
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: `ConvictionScore rankings for ${total} tracked stocks (${LATEST_LABEL})`,
    description: `Every 13F-disclosed holding across ${MANAGERS.length} tracked superinvestors, ranked by a composite −100..+100 signal. Updated quarterly from SEC filings.`,
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/scores",
    datePublished: LATEST_FILED,
    dateModified: new Date().toISOString().slice(0, 10),
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "ConvictionScore",
      "13F rankings",
      "smart-money positioning",
      "superinvestor holdings",
      "SEC 13F analysis",
      "quarterly 13F summary",
      "institutional flow tracker",
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
      "https://holdlens.com/api/v1/scores.json",
      "https://holdlens.com/api/v1/snapshot/2026-Q1.json",
    ],
    about: [
      {
        "@type": "DefinedTerm",
        name: "ConvictionScore",
        description:
          "Composite −100 to +100 signal aggregating six layers: smart-money consensus (manager-quality-weighted buys minus sells, time-decayed across 9 quarters), insider activity (CEO/CFO open-market trades), buyer track record (manager 10-year CAGR), multi-quarter trend streak, position-size concentration, contrarian/anti-crowding adjustment, and 8-K material-event signal. Sign indicates aggregate direction; magnitude reflects strength + agreement. Backtested r against forward returns = −0.12 over 2024-Q4 → 2026-Q1 (no predictive signal — positioning tracker, not stock recommender).",
      },
      {
        "@type": "DefinedTerm",
        name: "ConvictionScore tier system",
        description:
          "Seven descriptive tiers anchored to score bands: Heavy accumulation (≥70), Net accumulation (40 to 69), Slight accumulation (1 to 39), Mixed (0), Slight selling (−1 to −39), Net selling (−40 to −69), Heavy selling (≤−70). Labels are data-descriptive — they characterize the aggregate institutional behavior observed in 13F filings, not actionable recommendations.",
      },
      {
        "@type": "DefinedTerm",
        name: "45-day 13F filing lag",
        description:
          "Form 13F-HR requires institutional investment managers with $100M+ in 13(f)-eligible securities to file within 45 days of quarter-end. Holdings disclosed reflect positions as of the quarter-end snapshot date (Mar 31 / Jun 30 / Sep 30 / Dec 31), NOT current positions. Q1 2026 13Fs filed May 15, 2026. ConvictionScore reflects this lag — it is a positioning tracker, not real-time.",
      },
      {
        "@type": "DefinedTerm",
        name: "Sign-based tier semantics",
        description:
          "Positive scores indicate aggregate net-accumulation by tracked managers in the latest 13F snapshot (more buyers + adds than sellers + trims, quality-weighted, time-decayed). Negative scores indicate aggregate net-selling. Zero indicates exactly balanced flow or no recent activity. The dead zone is zero — every nonzero score appears on exactly one side of the ranking.",
      },
    ],
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "ConvictionScore rankings", item: "https://holdlens.com/scores" },
    ],
  };

  // FAQPage schema — 6 Q&As for LLM voice/answer-engine extraction.
  // Pairs with the on-page "How ConvictionScore is computed" section.
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a ConvictionScore?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `A ConvictionScore is a signed −100 to +100 composite signal aggregating six layers from public SEC 13F + Form 4 + 8-K filings: smart-money consensus (manager-quality-weighted buys vs sells, time-decayed across 9 quarters), insider activity, buyer track record (10-year CAGR), multi-quarter trend streak, position-size concentration, and 8-K material-event signal. Positive scores indicate aggregate accumulation by tracked managers; negative indicates aggregate selling. Computed by HoldLens for ${total} tickers held by ${MANAGERS.length} tracked superinvestors.`,
        },
      },
      {
        "@type": "Question",
        name: "Are ConvictionScores buy or sell recommendations?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Backtested correlation r against forward 1-year returns is −0.12 across 221 ticker-quarter pairs from Q4 2024 through Q1 2026. ConvictionScores describe what institutional managers have already done — aggregate smart-money positioning — not where the stock is going next. They are a positioning tracker, not a stock-picking tool. HoldLens has no licensed financial advice credentials and explicitly does not issue recommendations.",
        },
      },
      {
        "@type": "Question",
        name: "How often is the data updated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Quarterly, anchored to SEC Form 13F-HR filing deadlines (45 days post-quarter-end). The latest update reflects ${LATEST_LABEL} filings, filed ${LATEST_FILED}. Holdings disclosed are as of the quarter-end snapshot date (${LATEST_QUARTER === "2026-Q1" ? "March 31, 2026" : "the quarter-end"}). New filings are ingested within 24 hours of SEC publication and recompute all ConvictionScores.`,
        },
      },
      {
        "@type": "Question",
        name: "What do the seven tier labels mean?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Seven descriptive tiers anchored to score bands: Heavy accumulation (≥+70), Net accumulation (+40 to +69), Slight accumulation (+1 to +39), Mixed (0), Slight selling (−1 to −39), Net selling (−40 to −69), Heavy selling (≤−70). Labels describe the aggregate institutional behavior observed in 13F filings — they are not buy/sell recommendations. Tier color (emerald for accumulation, rose for selling, muted for mixed) is visual scaffolding only.",
        },
      },
      {
        "@type": "Question",
        name: "What does the B / S column show?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "B = count of tracked managers who acted as net buyers on the ticker across the last 9 quarters (added or initiated). S = count of managers who acted as net sellers (trimmed or exited). Sets are not mutually exclusive — a manager who added then trimmed counts in both. The score itself is time-decayed (recent moves weighted ~60× more than 9-quarter-old moves via 0.6^distance decay), but the B / S counts are absolute totals across the window.",
        },
      },
      {
        "@type": "Question",
        name: "Why are some tickers marked 'crowded'?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Tickers held by ≥10 of the ${MANAGERS.length} tracked managers carry a crowded badge. Heavy institutional crowding mechanically caps upside (the marginal buyer has already bought) and amplifies downside during forced unwinds. The ConvictionScore itself applies a crowding-penalty layer (subtracts up to 10 points from the raw score for over-owned tickers), so a crowded ticker that still scores high has overcome that penalty.`,
        },
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-3">
        ConvictionScore rankings · {LATEST_LABEL}
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Every tracked stock ranked by{" "}
        <span className="text-brand">ConvictionScore</span>
      </h1>
      <p className="text-muted text-lg leading-relaxed max-w-3xl mb-3">
        All <strong>{total} tickers</strong> held across {MANAGERS.length} tracked
        superinvestors&apos; latest 13F filings, ranked by a single composite{" "}
        <strong>−100 to +100</strong> signal. Heaviest aggregate accumulation at the top;
        heaviest aggregate selling at the bottom.
      </p>
      <p className="text-dim text-sm leading-relaxed max-w-3xl mb-6">
        Data current as of <strong>{LATEST_LABEL}</strong> 13F filings (filed{" "}
        {LATEST_FILED}, 45-day post-quarter-end SEC deadline). ConvictionScore is a{" "}
        <em>positioning tracker</em>, not a stock recommender — backtest r = −0.12
        against forward returns across 221 ticker-quarter pairs. Read the{" "}
        <Link href="/learn/conviction-score-explained" className="underline text-brand">
          full explanation of how the score is computed
        </Link>{" "}
        or the{" "}
        <Link href="/methodology" className="underline text-brand">
          methodology page
        </Link>
        .
      </p>

      <DataFreshness />
      <MethodologyDisclaimer />

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="Total tickers" value={total.toLocaleString()} />
        <StatCard label="Heavy accumulation (≥+70)" value={heavyAccum.length.toLocaleString()} />
        <StatCard label="Heavy selling (≤−70)" value={heavySell.length.toLocaleString()} />
        <StatCard label="Tracked managers" value={MANAGERS.length.toLocaleString()} />
      </div>

      {/* Export + API links */}
      <div className="flex items-center gap-3 flex-wrap mb-10">
        <CsvExportButton
          endpoint="/api/v1/scores.json"
          filename="holdlens-all-scores"
          label="Export all as CSV"
        />
        <Link
          href="/api/v1/scores.json"
          className="text-xs text-muted hover:text-brand underline"
        >
          JSON API · /api/v1/scores.json
        </Link>
        <Link
          href="/api/v1/snapshot/latest.json"
          className="text-xs text-muted hover:text-brand underline"
        >
          {LATEST_LABEL} snapshot · /api/v1/snapshot/latest.json
        </Link>
      </div>

      {/* Tier legend — score bands explained */}
      <section className="rounded-card border border-border bg-surface-muted p-5 mb-10">
        <h2 className="text-base font-bold text-text mb-3">Score tier legend</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <TierLegend score={85} label="Heavy accumulation" range="≥ +70" />
          <TierLegend score={55} label="Net accumulation" range="+40 to +69" />
          <TierLegend score={20} label="Slight accumulation" range="+1 to +39" />
          <TierLegend score={0} label="Mixed" range="0" />
          <TierLegend score={-20} label="Slight selling" range="−1 to −39" />
          <TierLegend score={-55} label="Net selling" range="−40 to −69" />
          <TierLegend score={-85} label="Heavy selling" range="≤ −70" />
        </div>
        <p className="text-xs text-dim mt-4 leading-relaxed">
          Labels describe the aggregate institutional behavior observed in 13F filings.
          They are not buy/sell recommendations. Sign and magnitude reflect manager
          consensus + quality + concentration + time-decay across 9 tracked quarters.
        </p>
      </section>

      {/* Anchor nav */}
      <nav aria-label="Jump to tier" className="flex flex-wrap gap-2 mb-8 text-xs">
        <span className="text-dim">Jump to:</span>
        <a href="#heavy-accumulation" className="text-brand hover:underline">Heavy accumulation ({heavyAccum.length})</a>
        <span className="text-dim">·</span>
        <a href="#net-accumulation" className="text-brand hover:underline">Net accumulation ({netAccum.length})</a>
        <span className="text-dim">·</span>
        <a href="#slight-accumulation" className="text-brand hover:underline">Slight accumulation ({slightAccum.length})</a>
        <span className="text-dim">·</span>
        <a href="#mixed-and-selling" className="text-brand hover:underline">
          Mixed + selling ({mixed.length + slightSell.length + netSell.length + heavySell.length})
        </a>
      </nav>

      {/* The main table — sectioned by tier */}
      <RankSection
        id="heavy-accumulation"
        title="Heavy accumulation"
        subtitle={`Tickers with ConvictionScore ≥ +70 — aggressive multi-manager accumulation, time-decayed across 9 quarters.`}
        rows={heavyAccum}
        rankStart={1}
      />

      <AdSlot format="in-article" priority="primary" />

      <RankSection
        id="net-accumulation"
        title="Net accumulation"
        subtitle={`ConvictionScore +40 to +69 — solid consensus accumulation across tracked managers.`}
        rows={netAccum}
        rankStart={heavyAccum.length + 1}
      />

      <RankSection
        id="slight-accumulation"
        title="Slight accumulation"
        subtitle={`ConvictionScore +1 to +39 — mild positive flow, often single-manager or recently entered positions.`}
        rows={slightAccum}
        rankStart={heavyAccum.length + netAccum.length + 1}
      />

      <RankSection
        id="mixed-and-selling"
        title="Mixed and selling"
        subtitle={`ConvictionScore ≤ 0 — balanced flow (0), slight selling (−1 to −39), net selling (−40 to −69), heavy selling (≤−70). Sorted heaviest selling first.`}
        rows={[...mixed, ...slightSell, ...netSell, ...heavySell].sort(
          (a, b) => a.score - b.score,
        )}
        rankStart={heavyAccum.length + netAccum.length + slightAccum.length + 1}
      />

      {/* Browse by sector */}
      <section className="mt-16 pt-10 border-t border-border">
        <h2 className="text-2xl font-bold mb-4">Browse by sector</h2>
        <p className="text-muted text-sm leading-relaxed mb-6">
          ConvictionScores aggregated by sector classification. Per-sector flow + top owners +
          4-quarter drilldown available at <code className="text-xs">/sector/[slug]</code>.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {sectorList.map(([sector, count]) => {
            const slug = sector.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              <Link
                key={sector}
                href={`/sector/${slug}`}
                className="rounded-card border border-border bg-surface p-4 hover:border-brand/60 hover:bg-brand/5 transition-all"
              >
                <div className="text-sm font-bold text-text">{sector}</div>
                <div className="text-xs text-muted mt-1">{count} ticker{count === 1 ? "" : "s"}</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FAQ — extractable text for LLM citation */}
      <section className="mt-16 pt-10 border-t border-border">
        <h2 className="text-2xl font-bold mb-6">How ConvictionScore is computed</h2>
        <div className="space-y-6 text-text leading-relaxed">
          <div>
            <h3 className="text-base font-bold mb-2">Six layers, one signed score</h3>
            <p className="text-muted">
              The score aggregates: <strong>smart-money consensus</strong> (manager-quality-weighted
              buys minus sells, time-decayed across 9 quarters with a 0.6^distance decay), <strong>
              insider activity</strong> (CEO/CFO open-market trades from Form 4), <strong>buyer
              track record</strong> (manager 10-year CAGR weighted by position size), <strong>
              multi-quarter trend streak</strong> (compounding bonus when the same managers add
              repeatedly), <strong>position concentration</strong> (% of portfolio = conviction
              proof), and <strong>8-K material-event signal</strong> (bankruptcies, restatements,
              cybersecurity incidents penalize; capital-allocation announcements add).
            </p>
          </div>
          <div>
            <h3 className="text-base font-bold mb-2">Why scores are not recommendations</h3>
            <p className="text-muted">
              Backtested correlation r against forward 1-year returns = <strong>−0.12</strong>{" "}
              across 221 ticker-quarter pairs from Q4 2024 through Q1 2026. No predictive signal.
              The score reflects what institutional managers have <em>already done</em> — the
              best-known information about smart-money positioning, not where the market is going
              next. Treat it as a positioning tracker, not a stock-picking tool.
            </p>
          </div>
          <div>
            <h3 className="text-base font-bold mb-2">Why we publish it anyway</h3>
            <p className="text-muted">
              Most retail-facing 13F trackers either hide their math, sell rankings as
              predictions, or simplify away the structure that makes 13F data interesting
              (manager quality, time decay, concentration, dissent, freshness). HoldLens
              publishes the full math so it can be audited, cited, and refined. The score is
              honestly described, openly limited, and machine-readable at{" "}
              <Link href="/api/v1/scores.json" className="text-brand underline">
                /api/v1/scores.json
              </Link>
              .
            </p>
          </div>
          <div>
            <h3 className="text-base font-bold mb-2">What the columns mean</h3>
            <p className="text-muted">
              <strong>Score</strong>: the composite −100..+100 ConvictionScore (sign-based, no
              dead zone).{" "}
              <strong>Tier</strong>: one of seven descriptive labels (Heavy accumulation → Heavy
              selling) anchored to score bands at ±70 / ±40 / ±0.{" "}
              <strong>B / S</strong>: count of tracked managers who acted as net buyers vs. net
              sellers on this ticker across the last 9 quarters (time-decayed). Sets are not
              mutually exclusive — a manager who added then trimmed counts in both.{" "}
              <strong>Top buyer</strong>: the highest-weight buyer (manager-quality ×
              concentration × time-decay) — or top seller prefixed with ↘ if no buyers.{" "}
              <strong>Buyer-CAGR proxy</strong>: weighted-average 10-year CAGR of the buyer set,
              weighted by position size — descriptive of the historical track record of the
              managers holding this position, NOT a forward forecast for the stock itself.
            </p>
          </div>
          <div>
            <h3 className="text-base font-bold mb-2">The 45-day lag</h3>
            <p className="text-muted">
              Form 13F-HR is filed within 45 days of quarter-end. Holdings reflect the
              quarter-end snapshot, not current positions. {LATEST_LABEL} filings (covering
              positions as of {LATEST_QUARTER === "2026-Q1" ? "March 31, 2026" : "the quarter-end date"})
              were due {LATEST_FILED}. Managers may have already changed positions between
              the snapshot date and today; we update scores within 24 hours of new SEC
              publications. See <Link href="/learn/45-day-lag-explained" className="text-brand underline">
              the 45-day lag explained</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="mt-16 pt-10 border-t border-border">
        <h2 className="text-2xl font-bold mb-4">Related rankings + reference</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>
            →{" "}
            <Link href="/best-now" className="text-brand underline">
              Most-bought + most-sold this quarter
            </Link>{" "}
            (10+10 by aggregate flow)
          </li>
          <li>
            →{" "}
            <Link href="/big-bets" className="text-brand underline">
              Big bets (conviction × position size)
            </Link>{" "}
            (top 100)
          </li>
          <li>
            →{" "}
            <Link href="/conviction-leaders" className="text-brand underline">
              Conviction leaders — managers ranked by avg ConvictionScore of holdings
            </Link>
          </li>
          <li>
            →{" "}
            <Link href="/rotation" className="text-brand underline">
              Sector rotation heatmap (8 quarters × 12 sectors)
            </Link>
          </li>
          <li>
            →{" "}
            <Link
              href="/reports/2026-05-q1-2026-13f-signal-summary"
              className="text-brand underline"
            >
              Q1 2026 13F signal summary
            </Link>{" "}
            (editorial recap of the latest filings)
          </li>
          <li>
            →{" "}
            <Link href="/api/v1/snapshot/2026-Q1.json" className="text-brand underline">
              Q1 2026 snapshot (machine-readable, LLM-citation-ready)
            </Link>
          </li>
          <li>
            →{" "}
            <Link href="/learn/conviction-score-explained" className="text-brand underline">
              Full explanation: what is a ConvictionScore?
            </Link>
          </li>
        </ul>
      </section>

      <p className="text-xs text-dim pt-8 border-t border-border mt-12 leading-relaxed">
        Not investment advice. Sourced from public SEC EDGAR Form 13F-HR filings (45-day
        post-quarter-end deadline). ConvictionScore is a smart-money positioning tracker,
        not a stock recommender — backtest r = −0.12 against forward returns. Pure
        data-display, no buy/sell recommendations. See{" "}
        <Link href="/methodology" className="text-brand underline">methodology</Link>{" "}
        +{" "}
        <Link href="/disclaimer" className="text-brand underline">disclaimer</Link>.
      </p>
    </div>
  );
}

// ---------- Components ----------

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <div className="text-xs text-muted uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-bold text-text tabular-nums mt-1">{value}</div>
    </div>
  );
}

function TierLegend({ score, label, range }: { score: number; label: string; range: string }) {
  const { color } = convictionLabel(score);
  const colorClass =
    color === "emerald"
      ? "text-emerald-400"
      : color === "rose"
        ? "text-rose-400"
        : "text-muted";
  return (
    <div className="flex items-baseline gap-2">
      <span className={`font-bold tabular-nums ${colorClass}`}>{range}</span>
      <span className="text-muted">·</span>
      <span className="text-text">{label}</span>
    </div>
  );
}

const VISIBLE_PER_SECTION = 50;

function RankSection({
  id,
  title,
  subtitle,
  rows: allRows,
  rankStart,
}: {
  id: string;
  title: string;
  subtitle: string;
  rows: ReturnType<typeof getAllConvictionScores>;
  rankStart: number;
}) {
  const rows = allRows.slice(0, VISIBLE_PER_SECTION);
  const overflow = allRows.slice(VISIBLE_PER_SECTION);
  if (allRows.length === 0) {
    return (
      <section id={id} className="mt-12">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted text-sm mb-4">{subtitle}</p>
        <p className="text-dim text-sm italic">No tickers in this tier this quarter.</p>
      </section>
    );
  }

  return (
    <section id={id} className="mt-12">
      <h2 className="text-2xl font-bold mb-2">
        {title}{" "}
        <span className="text-muted text-base font-normal tabular-nums">
          ({allRows.length})
        </span>
      </h2>
      <p className="text-muted text-sm mb-5 max-w-3xl">{subtitle}</p>

      {/* Desktop table — md+ */}
      <div className="hidden md:block overflow-x-auto rounded-card border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-border">
              <th scope="col" className="py-3 px-3 text-xs uppercase tracking-wider text-muted font-semibold w-12">#</th>
              <th scope="col" className="py-3 px-3 text-xs uppercase tracking-wider text-muted font-semibold">Ticker</th>
              <th scope="col" className="py-3 px-3 text-xs uppercase tracking-wider text-muted font-semibold">Company</th>
              <th scope="col" className="py-3 px-3 text-xs uppercase tracking-wider text-muted font-semibold hidden lg:table-cell">Sector</th>
              <th scope="col" className="py-3 px-3 text-xs uppercase tracking-wider text-muted font-semibold text-right">Score</th>
              <th scope="col" className="py-3 px-3 text-xs uppercase tracking-wider text-muted font-semibold hidden xl:table-cell">Tier</th>
              <th scope="col" className="py-3 px-3 text-xs uppercase tracking-wider text-muted font-semibold text-right">B / S</th>
              <th scope="col" className="py-3 px-3 text-xs uppercase tracking-wider text-muted font-semibold hidden lg:table-cell">Top buyer</th>
              <th scope="col" className="py-3 px-3 text-xs uppercase tracking-wider text-muted font-semibold hidden xl:table-cell">{QUARTER_LABELS[LATEST_QUARTER]} latest move</th>
              <th scope="col" className="py-3 px-3 text-xs uppercase tracking-wider text-muted font-semibold text-right hidden xl:table-cell">Buyer-CAGR proxy</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const { label, color } = convictionLabel(r.score);
              const colorClass =
                color === "emerald"
                  ? "text-emerald-400"
                  : color === "rose"
                    ? "text-rose-400"
                    : "text-muted";
              const topBuyer = r.topBuyers[0];
              const topSeller = r.topSellers[0];
              const hasPage = hasTickerPage(r.ticker);
              const tickerCellText = (
                <span className={hasPage ? "text-brand hover:underline font-bold tabular-nums" : "text-text font-bold tabular-nums"}>
                  {r.ticker}
                </span>
              );
              const erText =
                r.expectedReturnPct != null
                  ? `${r.expectedReturnPct > 0 ? "+" : ""}${r.expectedReturnPct.toFixed(1)}%/yr proxy from buyer CAGRs`
                  : "no buyer data";
              return (
                <tr
                  key={r.ticker}
                  className="border-b border-border last:border-b-0 hover:bg-surface-muted transition-colors"
                >
                  <td className="py-2.5 px-3 text-muted tabular-nums text-xs">{rankStart + i}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-baseline gap-1.5">
                      {hasPage ? (
                        <Link href={`/ticker/${r.ticker}/`}>{tickerCellText}</Link>
                      ) : (
                        tickerCellText
                      )}
                      {r.ownerCount >= 10 && (
                        <span
                          className="text-[10px] text-amber-400 border border-amber-400/40 rounded px-1 tabular-nums leading-tight"
                          title={`Crowded — held by ${r.ownerCount} of ${MANAGERS.length} tracked managers. Crowding mechanically caps upside.`}
                        >
                          {r.ownerCount}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-text text-xs max-w-[200px] truncate">{r.name}</td>
                  <td className="py-2.5 px-3 text-muted text-xs hidden lg:table-cell">{r.sector || "—"}</td>
                  <td
                    className={`py-2.5 px-3 text-right font-bold tabular-nums ${colorClass}`}
                    title={erText}
                  >
                    {formatSignedScore(r.score)}
                  </td>
                  <td className={`py-2.5 px-3 text-xs hidden xl:table-cell ${colorClass}`}>{label}</td>
                  <td className="py-2.5 px-3 text-right text-muted tabular-nums text-xs">
                    <span className="text-emerald-400">{r.buyerCount}</span>
                    <span className="text-dim mx-1">/</span>
                    <span className="text-rose-400">{r.sellerCount}</span>
                  </td>
                  <td className="py-2.5 px-3 text-xs text-muted hidden lg:table-cell max-w-[140px] truncate">
                    {topBuyer ? topBuyer.name : topSeller ? `↘ ${topSeller.name}` : "—"}
                  </td>
                  <td className="py-2.5 px-3 text-xs hidden xl:table-cell max-w-[180px] truncate">
                    {(() => {
                      const lm = LATEST_MOVE_MAP.get(r.ticker);
                      if (!lm) return <span className="text-dim">no move</span>;
                      return (
                        <span>
                          <span className="text-muted">{lm.managerName.split(" ").slice(-1)[0]}</span>{" "}
                          <span className={actionColor(lm.action)}>{actionGlyph(lm.action)}</span>
                        </span>
                      );
                    })()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-xs tabular-nums hidden xl:table-cell">
                    {r.expectedReturnPct != null ? (
                      <span className={r.expectedReturnPct >= 0 ? "text-emerald-400" : "text-rose-400"}>
                        {r.expectedReturnPct > 0 ? "+" : ""}
                        {r.expectedReturnPct.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-dim">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards — below md */}
      <div className="md:hidden space-y-2">
        {rows.map((r, i) => {
          const { label, color } = convictionLabel(r.score);
          const colorClass =
            color === "emerald"
              ? "text-emerald-400"
              : color === "rose"
                ? "text-rose-400"
                : "text-muted";
          const topBuyer = r.topBuyers[0];
          const topSeller = r.topSellers[0];
          const hasPage = hasTickerPage(r.ticker);
          const tickerLink = hasPage ? (
            <Link href={`/ticker/${r.ticker}/`} className="text-brand font-bold tabular-nums">
              {r.ticker}
            </Link>
          ) : (
            <span className="text-text font-bold tabular-nums">{r.ticker}</span>
          );
          return (
            <div
              key={r.ticker}
              className="rounded-card border border-border bg-surface p-3"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-muted tabular-nums text-xs">#{rankStart + i}</span>
                  {tickerLink}
                  {r.ownerCount >= 10 && (
                    <span
                      className="text-[10px] text-amber-400 border border-amber-400/40 rounded px-1 tabular-nums leading-tight"
                      title={`Held by ${r.ownerCount} of ${MANAGERS.length} tracked managers`}
                    >
                      crowded {r.ownerCount}
                    </span>
                  )}
                </div>
                <div className={`text-lg font-bold tabular-nums ${colorClass}`}>
                  {formatSignedScore(r.score)}
                </div>
              </div>
              <div className="text-xs text-text mb-1 truncate">{r.name}</div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                <span className={colorClass}>{label}</span>
                <span className="text-dim">·</span>
                <span>
                  <span className="text-emerald-400">{r.buyerCount}B</span>
                  <span className="text-dim mx-1">/</span>
                  <span className="text-rose-400">{r.sellerCount}S</span>
                </span>
                {r.sector && (
                  <>
                    <span className="text-dim">·</span>
                    <span>{r.sector}</span>
                  </>
                )}
                {topBuyer && (
                  <>
                    <span className="text-dim">·</span>
                    <span>↗ {topBuyer.name}</span>
                  </>
                )}
                {!topBuyer && topSeller && (
                  <>
                    <span className="text-dim">·</span>
                    <span>↘ {topSeller.name}</span>
                  </>
                )}
                {r.expectedReturnPct != null && (
                  <>
                    <span className="text-dim">·</span>
                    <span className={r.expectedReturnPct >= 0 ? "text-emerald-400" : "text-rose-400"}>
                      {r.expectedReturnPct > 0 ? "+" : ""}
                      {r.expectedReturnPct.toFixed(1)}%/yr
                    </span>
                  </>
                )}
                {(() => {
                  const lm = LATEST_MOVE_MAP.get(r.ticker);
                  if (!lm) return null;
                  return (
                    <>
                      <span className="text-dim">·</span>
                      <span>
                        {QUARTER_LABELS[LATEST_QUARTER]}:{" "}
                        <span className="text-muted">{lm.managerName.split(" ").slice(-1)[0]}</span>{" "}
                        <span className={actionColor(lm.action)}>{actionGlyph(lm.action)}</span>
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>
          );
        })}
      </div>

      {overflow.length > 0 && (
        <div className="mt-3 text-xs text-muted leading-relaxed border-t border-border pt-3">
          <span className="text-dim uppercase tracking-wider">+ {overflow.length} more in this tier:</span>{" "}
          {overflow.map((r, i) => (
            <span key={r.ticker}>
              {hasTickerPage(r.ticker) ? (
                <Link href={`/ticker/${r.ticker}/`} className="text-brand hover:underline tabular-nums">
                  {r.ticker}
                </Link>
              ) : (
                <span className="text-text tabular-nums">{r.ticker}</span>
              )}
              <span className="text-dim ml-0.5">({formatSignedScore(r.score)})</span>
              {i < overflow.length - 1 ? <span className="text-dim">, </span> : null}
            </span>
          ))}
          {". "}
          <Link href="/api/v1/scores.json" className="text-brand underline whitespace-nowrap">
            Full data via /api/v1/scores.json →
          </Link>
        </div>
      )}
    </section>
  );
}
