"use client";

import { useState, useEffect } from "react";

type Variant = "A" | "B" | "C";

const PRICES: Record<Variant, { monthly: number; annual: number; save: number }> = {
  A: { monthly: 13, annual: 130, save: 26 },
  B: { monthly: 14, annual: 140, save: 28 },
  C: { monthly: 15, annual: 150, save: 30 },
};

const COOKIE_NAME = "hl_price_variant";
const COOKIE_DAYS = 90;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const d = new Date();
  d.setTime(d.getTime() + days * 86400000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

function pickVariant(): Variant {
  const existing = getCookie(COOKIE_NAME);
  if (existing === "A" || existing === "B" || existing === "C") return existing;
  const r = Math.random();
  const v: Variant = r < 0.33 ? "A" : r < 0.66 ? "B" : "C";
  setCookie(COOKIE_NAME, v, COOKIE_DAYS);
  return v;
}

/**
 * Client component that renders the Pro price with AB test segmentation.
 * Variants: A=$13/mo, B=$14/mo (control), C=$15/mo.
 * Sticky via 90-day cookie. Logged to Plausible on mount.
 */
export function usePriceVariant() {
  const [variant, setVariant] = useState<Variant>("B"); // SSR default
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const v = pickVariant();
    setVariant(v);
    setMounted(true);
    // Log to Plausible
    if (typeof window !== "undefined" && (window as any).plausible) {
      (window as any).plausible("Pricing View", { props: { variant: v, price: PRICES[v].monthly } });
    }
  }, []);

  return { variant, price: PRICES[variant], mounted };
}

/** Drop-in replacement for the Pro price headline. */
export function ProPriceDisplay() {
  const { price } = usePriceVariant();
  return (
    <>
      <div className="flex items-baseline gap-2 mb-1">
        <div className="text-5xl font-bold tabular-nums">${price.monthly}</div>
        <div className="text-sm text-muted">/month</div>
      </div>
      <div className="text-sm text-muted mb-6">
        ${price.annual}/year (save ${price.save}) · cancel anytime
      </div>
    </>
  );
}

/** Drop-in for the hero subtitle price. */
export function HeroPriceTag() {
  const { price } = usePriceVariant();
  return <>${price.monthly}/mo</>;
}
