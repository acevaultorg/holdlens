import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import LiveQuote from "@/components/LiveQuote";
import SinceFilingDelta from "@/components/SinceFilingDelta";
import SectorHeatmap from "@/components/SectorHeatmap";
import TrendBadge from "@/components/TrendBadge";
import TickerLogo from "@/components/TickerLogo";
import { topTickers } from "@/lib/tickers";
import { LATEST_QUARTER, QUARTER_FILED } from "@/lib/moves";

export const metadata: Metadata = {
  title: "Top hedge fund stock picks 2026 — most-owned by superinvestors",
  description: "The 25 most-owned stocks across 10 tracked superinvestors. Updated quarterly. Free.",
  twitter: { card: "summary_large_image", title: "Top hedge fund stock picks 2026" },
  openGraph: { title: "Top hedge fund stock picks 2026" },
};

export default function TopPicksPage() {
  const top = topTickers(25);
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Top picks · 2026</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Top hedge fund<br />stock picks
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-8">
        The 25 most-owned stocks across {top.length > 0 ? "10" : "0"} tracked superinvestors. Ranked by owner count + total conviction.
      </p>

      {/* Sector heatmap */}
      <div className="mb-8">
        <SectorHeatmap
          tickers={top.map((t) => ({
            symbol: t.symbol,
            name: t.name,
            sector: t.sector,
            ownerCount: t.ownerCount,
          }))}
          title="Day-change heatmap"
          subtitle="Click any cell to jump to the ticker page"
        />
      </div>

      <div className="rounded-2xl border border-border bg-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-dim text-xs uppercase tracking-wider">
            <tr className="border-b border-border">
              <th className="text-left px-5 py-4 w-12">#</th>
              <th className="text-left px-5 py-4">Ticker</th>
              <th className="text-left px-5 py-4">Company</th>
              <th className="text-left px-5 py-4 hidden md:table-cell">Sector</th>
              <th className="text-right px-5 py-4 hidden md:table-cell">Price · Today</th>
              <th className="text-right px-5 py-4">Owners</th>
              <th className="text-right px-5 py-4">Σ %</th>
            </tr>
          </thead>
          <tbody>
            {top.map((t, i) => (
              <tr key={t.symbol} className="border-b border-border last:border-0 hover:bg-bg/50 transition">
                <td className="px-5 py-3 text-dim tabular-nums">{i + 1}</td>
                <td className="px-5 py-3 font-mono font-semibold">
                  <a href={`/signal/${t.symbol}`} className="inline-flex items-center gap-2 text-brand hover:underline">
                    <TickerLogo symbol={t.symbol} size={22} />
                    {t.symbol}
                  </a>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-text">{t.name}</span>
                    <TrendBadge ticker={t.symbol} />
                  </div>
                </td>
                <td className="px-5 py-3 text-dim hidden md:table-cell">{t.sector}</td>
                <td className="px-5 py-3 text-right hidden md:table-cell whitespace-nowrap">
                  <LiveQuote symbol={t.symbol} size="sm" refreshMs={0} />
                  <div className="text-[10px] mt-0.5">
                    <SinceFilingDelta
                      ticker={t.symbol}
                      filedAt={QUARTER_FILED[LATEST_QUARTER]}
                      compact
                    />
                  </div>
                </td>
                <td className="px-5 py-3 text-right tabular-nums font-semibold">{t.ownerCount}</td>
                <td className="px-5 py-3 text-right tabular-nums text-muted">{t.totalConviction.toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdSlot format="horizontal" />

      <p className="text-xs text-dim mt-12">
        Ranking based on ownership across tracked superinvestors. Updated each quarter after 13F filings.
        Not investment advice. <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
