// Homepage signal cards — single signed −100..+100 conviction scale.
//
// A ticker can NEVER appear on both sides because each ticker has exactly
// one signed score and we filter cleanly on its sign. The number shown is
// the actual signed value (+42 for buys, −18 for sells), not a separate
// per-list rating.
//
// v1.48 — MAGNITUDE-TIERED SATURATION (UX audit): scores of +41 / +35 /
// +33 / +32 / +27 were all painted full `emerald-400`, erasing visual
// differentiation. The eye read them as equally-strong signals. Tiered
// opacity now encodes magnitude AT A GLANCE:
//   |score| ≥ 40 → full opacity (strongest — visual "loud")
//   |score| ≥ 25 → /85 opacity (moderate)
//   |score| <  25 → /65 opacity (weakest — visual "quiet")
// Applied to BOTH the number AND the verdict chip. Also: buyer/seller
// counts now split-color (emerald for "buying", rose for "selling") so
// cross-pressure is visible at a glance on the detail line.
import { getAllConvictionScores, convictionLabel, formatSignedScore, DEAD_ZONE, type ConvictionBreakdown } from "@/lib/conviction";
import { QUARTER_LABELS, LATEST_QUARTER } from "@/lib/moves";
import { magnitudeTier, SCORE_CLASS, CHIP_CLASS } from "@/lib/signal-colors";
import TickerLogo from "@/components/TickerLogo";

// v1.48.2 — magnitude-tier helpers extracted to `lib/signal-colors.ts` so
// LatestMoves (homepage table) can share the same palette + tier logic.
// Rationale, WCAG analysis, and Tailwind JIT trap notes moved to that
// file's header so there's one source of truth.

// v5 — drivenBy: read the ConvictionBreakdown and surface the top 2
// contributing components so the headline score isn't a black box. Buy
// rows surface positive contributors; sell rows surface negative ones.
// Returns labeled {label, value} pairs ready for inline display.
function drivenBy(b: ConvictionBreakdown, kind: "buy" | "sell"): { label: string; value: number }[] {
  const positives: { label: string; value: number }[] = [
    { label: "Smart money", value: b.smartMoney },
    { label: "Insider buys", value: b.insiderBoost > 0 ? b.insiderBoost : 0 },
    { label: "Track record", value: b.trackRecord > 0 ? b.trackRecord : 0 },
    { label: "Trend streak", value: b.trendStreak },
    { label: "Concentration", value: b.concentration },
    { label: "Contrarian", value: b.contrarian },
    { label: "Event signal", value: b.eventSignal > 0 ? b.eventSignal : 0 },
  ];
  const negatives: { label: string; value: number }[] = [
    { label: "Dissent", value: b.dissentPenalty },
    { label: "Crowding", value: b.crowdingPenalty },
    { label: "Insider sells", value: b.insiderBoost < 0 ? -b.insiderBoost : 0 },
    { label: "Track record drag", value: b.trackRecord < 0 ? -b.trackRecord : 0 },
    { label: "Event risk", value: b.eventSignal < 0 ? -b.eventSignal : 0 },
  ];
  const pool = kind === "buy" ? positives : negatives;
  return pool
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 2)
    .map((d) => ({ label: d.label, value: kind === "buy" ? d.value : -d.value }));
}

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
          buyerCount: c.buyerCount,
          sellerCount: c.sellerCount,
          breakdown: c.breakdown,
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
          buyerCount: c.buyerCount,
          sellerCount: c.sellerCount,
          breakdown: c.breakdown,
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
  items: {
    ticker: string;
    name: string;
    score: number;
    buyerCount: number;
    sellerCount: number;
    breakdown: ConvictionBreakdown;
  }[];
  linkHref: string;
  linkLabel: string;
  quarterHref?: string;
  quarterLabel?: string;
}) {
  // Static class literals — Tailwind JIT picks them up at build time.
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
            Signed −100…+100 · top picks 25–50
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
            // v1.48 — magnitude-tiered opacity: strongest scores punch full,
            // weaker ones recede. Eye reads rank at a glance without having
            // to compare numbers digit-by-digit.
            const tier = magnitudeTier(it.score);
            const scoreColor = SCORE_CLASS[kind][tier];
            const chipColor = CHIP_CLASS[kind][tier];
            // v1.48 — split-color detail: "buying" gets emerald, "selling"
            // gets rose, separators stay dim. Visible cross-pressure at a
            // glance — a buy with managers also selling is now obviously
            // contested vs. a clean buy with zero sellers.
            const hasBuyers = it.buyerCount > 0;
            const hasSellers = it.sellerCount > 0;
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
                    <div className="text-[11px] text-dim flex items-center gap-1.5 flex-wrap">
                      <span className={`${chipColor} font-semibold uppercase tracking-wider text-[9px]`}>
                        {label.label}
                      </span>
                      <span className="text-dim">·</span>
                      {hasBuyers || hasSellers ? (
                        <>
                          {hasBuyers && (
                            <span className="text-emerald-400/80 font-semibold">
                              {it.buyerCount} buying
                            </span>
                          )}
                          {hasBuyers && hasSellers && <span className="text-dim">·</span>}
                          {hasSellers && (
                            <span className="text-rose-400/80 font-semibold">
                              {it.sellerCount} selling
                            </span>
                          )}
                        </>
                      ) : (
                        <span>
                          {kind === "buy"
                            ? "Strong historical conviction"
                            : "Strong historical exit pressure"}
                        </span>
                      )}
                    </div>
                    {/* v5 — "Driven by" subline: surface the top 2 breakdown
                        components so the score isn't a black box. Built from
                        ConvictionBreakdown which already exists per row. */}
                    <div className="text-[10px] text-dim/80 mt-0.5 truncate">
                      Driven by:{" "}
                      {drivenBy(it.breakdown, kind).map((d, j, arr) => (
                        <span key={d.label}>
                          <span className="text-muted">{d.label}</span>
                          <span className="text-dim/60"> {d.value > 0 ? "+" : ""}{d.value}</span>
                          {j < arr.length - 1 && <span className="text-dim/40"> · </span>}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={`text-base font-bold tabular-nums ${scoreColor}`}>
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
