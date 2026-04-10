"use client";
import { useEffect, useMemo, useState } from "react";
import { getQuote, fmtPrice, fmtPct, type LiveQuote as LiveQuoteData } from "@/lib/live";

type Range = "1mo" | "3mo" | "6mo" | "1y";

type Props = {
  symbol: string;
  /** Default 1y. User can change via range picker. */
  defaultRange?: Range;
  /** Show range picker buttons. Default true. */
  showRangePicker?: boolean;
  /** Height in pixels. Default 260. */
  height?: number;
};

const RANGES: Range[] = ["1mo", "3mo", "6mo", "1y"];
const RANGE_LABELS: Record<Range, string> = {
  "1mo": "1M",
  "3mo": "3M",
  "6mo": "6M",
  "1y": "1Y",
};

export default function LiveChart({ symbol, defaultRange = "1y", showRangePicker = true, height = 260 }: Props) {
  const [q, setQ] = useState<LiveQuoteData | null>(null);
  const [range, setRange] = useState<Range>(defaultRange);
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    getQuote(symbol, range).then((data) => {
      if (cancelled) return;
      if (data) {
        setQ(data);
        setState("ok");
      } else {
        setState("err");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [symbol, range]);

  const chartData = useMemo(() => {
    if (!q || q.chart.length === 0) return null;
    const first = q.chart[0].c;
    const last = q.chart[q.chart.length - 1].c;
    const min = Math.min(...q.chart.map((p) => p.c));
    const max = Math.max(...q.chart.map((p) => p.c));
    const up = last >= first;
    const changePct = ((last - first) / first) * 100;
    return { first, last, min, max, up, changePct };
  }, [q]);

  if (state === "loading") {
    return (
      <div
        className="rounded-2xl border border-border bg-panel animate-pulse"
        style={{ height }}
      />
    );
  }

  if (state === "err" || !q || !chartData || q.chart.length < 2) {
    return (
      <div
        className="rounded-2xl border border-border bg-panel flex items-center justify-center text-dim text-sm"
        style={{ height }}
      >
        Chart unavailable
      </div>
    );
  }

  const W = 800;
  const H = height;
  const padX = 12;
  const padTop = 16;
  const padBot = 28;
  const innerW = W - padX * 2;
  const innerH = H - padTop - padBot;

  const { first, last, min, max, up } = chartData;
  const span = Math.max(1e-9, max - min);
  const n = q.chart.length;
  const stepX = innerW / Math.max(1, n - 1);

  const pts = q.chart.map((p, i) => {
    const x = padX + i * stepX;
    const y = padTop + (1 - (p.c - min) / span) * innerH;
    return { x, y, c: p.c, t: p.t };
  });

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${pts[pts.length - 1].x.toFixed(1)},${(padTop + innerH).toFixed(1)} L${pts[0].x.toFixed(1)},${(padTop + innerH).toFixed(1)} Z`;

  const strokeColor = up ? "#34d399" : "#fb7185"; // emerald-400 / rose-400
  const fillId = `grad-${symbol}-${range}`;

  const firstPt = pts[0];
  const lastPt = pts[pts.length - 1];
  const hoveredPt = hoverIdx != null ? pts[hoverIdx] : null;
  const hoveredQ = hoverIdx != null ? q.chart[hoverIdx] : null;

  return (
    <div className="rounded-2xl border border-border bg-panel p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs text-dim uppercase tracking-wider">{RANGE_LABELS[range]} change</div>
          <div className={`text-lg font-semibold tabular-nums ${up ? "text-emerald-400" : "text-rose-400"}`}>
            {up ? "▲" : "▼"} {fmtPct(chartData.changePct)}
          </div>
        </div>
        {showRangePicker && (
          <div className="flex gap-1">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-md transition ${
                  r === range
                    ? "bg-brand text-black"
                    : "text-muted hover:text-text border border-border hover:border-brand/40"
                }`}
                aria-pressed={r === range}
              >
                {RANGE_LABELS[r]}
              </button>
            ))}
          </div>
        )}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto select-none"
        preserveAspectRatio="none"
        onMouseMove={(e) => {
          const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const relX = ((e.clientX - rect.left) / rect.width) * W;
          const idx = Math.max(0, Math.min(n - 1, Math.round((relX - padX) / stepX)));
          setHoverIdx(idx);
        }}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Baseline: first price horizontal */}
        <line
          x1={padX}
          x2={W - padX}
          y1={padTop + (1 - (first - min) / span) * innerH}
          y2={padTop + (1 - (first - min) / span) * innerH}
          stroke="#262626"
          strokeDasharray="2 4"
          strokeWidth="1"
        />

        <path d={areaPath} fill={`url(#${fillId})`} />
        <path d={linePath} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Endpoint dot */}
        <circle cx={lastPt.x} cy={lastPt.y} r="3.5" fill={strokeColor} />

        {/* Hover crosshair */}
        {hoveredPt && (
          <>
            <line x1={hoveredPt.x} x2={hoveredPt.x} y1={padTop} y2={padTop + innerH} stroke="#6b7280" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx={hoveredPt.x} cy={hoveredPt.y} r="4" fill="#0a0a0a" stroke={strokeColor} strokeWidth="2" />
          </>
        )}

        {/* Min/Max labels */}
        <text x={padX} y={padTop + 10} fontSize="11" fill="#6b7280">
          {fmtPrice(max, q.currency)}
        </text>
        <text x={padX} y={H - padBot + 14} fontSize="11" fill="#6b7280">
          {fmtPrice(min, q.currency)}
        </text>

        {/* Date labels */}
        <text x={padX} y={H - 8} fontSize="11" fill="#6b7280">
          {fmtDate(firstPt.t)}
        </text>
        <text x={W - padX} y={H - 8} fontSize="11" fill="#6b7280" textAnchor="end">
          {fmtDate(lastPt.t)}
        </text>

        {/* Hover tooltip (rendered as foreignObject would be cleaner, but SVG text is static-export-safe) */}
        {hoveredPt && hoveredQ && (
          <g>
            <rect
              x={Math.min(W - 140, Math.max(padX, hoveredPt.x - 70))}
              y={padTop + 4}
              width="136"
              height="40"
              rx="6"
              fill="#0a0a0a"
              stroke="#262626"
            />
            <text
              x={Math.min(W - 140, Math.max(padX, hoveredPt.x - 70)) + 10}
              y={padTop + 20}
              fontSize="11"
              fill="#9ca3af"
            >
              {fmtDate(hoveredQ.t)}
            </text>
            <text
              x={Math.min(W - 140, Math.max(padX, hoveredPt.x - 70)) + 10}
              y={padTop + 36}
              fontSize="13"
              fill="#e5e5e5"
              fontWeight="600"
            >
              {fmtPrice(hoveredQ.c, q.currency)}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

function fmtDate(epochSec: number): string {
  const d = new Date(epochSec * 1000);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
}
