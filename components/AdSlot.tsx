"use client";
// Universal ad slot — HoldLens v0.35 tiered strategy.
//
// Rev-max without hurting UX / retention / SEO:
//   1. CLS protection — every slot reserves min-height before load
//   2. Lazy hydration — adsbygoogle.push() only when slot enters 200px of viewport
//   3. Returning-visitor lite mode — `priority="secondary"` ads hide on 2nd+ visits
//      (first-visit flag in localStorage, written on pagehide so all ads serve
//      on the current page)
//   4. "Remove ads with Pro" micro-CTA — ad fatigue → subscription revenue
//   5. Plausible events — `ad_viewport`, `ad_removed_pro_click` for per-slot RPM audit
//
// Priority tiers:
//   - "primary"   → always render (first ad on any page; only ad on detail pages)
//   - "secondary" → only render for first-visit users (extra ads on learn/info pages)
//
// Activation still just needs the 4 env vars on Cloudflare Pages:
//   NEXT_PUBLIC_ADSENSE_CLIENT, _SLOT_HORIZONTAL, _SLOT_RECTANGLE, _SLOT_INARTICLE

import { useEffect, useId, useRef, useState } from "react";
import { isProUser } from "@/lib/pro";

declare global {
  interface Window {
    adsbygoogle?: object[];
    plausible?: (event: string, opts?: { props?: Record<string, string | number> }) => void;
  }
}

type Format = "horizontal" | "rectangle" | "square" | "in-article";
type Priority = "primary" | "secondary";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
const ADSENSE_SLOT_HORIZONTAL = process.env.NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL || "";
const ADSENSE_SLOT_RECTANGLE = process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE || "";
const ADSENSE_SLOT_INARTICLE = process.env.NEXT_PUBLIC_ADSENSE_SLOT_INARTICLE || "";
const CARBON_SERVE = process.env.NEXT_PUBLIC_CARBON_SERVE || "";
const CARBON_PLACEMENT = process.env.NEXT_PUBLIC_CARBON_PLACEMENT || "";

const VISITED_KEY = "holdlens_visited_v1";

// Module-level cache so every AdSlot on the same page gets the same verdict
// and the flag is only written once (on pagehide, not on mount) — this way
// ALL ads on the first-visit page serve, and only on the SECOND page load
// do "secondary" ads start hiding.
let returnFlagCache: boolean | null = null;

function computeReturnFlag(): boolean {
  if (returnFlagCache !== null) return returnFlagCache;
  if (typeof window === "undefined") return false;
  try {
    const v = window.localStorage.getItem(VISITED_KEY);
    returnFlagCache = !!v;
  } catch {
    returnFlagCache = false;
  }
  if (!returnFlagCache) {
    const writeFlag = () => {
      try {
        window.localStorage.setItem(VISITED_KEY, String(Date.now()));
      } catch {
        // storage blocked — keep showing full ads next session too
      }
    };
    window.addEventListener("pagehide", writeFlag, { once: true });
  }
  return returnFlagCache;
}

function pickAdsenseSlot(format: Format): string {
  if (format === "horizontal") return ADSENSE_SLOT_HORIZONTAL;
  if (format === "in-article") return ADSENSE_SLOT_INARTICLE;
  return ADSENSE_SLOT_RECTANGLE;
}

function minHeightClass(format: Format): string {
  // Reserve space BEFORE the ad loads → prevents CLS → protects Core Web Vitals → protects SEO
  if (format === "rectangle" || format === "square") return "min-h-[280px]";
  if (format === "in-article") return "min-h-[300px]";
  return "min-h-[120px] md:min-h-[110px]"; // horizontal: responsive banner
}

export default function AdSlot({
  format = "horizontal",
  priority = "primary",
  className = "",
}: {
  format?: Format;
  priority?: Priority;
  className?: string;
}) {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hide, setHide] = useState(false);
  const [pro, setPro] = useState(false);
  const pushedRef = useRef(false);

  // Pro = no ads. Check on mount + re-check whenever the user activates
  // Pro (fired from /thank-you post-Stripe-checkout) or reverts.
  useEffect(() => {
    const check = () => setPro(isProUser());
    check();
    window.addEventListener("holdlens:pro:activated", check);
    window.addEventListener("holdlens:pro:deactivated", check);
    // Cross-tab sync: Pro activated in another tab should propagate here
    window.addEventListener("storage", check);
    return () => {
      window.removeEventListener("holdlens:pro:activated", check);
      window.removeEventListener("holdlens:pro:deactivated", check);
      window.removeEventListener("storage", check);
    };
  }, []);

  // Returning-visitor lite mode — only hide SECONDARY ads for returning users
  useEffect(() => {
    if (priority !== "secondary") return;
    if (computeReturnFlag()) setHide(true);
  }, [priority]);

  // Lazy hydration — don't load the ad until it's near the viewport
  useEffect(() => {
    if (hide) return;
    if (!containerRef.current) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const el = containerRef.current;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px 0px 200px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hide]);

  // AdSense push — once inView, push the slot + fire Plausible viewport event
  useEffect(() => {
    if (!inView || hide) return;
    if (pushedRef.current) return;
    if (!ADSENSE_CLIENT) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
      window.plausible?.("ad_viewport", { props: { format, priority } });
    } catch {
      // silent — never break the page if AdSense errors
    }
  }, [inView, hide, format, priority]);

  // Carbon Ads — lazy-inject serve script once inView
  useEffect(() => {
    if (ADSENSE_CLIENT) return; // AdSense takes priority
    if (!inView || hide) return;
    if (!CARBON_SERVE || !CARBON_PLACEMENT) return;
    if (!containerRef.current) return;
    if (containerRef.current.querySelector("script")) return;
    const s = document.createElement("script");
    s.src = `//cdn.carbonads.com/carbon.js?serve=${CARBON_SERVE}&placement=${CARBON_PLACEMENT}`;
    s.id = `_carbonads_js_${id}`;
    s.async = true;
    containerRef.current.appendChild(s);
  }, [inView, hide, id]);

  function handleProClick() {
    try {
      window.plausible?.("ad_removed_pro_click");
    } catch {
      // no-op
    }
  }

  if (pro || hide) return null;

  const mh = minHeightClass(format);

  // 1. Google AdSense
  if (ADSENSE_CLIENT) {
    const slot = pickAdsenseSlot(format);
    return (
      <div
        ref={containerRef}
        className={`my-8 ${mh} ${className}`}
        aria-label="Advertisement"
      >
        <div className="flex items-center justify-between mb-1">
          <div className="text-[10px] uppercase tracking-widest text-dim">Advertisement</div>
          <a
            href="/pricing"
            className="text-[10px] text-dim hover:text-brand transition"
            onClick={handleProClick}
          >
            Remove with Pro →
          </a>
        </div>
        {inView ? (
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={ADSENSE_CLIENT}
            data-ad-slot={slot}
            data-ad-format={format === "rectangle" ? "rectangle" : "auto"}
            data-full-width-responsive="true"
          />
        ) : null}
      </div>
    );
  }

  // 2. Carbon Ads
  if (CARBON_SERVE && CARBON_PLACEMENT) {
    return (
      <div
        ref={containerRef}
        id={`carbon-slot-${id}`}
        className={`my-8 ${mh} ${className}`}
        aria-label="Sponsored"
      />
    );
  }

  // 3. Fallback — subscription upsell (better than empty space)
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
