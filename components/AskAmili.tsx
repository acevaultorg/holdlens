"use client";

// Ask Amili bar (2026-09-24, Amili order; same shared embed as whenplant / colorcombinations /
// dormbyschool: taskpeace.com/ask/amili-ask.js). Answers come only from this site's own pages via
// /amili-index.json (scripts/build-amili-index.mjs, run after `next build`). Questions are logged
// anonymously by the embed (stated on /privacy/).
//
// Why the script is inserted from useEffect and not with a static <script> tag: the embed scans
// for [data-amili-ask] ONCE when it runs, so after a client-side (Link) navigation a new page's
// bar would stay empty. Re-inserting the script on mount re-runs that scan; the embed skips any
// bar that already has its shadow root, so a second run never doubles a bar.
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    __amiliAskGA?: number;
    gtag?: (...args: unknown[]) => void;
  }
}

export default function AskAmili() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const wrap = ref.current;
    if (!wrap) return;
    if (!window.__amiliAskGA) {
      window.__amiliAskGA = 1;
      document.addEventListener("amili:ask", (e) => {
        try {
          const d = ((e as CustomEvent).detail || {}) as { query?: string; resultCount?: number; clicked?: boolean };
          window.gtag?.("event", "amili_ask", {
            search_term: String(d.query || "").slice(0, 100),
            results: d.resultCount,
            clicked: !!d.clicked,
          });
        } catch {}
      });
    }
    const s = document.createElement("script");
    s.src = "https://taskpeace.com/ask/amili-ask.js";
    s.setAttribute("data-site", "holdlens.com");
    wrap.appendChild(s);
    return () => {
      s.remove();
    };
  }, []);
  return (
    <div ref={ref} className="my-5">
      <div data-amili-ask />
    </div>
  );
}
