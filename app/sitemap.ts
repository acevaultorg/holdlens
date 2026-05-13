import type { MetadataRoute } from "next";
import { MANAGERS } from "@/lib/managers";
import { TICKER_INDEX, topTickers } from "@/lib/tickers";
import { QUARTERS } from "@/lib/moves";
import { COUNTRIES as TAX_COUNTRIES, getTreatyCell as getTaxTreatyCell } from "@/lib/dividend-tax";
import { STYLES as MANAGER_STYLES, styleCounts as managerStyleCounts } from "@/lib/manager-styles";
import { topReplicatingETFs as etfTopReplicating } from "@/lib/etf-overlap";
import { computeInsiderSummaries } from "@/lib/insider-conviction";
import { allInsiderTickers, allOfficerEntries } from "@/lib/insiders";
import { BUYBACK_PROGRAMS } from "@/lib/buybacks";
import { ACTIVIST_CAMPAIGNS } from "@/lib/activists";
import { SHORT_POSITIONS } from "@/lib/short-interest";
import { CONGRESS_MEMBERS } from "@/lib/congress";
import { ETFS } from "@/lib/etfs";
import { REPORTS } from "@/lib/reports";
import { getAllOverlapPairs } from "@/lib/fund-overlap-pairs";

const SECTORS = [
  "Technology", "Financials", "Energy", "Healthcare",
  "Consumer Discretionary", "Consumer Staples", "Industrials",
  "Materials", "Real Estate", "Communication", "Utilities",
];

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://holdlens.com";
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    // High-priority conversion surfaces — the unified score rankings
    { url: `${base}/best-now`, lastModified: now, changeFrequency: "daily", priority: 0.98 },
    { url: `${base}/buys`, lastModified: now, changeFrequency: "daily", priority: 0.97 },
    { url: `${base}/sells`, lastModified: now, changeFrequency: "daily", priority: 0.97 },
    { url: `${base}/this-week`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${base}/what-to-buy`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/what-to-sell`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/top-picks`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    // Insiders hub — v0.2 promoted from weekly → daily because the live
    // feed + company + officer pages all refresh daily from Form 4 EDGAR.
    { url: `${base}/insiders`, lastModified: now, changeFrequency: "daily", priority: 0.88 },
    { url: `${base}/insiders/live`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
    // SEC-data product hubs — the 6-concept stack (13F + Form 4 + 8-K +
    // 13D/G + DEF 14A + Ch 11). All canonical for their filing-type
    // keyword cluster + EDGAR-sourced. Pre-fix: only /insiders/ was in
    // sitemap; /proxies, /events, /activist, /bankruptcy, /def-14a were
    // discoverable only via internal links — silent indexing leak. Each
    // is now a first-class sitemap entry with daily/weekly cadence.
    { url: `${base}/events`, lastModified: now, changeFrequency: "daily", priority: 0.88 },
    { url: `${base}/events/live`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: `${base}/activist`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/proxies`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/bankruptcy`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: `${base}/def-14a`, lastModified: now, changeFrequency: "monthly", priority: 0.82 },
    // Signal-explorer hubs — homepage SignalCard grid surfaces these as
    // "Twenty-five ways to read smart money." Each hub is a unique-data
    // page with structured data + internal hub-spoke links to the SEC
    // filing trackers. Should match nav prominence in sitemap.
    { url: `${base}/themes`, lastModified: now, changeFrequency: "weekly", priority: 0.82 },
    { url: `${base}/overlap`, lastModified: now, changeFrequency: "weekly", priority: 0.82 },
    { url: `${base}/by-philosophy`, lastModified: now, changeFrequency: "weekly", priority: 0.82 },
    { url: `${base}/big-bets`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/new-positions`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/changelog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    // Already-live routes that were never in the sitemap
    { url: `${base}/activity`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    // Learn hub — evergreen SEO content, high long-term value
    { url: `${base}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/learn/superinvestor-handbook`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/learn/what-is-a-13f`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/learn/how-to-read-a-13f`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/learn/what-is-alpha`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/learn/45-day-lag-explained`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/learn/warren-buffett-method`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/learn/copy-trading-myth`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/learn/conviction-score-explained`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/learn/survivorship-bias-in-hedge-funds`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/learn/13f-vs-13d-vs-13g`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/learn/do-hedge-fund-signals-work`, lastModified: now, changeFrequency: "monthly", priority: 0.92 },
    { url: `${base}/support`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/grand`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/screener`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/leaderboard`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/proof`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/compare/managers`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/portfolio`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/watchlist`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/profile`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/alerts`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    // v1.00 — /premium was shipped in v0.90 as the Pro feature marketing
    // surface but never registered in the sitemap, so Google had no path to
    // it. Revenue-adjacent page missing from crawl = silent acquisition leak.
    { url: `${base}/premium`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    // /compare landing — v0.87 new route, previously missing from sitemap
    { url: `${base}/compare`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/docs`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/press-kit`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    // Backtests
    { url: `${base}/simulate`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/simulate/buffett`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/simulate/ackman`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/simulate/druckenmiller`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/simulate/klarman`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/simulate/burry`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    // Learn
    { url: `${base}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/learn/what-is-a-13f`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/learn/copy-trading-myth`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/learn/conviction-score-explained`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/quarterly`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/quarterly/2026-q1`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/quarterly/2025-q4`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/investor`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/ticker`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    // Support
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/standard`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    // v1.54 — commercial routing for AI/LLM/fintech bot traffic
    { url: `${base}/api-terms`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/for-ai`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    // v1.57 — AI/PPC discovery surfaces. /api landing exposes Pay-Per-Crawl
    // pricing tiers + Enterprise API options. High priority because AI
    // products + procurement teams discover monetization here.
    { url: `${base}/api`, lastModified: now, changeFrequency: "monthly", priority: 0.92 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/press`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    // Reports hub + per-report long-form editorial. Previously missing from
    // sitemap — silent discovery leak for every shipped report. Per-report
    // lastModified = its publishedAt so indexers prefer the shipped freshness.
    { url: `${base}/reports`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    // Legal + contact (required for AdSense + GDPR compliance)
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    // Pivot A YMYL compliance (2026-05-09) — /partners is the canonical
    // home for brokerage affiliate links, moved off result pages to
    // satisfy Google Publisher Policies → Misrepresentation. Substantive
    // editorial content + affiliate disclosure on a single dedicated
    // page; the rest of the site links here with a small text link.
    { url: `${base}/partners`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const sectorUrls: MetadataRoute.Sitemap = SECTORS.map((s) => ({
    url: `${base}/sector/${s.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Per-report URLs: lastModified = publishedAt so fresh reports get priority
  // re-crawl; priority 0.8 because reports are high-editorial-signal surfaces
  // that attract LLM citation at higher rates than generic programmatic pages.
  const reportUrls: MetadataRoute.Sitemap = REPORTS.map((r) => ({
    url: `${base}/reports/${r.slug}`,
    lastModified: new Date(r.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const topN = topTickers(15).map((t) => t.symbol);
  const compareUrls: MetadataRoute.Sitemap = [];
  // Both orderings — matches the route generator that ships pages both ways so
  // Google indexes each direction.
  for (const a of topN) {
    for (const b of topN) {
      if (a !== b) {
        compareUrls.push({
          url: `${base}/compare/${a.toLowerCase()}-vs-${b.toLowerCase()}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  }

  const managerUrls: MetadataRoute.Sitemap = MANAGERS.map((m) => ({
    url: `${base}/investor/${m.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const tickerUrls: MetadataRoute.Sitemap = Object.keys(TICKER_INDEX).map((sym) => ({
    url: `${base}/ticker/${sym}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // /signal/[ticker] — per-ticker smart-money signal pages.
  const signalUrls: MetadataRoute.Sitemap = Object.keys(TICKER_INDEX).map((sym) => ({
    url: `${base}/signal/${sym}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // /investor/[slug]/q/[quarter] — 29 dynamic managers × 8 quarters = 232 pages.
  // Warren Buffett is excluded (hand-crafted /investor/warren-buffett page).
  const investorQuarterUrls: MetadataRoute.Sitemap = [];
  for (const m of MANAGERS) {
    if (m.slug === "warren-buffett") continue;
    for (const q of QUARTERS) {
      investorQuarterUrls.push({
        url: `${base}/investor/${m.slug}/q/${q.toLowerCase()}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.75,
      });
    }
  }

  // /quarter/[slug] — per-quarter full digests.
  const quarterUrls: MetadataRoute.Sitemap = QUARTERS.map((q) => ({
    url: `${base}/quarter/${q.toLowerCase()}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // v1.15 — /ticker/[sym]/feed.xml — per-ticker RSS feeds. Not typically
  // indexed by Google (RSS is for feed readers) but including them helps
  // Google discover the semantic relationship to the ticker page + lets us
  // track feed-click attribution in Plausible if traffic lands directly.
  const tickerFeedUrls: MetadataRoute.Sitemap = Object.keys(TICKER_INDEX).map((sym) => ({
    url: `${base}/ticker/${sym}/feed.xml`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  // v1.45 — /dividend-tax/* cross-border withholding calculator +
  // per-investor-country programmatic pages. 1 hub + 20 country pages
  // = 21 new URLs. Retention + distribution play: LLM-citable +
  // bookmarkable + cross-links back to /ticker/* + /investor/*.
  //
  // v1.59 — pair pages /dividend-tax/[investor]/[payer]/ added for
  // every verified+derived treaty cell. Currently 75 pairs (operator's
  // research cadence is filling 75 → 400). The set grows automatically
  // on every build as cells are promoted from needs_research → verified.
  // Each pair page stacks 6 high-multiplier archetypes (programmatic
  // unique data + comparison + AI-citation + schema + hub-spoke +
  // finite-public-dataset) per Layer 5 stacking-bonus rules.
  const verifiedPairs: { inv: string; pay: string }[] = [];
  for (const inv of TAX_COUNTRIES) {
    for (const pay of TAX_COUNTRIES) {
      const cell = getTaxTreatyCell(inv.code, pay.code);
      if (cell && (cell.state === "verified" || cell.state === "derived")) {
        verifiedPairs.push({ inv: inv.code.toLowerCase(), pay: pay.code.toLowerCase() });
      }
    }
  }
  const dividendTaxUrls: MetadataRoute.Sitemap = [
    {
      url: `${base}/dividend-tax`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    ...TAX_COUNTRIES.map((c) => ({
      url: `${base}/dividend-tax/${c.code.toLowerCase()}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...verifiedPairs.map((p) => ({
      url: `${base}/dividend-tax/${p.inv}/${p.pay}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // Ship #8 v1 — /similar-to/[investor]/ per-investor portfolio
  // similarity ranking pages. 30 new URLs (one per manager) + the
  // /similar-to/ index page (added v1.91 — was 404'ing in nav).
  const similarToUrls: MetadataRoute.Sitemap = [
    {
      url: `${base}/similar-to`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...MANAGERS.map((m) => ({
      url: `${base}/similar-to/${m.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
  ];

  // /managers-by-style/ — taxonomy hub + per-style cluster pages. 1 hub +
  // N styles where N is non-empty styles only (currently 7). Compounds
  // internal-linking to /investor/* and provides an LLM-citable cluster
  // surface ("which managers are activist investors?" → direct hit).
  const managersByStyleUrls: MetadataRoute.Sitemap = [
    {
      url: `${base}/managers-by-style`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...managerStyleCounts().map(({ style }) => ({
      url: `${base}/managers-by-style/${style.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];

  // /etf-by-superinvestor/ — per-manager portfolio-overlap pages.
  // Hub + 30 manager pages. Each answers a recurring search query
  // ("which ETF replicates [manager]'s portfolio") with quote-ready
  // overlap-score data — high LLM-citation fit.
  // Reference etfTopReplicating to keep the import live (computation
  // happens at page render time per manager; sitemap just emits URLs).
  void etfTopReplicating;
  const etfBySuperinvestorUrls: MetadataRoute.Sitemap = [
    {
      url: `${base}/etf-by-superinvestor`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...MANAGERS.map((m) => ({
      url: `${base}/etf-by-superinvestor/${m.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.65,
    })),
  ];

  // /embed/ — landing page listing every embeddable widget. Per-investor
  // and per-ticker embed routes are noindex (they're iframe targets, not
  // SERP candidates), so only the hub goes in sitemap.
  const embedHubUrl: MetadataRoute.Sitemap = [
    {
      url: `${base}/embed`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  // Ship #9 v1 — /sectors/ unified hub (per-sector deep dives live at
  // /sector/[slug] already, which are registered in sectorUrls above).
  const sectorsHubUrl: MetadataRoute.Sitemap = [
    {
      url: `${base}/sectors`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
  ];

  // 2026-05-08 AdSense low-value-content remediation:
  // /insiders/[insider]/* pages = 4,436 template-driven pages = 80% of
  // sitemap. AdSense reviewer flagged "Low value content" with these as
  // the dominant signal. Pages stay live + accessible to users via
  // company/officer hubs (same data, richer context). Removing from
  // sitemap + page-level noindex (see app/insiders/[insider]/page.tsx)
  // prevents Googlebot from re-indexing the long tail.
  // Per rules/adsense-thin-content-prevention.md (added v2026-05-08).
  // 2026-05-08 AdSense low-value-content remediation (round 2):
  // Initial fix removed /insiders/[insider]/* (4,436 thin pages). Deep audit
  // found /insiders/company/[ticker]/* (673 pages, ~239 main words) and
  // /insiders/officer/[slug]/* (1,889 pages, ~102 main words) are ALSO
  // below the 400-word substance floor (per rules/adsense-thin-content-prevention
  // .md Gate 2). Same template-driven thin-content pattern as /insiders/[insider]/
  // — would trigger same AdSense rejection.
  // Remediation: noindex + sitemap-remove all 3 surfaces. Pages remain live
  // for users via internal navigation; only Googlebot indexing is suppressed.
  // /investor/[slug]/* (1,150 main words) + /signal/[ticker]/* (1,339 main words)
  // are substantive — STAY indexed.
  const insidersUrls: MetadataRoute.Sitemap = [];

  // /insiders/company/[ticker]/ — REMOVED from sitemap (still live; noindexed
  // at page level; ~239 main words = thin per AdSense thin-content gate).
  const insidersCompanyUrls: MetadataRoute.Sitemap = [];
  // Original: const insidersCompanyUrls = allInsiderTickers().map(...)

  // /insiders/officer/[slug]/ — REMOVED from sitemap (still live; noindexed
  // at page level; ~102 main words = thin).
  const insidersOfficerUrls: MetadataRoute.Sitemap = [];
  // Original: const insidersOfficerUrls = allOfficerEntries().map((e) => ({
  //   url: `${base}/insiders/officer/${e.slug}`,
  //   lastModified: now,
  //   changeFrequency: "weekly" as const,
  //   priority: 0.7,
  // }));

  // v1.53 — Corporate Buyback Tracker sub-vertical (/buybacks/*).
  // 4 static landing/leaderboard surfaces + 10 per-company pages + 2 learn.
  const buybackStaticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/buybacks`, lastModified: now, changeFrequency: "weekly", priority: 0.88 },
    { url: `${base}/buybacks/yield`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/buybacks/largest-authorizations`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/learn/buybacks-vs-dividends`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/learn/how-to-read-buyback-disclosures`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
  ];
  const buybackTickerUrls: MetadataRoute.Sitemap = BUYBACK_PROGRAMS.map((p) => ({
    url: `${base}/buybacks/${p.ticker}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // v1.54 — Activist 13D/13G tracker (/activist/*).
  const activistStaticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/activist`, lastModified: now, changeFrequency: "weekly", priority: 0.88 },
    { url: `${base}/learn/13d-vs-13g-activist-filings`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
  ];
  const activistDetailUrls: MetadataRoute.Sitemap = ACTIVIST_CAMPAIGNS.map((c) => ({
    url: `${base}/activist/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // v1.55 — Short Interest tracker (/short-interest/*).
  const shortStaticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/short-interest`, lastModified: now, changeFrequency: "weekly", priority: 0.88 },
    { url: `${base}/learn/short-interest-explained`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
  ];
  const shortTickerUrls: MetadataRoute.Sitemap = SHORT_POSITIONS.map((p) => ({
    url: `${base}/short-interest/${p.ticker}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // v1.56 — Congressional stock trades tracker (/congress/*).
  const congressStaticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/congress`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/learn/congressional-stock-trading-stock-act`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
  ];
  const congressMemberUrls: MetadataRoute.Sitemap = CONGRESS_MEMBERS.map((m) => ({
    url: `${base}/congress/${m.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // v1.58 — ETF Holdings Tracker (/etf/*). Daily-disclosed top holdings
  // for 12 major US ETFs. Cross-links into every /ticker/ page that any
  // tracked ETF holds.
  const etfStaticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/etf`, lastModified: now, changeFrequency: "weekly", priority: 0.88 },
    { url: `${base}/learn/etf-overlap-explained`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
  ];
  const etfTickerUrls: MetadataRoute.Sitemap = ETFS.map((e) => ({
    url: `${base}/etf/${e.ticker}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.82,
  }));

  return [
    ...staticUrls,
    ...sectorUrls,
    ...reportUrls,
    ...compareUrls,
    ...managerUrls,
    ...tickerUrls,
    ...signalUrls,
    ...investorQuarterUrls,
    ...quarterUrls,
    ...tickerFeedUrls,
    ...dividendTaxUrls,
    ...similarToUrls,
    ...managersByStyleUrls,
    ...etfBySuperinvestorUrls,
    ...embedHubUrl,
    ...sectorsHubUrl,
    ...insidersUrls,
    ...insidersCompanyUrls,
    ...insidersOfficerUrls,
    ...buybackStaticUrls,
    ...buybackTickerUrls,
    ...activistStaticUrls,
    ...activistDetailUrls,
    ...shortStaticUrls,
    ...shortTickerUrls,
    ...congressStaticUrls,
    ...congressMemberUrls,
    ...etfStaticUrls,
    ...etfTickerUrls,
    // /fund-overlap/ hub + 435 pairwise overlap pages — substance-floor
    // filtered to pairs with ≥2 shared positions (per CSIL #30 thin-content
    // gate). Each page has unique 13F intersection data.
    { url: `${base}/fund-overlap/`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.82 },
    ...getAllOverlapPairs()
      .filter((p) => p.overlapCount >= 2)
      .map((p) => ({
        url: `${base}/fund-overlap/${p.slug}/`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
  ];
}
