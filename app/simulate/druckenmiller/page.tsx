import type { Metadata } from "next";
import ManagerBacktest from "@/components/ManagerBacktest";
import EmailCapture from "@/components/EmailCapture";
import ShareButtons from "@/components/ShareButtons";
import { DRUCK_RETURNS } from "@/lib/returns";

export const metadata: Metadata = {
  title: "What if you'd copied Stanley Druckenmiller?",
  description: "Interactive backtest: Druckenmiller's Duquesne Family Office returns vs the S&P 500.",
  twitter: { card: "summary_large_image", title: "What if you'd copied Stanley Druckenmiller?" },
};

export default function DruckPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Backtest · Stanley Druckenmiller</div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
        What if you'd copied<br />Druckenmiller?
      </h1>
      <p className="text-lg text-muted mb-12 max-w-2xl">
        30+ years without a losing year. Drag the sliders to see what Duquesne Family Office returns
        would have done to your money.
      </p>

      <ManagerBacktest returns={DRUCK_RETURNS} name="Druckenmiller" />

      <div className="mt-8">
        <ShareButtons
          title="What if you'd copied Stanley Druckenmiller? Interactive backtest on HoldLens."
          url="https://holdlens.com/simulate/druckenmiller"
        />
      </div>

      <section className="mt-20 pt-12 border-t border-border">
        <h2 className="text-2xl font-bold mb-3">More backtests</h2>
        <div className="grid md:grid-cols-3 gap-3 mt-4">
          <a href="/simulate/buffett" className="rounded-xl border border-border bg-panel px-5 py-4 hover:border-brand transition">
            <div className="font-semibold">Warren Buffett →</div>
            <div className="text-xs text-muted mt-1">1999-2025</div>
          </a>
          <a href="/simulate/ackman" className="rounded-xl border border-border bg-panel px-5 py-4 hover:border-brand transition">
            <div className="font-semibold">Bill Ackman →</div>
            <div className="text-xs text-muted mt-1">2014-2025</div>
          </a>
          <a href="/investor/stanley-druckenmiller" className="rounded-xl border border-border bg-panel px-5 py-4 hover:border-brand transition">
            <div className="font-semibold">Druck portfolio →</div>
            <div className="text-xs text-muted mt-1">Latest holdings</div>
          </a>
        </div>
      </section>

      <section className="mt-12 pt-12 border-t border-border">
        <h2 className="text-2xl font-bold mb-3">Get Druckenmiller alerts</h2>
        <EmailCapture />
      </section>
    </div>
  );
}
