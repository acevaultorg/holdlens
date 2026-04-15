import type { Metadata } from "next";
import StripeCheckoutButton from "@/components/StripeCheckoutButton";
import AdSlot from "@/components/AdSlot";

// /premium — feature-centric Pro page. Complements /pricing (price-centric)
// by showing WHAT Pro unlocks rather than just HOW MUCH it costs. Each card
// represents a tangible Pro feature with a one-line value statement.
//
// Dark-pattern-free: no fake scarcity timers, no pre-checked upgrade
// toggles, no "limited time" counters. The founders tier is genuinely
// capped at 100 seats — it's stated once and not repeated to pressure.

export const metadata: Metadata = {
  title: "HoldLens Pro — what you unlock at €9/mo",
  description:
    "Custom alerts, unlimited CSV exports, priority API access, ad-free reading, and early-access feature drops. One tier. No tricks.",
  alternates: {
    canonical: "https://holdlens.com/premium",
  },
};

type Feature = {
  emoji?: string;
  title: string;
  body: string;
  free: string;
  pro: string;
};

const FEATURES: Feature[] = [
  {
    title: "Custom ticker + manager alerts",
    body:
      "Get an email the moment any of the 30 tracked managers crosses a move threshold you care about — 'Buffett adds >5%', 'Ackman exits anything', 'Any 10+ manager adds NVDA'. Filter by size, sector, conviction direction.",
    free: "Weekly digest only",
    pro: "Unlimited custom alerts · any rule · hourly delivery",
  },
  {
    title: "Unlimited CSV exports",
    body:
      "Every table on the site — /best-now, /value, /big-bets, /rotation, /consensus, /contrarian, /alerts — can be exported as CSV for your own spreadsheets or models. No daily cap, no sign-in wall.",
    free: "10 exports / month",
    pro: "Unlimited · all 40+ tables · scheduled email export",
  },
  {
    title: "Priority API access",
    body:
      "The same 150+ free JSON endpoints at /api/v1/, but with higher rate limits and a private key for your own dashboards. API keys activate in a single email.",
    free: "150 req / day, no key",
    pro: "10,000 req / day · private key · SLA",
  },
  {
    title: "Ad-free reading",
    body:
      "No Google AdSense, no affiliate cards, no Ko-fi banners — a cleaner page that loads faster. Your support pays for the ad-free experience for yourself and keeps the free tier funded for everyone else.",
    free: "Ad-supported",
    pro: "Zero ads across 984+ pages",
  },
  {
    title: "Early access to new signals",
    body:
      "Every new signal page, data visualization, and dashboard ships to Pro first. Public release follows ~2 weeks later. Pro lets you see smart-money patterns before the crowd gets them.",
    free: "Public release",
    pro: "2-week early access · Slack-first feedback loop",
  },
  {
    title: "Priority support",
    body:
      "Questions, feature requests, bug reports — Pro subscribers get a direct support channel that answers within one business day. Free tier uses the /contact queue (usually 3-5 days).",
    free: "Contact form (3-5 days)",
    pro: "Direct email · <1 business day",
  },
];

type FAQ = { q: string; a: string };

const FAQS: FAQ[] = [
  {
    q: "What's the catch with the €9 founders rate?",
    a:
      "There isn't one. The first 100 subscribers pay €9/mo forever, even when the price later steps up to €14/mo for new signups. You keep €9/mo as long as you stay subscribed. Cancel any time.",
  },
  {
    q: "Can I cancel anytime?",
    a:
      "Yes. One click in Stripe's customer portal. No retention calls, no forms, no 'are you sure' loops. 14-day refund on your first charge — no questions.",
  },
  {
    q: "How is my payment data handled?",
    a:
      "Stripe handles the full card flow. HoldLens never sees your card number, CVC, or billing address. Stripe's SOC 1 / SOC 2 / PCI DSS Level 1 compliance covers everything.",
  },
  {
    q: "Is this financial advice?",
    a:
      "No. HoldLens tracks public SEC 13F filings and surfaces patterns. It does not give buy/sell recommendations for any specific security. Always do your own research and consider consulting a licensed advisor before investing.",
  },
];

