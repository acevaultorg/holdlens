// lib/auth.ts — Supabase client + auth helpers (v0.58, 2026-05-13)
//
// Operator directive 2026-05-13: "i also believe it must be possible for
// users to log in and make a account". Brain-recommended architecture:
// static-export site + Supabase client-side auth (Option C from strategic
// review). Preserves all SEO/AdSense/CWV benefits — no Next.js dynamic
// migration. Pages stay static; auth pages render as SPA islands.
//
// Operator setup (one-time, ~5 min):
// 1. Create free Supabase project at https://supabase.com (free tier:
//    500MB DB, 50k MAU — plenty for v0)
// 2. Settings → API → copy Project URL + anon/public key
// 3. Add to .env.local:
//      NEXT_PUBLIC_SUPABASE_URL=https://[ref].supabase.co
//      NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
// 4. Redeploy (env vars are NEXT_PUBLIC_ → inlined at build time)
//
// Until those env vars are set, the auth UI shows a "Sign in coming soon"
// fallback (graceful degrade — no errors, no broken pages).

"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isAuthConfigured = (): boolean =>
  Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Singleton client — Supabase JS SDK manages its own session via localStorage.
let _supabase: SupabaseClient | null = null;
export function getSupabase(): SupabaseClient | null {
  if (!isAuthConfigured()) return null;
  if (_supabase) return _supabase;
  _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // handles magic-link callback URL params
    },
  });
  return _supabase;
}

// --- High-level helpers --------------------------------------------

export type AuthUser = {
  id: string;
  email: string | null;
  createdAt: string;
};

export async function signUpWithEmail(email: string, password: string): Promise<
  { ok: true; user: AuthUser } | { ok: false; error: string }
> {
  const sb = getSupabase();
  if (!sb) return { ok: false, error: "Auth not configured yet — coming soon" };
  const { data, error } = await sb.auth.signUp({ email, password });
  if (error) return { ok: false, error: error.message };
  if (!data.user) return { ok: false, error: "No user returned" };
  return {
    ok: true,
    user: {
      id: data.user.id,
      email: data.user.email ?? null,
      createdAt: data.user.created_at,
    },
  };
}

export async function signInWithEmail(email: string, password: string): Promise<
  { ok: true; user: AuthUser } | { ok: false; error: string }
> {
  const sb = getSupabase();
  if (!sb) return { ok: false, error: "Auth not configured yet — coming soon" };
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };
  if (!data.user) return { ok: false, error: "No user returned" };
  return {
    ok: true,
    user: {
      id: data.user.id,
      email: data.user.email ?? null,
      createdAt: data.user.created_at,
    },
  };
}

export async function signInWithMagicLink(email: string): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const sb = getSupabase();
  if (!sb) return { ok: false, error: "Auth not configured yet — coming soon" };
  const { error } = await sb.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/account/`
          : undefined,
    },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function signOut(): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.auth.signOut();
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  if (!data.user) return null;
  return {
    id: data.user.id,
    email: data.user.email ?? null,
    createdAt: data.user.created_at,
  };
}

// Subscribe to auth state changes — returns unsubscribe fn.
export function subscribeAuth(
  cb: (user: AuthUser | null) => void,
): () => void {
  const sb = getSupabase();
  if (!sb) {
    cb(null);
    return () => {};
  }
  // Fire current state immediately
  sb.auth.getUser().then(({ data }) => {
    cb(
      data.user
        ? {
            id: data.user.id,
            email: data.user.email ?? null,
            createdAt: data.user.created_at,
          }
        : null,
    );
  });
  const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
    cb(
      session?.user
        ? {
            id: session.user.id,
            email: session.user.email ?? null,
            createdAt: session.user.created_at,
          }
        : null,
    );
  });
  return () => sub.subscription.unsubscribe();
}
