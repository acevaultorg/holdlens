import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://holdlens.com"),
  title: {
    default: "HoldLens — See what the smartest investors are buying",
    template: "%s · HoldLens",
  },
  description:
    "Track the portfolios of 14+ superinvestors. Conviction scores, backtests, and weekly moves — free.",
  openGraph: {
    title: "HoldLens",
    description: "See what the smartest investors are buying.",
    url: "https://holdlens.com",
    siteName: "HoldLens",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HoldLens — Smart money, out loud",
    description: "Track 10+ superinvestors. Conviction scores, backtests, weekly moves. Free.",
    creator: "@holdlens",
  },
  robots: { index: true, follow: true },
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          defer
          data-domain="holdlens.com"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen bg-bg text-text font-sans">
        <header className="border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 font-semibold text-lg">
              <span className="text-brand">◉</span> HoldLens
            </a>
            <nav className="flex gap-5 text-sm text-muted">
              <a href="/top-picks" className="hover:text-text transition">Top picks</a>
              <a href="/investor" className="hover:text-text transition">Investors</a>
              <a href="/ticker" className="hover:text-text transition">Stocks</a>
              <a href="/simulate" className="hover:text-text transition hidden md:inline">Backtest</a>
              <a href="/learn" className="hover:text-text transition hidden md:inline">Learn</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-border mt-24">
          <div className="max-w-5xl mx-auto px-6 py-8 text-sm text-dim flex flex-col md:flex-row justify-between gap-4">
            <div>© 2026 HoldLens · Data from SEC 13F filings · Not investment advice. · <span className="opacity-50 text-xs">Powered by AcePilot</span></div>
            <div className="flex gap-5 flex-wrap">
              <a href="/top-picks" className="hover:text-text">Top picks</a>
              <a href="/investor" className="hover:text-text">Investors</a>
              <a href="/ticker" className="hover:text-text">Stocks</a>
              <a href="/simulate" className="hover:text-text">Backtest</a>
              <a href="/learn" className="hover:text-text">Learn</a>
              <a href="/faq" className="hover:text-text">FAQ</a>
              <a href="/about" className="hover:text-text">About</a>
              <a href="/press" className="hover:text-text">Press</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
