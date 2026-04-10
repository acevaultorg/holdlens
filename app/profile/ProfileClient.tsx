"use client";
import { useEffect, useState } from "react";
import { getProfile, updateProfile, subscribeProfile, type Profile } from "@/lib/profile";
import { getWatchlist, subscribeWatchlist } from "@/lib/watchlist";

export default function ProfileClient() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
    setWatchlistCount(getWatchlist().length);
    const u1 = subscribeProfile(setProfile);
    const u2 = subscribeWatchlist((list) => setWatchlistCount(list.length));
    return () => {
      u1();
      u2();
    };
  }, []);

  if (!profile) {
    return <div className="rounded-2xl border border-border bg-panel h-64 animate-pulse" />;
  }

  function save(updates: Partial<Profile>) {
    if (!profile) return;
    const next = updateProfile(updates);
    setProfile(next);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1200);
  }

  function clearAll() {
    if (typeof window === "undefined") return;
    if (!confirm("Clear all profile data? This removes your display name, email, holdings, and preferences. Your watchlist stays.")) return;
    localStorage.removeItem("holdlens_profile_v1");
    setProfile(getProfile());
  }

  return (
    <div className="space-y-6">
      {/* Display name + email */}
      <div className="rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Identity
        </div>
        <label className="block mb-4">
          <span className="block text-[10px] uppercase tracking-wider text-dim font-semibold mb-1.5">
            Display name
          </span>
          <input
            type="text"
            value={profile.displayName}
            onChange={(e) => save({ displayName: e.target.value })}
            placeholder="What should we call you?"
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-brand outline-none"
          />
        </label>
        <label className="block">
          <span className="block text-[10px] uppercase tracking-wider text-dim font-semibold mb-1.5">
            Email (optional)
          </span>
          <input
            type="email"
            value={profile.email || ""}
            onChange={(e) => save({ email: e.target.value })}
            placeholder="you@example.com"
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-brand outline-none"
          />
          <span className="block text-[11px] text-dim mt-1">
            Used for signal alerts when Resend ships in v0.3. Stored locally until then.
          </span>
        </label>
      </div>

      {/* Stats */}
      <div className="rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Your data
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Holdings" value={profile.holdings.length} href="/portfolio" />
          <Stat label="Watchlist" value={watchlistCount} href="/watchlist" />
        </div>
      </div>

      {/* Preferences */}
      <div className="rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Preferences
        </div>
        <label className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm text-text">Show ads</div>
            <div className="text-[11px] text-dim">Free version. Pro removes ads.</div>
          </div>
          <input
            type="checkbox"
            checked={profile.preferences.showAds}
            onChange={(e) => save({ preferences: { ...profile.preferences, showAds: e.target.checked } })}
            className="accent-brand w-5 h-5"
          />
        </label>
        <label className="flex items-center justify-between">
          <div>
            <div className="text-sm text-text">Weekly digest</div>
            <div className="text-[11px] text-dim">Top 10 buy + sell signals every Monday.</div>
          </div>
          <input
            type="checkbox"
            checked={profile.preferences.weeklyDigest}
            onChange={(e) => save({ preferences: { ...profile.preferences, weeklyDigest: e.target.checked } })}
            className="accent-brand w-5 h-5"
          />
        </label>
      </div>

      {/* Save indicator + clear */}
      <div className="flex items-center justify-between text-xs">
        <span className={`text-emerald-400 transition-opacity ${savedFlash ? "opacity-100" : "opacity-0"}`}>
          ✓ Saved
        </span>
        <button
          onClick={clearAll}
          className="text-dim hover:text-rose-400 transition"
        >
          Clear all profile data
        </button>
      </div>

      <p className="text-xs text-dim mt-6">
        Privacy: profile stored in localStorage on this device only. Never sent to any server.
        Clear browser data and your profile is gone. v0.3 will add optional encrypted sync via Cloudflare KV.
      </p>
    </div>
  );
}

function Stat({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <a href={href} className="block rounded-lg bg-bg/40 border border-border p-4 hover:border-brand/40 transition">
      <div className="text-3xl font-bold tabular-nums text-text">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-dim mt-1 font-semibold">{label}</div>
    </a>
  );
}
