"use client";

/**
 * SiteSearch — command-palette investor search (v1.0, Fleet Search Standard).
 *
 * Best-UX, zero-dependency, self-contained client island:
 *  - Header trigger (magnifier) + `/` keyboard shortcut open a centered overlay.
 *  - Instant typeahead over the 30 tracked superinvestors (fetched once from
 *    /api/v1/managers.json — already-public, no new sourcing, no build step).
 *  - ARIA combobox/listbox a11y · ↑↓ navigate · Enter open · Esc close.
 *  - Mobile-perfect (full-width overlay, ≥44px targets) · zero CLS (overlay,
 *    not inline) · graceful zero-result capture (never a dead end).
 *  - MONITORING (the point): dual-sinks Search / SearchNoResults to BOTH
 *    Plausible AND Clarity (resilient — survives the Plausible lapse), with
 *    the query PII-scrubbed + truncated. Zero-result = the demand signal.
 *
 * Defensive by design: if the fetch fails, search simply shows no matches —
 * it never throws or blocks the page (this ships on the YMYL flagship).
 */

import { useCallback, useEffect, useRef, useState } from "react";

type Investor = { slug: string; name: string; fund?: string };

// PII-scrub: drop emails + long digit runs, trim, lowercase, cap length.
function scrub(s: string): string {
  return s
    .replace(/[\w.+-]+@[\w.-]+\.\w+/g, "")
    .replace(/\d{7,}/g, "")
    .trim()
    .toLowerCase()
    .slice(0, 60);
}

function logQuery(raw: string, count: number) {
  if (typeof window === "undefined") return;
  const sq = scrub(raw);
  if (!sq) return;
  const zero = count === 0;
  const w = window as unknown as {
    plausible?: (e: string, o?: { props?: Record<string, unknown> }) => void;
    clarity?: (...a: unknown[]) => void;
  };
  // Dual-sink — fire each independently so one losing the other loses nothing.
  if (typeof w.plausible === "function") {
    w.plausible(zero ? "SearchNoResults" : "Search", {
      props: zero ? { q: sq } : { q: sq, results: count },
    });
  }
  if (typeof w.clarity === "function") {
    w.clarity("event", zero ? "SearchNoResults" : "Search");
    w.clarity("set", zero ? "search_noresult" : "search_query", sq);
  }
}

export default function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [data, setData] = useState<Investor[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const loggedRef = useRef("");
  const debRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Lazy-load the investor list once, on first open.
  useEffect(() => {
    if (!open || data.length) return;
    let cancelled = false;
    fetch("/api/v1/managers.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((raw: unknown) => {
        if (cancelled) return;
        const arr: Investor[] = Array.isArray(raw)
          ? (raw as Investor[])
          : [];
        setData(arr.filter((m) => m && m.slug && m.name));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open, data.length]);

  // Global `/` shortcut to open (ignore while typing in a field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable);
      if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus the input when the overlay opens.
  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(id);
    }
    setQ("");
    setActive(0);
  }, [open]);

  const query = q.trim().toLowerCase();
  const results: Investor[] = query
    ? data
        .map((m) => {
          const hay = `${m.name} ${m.fund || ""}`.toLowerCase();
          const idx = hay.indexOf(query);
          if (idx < 0) return null;
          // rank: name-startsWith (0) < name-includes (1) < fund-includes (2)
          const rank = m.name.toLowerCase().startsWith(query)
            ? 0
            : m.name.toLowerCase().includes(query)
            ? 1
            : 2;
          return { m, rank, idx };
        })
        .filter(Boolean)
        .sort((a, b) => a!.rank - b!.rank || a!.idx - b!.idx)
        .slice(0, 8)
        .map((x) => x!.m)
    : [];

  // Debounced monitoring fire (after the user settles, not per keystroke).
  useEffect(() => {
    if (query.length < 2) return;
    if (debRef.current) clearTimeout(debRef.current);
    debRef.current = setTimeout(() => {
      if (query === loggedRef.current) return;
      loggedRef.current = query;
      logQuery(query, results.length);
    }, 650);
    return () => {
      if (debRef.current) clearTimeout(debRef.current);
    };
    // results.length is derived from query+data; query is the trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, results.length]);

  const go = useCallback((slug: string) => {
    window.location.href = `/investor/${slug}`;
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active].slug);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search superinvestors"
        title="Search investors  ( / )"
        className="shrink-0 inline-flex items-center justify-center gap-2 rounded-md border border-border bg-panel/40 px-3 h-10 text-sm text-dim hover:text-fg hover:border-brand/50 transition-base"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className="hidden md:inline">Search</span>
        <kbd className="hidden md:inline rounded border border-border px-1.5 text-[10px] leading-4 text-dim">/</kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 backdrop-blur-sm px-4 pt-[12vh]"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            className="w-full max-w-lg rounded-xl border border-border bg-bg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-dim shrink-0" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                type="search"
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls="sitesearch-list"
                aria-autocomplete="list"
                aria-label="Search superinvestors"
                placeholder="Search superinvestors — e.g. Buffett, Burry, Ackman"
                className="flex-1 bg-transparent py-4 text-base outline-none placeholder:text-dim"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="shrink-0 text-dim hover:text-fg text-sm px-2 py-1"
              >
                Esc
              </button>
            </div>

            {query.length > 0 && (
              <ul
                id="sitesearch-list"
                role="listbox"
                aria-label="Investor results"
                className="max-h-[50vh] overflow-y-auto py-2"
              >
                {results.length > 0 ? (
                  results.map((m, i) => (
                    <li key={m.slug} role="option" aria-selected={i === active}>
                      <a
                        href={`/investor/${m.slug}`}
                        onMouseEnter={() => setActive(i)}
                        className={`flex items-center justify-between gap-3 px-4 py-3 min-h-[44px] text-sm ${
                          i === active ? "bg-brand/10 text-fg" : "text-fg/90"
                        }`}
                      >
                        <span className="font-medium">{m.name}</span>
                        {m.fund && (
                          <span className="text-xs text-dim truncate">{m.fund}</span>
                        )}
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-6 text-sm text-dim">
                    No superinvestor matches{" "}
                    <span className="text-fg">&ldquo;{q}&rdquo;</span>. We track 30 —
                    try a name like <span className="text-fg">Buffett</span> or{" "}
                    <span className="text-fg">Burry</span>, or{" "}
                    <a href="/managers" className="text-brand hover:underline">
                      browse all investors
                    </a>
                    .
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
