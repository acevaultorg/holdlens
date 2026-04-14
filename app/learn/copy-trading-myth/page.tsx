import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Can you actually copy Warren Buffett? — The honest answer",
  description: "Why 13F-based copy-trading doesn't work the way retail investors think — and what to do instead.",
};

export default function CopyMythPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <a href="/learn" className="text-xs text-muted hover:text-text">← All guides</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn</div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-8">
        Can you actually copy Warren Buffett?
      </h1>
      <p className="text-xl text-muted mb-10">The honest answer: not the way you think.</p>

      <div className="space-y-6 text-text leading-relaxed">
        <h2 className="text-2xl font-bold mt-8 mb-3">The 45-day delay problem</h2>
        <p className="text-muted">
          Hedge funds file 13Fs <strong className="text-text">45 days after the quarter ends</strong>. By the time you
          read on HoldLens that "Buffett bought Apple at $150," Apple is probably trading at $175 — and Buffett
          has had 6+ weeks to add, trim, or exit. <strong className="text-text">You are always trading on stale data.</strong>
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">The selection bias problem</h2>
        <p className="text-muted">
          13Fs only show <strong className="text-text">long US equities</strong>. Buffett's full position might
          include: a put option, a short hedge, a corporate bond, a foreign stock, or a private equity stake.
          You're seeing maybe 60% of the picture for a manager like Berkshire — far less for hedge fund managers
          who use derivatives.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">The position-sizing problem</h2>
        <p className="text-muted">
          Buffett owning 0.5% of Apple is a different risk than YOU owning 0.5% of your own portfolio in Apple.
          He has $300B+ in cash and other assets. You don't. <strong className="text-text">A position that's "safe" for him can be
          career-ending for you.</strong>
        </p>

        <AdSlot format="in-article" />

        <h2 className="text-2xl font-bold mt-8 mb-3">So what IS HoldLens for?</h2>
        <ul className="text-muted space-y-3 list-disc list-inside">
          <li><strong className="text-text">Idea generation:</strong> "Five managers I respect just bought X — let me research X."</li>
          <li><strong className="text-text">Validation:</strong> "I'm thinking of buying X — does any pro hold it? Why?"</li>
          <li><strong className="text-text">Theme detection:</strong> When 5+ value investors rotate into the same sector at once,
              that's a thesis, not a coincidence.</li>
          <li><strong className="text-text">Manager study:</strong> Read what the great investors have actually bought over decades.
              The best education in investing is studying real portfolios.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-3">Bottom line</h2>
        <p className="text-muted">
          HoldLens is a research tool, not a copy-trading service. We <strong className="text-text">never tell you what to buy</strong>.
          We show you what the smartest minds in the market are doing — so you can do your own research smarter.
        </p>

        <div className="mt-10 rounded-2xl border border-border bg-panel p-6">
          <h3 className="text-lg font-bold mb-2">Want to study the masters?</h3>
          <p className="text-muted text-sm mb-4">Browse all 10 tracked superinvestors and their latest portfolios. Free.</p>
          <a href="/investor" className="inline-block bg-brand text-black font-semibold rounded-xl px-5 py-3 hover:opacity-90 transition">
            See all investors →
          </a>
        </div>

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. See <a href="/methodology" className="underline">methodology</a>.
        </p>
      </div>
    </div>
  );
}
