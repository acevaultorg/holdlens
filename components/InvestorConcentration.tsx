import TickerLogo from "@/components/TickerLogo";

// <InvestorConcentration /> — server component. Renders a dense
// concentration profile for a manager's tracked portfolio: Top-1 %,
// Top-5 %, Top-10 %, total positions, a diversification verdict,
// and a stacked concentration bar with the largest bets at the head.
//
// Purpose: on every /investor/[slug] page, the most useful question a
// reader asks is "how concentrated is this person's book?" This
// component answers it in one glance rather than forcing the reader to
// mentally sum the holdings table. Pure server — zero client JS.

type Holding = { ticker: string; pct: number; name?: string };

function verdictFor(top1: number, top5: number, top10: number): {
  label: string;
  tone: "rose" | "brand" | "emerald";
} {
  if (top1 >= 30) return { label: "Highly concentrated", tone: "rose" };
  if (top5 >= 60) return { label: "Concentrated", tone: "brand" };
  if (top10 >= 70) return { label: "Balanced", tone: "emerald" };
  return { label: "Diversified", tone: "emerald" };
}

export default function InvestorConcentration({
  holdings,
  managerFirstName,
}: {
  holdings: Holding[];
  managerFirstName: string;
}) {
  if (!holdings || holdings.length === 0) return null;

  const sorted = [...holdings].sort((a, b) => b.pct - a.pct);
  const totalPct = sorted.reduce((s, h) => s + h.pct, 0);
  const top1 = sorted[0]?.pct ?? 0;
  const top5Sum = sorted.slice(0, 5).reduce((s, h) => s + h.pct, 0);
  const top10Sum = sorted.slice(0, 10).reduce((s, h) => s + h.pct, 0);

  const v = verdictFor(top1, top5Sum, top10Sum);
  const verdictClass =
    v.tone === "rose"
      ? "text-rose-400"
      : v.tone === "emerald"
      ? "text-emerald-400"
      : "text-brand";

  const topTicker = sorted[0];

  return (
    <section className="mt-12 rounded-2xl border border-border bg-panel p-6">
      <div className="flex items-baseline justify-between mb-5 flex-wrap gap-2">
        <h2 className="text-xl font-bold">Concentration profile</h2>
        <span
          className={`text-[11px] font-semibold uppercase tracking-widest ${verdictClass}`}
        >
          {v.label}
        </span>
      </div>

      {/* 4-cell stats strip — Top 1 / Top 5 / Top 10 / Positions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <ConcStat
          label={`Top 1 · ${topTicker.ticker}`}
          value={`${top1.toFixed(1)}%`}
          tone="brand"
        />
        <ConcStat
          label="Top 5 combined"
          value={`${top5Sum.toFixed(1)}%`}
          tone="emerald"
        />
        <ConcStat
          label="Top 10 combined"
          value={`${top10Sum.toFixed(1)}%`}
          tone="emerald"
        />
        <ConcStat
          label="Tracked positions"
          value={`${sorted.length}`}
          tone="text"
        />
      </div>

      {/* Stacked concentration bar — first five bets at full color,
          next five faded, everything else as a dim remainder block. */}
      <div>
        <div
          className="flex w-full h-3 rounded-full overflow-hidden border border-border"
          style={{ background: "#0a0a0a" }}
          aria-label={`Portfolio concentration, top ${Math.min(
            10,
            sorted.length
          )} positions shown at scale`}
        >
          {sorted.slice(0, 10).map((h, i) => {
            const width = totalPct > 0 ? (h.pct / totalPct) * 100 : 0;
            const bg =
              i === 0
                ? "#fbbf24"
                : i < 5
                ? "rgba(251, 191, 36, 0.78)"
                : "rgba(251, 191, 36, 0.38)";
            return (
              <div
                key={h.ticker}
                title={`${h.ticker} — ${h.pct.toFixed(1)}%`}
                style={{ width: `${width}%`, background: bg }}
              />
            );
          })}
          {totalPct > top10Sum && (
            <div
              className="flex-1"
              style={{ background: "rgba(133, 141, 156, 0.3)" }}
              title={`Smaller positions (${(totalPct - top10Sum).toFixed(1)}%)`}
            />
          )}
        </div>
        <div className="mt-2 flex items-center justify-between text-[10.5px] text-dim uppercase tracking-widest">
          <span className="inline-flex items-center gap-1.5 font-mono normal-case text-brand">
            <TickerLogo symbol={topTicker.ticker} size={16} />
            {topTicker.ticker}
          </span>
          <span>Top-5 zone</span>
          <span>Top-10</span>
          {totalPct > top10Sum && <span>Smaller</span>}
        </div>
      </div>

      {/* Short interpretive paragraph — one sentence the reader
          can lift directly into their own thesis notes. */}
      <p className="mt-5 text-sm text-muted max-w-2xl">
        {managerFirstName}&apos;s single largest bet is{" "}
        <span className="text-brand font-semibold">
          {topTicker.ticker}
        </span>{" "}
        at{" "}
        <span className="text-text font-semibold">
          {top1.toFixed(1)}%
        </span>{" "}
        of tracked positions.
        {top1 >= 30 &&
          ` Conviction-concentrated — the single largest position drives most of the book.`}
        {top1 < 30 &&
          top5Sum >= 60 &&
          ` Top 5 names carry ${top5Sum.toFixed(0)}% of the weight — a focused approach without single-stock dominance.`}
        {top1 < 30 &&
          top5Sum < 60 &&
          ` Exposure is spread across a broader basket, reducing single-name risk.`}
      </p>
    </section>
  );
}

function ConcStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "brand" | "emerald" | "rose" | "text";
}) {
  const toneClass =
    tone === "brand"
      ? "text-brand"
      : tone === "emerald"
      ? "text-emerald-400"
      : tone === "rose"
      ? "text-rose-400"
      : "text-text";
  return (
    <div className="rounded-xl border border-border bg-bg p-3">
      <div className="text-[10px] uppercase tracking-widest text-dim font-semibold mb-1 truncate">
        {label}
      </div>
      <div className={`text-xl font-bold tabular-nums ${toneClass}`}>
        {value}
      </div>
    </div>
  );
}
