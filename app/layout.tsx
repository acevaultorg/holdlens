import type { Metadata } from "next";
import Script from "next/script";
import GlobalSearch from "@/components/GlobalSearch";
import LiveTicker from "@/components/LiveTicker";
import MobileNav from "@/components/MobileNav";
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
            can verify ownership during onboarding and auto-ads can serve after approval. */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7449214764048186"
          crossOrigin="anonymous"
          strategy="afterInteractive"
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
            {/* Desktop nav — md and up */}
            <nav className="hidden md:flex items-center gap-4 text-sm text-muted">
              <a href="/best-now" className="hover:text-brand transition font-semibold">Best now</a>
              <a href="/value" className="hover:text-emerald-400 transition font-semibold">Value</a>
              <a href="/portfolio" className="hover:text-brand transition font-semibold">My portfolio</a>
              <a href="/proof" className="hover:text-emerald-400 transition font-semibold">Proof</a>
              <a href="/leaderboard" className="hover:text-text transition">Leaderboard</a>
              <a href="/this-week" className="hover:text-text transition hidden lg:inline">This week</a>
              <a href="/pricing" className="text-brand hover:text-text transition font-semibold">Pro</a>
              <GlobalSearch />
            </nav>
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
              <div className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  Data current: <span className="text-text font-semibold">Q4 2025</span> · filed 2026-02-14
                </span>
              </div>
              <div>
                Next refresh: <span className="text-text font-semibold">Q1 2026 by 2026-05-15</span>
              </div>
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
              <a href="/proof" className="hover:text-emerald-400 font-semibold">Proof</a>
              <a href="/buys" className="hover:text-emerald-400">Buys</a>
              <a href="/sells" className="hover:text-rose-400">Sells</a>
              <a href="/portfolio" className="hover:text-brand font-semibold">My portfolio</a>
              <a href="/profile" className="hover:text-text">Profile</a>
              <a href="/this-week" className="hover:text-text">This week</a>
              <a href="/leaderboard" className="hover:text-text">Leaderboard</a>
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
