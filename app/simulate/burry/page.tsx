import type { Metadata } from "next";
import ManagerBacktest from "@/components/ManagerBacktest";
import EmailCapture from "@/components/EmailCapture";
import ShareButtons from "@/components/ShareButtons";
import { BURRY_RETURNS } from "@/lib/returns";

export const metadata: Metadata = {
  title: "What if you'd copied Michael Burry?",
  description: "Interactive backtest: Scion Asset Management returns vs the S&P 500. The Big Short protagonist's real track record.",
  twitter: { card: "summary_large_image", title: "What if you'd copied Michael Burry?" },
};

export default function BurryPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Backtest · Michael Burry</div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
        What if you'd copied<br />Michael Burry?
      </h1>
      <p className="text-lg text-muted mb-12 max-w-2xl">
        The Big Short protagonist's public long returns are… wild. Huge wins in some years, brutal drawdowns in others.
        Drag the sliders to see what the contrarian path would have done.
      </p>

      <ManagerBacktest returns={BURRY_RETURNS} name="Burry" />

      <div className="mt-8">
        <ShareButtons
          title="What if you'd copied Michael Burry? Interactive backtest on HoldLens."
          url="https://holdlens.com/simulate/burry"
        />
      </div>

      <section className="mt-20 pt-12 border-t border-border">
        <h2 className="text-2xl font-bold mb-3">Get Burry move alerts</h2>
        <EmailCapture />
      </section>
    </div>
  );
}
