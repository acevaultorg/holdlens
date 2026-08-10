"use client";

// AffiliateLink — the single tracked outbound anchor for every paid link
// on HoldLens (broker referrals on /partners, research-tool links below
// data tables, and the internal /partners cross-links that feed them).
//
// WHY THIS EXISTS (2026-08-11)
// Every affiliate surface on the site was tagged for Plausible ONLY, via
// the `plausible-event-name=...` className convention. Plausible is being
// retired fleet-wide, so those clicks were landing nowhere: GA4 and
// Microsoft Clarity — the two analytics stacks that are definitely live
// on holdlens.com — received no affiliate signal at all. The day a
// program approves, we would have had links but no conversion data.
//
// This component closes that gap by fanning one click out to every
// analytics stack the site ALREADY loads. It adds no new vendor:
//   · Microsoft Clarity  — window.clarity('event' | 'set')   (app/layout.tsx)
//   · Google Analytics 4 — window.gtag('event', ...)         (app/layout.tsx)
//   · Plausible          — className tagging, preserved verbatim so nothing
//                          regresses if/while Plausible is still billed.
//
// COMPLIANCE (rules/affiliate-team-standard.md, non-negotiable):
//   · rel="sponsored nofollow noopener" is hard-coded, not a prop. A
//     caller cannot accidentally ship a followed affiliate link.
//   · target="_blank" — keeps the tab alive so the analytics calls land.
//   · The FTC disclosure is the CALLER's responsibility and must sit
//     immediately adjacent to the link. See PartnerDisclosure below, which
//     exists so no call-site has to hand-roll (and forget) one.
//
// YMYL (rules/google-policy-compliance.md): this component is a link, not
// a placement policy. Brokerage links belong on /partners only. Never
// render one adjacent to a ConvictionScore, signal, or verdict.

import type { ReactNode } from "react";

type AnalyticsWindow = Window & {
  clarity?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
};

/**
 * Fire an outbound-click event into every analytics stack the site loads.
 * Exported so non-anchor call-sites (buttons, programmatic navigations)
 * can report the same event shape.
 *
 * Never throws: analytics must not be able to break a revenue click.
 */
export function trackAffiliateClick(
  partner: string,
  surface: string,
  eventName = "affiliate_click",
): void {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;

  // Microsoft Clarity — custom event + filterable session dimensions.
  try {
    if (typeof w.clarity === "function") {
      w.clarity("event", eventName);
      w.clarity("set", eventName === "affiliate_click" ? "affiliate_partner" : "partners_link_source", partner);
      w.clarity("set", "affiliate_surface", surface);
    }
  } catch {
    /* analytics must never break the click */
  }

  // Google Analytics 4 — the conversion-funnel record.
  try {
    if (typeof w.gtag === "function") {
      w.gtag("event", eventName, {
        partner,
        surface,
        // GA4 reserves `value`/`currency` for revenue; these stay descriptive.
        event_category: "affiliate",
        event_label: `${partner}:${surface}`,
      });
    }
  } catch {
    /* analytics must never break the click */
  }
}

/**
 * Tracked OUTBOUND affiliate anchor. Always sponsored+nofollow+noopener,
 * always new-tab, always instrumented.
 *
 * `partner` is the slug used as the analytics property (e.g. "ibkr").
 * `surface` is where the click happened (e.g. "partners-page").
 */
export default function AffiliateLink({
  href,
  partner,
  surface,
  children,
  className = "",
  ariaLabel,
}: {
  href: string;
  partner: string;
  surface: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  // Preserve the existing Plausible tagged-event convention alongside the
  // GA4/Clarity fan-out, so no measurement is lost during the migration.
  const plausibleTags = `plausible-event-name=Affiliate+Click plausible-event-partner=${encodeURIComponent(
    partner,
  )} plausible-event-surface=${encodeURIComponent(surface)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      aria-label={ariaLabel}
      onClick={() => trackAffiliateClick(partner, surface)}
      className={`${plausibleTags} ${className}`.trim()}
    >
      {children}
    </a>
  );
}

/**
 * Tracked INTERNAL link to /partners. Not an affiliate link — it must NOT
 * carry rel="sponsored" — but it is the top of the affiliate funnel, so it
 * is instrumented with its own event. Without this the funnel
 * (result page → /partners → broker) is unmeasurable at step one.
 */
export function PartnersLink({
  source,
  children,
  className = "",
  ariaLabel,
}: {
  source: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const plausibleTags = `plausible-event-name=Partners+Link plausible-event-source=${encodeURIComponent(source)}`;

  return (
    <a
      href="/partners"
      aria-label={ariaLabel}
      onClick={() => trackAffiliateClick(source, source, "partners_link_click")}
      className={`${plausibleTags} ${className}`.trim()}
    >
      {children}
    </a>
  );
}

/**
 * The FTC disclosure that must sit immediately adjacent to any affiliate
 * link, linking to the canonical disclosure page. Colocated with the link
 * component on purpose: a call-site that renders a paid link without a
 * disclosure is a compliance breach, and the easiest way to prevent that
 * is to make the disclosure one import away.
 */
export function PartnerDisclosure({ what = "Affiliate link" }: { what?: string }) {
  return (
    <div className="text-[11px] text-dim mt-2">
      {what} — HoldLens may receive a referral fee at no extra cost to you. This is not a recommendation and
      does not affect what the data shows. See our{" "}
      <a href="/disclaimer#affiliate-disclosure" className="underline hover:text-muted">
        affiliate disclosure
      </a>
      .
    </div>
  );
}
