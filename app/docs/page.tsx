import type { Metadata } from "next";
import EmailCapture from "@/components/EmailCapture";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "API Documentation — HoldLens Pro",
  description:
    "HoldLens API: conviction scores, signals, manager holdings, and live quotes. 1,000 calls/month with Pro. Launching Q2 2026.",
  openGraph: {
    title: "HoldLens API Docs",
    description: "REST API for conviction scores, signals, and manager data.",
  },
};

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/v1/scores",
    desc: "All conviction scores, ranked by strength",
    example: `{
  "data": [
    {
      "ticker": "NVDA",
      "score": 68,
      "direction": "BUY",
      "label": "BUY",
      "buyerCount": 8,
      "sellerCount": 1,
      "ownerCount": 12
    }
  ],
  "meta": { "count": 94, "quarter": "2025-Q4" }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/scores/:ticker",
    desc: "Single ticker conviction score with full breakdown",
    example: `{
  "ticker": "NVDA",
  "score": 68,
  "direction": "BUY",
  "breakdown": {
    "smartMoney": 22,
    "insiderBoost": 8,
    "trackRecord": 14,
    "trendStreak": 10,
    "concentration": 7,
    "contrarian": 0,
    "dissentPenalty": 3,
    "crowdingPenalty": 4
  },
  "topBuyers": [
    { "name": "Stanley Druckenmiller", "cagr": 18.2, "positionPct": 8.4 }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/signals/buys",
    desc: "Top buy signals, sorted by score descending",
    example: `{
  "data": [
    { "ticker": "NVDA", "score": 68, "buyerCount": 8 },
    { "ticker": "GOOGL", "score": 52, "buyerCount": 6 }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/signals/sells",
    desc: "Top sell signals, sorted by score ascending",
    example: `{
  "data": [
    { "ticker": "DIS", "score": -34, "sellerCount": 4 },
    { "ticker": "BABA", "score": -22, "sellerCount": 3 }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/managers",
    desc: "All tracked portfolio managers with holdings summary",
    example: `{
  "data": [
    {
      "slug": "warren-buffett",
      "name": "Warren Buffett",
      "fund": "Berkshire Hathaway",
      "topHolding": "AAPL",
      "holdingCount": 12
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/managers/:slug",
    desc: "Manager detail: holdings, moves, performance",
    example: `{
  "slug": "warren-buffett",
  "name": "Warren Buffett",
  "fund": "Berkshire Hathaway",
  "cagr10y": 13.2,
  "holdings": [
    { "ticker": "AAPL", "pct": 43.2 },
    { "ticker": "BAC", "pct": 10.1 }
  ]
}`,
  },
];

export default function DocsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12">
        <div className="inline-block text-[10px] font-bold uppercase tracking-widest text-black bg-brand rounded-full px-3 py-1 mb-4">
          Pro · Launching Q2 2026
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          API Documentation
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          RESTful JSON API for conviction scores, buy/sell signals, manager
          holdings, and live quotes. 1,000 calls/month included with Pro.
          Rate-limited, API-key authenticated.
        </p>
      </div>

      {/* Auth section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Authentication</h2>
        <div className="rounded-2xl border border-border bg-panel p-6">
          <p className="text-muted text-sm mb-4">
            Include your API key in the <code className="text-brand bg-bg px-1.5 py-0.5 rounded text-xs">Authorization</code> header:
          </p>
          <pre className="bg-bg rounded-xl p-4 text-sm overflow-x-auto">
            <code className="text-text">
{`curl -H "Authorization: Bearer hl_pro_YOUR_KEY" \\
  https://api.holdlens.com/v1/scores`}
            </code>
          </pre>
          <p className="text-xs text-dim mt-3">
            API keys are generated in your Pro dashboard after subscribing.
          </p>
        </div>
      </section>

      {/* Endpoints */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Endpoints</h2>
        <div className="space-y-6">
          {ENDPOINTS.map((ep) => (
            <div
              key={ep.path}
              className="rounded-2xl border border-border bg-panel overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-border flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded px-2 py-0.5">
                  {ep.method}
                </span>
                <code className="text-sm font-mono text-brand">{ep.path}</code>
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

      {/* Rate limits */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Rate limits</h2>
        <div className="rounded-2xl border border-border bg-panel p-6">
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-dim text-xs uppercase tracking-wider font-semibold mb-1">
                Pro tier
              </div>
              <div className="text-2xl font-bold text-brand tabular-nums">1,000</div>
              <div className="text-muted">calls/month</div>
            </div>
            <div>
              <div className="text-dim text-xs uppercase tracking-wider font-semibold mb-1">
                Burst limit
              </div>
              <div className="text-2xl font-bold tabular-nums">10</div>
              <div className="text-muted">calls/second</div>
            </div>
            <div>
              <div className="text-dim text-xs uppercase tracking-wider font-semibold mb-1">
                Response format
              </div>
              <div className="text-2xl font-bold">JSON</div>
              <div className="text-muted">UTF-8, gzip</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-brand bg-brand/5 p-8 md:p-10 text-center">
        <h2 className="text-2xl font-bold mb-3">Get early API access</h2>
        <p className="text-muted text-sm max-w-lg mx-auto mb-6">
          Sign up now to be first in line when the API launches. Pro subscribers
          get immediate access on launch day.
        </p>
        <div className="max-w-md mx-auto">
          <EmailCapture size="lg" />
        </div>
        <div className="mt-4 flex justify-center gap-6 text-xs text-dim">
          <a href="/pricing" className="text-brand hover:underline">
            View Pro pricing →
          </a>
        </div>
      </section>
    </div>
  );
}
