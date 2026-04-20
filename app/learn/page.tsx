import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn — Plain English guides to hedge fund investing",
  description: "Free guides to 13F filings, copy-trading, hedge fund tracking, and how superinvestors think.",
};

// v1.42 — removed the `coming?: boolean` field. The render path below no
// longer has a dead-card branch. Teaser cards (greyed-out, non-linked,
// "coming soon" label) are a thin-content anti-pattern flagged by AdSense
// reviewers and eroded trust when we had placeholder Learn entries. Going
// forward: articles are either live (shipped to /learn/[slug]) or absent
// from this index entirely.
type Article = { slug: string; title: string; desc: string };

const ARTICLES: Article[] = [
  { slug: "superinvestor-handbook", title: "The Superinvestor Handbook", desc: "The full 10-section guide — 13F filings, conviction signals, copy-trading myths, and the honest limits of smart-money data. ~15 min read." },
  { slug: "what-is-a-13f", title: "What is a 13F filing?", desc: "Plain English guide to SEC Form 13F. What's in it, when it drops, what it does and doesn't show." },
  { slug: "how-to-read-a-13f", title: "How to read a 13F filing in 5 minutes", desc: "Step-by-step: open any 13F on EDGAR and know what every field means. With real Berkshire examples." },
  { slug: "what-is-alpha", title: "What is alpha?", desc: "The hedge fund edge explained without jargon. Why 85% of managers have none — and what the 15% have in common." },
  { slug: "45-day-lag-explained", title: "The 45-day lag in 13F filings", desc: "Why every 13F is six weeks late by design — and how to use lagged data without getting burned." },
  { slug: "warren-buffett-method", title: "The Warren Buffett method", desc: "Which Buffett principles are actually transferable to a retail account, and which depend on structural edges you don't have." },
  { slug: "copy-trading-myth", title: "The copy-trading myth", desc: "Why mechanically copying Buffett's 13F underperforms the underlying portfolio." },
  { slug: "conviction-score-explained", title: "What is a Conviction Score?", desc: "How to tell a real bet from index padding. The −100..+100 scale explained." },
  { slug: "survivorship-bias-in-hedge-funds", title: "Survivorship bias in hedge funds", desc: "Why every hedge fund performance number you read is probably an overestimate — and how missing dead funds distorts 13F signals." },
  { slug: "13f-vs-13d-vs-13g", title: "13F vs 13D vs 13G", desc: "Three SEC filings, three signals. The difference between a quarterly portfolio snapshot, an activist disclosure, and a passive big-stake filing — and how to read each one." },
  { slug: "do-hedge-fund-signals-work", title: "Do 13F signals actually predict returns? We ran the backtest", desc: "Original research — April 2026. We backtested our own ConvictionScore over 221 ticker-quarter pairs across 4 quarters. Result: r = −0.12, no predictive signal. Top-decile BUYs underperformed SPY by 5 pts; bottom-decile SELLs beat it by 24 pts. Why, and what to use 13F data for instead." },
  { slug: "buybacks-vs-dividends", title: "Buybacks vs dividends — what's the real difference?", desc: "Both return capital. One is flashier; the other is more tax-efficient. The honest tradeoffs on tax, flexibility, and long-term compounding." },
  { slug: "how-to-read-buyback-disclosures", title: "How to read buyback disclosures", desc: "Where the real buyback numbers live in SEC 10-K, 10-Q, and 8-K filings — plus how to spot debt-funded financial engineering and stock-based-comp distortions." },
  { slug: "13d-vs-13g-activist-filings", title: "13D vs 13G — what the difference actually means", desc: "Plain-English guide: when an investor crosses 5%, which filing they pick reveals their intent. Activist (13D) means board fights. Passive (13G) means index hold." },
  { slug: "short-interest-explained", title: "Short interest, days-to-cover, and squeeze setups", desc: "What short interest actually measures, how days-to-cover is calculated, and why high short interest is BOTH a squeeze setup AND a smart-money signal." },
  { slug: "congressional-stock-trading-stock-act", title: "How the STOCK Act works — Congressional stock trading", desc: "What the STOCK Act of 2012 actually requires, why disclosures show ranges (not exact amounts), how late filings are penalized, and how to read the disclosures." },
];

