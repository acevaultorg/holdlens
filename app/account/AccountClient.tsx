"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  isAuthConfigured,
  subscribeAuth,
  signOut,
  type AuthUser,
} from "@/lib/auth";
import { getWatchlist, subscribeWatchlist } from "@/lib/watchlist";
import { syncWatchlistOnLogin } from "@/lib/watchlist-sync";

export default function AccountClient() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    const unsub = subscribeAuth((u) => {
      setUser(u);
      setAuthLoaded(true);
      // On first auth load + every login: pull cross-device watchlist
      // from Supabase + union with local + write back. Fire-and-forget;
      // subscribeWatchlist below updates UI when local changes.
      if (u) syncWatchlistOnLogin(u.id).catch(() => {});
    });
    return unsub;
  }, []);

  useEffect(() => {
    setWatchlist(getWatchlist());
    return subscribeWatchlist(setWatchlist);
  }, []);

  if (!isAuthConfigured()) {
    return (
      <div className="rounded-2xl border border-amber-400/40 bg-amber-400/5 p-6">
        <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
          Coming soon
        </div>
        <div className="text-text font-semibold mb-2">
          Account features are being wired up
        </div>
        <p className="text-sm text-muted mb-4 leading-relaxed">
          Your watchlist works fine right now without an account — it&apos;s
          stored in this browser. Cross-device sync, email alerts, and
          subscription management all go live once the Supabase backend is
          configured.
        </p>
        <p className="text-sm text-muted">
          Until then, your <Link href="/watchlist/" className="text-brand hover:underline">
            local watchlist
          </Link>{" "}
          has {watchlist.length}{" "}
          {watchlist.length === 1 ? "ticker" : "tickers"}.
        </p>
      </div>
    );
  }

  if (!authLoaded) {
    return (
      <div className="h-40 rounded-2xl border border-border bg-panel animate-pulse" />
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-border bg-panel p-8 text-center">
        <h2 className="text-xl font-bold mb-3">Sign in to manage your account</h2>
        <p className="text-muted mb-6 text-sm">
          Cross-device watchlist sync and email alerts require a free account.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/signup/"
            className="bg-brand text-bg font-semibold px-6 py-3 rounded-xl hover:bg-brand/90 transition"
          >
            Create account →
          </Link>
          <Link
            href="/login/"
            className="border border-brand text-brand font-semibold px-6 py-3 rounded-xl hover:bg-brand/5 transition"
          >
            Log in →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile */}
      <div className="rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          Signed in
        </div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-text font-semibold">{user.email}</div>
            <div className="text-xs text-muted mt-1">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="border border-border text-muted hover:text-text hover:border-text font-semibold px-4 py-2 rounded-lg text-sm transition"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Watchlist summary */}
      <div className="rounded-2xl border border-border bg-panel p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Watchlist</h2>
          <Link
            href="/watchlist/"
            className="text-xs text-brand hover:underline font-semibold"
          >
            View all →
          </Link>
        </div>
        <p className="text-sm text-muted">
          {watchlist.length === 0
            ? "No tickers yet — tap the star on any ticker page to add it."
            : `${watchlist.length} ${watchlist.length === 1 ? "ticker" : "tickers"} tracked${watchlist.length > 0 ? ": " + watchlist.slice(0, 6).join(", ") + (watchlist.length > 6 ? "…" : "") : ""}.`}
        </p>
        <p className="text-xs text-dim mt-3">
          v0.60 — watchlist syncs to your account automatically. Add or
          remove tickers anywhere; this list stays consistent across every
          device you sign in on.
        </p>
      </div>

      {/* Subscription placeholder — wires up once Stripe webhook → Supabase
          users.subscription_status table is in place. */}
      <div className="rounded-2xl border border-border bg-panel p-6">
        <h2 className="text-lg font-bold mb-2">Subscription</h2>
        <p className="text-sm text-muted mb-4">
          You&apos;re on the <span className="text-text font-semibold">Free</span> tier.
        </p>
        <Link
          href="/pricing/"
          className="inline-block bg-brand text-bg font-semibold px-5 py-2.5 rounded-lg hover:bg-brand/90 transition text-sm"
        >
          See Pro features →
        </Link>
      </div>

      {/* Email alerts placeholder */}
      <div className="rounded-2xl border border-border bg-panel p-6">
        <h2 className="text-lg font-bold mb-2">Alert preferences</h2>
        <p className="text-sm text-muted">
          Coming soon — choose which 13F filings + Form 4 buys trigger an
          email. Free tier: 5 watchlist tickers. Pro: unlimited.
        </p>
      </div>
    </div>
  );
}
