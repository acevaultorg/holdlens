"use client";

import { useState } from "react";

// <TickerLogo /> — renders a square company logo for a stock ticker.
//
// Source: assets.parqet.com/logos/symbol/{TICKER} (free, no auth, SVG).
// Parqet's ticker-symbol endpoint covers the full US/EU/UK equity universe
// that HoldLens tracks; for BRK.B we normalize to BRK-B (same dash rule
// as toYahooSymbol() in lib/live.ts) so the CDN routes correctly.
//
// If Parqet's image fails to load (unknown ticker, CDN blip), we fall
// back to a deterministic colored circle with the ticker's first letter.
// The fallback is keyed off the ticker itself so every instance of the
// same ticker shows the same color — visual consistency across pages.
//
// Respects dark-mode by setting a subtle dark backdrop behind transparent
// SVGs so logos don't get lost on the #0d0d0d canvas.
//
// Usage:
//   <TickerLogo symbol="AAPL" size={32} />
//   <TickerLogo symbol="BRK.B" size={24} className="shrink-0" />

type Size = number;
type Props = {
  symbol: string;
  size?: Size;
  className?: string;
  /** Override the alt text (default: "${symbol} logo"). */
  alt?: string;
};

const PARQET_BASE = "https://assets.parqet.com/logos/symbol/";

// Ticker → hue (0–359) for fallback initial circle. Uses a fast string
// hash so identical tickers always map to the same color across pages.
function tickerHue(sym: string): number {
  let h = 0;
  for (let i = 0; i < sym.length; i++) h = (h * 31 + sym.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

function toParqetSymbol(sym: string): string {
  return sym.toUpperCase().trim().replace(/[./]/g, "-");
}

export default function TickerLogo({ symbol, size = 32, className = "", alt }: Props) {
  const [failed, setFailed] = useState(false);
  const sym = symbol.toUpperCase().trim();

  if (failed || !sym) {
    const hue = tickerHue(sym || "?");
    return (
      <span
        aria-hidden="true"
        className={`inline-flex items-center justify-center shrink-0 rounded-md font-bold text-[10px] tracking-wide ${className}`}
        style={{
          width: size,
          height: size,
          background: `hsl(${hue} 60% 18%)`,
          color: `hsl(${hue} 80% 72%)`,
          fontSize: Math.max(9, size * 0.38),
          lineHeight: 1,
        }}
      >
        {sym.slice(0, sym.length >= 4 ? 3 : 2) || "?"}
      </span>
    );
  }

  return (
    <img
      src={`${PARQET_BASE}${encodeURIComponent(toParqetSymbol(sym))}`}
      alt={alt ?? `${sym} logo`}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`inline-block shrink-0 rounded-md bg-white/5 border border-border/40 object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
