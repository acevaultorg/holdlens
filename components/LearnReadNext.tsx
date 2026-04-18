import Link from "next/link";

// v1.43 LearnReadNext — the single highest-leverage bounce fix per the
// strategist exit audit. Previously, a user who finished reading any /learn
// article hit a dead end: footer nav + "See pricing" CTA. The most-engaged
// users on the site had no path to a second article.
//
// This component ships a "Read next" bridge at the bottom of every article:
//   - ONE recommended next article (the "adjacent" article by topic order)
//   - ONE "Your next signal" link to /best-now for session-to-session continuity
//
// No tracking, no gates, no dark patterns — just honest navigation that
// treats the /learn hub as a learning path instead of a random grid of
// standalone pages. Reduces single-session bounce on the most-engaged
// audience (article completers).

type Article = { slug: string; title: string; desc: string };

// Authoritative order — matches app/learn/page.tsx ARTICLES array. Kept
// in sync manually: when a new article ships, add it here too. (No runtime
// import because we avoid bundling the full /learn page metadata into every
// article route.)
const LEARN_SEQUENCE: Article[] = [
  { slug: "superinvestor-handbook", title: "The Superinvestor Handbook", desc: "The full 10-section guide — 13F filings, conviction signals, copy-trading myths." },
  { slug: "what-is-a-13f", title: "What is a 13F filing?", desc: "Plain English guide to SEC Form 13F." },
  { slug: "how-to-read-a-13f", title: "How to read a 13F in 5 minutes", desc: "Step-by-step with real Berkshire examples." },
  { slug: "what-is-alpha", title: "What is alpha?", desc: "The hedge fund edge explained without jargon." },
  { slug: "45-day-lag-explained", title: "The 45-day lag in 13F filings", desc: "Why every 13F is six weeks late by design." },
  { slug: "warren-buffett-method", title: "The Warren Buffett method", desc: "Which Buffett principles are actually transferable." },
  { slug: "copy-trading-myth", title: "The copy-trading myth", desc: "Why mechanically copying Buffett underperforms the underlying portfolio." },
  { slug: "conviction-score-explained", title: "What is a Conviction Score?", desc: "How to tell a real bet from index padding." },
  { slug: "survivorship-bias-in-hedge-funds", title: "Survivorship bias in hedge funds", desc: "Why every hedge fund performance number you read is probably an overestimate." },
  { slug: "13f-vs-13d-vs-13g", title: "13F vs 13D vs 13G", desc: "Three SEC filings, three signals." },
];

export default function LearnReadNext({ currentSlug }: { currentSlug: string }) {
  const idx = LEARN_SEQUENCE.findIndex((a) => a.slug === currentSlug);
  // Next article = next in sequence, wrapping back to 0 if at the end.
  // If the current slug isn't found (defensive), fall back to the first
  // article. Always returns something; never renders as empty.
  const next =
    idx === -1
      ? LEARN_SEQUENCE[0]
      : LEARN_SEQUENCE[(idx + 1) % LEARN_SEQUENCE.length];

  return (
    <section
      aria-label="What to read next"
      className="mt-16 pt-8 border-t border-border"
    >
      <div className="text-[10px] uppercase tracking-widest text-insight font-bold mb-4">
        Keep reading
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Primary — next article in the series */}
        <Link
          href={`/learn/${next.slug}`}
          className="group block rounded-card border border-insight/30 bg-surface-insight p-5 hover:border-insight/60 hover:bg-insight/10 transition-all duration-base ease-swift"
        >
          <div className="text-[10px] uppercase tracking-widest text-insight font-semibold mb-1.5">
            Read next →
          </div>
          <div className="text-lg font-bold text-text group-hover:text-insight transition-colors">
            {next.title}
          </div>
          <p className="text-sm text-muted mt-1.5 leading-relaxed">{next.desc}</p>
        </Link>

        {/* Secondary — apply what you just learned to live data */}
        <Link
          href="/best-now"
          className="group block rounded-card border border-brand/30 bg-surface-brand p-5 hover:border-brand/60 hover:bg-brand/10 transition-all duration-base ease-swift"
        >
          <div className="text-[10px] uppercase tracking-widest text-brand font-semibold mb-1.5">
            Apply it now →
          </div>
          <div className="text-lg font-bold text-text group-hover:text-brand transition-colors">
            Today's top buy signals
          </div>
          <p className="text-sm text-muted mt-1.5 leading-relaxed">
            See the ConvictionScore in action across every tracked stock. Live, SEC-sourced, free.
          </p>
        </Link>
      </div>
    </section>
  );
}
