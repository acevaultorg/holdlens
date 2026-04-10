import type { Metadata } from "next";
import LiveQuote from "@/components/LiveQuote";
import { getGrandPortfolio } from "@/lib/signals";
import { MANAGERS } from "@/lib/managers";

export const metadata: Metadata = {
  title: "Grand Portfolio — consensus holdings weighted by manager quality",
  description:
    "The consensus portfolio of the best portfolio managers in the world. Not just who owns what — weighted by manager track record so signal beats noise.",
  openGraph: { title: "Grand Portfolio — HoldLens" },
};

export default function GrandPortfolioPage() {
  const grand = getGrandPortfolio().slice(0, 50);
  const maxScore = Math.max(1, ...grand.map((g) => g.weightedScore));

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Grand Portfolio · Quality-Weighted
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        The <span className="text-brand">consensus portfolio</span>.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        If you pooled the portfolios of the {MANAGERS.length} best portfolio managers in the world — and weighted
        by their track record, not their AUM — this is what you'd own.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        Weight = sum of (position% × manager quality score) across every tracked manager holding the stock.
        Stocks held by Tier-1 managers count for more.
      </p>

      <div className="rounded-2xl border border-border bg-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-dim text-xs uppercase tracking-wider">
            <tr className="border-b border-border">
              <th className="text-left px-5 py-4 w-12">#</th>
              <th className="text-left px-5 py-4">Ticker</th>
              <th className="text-left px-5 py-4 hidden md:table-cell">Sector</th>
              <th className="text-right px-5 py-4 hidden md:table-cell">Price · Today</th>
              <th className="text-right px-5 py-4">Owners</th>
              <th className="text-right px-5 py-4">Weight</th>
            </tr>
          </thead>
          <tbody>
            {grand.map((g, i) => {
              const barPct = (g.weightedScore / maxScore) * 100;
              return (
                <tr key={g.ticker} className="border-b border-border last:border-0 hover:bg-bg/40 transition">
                  <td className="px-5 py-3 text-dim tabular-nums">{i + 1}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="min-w-0">
                        <a href={`/ticker/${g.ticker}`} className="font-mono font-bold text-brand hover:underline">
                          {g.ticker}
                        </a>
                        <div className="text-xs text-muted truncate max-w-xs">{g.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-dim hidden md:table-cell">{g.sector}</td>
                  <td className="px-5 py-3 text-right hidden md:table-cell">
                    <LiveQuote symbol={g.ticker} size="sm" refreshMs={0} />
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums font-semibold">{g.ownerCount}</td>
                  <td className="px-5 py-3 text-right w-40">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1.5 w-24 rounded-full bg-bg overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-brand"
                          style={{ width: `${Math.max(4, barPct)}%` }}
                        />
                      </div>
                      <span className="tabular-nums text-muted text-xs w-12 text-right">
                        {g.weightedScore.toFixed(0)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-dim mt-8">
        Weighted by manager-quality score so that signal beats noise. A Buffett or Druckenmiller stake counts for more
        than one from a less-proven manager. See <a href="/methodology" className="underline">methodology</a>.
      </p>
    </div>
  );
}
