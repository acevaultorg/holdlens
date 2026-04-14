import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import { getAllMovesEnriched, QUARTERS, QUARTER_LABELS, type Quarter } from "@/lib/moves";
import { SECTOR_MAP } from "@/lib/tickers";
import { MANAGERS } from "@/lib/managers";

export const metadata: Metadata = {
  title: "Sector rotation heatmap — where smart money is moving by quarter",
  description:
    "Quarter-over-quarter sector rotation across 30 tracked superinvestors. See exactly which sectors the best portfolio managers are rotating into and out of, for every quarter back to Q1 2024.",
  alternates: { canonical: "https://holdlens.com/rotation" },
  openGraph: {
    title: "Sector rotation heatmap · HoldLens",
    description: "Where smart money is moving, one quarter at a time.",
  },
};

// Canonical sector order (industrial → defensive → growth).
const SECTOR_ORDER = [
  "Technology",
  "Communication",
  "Consumer Discretionary",
  "Consumer Staples",
  "Financials",
  "Healthcare",
  "Energy",
  "Industrials",
  "Materials",
  "Utilities",
  "Real Estate",
  "Other",
];

type CellKey = `${string}__${string}`;

export default function SectorRotationPage() {
  // Oldest → newest for the heatmap so the eye reads rotation left → right.
  const quarters: Quarter[] = [...QUARTERS].reverse();

  const moves = getAllMovesEnriched();

  // Net flow per (sector, quarter). Each move contributes:
  //   +1 * impactFactor for new/add
  //   −1 * impactFactor for trim/exit
  // Where impactFactor = max(0.5, min(3, portfolioImpactPct / 2)) — so a 20%
  // position move counts for 3× a 2% position move, but no single move dominates.
  const cellScore = new Map<CellKey, number>();
  const cellBuyCount = new Map<CellKey, number>();
  const cellSellCount = new Map<CellKey, number>();

  // Also track top tickers driving each cell for tooltip content.
  const cellTopTickers = new Map<CellKey, Map<string, number>>();

  for (const m of moves) {
    const sector = SECTOR_MAP[m.ticker] || "Other";
    const key: CellKey = `${sector}__${m.quarter}`;
    const impact = m.portfolioImpactPct ?? 2;
    const factor = Math.max(0.5, Math.min(3, impact / 2));
    const isBuy = m.action === "new" || m.action === "add";
    const isSell = m.action === "trim" || m.action === "exit";
    const signed = isBuy ? factor : isSell ? -factor : 0;
    cellScore.set(key, (cellScore.get(key) ?? 0) + signed);
    if (isBuy) cellBuyCount.set(key, (cellBuyCount.get(key) ?? 0) + 1);
    if (isSell) cellSellCount.set(key, (cellSellCount.get(key) ?? 0) + 1);

    if (!cellTopTickers.has(key)) cellTopTickers.set(key, new Map());
    const tm = cellTopTickers.get(key)!;
    tm.set(m.ticker, (tm.get(m.ticker) ?? 0) + (isBuy ? 1 : isSell ? -1 : 0));
  }

  // Find global max absolute value for color scaling
  let maxAbs = 0;
  for (const v of cellScore.values()) {
    if (Math.abs(v) > maxAbs) maxAbs = Math.abs(v);
  }
  if (maxAbs < 1) maxAbs = 1;

  // Per-sector total across all quarters — drives row sort in the sidebar ranking
  const sectorNet = new Map<string, number>();
  for (const s of SECTOR_ORDER) {
    let total = 0;
    for (const q of quarters) {
      total += cellScore.get(`${s}__${q}`) ?? 0;
    }
    sectorNet.set(s, total);
  }

  // Per-quarter hottest + coldest sectors (for the summary strip)
  type Hot = { quarter: Quarter; hot: string; hotScore: number; cold: string; coldScore: number };
  const hotCold: Hot[] = quarters.map((q) => {
    let hot = SECTOR_ORDER[0],
      hotScore = -Infinity,
      cold = SECTOR_ORDER[0],
      coldScore = Infinity;
    for (const s of SECTOR_ORDER) {
      const v = cellScore.get(`${s}__${q}`) ?? 0;
      if (v > hotScore) {
        hotScore = v;
        hot = s;
      }
      if (v < coldScore) {
        coldScore = v;
        cold = s;
      }
    }
    return { quarter: q, hot, hotScore, cold, coldScore };
  });

  // Sector leaderboard: biggest net buyer and seller across the whole window
  const sortedSectors = [...SECTOR_ORDER].sort(
    (a, b) => (sectorNet.get(b) ?? 0) - (sectorNet.get(a) ?? 0)
  );

  function cellStyle(score: number): React.CSSProperties {
    if (score === 0) return { backgroundColor: "rgba(255,255,255,0.02)" };
    const pct = Math.min(1, Math.abs(score) / maxAbs);
    // 5 tiers per side for accessibility
    const tier = pct >= 0.8 ? 0.82 : pct >= 0.55 ? 0.58 : pct >= 0.3 ? 0.36 : pct >= 0.1 ? 0.18 : 0.08;
    if (score > 0) {
      return { backgroundColor: `rgba(52,211,153,${tier})` }; // emerald
    }
    return { backgroundColor: `rgba(244,63,94,${tier})` }; // rose
  }

  function tierTextClass(score: number): string {
    const pct = Math.abs(score) / maxAbs;
    if (pct >= 0.55) return "text-black font-bold";
    return "text-text font-semibold";
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Sector rotation · quarter-over-quarter
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        Where smart money is <span className="text-brand">rotating</span>.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        Every tracked 13F move from the last 8 quarters, rolled up by sector and quarter. Green = net
        buying, red = net selling. Darker = larger net flow weighted by position size.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        Dataroma gives you one quarter of sector weights. HoldLens gives you 8 quarters of signed rotation
        flow — so you can see the <em>direction</em> of smart money, not just the current snapshot. Every
        cell is derived from {moves.length.toLocaleString()} moves across {MANAGERS.length} tracked superinvestors.
      </p>

      {/* Summary: biggest net buyer / net seller sector */}
      <div className="grid sm:grid-cols-2 gap-3 mb-10">
        <div className="rounded-xl border border-border bg-panel p-5">
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mb-2">
            Most bought sector (8Q total)
          </div>
          <div className="text-2xl font-bold text-emerald-400">{sortedSectors[0]}</div>
          <div className="text-xs text-muted mt-1 tabular-nums">
            Net flow: +{(sectorNet.get(sortedSectors[0]) ?? 0).toFixed(0)}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-panel p-5">
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mb-2">
            Most sold sector (8Q total)
          </div>
          <div className="text-2xl font-bold text-rose-400">
            {sortedSectors[sortedSectors.length - 1]}
          </div>
          <div className="text-xs text-muted mt-1 tabular-nums">
            Net flow: {(sectorNet.get(sortedSectors[sortedSectors.length - 1]) ?? 0).toFixed(0)}
          </div>
        </div>
      </div>

      <AdSlot format="horizontal" className="mb-10" />

      {/* Main heatmap */}
      <div className="rounded-2xl border border-border bg-panel overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="text-dim uppercase tracking-wider text-[10px]">
              <th className="text-left px-4 py-3 sticky left-0 bg-panel z-10">Sector</th>
              {quarters.map((q) => (
                <th
                  key={`hdr-${q}`}
                  className="px-2 py-3 text-center whitespace-nowrap font-normal"
                  style={{ minWidth: "4.2rem" }}
                >
                  {QUARTER_LABELS[q]}
                </th>
              ))}
              <th className="px-3 py-3 text-right font-normal">Net</th>
            </tr>
          </thead>
          <tbody>
            {SECTOR_ORDER.map((s) => {
              const rowNet = sectorNet.get(s) ?? 0;
              return (
                <tr key={`row-${s}`} className="border-t border-border/40">
                  <th className="text-left px-4 py-2 text-text font-semibold whitespace-nowrap sticky left-0 bg-panel z-10">
                    {s}
                  </th>
                  {quarters.map((q) => {
                    const key: CellKey = `${s}__${q}`;
                    const score = cellScore.get(key) ?? 0;
                    const buys = cellBuyCount.get(key) ?? 0;
                    const sells = cellSellCount.get(key) ?? 0;
                    const title = `${s} · ${QUARTER_LABELS[q]}: ${buys} buys / ${sells} sells (net ${score > 0 ? "+" : ""}${score.toFixed(1)})`;
                    return (
                      <td
                        key={`c-${key}`}
                        className={`px-2 py-2 text-center tabular-nums border border-border/30 ${tierTextClass(score)}`}
                        style={cellStyle(score)}
                        title={title}
                      >
                        {score === 0 ? "·" : score > 0 ? `+${Math.round(score)}` : `${Math.round(score)}`}
                      </td>
                    );
                  })}
                  <td
                    className={`px-3 py-2 text-right tabular-nums border-l border-border ${
                      rowNet > 0
                        ? "text-emerald-400 font-bold"
                        : rowNet < 0
                        ? "text-rose-400 font-bold"
                        : "text-muted"
                    }`}
                  >
                    {rowNet > 0 ? "+" : ""}
                    {Math.round(rowNet)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3 mt-4 text-[11px] text-dim flex-wrap">
        <span>Net flow:</span>
        <span className="inline-flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: "rgba(244,63,94,0.82)" }}
          />
          strong sell
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: "rgba(244,63,94,0.36)" }}
          />
          sell
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          />
          flat
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: "rgba(52,211,153,0.36)" }}
          />
          buy
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: "rgba(52,211,153,0.82)" }}
          />
          strong buy
        </span>
      </div>

      {/* Per-quarter hot/cold strip */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Hottest sector, quarter by quarter</h2>
        <p className="text-muted text-sm mb-6 max-w-2xl">
          For each quarter: the sector smart money rotated <em>into</em> hardest (green) and the sector they
          rotated <em>out of</em> hardest (red).
        </p>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-dim text-xs uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3">Quarter</th>
                <th className="text-left px-5 py-3">Hot (rotating in)</th>
                <th className="text-right px-5 py-3 hidden sm:table-cell">Net</th>
                <th className="text-left px-5 py-3">Cold (rotating out)</th>
                <th className="text-right px-5 py-3 hidden sm:table-cell">Net</th>
              </tr>
            </thead>
            <tbody>
              {hotCold
                .slice()
                .reverse()
                .map((hc) => (
                  <tr key={`hc-${hc.quarter}`} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-semibold text-text">{QUARTER_LABELS[hc.quarter]}</td>
                    <td className="px-5 py-3 text-emerald-400 font-semibold">{hc.hot}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-emerald-400 hidden sm:table-cell">
                      +{hc.hotScore.toFixed(0)}
                    </td>
                    <td className="px-5 py-3 text-rose-400 font-semibold">{hc.cold}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-rose-400 hidden sm:table-cell">
                      {hc.coldScore.toFixed(0)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-border bg-panel p-8">
        <h2 className="text-2xl font-bold mb-3">Why this beats Dataroma</h2>
        <ul className="text-muted space-y-2 text-sm">
          <li>
            <span className="text-brand font-semibold">Rotation, not snapshot.</span> Dataroma shows
            one quarter's sector breakdown. HoldLens shows 8 quarters side-by-side so you can see the{" "}
            <em>direction</em> smart money is moving, not just where they stand.
          </li>
          <li>
            <span className="text-brand font-semibold">Size-weighted flow.</span> Each move is weighted by
            the position's portfolio impact — a 20% bet counts for 3× a 2% nibble — so the heatmap reflects{" "}
            <em>conviction</em>, not just move count.
          </li>
          <li>
            <span className="text-brand font-semibold">Hover for the detail.</span> Every cell shows the
            exact buy count, sell count, and net score on hover.
          </li>
          <li>
            <span className="text-brand font-semibold">Free, forever.</span> Dataroma paywalls their
            sector views. HoldLens doesn't.
          </li>
        </ul>
      </section>

      <p className="text-xs text-dim mt-8 max-w-2xl">
        Heatmap is pure data derivation from SEC 13F filings. Cell color scaled to the global max absolute
        net flow across the full 8-quarter window. Sector classification via HoldLens's internal SECTOR_MAP;
        unclassified tickers roll into "Other". Not investment advice.
      </p>
    </div>
  );
}
