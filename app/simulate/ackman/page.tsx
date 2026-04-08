import type { Metadata } from "next";
import ManagerBacktest from "@/components/ManagerBacktest";
import EmailCapture from "@/components/EmailCapture";
import { ACKMAN_RETURNS } from "@/lib/returns";

export const metadata: Metadata = {
  title: "What if you'd copied Bill Ackman?",
  description: "Interactive backtest: see how much $10,000 invested with Pershing Square would be worth today, vs the S&P 500.",
  twitter: { card: "summary_large_image", title: "What if you'd copied Bill Ackman?" },
};

export default function AckmanBacktestPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Backtest · Bill Ackman</div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
        What if you'd copied<br />Bill Ackman?
      </h1>
      <p className="text-lg text-muted mb-12 max-w-2xl">
        Drag the sliders. See what Pershing Square Holdings would have turned your money into — and how that
        compares to just buying the S&P 500.
      </p>

      <ManagerBacktest returns={ACKMAN_RETURNS} name="Bill Ackman" />

      <section className="mt-20 pt-12 border-t border-border">
        <h2 className="text-2xl font-bold mb-3">More backtests</h2>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <a href="/simulate/buffett" className="rounded-xl border border-border bg-panel px-5 py-4 hover:border-brand transition">
            <div className="font-semibold">Warren Buffett →</div>
            <div className="text-xs text-muted mt-1">Berkshire Hathaway, 1999-2025</div>
          </a>
          <a href="/investor/bill-ackman" className="rounded-xl border border-border bg-panel px-5 py-4 hover:border-brand transition">
            <div className="font-semibold">Ackman portfolio →</div>
            <div className="text-xs text-muted mt-1">Latest Pershing Square holdings</div>
          </a>
        </div>
      </section>

      <section className="mt-12 pt-12 border-t border-border">
        <h2 className="text-2xl font-bold mb-3">Want every Ackman move?</h2>
        <p className="text-muted mb-6 max-w-xl">
          Get an email the moment Pershing Square files a new 13F.
        </p>
        <EmailCapture />
      </section>
    </div>
  );
}
