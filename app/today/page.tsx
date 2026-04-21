import type { Metadata } from "next";
import Link from "next/link";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export const metadata: Metadata = {
  title: "Today — live daily movers across the 30 superinvestors",
  description:
    "Which superinvestor's portfolio moved most today. Daily price-driven deltas on top of quarterly 13F positions. Refreshed every trading day after US market close.",
  alternates: { canonical: "https://holdlens.com/today/" },
  openGraph: {
    title: "HoldLens Today — superinvestor portfolio daily movers",
    description:
      "Quarterly positions × daily prices. See which hedge funds gained + lost most today.",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens" }],
  },
  robots: { index: true, follow: true },
};

type DailyData = {
  meta: { generated_at: string; trading_date: string; universe: { priced: number } };
  summary: {
    worst_performer_today: InvestorDelta | null;
    best_performer_today: InvestorDelta | null;
    median_investor_day_pct: number;
    investors_measured: number;
  };
  investors: InvestorDelta[];
};

type InvestorDelta = {
  slug: string;
  name: string;
  fund: string;
  weightedDayPct: number;
  biggestLoser: { ticker: string; dayChangePct: number } | null;
  biggestWinner: { ticker: string; dayChangePct: number } | null;
  holdingsChanged: number;
};

type MoversData = {
  meta: { generated_at: string; trading_date: string };
  top_gainers: Array<{ ticker: string; price: number; dayChangePct: number }>;
  top_losers: Array<{ ticker: string; price: number; dayChangePct: number }>;
};

function loadSnapshot(): { daily: DailyData | null; movers: MoversData | null } {
  const base = join(process.cwd(), "public", "api", "v1");
  const dailyPath = join(base, "daily.json");
  const moversPath = join(base, "movers.json");
  const daily = existsSync(dailyPath)
    ? (JSON.parse(readFileSync(dailyPath, "utf8")) as DailyData)
    : null;
  const movers = existsSync(moversPath)
    ? (JSON.parse(readFileSync(moversPath, "utf8")) as MoversData)
    : null;
  return { daily, movers };
}

