"use client";
import { useEffect, useState } from "react";
import { getQuotes, fmtMarketCap } from "@/lib/live";
import { useInView } from "@/lib/useInView";
import { MANAGERS } from "@/lib/managers";

const TIER_ONE_QUALITY = 9;

// Hand-kept list of Tier-1+ manager slugs (quality >= 9)
const TIER_ONE: Set<string> = new Set([
  "warren-buffett",
  "stanley-druckenmiller",
  "seth-klarman",
  "howard-marks",
  "chris-hohn",
  "chuck-akre",
  "terry-smith",
  "stephen-mandel",
]);

// Static aggregates derived once from the bundled 13F dataset — these never
// needed a network call. Computing them at module scope means the three
// non-price stats render server-side / on first paint (no "—" flash, no CLS);
// only the single live-$ figure waits on quotes.
const ALL_HOLDINGS = MANAGERS.flatMap((m) =>
  m.topHoldings.map((h) => ({ ticker: h.ticker, sharesMn: h.sharesMn })),
);
const UNIQUE_TICKERS = Array.from(
  new Set(ALL_HOLDINGS.map((h) => h.ticker.toUpperCase())),
);
const TOTAL_POSITIONS = ALL_HOLDINGS.length;
const TIER_ONE_COUNT = MANAGERS.filter((m) => TIER_ONE.has(m.slug)).length;

export default function LiveStats() {
  // Only the aggregate live-$ value needs quotes. Defer that ~116-symbol
  // fetch until the stats row is near the viewport (it sits below the hero) —
  // this keeps the per-symbol request storm off the initial page load, which
  // was the dominant cause of TTI ~20s + an 18s Lantern LCP estimate. The
  // other three stats are static and render immediately.
  const [totalValue, setTotalValue] = useState<number | null>(null);
  const [rootRef, inView] = useInView<HTMLElement>({ rootMargin: "400px" });

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    (async () => {
      const quotes = await getQuotes(UNIQUE_TICKERS, "1mo");
      if (cancelled) return;
      let tv = 0;
      for (const h of ALL_HOLDINGS) {
        const q = quotes[h.ticker.toUpperCase()];
        if (q) tv += q.price * h.sharesMn * 1e6;
      }
      setTotalValue(tv);
    })();
    return () => {
      cancelled = true;
    };
  }, [inView]);

  const showValue = totalValue && totalValue > 0 ? fmtMarketCap(totalValue) : "—";

  return (
    <section
      ref={rootRef}
      className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-b border-border"
    >
      <Stat big={`${MANAGERS.length}`} label={`Tier-1 managers · ${TIER_ONE_COUNT} elite`} />
      <Stat big={showValue} label="Tracked long positions · live" />
      <Stat big={`${TOTAL_POSITIONS}`} label="Individual positions tracked" />
      <Stat big="Free" label="Core tier forever" />
    </section>
  );
}

function Stat({ big, label }: { big: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-text tabular-nums">{big}</div>
      <div className="text-xs uppercase tracking-wider text-dim mt-1">{label}</div>
    </div>
  );
}

// Ref — keeps TIER_ONE_QUALITY referenced so it ships meaningfully if TIER_ONE is regenerated later
void TIER_ONE_QUALITY;
