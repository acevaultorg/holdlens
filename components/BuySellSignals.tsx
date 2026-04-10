// Homepage signal cards — single signed −100..+100 conviction scale.
//
// A ticker can NEVER appear on both sides because each ticker has exactly
// one signed score and we filter cleanly on its sign. The number shown is
// the actual signed value (+42 for buys, −18 for sells), not a separate
// per-list rating.
import { getAllConvictionScores, convictionLabel, formatSignedScore, DEAD_ZONE } from "@/lib/conviction";
import { QUARTER_LABELS, LATEST_QUARTER } from "@/lib/moves";

// Server component — renders at build time. The data is static per build.
export default function BuySellSignals() {
  const all = getAllConvictionScores();
  const buys = all.filter((c) => c.score > DEAD_ZONE).slice(0, 5);
  const sells = all
    .filter((c) => c.score < -DEAD_ZONE)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);
  const quarter = QUARTER_LABELS[LATEST_QUARTER];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <SignalColumn
        kind="buy"
        title="What to buy"
        subtitle={`Top signals · ${quarter}`}
        items={buys.map((c) => ({
          ticker: c.ticker,
          name: c.name,
          score: c.score,
          detail:
            c.buyerCount > 0
              ? `${c.buyerCount} manager${c.buyerCount > 1 ? "s" : ""} buying${c.sellerCount > 0 ? ` · ${c.sellerCount} selling` : ""}`
              : `Strong historical conviction`,
        }))}
        linkHref="/buys"
        linkLabel="See full ranking →"
      />
      <SignalColumn
        kind="sell"
        title="What to sell"
        subtitle={`Top signals · ${quarter}`}
        items={sells.map((c) => ({
          ticker: c.ticker,
          name: c.name,
          score: c.score,
          detail:
            c.sellerCount > 0
              ? `${c.sellerCount} manager${c.sellerCount > 1 ? "s" : ""} selling${c.buyerCount > 0 ? ` · ${c.buyerCount} buying` : ""}`
              : `Strong historical exit pressure`,
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
        <div className={`text-[10px] uppercase tracking-wider font-bold ${accent} opacity-60`}>
          {kind === "buy" ? "0 → +100" : "0 → −100"}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-muted py-6 text-center">
          No clean {kind === "buy" ? "buy" : "sell"} signals this quarter.
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((it, i) => {
            const label = convictionLabel(it.score);
            return (
              <li key={it.ticker}>
                <a
                  href={`/signal/${it.ticker}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-bg/40 transition"
                >
                  <div className="text-xs text-dim tabular-nums w-5">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-mono font-bold text-brand">{it.ticker}</div>
                      <div className="text-xs text-muted truncate">{it.name}</div>
                    </div>
                    <div className="text-[11px] text-dim flex items-center gap-2">
                      <span className={`${accent} opacity-80 font-semibold uppercase tracking-wider text-[9px]`}>
                        {label.label}
                      </span>
                      <span>·</span>
                      <span>{it.detail}</span>
                    </div>
                  </div>
                  <div className={`text-base font-bold tabular-nums ${accent}`}>
                    {formatSignedScore(it.score)}
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      )}

      <a
        href={linkHref}
        className={`inline-block mt-4 text-sm ${accent} font-semibold hover:underline`}
      >
        {linkLabel}
      </a>
    </div>
  );
}
