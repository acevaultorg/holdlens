import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import PortfolioManager from "@/components/PortfolioManager";
import PortfolioSignals from "@/components/PortfolioSignals";
import PortfolioShareCard from "@/components/PortfolioShareCard";

export const metadata: Metadata = {
  title: "My portfolio — live valuation + smart money signals on your holdings",
  description: "Add your stocks. Get live valuation, day P&L, unrealized gains, and HoldLens recommendation signals on every holding. Stored on your device, never on a server.",
  robots: { index: false, follow: true },
};

export default function PortfolioPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        My portfolio
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3">
        Your stocks. Live. Cross-checked.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-10">
        Add your holdings to see live valuation and how the best portfolio managers in the world
        rate every position. Stored on this device — your portfolio never leaves your browser.
      </p>

      <div className="space-y-6">
        <PortfolioSignals />
        <PortfolioManager />
        <PortfolioShareCard />
      </div>

      <AdSlot format="horizontal" className="mt-10" />

      <p className="text-xs text-dim mt-12 max-w-2xl">
        Privacy: HoldLens stores your holdings in localStorage on this device only. Nothing is sent
        to any server. Clear browser data and your portfolio is gone. Pro members will get optional
        cross-device sync via encrypted Cloudflare KV when v0.3 ships.
      </p>
    </div>
  );
}
