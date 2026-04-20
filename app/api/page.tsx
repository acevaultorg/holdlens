import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "HoldLens API — Pay-Per-Crawl + Enterprise tier for AI products",
  description:
    "Free for humans, Pay-Per-Crawl for AI bots ($0.002-0.05/req via Cloudflare), Enterprise API tier ($500-10,000/month) for AI equity-research products + financial-news + hedge-fund-AI tooling.",
  alternates: { canonical: "https://holdlens.com/api" },
  openGraph: {
    title: "HoldLens API — institutional-finance data for AI",
    description:
      "Pay-Per-Crawl + Enterprise API for AI products needing structured smart-money + filings data.",
    url: "https://holdlens.com/api",
    type: "article",
  },
  robots: { index: true, follow: true },
};

export default function ApiLandingPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "API", item: "https://holdlens.com/api" },
    ],
  };
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "HoldLens API — Pay-Per-Crawl + Enterprise tier",
    datePublished: "2026-04-20",
    dateModified: "2026-04-20",
    author: { "@type": "Organization", name: "HoldLens" },
    publisher: {
      "@type": "Organization",
      name: "HoldLens",
      url: "https://holdlens.com",
    },
    mainEntityOfPage: "https://holdlens.com/api",
    description:
      "Three-tier access model for AI products consuming HoldLens institutional-finance data.",
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        API · For AI products
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Institutional-finance data, built for AI consumption.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-12">
        HoldLens aggregates SEC 13F, Form 4, 13D/G, FINRA short interest, STOCK Act
        Congressional trades, and more — all SEC-grade public data, structured for
        machine consumption with extractable JSON-LD on every page. Three access
        tiers depending on your product&rsquo;s scale.
      </p>

      <aside
        className="mt-2 mb-12 rounded-card border border-insight/30 bg-surface-insight p-5"
        aria-label="HoldLens read on AI access"
      >
        <div className="text-[10px] uppercase tracking-widest text-insight font-bold mb-2">
          For AI product builders
        </div>
        <p className="text-sm text-text leading-relaxed">
          If you&rsquo;re building an equity-research AI (Rogo / AlphaSense alternative),
          a financial-news bot, hedge-fund-tracking tool, or a foundation-model
          training pipeline — HoldLens is the cleanest free-tier access to consolidated
          smart-money + corporate-filings data. Start with Pay-Per-Crawl (zero contract,
          pay-as-you-go); upgrade to Enterprise above ~10k requests/month for material
          per-request savings + SLA + webhooks.
        </p>
      </aside>

      {/* Tier 1 — PPC */}
      <section className="mb-14">
        <div className="text-[11px] uppercase tracking-widest text-brand font-bold mb-2">
          Tier 1 — Pay-Per-Crawl (live)
        </div>
        <h2 className="text-2xl font-bold mb-3">Cloudflare Pay-Per-Crawl</h2>
        <p className="text-muted text-sm mb-6">
          Standard Cloudflare PPC integration. AI bots that respect the contract get
          full content; rate-limited per route tier. No contract, no commitment, no
          login — just configure your crawler with the standard{" "}
          <code className="text-brand text-xs">Crawler-Id</code> +{" "}
          <code className="text-brand text-xs">Sec-Crawler-Identity</code> headers and
          start fetching.
        </p>

        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">Route pattern</th>
                <th className="px-4 py-3 text-left">Tier</th>
                <th className="px-4 py-3 text-right">Per-request</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-3 text-muted text-xs font-mono">
                  /, /about/, /methodology/, /learn/*, /api/, /pricing/
                </td>
                <td className="px-4 py-3 text-emerald-400 text-xs font-semibold">
                  Free (LLM discovery)
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold">
                  $0.000
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 text-muted text-xs font-mono">
                  /best-now, /buys, /sells, /value, /sector/*, /quarterly/*, /leaderboard
                </td>
                <td className="px-4 py-3 text-text text-xs">Standard</td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold">
                  $0.002
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 text-muted text-xs font-mono">
                  /ticker/[X], /signal/[X], /investor/[X], /insiders/[X], /buybacks/[X],
                  /short-interest/[X], /activist/[X], /congress/[X], /dividend-tax/[X]
                </td>
                <td className="px-4 py-3 text-brand text-xs font-semibold">
                  Per-entity detail
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold text-brand">
                  $0.005
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 text-muted text-xs font-mono">
                  /activity, /this-week, /biggest-buys, /biggest-sells, /new-positions,
                  /exits, /first-movers, /reversals
                </td>
                <td className="px-4 py-3 text-amber-400 text-xs">
                  Time-sensitive feeds
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold text-amber-400">
                  $0.010
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-muted text-xs font-mono">
                  /api/v1/* (when live)
                </td>
                <td className="px-4 py-3 text-emerald-400 text-xs font-semibold">
                  Enterprise endpoints
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold text-emerald-400">
                  $0.050
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-dim mt-4">
          Per-route tier authoritative source: <a href="/llms.txt" className="text-brand hover:underline">/llms.txt</a>.
          Pricing reviewed quarterly; subscribed crawlers receive 30-day notice of
          changes via the Cloudflare PPC dashboard.
        </p>
      </section>

      {/* Tier 2 — Enterprise */}
      <section className="mb-14">
        <div className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold mb-2">
          Tier 2 — Enterprise API (Year-2)
        </div>
        <h2 className="text-2xl font-bold mb-3">api.holdlens.com</h2>
        <p className="text-muted text-sm mb-6">
          Bulk programmatic access via JSON endpoints + WebSocket webhooks for
          real-time filings (Form 4, 13D/G, 8-K). For products serving
          &gt;10,000 requests/month where flat monthly pricing beats per-request PPC.
        </p>

        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-2xl border border-border bg-panel p-5">
            <div className="text-[11px] uppercase tracking-wider text-dim mb-1">
              Standard
            </div>
            <div className="text-2xl font-bold tabular-nums mb-1">$500</div>
            <div className="text-xs text-dim mb-3">/ month</div>
            <ul className="text-xs text-muted space-y-1">
              <li>100k requests/mo</li>
              <li>JSON endpoints</li>
              <li>24h support response</li>
              <li>99.5% SLA</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-brand/40 bg-brand/5 p-5">
            <div className="text-[11px] uppercase tracking-wider text-brand mb-1">
              Pro
            </div>
            <div className="text-2xl font-bold tabular-nums mb-1 text-brand">$2,500</div>
            <div className="text-xs text-dim mb-3">/ month</div>
            <ul className="text-xs text-muted space-y-1">
              <li>1M requests/mo</li>
              <li>JSON + webhooks</li>
              <li>Form 4 real-time push</li>
              <li>4h support response</li>
              <li>99.9% SLA</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
            <div className="text-[11px] uppercase tracking-wider text-emerald-400 mb-1">
              Enterprise
            </div>
            <div className="text-2xl font-bold tabular-nums mb-1 text-emerald-400">$10,000</div>
            <div className="text-xs text-dim mb-3">/ month</div>
            <ul className="text-xs text-muted space-y-1">
              <li>Unlimited requests</li>
              <li>All webhooks</li>
              <li>Custom endpoints</li>
              <li>Dedicated support</li>
              <li>99.99% SLA</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-dim">
          Status: scaffolding. Live endpoints land Year-2 (target Q3 2026).
          Inbound inquiries below trigger early-access slot allocation.
        </p>
      </section>

      {/* Why */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-4">Why this matters for your product</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted">
          <div className="rounded-2xl border border-border bg-panel p-5">
            <div className="text-text font-semibold mb-2">SEC-grade primary sources</div>
            <p>
              Every page cites the underlying SEC filing URL. No middleman, no derived
              guesswork. Your AI product&rsquo;s answers are as auditable as ours.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-panel p-5">
            <div className="text-text font-semibold mb-2">Synthesis layer included</div>
            <p>
              ConvictionScore (-100..+100) aggregates 30 superinvestor positions
              into one signal per ticker. Your product can serve users a verdict,
              not raw data.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-panel p-5">
            <div className="text-text font-semibold mb-2">Structured JSON-LD on every page</div>
            <p>
              schema.org Person/Organization/FinancialProduct markup means parsing
              is one fetch + one JSON.parse, not HTML scraping.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-panel p-5">
            <div className="text-text font-semibold mb-2">Cross-jurisdiction roadmap</div>
            <p>
              US in Phase 1 (live). UK LSE + Canada SEDAR + Australia ASX in Phase 2
              (Q3 2026). One API surface, four jurisdictions of regulatory data.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="mt-12 rounded-2xl border border-brand/40 bg-brand/5 p-8">
        <h2 className="text-xl font-bold mb-3">Get started</h2>
        <ol className="space-y-3 text-sm">
          <li>
            <strong className="text-brand">Try Pay-Per-Crawl now.</strong> Zero
            commitment — point your crawler at holdlens.com via Cloudflare PPC.
            Pricing schedule lives at <a href="/llms.txt" className="text-brand hover:underline">/llms.txt</a>.
          </li>
          <li>
            <strong className="text-brand">Estimate your monthly volume.</strong>{" "}
            Above ~10k requests/month, the Enterprise API tier costs less per request.
          </li>
          <li>
            <strong className="text-brand">Request enterprise access.</strong>{" "}
            Email{" "}
            <a href="mailto:contact@editnative.com?subject=HoldLens%20Enterprise%20API%20inquiry" className="text-brand hover:underline">
              contact@editnative.com
            </a>{" "}
            with: product name + URL, expected monthly request volume, latency
            requirements, specific endpoints needed (Form 4 firehose, 13F snapshots,
            ConvictionScore feed). We&rsquo;ll match you to a tier and send a contract
            within 48 hours.
          </li>
        </ol>
      </section>

      <p className="text-xs text-dim mt-12">
        Compliance: HoldLens does not provide investment advice. We aggregate
        publicly-disclosed SEC + FINRA + STOCK-Act filings as research data.
        Customers using HoldLens data in regulated products are responsible for
        their own compliance posture.
      </p>
    </div>
  );
}