export default function PremiumPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          HoldLens Pro
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
          Six things you unlock
          <br />
          <span className="text-brand">for €9/mo.</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          Custom alerts, unlimited exports, priority API, zero ads, early
          access to new signals, and a direct support line. No feature is
          clawed back from the free tier — everything public stays public.
        </p>
      </div>

      {/* Feature grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-14">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-border bg-panel p-6"
          >
            <h2 className="text-lg font-bold text-text mb-2">{f.title}</h2>
            <p className="text-sm text-muted leading-relaxed mb-4">{f.body}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-bg/50 p-3">
                <div className="text-[10px] uppercase tracking-widest text-dim font-semibold mb-1">
                  Free
                </div>
                <div className="text-xs text-dim leading-tight">{f.free}</div>
              </div>
              <div className="rounded-lg border border-brand/40 bg-brand/5 p-3">
                <div className="text-[10px] uppercase tracking-widest text-brand font-semibold mb-1">
                  Pro
                </div>
                <div className="text-xs text-text font-semibold leading-tight">
                  {f.pro}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Single upgrade CTA — no dark patterns, just a clean button and the
          essential facts under it. Mirrors the pricing page's trust strip. */}
      <div className="max-w-2xl mx-auto mb-16">
        <div className="rounded-2xl border-2 border-brand bg-brand/5 p-8 text-center">
          <div className="text-[11px] uppercase tracking-widest text-brand font-bold mb-3">
            Founders tier — 100 seats
          </div>
          <div className="flex items-baseline justify-center gap-2 mb-3">
            <span className="text-5xl font-bold text-text">€9</span>
            <span className="text-dim text-sm">/mo</span>
          </div>
          <p className="text-xs text-muted mb-5">
            Lock in €9/mo for life. Steps up to €14/mo for new subscribers
            after the 100th seat.
          </p>
          <StripeCheckoutButton
            variant="founders"
            label="Start Pro — €9/mo founders rate →"
          />
          <ul className="mt-4 flex items-center justify-center gap-x-4 gap-y-1 flex-wrap text-[10.5px] text-dim">
            <li className="inline-flex items-center gap-1">
              <span
                className="inline-block w-1 h-1 rounded-full bg-emerald-400"
                aria-hidden
              />
              Cancel anytime
            </li>
            <li className="inline-flex items-center gap-1">
              <span
                className="inline-block w-1 h-1 rounded-full bg-emerald-400"
                aria-hidden
              />
              14-day refund
            </li>
            <li className="inline-flex items-center gap-1">
              <span
                className="inline-block w-1 h-1 rounded-full bg-emerald-400"
                aria-hidden
              />
              Secure via Stripe
            </li>
            <li className="inline-flex items-center gap-1">
              <span
                className="inline-block w-1 h-1 rounded-full bg-emerald-400"
                aria-hidden
              />
              EU VAT included
            </li>
          </ul>
          <p className="text-[11px] text-dim mt-4">
            Prefer to wait?{" "}
            <a
              href="/alerts"
              className="underline hover:text-text transition"
            >
              Join the weekly digest
            </a>{" "}
            first.
          </p>
        </div>
      </div>

      <AdSlot format="horizontal" className="mb-12" />

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
          Questions
        </div>
        <h2 className="text-2xl font-bold mb-6">Frequently asked</h2>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-border bg-panel p-5 open:bg-panel/80 transition"
            >
              <summary className="cursor-pointer font-semibold text-text flex items-center justify-between gap-3 list-none">
                <span>{f.q}</span>
                <span className="text-dim text-xl leading-none shrink-0 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Cross-link back to /pricing for the canonical two-tier price table */}
      <div className="text-center mt-16">
        <p className="text-sm text-dim">
          Want the full price table and feature comparison?{" "}
          <a
            href="/pricing"
            className="text-brand font-semibold hover:underline"
          >
            See /pricing →
          </a>
        </p>
      </div>

      {/* FAQPage JSON-LD — unlocks Google FAQ rich results for premium-related
          queries ("HoldLens Pro worth it", "HoldLens premium features"). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.a,
              },
            })),
          }),
        }}
      />

      {/* Product + Offer JSON-LD (v0.95) — Google "Pricing" rich result:
          surface price + currency + availability directly in SERP. No
          aggregateRating claimed — honesty first; adding fabricated ratings
          violates Google's guidelines AND the anti-dark-pattern floor. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "HoldLens Pro",
            description:
              "Custom alerts, unlimited CSV exports, priority API access, ad-free reading, early access, and priority support for the HoldLens 13F superinvestor tracker.",
            brand: {
              "@type": "Brand",
              name: "HoldLens",
            },
            url: "https://holdlens.com/premium",
            offers: [
              {
                "@type": "Offer",
                name: "Founders tier (first 100 subscribers)",
                price: "9",
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
                url: "https://holdlens.com/pricing",
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: "9",
                  priceCurrency: "EUR",
                  billingIncrement: 1,
                  unitText: "month",
                },
              },
              {
                "@type": "Offer",
                name: "Standard tier",
                price: "14",
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
                url: "https://holdlens.com/pricing",
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: "14",
                  priceCurrency: "EUR",
                  billingIncrement: 1,
                  unitText: "month",
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
