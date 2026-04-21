import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Terms — HoldLens free tier + commercial license",
  description:
    "The HoldLens public JSON API is free with attribution. Commercial licensing for AI retrieval, LLM training, fintech redistribution, and enterprise use is available on request.",
  alternates: { canonical: "https://holdlens.com/api-terms" },
  openGraph: {
    title: "HoldLens API Terms",
    description:
      "Free attribution-based access · commercial license available for AI, LLM training, fintech, and enterprise redistribution.",
    url: "https://holdlens.com/api-terms",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens API" }],
  },
  robots: { index: true, follow: true },
};

export default function ApiTermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        API Terms · Data License
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
        Free with attribution. Commercial license available.
      </h1>
      <p className="text-muted text-lg mb-12">
        HoldLens publishes a free public JSON API at <code className="text-text bg-panel px-1.5 py-0.5 rounded text-base">/api/v1/</code>{" "}
        for researchers, journalists, hobbyists, and AI agents that cite their sources.
        For production redistribution, LLM training, paid-product integration, or enterprise
        SLAs, a commercial license applies. Both tiers below.
      </p>

      {/* ─── Tier 1 — Free ───────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-panel p-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-dim font-semibold mb-1">
              Tier 1
            </div>
            <h2 className="text-2xl font-bold">Free public API</h2>
          </div>
          <div className="text-3xl font-bold tabular-nums">€0</div>
        </div>
        <p className="text-muted mb-5">
          Hit any <code className="text-text bg-bg px-1.5 py-0.5 rounded text-sm">/api/v1/*.json</code>{" "}
          endpoint. No key required. 20+ endpoints covering every tracked manager, ticker,
          signal, sector rotation, consensus pick, and quarterly digest.
        </p>
        <h3 className="text-sm font-bold text-text mb-2 mt-6">What you can do (free)</h3>
        <ul className="space-y-2 text-muted text-sm mb-5">
          <li>• Personal research, dashboards, newsletters (with attribution)</li>
          <li>• Academic studies + reproducible research</li>
          <li>• Open-source projects that cite HoldLens as data source</li>
          <li>• LLM / chatbot answers that link to <code className="text-text">holdlens.com</code> in their citation</li>
          <li>• Journalism + editorial coverage (credit HoldLens inline)</li>
        </ul>
        <h3 className="text-sm font-bold text-text mb-2 mt-6">Pay-Per-Crawl tiers (for AI bots via Cloudflare)</h3>
        <p className="text-muted text-sm mb-3">
          When Cloudflare Pay-Per-Crawl is enabled for HoldLens, AI crawler requests are
          billed per-route by our Cloudflare zone. Route tiers + suggested per-crawl pricing:
        </p>
        <ul className="space-y-1.5 text-muted text-sm mb-5">
          <li>
            • <code className="text-text">free-core</code> — $0.001/crawl — stable static endpoints
            (managers, rotation, scores). Caches well, lowest refresh cost.
          </li>
          <li>
            • <code className="text-text">paid-training</code> — $0.005/crawl — API catalog +
            manifest (<code className="text-text">/api/v1/index.json</code>). Discovery tier.
          </li>
          <li>
            • <code className="text-text">paid-premium</code> — $0.005/crawl — derived analytics
            (<code className="text-text">consensus.json, crowded.json, contrarian.json,
            best-now.json, alerts.json</code>). Pre-computed signals worth more than the raw data.
          </li>
          <li>
            • <code className="text-text">paid-daily</code> — $0.010/crawl — daily EOD snapshots
            (<code className="text-text">/today/, /api/v1/daily.json, /api/v1/movers.json</code>).
            Refreshed every US trading day 22:00 UTC with honest <code className="text-text">dateModified</code>.
            Premium price reflects fresh-data value to AI answer engines citing today&apos;s moves.
          </li>
        </ul>
        <h3 className="text-sm font-bold text-text mb-2 mt-6">Conditions</h3>
        <ul className="space-y-2 text-muted text-sm mb-5">
          <li>
            • <strong className="text-text">Attribution required.</strong> Cite{" "}
            <code className="text-text bg-bg px-1.5 py-0.5 rounded text-sm">holdlens.com</code> and
            link to the specific endpoint or page.
          </li>
          <li>
            • <strong className="text-text">Rate limit.</strong> Up to 150 requests/day per IP.
            Enforced at the Cloudflare edge; excessive automated crawling may trigger
            Pay-Per-Crawl pricing (HTTP 402).
          </li>
          <li>
            • <strong className="text-text">No bulk redistribution.</strong> You may cache + render
            individual results in your UI. You may NOT mirror the entire dataset as your own
            product without a commercial license.
          </li>
          <li>
            • <strong className="text-text">No training without a license.</strong> LLM retrieval
            ("ground my answer in HoldLens data") is fine with attribution. Training a model
            on bulk HoldLens outputs as a corpus requires a commercial license (below).
          </li>
          <li>
            • <strong className="text-text">No investment advice.</strong> Data is historical, 13F
            filings have a 45-day lag. Don't use for high-frequency trading decisions.
          </li>
        </ul>
      </section>

      {/* ─── Tier 2 — Pro ────────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-panel p-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-dim font-semibold mb-1">
              Tier 2
            </div>
            <h2 className="text-2xl font-bold">Pro API</h2>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold tabular-nums">€9</div>
            <div className="text-xs text-dim">/ month</div>
          </div>
        </div>
        <p className="text-muted mb-5">
          For individual quants, devs building personal tools, and newsletter operators. Same
          JSON surface, higher limits, private key, priority support.
        </p>
        <ul className="space-y-2 text-muted text-sm mb-6">
          <li>• 10,000 requests/day (67× free tier)</li>
          <li>• Private API key for your dashboards / scripts</li>
          <li>• Email webhooks on major filing waves</li>
          <li>• Scheduled CSV exports of any table</li>
          <li>• Priority email support (&lt;1 business day)</li>
        </ul>
        <a
          href="/pricing"
          className="inline-block bg-brand text-bg font-semibold rounded-xl px-5 py-3 hover:opacity-90 transition"
        >
          See Pro pricing →
        </a>
      </section>

      {/* ─── Tier 3 — Commercial / Enterprise ────────────── */}
      <section className="rounded-2xl border-2 border-brand bg-brand/5 p-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-1">
              Tier 3
            </div>
            <h2 className="text-2xl font-bold">Commercial / Enterprise</h2>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted font-semibold">Custom</div>
            <div className="text-xs text-dim">from €499 / mo</div>
          </div>
        </div>
        <p className="text-muted mb-5">
          For AI platforms, LLM training pipelines, fintech SaaS, investor-data aggregators,
          broker tools, research desks, and any team redistributing HoldLens data inside a
          paid product.
        </p>
        <h3 className="text-sm font-bold text-text mb-2 mt-6">Typical use cases</h3>
        <ul className="space-y-2 text-muted text-sm mb-5">
          <li>• <strong className="text-text">LLM retrieval + grounding:</strong> your chatbot cites HoldLens with SLA + bulk quota</li>
          <li>• <strong className="text-text">LLM training corpus:</strong> bulk historical 13F JSON for fine-tuning + evaluation</li>
          <li>• <strong className="text-text">Fintech integration:</strong> conviction scores embedded in your broker app, portfolio tool, or research product</li>
          <li>• <strong className="text-text">Data redistribution:</strong> mirror the full signal surface under your brand with a white-label license</li>
          <li>• <strong className="text-text">Webhook push feed:</strong> receive filings the moment they're processed, not on cache refresh</li>
          <li>• <strong className="text-text">Multi-tenant SaaS:</strong> your users access HoldLens via your UI</li>
        </ul>
        <h3 className="text-sm font-bold text-text mb-2 mt-6">What's included</h3>
        <ul className="space-y-2 text-muted text-sm mb-6">
          <li>• Unlimited API requests (no rate limit)</li>
          <li>• Bulk historical exports (every quarter back to Q1 2020, JSON + Parquet)</li>
          <li>• Webhook push on every processed filing</li>
          <li>• Uptime SLA (99.9% with credits on breach)</li>
          <li>• Direct Slack / email support channel</li>
          <li>• Custom endpoints on request (e.g. your specific manager set)</li>
          <li>• Data-license contract for redistribution + indemnification terms</li>
        </ul>
        <a
          href="/for-ai"
          className="inline-block bg-brand text-bg font-semibold rounded-xl px-5 py-3 hover:opacity-90 transition mr-3"
        >
          For AI / LLM integrations →
        </a>
        <a
          href="mailto:contact@holdlens.com?subject=HoldLens%20Commercial%20API%20License"
          className="inline-block bg-bg border border-border text-text font-semibold rounded-xl px-5 py-3 hover:border-brand transition"
        >
          Email contact@holdlens.com
        </a>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────── */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">FAQ</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-text mb-1">
              Is my LLM allowed to cite HoldLens in answers?
            </h3>
            <p className="text-muted text-sm">
              Yes — please do. Retrieval-augmented answers that ground in HoldLens data and
              link back with a visible <code className="text-text bg-panel px-1 rounded">holdlens.com/...</code> source
              are explicitly in the free tier. Attribution is the only ask.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-text mb-1">
              Can I train a model on HoldLens data?
            </h3>
            <p className="text-muted text-sm">
              Retrieval + grounding + citation: yes, free. Ingesting bulk HoldLens JSON into a
              training corpus for a commercial model: commercial license required. Email
              contact@holdlens.com with your use case — usually straightforward and affordable.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-text mb-1">
              What happens if I exceed 150 requests/day without a commercial license?
            </h3>
            <p className="text-muted text-sm">
              Cloudflare returns HTTP 429 or HTTP 402 (Pay-Per-Crawl) depending on the source.
              Legitimate research bursts are fine — the limit is daily, so short spikes are
              absorbed. Sustained breach is a signal you need the Pro tier (€9/mo) or a
              commercial license.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-text mb-1">
              Do you offer academic / non-profit licensing?
            </h3>
            <p className="text-muted text-sm">
              Yes. Reach out with your institution, the study, and expected scale. Non-profit
              research typically lands at free-tier access with looser rate limits.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-text mb-1">
              Is the underlying 13F data proprietary?
            </h3>
            <p className="text-muted text-sm">
              No — 13F filings are public SEC filings. What HoldLens licenses is the{" "}
              <strong className="text-text">normalized, de-duped, recency-weighted,
              manager-quality-scored composite</strong> — the ConvictionScore v4, the
              per-manager quality tags, the signal rankings, and the synthesized sector
              rotation heatmap. The value is in the synthesis, not the raw EDGAR bytes.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-text mb-1">
              How is rate-limiting enforced?
            </h3>
            <p className="text-muted text-sm">
              At the Cloudflare edge on IP + user-agent. Well-behaved bots that declare
              themselves (GPTBot, ClaudeBot, PerplexityBot, etc.) get cooperative treatment.
              Undeclared aggressive crawlers may hit Pay-Per-Crawl pricing.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────── */}
      <div className="mt-16 pt-8 border-t border-border text-sm text-dim">
        <p className="mb-2">
          <strong className="text-text">Last updated:</strong> 2026-04-20 · Version 1.0
        </p>
        <p className="mb-2">
          Contact for licensing: <a className="text-brand hover:underline" href="mailto:contact@holdlens.com">contact@holdlens.com</a>
        </p>
        <p>
          Related: <a className="text-brand hover:underline" href="/for-ai">For AI / LLM integrations</a> ·{" "}
          <a className="text-brand hover:underline" href="/api/v1/index.json">API index</a> ·{" "}
          <a className="text-brand hover:underline" href="/llms.txt">llms.txt</a> ·{" "}
          <a className="text-brand hover:underline" href="/methodology">Methodology</a> ·{" "}
          <a className="text-brand hover:underline" href="/pricing">Consumer pricing</a>
        </p>
      </div>
    </div>
  );
}
