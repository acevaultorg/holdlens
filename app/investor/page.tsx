import type { Metadata } from "next";
import { MANAGERS } from "@/lib/managers";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Investors — All tracked superinvestors",
  description: "Browse all superinvestors tracked by HoldLens. Buffett, Ackman, Icahn, Einhorn, Klarman, Greenblatt and more.",
};

export default function InvestorsIndex() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">All investors</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">{MANAGERS.length} superinvestors tracked</h1>
      <p className="text-muted text-lg max-w-2xl mb-12">
        Curated list of the most important investors to follow. Click any name for their full portfolio,
        conviction analysis, and quarterly moves.
      </p>

      <AdSlot format="horizontal" />

      <div className="grid md:grid-cols-2 gap-4">
        {MANAGERS.map((m) => (
          <a
            key={m.slug}
            href={`/investor/${m.slug}`}
            className="group rounded-2xl border border-border bg-panel p-6 hover:border-brand transition"
          >
            <div className="flex items-baseline justify-between mb-2">
              <h2 className="text-xl font-bold group-hover:text-brand transition">{m.name}</h2>
              <span className="text-xs text-dim">{m.netWorth}</span>
            </div>
            <p className="text-sm text-muted">{m.fund}</p>
            <p className="mt-3 text-sm text-dim italic line-clamp-2">"{m.philosophy}"</p>
            <div className="mt-4 text-xs text-dim flex gap-4">
              <span>{m.topHoldings.length} positions</span>
              <span>Top: {m.topHoldings[0]?.ticker}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
