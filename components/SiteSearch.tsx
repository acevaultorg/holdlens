"use client";

// Site search (fleet-search-standard; Paulo 2026-09-23: every earner needs "a
// finding box"). Client-side index built at export time over the 30 investors,
// every tracked ticker and the site's pages. Zero-result queries fire
// `search_zero` to Plausible and GA4 so missing demand shows up.

import { useEffect, useMemo, useRef, useState } from "react";

export type SearchItem = { u: string; t: string; s: string; k: string };

const norm = (x: string) =>
  x.toLowerCase().normalize("NFKD").replace(/[^a-z0-9. ]+/g, " ").replace(/\s+/g, " ").trim();

export default function SiteSearch({ items }: { items: SearchItem[] }) {
  const [q, setQ] = useState("");
  const logged = useRef(new Set<string>());

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("q");
    if (p) setQ(p);
  }, []);

  const results = useMemo(() => {
    const words = norm(q).split(" ").filter(Boolean);
    if (!words.length) return [];
    return items
      .map((it) => {
        if (!words.every((w) => it.k.includes(w))) return null;
        const t = norm(it.t);
        const score = words.reduce((n, w) => n + (t === w ? 6 : t.startsWith(w) ? 3 : t.includes(w) ? 2 : 1), 0);
        return { it, score };
      })
      .filter((x): x is { it: SearchItem; score: number } => x !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 25)
      .map((x) => x.it);
  }, [q, items]);

  useEffect(() => {
    const n = norm(q);
    if (n.length < 2 || results.length > 0) return;
    const t = setTimeout(() => {
      if (logged.current.has(n)) return;
      logged.current.add(n);
      const w = window as unknown as {
        plausible?: (e: string, o?: { props: Record<string, string> }) => void;
        gtag?: (...a: unknown[]) => void;
      };
      try { w.plausible?.("search_zero", { props: { q: n.slice(0, 80) } }); } catch {}
      try { w.gtag?.("event", "search_zero", { search_term: n.slice(0, 80) }); } catch {}
    }, 1200);
    return () => clearTimeout(t);
  }, [q, results.length]);

  return (
    <div>
      <label htmlFor="site-search" className="sr-only">Search HoldLens</label>
      <input
        id="site-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Try: Buffett, AAPL, Pabrai, 13F"
        autoComplete="off"
        autoFocus
        className="w-full rounded-xl border border-border bg-panel px-4 py-3 text-base text-text"
        style={{ minHeight: 48 }}
      />
      {q.trim() && (
        <p className="mt-3 text-sm text-muted" aria-live="polite">
          {results.length ? `${results.length}${results.length === 25 ? "+" : ""} results` : "Nothing matches that yet. Try an investor's surname or a ticker symbol."}
        </p>
      )}
      <ul className="mt-4 space-y-2">
        {results.map((r) => (
          <li key={r.u}>
            <a href={r.u} className="block rounded-xl border border-border bg-panel px-4 py-3 hover:border-brand/50" style={{ minHeight: 44 }}>
              <span className="font-semibold text-text">{r.t}</span>
              <span className="block text-xs text-dim">{r.s}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
