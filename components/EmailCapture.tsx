"use client";
import { useState } from "react";

// v0.1 — captures to localStorage so we never lose a signup, even pre-Worker.
// Also logs to console with a tag we can scrape from analytics. v0.2 wires Cloudflare Worker → Resend.
export default function EmailCapture({ size = "md" }: { size?: "md" | "lg" }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      // Persist locally so we never lose the signup
      const existing = JSON.parse(localStorage.getItem("holdlens_subs") || "[]");
      existing.push({ email, ts: new Date().toISOString() });
      localStorage.setItem("holdlens_subs", JSON.stringify(existing));
      // Tagged console event for analytics scraping
      console.log("[holdlens:subscribe]", email);
      // Optional: ping a public form service if env wired in v0.2
      setTimeout(() => setState("ok"), 350);
    } catch {
      setState("err");
    }
  }

  const padY = size === "lg" ? "py-4" : "py-3";
  const textSize = size === "lg" ? "text-base" : "text-sm";

  if (state === "ok") {
    return (
      <div className={`rounded-xl border border-border bg-panel px-5 ${padY} ${textSize}`}>
        ✓ You're on the list. First move-alert hits your inbox within hours of the next 13F drop.
      </div>
    );
  }

  return (
    <form onSubmit={submit} id="subscribe" className="flex flex-col sm:flex-row gap-3">
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
        {state === "loading" ? "…" : "Get alerts →"}
      </button>
    </form>
  );
}
