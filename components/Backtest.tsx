"use client";
import { useMemo, useState } from "react";
import { RETURNS, simulate } from "@/lib/returns";
import BacktestShareCard from "@/components/BacktestShareCard";

const YEARS = RETURNS.map((r) => r.year);
const MIN = YEARS[0];
const MAX = YEARS[YEARS.length - 1] - 1;

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function pct(n: number) {
  return (n * 100).toFixed(1) + "%";
}

export default function Backtest() {
  const [startYear, setStartYear] = useState(2010);
  const [amount, setAmount] = useState(10000);

  const result = useMemo(() => simulate(startYear, amount), [startYear, amount]);

  const maxVal = Math.max(...result.series.map((s) => Math.max(s.brk, s.spy)));
  const chartHeight = 220;
  const chartWidth = 640;
  const n = result.series.length;
  const stepX = chartWidth / Math.max(1, n - 1);

  const toY = (v: number) => chartHeight - (v / maxVal) * chartHeight;
  const brkPath = result.series
    .map((s, i) => `${i === 0 ? "M" : "L"}${i * stepX},${toY(s.brk)}`)
    .join(" ");
  const spyPath = result.series
    .map((s, i) => `${i === 0 ? "M" : "L"}${i * stepX},${toY(s.spy)}`)
    .join(" ");

  const beat = result.brkFinal - result.spyFinal;
  const buffettWon = beat > 0;

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-muted mb-2">
            Start year: <span className="text-text font-semibold">{startYear}</span>
          </label>
          <input
            type="range"
            min={MIN}
            max={MAX}
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))}
            className="w-full accent-brand"
          />
          <div className="flex justify-between text-xs text-dim mt-1">
            <span>{MIN}</span>
            <span>{MAX}</span>
          </div>
        </div>
        <div>
          <label className="block text-sm text-muted mb-2">
            Amount invested: <span className="text-text font-semibold">{fmt(amount)}</span>
          </label>
          <input
            type="range"
            min={1000}
            max={100000}
            step={1000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-brand"
          />
          <div className="flex justify-between text-xs text-dim mt-1">
            <span>$1k</span>
            <span>$100k</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-panel p-6">
        <div className="text-sm text-muted mb-2">
          If you invested {fmt(amount)} in Berkshire Hathaway in {startYear}, today it would be worth:
        </div>
        <div className="text-4xl md:text-5xl font-bold text-brand tabular-nums">
          {fmt(result.brkFinal)}
        </div>
        <div className="text-sm text-muted mt-3">
          That's <span className="text-text font-semibold">{result.brkMultiple.toFixed(1)}x</span> your money
          ({pct(result.brkCagr)} annualized over {result.years} years).
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="text-sm text-muted mb-1">Compared to the S&P 500:</div>
          <div className="text-2xl font-semibold tabular-nums">{fmt(result.spyFinal)}</div>
          <div className="text-sm text-muted mt-2">
            {buffettWon ? (
              <>
                Buffett <span className="text-brand font-semibold">beat the market by {fmt(Math.abs(beat))}</span>.
              </>
            ) : (
              <>
                S&P 500 actually beat Berkshire by <span className="text-text font-semibold">{fmt(Math.abs(beat))}</span> from this starting point.
              </>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-panel p-6 overflow-hidden">
        <div className="text-sm text-muted mb-4">Growth of {fmt(amount)} · {startYear}–2025</div>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`} className="w-full">
          <path d={spyPath} fill="none" stroke="#60a5fa" strokeWidth="2" />
          <path d={brkPath} fill="none" stroke="#fbbf24" strokeWidth="3" />
          {result.series.map((s, i) => (
            <g key={i}>
              <circle cx={i * stepX} cy={toY(s.brk)} r="3" fill="#fbbf24" />
            </g>
          ))}
        </svg>
        <div className="flex gap-6 text-sm mt-4">
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-brand inline-block" /> Berkshire Hathaway
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-blue-400 inline-block" /> S&P 500
          </div>
        </div>
      </div>

      <BacktestShareCard
        managerName="Warren Buffett"
        startYear={startYear}
        amount={amount}
        finalValue={result.brkFinal}
        multiple={result.brkMultiple}
        cagr={result.brkCagr}
        spyFinal={result.spyFinal}
        spyMultiple={result.spyMultiple}
        years={result.years}
      />

      <div className="text-xs text-dim leading-relaxed">
        Historical returns. Past performance does not predict future results. BRK-A annual price returns and S&P 500 total returns based on public reports.
        Not investment advice. Learn more on <a className="underline" href="/">HoldLens</a>.
      </div>
    </div>
  );
}
