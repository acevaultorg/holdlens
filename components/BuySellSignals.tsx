// Homepage signal cards — single signed −100..+100 conviction scale.
//
// A ticker can NEVER appear on both sides because each ticker has exactly
// one signed score and we filter cleanly on its sign. The number shown is
// the actual signed value (+42 for buys, −18 for sells), not a separate
// per-list rating.
import { getAllConvictionScores, convictionLabel, formatSignedScore, DEAD_ZONE } from "@/lib/conviction";
import { QUARTER_LABELS, LATEST_QUARTER } from "@/lib/moves";
import TickerLogo from "@/components/TickerLogo";

// Server component — renders at build time. The data is static per build.
export default function BuySellSignals() {
  const all = getAllConvictionScores();
  const buys = all.filter((c) => c.score > DEAD_ZONE).slice(0, 5);
  const sells = all
    .filter((c) => c.score < -DEAD_ZONE)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);
  const quarter = QUARTER_LABELS[LATEST_QUARTER];
  // URL slug for the per-quarter digest page. LATEST_QUARTER is `2025-Q4`;
  // route param is lowercase (/quarter/2025-q4).
  const quarterSlug = LATEST_QUARTER.toLowerCase();

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <SignalColumn
        kind="buy"
        title="What to buy"
        subtitle={`Top signals · ${quarter} filings`}
        quarterHref={`/quarter/${quarterSlug}`}
        quarterLabel={quarter}
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
        subtitle={`Top signals · ${quarter} filings`}
        quarterHref={`/quarter/${quarterSlug}`}
        quarterLabel={quarter}
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
  quarterHref,
  quarterLabel,
}: {
  kind: "buy" | "sell";
  title: string;
  subtitle: string;
  items: { ticker: string; name: string; score: number; detail: string }[];
  linkHref: string;
  linkLabel: string;
  quarterHref?: string;
  quarterLabel?: string;
}) {
  const accent = kind === "buy" ? "text-emerald-400" : "text-rose-400";
  const accentBg = kind === "buy" ? "bg-emerald-400/5" : "bg-rose-400/5";
  const accentBorder = kind === "buy" ? "border-emerald-400/20" : "border-rose-400/20";

  return (
    <div className={`rounded-2xl border ${accentBorder} ${accentBg} p-6`}>
      <div className="flex items-baseline justify-between mb-5 gap-3">
        <div className="min-w-0">
          <div className={`text-[10px] uppercase tracking-widest font-bold ${accent}`}>{subtitle}</div>
          <h3 className="text-2xl font-bold mt-1">{title}</h3>
        </div>
        {/* ConvictionScore attribution — names the proprietary metric so the
            scoring isn't mistaken for generic data. Links to the explainer
            page, giving curious readers a one-click path to the methodology. */}
        <a
          href="/learn/conviction-score-explained"
          className={`shrink-0 text-right text-[10px] uppercase tracking-wider font-bold ${accent} opacity-70 hover:opacity-100 transition`}
          title="Learn how ConvictionScore is calculated"
        >
          <div>ConvictionScore →</div>
          <div className="opacity-70 normal-case tracking-normal mt-0.5">
            {kind === "buy" ? "0 → +100" : "0 → −100"}
          </div>
        </a>
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
                  <TickerLogo symbol={it.ticker} size={32} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {/* v1.07 — ticker was text-brand (amber), violating the v1.05
                          brand rule ("amber is earned, not free — reserved for Pro /
                          primary CTA / trust signal"). Switched to text-text (neutral
                          strong). Consistent across every feed surface site-wide. */}
                      <div className="font-mono font-bold text-text">{it.ticker}</div>
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

      <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
        <a
          href={linkHref}
          className={`text-sm ${accent} font-semibold hover:underline`}
        >
          {linkLabel}
        </a>
        {quarterHref && quarterLabel && (
          <a
            href={quarterHref}
            className="text-[11px] text-dim hover:text-text transition"
            title={`${quarterLabel} full quarter digest — filings summary, newly filed positions, and exits for this quarter`}
          >
            {quarterLabel} digest →
          </a>
        )}
      </div>
    </div>
  );
}
