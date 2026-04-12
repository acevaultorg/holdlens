import EmailCapture from "@/components/EmailCapture";
import BuySellSignals from "@/components/BuySellSignals";
import LiveStats from "@/components/LiveStats";
import { MANAGERS } from "@/lib/managers";
import { topTickers, TICKER_INDEX } from "@/lib/tickers";
import { getAllConvictionScores } from "@/lib/conviction";

export default function HomePage() {
  const featuredManagers = MANAGERS.slice(0, 6);
  const top = topTickers(6);
  const allScores = getAllConvictionScores();
  const buySignals = allScores.filter((s) => s.score > 0).length;
  const sellSignals = allScores.filter((s) => s.score < 0).length;
  const tickerCount = Object.keys(TICKER_INDEX).length;

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Hero */}
      <section className="pt-20 pb-12 text-center">
        <div className="inline-block text-xs font-semibold tracking-widest text-brand uppercase mb-6">
          Learn from the best portfolio managers in the world
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
          What to <span className="text-emerald-400">buy.</span><br />
          What to <span className="text-rose-400">sell.</span>
        </h1>
        <p className="mt-6 text-lg text-muted max-w-2xl mx-auto">
          Every move from {MANAGERS.length} of the world's best portfolio managers — Buffett, Ackman,
          Druckenmiller, Klarman, TCI, Tiger — scored on a single signed scale where{" "}
          <span className="text-emerald-400 font-semibold">+100 is the strongest possible buy</span> and{" "}
          <span className="text-rose-400 font-semibold">−100 the strongest possible sell</span>. Live prices. Free.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/buys"
            className="bg-emerald-400 text-black font-semibold rounded-xl px-6 py-4 hover:opacity-90 transition"
          >
            See what to buy →
          </a>
          <a
            href="/sells"
            className="border border-rose-400/40 bg-panel text-rose-400 rounded-xl px-6 py-4 hover:bg-rose-400/5 transition"
          >
            See what to sell →
          </a>
        </div>
      </section>

      {/* Buy/Sell signal card — the headline feature */}
      <section className="py-10 border-y border-border">
        <BuySellSignals />
      </section>

      {/* Live stats — computed client-side */}
      <LiveStats />

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
              The best, out loud
            </div>
            <h2 className="text-3xl font-bold">The portfolio managers we watch</h2>
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

      {/* Activity CTA */}
      <section className="py-12 border-t border-border">
        <div className="rounded-2xl border border-border bg-panel p-8 md:p-10 text-center">
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
            Every buy, every sell, every quarter
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            The full activity feed.
          </h2>
          <p className="text-muted max-w-xl mx-auto mb-6">
            Every tracked 13F move in chronological order, grouped by quarter. The fastest way to see what just changed.
          </p>
          <a
            href="/activity"
            className="inline-block bg-brand text-black font-semibold rounded-xl px-6 py-3 hover:opacity-90 transition"
          >
            Open activity feed →
          </a>
        </div>
      </section>

      {/* Why different */}
      <section className="py-16 border-t border-border grid md:grid-cols-3 gap-8">
        <Feature title="One signed score" body="Every stock gets one number on a −100..+100 scale. A ticker shows up on exactly one list — never both sides at once. The META problem is solved." />
        <Feature title="Always current" body="SEC filings parsed within hours. Email alerts fire the moment Buffett, Ackman, or Icahn file a new 13F." />
        <Feature title="Backtest anything" body="Interactive simulators: 'If you had copied Buffett starting in 2010, you'd have…' — share-ready charts for every manager." />
      </section>

      {/* Social proof — real numbers */}
      <section className="py-16 border-t border-border">
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
            By the numbers
          </div>
          <h2 className="text-3xl font-bold">Built on real SEC filings, not vibes</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value={MANAGERS.length} label="Portfolio managers tracked" />
          <StatCard value={tickerCount} label="Stocks scored" />
          <StatCard value={buySignals} label="Active buy signals" />
          <StatCard value={sellSignals} label="Active sell signals" />
        </div>
        <p className="text-xs text-dim text-center mt-6">
          Every number is derived from SEC 13F filings. No paid placements. No sponsored signals.
        </p>
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

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted leading-relaxed">{body}</p>
    </div>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-panel p-6 text-center">
      <div className="text-4xl md:text-5xl font-bold text-brand tabular-nums">{value}</div>
      <div className="text-sm text-muted mt-2">{label}</div>
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
