import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import LiveTicker from "@/components/LiveTicker";
import MobileNav from "@/components/MobileNav";
import PlausiblePageView from "@/components/PlausiblePageView";
import EngagementTracker from "@/components/EngagementTracker";
import DesktopNav from "@/components/DesktopNav";
import DataFreshness from "@/components/DataFreshness";
import SupportBar from "@/components/SupportBar";
import CookieConsent from "@/components/CookieConsent";
import BackToTop from "@/components/BackToTop";
import FilingWaveBanner from "@/components/FilingWaveBanner";
import InstallPrompt from "@/components/InstallPrompt";
import WebMCP from "@/components/WebMCP";
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
    "Every 13F move from Buffett, Ackman, Burry and 27 other top portfolio managers on a signed +100 buy / −100 sell scale. SEC-sourced. Updated every quarter.",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
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
      //
      // Impact.com affiliate marketplace verification (v1.88, 2026-04-29) —
      // verifies holdlens.com ownership in app.impact.com. Required for
      // affiliate program approval (IBKR, Schwab, Public, Robinhood, Tastytrade
      // per REVENUE_ACTIVATION.md card #1). Impact's verification scraper
      // accepts the standard HTML5 `content=` attribute form (which Next.js
      // emits via this API). If they ever require the literal `value=`
      // attribute form (per their snippet UI) we'd add a parallel
      // dangerouslySetInnerHTML injection in <head>; standard form works for
      // their public scraper.
      "impact-site-verification": "5890806c-03de-4eb8-9041-f2b7b8f761cf",
      // Ezoic Access Now verification (v1.89, 2026-04-29) — verifies
      // holdlens.com ownership during Ezoic onboarding. Ezoic Access Now is
      // a zero-traffic-floor ad-network wrapper that stacks on top of
      // AdSense to lift RPM ~30-60% (per rules/revenue-maximizer.md Layer 5).
      // Once verified + integration set to "Cloudflare", Ezoic auto-injects
      // ad code via the Cloudflare worker — no further site-side changes
      // required.
      "ezoic-site-verification": "DQ9SpjDXsgmj0d7qjFggouaZlB8AjN",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* v1.88 — Impact.com affiliate marketplace verification (literal
            `value=` attribute form). Impact's snippet UI emits the meta tag
            with `value=` instead of the HTML5-standard `content=` (which the
            metadata.verification.other API above also emits in parallel).
            Some Impact verification scrapers specifically grep for the
            `value=` form, so we emit both attribute names to maximize
            scraper compatibility. Spread syntax bypasses React's TS warning
            about `value` on meta tags (HTML5 doesn't define `value` for
            meta, but it's a valid attribute name and renders verbatim). */}
        <meta name="impact-site-verification" {...{ value: "5890806c-03de-4eb8-9041-f2b7b8f761cf" }} />
        {/* Impact.com second partner-account verification (Bookpop media partner,
            2026-05-15). Operator added holdlens.com as a Promotional Property
            under a separate Impact account; this token verifies that account.
            Same `value=` + `content=` dual-attribute trick to satisfy any
            scraper variant. Both Impact accounts can stay verified
            simultaneously — Impact's scraper greps for the specific token
            string, so multiple meta tags are fine. */}
        <meta name="impact-site-verification" content="1bcf0b3b-7f83-4f00-a587-8a437c6add34" {...{ value: "1bcf0b3b-7f83-4f00-a587-8a437c6add34" }} />

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
            Activates when NEXT_PUBLIC_CLARITY_ID is set.

            Project: HoldLens · Industry: Financial Services · ID: wk6syntdl3
            Dashboard: https://clarity.microsoft.com/projects/view/wk6syntdl3
            Configure at: https://clarity.microsoft.com/projects

            FULL CONFIGURATION shipped (every tag + event for cross-tool analysis):

            Custom tags (use as filters in dashboard):
              route               — pathname (filter heatmaps per page)
              route_section       — top-level section (investor|ticker|proxies|events|insiders|learn|...)
              pro                 — true|false from localStorage holdlens_pro_tier
              device_class        — mobile|tablet|desktop from innerWidth
              is_returning_visitor— true|false from localStorage __hl_visited
              entry_page          — first pathname this session (sessionStorage)
              referrer_class      — search|social|llm|direct|other from document.referrer
              investor            — slug on /investor/[slug]/ pages
              ticker              — symbol on /ticker/[symbol]/, /stock/[ticker]/, /signal/[ticker]/
              event_type          — slug on /events/type/[type]/ pages
              last_broker_click   — last broker key clicked (set by broker_click event)
              last_affiliate      — last affiliate context clicked (set by affiliate_click event)

            Custom events (use as conversion goals):
              broker_click        — BrokerCta + AffiliateCTA outbound to broker
              affiliate_click     — AffiliateCTA per-ticker outbound (subset of broker)
              pro_checkout_click  — Stripe Payment Link clicked (begin_checkout)
              share_card_download — share-card PNG downloaded
              learn_complete      — user scrolled ≥90% of a /learn/ article

            PII safety (Finance industry per Clarity Additional Terms):
              <input type="email"> elements wear data-clarity-mask in EmailCapture +
              ProfileClient. Stripe iframe is auto-masked by Clarity (cross-origin).
              No SSN/account/card fields anywhere on the site. */}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <Script id="ms-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_ID}");

              // Helpers: classify referrer + derive route section + device class.
              function __hlReferrerClass(ref) {
                if (!ref) return 'direct';
                try {
                  var h = new URL(ref).hostname.toLowerCase();
                  if (/google\\.|bing\\.|duckduckgo\\.|yandex\\.|brave\\.|baidu\\.|kagi\\.|yahoo\\./.test(h)) return 'search';
                  if (/chat\\.openai\\.|chatgpt\\.|claude\\.ai|perplexity\\.|gemini\\.google\\.|bard\\.google\\.|copilot\\.|you\\.com|phind\\./.test(h)) return 'llm';
                  if (/twitter\\.|x\\.com|t\\.co|facebook\\.|fb\\.|linkedin\\.|reddit\\.|news\\.ycombinator|threads\\.|mastodon\\.|bluesky\\./.test(h)) return 'social';
                  if (h === window.location.hostname) return 'internal';
                  return 'other';
                } catch (e) { return 'other'; }
              }
              function __hlRouteSection(p) {
                var seg = (p || '/').split('/').filter(Boolean)[0] || 'home';
                return seg.toLowerCase();
              }
              function __hlDeviceClass() {
                var w = window.innerWidth || 0;
                if (w >= 1024) return 'desktop';
                if (w >= 640) return 'tablet';
                return 'mobile';
              }
              function __hlPathTags(c, p) {
                // Page-specific tags from pathname regex. Stable: only sets when
                // pattern matches; never wipes a previously-set tag.
                var m;
                m = p.match(/^\\/investor\\/([^\\/]+)/);
                if (m) c('set', 'investor', m[1]);
                m = p.match(/^\\/(?:ticker|stock|signal|short-interest|etf)\\/([^\\/]+)/);
                if (m) c('set', 'ticker', m[1].toUpperCase());
                m = p.match(/^\\/events\\/type\\/([^\\/]+)/);
                if (m) c('set', 'event_type', m[1]);
                m = p.match(/^\\/quarter(?:ly)?\\/([^\\/]+)/);
                if (m) c('set', 'period', m[1]);
              }

              (function setupClarityTags() {
                function tag() {
                  try {
                    if (!window.clarity) return false;
                    var c = window.clarity;
                    var path = window.location.pathname;

                    // Core tags (every session)
                    c('set', 'route', path);
                    c('set', 'route_section', __hlRouteSection(path));
                    c('set', 'device_class', __hlDeviceClass());
                    var pro = window.localStorage && window.localStorage.getItem('holdlens_pro_tier');
                    c('set', 'pro', pro ? 'true' : 'false');

                    // Returning-visitor tag (localStorage flag, set on first visit)
                    try {
                      var visited = window.localStorage && window.localStorage.getItem('__hl_visited');
                      c('set', 'is_returning_visitor', visited ? 'true' : 'false');
                      if (!visited && window.localStorage) {
                        window.localStorage.setItem('__hl_visited', String(Date.now()));
                      }
                    } catch(e) {}

                    // Entry-page + referrer-class (set once per session via sessionStorage)
                    try {
                      var ss = window.sessionStorage;
                      if (ss) {
                        var entry = ss.getItem('__hl_entry');
                        if (!entry) { entry = path; ss.setItem('__hl_entry', entry); }
                        c('set', 'entry_page', entry);
                        var rc = ss.getItem('__hl_refclass');
                        if (!rc) { rc = __hlReferrerClass(document.referrer); ss.setItem('__hl_refclass', rc); }
                        c('set', 'referrer_class', rc);
                      }
                    } catch(e) {}

                    // Page-specific tags
                    __hlPathTags(c, path);
                    return true;
                  } catch(e) { return false; }
                }
                // Try immediately; retry once after Clarity script loads.
                if (!tag()) setTimeout(tag, 1500);

                // Re-tag on SPA route changes (Next.js client navigations).
                // Wraps history.pushState/replaceState + popstate so tags follow
                // the user's current page even without a hard reload.
                if (!window.__hlClarityRouteHook) {
                  window.__hlClarityRouteHook = true;
                  ['pushState','replaceState'].forEach(function(fn){
                    var orig = history[fn];
                    history[fn] = function(){
                      var r = orig.apply(this, arguments);
                      setTimeout(tag, 50);
                      return r;
                    };
                  });
                  window.addEventListener('popstate', function(){ setTimeout(tag, 50); });
                }

                // Global click delegate — fires Clarity events for the 3 high-value
                // CTAs across every page they render. Idempotent; safe to re-run.
                if (!window.__holdlensClarityDelegate) {
                  window.__holdlensClarityDelegate = true;
                  document.addEventListener('click', function(e) {
                    var t = e.target;
                    while (t && t !== document) {
                      if (t.tagName === 'A') {
                        try {
                          var cls = (t.className && t.className.indexOf) ? t.className : '';
                          var href = t.getAttribute && t.getAttribute('href') || '';
                          var ds = t.getAttribute && t.getAttribute('data-clarity-event') || '';

                          // Broker click — uses Plausible CSS-class tags as source
                          if (cls.indexOf && cls.indexOf('plausible-event-broker=') !== -1) {
                            var bm = cls.match(/plausible-event-broker=(\\w+)/);
                            var broker = bm ? bm[1] : 'unknown';
                            if (window.clarity) {
                              window.clarity('event', 'broker_click');
                              window.clarity('set', 'last_broker_click', broker);
                              // Affiliate vs hub broker — affiliate is per-ticker
                              if (cls.indexOf('plausible-event-ticker=') !== -1) {
                                window.clarity('event', 'affiliate_click');
                                window.clarity('set', 'last_affiliate', broker);
                              }
                            }
                          }

                          // Pro checkout click — any Stripe Payment Link link
                          if (href.indexOf('buy.stripe.com') !== -1) {
                            if (window.clarity) {
                              window.clarity('event', 'pro_checkout_click');
                            }
                          }

                          // Generic data-attribute trigger for opt-in events from
                          // any component (e.g. <a data-clarity-event="share_card_download">).
                          if (ds && window.clarity) {
                            window.clarity('event', ds);
                          }
                        } catch(err) {}
                        return;
                      }
                      t = t.parentNode;
                    }
                  }, true);

                  // Programmatic share-card downloads + custom events from React
                  // components. window.dispatchEvent(new CustomEvent('clarity:event', {detail:{name:'share_card_download',tag:{key:'kind',value:'backtest'}}}))
                  window.addEventListener('clarity:event', function(e) {
                    try {
                      if (!window.clarity || !e.detail || !e.detail.name) return;
                      window.clarity('event', e.detail.name);
                      if (e.detail.tag && e.detail.tag.key && e.detail.tag.value) {
                        window.clarity('set', e.detail.tag.key, e.detail.tag.value);
                      }
                    } catch(err) {}
                  });

                  // Learn-article completion — fires once per /learn/ article when
                  // user scrolls ≥90% of the document. Throttled via boolean.
                  if (window.location.pathname.indexOf('/learn/') === 0) {
                    var fired = false;
                    var onScroll = function() {
                      if (fired) return;
                      var d = document.documentElement;
                      var scrolled = (window.scrollY + window.innerHeight) / d.scrollHeight;
                      if (scrolled >= 0.9) {
                        fired = true;
                        try {
                          if (window.clarity) {
                            window.clarity('event', 'learn_complete');
                            window.clarity('set', 'last_learn_completed', window.location.pathname);
                          }
                        } catch(err) {}
                        window.removeEventListener('scroll', onScroll);
                      }
                    };
                    window.addEventListener('scroll', onScroll, { passive: true });
                  }
                }
              })();`}
          </Script>
        )}
        {/* Cloudflare Web Analytics — privacy-friendly, zero-sampling RUM
            (real Core Web Vitals from every visitor). Free at any scale.
            Token is intentionally public (appears in client HTML when active).
            Hardcoded 2026-05-05 because Vercel env var was never set after migration,
            leaving CF dashboard JS-Snippet-mode with 0/0 readings for weeks.
            Auto-mode does NOT work for Vercel-origin sites — only CF Pages/Workers. */}
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={`{"token": "1147c943f0e247719ca839f8d2e6487e"}`}
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
        {/* AdSense Auto Ads — page-level toggle that lets Google scan and inject
            ads automatically without per-slot config. Critical for revenue post-
            Vercel-migration (2026-04-28): env vars for per-slot IDs don't transfer
            with DNS flip; Auto Ads serves on every page even with empty per-slot
            env. Operator can later add slot IDs from AdSense dashboard for richer
            placement, but Auto Ads earns from day one. */}
        <Script id="adsense-auto-ads" strategy="lazyOnload">
          {`(window.adsbygoogle = window.adsbygoogle || []).push({google_ad_client: "ca-pub-7449214764048186", enable_page_level_ads: true});`}
        </Script>
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
        {/* v1.67 — fires the three AAERA signals AUG audit 2026-04-20 flagged
            as missing (engagement 0.20, retention 0.10): scroll-depth (25/
            50/75/100), 90s active time, returning-session d7/d30. Closes
            the Oracle calibration gap per `~/.claude/rules/learn-from-data.md`
            so weekly AUG drift monitoring (CSIL #13) gets real signal. */}
        <Suspense fallback={null}>
          <EngagementTracker />
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
          <div className="max-w-5xl mx-auto px-8 sm:px-6 py-4 flex items-center justify-between gap-4">
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
        <WebMCP />
        <footer className="border-t border-border mt-24">
          {/* Data freshness band */}
          <div className="border-b border-border bg-panel/30">
            <div className="max-w-5xl mx-auto px-8 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap text-xs text-dim">
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
          <div className="max-w-5xl mx-auto px-8 sm:px-6 pt-10 pb-6">
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
                  <li><a href="/methodology" className="text-dim hover:text-text transition">Methodology</a></li>
                  <li><a href="/learn/superinvestor-handbook" className="text-dim hover:text-text transition">Handbook</a></li>
                  <li><a href="/themes" className="text-dim hover:text-text transition">Themes</a></li>
                </ul>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest font-bold text-dim mb-3">Product</div>
                <ul className="space-y-2">
                  <li><a href="/pricing" className="text-brand hover:opacity-80 transition font-semibold">Pro pricing</a></li>
                  <li><a href="/support" className="text-emerald-400 hover:opacity-80 transition font-semibold">Support HoldLens →</a></li>
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
            <div className="max-w-5xl mx-auto px-8 sm:px-6 py-5 flex flex-col md:flex-row justify-between gap-3 text-xs text-dim">
              <div>© 2026 HoldLens · Data from SEC 13F filings · Not investment advice.</div>
              <div className="flex gap-5 flex-wrap">
                <a href="/about" className="hover:text-text transition">About</a>
                <a href="/contact" className="hover:text-text transition">Contact</a>
                <a href="/docs" className="hover:text-text transition">API</a>
                <a href="/changelog" className="hover:text-text transition">Changelog</a>
                <a href="/glossary" className="hover:text-text transition">Glossary</a>
                <a href="/disclaimer" className="hover:text-text transition">Disclaimer</a>
                {/* Pivot A YMYL compliance (2026-05-09) — affiliate disclosure
                    canonical surface. FTC rule + Google Publisher Policies
                    favor visible footer link to affiliate-relationship page
                    from every page. */}
                <a href="/partners" className="hover:text-text transition">Partners</a>
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
