import type { Metadata } from "next";

// Custom 404 (v0.87) — the prior default Next.js not-found page was a bare
// "404: This page could not be found." screen with no navigation, sending
// every mis-typed URL, broken external link, or stale search-result click
// straight back to the close tab button. That's a pure retention leak.
//
// This replacement keeps users on-site by answering the only question a
// confused visitor has: "what can I do from here?" Three paths back in:
// (a) the sticky header nav (already pinned at top), (b) a scannable list
// of the six highest-value routes in plain English, (c) the brand CTA
// that routes to /best-now — HoldLens's most-clicked surface.
//
// Copy is outcome-focused ("See what smart money is buying") rather than
// feature-voice ("Visit best-now") per anti-mediocrity rules.

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

const POPULAR_ROUTES = [
  {
    href: "/best-now",
    label: "Best stocks now",
    desc: "Top positive ConvictionScores — start here.",
    color: "brand",
  },
  {
    href: "/signal/AAPL",
    label: "Signal dossier",
    desc: "One ticker at a time — verdict, trend, owners.",
    color: "emerald",
  },
  {
    href: "/value",
    label: "Value picks",
    desc: "Smart money × 52-week lows — Dataroma can't show this.",
    color: "emerald",
  },
  {
    href: "/investor",
    label: "All 30 superinvestors",
    desc: "Buffett, Ackman, Druckenmiller, Klarman, Burry, and 25 more.",
    color: "brand",
  },
  {
    href: "/biggest-buys",
    label: "Biggest buys",
    desc: "The single trades that pushed past 10% of a book.",
    color: "emerald",
  },
  {
    href: "/pricing",
    label: "Pricing",
    desc: "Free forever. Pro €9/mo with email alerts.",
    color: "brand",
  },
] as const;

function toneClass(color: "brand" | "emerald"): string {
  return color === "emerald"
    ? "border-emerald-400/25 hover:border-emerald-400/60 hover:bg-emerald-400/5"
    : "border-brand/25 hover:border-brand hover:bg-brand/5";
}
function labelClass(color: "brand" | "emerald"): string {
  return color === "emerald" ? "text-emerald-400" : "text-brand";
}

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        404 · Page not found
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        That page doesn&rsquo;t exist — yet.
      </h1>
      <p className="text-muted text-lg max-w-xl mx-auto mb-8">
        Maybe it moved, maybe it&rsquo;s coming. Here&rsquo;s what most people are looking for on HoldLens.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
        <a
          href="/best-now"
          className="bg-brand text-black font-semibold rounded-xl px-6 py-3.5 hover:opacity-90 transition"
        >
          See the top buy signals →
        </a>
        <a
          href="/"
          className="border border-border bg-panel text-text rounded-xl px-6 py-3.5 hover:border-brand/40 transition"
        >
          Back to home
        </a>
      </div>

      <div className="text-left">
        <div className="text-[11px] uppercase tracking-widest text-dim font-bold mb-4 text-center">
          Or pick up where smart money is moving
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {POPULAR_ROUTES.map((r) => (
            <a
              key={r.href}
              href={r.href}
              className={`rounded-2xl border bg-panel p-5 transition block ${toneClass(r.color)}`}
            >
              <div className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${labelClass(r.color)}`}>
                {r.label.split(" ")[0]}
              </div>
              <div className="text-base font-bold text-text mb-1">{r.label}</div>
              <div className="text-xs text-muted leading-relaxed">{r.desc}</div>
            </a>
          ))}
        </div>
      </div>

      <p className="text-xs text-dim mt-12">
        Think something&rsquo;s broken?{" "}
        <a href="/contact" className="underline hover:text-text transition">
          Tell us
        </a>
        .
      </p>
    </div>
  );
}
