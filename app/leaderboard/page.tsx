import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import LeaderboardTable from "./LeaderboardTable";
import { getAllManagerROI, SP500_CAGR_10Y } from "@/lib/manager-roi";
import { MANAGERS } from "@/lib/managers";

export const metadata: Metadata = {
  title: "Leaderboard — best portfolio managers ranked by 10-year ROI",
  description: `Real ROI rankings for ${MANAGERS.length} of the best portfolio managers in the world. 10-year CAGR, alpha vs S&P 500, win rate, max drawdown. Sortable.`,
  openGraph: {
    title: "HoldLens Leaderboard — Manager ROI Rankings",
    description: "Real returns, real alpha, real ranking. Click any column to sort.",
  },
};

export default function LeaderboardPage() {
  const allROI = getAllManagerROI()
    .map((roi) => {
      const mgr = MANAGERS.find((m) => m.slug === roi.slug);
      return { ...roi, name: mgr?.name || roi.slug, fund: mgr?.fund || "" };
    })
    .filter((r) => r.cagr10y > 0); // skip managers with no data

  // Default sort: alpha (the truest skill metric) — for the podium only
  const ranked = [...allROI].sort((a, b) => b.alpha10y - a.alpha10y);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Leaderboard · Manager ROI
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Who actually beats the market?
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        10-year track record for {ranked.length} of the best portfolio managers in the world.
        Ranked by <span className="text-brand font-semibold">alpha</span> — how much they beat the
        S&P 500 per year, after fees.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        S&P 500 10-year CAGR (benchmark): <span className="text-text font-semibold tabular-nums">{SP500_CAGR_10Y}%</span>.
        Anything above that is positive alpha — the manager's skill, not the market's tide.
      </p>

      {/* Hero card — top 3 */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {ranked.slice(0, 3).map((r, i) => (
          <PodiumCard key={r.slug} rank={i + 1} roi={r} />
        ))}
      </div>

      {/* Sortable leaderboard table */}
      <div className="mb-4 text-xs text-dim">
        <span className="text-text">Click any column header to sort.</span> Default: alpha (highest first).
      </div>
      <div className="mb-12">
        <LeaderboardTable rows={ranked.map((r) => ({
          slug: r.slug,
          name: r.name,
          fund: r.fund,
          cagr10y: r.cagr10y,
          alpha10y: r.alpha10y,
          winRate: r.winRate,
          cumulative10y: r.cumulative10y,
          worstYear: r.worstYear,
          quality0to10: r.quality0to10,
        }))} />
      </div>

      <AdSlot format="horizontal" />

      {/* Methodology */}
      <section className="rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          How we rank
        </div>
        <h2 className="text-xl font-bold mb-3">Quality score formula</h2>
        <p className="text-sm text-muted leading-relaxed mb-4">
          Each manager's quality score is computed from real 10-year returns, not reputation.
          Replaces the hand-curated tier system used in earlier HoldLens versions.
        </p>
        <div className="rounded-lg bg-bg/40 border border-border p-4 mb-4 font-mono text-xs text-text">
          quality = 5
          <br />
          &nbsp;&nbsp;+ alpha10y × 0.20 <span className="text-dim">{`// each 1% of alpha = +0.2`}</span>
          <br />
          &nbsp;&nbsp;+ (winRate − 0.5) × 6 <span className="text-dim">{`// 80% win rate = +1.8`}</span>
          <br />
          &nbsp;&nbsp;+ cagr10y × 0.05 <span className="text-dim">{`// each 1% CAGR = +0.05`}</span>
          <br />
          &nbsp;&nbsp;− drawdown penalty <span className="text-dim">{`// each 10% beyond -20% = -0.5`}</span>
          <br />
          &nbsp;&nbsp;+ uncorrelated bonus <span className="text-dim">{`// macro / distressed = +0.3`}</span>
          <br />
          &nbsp;&nbsp;clamped 0 to 10
        </div>
        <p className="text-xs text-dim leading-relaxed">
          Annual returns are sourced from public fund reports (Berkshire, Pershing Square, Akre, Fundsmith,
          Polen, Oakmark, Wedgewood, Scottish Mortgage Trust, Greenlight) and reasonable estimates from
          press coverage for private funds (Druckenmiller, Tepper, TCI, Tiger Global, Viking, Lone Pine,
          Maverick, Egerton, Cantillon, Valley Forge, Himalaya, Baupost, Scion, Pabrai, Gotham,
          Brave Warrior, Giverny, ValueAct, Appaloosa, Fairfax). Used by the recommendation model to weight
          each manager's buy/sell signal — a Buffett or Druckenmiller move counts more than one from a
          less-proven manager. Not investment advice.
        </p>
      </section>
    </div>
  );
}

function PodiumCard({ rank, roi }: { rank: number; roi: ReturnType<typeof getAllManagerROI>[number] & { name: string; fund: string } }) {
  const medalColor =
    rank === 1
      ? "border-brand bg-brand/10 text-brand"
      : rank === 2
      ? "border-emerald-400/40 bg-emerald-400/5 text-emerald-400"
      : "border-border bg-panel text-muted";
  return (
    <a href={`/investor/${roi.slug}`} className={`block rounded-2xl border p-6 hover:opacity-90 transition ${medalColor}`}>
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">
          Rank #{rank}
        </div>
        <div className="text-xs font-mono opacity-80">Q{roi.quality0to10}/10</div>
      </div>
      <div className="font-bold text-text text-lg leading-tight">{roi.name}</div>
      <div className="text-xs text-muted mb-4 truncate">{roi.fund}</div>
      <div className="flex items-baseline gap-3">
        <div>
          <div className="text-3xl font-bold tabular-nums">+{roi.alpha10y.toFixed(1)}%</div>
          <div className="text-[10px] uppercase tracking-wider opacity-70">10y alpha</div>
        </div>
        <div className="text-right ml-auto">
          <div className="text-sm font-semibold tabular-nums text-text">{roi.cagr10y.toFixed(1)}%</div>
          <div className="text-[10px] uppercase tracking-wider opacity-70">CAGR</div>
        </div>
      </div>
    </a>
  );
}

