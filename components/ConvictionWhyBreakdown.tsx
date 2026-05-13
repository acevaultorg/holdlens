// ConvictionWhyBreakdown — single-ticker 9-factor explainer (v0.59, 2026-05-13)
//
// Addresses ChatGPT's 2026-05-13 critique: "ConvictionScore is a black box
// dressed as objectivity. Combining consensus + track record + concentration
// + trend + dissent into one number requires weights nobody can justify."
//
// Per-position factor breakdown for a SINGLE ticker. Renders inline below
// the score display on /signal/[ticker]/ + /ticker/[symbol]/ pages.
// Native HTML <details> (no client JS), so it stays inside static export +
// is SEO-readable (Google + LLM crawlers see all 9 factor cells expanded
// by default in their DOM parse).
//
// Color grammar: emerald = positive contribution; rose = penalty; muted = neutral.
// Maximum-range labels shown so users see "5/30 smartMoney" not just "5".

import { getConviction, formatSignedScore } from "@/lib/conviction";

const FACTOR_ROWS: Array<{
  key: keyof Awaited<ReturnType<typeof getConviction>>["breakdown"];
  label: string;
  max: number;
  min: number;
  desc: string;
}> = [
  {
    key: "smartMoney",
    label: "Smart money",
    max: 30,
    min: 0,
    desc: "Sum of buyer manager quality × consensus (number of managers buying weighted by track record).",
  },
  {
    key: "insiderBoost",
    label: "Insider activity",
    max: 20,
    min: -15,
    desc: "Form 4 CEO/CFO/director discretionary buys (+) or sells (−) in last 90 days.",
  },
  {
    key: "trackRecord",
    label: "Track record",
    max: 20,
    min: -10,
    desc: "Buyer's 10-year compound annual return × position concentration. Pros placing big bets count more.",
  },
  {
    key: "trendStreak",
    label: "Trend streak",
    max: 10,
    min: 0,
    desc: "Multi-quarter compounding — managers adding for 3+ consecutive quarters.",
  },
  {
    key: "concentration",
    label: "Concentration",
    max: 10,
    min: 0,
    desc: "Biggest position size among buyers — proves conviction.",
  },
  {
    key: "contrarian",
    label: "Contrarian bonus",
    max: 10,
    min: 0,
    desc: "Under-the-radar — fewer total managers know about it = more upside if right.",
  },
  {
    key: "eventSignal",
    label: "8-K events",
    max: 5,
    min: -15,
    desc: "Material events filed last 90 days — Chapter 11 (−), CEO change, M&A, etc.",
  },
  {
    key: "dissentPenalty",
    label: "Dissent",
    max: 0,
    min: -40,
    desc: "Sellers subtract from the buy signal — weighted ×1.6 relative to buys.",
  },
  {
    key: "crowdingPenalty",
    label: "Crowding",
    max: 0,
    min: -10,
    desc: "Too many managers holding = price already reflects consensus = less upside.",
  },
];

function cellColor(value: number): { display: string; cls: string } {
  if (value === 0) return { display: "0", cls: "text-muted/60" };
  if (value > 0) return { display: `+${Math.round(value)}`, cls: "text-emerald-400 font-semibold" };
  return { display: Math.round(value).toString(), cls: "text-rose-400 font-semibold" };
}

export default function ConvictionWhyBreakdown({
  ticker,
  showHeader = true,
}: {
  ticker: string;
  showHeader?: boolean;
}) {
  let conv;
  try {
    conv = getConviction(ticker);
  } catch {
    return null;
  }
  if (!conv || !conv.breakdown) return null;

  const rows = FACTOR_ROWS.map((f) => {
    const value = conv.breakdown[f.key] as number;
    const { display, cls } = cellColor(value);
    return { ...f, value, display, cls };
  });

  // Sum visualization — show that the 9 factors literally add up to the score
  const computed = rows.reduce((s, r) => s + r.value, 0);

  return (
    <details className="mt-6 rounded-2xl border border-border bg-panel group">
      <summary className="cursor-pointer select-none px-5 py-4 flex items-center justify-between hover:bg-bg/30 transition">
        <div>
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-0.5">
            Why this score?
          </div>
          <div className="text-sm text-text">
            See the 9 factors that produced {formatSignedScore(conv.score)} for {conv.ticker}
          </div>
        </div>
        <span
          className="text-muted text-sm group-open:rotate-180 transition-transform"
          aria-hidden
        >
          ▼
        </span>
      </summary>

      <div className="px-5 pb-5 border-t border-border">
        {showHeader && (
          <p className="text-xs text-muted leading-relaxed mb-4 mt-4 max-w-2xl">
            HoldLens&apos;s ConvictionScore is the sum of 9 factors clamped to
            −100/+100. Each factor has a known min/max range; the math is
            deterministic and reproducible. Every input traces to a public SEC
            filing.{" "}
            <a
              href="/learn/conviction-score-explained/"
              className="text-brand hover:underline"
            >
              Full methodology →
            </a>
          </p>
        )}

        <div className="overflow-x-auto rounded-xl border border-border bg-bg/30">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-widest text-muted">
              <tr className="border-b border-border bg-panel/40">
                <th className="text-left p-3 font-semibold">Factor</th>
                <th className="text-right p-3 font-semibold">Contribution</th>
                <th className="text-right p-3 font-semibold hidden sm:table-cell">Range</th>
                <th className="text-left p-3 font-semibold hidden md:table-cell">What it measures</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className="border-b border-border/40 last:border-b-0">
                  <td className="p-3 font-semibold text-text">{r.label}</td>
                  <td className={`p-3 text-right tabular-nums ${r.cls}`}>{r.display}</td>
                  <td className="p-3 text-right tabular-nums text-muted text-xs hidden sm:table-cell">
                    {r.min === 0 ? `0 to +${r.max}` : `${r.min} to +${r.max}`}
                  </td>
                  <td className="p-3 text-xs text-muted leading-relaxed hidden md:table-cell">
                    {r.desc}
                  </td>
                </tr>
              ))}
              <tr className="bg-panel/30 font-bold">
                <td className="p-3 text-text">Sum (clamped −100/+100)</td>
                <td className="p-3 text-right tabular-nums text-text">
                  {formatSignedScore(conv.score)}
                </td>
                <td className="p-3 text-right tabular-nums text-muted text-xs hidden sm:table-cell">
                  −100 to +100
                </td>
                <td className="p-3 text-xs text-muted leading-relaxed hidden md:table-cell">
                  {computed !== conv.score && (
                    <span className="text-amber-400">
                      (raw sum {Math.round(computed)} clamped to score {Math.round(conv.score)})
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-muted leading-relaxed">
          <strong className="text-text">How to read:</strong> emerald = positive
          contribution to the buy signal; rose = penalty (sellers, crowded
          ownership, bearish 8-K events). Hover any factor name in the
          methodology page for the exact formula. Every number is computed at
          build time from EDGAR filings — no proprietary opinion layer, no
          editorial scoring.{" "}
          {conv.buyerCount > 0 && conv.sellerCount > 0 && (
            <span>
              For {conv.ticker} specifically:{" "}
              <span className="text-text font-semibold">{conv.buyerCount} buyers</span>{" "}
              vs <span className="text-text font-semibold">{conv.sellerCount} sellers</span>{" "}
              among the 30 tracked managers.
            </span>
          )}
        </p>
      </div>
    </details>
  );
}
