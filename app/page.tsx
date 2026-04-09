import EmailCapture from "@/components/EmailCapture";
import { MANAGERS } from "@/lib/managers";
import { topTickers } from "@/lib/tickers";

export default function HomePage() {
  const featuredManagers = MANAGERS.slice(0, 6);
  const top = topTickers(6);

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
          Track 10 tracked superinvestors — Buffett, Ackman, Icahn, Burry and more — with conviction scores,
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
            href="/top-picks"
            className="border border-border bg-panel rounded-xl px-6 py-4 hover:border-brand transition"
          >
            See top picks
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-y border-border">
        <Stat big="10" label="Superinvestors tracked" />
        <Stat big="$1.4T" label="Assets under watch" />
        <Stat big="3" label="Interactive backtests" />
        <Stat big="Free" label="Forever core tier" />
      </section>

      {/* Backtest gallery — the viral wedge front and center */}
      <section className="py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
              The viral wedge
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">What if you'd copied them?</h2>
            <p className="text-muted mt-2">Interactive backtests. Drag a year, drop in a dollar amount.</p>
          </div>
          <a href="/simulate" className="text-sm text-muted hover:text-text">All backtests →</a>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <BacktestCard slug="buffett" name="Warren Buffett" fund="Berkshire Hathaway" desc="1999-2025 · Compounding legend" />
          <BacktestCard slug="ackman" name="Bill Ackman" fund="Pershing Square" desc="2014-2025 · Activist concentrated" />
          <BacktestCard slug="druckenmiller" name="Druckenmiller" fund="Duquesne Family Office" desc="2010-2025 · No losing years" />
        </div>
      </section>

      {/* Top picks preview */}
      <section className="py-16 border-t border-border">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
              Consensus picks
            </div>
            <h2 className="text-3xl font-bold">Most-owned stocks</h2>
            <p className="text-muted mt-1">Ranked by how many superinvestors hold them.</p>
          </div>
          <a href="/top-picks" className="text-sm text-muted hover:text-text">See all →</a>
        </div>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-dim text-xs uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-5 py-4 w-12">#</th>
                <th className="text-left px-5 py-4">Ticker</th>
                <th className="text-left px-5 py-4">Company</th>
                <th className="text-right px-5 py-4">Owners</th>
              </tr>
            </thead>
            <tbody>
              {top.map((t, i) => (
                <tr key={t.symbol} className="border-b border-border last:border-0 hover:bg-bg/50 transition">
                  <td className="px-5 py-3 text-dim tabular-nums">{i + 1}</td>
                  <td className="px-5 py-3 font-mono font-semibold">
                    <a href={`/ticker/${t.symbol}`} className="text-brand hover:underline">{t.symbol}</a>
                  </td>
                  <td className="px-5 py-3 text-text">{t.name}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{t.ownerCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Manager grid */}
      <section className="py-16 border-t border-border">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
              Tracked investors
            </div>
            <h2 className="text-3xl font-bold">The superinvestors we watch</h2>
          </div>
          <a href="/investor" className="text-sm text-muted hover:text-text">All {MANAGERS.length} →</a>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {featuredManagers.map((m) => (
            <a key={m.slug} href={`/investor/${m.slug}`}
               className="rounded-xl border border-border bg-panel p-4 hover:border-brand transition group">
              <div className="font-semibold group-hover:text-brand transition">{m.name}</div>
              <div className="text-xs text-muted mt-1">{m.fund}</div>
              <div className="text-xs text-dim mt-2">Top: <span className="font-mono text-brand">{m.topHoldings[0]?.ticker}</span> ({m.topHoldings[0]?.pct.toFixed(1)}%)</div>
            </a>
          ))}
        </div>
      </section>

      {/* Why different */}
      <section className="py-16 border-t border-border grid md:grid-cols-3 gap-8">
        <Feature title="Conviction-scored" body="Not every position is a real bet. HoldLens filters rebalances from conviction, so you see what the pros actually care about." />
        <Feature title="Always current" body="SEC filings parsed within hours. Email alerts fire the moment Buffett, Ackman, or Icahn file a new 13F." />
        <Feature title="Backtest anything" body="Interactive simulators: 'If you had copied Buffett starting in 2010, you'd have…' — share-ready charts for every manager." />
      </section>

      {/* Email capture */}
      <section className="py-20 border-t border-border text-center">
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

function BacktestCard({ slug, name, fund, desc }: { slug: string; name: string; fund: string; desc: string }) {
  return (
    <a href={`/simulate/${slug}`}
       className="rounded-2xl border border-border bg-panel p-6 hover:border-brand transition group">
      <div className="text-xs text-dim uppercase tracking-wider">Backtest</div>
      <div className="text-xl font-bold mt-2 group-hover:text-brand transition">{name}</div>
      <div className="text-sm text-muted mt-1">{fund}</div>
      <div className="text-xs text-dim mt-3">{desc}</div>
      <div className="text-brand text-sm mt-4">Run →</div>
    </a>
  );
}
