import type { Metadata } from "next";
import LiveQuote from "@/components/LiveQuote";
import TrendBadge from "@/components/TrendBadge";
import CsvExportButton from "@/components/CsvExportButton";
import FoundersNudge from "@/components/FoundersNudge";
import SinceFilingDelta from "@/components/SinceFilingDelta";
import MethodologyDisclaimer from "@/components/MethodologyDisclaimer";
import { getTopBuys, getTopSells, convictionLabel } from "@/lib/conviction";
import { QUARTER_LABELS, LATEST_QUARTER, QUARTER_FILED } from "@/lib/moves";
import { MANAGERS } from "@/lib/managers";

// v4.3 honest-relabel (2026-04-19): backtest showed score has no predictive
// signal for forward returns (r = -0.12 across 221 ticker-quarter pairs).
// Page re-positioned from "what to buy/sell right now" (implies predictive
// advice) to "most bought / most sold by tracked managers this quarter"
// (honest tracker framing). See .claude/state/CONVICTION_BACKTEST.md.

export const metadata: Metadata = {
  title: "Most-bought + most-sold stocks by tracked superinvestors",
  description: `What the ${MANAGERS.length} tracked portfolio managers are buying and selling most aggressively in their latest 13F filings. A smart-money positioning tracker, not a stock-picking recommendation.`,
  alternates: { canonical: "https://holdlens.com/best-now" },
  openGraph: {
    title: "HoldLens — What tracked superinvestors are buying + selling",
    description: "Smart-money positioning tracker: the stocks being bought and sold most aggressively across 30 top portfolio managers' latest 13F filings.",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
};

export default function BestNowPage() {
  const buys = getTopBuys(10);
  const sells = getTopSells(10);
  const quarter = QUARTER_LABELS[LATEST_QUARTER];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Smart-money positioning · {quarter}
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        What tracked superinvestors <span className="text-brand">are buying and selling</span>.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-3">
        The stocks with the most aggregate BUY and SELL conviction across {MANAGERS.length} tracked
        portfolio managers&apos; latest 13F filings. Ranked by composite score across 6 signal layers.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-6">
        This is a smart-money tracker. Backtest against forward returns shows no predictive signal —
        the score surfaces institutional consensus, not future alpha.{" "}
        <a href="/methodology#predictive-validity" className="underline">Read the methodology →</a>
      </p>

      <MethodologyDisclaimer />
      <div className="mb-12 flex items-center gap-2 flex-wrap">
        <CsvExportButton
          endpoint="/api/v1/best-now.json"
          filename="holdlens-best-now"
          label="Export top 50 as CSV"
        />
        <span className="text-xs text-dim">Free download — no signup.</span>
      </div>

      {/* TOP BUYS */}
      <section className="mb-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">
            <span className="text-emerald-400">Buy</span> — top 10
          </h2>
          <a href="/buys" className="text-sm text-emerald-400 hover:underline">All buy signals →</a>
        </div>

        {buys.length === 0 ? (
          <div className="rounded-2xl border border-border bg-panel p-10 text-center text-muted">
            No qualifying buy signals this quarter.
          </div>
        ) : (
          <div className="space-y-3">
            {buys.map((c, i) => (
              <ConvictionRow key={c.ticker} rank={i + 1} c={c} kind="buy" />
            ))}
          </div>
        )}
      </section>

      {/* TOP SELLS */}
      <section className="mt-16 mb-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">
            <span className="text-rose-400">Sell</span> — top 10
          </h2>
          <a href="/sells" className="text-sm text-rose-400 hover:underline">All sell signals →</a>
        </div>

        {sells.length === 0 ? (
          <div className="rounded-2xl border border-border bg-panel p-10 text-center text-muted">
            No qualifying sell signals this quarter.
          </div>
        ) : (
          <div className="space-y-3">
            {sells.map((c, i) => (
              <ConvictionRow key={c.ticker} rank={i + 1} c={c} kind="sell" />
            ))}
          </div>
        )}
      </section>

      <FoundersNudge tone="emerald" context="You're reading the top smart-money buy signals right now." />

      {/* Methodology callout */}
      <section className="rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          The model
        </div>
        <h2 className="text-xl font-bold mb-3">Six signal layers, one number</h2>
        <p className="text-sm text-muted leading-relaxed mb-4">
          ConvictionScore v3 combines smart-money consensus, insider activity, manager track-record-weighted
          expected return, multi-quarter trend streaks, position concentration, anti-crowding bonus
          (under-the-radar discovery), and dissent penalty. Time-decayed across 4 quarters of 13F data.
          Expected ROI projects forward using the buyers' realized 10-year CAGRs.
        </p>
        <ul className="text-xs text-dim space-y-1.5">
          <li>• <span className="text-text font-semibold">Smart money</span> — manager quality × consensus, time-decayed</li>
          <li>• <span className="text-text font-semibold">Insider boost</span> — CEO/CFO open-market buys (the strongest single equity signal)</li>
          <li>• <span className="text-text font-semibold">Track record</span> — buyer 10y CAGR × position size</li>
          <li>• <span className="text-text font-semibold">Trend streak</span> — multi-quarter compounding</li>
          <li>• <span className="text-text font-semibold">Concentration</span> — 15% positions weighted heavier than 1%</li>
          <li>• <span className="text-text font-semibold">Contrarian bonus</span> — under-the-radar gems (anti-crowding)</li>
        </ul>
      </section>

      <p className="text-xs text-dim mt-12 text-center">
        Past performance is not indicative of future results. Expected ROI is the model's projection, not a guarantee.
        Not investment advice. <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}

function ConvictionRow({
  rank,
  c,
  kind,
}: {
  rank: number;
  c: ReturnType<typeof getTopBuys>[number];
  kind: "buy" | "sell";
}) {
  const label = convictionLabel(c.score);
  const accent = kind === "buy" ? "border-emerald-400/30 hover:border-emerald-400/60" : "border-rose-400/30 hover:border-rose-400/60";
  const scoreColor = kind === "buy" ? "text-emerald-400" : "text-rose-400";

  return (
    <a
      href={`/signal/${c.ticker}`}
      className={`block rounded-2xl border ${accent} bg-panel p-5 transition group`}
    >
      <div className="flex items-start gap-4 flex-wrap">
        <div className="text-3xl font-bold text-dim tabular-nums w-10 shrink-0">
          {rank}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <div className="font-mono text-2xl font-bold text-brand group-hover:underline">
              {c.ticker}
            </div>
            <div className="text-text">{c.name}</div>
            {c.sector && (
              <span className="text-[10px] uppercase tracking-wider text-dim border border-border rounded px-1.5 py-0.5">
                {c.sector}
              </span>
            )}
            <TrendBadge ticker={c.ticker} size="md" />
          </div>
          <div className="text-xs text-muted">
            <LiveQuote symbol={c.ticker} size="sm" refreshMs={0} />
            <SinceFilingDelta
              ticker={c.ticker}
              filedAt={QUARTER_FILED[LATEST_QUARTER]}
              label="since filing"
              leadingSeparator
            />
            <span className="mx-2 text-dim">·</span>
            {c.buyerCount} buying
            {c.sellerCount > 0 && <span className="text-rose-400/80"> · {c.sellerCount} selling</span>}
            {c.ownerCount > 0 && <span className="text-dim"> · {c.ownerCount} total {c.ownerCount === 1 ? "owner" : "owners"}</span>}
          </div>
        </div>

        <div className="text-right">
          <div className={`text-2xl font-bold tabular-nums ${scoreColor}`}>
            {c.score >= 0 ? "+" : ""}
            {c.score}
          </div>
          <div className={`text-[10px] uppercase tracking-wider font-bold ${scoreColor}`}>
            {label.label}
          </div>
        </div>
      </div>

      {/* Expected ROI projection */}
      {c.expectedReturnPct != null && (
        <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <Metric
            label="Expected return"
            value={`${c.expectedReturnPct >= 0 ? "+" : ""}${c.expectedReturnPct}%/yr`}
            color={kind === "buy" ? "emerald" : "rose"}
          />
          {c.confidenceIntervalPct != null && (
            <Metric
              label="Confidence ±"
              value={`${c.confidenceIntervalPct}%`}
              color="muted"
            />
          )}
          {c.expectedFiveYearMultiple != null && (
            <Metric
              label="5-year projection"
              value={`${c.expectedFiveYearMultiple.toFixed(1)}×`}
              color={kind === "buy" ? "emerald" : "rose"}
            />
          )}
          <Metric
            label="Buyer alpha avg"
            value={c.topBuyers.length > 0 ? `${(c.topBuyers.reduce((s, b) => s + b.cagr, 0) / c.topBuyers.length).toFixed(1)}%` : "—"}
            color="muted"
          />
        </div>
      )}

      {/* Top buyers */}
      {c.topBuyers.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {c.topBuyers.map((b) => (
            <span
              key={b.slug}
              className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border border-border bg-bg/40 text-muted"
            >
              <span className="text-text font-semibold">{b.name.split(" ").slice(-1)[0]}</span>
              <span className="text-dim tabular-nums">{b.cagr.toFixed(0)}% CAGR</span>
            </span>
          ))}
        </div>
      )}
    </a>
  );
}

function Metric({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "emerald" | "rose" | "muted";
}) {
  const colorClass =
    color === "emerald" ? "text-emerald-400" : color === "rose" ? "text-rose-400" : "text-text";
  return (
    <div>
      <div className="text-[9px] uppercase tracking-wider text-dim font-semibold mb-0.5">
        {label}
      </div>
      <div className={`font-bold tabular-nums ${colorClass}`}>{value}</div>
    </div>
  );
}
