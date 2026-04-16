import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Press kit — HoldLens",
  description: "Press kit, media mentions, and resources for journalists covering HoldLens and hedge fund tracking.",
};

export default function PressPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Press kit</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">For journalists</h1>

      <div className="space-y-8 text-text leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold mb-3">What is HoldLens?</h2>
          <p className="text-muted">
            HoldLens is a free tool that tracks the portfolios of the world's smartest investors — Warren Buffett,
            Bill Ackman, Carl Icahn, Michael Burry, Seth Klarman, and others — by parsing their quarterly SEC 13F
            filings in real time. It includes interactive backtests, conviction scoring, sector rollups, and
            comparison tools.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Quick facts</h2>
          <ul className="text-muted space-y-2 list-disc list-inside">
            <li><strong className="text-text">Launched:</strong> 2026</li>
            <li><strong className="text-text">Founder:</strong> Solo operator</li>
            <li><strong className="text-text">Data source:</strong> SEC EDGAR 13F / Form 4 / 13G/D filings</li>
            <li><strong className="text-text">Investors tracked:</strong> 10 curated superinvestors (expanding to 82)</li>
            <li><strong className="text-text">Indexable pages:</strong> 200+</li>
            <li><strong className="text-text">Pricing:</strong> Free core tier, paid Pro tier coming</li>
            <li><strong className="text-text">Built with:</strong> Next.js, Cloudflare Pages, AcePilot</li>
          </ul>
        </section>

        <AdSlot format="in-article" className="my-4" />

        <section>
          <h2 className="text-2xl font-bold mb-3">Story angles</h2>
          <ul className="text-muted space-y-3 list-disc list-inside">
            <li>"How retail investors are finally getting Bloomberg-grade portfolio tracking for free"</li>
            <li>"Why copy-trading Buffett doesn't work (and what to do instead)"</li>
            <li>"The 45-day delay: what every 13F tracker gets wrong"</li>
            <li>"Interactive backtest: what if you'd copied Warren Buffett since 1999?"</li>
            <li>"Conviction scoring: separating real bets from index padding in hedge fund portfolios"</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Assets you can use</h2>
          <ul className="text-muted space-y-2 list-disc list-inside">
            <li>Screenshots of any backtest: <a href="/simulate" className="text-brand underline">/simulate</a></li>
            <li>Top picks table: <a href="/top-picks" className="text-brand underline">/top-picks</a></li>
            <li>Investor profile pages: <a href="/investor" className="text-brand underline">/investor</a></li>
            <li>Any HoldLens URL — feel free to screenshot and attribute to "holdlens.com"</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Contact</h2>
          <p className="text-muted">
            Press inquiries: <a href="mailto:press@holdlens.com" className="text-brand underline">press@holdlens.com</a><br />
            General: <a href="mailto:hello@holdlens.com" className="text-brand underline">hello@holdlens.com</a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Preferred citation</h2>
          <blockquote className="border-l-2 border-brand pl-4 text-muted italic">
            "According to HoldLens (holdlens.com), which tracks 13F filings from 10+ superinvestors..."
          </blockquote>
        </section>
      </div>
    </div>
  );
}
