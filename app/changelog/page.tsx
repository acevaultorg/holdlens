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
  },
};

type Release = {
  version: string;
  date: string;
  title: string;
  highlights: string[];
};

// Hand-curated from git log — static because this is a static export.
// Update on each version bump. Keep newest first.
const RELEASES: Release[] = [
  {
    version: "v0.23",
    date: "2026-04-09",
    title: "Fair-model backtest",
    highlights: [
      "Extended recommender backtest to 8 quarters of data for a fair model test",
      "Proof page shows realized alpha over a longer horizon, not just a single quarter",
    ],
  },
  {
    version: "v0.22",
    date: "2026-04-08",
    title: "Trust-builder",
    highlights: [
      "Recommender backtest proof page — /proof",
      "Shows the model's picks vs the market, quarter by quarter",
    ],
  },
  {
    version: "v0.21",
    date: "2026-04-07",
    title: "Conviction Score v3",
    highlights: [
      "ConvictionScore v3 — weights position age, recent adds, and portfolio concentration",
      "New /best-now page surfaces the highest-conviction ideas across every tracked manager",
      "Mobile nav fix, social share card, press kit page",
    ],
  },
  {
    version: "v0.20",
    date: "2026-04-06",
    title: "Profiles + leaderboard",
    highlights: [
      "Manager profile pages with full portfolio history",
      "Investor ROI leaderboard — sortable, filterable",
      "Portfolio detail view on each profile",
    ],
  },
  {
    version: "v0.19",
    date: "2026-04-05",
    title: "Revenue surfaces + Net Signal v2",
    highlights: [
      "Revenue surface: homepage CTA to /pricing and /alerts",
      "Net Signal v2 — better scoring of quarter-over-quarter moves",
      "Manager ROI metric shown inline on every manager card",
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
      "Earnings dates on ticker pages",
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
      "Scaled from 10 to 30 tracked managers",
      "Screener — filter by sector, conviction, net signal",
      "Manager compare page (side-by-side holdings)",
      "Social share image generation for /signal pages",
    ],
  },
  {
    version: "v0.15",
    date: "2026-04-01",
    title: "Signal dossier",
    highlights: [
      "Signal dossier per ticker — news, multi-quarter trend, holding heatmap",
      "CSV export on signal pages",
    ],
  },
  {
    version: "v0.14",
    date: "2026-03-31",
    title: "Buy/sell recommendation model",
    highlights: [
      "Proprietary buy/sell recommendation model",
      "Beats Dataroma's naive copy-trade baseline in backtest",
    ],
  },
  {
    version: "v0.13",
    date: "2026-03-30",
    title: "Live data",
    highlights: [
      "Live Yahoo Finance quotes via Cloudflare Worker proxy",
      "Watchlist, search, SEC filing badges",
    ],
  },
  {
    version: "v0.12",
    date: "2026-03-29",
    title: "4 more investors",
    highlights: [
      "Added Howard Marks, Prem Watsa, Bill Nygren, Glenn Greenberg",
      "Related managers widget on every profile",
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
      "Seth Klarman backtest",
      "Michael Burry backtest — 5 total",
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
      "/learn/conviction-score-explained explains the scoring methodology",
      "Homepage v2 — backtest gallery",
    ],
  },
  {
    version: "v0.8",
    date: "2026-03-25",
    title: "Druckenmiller + /simulate + /learn",
    highlights: [
      "Druckenmiller backtest",
      "/simulate index page",
      "/learn index page",
    ],
  },
  {
    version: "v0.7",
    date: "2026-03-24",
    title: "Ackman + generic backtest component",
    highlights: [
      "Bill Ackman backtest",
      "/learn/what-is-a-13f explainer page",
      "Generic ManagerBacktest component — reusable across all manager pages",
    ],
  },
  {
    version: "v0.6",
    date: "2026-03-23",
    title: "186-URL sitemap",
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
    title: "105 ticker comparison pages",
    highlights: [
      "105 ticker-vs-ticker comparison pages",
      "Twitter cards",
      "RSS alternate link",
    ],
  },
  {
    version: "v0.3",
    date: "2026-03-20",
    title: "4 more managers + methodology",
    highlights: [
      "Added Michael Burry, Stanley Druckenmiller, Li Lu, Mohnish Pabrai",
      "Methodology page — how the data pipeline works",
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
    description:
      "What's new in HoldLens. Every version, every ship.",
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
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        What shipped, version by version.
      </h1>
      <p className="text-muted text-lg leading-relaxed mb-12">
        Every HoldLens release, newest first. Updated as we ship.{" "}
        <Link href="/feed.xml" className="text-brand hover:underline">
          Subscribe via RSS
        </Link>{" "}
        for release notifications.
      </p>

      <ol className="space-y-10 list-none p-0">
        {RELEASES.map((release) => (
          <li
            key={release.version}
            className="border-l-2 border-brand pl-6 relative"
          >
            <div className="absolute -left-[7px] top-2 w-3 h-3 rounded-full bg-brand" />
            <div className="flex items-baseline gap-3 mb-2 flex-wrap">
              <h2 className="text-2xl font-bold text-text">
                {release.version}
              </h2>
              <span className="text-sm text-muted">·</span>
              <span className="text-sm text-muted font-mono">
                {release.date}
              </span>
            </div>
            <div className="text-lg font-semibold text-text mb-3">
              {release.title}
            </div>
            <ul className="space-y-2 list-disc list-outside ml-5 text-muted leading-relaxed">
              {release.highlights.map((highlight, i) => (
                <li key={i}>{highlight}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div className="mt-16 pt-8 border-t border-subtle text-sm text-muted">
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
