import { getBuySignals, getSellSignals, ratingLabel } from "@/lib/signals";
import { QUARTER_LABELS, LATEST_QUARTER } from "@/lib/moves";

// Server component — renders at build time. The data is static per build.
export default function BuySellSignals() {
  const topBuys = getBuySignals().slice(0, 5);
  const topSells = getSellSignals().slice(0, 5);
  const quarter = QUARTER_LABELS[LATEST_QUARTER];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <SignalColumn
        kind="buy"
        title="What to buy"
        subtitle={`Top signals · ${quarter}`}
        items={topBuys.map((s) => ({
          ticker: s.ticker,
          name: s.name,
          score: s.score,
          detail: `${s.buyerCount} manager${s.buyerCount > 1 ? "s" : ""} buying`,
        }))}
        linkHref="/buys"
        linkLabel="See full ranking →"
      />
      <SignalColumn
        kind="sell"
        title="What to sell"
        subtitle={`Top signals · ${quarter}`}
        items={topSells.map((s) => ({
          ticker: s.ticker,
          name: s.name,
          score: s.score,
          detail: `${s.sellerCount} manager${s.sellerCount > 1 ? "s" : ""} selling`,
        }))}
        linkHref="/sells"
        linkLabel="See full ranking →"
      />
    </div>
  );
}

function SignalColumn({
  kind,
  title,
  subtitle,
  items,
  linkHref,
  linkLabel,
}: {
  kind: "buy" | "sell";
  title: string;
  subtitle: string;
  items: { ticker: string; name: string; score: number; detail: string }[];
  linkHref: string;
  linkLabel: string;
}) {
  const accent = kind === "buy" ? "text-emerald-400" : "text-rose-400";
  const accentBg = kind === "buy" ? "bg-emerald-400/5" : "bg-rose-400/5";
  const accentBorder = kind === "buy" ? "border-emerald-400/20" : "border-rose-400/20";

  return (
    <div className={`rounded-2xl border ${accentBorder} ${accentBg} p-6`}>
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <div className={`text-[10px] uppercase tracking-widest font-bold ${accent}`}>{subtitle}</div>
          <h3 className="text-2xl font-bold mt-1">{title}</h3>
        </div>
      </div>

      <ul className="space-y-2">
        {items.map((it, i) => {
          const rating = ratingLabel(it.score);
          const ratingColor =
            rating.color === "emerald" && kind === "sell"
              ? "text-rose-400"
              : rating.color === "emerald"
              ? "text-emerald-400"
              : rating.color === "amber"
              ? "text-brand"
              : "text-muted";
          return (
            <li key={it.ticker}>
              <a
                href={`/ticker/${it.ticker}`}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-bg/40 transition"
              >
                <div className="text-xs text-dim tabular-nums w-5">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-mono font-bold text-brand">{it.ticker}</div>
                    <div className="text-xs text-muted truncate">{it.name}</div>
                  </div>
                  <div className="text-[11px] text-dim">{it.detail}</div>
                </div>
                <div className={`text-sm font-bold tabular-nums ${ratingColor}`}>{it.score}</div>
              </a>
            </li>
          );
        })}
      </ul>

      <a
        href={linkHref}
        className={`inline-block mt-4 text-sm ${accent} font-semibold hover:underline`}
      >
        {linkLabel}
      </a>
    </div>
  );
}
