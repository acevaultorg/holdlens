// lib/watchlist-sync.ts — Supabase ⇄ localStorage watchlist sync (v0.60, 2026-05-13)
//
// Architecture:
//   - localStorage = fast local cache + only-source-of-truth for logged-out users
//   - public.watchlists (Supabase) = cross-device source of truth for logged-in users
//   - Dual-write pattern: every add/remove writes BOTH localStorage AND
//     Supabase (when logged in). Reads come from localStorage.
//   - On login: pull Supabase → merge with localStorage → write back to both
//     (union, never destructive; respects existing entries on both sides).
//
// Why dual-write + merge-union not "Supabase only":
//   - Operators who visit pre-signup, star 3 tickers, then sign up,
//     would lose those 3 tickers if we replaced local with Supabase.
//   - The union pattern means signup feels seamless — the existing
//     watchlist persists + becomes synced.
//   - Subsequent logins on new devices: Supabase wins, then writes-back
//     to local. Conflict-free because tickers are idempotent.

"use client";

import { getSupabase, subscribeAuth } from "@/lib/auth";
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from "@/lib/watchlist";

// Track current logged-in state so dual-write knows whether to call Supabase
let _currentUserId: string | null = null;
let _initialized = false;

/**
 * Pull the user's watchlist row from Supabase, union with localStorage,
 * write back to both stores. Idempotent. Returns the merged set.
 *
 * Called on user login (subscribeAuth → user not null) and on first mount
 * of /account or any signed-in surface.
 */
export async function syncWatchlistOnLogin(userId: string): Promise<string[]> {
  const sb = getSupabase();
  if (!sb) return getWatchlist();

  const local = new Set(getWatchlist());

  // Fetch remote
  const { data, error } = await sb
    .from("watchlists")
    .select("tickers")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    // Likely RLS or network — fall back to local-only for this session
    console.warn("[watchlist-sync] fetch failed:", error.message);
    return Array.from(local);
  }

  const remoteTickers: string[] = data?.tickers ?? [];
  const remote = new Set(remoteTickers.map((t) => t.toUpperCase()));

  // Union (idempotent)
  const merged = new Set<string>([...local, ...remote]);
  const mergedArr = [...merged].sort();

  // Write merged back to Supabase
  if (mergedArr.length !== remoteTickers.length || mergedArr.some((t, i) => t !== remoteTickers[i])) {
    const { error: upsertErr } = await sb
      .from("watchlists")
      .upsert({ user_id: userId, tickers: mergedArr }, { onConflict: "user_id" });
    if (upsertErr) {
      console.warn("[watchlist-sync] upsert failed:", upsertErr.message);
    }
  }

  // Write merged back to localStorage (union, so the "new tickers from
  // other devices" land in local cache for instant UI on next render)
  for (const t of mergedArr) {
    if (!local.has(t)) addToWatchlist(t);
  }

  return mergedArr;
}

/**
 * Dual-write add: writes localStorage immediately (fast UI), then queues
 * a Supabase upsert if logged in. Errors swallowed → localStorage is the
 * fallback source of truth.
 */
export async function syncedAddTicker(symbol: string): Promise<void> {
  const sym = symbol.toUpperCase();
  addToWatchlist(sym); // localStorage immediate

  if (!_currentUserId) return;
  const sb = getSupabase();
  if (!sb) return;

  // Optimistic upsert — re-read full list to send canonical state
  const list = getWatchlist();
  const { error } = await sb
    .from("watchlists")
    .upsert(
      { user_id: _currentUserId, tickers: list },
      { onConflict: "user_id" },
    );
  if (error) console.warn("[watchlist-sync] add failed:", error.message);
}

export async function syncedRemoveTicker(symbol: string): Promise<void> {
  removeFromWatchlist(symbol);

  if (!_currentUserId) return;
  const sb = getSupabase();
  if (!sb) return;

  const list = getWatchlist();
  const { error } = await sb
    .from("watchlists")
    .upsert(
      { user_id: _currentUserId, tickers: list },
      { onConflict: "user_id" },
    );
  if (error) console.warn("[watchlist-sync] remove failed:", error.message);
}

/**
 * Auto-sync orchestrator. Called once at app mount (e.g. from a small
 * client component in layout.tsx OR from a useEffect in StarButton).
 * Wires the auth subscription so every login event syncs the watchlist.
 */
export function initWatchlistSync(): () => void {
  if (_initialized) return () => {};
  _initialized = true;

  const unsub = subscribeAuth(async (user) => {
    _currentUserId = user?.id ?? null;
    if (user) {
      // Async fire-and-forget; UI will pick up updates via subscribeWatchlist
      syncWatchlistOnLogin(user.id).catch(() => {});
    }
  });

  return unsub;
}
