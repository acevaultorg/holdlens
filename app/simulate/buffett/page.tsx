import type { Metadata } from "next";
import Backtest from "@/components/Backtest";
import EmailCapture from "@/components/EmailCapture";
import ShareButtons from "@/components/ShareButtons";

export const metadata: Metadata = {
  title: "What if you'd copied Warren Buffett?",
  description:
    "Interactive backtest: see how much $10,000 invested in Berkshire Hathaway would be worth today, vs the S&P 500.",
};

export default function BuffettBacktestPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Backtest · Warren Buffett
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
        What if you'd copied<br />Warren Buffett?
      </h1>
      <p className="text-lg text-muted mb-12 max-w-2xl">
        Drag the sliders. See what Berkshire Hathaway would have turned your money into — and how that
        compares to just buying the S&P 500.
      </p>

      <Backtest />

      <div className="mt-8">
        <ShareButtons
          title="What if you'd copied Warren Buffett? Interactive backtest on HoldLens."
          url="https://holdlens.com/simulate/buffett"
        />
      </div>

      <section className="mt-20 pt-12 border-t border-border">
        <h2 className="text-2xl font-bold mb-3">Want every future move alert?</h2>
        <p className="text-muted mb-6 max-w-xl">
          Get a one-line email the moment Buffett files a new 13F. First alert usually within 24 hours of filing day.
        </p>
        <EmailCapture />
      </section>

      <section className="mt-20 text-sm text-dim leading-relaxed space-y-3">
        <h3 className="text-text text-base font-semibold mb-2">How the numbers work</h3>
        <p>
          Berkshire Hathaway returns are based on BRK-A annual price performance from public Berkshire shareholder reports.
          S&P 500 returns are total returns (price + dividends reinvested). Both figures ignore taxes and transaction costs.
        </p>
        <p>
          This is a retrospective simulation. Past performance does not predict future results. HoldLens does not provide
          investment advice.
        </p>
      </section>
    </div>
  );
}
