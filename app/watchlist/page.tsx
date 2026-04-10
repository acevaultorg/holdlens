import type { Metadata } from "next";
import WatchlistClient from "./WatchlistClient";

export const metadata: Metadata = {
  title: "Your watchlist — live prices for tracked tickers",
  description: "Personal watchlist of stocks held by the superinvestors you follow. Live prices. Free.",
  robots: { index: false, follow: true },
};

export default function WatchlistPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Your watchlist</div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3">Watchlist</h1>
      <p className="text-muted text-lg max-w-2xl mb-10">
        Tickers you've starred, with live prices. Stored on this device — no account needed.
      </p>
      <WatchlistClient />
    </div>
  );
}
