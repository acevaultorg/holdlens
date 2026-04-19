import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Changelog — HoldLens",
  description:
    "What's new in HoldLens. Every version, every ship. Updated as we ship — not as we plan.",
  alternates: { canonical: "https://holdlens.com/changelog/" },
  openGraph: {
    title: "HoldLens Changelog",
    description: "What's new in HoldLens. Every ship, every version.",
    url: "https://holdlens.com/changelog/",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
};

type Release = {
  version: string;
  date: string;
  title: string;
  highlights: string[];
};

// Hand-curated from git log — static because this is a static export.
// Newest first. Update on each version bump.
const RELEASES: Release[] = [
  {
    version: "v0.26",
    date: "2026-04-11",
    title: "Copy parity",
    highlights: [
      "Rewrote /learn/conviction-score-explained to describe the shipped unified signed score (was telling users it was 'coming in v0.4')",
      "Repositioned /pricing — Pro is now email alerts + EDGAR + custom watchlists + API, not the unified score (which stays free)",
      "Homepage hero and feature card updated with the +100/−100 framing",
      "Meta descriptions, root layout, /press-kit launch posts all updated with the sharper 'Dataroma puts META on both lists simultaneously — HoldLens fixes that with one signed score' hook",
    ],
  },
  {
    version: "v0.25",
    date: "2026-04-10",
    title: "Unified signed score",
    highlights: [
      "One signed ConvictionScore per stock on a single −100..+100 scale. +100 = strongest buy, −100 = strongest sell",
      "A ticker now appears on exactly one list (buys or sells) — fixed the META bug where the same ticker showed up on both sides",
      "Symmetric classification thresholds + formatSignedScore helper",
      "Refactored getBuySignals / getSellSignals / getNetSignal / ratingLabel to all derive from the unified conviction score",
      "All ranking pages (/buys, /sells, /what-to-buy, /what-to-sell, /this-week, /signal, /best-now) display the signed score directly",
    ],
  },
  {
    version: "v0.24",
    date: "2026-04-10",
    title: "Changelog page",
    highlights: [
      "First public /changelog page (this one) — every release documented",
      "Article JSON-LD, footer link, sitemap entry",
    ],
  },
  {
    version: "v0.23",
    date: "2026-04-09",
    title: "Fair-model backtest",
    highlights: [
      "Extended recommender backtest to 8 quarters of data for a fair model test",
      "/proof page shows realized alpha over a longer horizon, not just a single quarter",
      "First fairly-tested quarter (Q4 2024) delivered +31.6% alpha",
    ],
  },
  {
    version: "v0.22",
    date: "2026-04-08",
    title: "Trust-builder",
    highlights: [
      "Recommender backtest proof page — /proof",
      "Shows the model's picks vs the market, quarter by quarter, with realized returns",
      "Honest — no curation, shows losers alongside winners",
    ],
  },
  {
    version: "v0.21",
    date: "2026-04-07",
    title: "ConvictionScore v3",
    highlights: [
      "ConvictionScore v3 — weights position age, recent adds, and portfolio concentration",
      "New /best-now page surfaces the highest-conviction ideas across every tracked manager",
      "Mobile nav fix, portfolio share card, /press-kit launch assets page",
    ],
  },
  {
    version: "v0.20",
    date: "2026-04-06",
    title: "Profiles + leaderboard",
    highlights: [
      "/profile page — minimal user profile in localStorage",
      "/portfolio page — add your own stocks, cross-referenced with the recommendation model",
      "Manager ROI leaderboard at /leaderboard — sortable, filterable, real 10y alpha",
      "ManagerROICard on every investor profile showing realized CAGR and alpha",
    ],
  },
  {
    version: "v0.19",
    date: "2026-04-05",
    title: "Monetization surfaces",
    highlights: [
      "AdSlot component with AdSense + Carbon Ads fallback (env-var driven)",
      "AffiliateCTA component for brokerage referrals on /signal pages",
      "StripeCheckoutButton on /pricing — payment-link integration, zero backend",
      "Manager quality scores now derived from realized 10y ROI, not curation",
    ],
  },
  {
    version: "v0.18",
    date: "2026-04-04",
    title: "Pricing + alerts + insiders",
    highlights: [
      "/pricing page — Free + Pro $14/mo, early-access waitlist",
      "/alerts page — buy/sell signal email signup with next filing deadline",
      "Insider activity (Form 4) curated for 21+ tickers, displayed on /ticker and /signal pages",
      "Screener filter save via localStorage",
      "CSV export on /screener and /this-week",
    ],
  },
  {
    version: "v0.17",
    date: "2026-04-03",
    title: "Earnings + this-week",
    highlights: [
      "Earnings calendar on ticker pages",
      "Trend badges on signal pages",
      "SEO aliases for common searches",
      "RSS feed + /this-week aggregated view",
    ],
  },
  {
    version: "v0.16",
    date: "2026-04-02",
    title: "30 managers + screener + compare",
    highlights: [
      "Scaled from 22 to 30 tracked managers",
      "Screener — filter by sector, conviction, net signal, day change",
      "Manager compare page (side-by-side holdings, 105 pairs)",
      "Social share cards for /signal pages",
    ],
  },
  {
    version: "v0.15",
    date: "2026-04-01",
    title: "Signal dossier",
    highlights: [
      "Per-ticker /signal dossier with news, multi-quarter trend, holdings, verdict badge",
      "CSV export on signal pages",
      "Expanded moves dataset to 4 quarters",
    ],
  },
  {
    version: "v0.14",
    date: "2026-03-31",
    title: "Buy/sell recommendation model",
    highlights: [
      "First proprietary buy/sell recommendation model",
      "22 Tier-1 managers tracked",
      "/buys /sells /activity /grand pages live",
    ],
  },
  {
    version: "v0.13",
    date: "2026-03-30",
    title: "Live data",
    highlights: [
      "Live Yahoo Finance quotes via Cloudflare Worker proxy",
      "Watchlist, cmd+K search, SEC filing badges",
      "Interactive 1M/3M/6M/1Y SVG charts",
    ],
  },
  {
    version: "v0.12",
    date: "2026-03-29",
    title: "4 more investors",
    highlights: [
      "Added Howard Marks, Prem Watsa, Bill Nygren, Glenn Greenberg",
      "Related-managers widget on every profile",
      "Social share buttons on all backtests",
    ],
  },
  {
    version: "v0.11",
    date: "2026-03-28",
    title: "FAQ + press kit",
    highlights: [
      "FAQ page with FAQPage schema",
      "Press kit page",
      "Expanded footer nav",
    ],
  },
  {
    version: "v0.10",
    date: "2026-03-27",
    title: "Klarman + Burry backtests",
    highlights: [
      "Seth Klarman and Michael Burry added",
      "5 total manager backtests live",
      "JSON-LD breadcrumbs on investor + ticker pages",
    ],
  },
  {
    version: "v0.9",
    date: "2026-03-26",
    title: "Learn pages + homepage v2",
    highlights: [
      "Quarterly recaps",
      "/learn/copy-trading-myth explains why blind copy-trading fails",
      "/learn/conviction-score-explained — the scoring primer",
      "Homepage v2 — backtest gallery",
    ],
  },
  {
    version: "v0.8",
    date: "2026-03-25",
    title: "Druckenmiller + simulate + learn",
    highlights: [
      "Druckenmiller backtest",
      "/simulate index page",
      "/learn index page",
    ],
  },
  {
    version: "v0.7",
    date: "2026-03-24",
    title: "Ackman + generic backtest",
    highlights: [
      "Bill Ackman backtest",
      "/learn/what-is-a-13f explainer",
      "Generic ManagerBacktest component — reusable across manager pages",
    ],
  },
  {
    version: "v0.6",
    date: "2026-03-23",
    title: "Sitemap + nav",
    highlights: [
      "Sitemap with 186 URLs — sectors, compare, top-picks",
      "Updated main nav",
    ],
  },
  {
    version: "v0.5",
    date: "2026-03-22",
    title: "Top picks + sector pages",
    highlights: [
      "/top-picks page",
      "11 sector pages",
      "Full SEO coverage",
    ],
  },
  {
    version: "v0.4",
    date: "2026-03-21",
    title: "Ticker comparison pages",
    highlights: [
      "105 ticker-vs-ticker comparison pages",
      "Social share cards (X + OpenGraph)",
      "RSS alternate link",
    ],
  },
  {
    version: "v0.3",
    date: "2026-03-20",
    title: "4 more managers + methodology",
    highlights: [
      "Added Michael Burry, Stanley Druckenmiller, Li Lu, Mohnish Pabrai",
      "Methodology page",
      "RSS feed",
      "13 new ticker pages",
    ],
  },
  {
    version: "v0.2",
    date: "2026-03-19",
    title: "5 managers + 40 tickers",
    highlights: [
      "5 manager pages",
      "40 ticker pages",
      "Index pages",
      "About page",
      "JSON-LD schema",
    ],
  },
  {
    version: "v0.1",
    date: "2026-03-18",
    title: "Launch",
    highlights: [
      "Landing page",
      "Buffett backtest",
      "Buffett profile",
      "Deployed to Cloudflare Pages",
    ],
  },
];

