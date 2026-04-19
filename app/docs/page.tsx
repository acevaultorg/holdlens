import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Public JSON API — HoldLens",
  description:
    "Free public JSON API: ConvictionScore, buy/sell signals, 30 superinvestor holdings, 8-quarter sector rotation. No auth. CDN-cached. Dataroma has no API — HoldLens does.",
  alternates: { canonical: "https://holdlens.com/docs" },
  openGraph: {
    title: "HoldLens Public JSON API",
    description: "Free conviction scores, signals, and manager data. No auth. JSON.",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
};

const ENDPOINTS: { method: "GET"; path: string; desc: string; example: string }[] = [
  {
    method: "GET",
    path: "/api/v1/index.json",
    desc: "Catalog of every endpoint exposed by the API.",
    example: `{
  "name": "HoldLens Public JSON API",
  "version": "v1",
  "base_url": "https://holdlens.com/api/v1",
  "quarter": "2025-Q4",
  "endpoints": [ /* ... */ ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/scores.json",
    desc: "Every tracked ticker ranked by the unified signed −100..+100 ConvictionScore.",
    example: `{
  "data": [
    {
      "ticker": "NVDA",
      "name": "NVIDIA Corp",
      "sector": "Technology",
      "score": 68,
      "direction": "BUY",
      "label": "High conviction BUY",
      "buyer_count": 8,
      "seller_count": 1,
      "owner_count": 12
    }
  ],
  "meta": { "count": 94, "quarter": "2025-Q4" }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/scores/{ticker}.json",
    desc: "Full breakdown for a single ticker — every layer of the conviction model.",
    example: `{
  "data": {
    "ticker": "NVDA",
    "score": 68,
    "direction": "BUY",
    "breakdown": {
      "smartMoney": 22, "insiderBoost": 8, "trackRecord": 14,
      "trendStreak": 10, "concentration": 7, "contrarian": 0,
      "dissentPenalty": 3, "crowdingPenalty": 4
    }
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/signals/buys.json",
    desc: "Top 100 buy signals sorted by score descending.",
    example: `{ "data": [ { "ticker": "NVDA", "score": 68, "buyer_count": 8 } ] }`,
  },
  {
    method: "GET",
    path: "/api/v1/signals/sells.json",
    desc: "Top 100 sell signals sorted by score ascending.",
    example: `{ "data": [ { "ticker": "BABA", "score": -22, "seller_count": 3 } ] }`,
  },
  {
    method: "GET",
    path: "/api/v1/managers.json",
    desc: "All 30 tracked superinvestors with quality score and 10y CAGR.",
    example: `{
  "data": [
    {
      "slug": "warren-buffett",
      "name": "Warren Buffett",
      "fund": "Berkshire Hathaway",
      "quality_score": 10,
      "cagr_10y": 13.2,
      "top_holding": "AAPL",
      "top_holding_pct": 22.4
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/managers/{slug}.json",
    desc: "Manager detail: holdings, recent quarterly moves, bio, philosophy.",
    example: `{
  "data": {
    "slug": "warren-buffett",
    "name": "Warren Buffett",
    "cagr_10y": 13.2,
    "holdings": [ { "ticker": "AAPL", "pct": 22.4 } ],
    "recent_moves": [
      { "quarter": "2025-Q4", "ticker": "BAC", "action": "trim" }
    ]
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/big-bets.json",
    desc: "Top 100 conviction × position-size ranked bets across all managers.",
    example: `{
  "data": [
    {
      "rank": 1,
      "manager": "Bill Ackman",
      "fund": "Pershing Square Capital",
      "ticker": "CMG",
      "position_pct": 21.4,
      "conviction_score": 34,
      "combined_score": 727.6
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/rotation.json",
    desc: "12-sector × 8-quarter signed net-flow heatmap. Green = buying, red = selling.",
    example: `{
  "data": [
    {
      "sector": "Technology",
      "quarters": {
        "2025-Q4": { "net": 8.4, "buys": 12, "sells": 3 }
      }
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/sector/{slug}.json",
    desc: "Per-sector drilldown: tickers ranked by conviction, top managers overweight in the sector, 8Q flow. One-click from the rotation heatmap. Slugs: technology, financials, energy, healthcare, consumer-discretionary, consumer-staples, industrials, materials, real-estate, communication, utilities.",
    example: `{
  "data": {
    "sector": "Technology",
    "slug": "technology",
    "stats": { "ticker_count": 16, "avg_conviction": 7.9, "net_flow_4q": 75.3 },
    "tickers": [ { "ticker": "NVDA", "conviction_score": 19, "direction": "BUY" } ],
    "top_managers": [ { "name": "Michael Burry", "sector_pct": 62.4 } ]
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/alerts.json",
    desc: "Top 200 high-impact 13F moves where a single position change shifted more than 5% of a superinvestor's portfolio. The raw feed behind the /alerts page email digest.",
    example: `{
  "data": [
    {
      "ticker": "NVDA",
      "action": "new",
      "manager": "Michael Burry",
      "quarter": "2025-Q1",
      "portfolio_impact_pct": 49.0,
      "conviction_score": 19
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/consensus.json",
    desc: "Widely-held tickers (≥5 superinvestor owners) that ALSO have positive ConvictionScore AND net-buying flow in the last 2 quarters. Where smart money agrees.",
    example: `{
  "data": [
    {
      "rank": 1,
      "ticker": "META",
      "owner_count": 15,
      "conviction_score": 5,
      "recent_buyers": 6,
      "recent_sellers": 0,
      "score": 177.0
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/crowded.json",
    desc: "Top 30 tickers by ownership, each tagged loading / unwinding / stable based on last 2Q flow. Crowded + unwinding = the exit is about to get ugly.",
    example: `{
  "data": [
    {
      "rank": 1,
      "ticker": "META",
      "owner_count": 15,
      "conviction_score": 5,
      "net_direction": "loading"
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/contrarian.json",
    desc: "Tickers where ≥2 superinvestors are buying AND ≥2 others are selling in the same 4-quarter window. The disagreement signal Dataroma can't show. Returns per-ticker split of who's on each side.",
    example: `{
  "data": [
    {
      "rank": 1,
      "ticker": "META",
      "buyer_count": 16,
      "seller_count": 9,
      "buyers": [ { "slug": "bill-ackman", "name": "Bill Ackman" } ],
      "sellers": [ { "slug": "david-tepper", "name": "David Tepper" } ]
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/best-now.json",
    desc: "Top 50 buy candidates — what the smartest investors are buying right now.",
    example: `{ "data": [ { "ticker": "NVDA", "score": 68, "direction": "BUY" } ] }`,
  },
  {
    method: "GET",
    path: "/api/v1/value.json",
    desc: "Top 50 smart-money buys for value overlay with your own 52w-range feed.",
    example: `{ "data": [ { "ticker": "BABA", "score": 42 } ] }`,
  },
  {
    method: "GET",
    path: "/api/v1/quarters.json",
    desc: "List of available 13F quarters with labels.",
    example: `{ "data": [ { "quarter": "2025-Q4", "label": "Q4 2025" } ] }`,
  },
];

export default function DocsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12">
        <div className="inline-block text-[10px] font-bold uppercase tracking-widest text-black bg-brand rounded-full px-3 py-1 mb-4">
          Shipped · Free · No auth
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
          Public JSON API
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          Every ranked list, every ConvictionScore, every tracked manager — as
          static JSON under <code className="text-brand bg-panel px-1.5 py-0.5 rounded text-base">holdlens.com/api/v1/</code>.
          No API key. No rate limit beyond CDN edge caching. Attribution appreciated, not required.
        </p>
        <p className="text-dim text-sm max-w-2xl mt-3">
          Dataroma has no API at all — HoldLens has {ENDPOINTS.length} free endpoints powering everything
          on the site.
        </p>
      </div>

      {/* Quick start */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Quick start</h2>
        <div className="rounded-2xl border border-border bg-panel p-6">
          <p className="text-muted text-sm mb-4">
            Every endpoint is a static JSON file. Call it from anything — curl, Python, a React component, a Google Sheet:
          </p>
          <pre className="bg-bg rounded-xl p-4 text-sm overflow-x-auto">
            <code className="text-text">
{`curl https://holdlens.com/api/v1/big-bets.json | jq '.data[0]'

# or in Python
import requests
r = requests.get("https://holdlens.com/api/v1/scores/NVDA.json")
print(r.json()["data"]["score"])`}
            </code>
          </pre>
          <p className="text-xs text-dim mt-3">
            Responses are a thin envelope: <code className="text-brand bg-bg px-1 rounded">{"{ data, meta }"}</code>.
            All prices derived from SEC 13F filings. Last refreshed every quarter within 45 days of period end.
          </p>
        </div>
      </section>

      {/* Endpoints */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Endpoints ({ENDPOINTS.length})</h2>
        <div className="space-y-6">
          {ENDPOINTS.map((ep) => (
            <div
              key={ep.path}
              className="rounded-2xl border border-border bg-panel overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-border flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded px-2 py-0.5">
                  {ep.method}
                </span>
                <code className="text-sm font-mono text-brand break-all">{ep.path}</code>
              </div>
              <div className="px-6 py-3 border-b border-border">
                <p className="text-sm text-muted">{ep.desc}</p>
              </div>
              <div className="px-6 py-4">
                <div className="text-[10px] uppercase tracking-widest text-dim font-semibold mb-2">
                  Example response
                </div>
                <pre className="bg-bg rounded-xl p-4 text-xs overflow-x-auto">
                  <code className="text-text">{ep.example}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </section>

      <AdSlot format="in-article" className="mb-12" />

      {/* v1.44 — embed widget docs. Pairs with the /embed/[ticker]/ route
          (static export, 94 tickers). Referenced from FAQ "Can I embed
          HoldLens widgets on my blog?" so the claim ships with working
          copy-paste snippets. */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Embed a ConvictionScore badge</h2>
        <p className="text-sm text-muted mb-5 max-w-2xl leading-relaxed">
          Drop the signed −100..+100 ConvictionScore for any tracked ticker
          onto your blog, newsletter, or Notion page. Static, no JS load,
          no API key, no rate limit. Shares the same glyph set as the live
          site so it looks native on any dark background.
        </p>
        <div className="rounded-2xl border border-border bg-panel p-6 space-y-5">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-brand font-semibold mb-2">
              Basic iframe (recommended)
            </div>
            <pre className="text-xs bg-bg rounded-lg p-3 overflow-x-auto border border-border text-muted">
              <code>{`<iframe
  src="https://holdlens.com/embed/NVDA/"
  width="200"
  height="280"
  loading="lazy"
  style="border: 0; border-radius: 14px;"
  title="NVDA ConvictionScore — HoldLens"
></iframe>`}</code>
            </pre>
            <p className="text-xs text-dim mt-2">
              Swap <span className="font-mono text-text">NVDA</span> for any tracked ticker.
              Recommended size: 200×280 px. Responsive-safe.
            </p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-brand font-semibold mb-2">
              Tracked tickers
            </div>
            <p className="text-xs text-muted leading-relaxed">
              94 supported tickers today (every entry on the{" "}
              <a href="/ticker" className="underline hover:text-text">ticker index</a>). Pass the
              symbol as ALL-CAPS — <span className="font-mono text-text">/embed/AAPL/</span>,
              not <span className="font-mono text-dim">/embed/aapl/</span>. Unknown symbols 404.
            </p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-brand font-semibold mb-2">
              Attribution
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Every badge includes a <span className="font-mono text-text">holdlens.com ↗</span>{" "}
              link at the bottom. Please don&rsquo;t strip it — it&rsquo;s how we keep the widget
              free forever.
            </p>
          </div>
        </div>
      </section>

      {/* Data freshness */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Data freshness + licensing</h2>
        <div className="rounded-2xl border border-border bg-panel p-6 space-y-3 text-sm text-muted">
          <p>
            <span className="text-text font-semibold">Source:</span> SEC 13F filings (every tracked manager).
            Quarterly refresh cadence — typically within 45 days of quarter end.
          </p>
          <p>
            <span className="text-text font-semibold">License:</span> Free for personal and commercial use.
            Attribution appreciated but not required. Do not redistribute as your own API.
          </p>
          <p>
            <span className="text-text font-semibold">Caching:</span> All JSON is statically exported and served
            from Cloudflare&rsquo;s edge — effectively unlimited throughput for normal usage.
          </p>
          <p className="text-xs text-dim pt-2 border-t border-border">
            Not investment advice. Backtest yourself. See <a href="/methodology" className="underline text-brand">methodology</a>.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-brand bg-brand/5 p-8 md:p-10 text-center">
        <h2 className="text-2xl font-bold mb-3">Want the data on HoldLens.com too?</h2>
        <p className="text-muted text-sm max-w-lg mx-auto mb-6">
          Every endpoint above powers a page on the site. Start with the {" "}
          <a href="/big-bets" className="text-brand hover:underline">Big Bets</a> screen or the {" "}
          <a href="/rotation" className="text-brand hover:underline">Sector Rotation</a> heatmap.
        </p>
        <div className="flex flex-wrap gap-3 justify-center text-xs">
          <a href="/best-now" className="px-3 py-2 rounded-lg border border-border bg-panel hover:border-brand/40 text-brand font-semibold">/best-now</a>
          <a href="/big-bets" className="px-3 py-2 rounded-lg border border-border bg-panel hover:border-brand/40 text-brand font-semibold">/big-bets</a>
          <a href="/value" className="px-3 py-2 rounded-lg border border-border bg-panel hover:border-brand/40 text-emerald-400 font-semibold">/value</a>
          <a href="/rotation" className="px-3 py-2 rounded-lg border border-border bg-panel hover:border-brand/40 text-brand font-semibold">/rotation</a>
          <a href="/compare/managers" className="px-3 py-2 rounded-lg border border-border bg-panel hover:border-brand/40 text-text font-semibold">/compare/managers</a>
        </div>
      </section>
    </div>
  );
}
