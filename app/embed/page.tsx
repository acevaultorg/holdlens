import type { Metadata } from "next";
import Link from "next/link";
import { MANAGERS } from "@/lib/managers";

// /embed — landing page listing every embeddable widget HoldLens ships +
// copy-paste iframe snippets per archetype. Per audit's 🔴 fix
// (Embeddability score → 9): each iframe embed = permanent backlink +
// recurring discovery channel. Closes the structural compounding gap.
//
// Two embed surfaces:
//   1. /embed/investor/[slug]/ — 360px tall portfolio card (NEW)
//   2. /embed/[ticker]/ — ConvictionScore badge (shipped earlier)

export const metadata: Metadata = {
  title: { absolute: "Embed HoldLens widgets on your site — free, attribution-only" },
  description:
    "Drop-in iframes for every tracked superinvestor + ticker. Portfolio cards, ConvictionScore badges. Free. Attribution-only. No API key.",
  alternates: { canonical: "https://holdlens.com/embed/" },
  openGraph: {
    title: "Embed HoldLens widgets",
    description:
      "Free iframe embeds for finance blogs, Substack posts, and investor wikis. Portfolio cards + conviction badges.",
    url: "https://holdlens.com/embed/",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — embeddable widgets" }],
  },
  robots: { index: true, follow: true },
};

const BREADCRUMB_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
    { "@type": "ListItem", position: 2, name: "Embed widgets", item: "https://holdlens.com/embed/" },
  ],
};

function Snippet({ code }: { code: string }) {
  return (
    <pre className="mt-3 rounded-lg border border-border bg-bg/80 p-4 text-[11px] sm:text-xs font-mono text-text overflow-x-auto leading-relaxed">
      <code>{code}</code>
    </pre>
  );
}

