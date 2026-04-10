import type { Metadata } from "next";
import EmailCapture from "@/components/EmailCapture";
import { MANAGERS } from "@/lib/managers";
import { QUARTER_FILED, LATEST_QUARTER } from "@/lib/moves";
import { nextFilingDeadline } from "@/lib/filings";

export const metadata: Metadata = {
  title: "Alerts — be first to know what the smart money is buying",
  description: `Email alerts the moment any of ${MANAGERS.length} of the best portfolio managers in the world files a 13F. Buy/sell signals delivered to your inbox.`,
  openGraph: {
    title: "HoldLens Alerts",
    description: "Email alerts on every 13F filing.",
  },
};

export default function AlertsPage() {
  const lastFiling = QUARTER_FILED[LATEST_QUARTER];
  const next = nextFilingDeadline();
  const nextDeadline = `${next.quarter} (filing by ${next.date})`;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Alerts
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          Be first to know.
        </h1>
        <p className="text-muted text-lg max-w-xl mx-auto">
          One email when any of {MANAGERS.length} tracked managers files a new 13F. Top buy
          and sell signals delivered the same day. Free forever.
        </p>
      </div>

      {/* Email signup card */}
      <div className="rounded-2xl border border-brand/40 bg-brand/5 p-8 md:p-10 mb-12">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2 text-center">
          Free signal alerts
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
          Get the next 13F drop in your inbox.
        </h2>
        <p className="text-muted text-sm text-center mb-6 max-w-md mx-auto">
          Next filing deadline: <span className="text-text font-semibold">{nextDeadline}</span>.
          Last filing was {new Date(lastFiling).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.
        </p>
        <div className="max-w-md mx-auto">
          <EmailCapture size="lg" />
        </div>
        <p className="text-xs text-dim text-center mt-4">
          ~3 emails per week during filing seasons. No spam. Unsubscribe anytime.
        </p>
      </div>

      {/* What you'll get */}
      <section className="grid md:grid-cols-3 gap-4 mb-12">
        <Feature
          icon={<BellIcon />}
          title="Real-time fires"
          body="Email within hours of each tracked manager filing a new 13F. Never miss a move."
        />
        <Feature
          icon={<TargetIcon />}
          title="Top signals"
          body="Top 10 buy + top 10 sell signals from the recommendation model, delivered each filing day."
        />
        <Feature
          icon={<TrendingUpIcon />}
          title="Multi-quarter trends"
          body="Highlights when a manager hits a 3+ consecutive-quarter conviction streak — the strongest signals."
        />
      </section>

      {/* Pro upsell */}
      <div className="rounded-2xl border border-border bg-panel p-8">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          Want more?
        </div>
        <h3 className="text-xl font-bold mb-3">Pro tier — custom watchlist alerts + API</h3>
        <p className="text-muted text-sm mb-5 max-w-xl">
          For $14/mo, Pro adds custom-watchlist email triggers (alert me only when X manager moves on
          MY tickers), the Conviction Score v2, Manager Alpha Attribution, and API access.
        </p>
        <a
          href="/pricing"
          className="inline-block bg-brand text-black font-semibold rounded-xl px-5 py-3 hover:opacity-90 transition"
        >
          See Pro pricing →
        </a>
      </div>

      <p className="text-xs text-dim mt-16 text-center">
        Alert delivery powered by Resend, launching with Pro in Q2 2026. Your email is stored privately on this
        device until then; it's never sold or shared.
      </p>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-panel p-5">
      <div className="text-brand mb-3">{icon}</div>
      <div className="font-bold text-text mb-1">{title}</div>
      <div className="text-xs text-muted leading-relaxed">{body}</div>
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
function TargetIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function TrendingUpIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
