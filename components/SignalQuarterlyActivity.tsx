import { ALL_MOVES, QUARTERS, QUARTER_LABELS, type Quarter } from "@/lib/moves";
import { MANAGERS } from "@/lib/managers";

// 8-quarter buy/sell activity sparkline for /signal/[ticker].
//
// For every quarter (oldest → newest), counts:
//   buyers  = distinct managers with a "new" or "add" move on this ticker
//   sellers = distinct managers with a "trim" or "exit" move on this ticker
//
// Renders an inline mini bar chart: buyers stacked above the zero line in
// emerald, sellers stacked below in rose. Quarter label underneath each bar.
// Server component, computed at build time from ALL_MOVES + MANAGERS.
//
// Module-level cache keyed by ticker so all 94 signal pages share one
// computation pass during static export.

type QuarterCell = {
  quarter: Quarter;
  buyers: { slug: string; name: string; action: "new" | "add" }[];
  sellers: { slug: string; name: string; action: "trim" | "exit" }[];
};

let _cache: Map<string, QuarterCell[]> | null = null;

function buildCache(): Map<string, QuarterCell[]> {
  const managerName = new Map(MANAGERS.map((m) => [m.slug, m.name]));
  const out = new Map<string, QuarterCell[]>();

  // Initialize empty cells for every (ticker, quarter) pair seen in moves.
  for (const move of ALL_MOVES) {
    const ticker = move.ticker.toUpperCase();
    if (!out.has(ticker)) {
      // Render chronologically oldest → newest so the sparkline reads left-to-right
      // like a timeline. QUARTERS is ordered newest → oldest, so reverse a copy.
      const cells: QuarterCell[] = [...QUARTERS]
        .slice()
        .reverse()
        .map((q) => ({ quarter: q, buyers: [], sellers: [] }));
      out.set(ticker, cells);
    }
  }

  for (const move of ALL_MOVES) {
    const ticker = move.ticker.toUpperCase();
    const cells = out.get(ticker)!;
    const cell = cells.find((c) => c.quarter === move.quarter);
    if (!cell) continue;
    const name = managerName.get(move.managerSlug) ?? move.managerSlug;
    if (move.action === "new" || move.action === "add") {
      // Dedupe within quarter (manager could in theory have two rows)
      if (!cell.buyers.some((b) => b.slug === move.managerSlug)) {
        cell.buyers.push({ slug: move.managerSlug, name, action: move.action });
      }
    } else if (move.action === "trim" || move.action === "exit") {
      if (!cell.sellers.some((s) => s.slug === move.managerSlug)) {
        cell.sellers.push({ slug: move.managerSlug, name, action: move.action });
      }
    }
  }

  return out;
}

function getCells(ticker: string): QuarterCell[] | null {
  if (!_cache) _cache = buildCache();
  return _cache.get(ticker.toUpperCase()) ?? null;
}

type Props = { symbol: string };

export default function SignalQuarterlyActivity({ symbol }: Props) {
  const cells = getCells(symbol);
  if (!cells || cells.length === 0) return null;

  const maxBuyers = Math.max(1, ...cells.map((c) => c.buyers.length));
  const maxSellers = Math.max(1, ...cells.map((c) => c.sellers.length));
  const maxSide = Math.max(maxBuyers, maxSellers);

  const totalBuyers = cells.reduce((sum, c) => sum + c.buyers.length, 0);
  const totalSellers = cells.reduce((sum, c) => sum + c.sellers.length, 0);
  const netDir =
    totalBuyers > totalSellers
      ? "net-buy"
      : totalSellers > totalBuyers
      ? "net-sell"
      : "split";

  // Bar geometry in pixels — keeps the SVG/box compact and consistent with
  // the rest of the dossier where mini-vizes are ~120px tall.
  const BAR_MAX_PX = 56;

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h3 className="text-base font-bold text-white">8-quarter activity</h3>
          <p className="text-xs text-muted mt-0.5">
            Distinct managers buying or selling {symbol} each quarter — last 2 years.
          </p>
        </div>
        <div className="text-xs tabular-nums text-muted whitespace-nowrap">
          <span className="text-emerald-400 font-semibold">{totalBuyers}</span> buy moves
          <span className="mx-1.5 opacity-50">·</span>
          <span className="text-rose-400 font-semibold">{totalSellers}</span> sell moves
          <span className="mx-1.5 opacity-50">·</span>
          {netDir === "net-buy" ? (
            <span className="text-emerald-400 font-semibold">net buying</span>
          ) : netDir === "net-sell" ? (
            <span className="text-rose-400 font-semibold">net selling</span>
          ) : (
            <span className="text-muted font-semibold">split</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-8 gap-2">
        {cells.map((c) => {
          const buyHeight = (c.buyers.length / maxSide) * BAR_MAX_PX;
          const sellHeight = (c.sellers.length / maxSide) * BAR_MAX_PX;
          const tooltip = [
            `${QUARTER_LABELS[c.quarter]}`,
            c.buyers.length > 0 ? `Buyers (${c.buyers.length}): ${c.buyers.map((b) => b.name).join(", ")}` : null,
            c.sellers.length > 0 ? `Sellers (${c.sellers.length}): ${c.sellers.map((s) => s.name).join(", ")}` : null,
            c.buyers.length === 0 && c.sellers.length === 0 ? "No filings activity this quarter" : null,
          ]
            .filter(Boolean)
            .join("\n");
          return (
            <div key={c.quarter} className="flex flex-col items-center" title={tooltip}>
              <div
                className="flex flex-col items-center justify-end"
                style={{ height: `${BAR_MAX_PX}px` }}
              >
                <div className="text-[10px] tabular-nums text-emerald-400 font-semibold leading-none mb-0.5">
                  {c.buyers.length > 0 ? c.buyers.length : ""}
                </div>
                <div
                  className="w-full bg-emerald-400/70 rounded-t"
                  style={{ height: `${buyHeight}px`, minHeight: c.buyers.length > 0 ? 2 : 0 }}
                />
              </div>
              <div className="w-full h-px bg-white/20" />
              <div
                className="flex flex-col items-center justify-start w-full"
                style={{ height: `${BAR_MAX_PX}px` }}
              >
                <div
                  className="w-full bg-rose-400/70 rounded-b"
                  style={{ height: `${sellHeight}px`, minHeight: c.sellers.length > 0 ? 2 : 0 }}
                />
                <div className="text-[10px] tabular-nums text-rose-400 font-semibold leading-none mt-0.5">
                  {c.sellers.length > 0 ? c.sellers.length : ""}
                </div>
              </div>
              <div className="text-[10px] text-muted mt-1.5 tabular-nums">
                {c.quarter.replace("20", "'").replace("-", " ")}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-400/70" />
          Buyers (new + add)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-rose-400/70" />
          Sellers (trim + exit)
        </span>
      </div>
    </div>
  );
}
