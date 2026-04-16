import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "About HoldLens",
  description: "HoldLens helps retail investors follow the smartest minds in the market — for free, with conviction analysis.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 prose-content">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">About</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">Smart money, out loud.</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <p>
          HoldLens exists for one reason: <strong>to help retail investors follow the smartest minds in the
          market</strong> — without paying for a Bloomberg terminal, without sifting raw SEC filings,
          and without buying overpriced "stock pick" newsletters.
        </p>
        <p>
          Every quarter, the world's best investors — Warren Buffett, Bill Ackman, David Einhorn, Seth Klarman,
          Joel Greenblatt, Carl Icahn — file disclosures with the SEC. We parse them, score them, and surface
          what actually matters: who's buying, who's selling, and which positions reflect real conviction
          versus mechanical rebalancing.
        </p>
        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">What we believe</h2>
        <ul className="space-y-3 list-disc list-inside text-muted">
          <li><strong className="text-text">Free is non-negotiable</strong> for the core product. Always will be.</li>
          <li><strong className="text-text">Honest about limits</strong> — 13Fs are 45 days late. No copy-trading hype.</li>
          <li><strong className="text-text">Original signal {">"}  data dump</strong> — we add proprietary scoring on top of public data.</li>
          <li><strong className="text-text">No dark patterns</strong> — no countdown timers, no fake urgency, no signup walls.</li>
        </ul>
        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">Not investment advice</h2>
        <p className="text-muted">
          HoldLens shows you what others are doing. It does not tell you what you should do. Always do your own
          research and consult a licensed financial advisor before making investment decisions.
        </p>
      </div>

      <AdSlot format="in-article" />
    </div>
  );
}
