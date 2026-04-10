import type { Metadata } from "next";
import EmailCapture from "@/components/EmailCapture";
import StripeCheckoutButton from "@/components/StripeCheckoutButton";
import { MANAGERS } from "@/lib/managers";

export const metadata: Metadata = {
  title: "Pricing — HoldLens Free + Pro",
  description: `HoldLens is free forever for the core 13F tracker. Pro tier ($14/mo) launches Q2 2026 with email alerts, conviction scores, manager alpha attribution, and more.`,
  openGraph: {
    title: "HoldLens Pricing",
    description: "Free forever core. Pro tier launching Q2 2026.",
  },
};

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-14">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Pricing
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          Free forever. Pro for $14/mo.
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          The core HoldLens product is free for everyone. Pro adds email alerts,
          a conviction score, manager alpha attribution, and direct API access.
        </p>
      </div>

      {/* Two-tier pricing grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {/* Free */}
        <div className="rounded-2xl border border-border bg-panel p-8">
          <div className="text-xs uppercase tracking-widest text-dim font-semibold mb-2">
            Free
          </div>
          <div className="text-5xl font-bold mb-1 tabular-nums">$0</div>
          <div className="text-sm text-muted mb-6">forever, no card</div>

          <a
            href="/this-week"
            className="block text-center bg-bg border border-border text-text font-semibold rounded-xl px-5 py-3 hover:border-brand transition mb-8"
          >
            Open HoldLens →
          </a>

          <ul className="space-y-3 text-sm">
            <Feature text={`${MANAGERS.length} of the best portfolio managers in the world tracked`} />
            <Feature text="Multi-factor buy/sell recommendation model" />
            <Feature text="Multi-quarter trend streaks (2Q, 3Q+ conviction)" />
            <Feature text="Live prices, charts, news per ticker" />
            <Feature text="Per-ticker signal dossier with verdict" />
            <Feature text="Activity feed, screener, compare managers" />
            <Feature text="Watchlist, sector heatmap, CSV export" />
            <Feature text="cmd+K search, RSS feeds" />
            <Feature text="Free RSS feed of buy/sell signals" />
          </ul>
        </div>

        {/* Pro */}
        <div className="rounded-2xl border border-brand bg-brand/5 p-8 relative">
          <div className="absolute -top-3 left-8 text-[10px] uppercase tracking-widest font-bold text-black bg-brand rounded-full px-3 py-1">
            Launching Q2 2026
          </div>
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
            Pro
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <div className="text-5xl font-bold tabular-nums">$14</div>
            <div className="text-sm text-muted">/month</div>
          </div>
          <div className="text-sm text-muted mb-6">
            $140/year (save $28) · cancel anytime
          </div>

          <div className="mb-6">
            <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
              Founders rate · 100 spots
            </div>
            <p className="text-xs text-muted mb-3">
              First 100 subscribers lock in <span className="text-text font-semibold">$9/mo for life</span>.
              After that, the price goes up to $14/mo. Cancel anytime.
            </p>
            <StripeCheckoutButton variant="founders" label="Subscribe — $9/mo founders rate →" />
            <p className="text-[11px] text-dim mt-3 text-center">
              or <a href="/alerts" className="underline">join the waitlist</a> if you want to wait
            </p>
          </div>

          <ul className="space-y-3 text-sm">
            <Feature text="Everything in Free, plus:" emphasis />
            <Feature text="Email alerts the moment any tracked manager files a 13F" />
            <Feature text="Conviction Score v2 — per-ticker, per-manager 0-100 algorithmic score" />
            <Feature text="Manager Alpha Attribution — realized alpha vs S&P per manager" />
            <Feature text="Custom watchlists with email triggers" />
            <Feature text="Pre-generated weekly digest of the top 10 buy + sell signals" />
            <Feature text="API access (1000 calls/mo) for embeds, bots, scripts" />
            <Feature text="Priority feature requests" />
            <Feature text="No ads, ever" />
          </ul>
        </div>
      </div>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Pricing FAQ</h2>
        <div className="space-y-6">
          <FAQ
            q="Is the free tier really free forever?"
            a="Yes. The core 13F tracker — recommendation model, multi-quarter trends, live prices, signal dossiers, activity feed, screener, compare, watchlist — stays free for everyone. Pro adds email alerts, conviction scoring, alpha attribution, and API access."
          />
          <FAQ
            q="What's the founders price?"
            a="Sign up for early access today and you lock in $14/mo for life. After Q2 2026 launch, the price goes up to $19/mo for new subscribers. Annual ($140/yr) saves you another $28."
          />
          <FAQ
            q="When does Pro launch?"
            a="Q2 2026 — once we ship the EDGAR parser, Resend integration, and Stripe. Email signups today get notified the day Pro goes live."
          />
          <FAQ
            q="Why $14/mo and not $9 or $29?"
            a="Below $10 it feels disposable, above $20 it requires justification. $14 is the sweet spot for an individual investor tool: about half a coffee per week. You'll save that on your first informed move."
          />
          <FAQ
            q="Do you offer a team or family plan?"
            a="Not yet. If you want to share Pro with your investing club or family, reach out — we'll set something up manually until we ship a real team plan."
          />
          <FAQ
            q="Refund policy?"
            a="Cancel anytime. Pro-rated refund within 14 days, no questions asked. After 14 days, your subscription runs to the end of the period and then stops."
          />
        </div>
      </section>

      <p className="text-xs text-dim mt-16 text-center">
        HoldLens does not provide investment advice. We surface SEC 13F filings and live market data so you can decide for yourself.
      </p>
    </div>
  );
}

function Feature({ text, emphasis }: { text: string; emphasis?: boolean }) {
  return (
    <li className={`flex items-start gap-2 ${emphasis ? "text-text font-semibold" : "text-muted"}`}>
      <CheckIcon />
      <span>{text}</span>
    </li>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-brand mt-0.5 shrink-0"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl border border-border bg-panel p-5">
      <div className="font-semibold text-text mb-2">{q}</div>
      <div className="text-sm text-muted leading-relaxed">{a}</div>
    </div>
  );
}
