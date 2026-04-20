"use client";
import { useMemo, useState } from "react";
import { QUARTER_LABELS, QUARTERS, type Move, type Quarter, type MoveAction } from "@/lib/moves-types";
import { MANAGERS } from "@/lib/managers";
import { MANAGER_QUALITY } from "@/lib/signals-const";
import SinceFilingDelta from "@/components/SinceFilingDelta";

type Tab = "activity" | "buys" | "sells";

const TAB_LABELS: Record<Tab, string> = {
  activity: "All activity",
  buys: "Buys only",
  sells: "Sells only",
};

export default function TickerActivity({ symbol, moves }: { symbol: string; moves: Move[] }) {
  const [tab, setTab] = useState<Tab>("activity");

  const allMoves = moves;

  const filtered = useMemo(() => {
    if (tab === "buys") return allMoves.filter((m) => m.action === "new" || m.action === "add");
    if (tab === "sells") return allMoves.filter((m) => m.action === "trim" || m.action === "exit");
    return allMoves;
  }, [allMoves, tab]);

  if (allMoves.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-panel p-6 text-center">
        <div className="text-sm text-muted">
          No recent tracked 13F moves for <span className="font-mono font-semibold text-text">{symbol}</span>.
        </div>
        <div className="text-xs text-dim mt-2">
          Check back after the next quarterly filing deadline — we update within hours of each 13F drop.
        </div>
      </div>
    );
  }

  // Group by quarter, newest first
  const byQuarter: Record<string, Move[]> = {};
  for (const mv of filtered) {
    if (!byQuarter[mv.quarter]) byQuarter[mv.quarter] = [];
    byQuarter[mv.quarter].push(mv);
  }
  const orderedQuarters = (QUARTERS as readonly string[]).filter((q) => byQuarter[q]?.length);

  const buyCount = allMoves.filter((m) => m.action === "new" || m.action === "add").length;
  const sellCount = allMoves.filter((m) => m.action === "trim" || m.action === "exit").length;
  const netSignal = buyCount - sellCount;
  const signalColor = netSignal > 0 ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" : netSignal < 0 ? "text-rose-400 bg-rose-400/10 border-rose-400/30" : "text-muted bg-panel border-border";
  const signalLabel = netSignal > 0 ? `${netSignal > 1 ? "STRONG " : ""}BUY` : netSignal < 0 ? `${netSignal < -1 ? "STRONG " : ""}SELL` : "NEUTRAL";

  return (
    <div className="rounded-2xl border border-border bg-panel overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-1">
            Smart money activity
          </div>
          <div className="text-sm text-muted">
            {buyCount} buy{buyCount !== 1 ? "s" : ""} · {sellCount} sell{sellCount !== 1 ? "s" : ""} across tracked 13F filings
          </div>
        </div>
        <div className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${signalColor}`}>
          Net signal: {signalLabel}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-5 py-3 border-b border-border overflow-x-auto">
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md transition whitespace-nowrap ${
              t === tab
                ? "bg-brand text-black"
                : "text-muted hover:text-text border border-border hover:border-brand/40"
            }`}
            aria-pressed={t === tab}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Quarterly groups */}
      <div className="divide-y divide-border">
        {orderedQuarters.map((q) => (
          <QuarterGroup key={q} quarter={q as Quarter} moves={byQuarter[q]} />
        ))}
        {orderedQuarters.length === 0 && (
          <div className="px-5 py-10 text-center text-dim text-sm">
            No {tab === "buys" ? "buy" : tab === "sells" ? "sell" : ""} activity in this window.
          </div>
        )}
      </div>
    </div>
  );
}

