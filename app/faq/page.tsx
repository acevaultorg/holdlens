import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "FAQ — HoldLens hedge fund tracking",
  description: "Frequently asked questions about HoldLens, 13F filings, superinvestor tracking, and copy-trading.",
};

const FAQS = [
  {
    q: "Is HoldLens really free?",
    a: "Yes. The core product — investor profiles, ticker pages, backtests, comparisons, learning content, RSS feed — is free forever. A Pro tier with alerts and CSV export is planned but the free tier will never be paywalled.",
  },
  {
    q: "Where does your data come from?",
    a: "100% from public SEC filings — primarily 13F-HR forms filed quarterly, plus Form 4 insider trades and 13G/13D large-position disclosures. No scraping, no paid feeds, no insider info.",
  },
  {
    q: "How often is data updated?",
    a: "Manager portfolios refresh within hours of each 13F filing. 13Fs are due 45 days after each calendar quarter ends, so Q1 data arrives in May, Q2 in August, Q3 in November, Q4 in February.",
  },
  {
    q: "Why is the data 45 days old?",
    a: "That's the legal floor. The SEC requires 13Fs within 45 days of quarter-end. No public source has fresher long-equity data — if you see a service claiming otherwise, it's either non-US data or wrong.",
  },
  {
    q: "Can I actually copy Buffett's trades?",
    a: "Not literally. By the time you see a position on HoldLens, the price has usually moved 5-15% from where Buffett bought. HoldLens is for pattern recognition and idea generation, not copy-trading. See our full explanation in /learn/copy-trading-myth.",
  },
  {
    q: "Why don't you show short positions?",
    a: "13Fs only require long US equity disclosures. Shorts, options (except notional), bonds, foreign stocks, private equity, and crypto are all invisible to us — and to every other 13F tracker. It's a legal limit, not a design choice.",
  },
  {
    q: "How many superinvestors do you track?",
    a: "Currently 10 hand-curated superinvestors: Warren Buffett, Bill Ackman, Carl Icahn, David Einhorn, Seth Klarman, Joel Greenblatt, Michael Burry, Stanley Druckenmiller, Li Lu, and Mohnish Pabrai. Expanding to 82 in v0.4.",
  },
  {
    q: "Is HoldLens investment advice?",
    a: "No. HoldLens is a data tool. We show you what the smartest minds in the market are doing — we never tell you what to buy. Always do your own research and consult a licensed financial advisor.",
  },
  {
    q: "Who's behind HoldLens?",
    a: "HoldLens is a solo-founder product. Built with AI assistance via AcePilot. Contact: hello@holdlens.com",
  },
  {
    q: "Can I get alerts when a manager makes a move?",
    a: "Email alerts are coming in v0.3. Sign up on the homepage to be first in line. One email per 13F filing, no spam.",
  },
  {
    q: "Do you have an API?",
    a: "API tier ships in v0.5. For now, the RSS feed at /feed.xml provides structured updates.",
  },
  {
    q: "Can I embed HoldLens widgets on my blog?",
    a: "Embed widgets are on the roadmap for v0.4. For now, feel free to link to any HoldLens page — we love backlinks.",
  },
];

export default function FAQPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">FAQ</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-12">Frequently asked questions</h1>
      <div className="space-y-8">
        {FAQS.slice(0, Math.ceil(FAQS.length / 2)).map((f, i) => (
          <div key={i} className="border-b border-border pb-8 last:border-0">
            <h2 className="text-xl font-bold mb-3 text-text">{f.q}</h2>
            <p className="text-muted leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>

      <AdSlot format="in-article" />

      <div className="space-y-8">
        {FAQS.slice(Math.ceil(FAQS.length / 2)).map((f, i) => (
          <div key={i + Math.ceil(FAQS.length / 2)} className="border-b border-border pb-8 last:border-0">
            <h2 className="text-xl font-bold mb-3 text-text">{f.q}</h2>
            <p className="text-muted leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-dim pt-8 mt-12">
        Not answered here? Email <a href="mailto:hello@holdlens.com" className="text-brand underline">hello@holdlens.com</a>.
      </p>
    </div>
  );
}
