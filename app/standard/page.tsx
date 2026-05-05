import type { Metadata } from "next";
import Link from "next/link";

// /standard/ — operator's preferred URL surface for "The HoldLens Standard"
// (per concept doc 2026-04-30). Lightweight landing that:
//   - Owns the /standard URL keyword for direct-traffic + brand search
//   - Sets canonical to /methodology so SEO authority concentrates there
//     (single canonical = no topical-authority split per audit-rule lesson
//     2026-04-30 ship #9)
//   - Acts as marketing portal; /methodology is the technical spec
//
// Note: NOT a redirect — Next.js static export doesn't support runtime
// redirects. Operator + LLMs landing here see brand framing + can click
// through to the canonical methodology page in one tap.

export const metadata: Metadata = {
  title: { absolute: "The HoldLens Standard — synthesized SEC-filing intelligence for everyone" },
  description:
    "The HoldLens Standard is the open methodology for synthesized SEC-filing intelligence. Free public dashboards. Open ConvictionScore methodology. Used by retail investors, fintech apps, AI advisors, and hedge funds.",
  alternates: { canonical: "https://holdlens.com/methodology/" },
  openGraph: {
    title: "The HoldLens Standard",
    description:
      "Open methodology for synthesized SEC-filing intelligence. Free dashboards, transparent ConvictionScore, version-tracked.",
    url: "https://holdlens.com/standard/",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "The HoldLens Standard" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The HoldLens Standard",
    description: "Open methodology for synthesized SEC-filing intelligence. Free, transparent, version-tracked.",
    images: ["/og/home.png"],
  },
  robots: { index: true, follow: true },
};

