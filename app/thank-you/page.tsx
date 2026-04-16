import type { Metadata } from "next";
import ProActivator from "@/components/ProActivator";
import PurchaseTracker from "@/components/PurchaseTracker";

export const metadata: Metadata = {
  title: "Thanks — welcome to HoldLens Pro",
  description: "Your HoldLens Pro subscription is active.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      {/* Flip the Pro flag in localStorage the instant the user lands here.
          Every mounted AdSlot listens for the activation event and unmounts. */}
      <ProActivator />
      {/* GA4 purchase conversion event — fires once per session, deduped via sessionStorage */}
      <PurchaseTracker />
      <div className="text-6xl mb-6">🎯</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Welcome to HoldLens Pro.
      </h1>
      <p className="text-muted text-lg mb-10">
        You&apos;re locked in at the founders rate for life. Email alerts on the next 13F filing.
        Custom watchlist triggers, weekly digest, API access, no ads ever.
      </p>

      <div className="rounded-2xl border border-brand/40 bg-brand/5 p-8 text-left mb-10">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Next steps
        </div>
        <ol className="space-y-3 text-sm text-text">
          <li className="flex gap-3">
            <span className="text-brand font-bold">1.</span>
            <span>
              Check your email for a receipt + welcome message. Add{" "}
              <span className="font-mono text-brand">noreply@holdlens.com</span> to your contacts so
              alerts don't go to spam.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-brand font-bold">2.</span>
            <span>
              Bookmark <a href="/this-week" className="text-brand hover:underline">/this-week</a> — the
              one page Pro members check first.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-brand font-bold">3.</span>
            <span>
              Star tickers you want personal alerts on. Pro will fire an email when any tracked
              manager moves on a starred ticker.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-brand font-bold">4.</span>
            <span>
              Reply to the welcome email with feature requests — Pro members shape the roadmap.
            </span>
          </li>
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="/this-week"
          className="bg-brand text-black font-semibold rounded-xl px-6 py-4 hover:opacity-90 transition"
        >
          Open This Week →
        </a>
        <a
          href="/buys"
          className="border border-border bg-panel rounded-xl px-6 py-4 hover:border-brand transition"
        >
          Top buy signals
        </a>
      </div>

      <p className="text-xs text-dim mt-12">
        Subscription managed via Stripe. Cancel anytime in your customer portal — link in your
        receipt email. No questions asked.
      </p>
    </div>
  );
}
