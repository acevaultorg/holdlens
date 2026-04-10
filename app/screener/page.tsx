import type { Metadata } from "next";
import ScreenerClient from "./ScreenerClient";

export const metadata: Metadata = {
  title: "Screener — filter smart money holdings by live metrics",
  description:
    "Interactive stock screener for HoldLens: filter by sector, min tracked owners, min weighted score, live day change. Built on the 30 best portfolio managers in the world.",
  openGraph: { title: "Screener — HoldLens" },
};

export default function ScreenerPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Screener
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3">
        Filter smart money. Live.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-10">
        Every stock held by the best portfolio managers in the world — filtered by
        sector, conviction, ownership, and live day change.
      </p>
      <ScreenerClient />
    </div>
  );
}
