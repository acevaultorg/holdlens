import type { Metadata } from "next";
import Script from "next/script";
import LiveTicker from "@/components/LiveTicker";
import MobileNav from "@/components/MobileNav";
import DesktopNav from "@/components/DesktopNav";
import DataFreshness from "@/components/DataFreshness";
import SupportBar from "@/components/SupportBar";
import CookieConsent from "@/components/CookieConsent";
import BackToTop from "@/components/BackToTop";
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
    title: "HoldLens — Spot smart money moves before the market does",
    description: "30 of the world's best portfolio managers, one signed −100..+100 conviction scale. Live prices. Free.",
    url: "https://holdlens.com",
    siteName: "HoldLens",
    type: "website",
    // v0.94 homepage OG fallback — every route that doesn't override this in
    // its own generateMetadata will inherit /og/home.png. Prior to this, the
    // root domain shared as a blank text-only card on every social platform,
    // which is a silent distribution leak for organic referrals.
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — smart money signal" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HoldLens — Smart money, out loud",
    description: "Track 30 of the world's best portfolio managers on one signed −100..+100 ConvictionScore. Free.",
    creator: "@holdlens",
    images: ["/og/home.png"],
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
        {/* Plausible — tagged-events + outbound-links variant (v0.86).
            - Outbound links auto-track: clicks on external hrefs post an
              "Outbound Link: Click" event with the URL as prop. Amazon
              book clicks, affiliate CTAs, and any external reference get
              measurement for free.
            - Tagged events: any element with
              `className="plausible-event-name=MyEvent"` + optional
              `plausible-event-{prop}=value` fires that event on click.
              Used on high-intent surfaces (InvestingBooks book cards,
              AffiliateCTA brokerage cards, Stripe checkout button). */}
        <Script
          defer
          data-domain="holdlens.com"
          src="https://plausible.io/js/script.outbound-links.tagged-events.js"
          strategy="afterInteractive"
        />
        {/* Google Analytics 4 — conversion funnel + audience building. Fires
            only when NEXT_PUBLIC_GA4_ID is set, so it's a no-op until the
            operator drops in a measurement ID. Consent Mode defaults above
            gate ads/analytics storage until the CookieConsent banner grants. */}
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}', { anonymize_ip: true, send_page_view: true });`}
            </Script>
          </>
        )}
        {/* Microsoft Clarity — free heatmaps + session recordings. The
            highest-signal UX research tool that Plausible can't provide.
            Activates when NEXT_PUBLIC_CLARITY_ID is set. */}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <Script id="ms-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_ID}");`}
          </Script>
        )}
        {/* Cloudflare Web Analytics — privacy-friendly, zero-sampling RUM
            (real Core Web Vitals from every visitor). Free at any scale.
            Activates when NEXT_PUBLIC_CF_ANALYTICS_TOKEN is set. */}
        {process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN && (
          <Script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN}"}`}
            strategy="afterInteractive"
          />
        )}
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
        {/* Skip to main content — keyboard-only users land here on Tab.
            Shows only when focused; invisible otherwise. Critical for a11y
            on pages this dense (50+ nav links otherwise sit between the
            keyboard user and the page content). */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-brand focus:text-black focus:px-3 focus:py-2 focus:rounded-lg focus:font-semibold focus:shadow-lg"
        >
          Skip to main content
        </a>
        <LiveTicker symbols={TICKER_SCROLL} />
        {/* Sticky header (v0.81) — prior versions left users scrolled deep
            inside a 7-10k-px signal dossier with no way back to nav except a
            long scroll up. Sticky with backdrop-blur keeps the primary nav
            always reachable. z-40 sits above page content but below the
            MobileNav overlay (z-50). */}
        <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-md supports-[backdrop-filter]:bg-bg/75">
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
        <main id="main">{children}</main>
        <BackToTop />
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

          {/* Support bar — renders only when an NEXT_PUBLIC_KOFI/BMAC/LIBERAPAY/GITHUB_SPONSORS env var is set */}
          <SupportBar />

          {/* Grouped footer (v0.80) — replaces the previous 51-link flat wall.
              Five columns of 5 curated entry points each, plus a compact legal
              strip. Organized for mental-model clarity: what users come for
              (Signals), what's moving (Moves), who's behind it (Managers),
              how to evaluate (Discover), and product (Product). */}
          <div className="max-w-5xl mx-auto px-6 pt-10 pb-6">
            <nav
              aria-label="Site map"
              className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-8 text-sm"
            >
              <div>
                <div className="text-[11px] uppercase tracking-widest font-bold text-brand mb-3">Signals</div>
                <ul className="space-y-2">
                  <li><a href="/best-now" className="text-dim hover:text-brand transition">Best now</a></li>
                  <li><a href="/value" className="text-dim hover:text-emerald-400 transition">Value</a></li>
                  <li><a href="/big-bets" className="text-dim hover:text-brand transition">Big bets</a></li>
                  <li><a href="/consensus" className="text-dim hover:text-emerald-400 transition">Consensus picks</a></li>
                  <li><a href="/contrarian-bets" className="text-dim hover:text-text transition">Contrarian bets</a></li>
                </ul>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest font-bold text-emerald-400 mb-3">Moves</div>
                <ul className="space-y-2">
                  <li><a href="/biggest-buys" className="text-dim hover:text-emerald-400 transition">Biggest buys</a></li>
                  <li><a href="/biggest-sells" className="text-dim hover:text-rose-400 transition">Biggest sells</a></li>
                  <li><a href="/new-positions" className="text-dim hover:text-emerald-400 transition">New positions</a></li>
                  <li><a href="/exits" className="text-dim hover:text-rose-400 transition">Exits</a></li>
                  <li><a href="/this-week" className="text-dim hover:text-text transition">This week</a></li>
                </ul>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest font-bold text-brand mb-3">Managers</div>
                <ul className="space-y-2">
                  <li><a href="/leaderboard" className="text-dim hover:text-text transition">Leaderboard</a></li>
                  <li><a href="/manager-rankings" className="text-dim hover:text-brand transition">Rankings</a></li>
                  <li><a href="/overlap" className="text-dim hover:text-brand transition">Overlap</a></li>
                  <li><a href="/concentration" className="text-dim hover:text-brand transition">Concentration</a></li>
                  <li><a href="/compare/managers" className="text-dim hover:text-text transition">Compare</a></li>
                </ul>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest font-bold text-emerald-400 mb-3">Discover</div>
                <ul className="space-y-2">
                  <li><a href="/rotation" className="text-dim hover:text-brand transition">Sector rotation</a></li>
                  <li><a href="/proof" className="text-dim hover:text-emerald-400 transition">Proof</a></li>
                  <li><a href="/vs/dataroma" className="text-dim hover:text-brand transition">vs Dataroma</a></li>
                  <li><a href="/learn/superinvestor-handbook" className="text-dim hover:text-emerald-400 transition">Handbook</a></li>
                  <li><a href="/themes" className="text-dim hover:text-brand transition">Themes</a></li>
                </ul>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest font-bold text-text mb-3">Product</div>
                <ul className="space-y-2">
                  <li><a href="/pricing" className="text-brand hover:opacity-80 transition font-semibold">Pro pricing</a></li>
                  <li><a href="/premium" className="text-dim hover:text-brand transition">Pro features</a></li>
                  <li><a href="/watchlist" className="text-dim hover:text-text transition">Watchlist</a></li>
                  <li><a href="/alerts" className="text-dim hover:text-text transition">Email alerts</a></li>
                  <li><a href="/faq" className="text-dim hover:text-text transition">FAQ</a></li>
                </ul>
              </div>
            </nav>
          </div>

          {/* Legal + meta strip */}
          <div className="border-t border-border">
            <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between gap-3 text-xs text-dim">
              <div>© 2026 HoldLens · Data from SEC 13F filings · Not investment advice.</div>
              <div className="flex gap-5 flex-wrap">
                <a href="/about" className="hover:text-text transition">About</a>
                <a href="/contact" className="hover:text-text transition">Contact</a>
                <a href="/docs" className="hover:text-text transition">API</a>
                <a href="/changelog" className="hover:text-text transition">Changelog</a>
                <a href="/privacy" className="hover:text-text transition">Privacy</a>
                <a href="/terms" className="hover:text-text transition">Terms</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
