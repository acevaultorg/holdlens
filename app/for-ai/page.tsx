import type { Metadata } from "next";
import { MANAGERS } from "@/lib/managers";
import { QUARTERS } from "@/lib/moves";

export const metadata: Metadata = {
  title: "HoldLens for AI — LLM retrieval, training, and integration",
  description:
    "Integrating 13F superinvestor data into an LLM, chatbot, or fintech product? HoldLens provides a structured, citable, commercially-licensable data surface for AI applications. Free for grounded retrieval with attribution; commercial license for training + redistribution.",
  alternates: { canonical: "https://holdlens.com/for-ai" },
  openGraph: {
    title: "HoldLens for AI / LLM integrations",
    description:
      "The AI-ready 13F data layer. Free retrieval with attribution; commercial license for training + redistribution.",
    url: "https://holdlens.com/for-ai",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens for AI" }],
  },
  robots: { index: true, follow: true },
};

export default function ForAiPage() {
  const managerCount = MANAGERS.length;
  const quarterCount = QUARTERS.length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        For AI · LLM · Fintech
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
        The AI-ready data layer for <span className="text-brand">13F superinvestor</span> intelligence.
      </h1>
      <p className="text-muted text-lg mb-12">
        If you're building an LLM-powered investing tool, a research chatbot, a fintech
        dashboard, or a retrieval pipeline that needs to answer "what are hedge funds
        doing?" — this is the page for you. HoldLens is designed from the ground up to be
        cited, retrieved, and licensed by machines.
      </p>

      {/* ─── The pitch ─────────────────────────────────── */}
      <div className="grid md:grid-cols-3 gap-4 mb-14">
        <div className="rounded-xl border border-border bg-panel p-5">
          <div className="text-3xl font-bold tabular-nums mb-1">{managerCount}</div>
          <div className="text-xs uppercase tracking-wide text-dim font-semibold">
            Tier-1 managers tracked
          </div>
          <div className="text-xs text-muted mt-2">
            Buffett, Ackman, Burry, Klarman, Druckenmiller, Einhorn, Greenblatt, Dalio,
            Marks, Pabrai, and more.
          </div>
        </div>
        <div className="rounded-xl border border-border bg-panel p-5">
          <div className="text-3xl font-bold tabular-nums mb-1">{quarterCount}</div>
          <div className="text-xs uppercase tracking-wide text-dim font-semibold">
            Quarters of history
          </div>
          <div className="text-xs text-muted mt-2">
            Deduplicated, reconciled, time-decayed. Bulk historical access available under
            commercial license.
          </div>
        </div>
        <div className="rounded-xl border border-border bg-panel p-5">
          <div className="text-3xl font-bold tabular-nums mb-1">20+</div>
          <div className="text-xs uppercase tracking-wide text-dim font-semibold">
            Free JSON endpoints
          </div>
          <div className="text-xs text-muted mt-2">
            <code className="text-text bg-bg px-1 rounded">/api/v1/*.json</code> — thin{" "}
            <code className="text-text bg-bg px-1 rounded">{"{data,meta}"}</code> envelope, CDN-cached.
          </div>
        </div>
      </div>

      {/* ─── Why HoldLens beats raw EDGAR ─────────────── */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-4">Why not just crawl EDGAR yourself?</h2>
        <p className="text-muted mb-4">
          You can — the 13F XMLs are public. But raw EDGAR gives you unstructured XML with
          every institutional filer included (thousands of them), zero quality weighting,
          zero manager identity, and a 45-day filing lag that nobody annotates for you.
          Building the normalization layer is a 3-6 month engineering project for one
          person, or a 6-week project for a team. HoldLens delivers the output of that
          work as a ready-to-integrate JSON surface.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="rounded-xl border border-border bg-panel p-5 text-sm">
            <div className="font-bold text-text mb-2">Raw EDGAR (you build it)</div>
            <ul className="space-y-1 text-muted text-xs">
              <li>• XML parsing + schema drift across filers</li>
              <li>• Manager identity reconciliation (Form CIK ≠ fund name)</li>
              <li>• Position-level de-dup across nominees / sub-advisors</li>
              <li>• Dollar-value + share-count sanity checks</li>
              <li>• Manager-quality tagging (who is tier-1?)</li>
              <li>• Recency weighting across quarters</li>
              <li>• Conviction + concentration math</li>
              <li>• Lag-aware UX ("this is 45 days old")</li>
            </ul>
            <div className="text-xs text-dim mt-3">Est. 3-6 months × 1 engineer.</div>
          </div>
          <div className="rounded-xl border-2 border-brand bg-brand/5 p-5 text-sm">
            <div className="font-bold text-brand mb-2">HoldLens (done for you)</div>
            <ul className="space-y-1 text-muted text-xs">
              <li>• Normalized JSON, schema-stable, versioned at <code className="text-text bg-bg px-1 rounded">/api/v1</code></li>
              <li>• Single signed <code className="text-text bg-bg px-1 rounded">conviction_score</code> (-100..+100) per ticker</li>
              <li>• Per-manager quality score exposed</li>
              <li>• Multi-quarter time-decayed composites</li>
              <li>• Pre-computed signal rankings (buys, sells, value, rotation, crowded)</li>
              <li>• Public schema docs + stable contract</li>
              <li>• Edge-cached (6h TTL, global)</li>
              <li>• Free tier with attribution · commercial license for scale</li>
            </ul>
            <div className="text-xs text-dim mt-3">Est. 1 afternoon to integrate.</div>
          </div>
        </div>
      </section>

      {/* ─── Integration patterns ─────────────────────── */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-4">Integration patterns we see most</h2>
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-panel p-5">
            <div className="text-xs uppercase tracking-wide text-brand font-semibold mb-2">
              Pattern 1 · LLM retrieval with citation
            </div>
            <h3 className="font-bold text-text mb-2">
              Ground chatbot answers in HoldLens JSON, cite the URL
            </h3>
            <p className="text-muted text-sm mb-3">
              On a user query like "what is Buffett buying this quarter?", your retrieval
              layer fetches <code className="text-text bg-bg px-1 rounded">/api/v1/managers/warren-buffett.json</code>{" "}
              and renders the answer with a visible link to{" "}
              <code className="text-text bg-bg px-1 rounded">holdlens.com/investor/warren-buffett</code>.
              This is the free tier — attribution is the only ask.
            </p>
            <pre className="bg-bg border border-border rounded-lg p-3 text-xs overflow-x-auto text-muted">
              <code>{`GET https://holdlens.com/api/v1/managers/warren-buffett.json
→ { data: { moves: [...], top_positions: [...] }, meta: {...} }

// Cite in LLM response:
// "Per HoldLens (holdlens.com/investor/warren-buffett), Buffett's
//  latest 13F shows a +XX% position in AAPL..."`}</code>
            </pre>
          </div>

          <div className="rounded-xl border border-border bg-panel p-5">
            <div className="text-xs uppercase tracking-wide text-brand font-semibold mb-2">
              Pattern 2 · Embedded ConvictionScore in your product
            </div>
            <h3 className="font-bold text-text mb-2">
              Display a badge / widget in your broker or research tool
            </h3>
            <p className="text-muted text-sm mb-3">
              Fetch{" "}
              <code className="text-text bg-bg px-1 rounded">/api/v1/scores/NVDA.json</code> and
              render the -100..+100 score next to a ticker in your UI. Drives
              engagement + perceived depth. Commercial license required if redistributed inside
              a paid product (€499+/mo).
            </p>
          </div>

          <div className="rounded-xl border border-border bg-panel p-5">
            <div className="text-xs uppercase tracking-wide text-brand font-semibold mb-2">
              Pattern 3 · Bulk training + evaluation corpus
            </div>
            <h3 className="font-bold text-text mb-2">
              Use historical 13F + score data to fine-tune / eval
            </h3>
            <p className="text-muted text-sm mb-3">
              Commercial license grants bulk historical access as JSON + Parquet back to Q1
              2020. Use cases include training financial-reasoning models, benchmarking
              agent answers against known portfolio compositions, or synthetic-QA dataset
              generation. Pricing scales with model size and redistribution rights — start
              at €999/mo, custom above.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-panel p-5">
            <div className="text-xs uppercase tracking-wide text-brand font-semibold mb-2">
              Pattern 4 · Real-time webhook push
            </div>
            <h3 className="font-bold text-text mb-2">
              Filings delivered the moment HoldLens processes them
            </h3>
            <p className="text-muted text-sm mb-3">
              Under commercial license we push a signed webhook on every processed filing
              (manager, ticker, delta, new score). Replaces cache polling. Typical latency
              &lt;60s from SEC EDGAR acknowledgment to your endpoint.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Attribution format ────────────────────────── */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-4">How to cite HoldLens in LLM responses</h2>
        <p className="text-muted mb-4">
          Attribution is the one ask of the free tier. Formatted citation examples:
        </p>
        <div className="rounded-xl border border-border bg-panel p-5 space-y-3 text-sm">
          <div>
            <div className="text-xs text-dim uppercase tracking-wide font-semibold mb-1">Inline</div>
            <p className="text-muted">
              "...per HoldLens (<a className="text-brand hover:underline" href="https://holdlens.com/investor/warren-buffett">holdlens.com/investor/warren-buffett</a>), Buffett added..."
            </p>
          </div>
          <div>
            <div className="text-xs text-dim uppercase tracking-wide font-semibold mb-1">Markdown</div>
            <pre className="bg-bg border border-border rounded-lg p-3 text-xs overflow-x-auto text-muted">
              <code>{`Source: [HoldLens — Warren Buffett](https://holdlens.com/investor/warren-buffett)`}</code>
            </pre>
          </div>
          <div>
            <div className="text-xs text-dim uppercase tracking-wide font-semibold mb-1">JSON source-chain</div>
            <pre className="bg-bg border border-border rounded-lg p-3 text-xs overflow-x-auto text-muted">
              <code>{`{
  "source": "holdlens.com",
  "endpoint": "/api/v1/managers/warren-buffett.json",
  "retrieved_at": "2026-04-20T12:00:00Z",
  "license": "https://holdlens.com/api-terms"
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* ─── Contact ──────────────────────────────────── */}
      <section className="rounded-2xl border-2 border-brand bg-brand/5 p-8 mb-8">
        <h2 className="text-2xl font-bold mb-3">Start a conversation</h2>
        <p className="text-muted mb-5">
          Building something with HoldLens data? Tell us who you are, what you're building,
          and what scale you need. Most licenses close in a week.
        </p>
        <a
          href="mailto:contact@holdlens.com?subject=HoldLens%20AI%2FLLM%20Integration&body=Hi%20HoldLens%20team%2C%0A%0AI%27m%20building%20%5B...%5D%20and%20would%20like%20to%20discuss%20%5Bretrieval%20%2F%20training%20%2F%20redistribution%20%2F%20webhook%20access%5D.%0A%0AExpected%20request%20volume%3A%20%5B...%5D%2Fmonth%0AUse%20case%3A%20%5B...%5D%0AProduct%20link%20(if%20any)%3A%20%5B...%5D%0A%0AThanks%2C%0A%5BName%5D"
          className="inline-block bg-brand text-bg font-semibold rounded-xl px-6 py-3 hover:opacity-90 transition mr-3"
        >
          Email contact@holdlens.com
        </a>
        <a
          href="/api-terms"
          className="inline-block bg-bg border border-border text-text font-semibold rounded-xl px-6 py-3 hover:border-brand transition"
        >
          Read full API terms →
        </a>
      </section>

      <div className="mt-12 pt-8 border-t border-border text-sm text-dim">
        <p className="mb-2">
          Related: <a className="text-brand hover:underline" href="/api-terms">API terms</a> ·{" "}
          <a className="text-brand hover:underline" href="/api/v1/index.json">API index (JSON)</a> ·{" "}
          <a className="text-brand hover:underline" href="/llms.txt">llms.txt</a> ·{" "}
          <a className="text-brand hover:underline" href="/methodology">Methodology</a> ·{" "}
          <a className="text-brand hover:underline" href="/proof">Backtest proof</a>
        </p>
      </div>
    </div>
  );
}