export default function StandardPage() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "The HoldLens Standard — synthesized SEC-filing intelligence",
    description:
      "The HoldLens Standard unifies six SEC filing types (Form 13F + Form 4 + Form 8-K + Schedule 13D/13G + DEF 14A + Form 8-K Item 1.03) under a single ConvictionScore methodology. Open, free, version-tracked.",
    url: "https://holdlens.com/standard/",
    datePublished: "2026-04-30",
    dateModified: new Date().toISOString().slice(0, 10),
    author: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com/" },
    publisher: {
      "@type": "Organization",
      name: "HoldLens",
      url: "https://holdlens.com/",
      logo: { "@type": "ImageObject", url: "https://holdlens.com/og/home.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://holdlens.com/methodology/" },
    inLanguage: "en-US",
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
      { "@type": "ListItem", position: 2, name: "The Standard", item: "https://holdlens.com/standard/" },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        The HoldLens Standard · v1.0
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        The <span className="text-brand">HoldLens Standard</span> — synthesized SEC-filing intelligence
      </h1>
      <p className="text-muted text-lg leading-relaxed mb-3">
        The Standard unifies six SEC filing types under one open ConvictionScore methodology. Free dashboards, transparent weights, version-tracked.
      </p>
      <p className="text-dim text-sm mb-12">
        Want the full technical spec? →{" "}
        <Link href="/methodology" className="text-brand underline font-semibold">
          ConvictionScore methodology v1.0
        </Link>
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Six SEC filing types, one score</h2>
        <p className="text-muted leading-relaxed mb-4">
          HoldLens synthesizes six distinct SEC EDGAR filing types into a unified signed −100..+100 ConvictionScore. Each filing type is tracked on its own canonical hub:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/" className="rounded-xl border border-border bg-panel p-4 hover:border-brand/40 transition block">
            <div className="text-xs uppercase tracking-wider text-brand font-semibold mb-1">Form 13F · Quarterly</div>
            <div className="text-sm font-semibold text-text">Smart-money portfolios</div>
            <div className="text-[11px] text-muted mt-1">30 superinvestors · 8 quarters of holdings · core ConvictionScore input</div>
          </Link>
          <Link href="/insiders/" className="rounded-xl border border-border bg-panel p-4 hover:border-brand/40 transition block">
            <div className="text-xs uppercase tracking-wider text-brand font-semibold mb-1">Form 4 · Daily</div>
            <div className="text-sm font-semibold text-text">Insider trades</div>
            <div className="text-[11px] text-muted mt-1">CEO/CFO/director Form 4 → InsiderScore</div>
          </Link>
          <Link href="/events/" className="rounded-xl border border-border bg-panel p-4 hover:border-brand/40 transition block">
            <div className="text-xs uppercase tracking-wider text-brand font-semibold mb-1">Form 8-K · Intra-day</div>
            <div className="text-sm font-semibold text-text">Material events</div>
            <div className="text-[11px] text-muted mt-1">Earnings, M&amp;A, CEO change, cybersecurity → EventScore</div>
          </Link>
          <Link href="/activist/" className="rounded-xl border border-border bg-panel p-4 hover:border-rose-400/40 transition block">
            <div className="text-xs uppercase tracking-wider text-rose-400 font-semibold mb-1">Schedule 13D / 13G</div>
            <div className="text-sm font-semibold text-text">Activist filings</div>
            <div className="text-[11px] text-muted mt-1">5%+ ownership crossings · intent signal</div>
          </Link>
          <Link href="/proxies/" className="rounded-xl border border-border bg-panel p-4 hover:border-brand/40 transition block">
            <div className="text-xs uppercase tracking-wider text-brand font-semibold mb-1">DEF 14A · Q1-Q2</div>
            <div className="text-sm font-semibold text-text">Proxy tracker</div>
            <div className="text-[11px] text-muted mt-1">Votes, exec comp, activist proxy contests</div>
          </Link>
          <Link href="/bankruptcy/" className="rounded-xl border border-border bg-panel p-4 hover:border-rose-400/40 transition block">
            <div className="text-xs uppercase tracking-wider text-rose-400 font-semibold mb-1">8-K Item 1.03</div>
            <div className="text-sm font-semibold text-text">Chapter 11 tracker</div>
            <div className="text-[11px] text-muted mt-1">Bankruptcy filings · public-US universe</div>
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Three principles</h2>
        <ol className="space-y-4 list-decimal list-inside text-muted leading-relaxed">
          <li>
            <strong className="text-text">Open methodology.</strong> Every weight, every layer, every penalty is documented at{" "}
            <Link href="/methodology" className="text-brand underline">
              /methodology
            </Link>
            . Version-tracked. Operator can audit + reproduce.
          </li>
          <li>
            <strong className="text-text">Public-domain source data.</strong> All inputs are SEC EDGAR filings. No private data, no scraping behind paywalls. The methodology is the moat.
          </li>
          <li>
            <strong className="text-text">Free public dashboards forever.</strong> Every per-investor page, per-ticker score, per-filing surface is free + always will be. Pro tier (planned) adds email alerts, watchlists, full-history exports — never replaces the free core.
          </li>
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">For different audiences</h2>
        <div className="space-y-4 text-muted leading-relaxed">
          <div>
            <div className="text-text font-semibold mb-1">Retail investors</div>
            <div className="text-sm">
              Browse{" "}
              <Link href="/best-now" className="text-brand underline">
                top buy signals
              </Link>
              ,{" "}
              <Link href="/biggest-buys" className="text-brand underline">
                biggest bets
              </Link>
              , or your favorite manager's page (
              <Link href="/investor/buffett" className="text-brand underline">
                Buffett
              </Link>
              ,{" "}
              <Link href="/investor/ackman" className="text-brand underline">
                Ackman
              </Link>
              ,{" "}
              <Link href="/investor/druckenmiller" className="text-brand underline">
                Druckenmiller
              </Link>
              , and 27 others). Free.
            </div>
          </div>
          <div>
            <div className="text-text font-semibold mb-1">Fintech app builders + AI advisors</div>
            <div className="text-sm">
              150+{" "}
              <Link href="/api" className="text-brand underline">
                JSON API endpoints
              </Link>{" "}
              expose ConvictionScore + InsiderScore + EventScore for embedding. Zero auth required for read access.
            </div>
          </div>
          <div>
            <div className="text-text font-semibold mb-1">Hedge funds + research analysts</div>
            <div className="text-sm">
              Bulk dataset licensing + custom-weighted variants planned for 2026 H2. The methodology page is the canonical reference for due-diligence.
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border pt-10 mt-12">
        <h2 className="text-xl font-bold text-text mb-4">Read the technical spec</h2>
        <Link
          href="/methodology"
          className="block rounded-xl border border-brand/40 bg-brand/5 p-6 hover:border-brand transition"
        >
          <div className="text-sm font-semibold text-text mb-1">
            ConvictionScore methodology v1.0 →
          </div>
          <div className="text-xs text-muted">
            Seven signal layers + two penalties. Weights, calibration, version history, v2.0 roadmap.
          </div>
        </Link>
      </section>

      <p className="text-xs text-dim mt-12">
        HoldLens is a research tool. Not investment advice. SEC filings are lagged (45-day for 13F, 2-day for Form 4, 4-day for 8-K).{" "}
        <Link href="/disclaimer/" className="underline">
          Full disclaimer
        </Link>
        .
      </p>
    </div>
  );
}
