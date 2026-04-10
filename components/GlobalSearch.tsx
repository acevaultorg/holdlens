"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { MANAGERS } from "@/lib/managers";
import { TICKER_INDEX } from "@/lib/tickers";

type Item = {
  type: "ticker" | "investor";
  id: string;
  title: string;
  subtitle: string;
  href: string;
  symbol?: string;
};

function buildIndex(): Item[] {
  const items: Item[] = [];

  for (const sym of Object.keys(TICKER_INDEX)) {
    const t = TICKER_INDEX[sym];
    items.push({
      type: "ticker",
      id: `ticker:${sym}`,
      title: sym,
      subtitle: `${t.name} · ${t.sector}`,
      href: `/ticker/${sym}`,
      symbol: sym,
    });
  }

  for (const m of MANAGERS) {
    items.push({
      type: "investor",
      id: `investor:${m.slug}`,
      title: m.name,
      subtitle: m.fund,
      href: `/investor/${m.slug}`,
    });
  }

  return items;
}

function scoreItem(item: Item, q: string): number {
  const query = q.toLowerCase();
  const title = item.title.toLowerCase();
  const subtitle = item.subtitle.toLowerCase();

  if (title === query) return 1000;
  if (title.startsWith(query)) return 500;
  if (title.includes(query)) return 200;
  if (subtitle.startsWith(query)) return 100;
  if (subtitle.includes(query)) return 50;
  return 0;
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo(buildIndex, []);

  const results = useMemo(() => {
    if (!q.trim()) {
      // Default: show a mix of popular tickers + notable managers
      return index
        .filter((i) => i.type === "ticker")
        .slice(0, 5)
        .concat(index.filter((i) => i.type === "investor").slice(0, 5));
    }
    return index
      .map((item) => ({ item, score: scoreItem(item, q) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((r) => r.item);
  }, [q, index]);

  // Keyboard: cmd/ctrl + k to open, escape to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setActiveIdx(0);
    } else {
      setQ("");
    }
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [q]);

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = results[activeIdx];
      if (target) {
        setOpen(false);
        window.location.href = target.href;
      }
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-xs text-dim hover:text-text border border-border rounded-lg px-3 py-1.5 transition bg-panel/60 hover:border-brand/40"
        aria-label="Search"
      >
        <SearchIcon />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden md:inline text-[10px] font-mono text-dim bg-bg border border-border rounded px-1.5 py-0.5">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden />
          <div
            className="relative w-full max-w-xl rounded-2xl border border-border bg-panel shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <SearchIcon />
              <input
                ref={inputRef}
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Search tickers, investors, funds..."
                className="flex-1 bg-transparent text-text placeholder-dim outline-none text-base"
              />
              <button
                onClick={() => setOpen(false)}
                className="text-xs text-dim hover:text-text border border-border rounded px-2 py-1"
                aria-label="Close"
              >
                Esc
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {results.length === 0 ? (
                <div className="px-5 py-10 text-center text-dim text-sm">No matches for "{q}".</div>
              ) : (
                <ul className="py-2">
                  {results.map((item, i) => (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        className={`flex items-center gap-3 px-5 py-3 text-sm transition ${
                          i === activeIdx ? "bg-brand/10" : "hover:bg-bg/50"
                        }`}
                        onMouseEnter={() => setActiveIdx(i)}
                      >
                        <span
                          className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-xs font-mono font-bold ${
                            item.type === "ticker"
                              ? "bg-brand/20 text-brand"
                              : "bg-emerald-400/10 text-emerald-400"
                          }`}
                        >
                          {item.type === "ticker" ? item.symbol : item.title.charAt(0)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-text truncate">{item.title}</div>
                          <div className="text-xs text-dim truncate">{item.subtitle}</div>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                          {item.type}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="px-5 py-2.5 border-t border-border bg-bg/40 flex items-center justify-between text-[11px] text-dim">
              <div className="flex gap-4">
                <span>
                  <kbd className="font-mono">↑↓</kbd> navigate
                </span>
                <span>
                  <kbd className="font-mono">⏎</kbd> open
                </span>
                <span>
                  <kbd className="font-mono">esc</kbd> close
                </span>
              </div>
              <span>{results.length} results</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
