// ConvictionFactorTable — exposes the per-position factor breakdown that
// drives each ConvictionScore in a manager's portfolio.
//
// Addresses ChatGPT's "score explainability" gap. The 9-factor model in
// lib/conviction.ts (v5) is currently black-box from the UI — you see
// "AAPL: -20" but not WHY. This table shows: for each of the manager's
// top-N positions, what each factor contributed.
//
// Pivot-A safe: descriptive breakdown of factual weights, no verdict
// labels, no recommendations. Factor names match canonical lib API.

import TickerLink from "@/components/TickerLink";
import { getConviction, formatSignedScore } from "@/lib/conviction";
import { getEdgarHoldings } from "@/lib/edgar-data";

const FACTOR_COLS = [
  { key: "smartMoney", label: "Smart $", title: "Manager quality × consensus (0–30)" },
  { key: "insiderBoost", label: "Insider", title: "Form 4 net buy/sell (-15..+20)" },
  { key: "trackRecord", label: "Track", title: "Buyer 10y CAGR × concentration (-10..+20)" },
  { key: "trendStreak", label: "Streak", title: "Multi-quarter compounding (0–10)" },
  { key: "concentration", label: "Conc", title: "Biggest position size as conviction (0–10)" },
  { key: "contrarian", label: "Contra", title: "Under-the-radar bonus (0–10)" },
  { key: "eventSignal", label: "Event", title: "8-K events last 90d (-15..+5)" },
  { key: "dissentPenalty", label: "Dissent", title: "Sells subtract, weighted ×1.6 (0–60)" },
  { key: "crowdingPenalty", label: "Crowd", title: "Too many owners = priced in (0–10)" },
] as const;

function factorCell(value: number): { display: string; cls: string } {
  if (value === 0) return { display: "·", cls: "text-muted/50" };
  if (value > 0) return { display: `+${value.toFixed(0)}`, cls: "text-emerald-400" };
  return { display: value.toFixed(0), cls: "text-rose-400" };
}

export default function ConvictionFactorTable({
  managerSlug,
  managerName,
  topN = 8,
}: {
  managerSlug: string;
  managerName: string;
  topN?: number;
}) {
  const edgar = getEdgarHoldings(managerSlug);
  if (!edgar || !edgar.holdings || edgar.holdings.length === 0) return null;

  // Pick the manager's top-N positions by portfolio weight; pull
  // ConvictionScore + breakdown for each. Try/catch per ticker so a single
  // bad-data ticker doesn't crash the whole investor page render (some
  // EDGAR-derived data paths can hit undefined fields on cold ticker
  // joins — guard added 2026-05-13 alongside lib/{events,conviction,
  // signals,event-score}.ts defensive ticker-string guards).
  const rows = edgar.holdings
    .filter((h) => h.pct > 0 && typeof h.ticker === "string" && h.ticker.length > 0)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, topN)
    .map((h) => {
      try {
        const conv = getConviction(h.ticker);
        return {
          ticker: h.ticker,
          name: h.name,
          pct: h.pct,
          score: conv.signedScore,
          breakdown: conv.breakdown,
        };
      } catch {
        return null;
      }
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  if (rows.length === 0) return null;

  return (
    <section className="mt-12 rounded-2xl border-2 border-border bg-panel p-6 md:p-7">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
        Score explainability · 9-factor breakdown
      </div>
      <h2 className="text-2xl font-bold mb-3">
        What drives the ConvictionScore on{" "}
        {managerName.split(" ").slice(-1)}&apos;s top positions
      </h2>
      <p className="text-sm text-muted mb-6 leading-relaxed max-w-3xl">
        The HoldLens ConvictionScore combines 9 factors. This table shows
        the per-position breakdown — exactly which factors contribute and
        by how much for each of {managerName.split(" ").slice(-1)}&apos;s
        top {Math.min(topN, rows.length)} holdings. Hover any header for
        factor definition. Empty cells (·) = neutral (no contribution).
      </p>

      <div className="overflow-x-auto rounded-xl border border-border bg-bg/30">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-panel/50 text-xs">
              <th className="text-left p-2 font-semibold">Ticker</th>
              <th className="text-right p-2 font-semibold">% port</th>
              <th className="text-right p-2 font-semibold">Score</th>
              {FACTOR_COLS.map((f) => (
                <th
                  key={f.key}
                  className="text-right p-2 font-semibold text-muted"
                  title={f.title}
                >
                  {f.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.ticker}
                className="border-b border-border/40 last:border-b-0 hover:bg-bg/50"
              >
                <td className="p-2">
                  <TickerLink
                    symbol={r.ticker}
                    className="font-semibold text-brand hover:underline"
                  >
                    {r.ticker}
                  </TickerLink>
                </td>
                <td className="p-2 text-right tabular-nums">{r.pct.toFixed(1)}</td>
                <td className="p-2 text-right tabular-nums font-bold">
                  {formatSignedScore(r.score)}
                </td>
                {FACTOR_COLS.map((f) => {
                  const value = r.breakdown[f.key as keyof typeof r.breakdown] as number;
                  const { display, cls } = factorCell(value);
                  return (
                    <td key={f.key} className={`p-2 text-right tabular-nums ${cls}`}>
                      {display}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <details className="mt-5 group">
        <summary className="cursor-pointer text-sm font-semibold text-brand hover:underline">
          Factor definitions →
        </summary>
        <dl className="mt-3 grid sm:grid-cols-2 gap-3 text-xs text-muted">
          {FACTOR_COLS.map((f) => (
            <div key={f.key}>
              <dt className="font-semibold text-text">{f.label}</dt>
              <dd>{f.title}</dd>
            </div>
          ))}
        </dl>
      </details>

      <p className="mt-5 text-xs text-muted leading-relaxed">
        Factors are summed (positive add, penalties subtract), then
        clamped to the -100/+100 range. Each factor has a maximum
        contribution shown in parentheses next to its name. Read
        positive cells as bullish contributions, negative as bearish.
        See <a className="text-brand hover:underline" href="/learn/conviction-score-explained/">/learn/conviction-score-explained</a> for
        the full methodology. ConvictionScore is descriptive synthesis of
        public filings — not investment advice.
      </p>
    </section>
  );
}
