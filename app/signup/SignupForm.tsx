"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  isAuthConfigured,
  signUpWithEmail,
  signInWithMagicLink,
} from "@/lib/auth";

export default function SignupForm() {
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  if (!isAuthConfigured()) {
    return (
      <div className="rounded-2xl border border-amber-400/40 bg-amber-400/5 p-6">
        <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
          Coming soon
        </div>
        <div className="text-text font-semibold mb-2">
          Sign-in is being wired up
        </div>
        <p className="text-sm text-muted mb-4 leading-relaxed">
          Your watchlist works fine right now without an account — it&apos;s
          stored in this browser. Account creation + cross-device sync goes
          live as soon as the Supabase backend is configured.
        </p>
        <p className="text-xs text-dim">
          Want to be notified when accounts ship? Drop your email on the{" "}
          <a href="/alerts/" className="text-brand hover:underline">
            alerts page
          </a>
          .
        </p>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (mode === "magic") {
      const r = await signInWithMagicLink(email);
      if (!r.ok) {
        setError(r.error);
      } else {
        setSuccess(
          `Check your email at ${email}. We sent you a one-click sign-in link.`,
        );
      }
    } else {
      const r = await signUpWithEmail(email, password);
      if (!r.ok) {
        setError(r.error);
      } else {
        setSuccess("Account created. Check your email to confirm.");
        setTimeout(() => router.push("/account/"), 1500);
      }
    }
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex rounded-xl bg-panel p-1 border border-border text-xs">
        <button
          type="button"
          onClick={() => setMode("magic")}
          className={`flex-1 py-2 rounded-lg transition ${
            mode === "magic"
              ? "bg-brand text-bg font-semibold"
              : "text-muted hover:text-text"
          }`}
        >
          Magic link (no password)
        </button>
        <button
          type="button"
          onClick={() => setMode("password")}
          className={`flex-1 py-2 rounded-lg transition ${
            mode === "password"
              ? "bg-brand text-bg font-semibold"
              : "text-muted hover:text-text"
          }`}
        >
          Password
        </button>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-muted font-semibold mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-xl bg-panel border border-border px-4 py-3 text-text placeholder:text-dim focus:border-brand focus:outline-none transition"
        />
      </div>

      {mode === "password" && (
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={8}
            placeholder="At least 8 characters"
            className="w-full rounded-xl bg-panel border border-border px-4 py-3 text-text placeholder:text-dim focus:border-brand focus:outline-none transition"
          />
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-rose-400/10 border border-rose-400/30 px-4 py-3 text-sm text-rose-400">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl bg-emerald-400/10 border border-emerald-400/30 px-4 py-3 text-sm text-emerald-400">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !email}
        className="w-full rounded-xl bg-brand text-bg font-semibold py-3 hover:bg-brand/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading
          ? "Working…"
          : mode === "magic"
            ? "Send magic link →"
            : "Create account →"}
      </button>

      <p className="text-[11px] text-dim text-center pt-2">
        We don&apos;t spam. One welcome email + only the digests you opt into.
      </p>
    </form>
  );
}
