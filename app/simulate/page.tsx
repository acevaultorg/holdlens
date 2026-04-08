import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backtests — What if you'd copied a superinvestor?",
  description: "Interactive backtests for Buffett, Ackman, Druckenmiller and more. See your money grow vs the S&P 500.",
};

const BACKTESTS = [
  { slug: "buffett", name: "Warren Buffett", fund: "Berkshire Hathaway", years: "1999-2025", desc: "The Oracle of Omaha. Compound interest's loudest fan." },
  { slug: "ackman", name: "Bill Ackman", fund: "Pershing Square", years: "2014-2025", desc: "Concentrated, activist, sometimes brilliant, sometimes humbling." },
  { slug: "druckenmiller", name: "Stanley Druckenmiller", fund: "Duquesne Family Office", years: "2010-2025", desc: "30+ years without a losing year." },
];

export default function BacktestIndex() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Backtests</div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">What if you'd copied them?</h1>
      <p className="text-muted text-lg max-w-2xl mb-12">
        Interactive backtests of the world's best investors. Drag a year, drop in a dollar amount, see what would have happened.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        {BACKTESTS.map((b) => (
          <a key={b.slug} href={`/simulate/${b.slug}`}
             className="rounded-2xl border border-border bg-panel p-6 hover:border-brand transition group">
            <div className="text-xs text-dim uppercase tracking-wider">{b.years}</div>
            <div className="text-xl font-bold mt-2 group-hover:text-brand transition">{b.name}</div>
            <div className="text-sm text-muted mt-1">{b.fund}</div>
            <p className="text-sm text-dim mt-3">{b.desc}</p>
            <div className="text-brand text-sm mt-4">Run backtest →</div>
          </a>
        ))}
      </div>
    </div>
  );
}
