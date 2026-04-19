// v4.3 (2026-04-19) — honest-relabel disclaimer component.
//
// Context: 2026-04-19 backtest (`scripts/backtest-conviction.ts`) over
// 221 ticker-quarter pairs × 4 quarters found r(ConvictionScore, forward
// alpha) = -0.117. The score is an anti-predictive signal over the
// 2024-Q4 → today window. See `.claude/state/CONVICTION_BACKTEST.md`.
//
// Product response: re-frame rankings as what they ACTUALLY are — a
// smart-money positioning tracker, NOT a stock-picking predictor. This
// component ships on every ranking surface (/best-now, /buys, /sells,
// /biggest-buys, /biggest-sells, /signal/[ticker]) so no user sees a
// conviction number without seeing the caveat.
//
// Not a legal disclaimer. An honesty signal. Users who want depth click
// through to /methodology for the backtest table.

export default function MethodologyDisclaimer() {
  return (
    <div className="mb-8 rounded-xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm">
      <div className="flex items-start gap-3">
        <span aria-hidden className="text-amber-400 font-bold text-base leading-none mt-0.5">ℹ️</span>
        <div className="text-muted leading-relaxed">
          <strong className="text-text">
            HoldLens tracks institutional positioning — it&apos;s not a stock picker.
          </strong>{" "}
          Our 2026 backtest over 221 ticker-quarter pairs found the ConvictionScore
          has{" "}
          <span className="font-semibold text-text">no predictive signal</span>{" "}
          for forward returns (Pearson r = −0.12). The rankings show what the
          best portfolio managers were BUYING and SELLING at the latest 13F —
          useful as market intelligence, not as personal investment advice.
          <div className="mt-2">
            <a href="/methodology#predictive-validity" className="text-amber-400 hover:underline font-semibold">
              See the backtest →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
