import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import LiveTicker from "@/components/LiveTicker";
import MobileNav from "@/components/MobileNav";
import PlausiblePageView from "@/components/PlausiblePageView";
import DesktopNav from "@/components/DesktopNav";
import DataFreshness from "@/components/DataFreshness";
import SupportBar from "@/components/SupportBar";
import CookieConsent from "@/components/CookieConsent";
import BackToTop from "@/components/BackToTop";
import FilingWaveBanner from "@/components/FilingWaveBanner";
import InstallPrompt from "@/components/InstallPrompt";
import Logo from "@/components/Logo";
import "./globals.css";

const TICKER_SCROLL = ["AAPL", "MSFT", "GOOGL", "META", "NVDA", "BRK-B", "AMZN", "JPM", "BAC", "KO", "CVX", "OXY", "AXP", "CMG", "V"];

export const metadata: Metadata = {
  metadataBase: new URL("https://holdlens.com"),
  title: {
    // v1.40 SEO CTR lift — lead with the number. "30 superinvestors" is
    // scannable in a SERP result; number-led titles outperform adjective-led
    // titles in finance/data SERPs by ~15-25% CTR (Ahrefs 2024 study). Keep
    // "HoldLens" as trailing brand for branded-search compounding.
    default: "30 superinvestors, one ConvictionScore — HoldLens",
    template: "%s · HoldLens",
  },
  description:
    "Every 13F move from Buffett, Ackman, Burry and 27 other top portfolio managers — scored on a signed +100 buy / −100 sell scale. SEC-sourced. Live prices. Updated every quarter.",
  openGraph: {
    // v1.40 — honest reframe. Prior "before the market does" implied an info
    // edge that 45-day-lagged 13F data can't deliver and risked a trust break
    // on close reading. New copy promises interpretation + aggregation, which
    // is what the product actually does.
    title: "HoldLens — 30 superinvestors on one −100..+100 ConvictionScore",
    description: "Track every 13F move from Buffett, Ackman, Burry and 27 other top portfolio managers. Signed buy/sell scoring, live prices, free core.",
    url: "https://holdlens.com",
    siteName: "HoldLens",
    type: "website",
    // v0.94 homepage OG fallback — every route that doesn't override this in
    // its own generateMetadata will inherit /og/home.png. Prior to this, the
    // root domain shared as a blank text-only card on every social platform,
    // which is a silent distribution leak for organic referrals.
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HoldLens — 30 superinvestors on one ConvictionScore",
    description: "Every 13F move from Buffett, Ackman, Burry and 27 other top portfolio managers — on one signed +100 buy / −100 sell scale.",
    creator: "@holdlens",
    images: ["/og/home.png"],
  },
  robots: { index: true, follow: true },
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
  // v1.18 — Search engine webmaster verification. Added after audit revealed
  // holdlens.com was NOT registered in Google Search Console, meaning zero
  // crawl stats, zero indexation data, zero SERP impressions visibility. This
  // is the single biggest gap in the "unique-visitors-always-up" compounding
  // engine because without GSC, every SEO ship is blind. Bing/Yandex tokens
  // added for completeness — Bing drives ~3% of US organic, Yandex ~0.5% in
  // EN markets, both free to verify and both feed IndexNow which is a zero-
  // cost instant-crawl API we can ship separately.
  verification: {
    google: "j71mc7etNJQ8O8hAiKXqoPiguv1ePm1M0NSL3gANEGE",
    // yandex: "<token>",  // add when operator registers on yandex.webmaster
    // yahoo:  "<token>",  // add when operator registers on bing.webmaster (same token covers Yahoo since Yahoo is powered by Bing)
    other: {
      // Bing uses <meta name="msvalidate.01" content="..."/>. Populate after
      // Bing Webmaster Tools registration (a separate step — see below).
      // "msvalidate.01": "<bing-token>",
    },
  },
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
        {/* Plausible v2 tracker (v1.11 — migrated from legacy
            script.outbound-links.tagged-events.js → pa-<ID>.js).
            WHY: Plausible rolled out a new per-site tracker + SDK-style
            init (queue → plausible.init). The new dashboard's verifier
            REQUIRES this script src to mark the install verified. Legacy
            scripts still work for data (events flow, dashboard receives),
            but the verifier fails with "Script not detected" — bad UX.
            WHAT THIS SCRIPT GIVES US:
            - Pageview auto-tracking (first-party, single source of truth)
            - Outbound link tracking
            - File download tracking (new — legacy script didn't have this)
            - Form submission tracking (new)
            - Tagged events (className="plausible-event-name=X ...") still
              work identically — preserved in the new tracker for BC.
            The init stub queues calls before the async script loads,
            so `window.plausible(...)` is safe to call from any component
            at any time (e.g., PlausiblePageView below, BacktestShareCard,
            AdSlot, etc. — all existing call sites keep working). */}
        <Script
          id="plausible-init"
          strategy="beforeInteractive"
        >{`
          window.plausible = window.plausible || function(){(plausible.q = plausible.q || []).push(arguments)};
          plausible.init = plausible.init || function(i){plausible.o=i||{}};
          plausible.init();
        `}</Script>
        <Script
          async
          src="https://plausible.io/js/pa--4UvPgnqn5WWDVjuzKOoW.js"
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
        {/* v1.10 — manual Plausible pageview on every route change.
            Fires once on initial load AND on each Next.js Link soft-nav.
            Fixes the silent-pageview-loss since v0.86 (see component).
            Suspense boundary is required because PlausiblePageView uses
            useSearchParams(), which forces client rendering without a
            boundary and breaks Next.js 15 static export. */}
        <Suspense fallback={null}>
          <PlausiblePageView />
        </Suspense>
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
            <a
              href="/"
              className="flex items-center gap-2 font-semibold text-lg shrink-0 hover:opacity-90 transition-base"
              aria-label="HoldLens — home"
            >
              <Logo size={24} className="text-brand" />
              <span>HoldLens</span>
            </a>
            {/* Desktop nav — grouped dropdowns at md and up */}
            <DesktopNav />
            {/* Mobile hamburger — below md */}
            <MobileNav />
          </div>
        </header>
        {/* v0.99 — Filing-wave countdown band. Non-intrusive, one row high,
            dismissible for 14 days. Reframes the 45-day 13F lag as an
            anticipation lever instead of a "why is data old?" confusion.
            Auto-hides after the next filing deadline passes. */}
        <FilingWaveBanner />
        <main id="main">{children}</main>
        <BackToTop />
        <CookieConsent />
        {/* PWA install prompt — dismissible, 20s delay, 60d TTL. See
            components/InstallPrompt.tsx for the retention rationale. */}
        <InstallPrompt />
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
              {/* v1.12 — color rationalization: one neutral muted hue for all 5
                  category headers (uniform hierarchy via weight/size/tracking,
                  not rainbow hue). Link hovers also normalized to text (the
                  full-brightness text color). ONLY amber accent in the footer
                  is "Pro pricing" — the one CTA-worthy highlight. This follows
                  the design system's amber-reserved rule AND keeps emerald
                  reserved for BUY signals everywhere else on the site. */}
              <div>
                <div className="text-[11px] uppercase tracking-widest font-bold text-dim mb-3">Signals</div>
                <ul className="space-y-2">
                  <li><a href="/best-now" className="text-dim hover:text-text transition">Best now</a></li>
                  <li><a href="/value" className="text-dim hover:text-text transition">Value</a></li>
                  <li><a href="/big-bets" className="text-dim hover:text-text transition">Big bets</a></li>
                  <li><a href="/consensus" className="text-dim hover:text-text transition">Consensus picks</a></li>
                  <li><a href="/contrarian-bets" className="text-dim hover:text-text transition">Contrarian bets</a></li>
                </ul>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest font-bold text-dim mb-3">Moves</div>
                <ul className="space-y-2">
                  <li><a href="/biggest-buys" className="text-dim hover:text-text transition">Biggest buys</a></li>
                  <li><a href="/biggest-sells" className="text-dim hover:text-text transition">Biggest sells</a></li>
                  <li><a href="/new-positions" className="text-dim hover:text-text transition">New positions</a></li>
                  <li><a href="/exits" className="text-dim hover:text-text transition">Exits</a></li>
                  <li><a href="/this-week" className="text-dim hover:text-text transition">This week</a></li>
                </ul>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest font-bold text-dim mb-3">Managers</div>
                <ul className="space-y-2">
                  <li><a href="/leaderboard" className="text-dim hover:text-text transition">Leaderboard</a></li>
                  <li><a href="/manager-rankings" className="text-dim hover:text-text transition">Rankings</a></li>
                  <li><a href="/overlap" className="text-dim hover:text-text transition">Overlap</a></li>
                  <li><a href="/concentration" className="text-dim hover:text-text transition">Concentration</a></li>
                  <li><a href="/compare/managers" className="text-dim hover:text-text transition">Compare</a></li>
                </ul>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest font-bold text-dim mb-3">Discover</div>
                <ul className="space-y-2">
                  <li><a href="/rotation" className="text-dim hover:text-text transition">Sector rotation</a></li>
                  <li><a href="/proof" className="text-dim hover:text-text transition">Proof</a></li>
                  <li><a href="/vs/dataroma" className="text-dim hover:text-text transition">vs Dataroma</a></li>
                  <li><a href="/learn/superinvestor-handbook" className="text-dim hover:text-text transition">Handbook</a></li>
                  <li><a href="/themes" className="text-dim hover:text-text transition">Themes</a></li>
                </ul>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest font-bold text-dim mb-3">Product</div>
                <ul className="space-y-2">
                  <li><a href="/pricing" className="text-brand hover:opacity-80 transition font-semibold">Pro pricing</a></li>
                  <li><a href="/premium" className="text-dim hover:text-text transition">Pro features</a></li>
                  <li><a href="/for-ai" className="text-dim hover:text-text transition">For AI / LLM</a></li>
                  <li><a href="/api-terms" className="text-dim hover:text-text transition">API terms</a></li>
                  <li><a href="/watchlist" className="text-dim hover:text-text transition">Watchlist</a></li>
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
