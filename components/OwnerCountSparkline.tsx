// 8-quarter ownership-count sparkline for the signal dossier.
//
// Shows how many of the tracked superinvestors held this ticker at each of
// the last 8 quarter-ends. Rising line = smart money accumulating; falling =
// smart money rotating out. Paired with the unified ConvictionScore + 52w
// range visualizer so the reader can see breadth AND depth of the signal
// at a glance.
//
// History is reconstructed server-side at build time by walking MERGED_MOVES
// backwards from the LATEST_QUARTER owner set. A "new" move at quarter q
// means that manager was NOT an owner before q (so we remove them from the
// set when walking back). An "exit" move at q means they WERE an owner
// before q (so we add them back). "add"/"trim" moves leave the set unchanged.
//
// Pure server component — zero client JS cost.

import { TICKER_INDEX } from "@/lib/tickers";
import { MERGED_MOVES, QUARTERS, QUARTER_LABELS, type Quarter } from "@/lib/moves";

type Props = { symbol: string };

function reconstructOwnerCounts(symbol: string): { quarter: Quarter; count: number }[] {
  const sym = symbol.toUpperCase();
  const t = TICKER_INDEX[sym];
  if (!t) return [];

  // QUARTERS is ordered newest-first: ["2025-Q4", "2025-Q3", ..., "2024-Q1"].
  // Seed the walk with the current owner set at LATEST_QUARTER (QUARTERS[0]).
  const ownerSet = new Set(t.owners.map((o) => o.slug));
  const counts: { quarter: Quarter; count: number }[] = [];

  for (let i = 0; i < QUARTERS.length; i++) {
    const q = QUARTERS[i];
    counts.push({ quarter: q, count: ownerSet.size });

    // Walk backwards: undo this quarter's moves to recover the prior set.
    // Only do this for quarters after the first (the first is the current state).
    if (i < QUARTERS.length - 1) {
      const movesInQ = MERGED_MOVES.filter(
        (m) => m.ticker.toUpperCase() === sym && m.quarter === q
      );
      for (const move of movesInQ) {
        if (move.action === "new") {
          // They became an owner during q, so before q they weren't.
          ownerSet.delete(move.managerSlug);
        } else if (move.action === "exit") {
          // They stopped owning during q, so before q they were an owner.
          ownerSet.add(move.managerSlug);
        }
        // "add" and "trim" do not change set membership.
      }
    }
  }

  // Reverse so index 0 is the oldest quarter and the last index is the latest.
  return counts.reverse();
}

export default function OwnerCountSparkline({ symbol }: Props) {
  const series = reconstructOwnerCounts(symbol);
  if (series.length === 0) return null;

  const latest = series[series.length - 1].count;
  const oldest = series[0].count;
  const max = Math.max(...series.map((p) => p.count), 1);
  const delta = latest - oldest;

  // No meaningful history — don't render. Keeps the dossier clean for
  // tickers that are brand-new to the tracked set.
  if (max === 0) return null;

  // Trend verdict: rising / falling / flat breadth of ownership.
  let tone: "rising" | "falling" | "flat";
  if (delta >= 2) tone = "rising";
  else if (delta <= -2) tone = "falling";
  else tone = "flat";

  const toneStyles = {
    rising: {
      bar: "bg-emerald-400/70",
      barTop: "bg-emerald-400",
      accent: "text-emerald-400",
      border: "border-emerald-400/30",
      bg: "bg-emerald-400/5",
      label: "Breadth rising",
      hint: "More superinvestors are holding this name than 8 quarters ago.",
      deltaSign: "+",
    },
    falling: {
      bar: "bg-rose-400/60",
      barTop: "bg-rose-400",
      accent: "text-rose-400",
      border: "border-rose-400/30",
      bg: "bg-rose-400/5",
      label: "Breadth falling",
      hint: "Fewer superinvestors hold this name than 8 quarters ago — rotation out.",
      deltaSign: "",
    },
    flat: {
      bar: "bg-border",
      barTop: "bg-muted",
      accent: "text-muted",
      border: "border-border",
      bg: "bg-panel",
      label: "Breadth flat",
      hint: "The number of superinvestors holding this name has been stable for 8 quarters.",
      deltaSign: delta >= 0 ? "+" : "",
    },
  }[tone];

  return (
    <div className={`rounded-2xl border ${toneStyles.border} ${toneStyles.bg} p-5`}>
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text">
            Ownership breadth · 8 quarters
          </h3>
          <span
            className={`text-[10px] uppercase tracking-wider font-bold ${toneStyles.accent} border ${toneStyles.border} rounded px-1.5 py-0.5`}
          >
            {toneStyles.label}
          </span>
        </div>
        <div className={`text-xs ${toneStyles.accent} font-semibold tabular-nums`}>
          {toneStyles.deltaSign}
          {delta} owners over 8Q
        </div>
      </div>

      {/* Bars + count labels */}
      <div className="flex items-end justify-between gap-1.5 h-20">
        {series.map((p, i) => {
          const heightPct = Math.max(6, (p.count / max) * 100);
          const isLatest = i === series.length - 1;
          return (
            <div
              key={p.quarter}
              className="flex-1 flex flex-col items-center justify-end h-full"
              title={`${QUARTER_LABELS[p.quarter]}: ${p.count} owner${p.count === 1 ? "" : "s"}`}
            >
              <div className="text-[10px] tabular-nums font-semibold text-text mb-1">
                {p.count}
              </div>
              <div
                className={`w-full rounded-t ${isLatest ? toneStyles.barTop : toneStyles.bar}`}
                style={{ height: `${heightPct}%` }}
              />
            </div>
          );
        })}
      </div>

      {/* Quarter labels */}
      <div className="mt-2 flex items-center justify-between gap-1.5 text-[9px] uppercase tracking-wider text-dim font-semibold">
        {series.map((p) => (
          <div key={p.quarter} className="flex-1 text-center truncate">
            {QUARTER_LABELS[p.quarter].replace(" 20", " '")}
          </div>
        ))}
      </div>

      <p className="mt-4 pt-3 border-t border-border text-[11px] text-dim leading-relaxed">
        {toneStyles.hint}{" "}
        <a href="/top-picks" className="text-brand hover:underline">
          See the most-owned names across all tracked managers →
        </a>
      </p>
    </div>
  );
}
