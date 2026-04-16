import type { Metadata } from "next";
import EmailCapture from "@/components/EmailCapture";
import StripeCheckoutButton from "@/components/StripeCheckoutButton";
import { MANAGERS } from "@/lib/managers";

export const metadata: Metadata = {
  title: "Pricing — HoldLens Free + Pro",
  description: `HoldLens is free forever for the full recommendation model, signal dossiers, and live data. Pro tier is €14/mo (€9/mo founders rate for the first 100 subscribers) with email alerts, EDGAR automation, custom watchlists, and API access. Live now.`,
  openGraph: {
    title: "HoldLens Pricing",
    description: "Free forever core — the unified signed ConvictionScore is in Free, not Pro. Pro €9/mo founders.",
  },
};

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Pricing
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
          Free forever. Pro for €9/mo.
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          The full recommendation engine — unified signed ConvictionScore, signal dossiers,
          live prices, multi-quarter trend detection — is free for everyone. Pro adds
          email alerts, EDGAR automation, custom watchlists, and API access.
        </p>
      </div>

      {/* Competitor anchor — establishes price context without trashing anyone.
          Pure data. Readers orient: €9 is the price floor of this category. */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="text-center text-[11px] uppercase tracking-widest text-dim font-semibold mb-3">
          The 13F-tracker market
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="rounded-xl border border-border bg-panel/60 p-4 text-center">
            <div className="text-text font-semibold mb-0.5">Dataroma</div>
            <div className="text-xs text-dim">Free · manual · stale</div>
          </div>
          <div className="rounded-xl border border-border bg-panel/60 p-4 text-center">
            <div className="text-text font-semibold mb-0.5">Stock Analysis</div>
            <div className="text-xs text-dim">$24–40/mo · no 13F depth</div>
          </div>
          <div className="rounded-xl border border-border bg-panel/60 p-4 text-center">
            <div className="text-text font-semibold mb-0.5">GuruFocus</div>
            <div className="text-xs text-dim">$99–599/mo · legacy UI</div>
          </div>
          <div className="rounded-xl border-2 border-brand bg-brand/10 p-4 text-center">
            <div className="text-brand font-bold mb-0.5">HoldLens Pro</div>
            <div className="text-xs text-text">€9/mo · live · free core</div>
          </div>
        </div>
      </div>

      {/* Two-tier pricing grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {/* Free */}
        <div className="rounded-2xl border border-border bg-panel p-8">
          <div className="text-xs uppercase tracking-widest text-dim font-semibold mb-2">
            Free
          </div>
          <div className="text-4xl sm:text-5xl font-bold mb-1 tabular-nums">€0</div>
          <div className="text-sm text-muted mb-6">forever, no card</div>

          <a
            href="/this-week"
            className="block text-center bg-bg border border-border text-text font-semibold rounded-xl px-5 py-3 hover:border-brand transition mb-8"
          >
            Open HoldLens →
          </a>

          <ul className="space-y-3 text-sm">
            <Feature text={`${MANAGERS.length} of the best portfolio managers in the world tracked`} />
            <Feature text="Unified ConvictionScore on a single −100..+100 scale" />
            <Feature text="Signal dossier per ticker with BUY / SELL / NEUTRAL verdict" />
            <Feature text="Multi-quarter trend streaks (2Q, 3Q+, 4Q+)" />
            <Feature text="Live Yahoo Finance quotes, charts, news per ticker" />
            <Feature text="Manager leaderboard with realized 10y alpha vs S&P" />
            <Feature text="Personal portfolio + watchlist (localStorage, no signup)" />
            <Feature text="Screener, sector heatmap, activity feed, CSV export" />
            <Feature text="cmd+K search, RSS feeds (/buys.xml, /sells.xml)" />
            <Feature text="Manager-vs-manager compare pages (all 105 pairs)" />
          </ul>
        </div>

        {/* Pro */}
        <div className="rounded-2xl border border-brand bg-brand/5 p-8 relative">
          <div className="absolute -top-3 left-8 text-[10px] uppercase tracking-widest font-bold text-black bg-brand rounded-full px-3 py-1">
            Live now
          </div>
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
            Pro
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <div className="text-4xl sm:text-5xl font-bold tabular-nums">€9</div>
            <div className="text-sm text-muted">/month</div>
            <div className="text-sm text-muted line-through tabular-nums ml-2">€14</div>
          </div>
          <div className="text-sm text-muted mb-6">
            Founders rate · first 100 subscribers · cancel anytime
          </div>

          <div className="mb-6">
            <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
              Founders rate · 100 spots
            </div>
            <p className="text-xs text-muted mb-3">
              First 100 subscribers lock in <span className="text-text font-semibold">€9/mo for life</span>.
              Price steps up to €14/mo after the 100th spot. Cancel anytime.
            </p>
            <StripeCheckoutButton variant="founders" label="Subscribe — €9/mo founders rate →" />
            {/* Trust strip under CTA — standard conversion-lift pattern.
                Each marker removes a specific checkout objection. */}
            <ul className="mt-3 flex items-center justify-center gap-x-4 gap-y-1 flex-wrap text-[10.5px] text-dim">
              <li className="inline-flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-emerald-400" aria-hidden />
                Cancel anytime
              </li>
              <li className="inline-flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-emerald-400" aria-hidden />
                14-day refund
              </li>
              <li className="inline-flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-emerald-400" aria-hidden />
                Secure via Stripe
              </li>
              <li className="inline-flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-emerald-400" aria-hidden />
                EU VAT included
              </li>
            </ul>
            <p className="text-[11px] text-dim mt-3 text-center">
              or <a href="/alerts" className="underline hover:text-text transition">join the weekly digest</a> first
            </p>
          </div>

          <ul className="space-y-3 text-sm">
            <Feature text="Everything in Free, plus:" emphasis />
            <Feature text="Email alerts the moment any tracked manager files a 13F" />
            <Feature text="Custom watchlist alerts — email when YOUR holdings get a signal change" />
            <Feature text="Weekly digest — top 10 buys + top 10 sells delivered every Monday" />
            <Feature text="EDGAR automation — the full 80+ manager universe (not just 30)" />
            <Feature text="Per-ticker thesis generator — AI-drafted buy/sell rationale" />
            <Feature text="Historical score time series — see how a stock's signal evolved" />
            <Feature text="API access (1000 calls/mo) for embeds, bots, scripts" />
            <Feature text="Priority feature requests + direct line to the builder" />
            <Feature text="No ads, ever" />
          </ul>
          <p className="mt-6 text-[13px] text-dim text-center">
            Want the full feature rundown?{" "}
            <a
              href="/premium"
              className="text-brand hover:underline font-semibold"
            >
              See every Pro feature →
            </a>
          </p>
        </div>
      </div>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Pricing FAQ</h2>
        <div className="space-y-6">
          <FAQ
            q="Is the free tier really free forever?"
            a="Yes. The unified ConvictionScore is not a Pro upsell — it's the core product, free for everyone. That includes the recommendation model, multi-quarter trends, live prices, signal dossiers, activity feed, screener, compare pages, watchlist, portfolio, and the manager leaderboard with 10y realized alpha. Pro adds email alerts, EDGAR coverage expansion, custom watchlist triggers, thesis generation, and API access."
          />
          <FAQ
            q="What's the founders price?"
            a="The first 100 Pro subscribers lock in €9/mo for life — even when the standard price goes up. After the first 100 spots are gone, new subscribers pay €14/mo. Cancel anytime; your founders rate is kept as long as the subscription stays active."
          />
          <FAQ
            q="Is Pro actually live now?"
            a="Yes. Pro checkout runs through Stripe and activates the moment your payment goes through. Email alerts, EDGAR coverage expansion, custom watchlist triggers, and API access all ship incrementally; founders get every feature as it lands at no extra cost."
          />
          <FAQ
            q="Why €14/mo and not €9 or €29?"
            a="Below €10 it feels disposable, above €20 it requires justification. €14 is the sweet spot for an individual investor tool: about half a coffee per week. You'll save that on your first informed move. Founders pay €9/mo to reward early support."
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
