import InvestingBooks from "@/components/InvestingBooks";
import type { Metadata } from "next";
import Link from "next/link";
import { MANAGERS } from "@/lib/managers";
import { LATEST_QUARTER, QUARTER_LABELS } from "@/lib/moves";

// /pricing — repurposed 2026-05-19 per operator directive: "remove all pro
// stuff. we give all for free to anyone. we need to have a certain amount
// of users first before this makes sense."
//
// Page preserved (not deleted) so inbound links + bookmarks + search-engine
// results don't 404. Repositioned as "everything-free" landing. Original
// Stripe checkout flow removed; restore from git history when monetization
// re-launches.

export const metadata: Metadata = {
  title: "HoldLens is free — full access for everyone",
  description: `Every HoldLens feature is free at this stage: ConvictionScore rankings for ${"500+"} tracked stocks, ${MANAGERS.length} superinvestor portfolios, signal dossiers, Form 4 insider trades, 8-K events, sector rotation, CSV exports, and the full JSON API. No paywall, no sign-up wall, no Pro tier.`,
  alternates: { canonical: "https://holdlens.com/pricing" },
  openGraph: {
    title: "HoldLens — free for everyone",
    description: "Full ConvictionScore + 30 superinvestor portfolios + JSON API + CSV exports. No paywall.",
    url: "https://holdlens.com/pricing",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — free for everyone" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HoldLens — free for everyone",
    description: "Full access, no paywall.",
    images: ["/og/home.png"],
  },
};

export default function PricingPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Pricing", item: "https://holdlens.com/pricing" },
    ],
  };

  return <> {(
    <div className="max-w-3xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-3">
        Pricing
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
        HoldLens is <span className="text-brand">free</span>.
      </h1>
      <p className="text-muted text-lg leading-relaxed mb-4">
        Every feature is open to everyone at this stage. No paywall, no sign-up wall,
        no Pro tier, no trial timer.
      </p>
      <p className="text-dim text-sm leading-relaxed mb-10">
        We&apos;re focused on getting the product right and growing the audience first.
        We may introduce optional paid tiers later — when there&apos;s a meaningful
        user base and the product clearly creates enough value to justify it. For now:
        all features, all data, all exports, all API endpoints — free.
      </p>

      <section className="rounded-card border border-border bg-surface-muted p-6 mb-10">
        <h2 className="text-base font-bold text-text mb-3">What you get (everything)</h2>
        <ul className="space-y-2 text-sm text-muted leading-relaxed">
          <li>
            <span className="text-emerald-400 mr-2">✓</span>
            <Link href="/scores" className="text-brand underline">ConvictionScore</Link>{" "}
            for every tracked stock — {MANAGERS.length} superinvestors, 9 quarters of 13F
            history, full composite signal.
          </li>
          <li>
            <span className="text-emerald-400 mr-2">✓</span>
            Per-investor pages, per-ticker dossiers, per-sector flow heatmaps.
          </li>
          <li>
            <span className="text-emerald-400 mr-2">✓</span>
            Daily Form 4 insider feed + 8-K material event timeline (combined SEC + curated).
          </li>
          <li>
            <span className="text-emerald-400 mr-2">✓</span>
            Quarterly{" "}
            <Link href="/reports/2026-05-q1-2026-13f-signal-summary" className="text-brand underline">
              13F signal recaps
            </Link>{" "}
            + manager-specific deep dives.
          </li>
          <li>
            <span className="text-emerald-400 mr-2">✓</span>
            Full JSON API at{" "}
            <Link href="/api/v1/" className="text-brand underline">/api/v1/</Link> — 20+
            endpoints, CSV exports, machine-readable {QUARTER_LABELS[LATEST_QUARTER]} snapshot.
          </li>
          <li>
            <span className="text-emerald-400 mr-2">✓</span>
            Email alerts at{" "}
            <Link href="/alerts" className="text-brand underline">/alerts</Link> — optional
            opt-in for new filings + signal changes.
          </li>
          <li>
            <span className="text-emerald-400 mr-2">✓</span>
            36+{" "}
            <Link href="/learn" className="text-brand underline">/learn essays</Link>{" "}
            covering SEC filing mechanics + famous trades + signal methodology.
          </li>
        </ul>
      </section>

      <h2 className="text-2xl font-bold mb-4">Why free?</h2>
      <p className="text-muted leading-relaxed mb-3">
        HoldLens is in growth-first mode. We&apos;re tracking what helps investors most
        and improving the product — not segmenting users into tiers. Paywalls before
        you have meaningful usage create the wrong feedback loop: optimization for
        conversion friction instead of for actual usefulness.
      </p>
      <p className="text-muted leading-relaxed mb-8">
        When the audience and signal are strong enough, we&apos;ll likely introduce
        an optional paid tier with extras (richer alerts, custom watchlists, full
        EDGAR-wide universe expansion). Everything you see today will stay free.
      </p>

      <h2 className="text-2xl font-bold mb-4">How HoldLens is funded</h2>
      <p className="text-muted leading-relaxed mb-3">
        At this stage: AdSense + Cloudflare Pay-Per-Crawl (AI crawler licensing) +
        occasional non-intrusive affiliate links to brokers we use ourselves
        (disclosed when present). No data resale. No selling email lists.
      </p>
      <p className="text-muted leading-relaxed mb-10">
        Your usage is what matters most right now. The more people who find the
        product useful, the more sense it makes to invest in keeping it free.
      </p>

      <section className="rounded-card border border-border bg-surface p-6 mb-10">
        <h2 className="text-base font-bold text-text mb-2">Start here</h2>
        <ul className="space-y-1.5 text-sm">
          <li>
            →{" "}
            <Link href="/scores" className="text-brand underline">
              ConvictionScore rankings — every tracked stock
            </Link>
          </li>
          <li>
            →{" "}
            <Link href="/best-now" className="text-brand underline">
              Most-bought + most-sold this quarter
            </Link>
          </li>
          <li>
            →{" "}
            <Link href="/leaderboard" className="text-brand underline">
              Manager ROI leaderboard — who actually beats the market
            </Link>
          </li>
          <li>
            →{" "}
            <Link href="/today" className="text-brand underline">
              Today — daily-fresh insider + event feed
            </Link>
          </li>
          <li>
            →{" "}
            <Link href="/api/v1/" className="text-brand underline">
              JSON API — machine-readable everything
            </Link>
          </li>
        </ul>
      </section>

      <p className="text-xs text-dim pt-6 border-t border-border leading-relaxed">
        Not investment advice. Sourced from public SEC EDGAR filings. See{" "}
        <Link href="/methodology" className="text-brand underline">methodology</Link> +{" "}
        <Link href="/disclaimer" className="text-brand underline">disclaimer</Link>.
      </p>
    </div>
  )} <div className="mx-auto max-w-5xl px-6"><InvestingBooks heading="Reading for your research" sub="Optional background reading on interpreting company disclosures and investing methods. These books do not validate a signal or predict returns." showAudible={false} limit={2} /></div> </>;
}
