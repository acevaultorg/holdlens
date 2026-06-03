"use client";
import { useEffect, useRef, useState } from "react";

// useInView — fire once when an element first nears the viewport.
//
// WHY (perf, 2026-06-03): the homepage was firing ~131 client-side Yahoo
// quote fetches on load (LiveStats alone fetched ~116 unique tickers across
// every tracked manager's holdings; LiveTicker fetched 15 — even on mobile
// where it's display:none). One fetch per symbol. That request storm kept the
// network + main thread busy ~20s (Lighthouse TTI 20.8s) and inflated the
// Lantern-simulated LCP estimate to 18s. Gating each live-data widget's fetch
// behind "is it actually near the viewport?" keeps those fetches off the
// initial critical path entirely — the widgets fetch when scrolled to (which
// is the only time the user can see them anyway). Behaviour is identical to
// the user; the fetches just no longer block first load.
//
// SSR-safe: returns inView=false until mounted. If IntersectionObserver is
// unavailable (very old browsers, or a display:none element that never
// intersects), the fetch simply never fires for that instance — acceptable,
// since a hidden widget has nothing to render anyway.
export function useInView<T extends Element = HTMLDivElement>(
  opts: { rootMargin?: string; once?: boolean } = {},
): [React.RefObject<T | null>, boolean] {
  const { rootMargin = "300px", once = true } = opts;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Fallback for environments without IntersectionObserver: render eagerly
    // rather than never (matches pre-gating behaviour).
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            if (once) {
              io.disconnect();
              return;
            }
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, once]);

  return [ref, inView];
}
