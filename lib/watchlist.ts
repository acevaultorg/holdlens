// Watchlist — localStorage-backed set of ticker symbols.
// Client-side only. Safe on SSR (returns []).

const KEY = "holdlens_watchlist_v1";
const EVENT = "holdlens:watchlist:update";

export function getWatchlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === "string").map((s) => s.toUpperCase());
  } catch {
    return [];
  }
}

export function isWatched(symbol: string): boolean {
  return getWatchlist().includes(symbol.toUpperCase());
}

export function addToWatchlist(symbol: string): string[] {
  if (typeof window === "undefined") return [];
  const sym = symbol.toUpperCase();
  const list = getWatchlist();
  if (!list.includes(sym)) {
    list.push(sym);
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVENT, { detail: list }));
  }
  return list;
}

export function removeFromWatchlist(symbol: string): string[] {
  if (typeof window === "undefined") return [];
  const sym = symbol.toUpperCase();
  const list = getWatchlist().filter((s) => s !== sym);
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(EVENT, { detail: list }));
  return list;
}

export function toggleWatchlist(symbol: string): { watched: boolean; list: string[] } {
  const sym = symbol.toUpperCase();
  if (isWatched(sym)) {
    return { watched: false, list: removeFromWatchlist(sym) };
  }
  return { watched: true, list: addToWatchlist(sym) };
}

export function subscribeWatchlist(cb: (list: string[]) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<string[]>).detail;
    cb(Array.isArray(detail) ? detail : getWatchlist());
  };
  window.addEventListener(EVENT, handler);
  // Also re-emit on storage events from other tabs
  const storageHandler = (e: StorageEvent) => {
    if (e.key === KEY) cb(getWatchlist());
  };
  window.addEventListener("storage", storageHandler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", storageHandler);
  };
}
