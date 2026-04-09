import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What is a Conviction Score? — How to spot real bets",
  description: "How HoldLens separates real conviction bets from index padding when reading a hedge fund 13F.",
};

export default function ConvictionPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <a href="/learn" className="text-xs text-muted hover:text-text">← All guides</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn</div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-8">What is a Conviction Score?</h1>
      <p className="text-xl text-muted mb-10">How to tell a real bet from index padding.</p>

      <div className="space-y-6 text-text leading-relaxed">
        <h2 className="text-2xl font-bold mt-8 mb-3">The problem with raw 13Fs</h2>
        <p className="text-muted">
          A typical hedge fund 13F shows 50-200 positions. Most of them are <strong className="text-text">noise</strong>:
          partial hedges, index-replication padding, leftovers from old themes, even mistakes. Only 5-15 positions
          actually represent the manager's <strong className="text-text">real conviction</strong>.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">Three signals of conviction</h2>
        <ol className="text-muted space-y-3 list-decimal list-inside">
          <li><strong className="text-text">Position size relative to typical sizing.</strong> If a manager normally holds
            1-2% positions and has a 15% position, that's a real bet.</li>
          <li><strong className="text-text">Held across multiple quarters.</strong> A position added to over 4-8 quarters
            shows compound conviction. A flash position might be a hedge.</li>
          <li><strong className="text-text">Held through drawdown.</strong> If the stock fell 20% and the manager added,
            they believe in it. If they cut, they didn't.</li>
        </ol>

        <h2 className="text-2xl font-bold mt-8 mb-3">HoldLens Conviction Score</h2>
        <p className="text-muted">
          Coming in v0.4: a 0-100 score that combines all three signals into one number per position. A position
          with a Conviction Score of 90+ means: large for this manager, held for 4+ quarters, added through downturns.
          That's the difference between a real bet and a portfolio filler.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">Why you should care</h2>
        <p className="text-muted">
          Most retail investors who try to "follow the smart money" copy the wrong positions. They see Buffett owns
          200 stocks and figure they should buy a basket of his top 10. But Buffett's <strong className="text-text">real bets</strong>
          are 5-7 positions — the rest is index-replication for the insurance float. Conviction scoring tells you which is which.
        </p>

        <div className="mt-10 rounded-2xl border border-border bg-panel p-6">
          <h3 className="text-lg font-bold mb-2">See it in action</h3>
          <p className="text-muted text-sm mb-4">Browse Buffett's portfolio and see top conviction positions ranked.</p>
          <a href="/investor/warren-buffett" className="inline-block bg-brand text-black font-semibold rounded-xl px-5 py-3 hover:opacity-90 transition">
            Buffett's portfolio →
          </a>
        </div>

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Conviction Score is currently a manual indicator. Algorithmic version ships v0.4. <a href="/methodology" className="underline">Methodology</a>.
        </p>
      </div>
    </div>
  );
}
