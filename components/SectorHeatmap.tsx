"use client";
import { useEffect, useMemo, useState } from "react";
import { getQuotes, fmtPct, type LiveQuote as LiveQuoteData } from "@/lib/live";

type Cell = {
  symbol: string;
  name: string;
  sector?: string;
  ownerCount: number;
};

type Props = {
  tickers: Cell[];
  /** Optional header text, rendered above the grid. */
  title?: string;
  subtitle?: string;
};

export default function SectorHeatmap({ tickers, title = "Day-change heatmap", subtitle }: Props) {
  const [quotes, setQuotes] = useState<Record<string, LiveQuoteData | null>>({});
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const symbols = tickers.map((t) => t.symbol);
      const q = await getQuotes(symbols, "1mo");
      if (cancelled) return;
      setQuotes(q);
      setState(Object.values(q).some((x) => x) ? "ok" : "err");
    }
    load();
    const id = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [tickers.map((t) => t.symbol).join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  // Group by sector
  const groups = useMemo(() => {
    const g: Record<string, Cell[]> = {};
    for (const t of tickers) {
      const key = t.sector || "Other";
      if (!g[key]) g[key] = [];
      g[key].push(t);
    }
    // sort within each sector by ownerCount desc
    for (const k of Object.keys(g)) {
      g[k].sort((a, b) => b.ownerCount - a.ownerCount);
    }
    return g;
  }, [tickers]);

  const orderedSectors = Object.keys(groups).sort((a, b) => groups[b].length - groups[a].length);

  return (
    <div className="rounded-2xl border border-border bg-panel p-5">
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
        <div>
          <div className="text-xs uppercase tracking-widest text-brand font-semibold">{title}</div>
          {subtitle && <div className="text-xs text-dim mt-0.5">{subtitle}</div>}
        </div>
        <div className="flex items-center gap-3 text-[10px] text-dim">
          <LegendPill label="−5%+" color="bg-rose-400/80" />
          <LegendPill label="0%" color="bg-border" />
          <LegendPill label="+5%+" color="bg-emerald-400/80" />
        </div>
      </div>

      <div className="space-y-4">
        {orderedSectors.map((sector) => (
          <div key={sector}>
            <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mb-2">
              {sector} <span className="text-dim/60">({groups[sector].length})</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {groups[sector].map((t) => {
                const q = quotes[t.symbol.toUpperCase()];
                return <HeatCell key={t.symbol} cell={t} quote={q} loading={state === "loading"} />;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeatCell({
  cell,
  quote,
  loading,
}: {
  cell: Cell;
  quote: LiveQuoteData | null | undefined;
  loading: boolean;
}) {
  if (loading || !quote) {
    return (
      <a
        href={`/ticker/${cell.symbol}`}
        className="rounded-md border border-border bg-bg/40 p-2 text-center hover:border-brand/40 transition block"
      >
        <div className="font-mono font-bold text-xs text-text">{cell.symbol}</div>
        <div className="text-[10px] text-dim tabular-nums">{loading ? "…" : "—"}</div>
      </a>
    );
  }

  const pct = quote.dayChangePct;
  // Map -6% to +6% to color intensity
  const clamped = Math.max(-6, Math.min(6, pct));
  const intensity = Math.abs(clamped) / 6; // 0..1
  const isUp = pct >= 0;

  // Use inline rgba so we get a true gradient across the spectrum.
  // emerald-400 = (52, 211, 153), rose-400 = (251, 113, 133)
  const rgb = isUp ? "52, 211, 153" : "251, 113, 133";
  const bg = `rgba(${rgb}, ${0.08 + intensity * 0.32})`;
  const border = `rgba(${rgb}, ${0.25 + intensity * 0.35})`;
  const color = isUp ? "text-emerald-400" : "text-rose-400";

  return (
    <a
      href={`/ticker/${cell.symbol}`}
      className="rounded-md p-2 text-center transition block border hover:opacity-90"
      style={{ backgroundColor: bg, borderColor: border }}
      title={`${cell.name} · ${fmtPct(pct)}`}
    >
      <div className="font-mono font-bold text-xs text-text truncate">{cell.symbol}</div>
      <div className={`text-[10px] tabular-nums ${color}`}>{fmtPct(pct)}</div>
    </a>
  );
}

function LegendPill({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`inline-block w-3 h-3 rounded-sm ${color}`} />
      <span>{label}</span>
    </span>
  );
}