function pct(n: number): string {
  return `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;
}

function colorFor(n: number): string {
  if (n > 0.5) return "text-green-400";
  if (n < -0.5) return "text-red-400";
  return "text-[#8892a0]";
}

export default function TodayPage() {
  const { daily, movers } = loadSnapshot();

  if (!daily) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-3">Today</h1>
        <p className="text-[#8892a0]">
          Daily snapshot not yet generated. Check back after US market close.
        </p>
      </main>
    );
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Today", item: "https://holdlens.com/today" },
    ],
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Superinvestor portfolio moves — ${daily.meta.trading_date}`,
    description: `Which of the 30 tracked superinvestors' portfolios moved most on ${daily.meta.trading_date}.`,
    datePublished: daily.meta.generated_at,
    dateModified: daily.meta.generated_at,
    author: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com/" },
    publisher: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com/" },
    mainEntityOfPage: "https://holdlens.com/today/",
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      <nav className="text-sm text-[#8892a0] mb-4">
        <Link href="/" className="hover:text-[#facc15]">HoldLens</Link>
        <span className="mx-2">›</span>
        <span>Today</span>
      </nav>

      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-[#facc15] font-semibold mb-2">
          Daily · {daily.meta.trading_date}
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3">
          Which portfolios moved today
        </h1>
        <p className="text-lg text-[#8892a0] max-w-3xl">
          Positions are quarterly (from Q4 2025 13F filings). Prices are live. Here&apos;s how
          each tracked superinvestor&apos;s portfolio performed today.
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {daily.summary.best_performer_today && (
          <div className="bg-[#151c27] border border-[#1e2530] rounded-lg p-5">
            <div className="text-xs uppercase text-[#8892a0] mb-2">Best today</div>
            <div className="text-xl font-bold mb-1">{daily.summary.best_performer_today.name}</div>
            <div className={`text-2xl font-bold ${colorFor(daily.summary.best_performer_today.weightedDayPct)}`}>
              {pct(daily.summary.best_performer_today.weightedDayPct)}
            </div>
            <div className="text-sm text-[#8892a0] mt-2">
              {daily.summary.best_performer_today.fund}
            </div>
          </div>
        )}
        {daily.summary.worst_performer_today && (
          <div className="bg-[#151c27] border border-[#1e2530] rounded-lg p-5">
            <div className="text-xs uppercase text-[#8892a0] mb-2">Worst today</div>
            <div className="text-xl font-bold mb-1">{daily.summary.worst_performer_today.name}</div>
            <div className={`text-2xl font-bold ${colorFor(daily.summary.worst_performer_today.weightedDayPct)}`}>
              {pct(daily.summary.worst_performer_today.weightedDayPct)}
            </div>
            <div className="text-sm text-[#8892a0] mt-2">
              {daily.summary.worst_performer_today.fund}
            </div>
          </div>
        )}
        <div className="bg-[#151c27] border border-[#1e2530] rounded-lg p-5">
          <div className="text-xs uppercase text-[#8892a0] mb-2">Median move</div>
          <div className={`text-2xl font-bold ${colorFor(daily.summary.median_investor_day_pct)}`}>
            {pct(daily.summary.median_investor_day_pct)}
          </div>
          <div className="text-sm text-[#8892a0] mt-2">
            Across {daily.summary.investors_measured} measured portfolios
          </div>
        </div>
      </div>

      {/* All investors ranked */}
      <h2 className="text-xl font-bold mb-4">All tracked portfolios, ranked today</h2>
      <div className="bg-[#151c27] border border-[#1e2530] rounded-lg overflow-x-auto mb-12">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0f141c] border-b border-[#1e2530]">
              <th className="text-left px-4 py-3 font-medium text-[#8892a0]">Investor</th>
              <th className="text-right px-4 py-3 font-medium text-[#8892a0]">Day %</th>
              <th className="text-left px-4 py-3 font-medium text-[#8892a0]">Biggest loser</th>
              <th className="text-left px-4 py-3 font-medium text-[#8892a0]">Biggest winner</th>
            </tr>
          </thead>
          <tbody>
            {daily.investors
              .slice()
              .sort((a, b) => a.weightedDayPct - b.weightedDayPct)
              .map((inv) => (
                <tr key={inv.slug} className="border-b border-[#1e2530] last:border-b-0 hover:bg-[#0f141c]">
                  <td className="px-4 py-3">
                    <Link href={`/investor/${inv.slug}/`} className="hover:text-[#facc15]">
                      <div className="font-semibold">{inv.name}</div>
                      <div className="text-xs text-[#8892a0]">{inv.fund}</div>
                    </Link>
                  </td>
                  <td className={`px-4 py-3 text-right font-bold ${colorFor(inv.weightedDayPct)}`}>
                    {pct(inv.weightedDayPct)}
                  </td>
                  <td className={`px-4 py-3 ${colorFor(inv.biggestLoser?.dayChangePct ?? 0)}`}>
                    {inv.biggestLoser ? (
                      <span>
                        {inv.biggestLoser.ticker} {pct(inv.biggestLoser.dayChangePct)}
                      </span>
                    ) : "—"}
                  </td>
                  <td className={`px-4 py-3 ${colorFor(inv.biggestWinner?.dayChangePct ?? 0)}`}>
                    {inv.biggestWinner ? (
                      <span>
                        {inv.biggestWinner.ticker} {pct(inv.biggestWinner.dayChangePct)}
                      </span>
                    ) : "—"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Movers */}
      {movers && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div>
            <h2 className="text-xl font-bold mb-4">Top gainers in tracked tickers</h2>
            <div className="bg-[#151c27] border border-[#1e2530] rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {movers.top_gainers.slice(0, 10).map((m) => (
                    <tr key={m.ticker} className="border-b border-[#1e2530] last:border-b-0">
                      <td className="px-4 py-2.5 font-mono font-semibold">
                        <Link href={`/ticker/${m.ticker}/`} className="hover:text-[#facc15]">
                          {m.ticker}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-right text-[#8892a0]">${m.price.toFixed(2)}</td>
                      <td className={`px-4 py-2.5 text-right font-bold ${colorFor(m.dayChangePct)}`}>
                        {pct(m.dayChangePct)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Top losers in tracked tickers</h2>
            <div className="bg-[#151c27] border border-[#1e2530] rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {movers.top_losers.slice(0, 10).map((m) => (
                    <tr key={m.ticker} className="border-b border-[#1e2530] last:border-b-0">
                      <td className="px-4 py-2.5 font-mono font-semibold">
                        <Link href={`/ticker/${m.ticker}/`} className="hover:text-[#facc15]">
                          {m.ticker}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-right text-[#8892a0]">${m.price.toFixed(2)}</td>
                      <td className={`px-4 py-2.5 text-right font-bold ${colorFor(m.dayChangePct)}`}>
                        {pct(m.dayChangePct)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Honesty + freshness footer */}
      <div className="bg-[#0f141c] border border-[#1e2530] rounded-lg p-5 text-sm text-[#8892a0]">
        <p className="mb-2">
          <strong className="text-white">Data honesty:</strong> Superinvestor positions are from
          Q4 2025 13F filings (SEC EDGAR). They do NOT change daily — only prices do. This page
          shows portfolio-weighted day changes based on today&apos;s EOD prices applied to the
          most recent filed positions.
        </p>
        <p>
          <strong className="text-white">Refreshed:</strong>{" "}
          {new Date(daily.meta.generated_at).toISOString().replace("T", " ").slice(0, 16)} UTC ·{" "}
          <strong className="text-white">Universe:</strong> {daily.meta.universe.priced} tickers
          priced today · <strong className="text-white">Source:</strong> Yahoo Finance v8.{" "}
          <Link href="/api/v1/daily.json" className="text-[#facc15] hover:underline">JSON</Link>{" "}
          <Link href="/api-terms" className="text-[#facc15] hover:underline">(API terms)</Link>
        </p>
      </div>
    </main>
  );
}
