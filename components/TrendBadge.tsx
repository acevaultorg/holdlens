// Server component — deterministic data from signals.ts, no client code.
// Shows a compact multi-quarter conviction indicator for a ticker.
import { getTickerTrend } from "@/lib/signals";

type Size = "sm" | "md";

export default function TrendBadge({ ticker, size = "sm" }: { ticker: string; size?: Size }) {
  const trend = getTickerTrend(ticker);
  const topBuy = trend.consistentBuyers[0];
  const topSell = trend.consistentSellers[0];

  // Prioritize the stronger streak
  const buyStreak = topBuy?.streak ?? 0;
  const sellStreak = topSell?.streak ?? 0;

  if (buyStreak < 2 && sellStreak < 2) return null;

  const isBuy = buyStreak >= sellStreak;
  const streak = isBuy ? buyStreak : sellStreak;
  const label = isBuy ? `${streak}Q BUY` : `${streak}Q SELL`;
  const color = isBuy
    ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
    : "text-rose-400 bg-rose-400/10 border-rose-400/30";

  const pad = size === "md" ? "px-2 py-0.5 text-[11px]" : "px-1.5 py-0.5 text-[9px]";

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded border ${color} ${pad}`}
      title={`${streak}-quarter consecutive ${isBuy ? "buying" : "selling"} streak by ${isBuy ? topBuy?.slug : topSell?.slug}`}
    >
      {label}
    </span>
  );
}
