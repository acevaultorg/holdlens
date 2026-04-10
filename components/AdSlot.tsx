"use client";
// Universal ad slot. Reads env vars to decide which network to render.
//
// Operator activation:
//   1. Get a Google AdSense client ID (e.g. ca-pub-1234567890123456) — apply at adsense.google.com
//      Set NEXT_PUBLIC_ADSENSE_CLIENT in Cloudflare Pages env vars + redeploy → ads serve.
//   2. OR get a Carbon Ads serve code (carbonads.net, designer-friendly, fast approval)
//      Set NEXT_PUBLIC_CARBON_SERVE + NEXT_PUBLIC_CARBON_PLACEMENT → Carbon serves.
//   3. If neither is set, the component renders an unobtrusive placeholder linking to /pricing
//      so the slot still drives some revenue (subscription upsell instead of zero revenue).
//
// All slot positions use this same component. Operator gets to flip a switch and ads start
// rendering everywhere at once.

import { useEffect, useId, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: object[];
  }
}

type Format = "horizontal" | "rectangle" | "square" | "in-article";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
const ADSENSE_SLOT_HORIZONTAL = process.env.NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL || "";
const ADSENSE_SLOT_RECTANGLE = process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE || "";
const ADSENSE_SLOT_INARTICLE = process.env.NEXT_PUBLIC_ADSENSE_SLOT_INARTICLE || "";
const CARBON_SERVE = process.env.NEXT_PUBLIC_CARBON_SERVE || "";
const CARBON_PLACEMENT = process.env.NEXT_PUBLIC_CARBON_PLACEMENT || "";

function pickAdsenseSlot(format: Format): string {
  if (format === "horizontal") return ADSENSE_SLOT_HORIZONTAL;
  if (format === "in-article") return ADSENSE_SLOT_INARTICLE;
  return ADSENSE_SLOT_RECTANGLE;
}

export default function AdSlot({
  format = "horizontal",
  className = "",
}: {
  format?: Format;
  className?: string;
}) {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  // AdSense activation: load script + push ad on mount
  useEffect(() => {
    if (!ADSENSE_CLIENT) return;
    try {
      // Load the AdSense loader once
      const existing = document.querySelector(
        `script[src*="adsbygoogle.js?client=${ADSENSE_CLIENT}"]`
      );
      if (!existing) {
        const s = document.createElement("script");
        s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
        s.async = true;
        s.crossOrigin = "anonymous";
        document.head.appendChild(s);
      }
      // Push the slot
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Silent — don't break the page if AdSense errors
    }
  }, []);

  // Carbon Ads activation: inject the serve script into our container
  useEffect(() => {
    if (ADSENSE_CLIENT) return; // AdSense takes priority
    if (!CARBON_SERVE || !CARBON_PLACEMENT) return;
    if (!containerRef.current) return;
    if (containerRef.current.querySelector("script")) return;
    const s = document.createElement("script");
    s.src = `//cdn.carbonads.com/carbon.js?serve=${CARBON_SERVE}&placement=${CARBON_PLACEMENT}`;
    s.id = `_carbonads_js_${id}`;
    s.async = true;
    containerRef.current.appendChild(s);
  }, [id]);

  // ----- Render branches -----

  // 1. Google AdSense
  if (ADSENSE_CLIENT) {
    const slot = pickAdsenseSlot(format);
    return (
      <div className={`my-8 ${className}`} aria-label="Advertisement">
        <div className="text-[10px] uppercase tracking-widest text-dim mb-1">Advertisement</div>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format={format === "rectangle" ? "rectangle" : "auto"}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // 2. Carbon Ads
  if (CARBON_SERVE && CARBON_PLACEMENT) {
    return (
      <div
        ref={containerRef}
        id={`carbon-slot-${id}`}
        className={`my-8 ${className}`}
        aria-label="Sponsored"
      />
    );
  }

  // 3. Fallback: subscription upsell
  // Better than empty space — drives Pro tier signups instead of nothing.
  return (
    <a
      href="/pricing"
      className={`my-8 block rounded-2xl border border-brand/30 bg-brand/5 p-5 hover:bg-brand/10 transition group ${className}`}
      aria-label="Upgrade to HoldLens Pro"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-brand mb-1">
            HoldLens Pro · Founders pricing
          </div>
          <div className="text-base font-bold text-text group-hover:text-brand transition">
            Email alerts + conviction scores + alpha attribution
          </div>
          <div className="text-xs text-muted mt-1">$14/mo · cancel anytime · lock in for life</div>
        </div>
        <div className="text-brand font-semibold text-sm">See pricing →</div>
      </div>
    </a>
  );
}
