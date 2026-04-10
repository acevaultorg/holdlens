import type { Metadata } from "next";
import LiveQuote from "@/components/LiveQuote";
import TrendBadge from "@/components/TrendBadge";
import CsvExportButton from "@/components/CsvExportButton";
import { getBuySignals, getSellSignals, ratingLabel } from "@/lib/signals";
import { QUARTER_LABELS, LATEST_QUARTER } from "@/lib/moves";
import { MANAGERS } from "@/lib/managers";

export const metadata: Metadata = {
  title: "This week on HoldLens — top buy/sell signals at a glance",
  description: `The single page every HoldLens user checks first. Top buy signals, top sell signals, trending tickers — everything you need from ${MANAGERS.length} of the best portfolio managers in the world.`,
  openGraph: {
    title: "This week on HoldLens",
    description: "Top signals at a glance.",
  },
};

export default function ThisWeekPage() {
  const topBuys = getBuySignals().slice(0, 5);
  const topSells = getSellSignals().slice(0, 5);
  const quarterLabel = QUARTER_LABELS[LATEST_QUARTER];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        This week on HoldLens
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        Everything at a glance.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-10">
        The top buy signals, top sell signals, and trending tickers from {MANAGERS.length} of the best portfolio
        managers in the world — distilled into one page. Bookmark it, come back every week.
      </p>

      {/* Top signals grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <SignalColumn kind="buy" title="Top buys" signals={topBuys} quarterLabel={quarterLabel} />
        <SignalColumn kind="sell" title="Top sells" signals={topSells} quarterLabel={quarterLabel} />
      </div>

      {/* CSV export */}
      <div className="mb-12 flex justify-center">
        <CsvExportButton
          filename={`holdlens-this-week-${LATEST_QUARTER}.csv`}
          label="Download top 10 buys + top 10 sells CSV"
          rows={[
            ...topBuys.map((s, i) => ({
              direction: "BUY",
              rank: i + 1,
              ticker: s.ticker,
              name: s.name,
              sector: s.sector || "",
              score: s.score,
              manager_count: s.buyerCount,
              managers: s.buyers.map((b) => b.managerName).join("; "),
            })),
            ...topSells.map((s, i) => ({
              direction: "SELL",
              rank: i + 1,
              ticker: s.ticker,
              name: s.name,
              sector: s.sector || "",
              score: s.score,
              manager_count: s.sellerCount,
              managers: s.sellers.map((b) => b.managerName).join("; "),
            })),
          ]}
        />
      </div>

      {/* Quick CTAs */}
      <div className="grid md:grid-cols-3 gap-3 mb-12">
        <QuickLink href="/activity" title="All activity" desc="Every Q3+Q4 move" accent="text-text" />
        <QuickLink href="/screener" title="Screener" desc="Filter by live metrics" accent="text-text" />
        <QuickLink href="/grand" title="Grand portfolio" desc="Consensus rankings" accent="text-text" />
      </div>

      {/* Quarter info */}
      <div className="rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          Current quarter
        </div>
        <div className="text-2xl font-bold mb-1">{quarterLabel}</div>
        <div className="text-sm text-muted">
          13F filings are due 45 days after quarter end. HoldLens updates within hours of each filing deadline.{" "}
          <a href="/activity" className="text-brand hover:underline">See the full activity feed →</a>
        </div>
      </div>
    </div>
  );
}

function SignalColumn({
  kind,
  title,
  signals,
  quarterLabel,
}: {
  kind: "buy" | "sell";
  title: string;
  signals: (ReturnType<typeof getBuySignals>[number] | ReturnType<typeof getSellSignals>[number])[];
  quarterLabel: string;
}) {
  const accent = kind === "buy" ? "text-emerald-400" : "text-rose-400";
  const accentBorder = kind === "buy" ? "border-emerald-400/20" : "border-rose-400/20";
  const accentBg = kind === "buy" ? "bg-emerald-400/5" : "bg-rose-400/5";
  const fullHref = kind === "buy" ? "/buys" : "/sells";

  return (
    <div className={`rounded-2xl border ${accentBorder} ${accentBg} p-6`}>
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className={`text-[10px] uppercase tracking-widest font-bold ${accent}`}>{quarterLabel}</div>
          <h3 className="text-2xl font-bold mt-1">{title}</h3>
        </div>
      </div>
      <ul className="space-y-2 mb-4">
        {signals.map((s, i) => {
          const isBuy = "buyerCount" in s;
          const count = isBuy ? s.buyerCount : (s as ReturnType<typeof getSellSignals>[number]).sellerCount;
          const rating = ratingLabel(s.score);
          const ratingColor =
            rating.color === "emerald" && kind === "sell"
              ? "text-rose-400"
              : rating.color === "emerald"
              ? "text-emerald-400"
              : rating.color === "amber"
              ? "text-brand"
              : "text-muted";

          return (
            <li key={s.ticker}>
              <a
                href={`/signal/${s.ticker}`}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-bg/40 transition"
              >
                <div className="text-xs text-dim tabular-nums w-5">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-mono font-bold text-brand">{s.ticker}</div>
                    <TrendBadge ticker={s.ticker} />
                  </div>
                  <div className="text-[11px] text-dim mt-0.5">
                    {count} manager{count > 1 ? "s" : ""} · <LiveQuote symbol={s.ticker} size="sm" refreshMs={0} />
                  </div>
                </div>
                <div className={`text-sm font-bold tabular-nums ${ratingColor}`}>{s.score}</div>
              </a>
            </li>
          );
        })}
      </ul>
      <a href={fullHref} className={`text-sm font-semibold hover:underline ${accent}`}>
        See the full ranking →
      </a>
    </div>
  );
}

function QuickLink({ href, title, desc, accent }: { href: string; title: string; desc: string; accent: string }) {
  return (
    <a
      href={href}
      className="rounded-xl border border-border bg-panel p-5 hover:border-brand/40 transition group"
    >
      <div className={`text-lg font-bold group-hover:text-brand transition ${accent}`}>{title}</div>
      <div className="text-xs text-muted mt-1">{desc}</div>
    </a>
  );
}
