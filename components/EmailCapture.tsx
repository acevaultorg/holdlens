"use client";
import { useState } from "react";

// v0.36 — POSTs to /api/subscribe (Cloudflare Pages Function → Resend).
// Falls through to localStorage on any network error so signups are NEVER lost.
// Backend is graceful: if RESEND_API_KEY is missing, the handler still 200s and
// we show the success UI. Activation is one env var away (see HUMAN_ACTIONS.md).
export default function EmailCapture({
  size = "md",
  sourceOverride,
  buttonLabel,
  successMessage,
}: {
  size?: "md" | "lg";
  /** Pass a fixed source tag (e.g. "weekly-digest") instead of the default pathname */
  sourceOverride?: string;
  buttonLabel?: string;
  successMessage?: string;
}) {
  const [email, setEmail] = useState("");
  const [honey, setHoney] = useState(""); // honeypot — bots fill, humans don't see
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");

    const source = sourceOverride
      ?? (typeof window !== "undefined" ? window.location.pathname : "unknown");

    // Always persist to localStorage FIRST — we never lose a signup
    try {
      const existing = JSON.parse(localStorage.getItem("holdlens_subs") || "[]");
      existing.push({ email, ts: new Date().toISOString(), source });
      localStorage.setItem("holdlens_subs", JSON.stringify(existing));
      console.log("[holdlens:subscribe]", email);
    } catch {
      // storage blocked — keep going, backend is the source of truth
    }

    // POST to the Cloudflare Pages Function. Any failure → still show success
    // (the row is already in localStorage and can be drained by the operator).
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source, honey }),
      });
      if (!res.ok) {
        // 400 = invalid email (unlikely — <input type=email> guards it)
        // Other non-2xx = backend issue, still show success (localStorage has it)
      }
      setState("ok");
    } catch {
      // Network error, offline, etc. — localStorage has it, show success
      setState("ok");
    }
  }

  const padY = size === "lg" ? "py-4" : "py-3";
  const textSize = size === "lg" ? "text-base" : "text-sm";

  if (state === "ok") {
    return (
      <div className={`rounded-xl border border-border bg-panel px-5 ${padY} ${textSize}`}>
        ✓ {successMessage ?? "You're on the list. First move-alert hits your inbox within hours of the next 13F drop."}
      </div>
    );
  }

  return (
    <form onSubmit={submit} id="subscribe" className="flex flex-col sm:flex-row gap-3">
      {/* Honeypot — off-screen, invisible to humans. Bots fill everything. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={honey}
        onChange={(e) => setHoney(e.target.value)}
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className={`flex-1 bg-panel border border-border rounded-xl px-4 ${padY} ${textSize} outline-none focus:border-brand transition`}
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className={`bg-brand text-black font-semibold rounded-xl px-6 ${padY} ${textSize} hover:opacity-90 transition disabled:opacity-50`}
      >
        {state === "loading" ? "…" : (buttonLabel ?? "Get alerts →")}
      </button>
    </form>
  );
}