// v1.20 — CollectionPage + ItemList schema. Google prefers CollectionPage
// for "index of guides" style pages (vs Article) because it's a hub, not a
// single piece of content. ItemList exposes each guide to Google as a
// clickable entity, boosting sitelink eligibility under the guide category.
const LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Learn — Plain English guides to hedge fund investing",
  description:
    "Free guides to 13F filings, copy-trading, hedge fund tracking, and how superinvestors think.",
  url: "https://holdlens.com/learn",
  publisher: { "@id": "https://holdlens.com/#organization" },
  inLanguage: "en-US",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      { "@type": "ListItem", position: 1, url: "https://holdlens.com/learn/superinvestor-handbook", name: "The Superinvestor Handbook" },
      { "@type": "ListItem", position: 2, url: "https://holdlens.com/learn/what-is-a-13f", name: "What is a 13F filing?" },
      { "@type": "ListItem", position: 3, url: "https://holdlens.com/learn/how-to-read-a-13f", name: "How to read a 13F filing in 5 minutes" },
      { "@type": "ListItem", position: 4, url: "https://holdlens.com/learn/what-is-alpha", name: "What is alpha?" },
      { "@type": "ListItem", position: 5, url: "https://holdlens.com/learn/45-day-lag-explained", name: "The 45-day lag in 13F filings" },
      { "@type": "ListItem", position: 6, url: "https://holdlens.com/learn/warren-buffett-method", name: "The Warren Buffett method" },
      { "@type": "ListItem", position: 7, url: "https://holdlens.com/learn/copy-trading-myth", name: "The copy-trading myth" },
      { "@type": "ListItem", position: 8, url: "https://holdlens.com/learn/conviction-score-explained", name: "What is a Conviction Score?" },
      { "@type": "ListItem", position: 9, url: "https://holdlens.com/learn/survivorship-bias-in-hedge-funds", name: "Survivorship bias in hedge funds" },
      { "@type": "ListItem", position: 10, url: "https://holdlens.com/learn/13f-vs-13d-vs-13g", name: "13F vs 13D vs 13G" },
      { "@type": "ListItem", position: 11, url: "https://holdlens.com/learn/do-hedge-fund-signals-work", name: "Do 13F signals actually predict returns? We ran the backtest" },
      { "@type": "ListItem", position: 12, url: "https://holdlens.com/learn/buybacks-vs-dividends", name: "Buybacks vs dividends — what's the real difference?" },
      { "@type": "ListItem", position: 13, url: "https://holdlens.com/learn/how-to-read-buyback-disclosures", name: "How to read buyback disclosures" },
      { "@type": "ListItem", position: 14, url: "https://holdlens.com/learn/13d-vs-13g-activist-filings", name: "13D vs 13G — what the difference actually means" },
      { "@type": "ListItem", position: 15, url: "https://holdlens.com/learn/short-interest-explained", name: "Short interest, days-to-cover, and squeeze setups" },
      { "@type": "ListItem", position: 16, url: "https://holdlens.com/learn/congressional-stock-trading-stock-act", name: "How the STOCK Act works — Congressional stock trading" },
    ],
  },
};

export default function LearnIndex() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Learn</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">Plain English guides</h1>
      <p className="text-muted text-lg max-w-2xl mb-12">
        Everything you need to know about following smart money. No jargon, no fluff.
      </p>
      <div className="space-y-4">
        {ARTICLES.map((a) => (
          <a key={a.slug} href={`/learn/${a.slug}`}
             className="block rounded-2xl border border-border bg-panel p-6 hover:border-brand transition group">
            <div className="text-xl font-bold group-hover:text-brand transition">{a.title}</div>
            <p className="text-sm text-muted mt-2">{a.desc}</p>
            <div className="text-brand text-sm mt-3">Read →</div>
          </a>
        ))}
      </div>
    </div>
  );
}
