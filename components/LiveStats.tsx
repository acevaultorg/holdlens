"use client";
import { useEffect, useState } from "react";
import { getQuotes, fmtMarketCap } from "@/lib/live";
import { MANAGERS } from "@/lib/managers";

type Stats = {
  totalValue: number;   // aggregate live $ across all tracked top holdings
  totalPositions: number;
  uniqueTickers: number;
  tierOneCount: number;
};

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

export default function LiveStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;

    const allHoldings = MANAGERS.flatMap((m) =>
      m.topHoldings.map((h) => ({ slug: m.slug, ticker: h.ticker, sharesMn: h.sharesMn }))
    );
    const uniqueTickers = new Set(allHoldings.map((h) => h.ticker.toUpperCase()));

    async function load() {
      const quotes = await getQuotes(Array.from(uniqueTickers), "1mo");
      if (cancelled) return;

      let totalValue = 0;
      for (const h of allHoldings) {
        const q = quotes[h.ticker.toUpperCase()];
        if (!q) continue;
        totalValue += q.price * h.sharesMn * 1e6;
      }

      setStats({
        totalValue,
        totalPositions: allHoldings.length,
        uniqueTickers: uniqueTickers.size,
        tierOneCount: MANAGERS.filter((m) => TIER_ONE.has(m.slug)).length,
      });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const showValue = stats && stats.totalValue > 0 ? fmtMarketCap(stats.totalValue) : "—";
  const showPositions = stats ? stats.totalPositions.toString() : "—";

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-b border-border">
      <Stat big={`${MANAGERS.length}`} label={`Tier-1 managers · ${stats ? stats.tierOneCount : "—"} elite`} />
      <Stat big={showValue} label="Tracked long positions · live" />
      <Stat big={showPositions} label="Individual positions tracked" />
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
