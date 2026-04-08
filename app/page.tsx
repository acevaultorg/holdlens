import EmailCapture from "@/components/EmailCapture";
import { BUFFETT_TOP } from "@/lib/holdings";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Hero */}
      <section className="pt-20 pb-16 text-center">
        <div className="inline-block text-xs font-semibold tracking-widest text-brand uppercase mb-6">
          Smart money, out loud
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
          See what the smartest<br />
          investors are <span className="text-brand">buying.</span>
        </h1>
        <p className="mt-6 text-lg text-muted max-w-2xl mx-auto">
          Track 82+ superinvestors — Buffett, Ackman, Icahn and more — with conviction scores,
          backtests, and move-alerts the moment 13F filings drop. Free.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/simulate/buffett"
            className="bg-brand text-black font-semibold rounded-xl px-6 py-4 hover:opacity-90 transition"
          >
            Try the Buffett backtest →
          </a>
          <a
            href="/investor/warren-buffett"
            className="border border-border bg-panel rounded-xl px-6 py-4 hover:border-brand transition"
          >
            See Buffett's latest portfolio
          </a>
        </div>
      </section>

      {/* Social proof / headline stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-y border-border">
        <Stat big="82" label="Superinvestors tracked" />
        <Stat big="$1.4T" label="Assets under watch" />
        <Stat big="25yr" label="Historical backtests" />
        <Stat big="Free" label="Forever core tier" />
      </section>

      {/* Why different */}
      <section className="py-20 grid md:grid-cols-3 gap-8">
        <Feature
          title="Conviction-scored"
          body="Not every position is a real bet. HoldLens filters rebalances from conviction, so you see what the pros actually care about."
        />
        <Feature
          title="Always current"
          body="SEC filings parsed within hours. Email alerts fire the moment Buffett, Ackman, or Icahn file a new 13F."
        />
        <Feature
          title="Backtest anything"
          body='Interactive simulators: "If you had copied Buffett starting in 2010, you&#39;d have…" — share-ready charts for every manager.'
        />
      </section>

      {/* Buffett preview */}
      <section className="py-16 border-t border-border">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
              Today's featured investor
            </div>
            <h2 className="text-3xl font-bold">Warren Buffett</h2>
            <p className="text-muted mt-1">Berkshire Hathaway · Top holdings</p>
          </div>
          <a href="/investor/warren-buffett" className="text-sm text-muted hover:text-text">
            View full portfolio →
          </a>
        </div>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-dim text-xs uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-5 py-4">Ticker</th>
                <th className="text-left px-5 py-4">Company</th>
                <th className="text-right px-5 py-4">% Portfolio</th>
              </tr>
            </thead>
            <tbody>
              {BUFFETT_TOP.slice(0, 6).map((h) => (
                <tr key={h.ticker} className="border-b border-border last:border-0 hover:bg-bg/50 transition">
                  <td className="px-5 py-4 font-mono font-semibold text-brand">{h.ticker}</td>
                  <td className="px-5 py-4 text-text">{h.name}</td>
                  <td className="px-5 py-4 text-right tabular-nums">{h.pctPortfolio.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Email capture */}
      <section className="py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Get alerts the moment they move.</h2>
        <p className="mt-4 text-muted max-w-xl mx-auto">
          One email per 13F filing. No spam, no advice, just the data. Unsubscribe anytime.
        </p>
        <div className="max-w-md mx-auto mt-8">
          <EmailCapture size="lg" />
        </div>
        <div className="text-xs text-dim mt-4">Free forever. ~3 emails per week during filing seasons.</div>
      </section>
    </div>
  );
}

function Stat({ big, label }: { big: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-text tabular-nums">{big}</div>
      <div className="text-xs uppercase tracking-wider text-dim mt-1">{label}</div>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted leading-relaxed">{body}</p>
    </div>
  );
}