function QuarterGroup({ quarter, moves }: { quarter: Quarter; moves: Move[] }) {
  // Sort: buys first (by manager quality desc), then sells (by manager quality desc)
  const sorted = [...moves].sort((a, b) => {
    const aIsBuy = a.action === "new" || a.action === "add";
    const bIsBuy = b.action === "new" || b.action === "add";
    if (aIsBuy !== bIsBuy) return aIsBuy ? -1 : 1;
    const qa = MANAGER_QUALITY[a.managerSlug] ?? 6;
    const qb = MANAGER_QUALITY[b.managerSlug] ?? 6;
    return qb - qa;
  });

  return (
    <div>
      <div className="px-5 py-3 bg-bg/40 text-xs uppercase tracking-wider text-dim font-semibold sticky top-0">
        {QUARTER_LABELS[quarter]}
        <span className="ml-2 text-dim/60 normal-case">
          ({moves.length} move{moves.length !== 1 ? "s" : ""})
        </span>
      </div>
      <table className="w-full text-sm">
        <thead className="text-dim text-[10px] uppercase tracking-wider">
          <tr className="border-b border-border">
            <th className="text-left px-5 py-2">Portfolio manager</th>
            <th className="text-left px-5 py-2 hidden md:table-cell">Activity</th>
            <th className="text-right px-5 py-2 hidden md:table-cell">Share change</th>
            <th className="text-right px-5 py-2">% portfolio</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((mv, i) => (
            <MoveRow key={`${mv.managerSlug}-${mv.quarter}-${i}`} mv={mv} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MoveRow({ mv }: { mv: Move }) {
  const mgr = MANAGERS.find((m) => m.slug === mv.managerSlug);
  const quality = MANAGER_QUALITY[mv.managerSlug] ?? 6;

  const isBuy = mv.action === "new" || mv.action === "add";
  const color = isBuy ? "text-emerald-400" : "text-rose-400";

  const actionLabel =
    mv.action === "new"
      ? "Buy (new)"
      : mv.action === "add"
      ? mv.deltaPct != null
        ? `Add ${formatPct(mv.deltaPct)}`
        : "Add"
      : mv.action === "trim"
      ? mv.deltaPct != null
        ? `Reduce ${formatPct(Math.abs(mv.deltaPct))}`
        : "Reduce"
      : "Sell (exit)";

  const shareChangeDisplay =
    mv.shareChange != null
      ? `${mv.shareChange > 0 ? "+" : ""}${formatNumber(mv.shareChange)}`
      : "—";

  return (
    <tr className="border-b border-border last:border-0 hover:bg-bg/40 transition">
      <td className="px-5 py-3">
        <div className="flex items-center gap-2">
          <a
            href={`/investor/${mv.managerSlug}`}
            className="font-semibold text-text hover:text-brand transition"
          >
            {mgr?.name || mv.managerSlug}
          </a>
          <QualityBadge quality={quality} />
        </div>
        {mgr?.fund && (
          <div className="text-[11px] text-dim mt-0.5 truncate max-w-xs">{mgr.fund}</div>
        )}
        {mv.note && (
          <div className="text-[11px] text-muted mt-1 italic max-w-md hidden md:block">{mv.note}</div>
        )}
      </td>
      <td className={`px-5 py-3 font-semibold whitespace-nowrap hidden md:table-cell ${color}`}>
        <div>{actionLabel}</div>
        {/* Live P&L context — how the ticker has moved since this specific
            filing landed. Range=2y covers Q1 2024 back. Shares ticker-level
            cache for this page: one getQuote call serves all N move rows. */}
        <div className="text-[10.5px] font-normal opacity-80 mt-0.5">
          <SinceFilingDelta
            ticker={mv.ticker}
            filedAt={mv.filedAt}
            compact
            range="2y"
          />
        </div>
      </td>
      <td className={`px-5 py-3 text-right tabular-nums hidden md:table-cell ${color}`}>
        {shareChangeDisplay}
      </td>
      <td className="px-5 py-3 text-right tabular-nums text-muted">
        {mv.portfolioImpactPct != null ? `${mv.portfolioImpactPct.toFixed(2)}%` : "—"}
      </td>
    </tr>
  );
}

function QualityBadge({ quality }: { quality: number }) {
  if (quality >= 9) {
    return (
      <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider text-brand bg-brand/10 border border-brand/30 rounded px-1.5 py-0.5">
        Tier 1
      </span>
    );
  }
  if (quality >= 8) {
    return (
      <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded px-1.5 py-0.5">
        Elite
      </span>
    );
  }
  return null;
}

function formatNumber(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return n.toLocaleString("en-US");
}

function formatPct(n: number): string {
  return `${n.toFixed(n >= 100 ? 0 : 2)}%`;
}
