"use client";
import { useMemo, useState } from "react";
import { type YearRow, simulateManager } from "@/lib/returns";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function pct(n: number) { return (n * 100).toFixed(1) + "%"; }

export default function ManagerBacktest({ returns, name }: { returns: YearRow[]; name: string }) {
  const MIN = returns[0].year;
  const MAX = returns[returns.length - 1].year - 1;
  const [startYear, setStartYear] = useState(Math.max(MIN, MAX - 9));
  const [amount, setAmount] = useState(10000);

  const r = useMemo(() => simulateManager(returns, startYear, amount), [returns, startYear, amount]);

  const maxVal = Math.max(...r.series.map((s) => Math.max(s.brk, s.spy)));
  const chartHeight = 220;
  const chartWidth = 640;
  const stepX = chartWidth / Math.max(1, r.series.length - 1);
  const toY = (v: number) => chartHeight - (v / maxVal) * chartHeight;
  const mgrPath = r.series.map((s, i) => `${i === 0 ? "M" : "L"}${i * stepX},${toY(s.brk)}`).join(" ");
  const spyPath = r.series.map((s, i) => `${i === 0 ? "M" : "L"}${i * stepX},${toY(s.spy)}`).join(" ");
  const beat = r.brkFinal - r.spyFinal;
  const won = beat > 0;

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-muted mb-2">
            Start year: <span className="text-text font-semibold">{startYear}</span>
          </label>
          <input type="range" min={MIN} max={MAX} value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))} className="w-full accent-brand" />
          <div className="flex justify-between text-xs text-dim mt-1"><span>{MIN}</span><span>{MAX}</span></div>
        </div>
        <div>
          <label className="block text-sm text-muted mb-2">
            Amount invested: <span className="text-text font-semibold">{fmt(amount)}</span>
          </label>
          <input type="range" min={1000} max={100000} step={1000} value={amount}
            onChange={(e) => setAmount(Number(e.target.value))} className="w-full accent-brand" />
          <div className="flex justify-between text-xs text-dim mt-1"><span>$1k</span><span>$100k</span></div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-panel p-6">
        <div className="text-sm text-muted mb-2">
          If you invested {fmt(amount)} with {name} in {startYear}, today it would be worth:
        </div>
        <div className="text-4xl md:text-5xl font-bold text-brand tabular-nums">{fmt(r.brkFinal)}</div>
        <div className="text-sm text-muted mt-3">
          That's <span className="text-text font-semibold">{r.brkMultiple.toFixed(1)}x</span> your money
          ({pct(r.brkCagr)} annualized over {r.years} years).
        </div>
        <div className="mt-6 pt-6 border-t border-border">
          <div className="text-sm text-muted mb-1">Compared to the S&P 500:</div>
          <div className="text-2xl font-semibold tabular-nums">{fmt(r.spyFinal)}</div>
          <div className="text-sm text-muted mt-2">
            {won ? <>{name} <span className="text-brand font-semibold">beat the market by {fmt(Math.abs(beat))}</span>.</>
                 : <>S&P 500 actually beat {name} by <span className="text-text font-semibold">{fmt(Math.abs(beat))}</span> from this start.</>}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-panel p-6 overflow-hidden">
        <div className="text-sm text-muted mb-4">Growth of {fmt(amount)} · {startYear}–{returns[returns.length-1].year}</div>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`} className="w-full">
          <path d={spyPath} fill="none" stroke="#60a5fa" strokeWidth="2" />
          <path d={mgrPath} fill="none" stroke="#fbbf24" strokeWidth="3" />
          {r.series.map((s, i) => <circle key={i} cx={i * stepX} cy={toY(s.brk)} r="3" fill="#fbbf24" />)}
        </svg>
        <div className="flex gap-6 text-sm mt-4">
          <div className="flex items-center gap-2"><span className="w-4 h-0.5 bg-brand inline-block" /> {name}</div>
          <div className="flex items-center gap-2"><span className="w-4 h-0.5 bg-blue-400 inline-block" /> S&P 500</div>
        </div>
      </div>

      <div className="text-xs text-dim leading-relaxed">
        Historical returns. Past performance does not predict future results. Returns sourced from public reports.
        Not investment advice.
      </div>
    </div>
  );
}
