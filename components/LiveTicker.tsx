"use client";
import { useEffect, useRef, useState } from "react";
import { getQuotes, fmtPrice, fmtPct, type LiveQuote } from "@/lib/live";

type Props = {
  symbols: string[];
};

// LiveTicker — marquee-scrolling strip of live quotes at the very top of every
// page. Accessibility hardened in v0.75:
//  1. Respects `prefers-reduced-motion` — no animation for users who asked.
//  2. Pauses on hover AND keyboard focus (prior: hover only — keyboard users stuck).
//  3. Velocity-tuned to 50s instead of 60s — slightly livelier pulse without
//     sacrificing readability.
//  4. `setInterval(60000)` is paused when the tab is hidden (visibility API) —
//     avoids background CPU burn for users with the tab pinned.
export default function LiveTicker({ symbols }: Props) {
  const [quotes, setQuotes] = useState<Record<string, LiveQuote | null>>({});
  const [loaded, setLoaded] = useState(false);
  const symKey = symbols.join(",");
  const tickingRef = useRef(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!tickingRef.current) return; // tab hidden
      const q = await getQuotes(symbols, "1mo");
      if (cancelled) return;
      setQuotes(q);
      setLoaded(true);
    }
    load();
    const id = setInterval(load, 60000);

    function onVis() {
      tickingRef.current = !document.hidden;
      if (!document.hidden) load(); // catch up on tab re-focus
    }
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symKey]);

  // Duplicate list for seamless scroll
  const items = symbols.concat(symbols);

  return (
    <div className="border-b border-border bg-panel/60 overflow-hidden" aria-label="Live market ticker">
      <div className="relative">
        <div
          className="flex gap-8 py-2.5 whitespace-nowrap animate-marquee will-change-transform"
          role="marquee"
          aria-live="off"
        >
          {items.map((sym, i) => {
            const q = quotes[sym.toUpperCase()];
            if (!q) {
              return (
                <span
                  key={`${sym}-${i}`}
                  className="inline-flex items-center gap-2 text-xs text-dim"
                  aria-hidden={i >= symbols.length}
                >
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
                aria-hidden={i >= symbols.length}
                tabIndex={i >= symbols.length ? -1 : 0}
                className="inline-flex items-center gap-2 text-xs hover:opacity-80 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand/40 rounded px-1 transition"
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
          animation: marquee 50s linear infinite;
        }
        /* Pause on mouse hover OR keyboard focus within — a11y. */
        .animate-marquee:hover,
        .animate-marquee:focus-within {
          animation-play-state: paused;
        }
        /* Full stop for users who requested reduced motion — WCAG 2.1 AA. */
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
            transform: none;
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
}
