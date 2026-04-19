import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import InvestingBooks from "@/components/InvestingBooks";
import AuthorByline from "@/components/AuthorByline";
import ShareStrip from "@/components/ShareStrip";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import LearnReadNext from "@/components/LearnReadNext";

export const metadata: Metadata = {
  title: "Can you actually copy Warren Buffett? — The honest answer",
  description: "Why 13F-based copy-trading doesn't work the way retail investors think — and what to do instead.",
  alternates: { canonical: "https://holdlens.com/learn/copy-trading-myth" },
  openGraph: {
    title: "Can you actually copy Warren Buffett?",
    description: "Why 13F-based copy-trading doesn't work the way retail investors think — and what to do instead.",
    url: "https://holdlens.com/learn/copy-trading-myth",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Can you actually copy Warren Buffett?",
    description: "Why 13F-based copy-trading doesn't work the way retail investors think.",
    images: ["/og/home.png"],
  },
};

// v1.21 — BreadcrumbList + Article. BreadcrumbList enables sitelinks-style
// breadcrumbs in Google SERPs. Article targets Top Stories / Discover.
const LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Learn", item: "https://holdlens.com/learn" },
      { "@type": "ListItem", position: 3, name: "Can you copy Warren Buffett?", item: "https://holdlens.com/learn/copy-trading-myth" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Can you actually copy Warren Buffett? — The honest answer",
    description:
      "Why 13F-based copy-trading doesn't work the way retail investors think — and what to do instead.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/copy-trading-myth",
    datePublished: "2026-03-15",
    dateModified: "2026-04-10",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
  },
];

export default function CopyMythPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }}
      />
      <a href="/learn" className="text-xs text-muted hover:text-text">← All guides</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">
        Can you actually copy Warren Buffett?
      </h1>
      <p className="text-xl text-muted mb-10">The honest answer: not the way you think.</p>

      <div className="space-y-6 text-text leading-relaxed">
        <AuthorByline date="2026-03-15" updated="2026-04-10" />

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

        <AdSlot format="in-article" priority="primary" />

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

        <InvestingBooks
          heading="Books that reframe how you read 13F data"
          sub="The three books below explain why mechanically copying a portfolio underperforms the portfolio itself. Each is the honest next step after this article."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. See <a href="/methodology" className="underline">methodology</a>.
        </p>

        <LearnReadNext currentSlug="copy-trading-myth" />

        <ShareStrip url="https://holdlens.com/learn/copy-trading-myth" title="Can you actually copy Warren Buffett?" />

        <AdSlot format="horizontal" priority="secondary" />
      </div>
    </div>
  );
}
