import type { Metadata } from "next";
import Script from "next/script";
import LiveTicker from "@/components/LiveTicker";
import MobileNav from "@/components/MobileNav";
import DesktopNav from "@/components/DesktopNav";
import DataFreshness from "@/components/DataFreshness";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const TICKER_SCROLL = ["AAPL", "MSFT", "GOOGL", "META", "NVDA", "BRK-B", "AMZN", "JPM", "BAC", "KO", "CVX", "OXY", "AXP", "CMG", "V"];

export const metadata: Metadata = {
  metadataBase: new URL("https://holdlens.com"),
  title: {
    default: "HoldLens — See what the smartest investors are buying",
    template: "%s · HoldLens",
  },
  description:
    "Track 30 of the world's best portfolio managers on a single signed −100..+100 ConvictionScore. +100 is the strongest possible buy. Live prices. Free.",
  openGraph: {
    title: "HoldLens",
    description: "30 of the world's best portfolio managers, one signed −100..+100 conviction scale.",
    url: "https://holdlens.com",
    siteName: "HoldLens",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HoldLens — Smart money, out loud",
    description: "Track 30 of the world's best portfolio managers on one signed −100..+100 ConvictionScore. Free.",
    creator: "@holdlens",
  },
  robots: { index: true, follow: true },
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Perf: preconnect to the origins we WILL hit, so the DNS + TLS
            handshake overlaps with critical rendering instead of blocking it. */}
        <link rel="preconnect" href="https://plausible.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://query1.finance.yahoo.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://plausible.io" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://query1.finance.yahoo.com" />
        {/* Google Consent Mode v2 — default "denied" until CookieConsent banner grants.
            Required by Google for EU traffic serving ads via AdSense. Must run before
            any Google scripts load, so strategy is beforeInteractive. */}
        <Script id="gtag-consent-default" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
            gtag('consent','default',{
              ad_storage:'denied',
              ad_user_data:'denied',
              ad_personalization:'denied',
              analytics_storage:'denied',
              wait_for_update:500
            });
            try{var c=localStorage.getItem('holdlens_cookie_consent_v1');
              if(c==='granted'){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});}
            }catch(e){}`}
        </Script>
        <Script
          defer
          data-domain="holdlens.com"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
        {/* AdSense site verification — loads the loader script on every page so Google
            can verify ownership during onboarding and auto-ads can serve after approval.
            lazyOnload defers until the page is idle, protecting LCP + INP. */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7449214764048186"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <meta name="google-adsense-account" content="ca-pub-7449214764048186" />
      </head>
      <body className="min-h-screen bg-bg text-text font-sans">
        <LiveTicker symbols={TICKER_SCROLL} />
        <header className="border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <a href="/" className="flex items-center gap-2 font-semibold text-lg shrink-0">
              <span className="text-brand">◉</span> HoldLens
            </a>
            {/* Desktop nav — grouped dropdowns at md and up */}
            <DesktopNav />
            {/* Mobile hamburger — below md */}
            <MobileNav />
          </div>
        </header>
        <main>{children}</main>
        <CookieConsent />
        <footer className="border-t border-border mt-24">
          {/* Data freshness band */}
          <div className="border-b border-border bg-panel/30">
            <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap text-xs text-dim">
              <DataFreshness />
              <div>
                Live prices via <a href="https://finance.yahoo.com" className="text-brand hover:underline" target="_blank" rel="noopener noreferrer">Yahoo Finance</a> · 60s cache
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-6 py-8 text-sm text-dim flex flex-col md:flex-row justify-between gap-4">
            <div>© 2026 HoldLens · Data from SEC 13F filings · Not investment advice. · <span className="opacity-50 text-xs">Powered by AcePilot</span></div>
            <div className="flex gap-5 flex-wrap">
              <a href="/best-now" className="hover:text-brand font-semibold">Best now</a>
              <a href="/value" className="hover:text-emerald-400 font-semibold">Value</a>
              <a href="/big-bets" className="hover:text-brand font-semibold">Big bets</a>
              <a href="/rotation" className="hover:text-brand font-semibold">Rotation</a>
              <a href="/new-positions" className="hover:text-emerald-400 font-semibold">New positions</a>
              <a href="/proof" className="hover:text-emerald-400 font-semibold">Proof</a>
              <a href="/buys" className="hover:text-emerald-400">Buys</a>
              <a href="/sells" className="hover:text-rose-400">Sells</a>
              <a href="/portfolio" className="hover:text-brand font-semibold">My portfolio</a>
              <a href="/profile" className="hover:text-text">Profile</a>
              <a href="/this-week" className="hover:text-text">This week</a>
              <a href="/leaderboard" className="hover:text-text">Leaderboard</a>
              <a href="/manager-rankings" className="hover:text-text">Manager rankings</a>
              <a href="/conviction-leaders" className="hover:text-text">Conviction leaders</a>
              <a href="/crowded-trades" className="hover:text-rose-400 font-semibold">Crowded trades</a>
              <a href="/contrarian-bets" className="hover:text-text font-semibold">Contrarian bets</a>
              <a href="/consensus" className="hover:text-emerald-400 font-semibold">Consensus picks</a>
              <a href="/exits" className="hover:text-rose-400 font-semibold">Exits</a>
              <a href="/concentration" className="hover:text-brand font-semibold">Concentration</a>
              <a href="/hidden-gems" className="hover:text-emerald-400 font-semibold">Hidden gems</a>
              <a href="/vs/dataroma" className="hover:text-brand font-semibold">vs Dataroma</a>
              <a href="/quarter/2025-q4" className="hover:text-text">Quarter digest</a>
              <a href="/trend-streak" className="hover:text-emerald-400 font-semibold">Trend streaks</a>
              <a href="/accelerators" className="hover:text-brand font-semibold">Accelerators</a>
              <a href="/overlap" className="hover:text-brand font-semibold">Overlap</a>
              <a href="/by-philosophy" className="hover:text-emerald-400 font-semibold">By philosophy</a>
              <a href="/first-movers" className="hover:text-brand font-semibold">First movers</a>
              <a href="/biggest-buys" className="hover:text-emerald-400 font-semibold">Biggest buys</a>
              <a href="/biggest-sells" className="hover:text-rose-400 font-semibold">Biggest sells</a>
              <a href="/fresh-conviction" className="hover:text-brand font-semibold">Fresh conviction</a>
              <a href="/themes" className="hover:text-brand font-semibold">Themes</a>
              <a href="/reversals" className="hover:text-emerald-400 font-semibold">Reversals</a>
              <a href="/screener" className="hover:text-text">Screener</a>
              <a href="/activity" className="hover:text-text">Activity</a>
              <a href="/insiders" className="hover:text-emerald-400">Insiders</a>
              <a href="/grand" className="hover:text-text">Grand</a>
              <a href="/compare/managers" className="hover:text-text">Compare</a>
              <a href="/top-picks" className="hover:text-text">Top picks</a>
              <a href="/investor" className="hover:text-text">Investors</a>
              <a href="/ticker" className="hover:text-text">Stocks</a>
              <a href="/watchlist" className="hover:text-text">Watchlist</a>
              <a href="/alerts" className="hover:text-text">Alerts</a>
              <a href="/pricing" className="text-brand hover:text-text font-semibold">Pricing</a>
              <a href="/simulate" className="hover:text-text">Backtest</a>
              <a href="/learn" className="hover:text-text">Learn</a>
              <a href="/faq" className="hover:text-text">FAQ</a>
              <a href="/docs" className="hover:text-text">API docs</a>
              <a href="/about" className="hover:text-text">About</a>
              <a href="/contact" className="hover:text-text">Contact</a>
              <a href="/press" className="hover:text-text">Press</a>
              <a href="/changelog" className="hover:text-text">Changelog</a>
              <a href="/privacy" className="hover:text-text">Privacy</a>
              <a href="/terms" className="hover:text-text">Terms</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