export default function EmbedHubPage() {
  const featured = ["warren-buffett", "bill-ackman", "michael-burry", "stanley-druckenmiller"]
    .map((slug) => MANAGERS.find((m) => m.slug === slug))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  return (
    <div className="max-w-4xl mx-auto px-8 sm:px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_LD) }} />

      <Link href="/" className="text-xs text-muted hover:text-text">← HoldLens</Link>

      <header className="mt-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
          Embed widgets
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Embed HoldLens widgets on your site
        </h1>
        <p className="text-muted text-lg mt-4 leading-relaxed max-w-2xl">
          Drop-in iframe widgets for every tracked superinvestor portfolio + every ticker
          ConvictionScore. Free. Attribution-only. No API key, no auth, no rate limits. Each embed
          renders fresh from the same data the canonical page reads — when the underlying 13F
          updates, your embed updates.
        </p>
      </header>

      {/* Investor portfolio embeds */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-2">Superinvestor portfolio card</h2>
        <p className="text-sm text-muted mb-6 leading-relaxed max-w-2xl">
          Top-3 holdings + closest replicating ETF + investing-style tag, in a 600px-wide card.
          Drop into a Substack post, a research blog, a Notion doc. Updates when the underlying 13F
          filing updates.
        </p>

        <div className="rounded-2xl border border-border bg-panel p-5 mb-4">
          <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-2">
            Generic snippet — replace [slug]
          </div>
          <Snippet
            code={`<iframe
  src="https://holdlens.com/embed/investor/[slug]/"
  width="600"
  height="360"
  frameborder="0"
  loading="lazy"
  title="HoldLens — superinvestor portfolio"
></iframe>`}
          />
        </div>

        <h3 className="text-sm font-semibold text-muted uppercase tracking-widest mt-8 mb-3">
          Featured managers
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {featured.map((m) => (
            <div key={m.slug} className="rounded-xl border border-border bg-panel p-4">
              <div className="flex items-baseline justify-between mb-2">
                <div className="font-semibold text-text">{m.name}</div>
                <Link
                  href={`/embed/investor/${m.slug}/`}
                  className="text-xs text-brand hover:underline"
                  target="_blank"
                >
                  Preview →
                </Link>
              </div>
              <div className="text-xs text-muted mb-3">{m.fund}</div>
              <Snippet
                code={`<iframe src="https://holdlens.com/embed/investor/${m.slug}/" width="600" height="360" frameborder="0" loading="lazy" title="${m.name} portfolio — HoldLens"></iframe>`}
              />
            </div>
          ))}
        </div>

        <Link
          href="/investor/"
          className="inline-block mt-6 text-sm text-brand hover:underline font-semibold"
        >
          See all 30 tracked superinvestors →
        </Link>
      </section>

      {/* Ticker conviction badge */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-2">Ticker ConvictionScore badge</h2>
        <p className="text-sm text-muted mb-6 leading-relaxed max-w-2xl">
          A signed −100 to +100 score derived from how the 30 tracked managers are positioning. One
          number. Compact badge format — slot anywhere on a stock-research page.
        </p>

        <div className="rounded-2xl border border-border bg-panel p-5">
          <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-2">
            Generic snippet — replace [TICKER]
          </div>
          <Snippet
            code={`<iframe
  src="https://holdlens.com/embed/[TICKER]/"
  width="280"
  height="320"
  frameborder="0"
  loading="lazy"
  title="HoldLens — [TICKER] ConvictionScore"
></iframe>`}
          />
          <p className="text-xs text-muted mt-3">
            Examples:{" "}
            <Link href="/embed/AAPL/" className="text-brand hover:underline" target="_blank">
              AAPL
            </Link>
            {" · "}
            <Link href="/embed/META/" className="text-brand hover:underline" target="_blank">
              META
            </Link>
            {" · "}
            <Link href="/embed/BN/" className="text-brand hover:underline" target="_blank">
              BN
            </Link>
          </p>
        </div>
      </section>

      {/* JSON API for programmatic consumers */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-2">JSON API for programmatic consumers</h2>
        <p className="text-sm text-muted mb-6 leading-relaxed max-w-2xl">
          Building a tool, an LLM agent, a research script? Pull data directly from the public JSON
          API instead of scraping HTML. Same dataset, structured.
        </p>

        <div className="rounded-2xl border border-border bg-panel p-5">
          <Snippet
            code={`# Per-manager portfolio + ConvictionScore + ROI + moves
curl https://holdlens.com/api/v1/managers/bill-ackman.json

# Per-ticker breakdown (all 30 managers' positions)
curl https://holdlens.com/api/v1/scores/AAPL.json

# Full catalog
curl https://holdlens.com/api/v1/index.json`}
          />
          <Link
            href="/api/"
            className="inline-block mt-4 text-sm text-brand hover:underline font-semibold"
          >
            Full API documentation →
          </Link>
        </div>
      </section>

      {/* Attribution rules — the only ask */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-2">Attribution + license</h2>
        <ul className="text-sm text-muted leading-relaxed space-y-2 max-w-2xl mb-6">
          <li>
            <strong className="text-text">Free for any use</strong> — personal, commercial,
            non-profit, AI training. No license fee.
          </li>
          <li>
            <strong className="text-text">Keep the &quot;Powered by HoldLens&quot; footer</strong>{" "}
            — every embed already includes it. Don&apos;t strip it.
          </li>
          <li>
            <strong className="text-text">Don&apos;t cloak</strong> the iframe behind a paywall
            without making the underlying source visible.
          </li>
          <li>
            <strong className="text-text">No warranty</strong> — 13F data is quarterly + lagged ~45
            days; HoldLens doesn&apos;t provide investment advice. The widget is for context, not
            execution.
          </li>
        </ul>
      </section>

      <footer className="mt-16 pt-8 border-t border-border text-xs text-dim">
        <p>
          Have a custom embed need (different size, different metric, branded version)?{" "}
          <Link href="/contact/" className="text-brand hover:underline">
            Contact us
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}
