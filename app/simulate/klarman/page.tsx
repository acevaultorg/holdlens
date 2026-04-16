import type { Metadata } from "next";
import ManagerBacktest from "@/components/ManagerBacktest";
import EmailCapture from "@/components/EmailCapture";
import ShareButtons from "@/components/ShareButtons";
import { KLARMAN_RETURNS } from "@/lib/returns";

export const metadata: Metadata = {
  title: "What if you'd copied Seth Klarman?",
  description: "Interactive backtest: Baupost Group returns vs the S&P 500. Margin of safety in action.",
  twitter: { card: "summary_large_image", title: "What if you'd copied Seth Klarman?" },
};

export default function KlarmanPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Backtest · Seth Klarman</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
        What if you'd copied<br />Seth Klarman?
      </h1>
      <p className="text-lg text-muted mb-12 max-w-2xl">
        The author of <em>Margin of Safety</em> holds 30%+ cash for years. Lower volatility, lower highs, lower lows.
        See how that's played out vs the S&P 500.
      </p>

      <ManagerBacktest returns={KLARMAN_RETURNS} name="Klarman" />

      <div className="mt-8">
        <ShareButtons
          title="What if you'd copied Seth Klarman? Interactive backtest on HoldLens."
          url="https://holdlens.com/simulate/klarman"
        />
      </div>

      <section className="mt-20 pt-12 border-t border-border">
        <h2 className="text-2xl font-bold mb-3">Get Klarman move alerts</h2>
        <EmailCapture />
      </section>
    </div>
  );
}
