import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn — Plain English guides to hedge fund investing",
  description: "Free guides to 13F filings, copy-trading, hedge fund tracking, and how superinvestors think.",
};

type Article = { slug: string; title: string; desc: string; coming?: boolean };

const ARTICLES: Article[] = [
  { slug: "superinvestor-handbook", title: "The Superinvestor Handbook", desc: "The full 10-section guide — 13F filings, conviction signals, copy-trading myths, and the honest limits of smart-money data. ~15 min read." },
  { slug: "what-is-a-13f", title: "What is a 13F filing?", desc: "Plain English guide to SEC Form 13F. What's in it, when it drops, what it does and doesn't show." },
  { slug: "copy-trading-myth", title: "The copy-trading myth", desc: "Why mechanically copying Buffett's 13F underperforms the underlying portfolio." },
  { slug: "conviction-score-explained", title: "What is a Conviction Score?", desc: "How to tell a real bet from index padding. The −100..+100 scale explained." },
];

export default function LearnIndex() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Learn</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">Plain English guides</h1>
      <p className="text-muted text-lg max-w-2xl mb-12">
        Everything you need to know about following smart money. No jargon, no fluff.
      </p>
      <div className="space-y-4">
        {ARTICLES.map((a) => (
          a.coming ? (
            <div key={a.slug} className="rounded-2xl border border-border bg-panel p-6 opacity-50">
              <div className="text-xl font-bold">{a.title} <span className="text-xs text-dim font-normal">· coming soon</span></div>
              <p className="text-sm text-muted mt-2">{a.desc}</p>
            </div>
          ) : (
            <a key={a.slug} href={`/learn/${a.slug}`}
               className="block rounded-2xl border border-border bg-panel p-6 hover:border-brand transition group">
              <div className="text-xl font-bold group-hover:text-brand transition">{a.title}</div>
              <p className="text-sm text-muted mt-2">{a.desc}</p>
              <div className="text-brand text-sm mt-3">Read →</div>
            </a>
          )
        ))}
      </div>
    </div>
  );
}
