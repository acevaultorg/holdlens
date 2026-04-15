"use client";

import { useState } from "react";
import { fundDomainFor } from "@/lib/fund-domains";

// <FundLogo /> — renders a square favicon/logo for a manager's fund.
//
// Source: icons.duckduckgo.com/ip3/{domain}.ico (free, no auth, stable
// 32×32 PNGs with strong cache headers). DDG chosen over Google Favicons
// because Google redirects to a gstatic URL that 404s intermittently;
// DDG serves the same bytes from its CDN edge every time.
//
// When the manager has no mapped fund domain in lib/fund-domains.ts,
// or the favicon request fails, we fall back to a deterministic colored
// circle containing the manager's initials — visually consistent with
// <TickerLogo />'s fallback so the two coexist on the same page without
// looking like a patchwork of styles.
//
// Usage:
//   <FundLogo slug="warren-buffett" name="Warren Buffett" size={32} />
//   <FundLogo slug="bill-ackman"    name="Bill Ackman"    size={24} className="mr-2" />

type Props = {
  slug: string;
  name: string;
  size?: number;
  className?: string;
};

const DDG_BASE = "https://icons.duckduckgo.com/ip3/";

// Stable hash → hue. Mirrors the palette in <TickerLogo /> but biased
// toward the warm/amber half of the wheel so funds are visually distinct
// from tickers at a glance.
function slugHue(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 37 + slug.charCodeAt(i)) | 0;
  // Bias toward [20, 200] so managers don't collide with the brand/emerald
  // palette used for tickers.
  return (Math.abs(h) % 180) + 20;
}

function initialsFromName(name: string): string {
  const parts = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (parts.length === 0) return "?";
  return parts
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default function FundLogo({ slug, name, size = 32, className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  const domain = fundDomainFor(slug);

  if (!domain || failed) {
    const hue = slugHue(slug);
    return (
      <span
        aria-hidden="true"
        className={`inline-flex items-center justify-center shrink-0 rounded-full font-bold text-[10px] ${className}`}
        style={{
          width: size,
          height: size,
          background: `hsl(${hue} 45% 18%)`,
          color: `hsl(${hue} 80% 72%)`,
          fontSize: Math.max(9, size * 0.4),
          lineHeight: 1,
        }}
      >
        {initialsFromName(name)}
      </span>
    );
  }

  return (
    <img
      src={`${DDG_BASE}${encodeURIComponent(domain)}.ico`}
      alt={`${name} fund logo`}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`inline-block shrink-0 rounded-full bg-white/5 border border-border/40 object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
