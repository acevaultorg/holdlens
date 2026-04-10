"use client";
import { useEffect, useState } from "react";
import { getQuotes, fmtPrice, fmtPct, type LiveQuote } from "@/lib/live";

type Props = {
  symbols: string[];
};

export default function LiveTicker({ symbols }: Props) {
  const [quotes, setQuotes] = useState<Record<string, LiveQuote | null>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const q = await getQuotes(symbols, "1mo");
      if (cancelled) return;
      setQuotes(q);
      setLoaded(true);
    }
    load();
    const id = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [symbols.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  // Duplicate list for seamless scroll
  const items = symbols.concat(symbols);

  return (
    <div className="border-b border-border bg-panel/60 overflow-hidden">
      <div className="relative">
        <div className="flex gap-8 py-2.5 whitespace-nowrap animate-marquee will-change-transform">
          {items.map((sym, i) => {
            const q = quotes[sym.toUpperCase()];
            if (!q) {
              return (
                <span key={`${sym}-${i}`} className="inline-flex items-center gap-2 text-xs text-dim">
                  <span className="font-mono font-semibold">{sym}</span>
                  <span className="tabular-nums">{loaded ? "—" : "…"}</span>
                </span>
              );
            }
            const up = q.dayChange >= 0;
            const color = up ? "text-emerald-400" : "text-rose-400";
            return (
              <a
                key={`${sym}-${i}`}
                href={`/ticker/${sym}`}
                className="inline-flex items-center gap-2 text-xs hover:opacity-80 transition"
              >
                <span className="font-mono font-semibold text-text">{sym}</span>
                <span className="tabular-nums text-muted">{fmtPrice(q.price, q.currency)}</span>
                <span className={`tabular-nums font-semibold ${color}`}>
                  {up ? "▲" : "▼"} {fmtPct(q.dayChangePct)}
                </span>
              </a>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