export default function ChangelogPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "HoldLens Changelog",
    datePublished: RELEASES[RELEASES.length - 1]?.date,
    dateModified: RELEASES[0]?.date,
    author: { "@type": "Organization", name: "HoldLens" },
    description: "What's new in HoldLens. Every version, every ship.",
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Changelog
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        What shipped, version by version.
      </h1>
      <p className="text-muted text-lg leading-relaxed mb-12">
        Every HoldLens release, newest first. Updated as we ship — not as we plan.{" "}
        <Link href="/feed.xml" className="text-brand hover:underline">
          Subscribe via RSS
        </Link>{" "}
        for release notifications.
      </p>

      <ol className="space-y-10 list-none p-0">
        {RELEASES.map((release) => (
          <li key={release.version} className="border-l-2 border-brand pl-6 relative">
            <div className="absolute -left-[7px] top-2 w-3 h-3 rounded-full bg-brand" />
            <div className="flex items-baseline gap-3 mb-2 flex-wrap">
              <h2 className="text-2xl font-bold text-text">{release.version}</h2>
              <span className="text-sm text-muted">·</span>
              <span className="text-sm text-muted font-mono">{release.date}</span>
            </div>
            <div className="text-lg font-semibold text-text mb-3">{release.title}</div>
            <ul className="space-y-2 list-disc list-outside ml-5 text-muted leading-relaxed">
              {release.highlights.map((highlight, i) => (
                <li key={i}>{highlight}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div className="mt-16 pt-8 border-t border-border text-sm text-muted">
        <p>
          Want to be first to know? Subscribe to the{" "}
          <Link href="/feed.xml" className="text-brand hover:underline">
            RSS feed
          </Link>{" "}
          or join the waitlist on the{" "}
          <Link href="/alerts/" className="text-brand hover:underline">
            alerts page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
