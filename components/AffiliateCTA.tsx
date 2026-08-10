// AffiliateCTA — Pivot A YMYL refactor (2026-05-09), activation layer (2026-08-11)
//
// Prior version rendered an inline grid of broker cards on every
// /signal/[ticker]/ + /ticker/[symbol]/ page. Per
// `rules/google-policy-compliance.md` v1.0 + the holdlens AdSense
// remediation plan, inline brokerage affiliate placement on YMYL
// surfaces — pages that surface ConvictionScore numbers + per-ticker
// smart-money positioning analysis — reads as "unauthorized
// investment recommendation funneling to financial transaction"
// under Google Publisher Policies → Misrepresentation + Deceptive
// Practices.
//
// Pivot A fix (unchanged): BROKERAGE links live only on /partners. On a
// result page this component renders at most a small text link there.
//
// 2026-08-11 activation layer — two changes, both dormant until an env
// var is set, so nothing renders and nothing shifts today:
//
//   1. RESEARCH-TOOL SLOT. A research/data tool is not a brokerage: it
//      does not open a funded financial account, so it is allowed to
//      render inline — but only BELOW the data tables, never adjacent to
//      a score. Activating it is one env var, no code edit:
//         NEXT_PUBLIC_AFF_RESEARCH       = the affiliate URL
//         NEXT_PUBLIC_AFF_RESEARCH_NAME  = display name (optional)
//
//   2. TRACKED CLICKS. Both the research link and the /partners
//      cross-link now fan out to GA4 + Microsoft Clarity via
//      components/AffiliateLink. Previously they were tagged for
//      Plausible only, which is being retired fleet-wide — meaning the
//      day a program approved we would have had links but no conversion
//      data. See components/AffiliateLink.tsx for the rationale.
//
// Render-nothing guarantee: with no env var set this component returns
// null — no heading, no empty box, no whitespace, no layout shift.

import AffiliateLink, { PartnersLink, PartnerDisclosure } from "@/components/AffiliateLink";

// Enumerated explicitly (not process.env[dynamic]) so Next.js inlines
// them at build time.
const AFF_PUBLIC = process.env.NEXT_PUBLIC_AFF_PUBLIC || "";
const AFF_ROBINHOOD = process.env.NEXT_PUBLIC_AFF_ROBINHOOD || "";
const AFF_IBKR = process.env.NEXT_PUBLIC_AFF_IBKR || "";
const AFF_SCHWAB = process.env.NEXT_PUBLIC_AFF_SCHWAB || "";
const AFF_ETORO = process.env.NEXT_PUBLIC_AFF_ETORO || "";
const AFF_MOOMOO = process.env.NEXT_PUBLIC_AFF_MOOMOO || "";

const AFF_RESEARCH = process.env.NEXT_PUBLIC_AFF_RESEARCH || "";
const AFF_RESEARCH_NAME = process.env.NEXT_PUBLIC_AFF_RESEARCH_NAME || "our research partner";

function anyBrokerConfigured(): boolean {
  return Boolean(
    AFF_PUBLIC || AFF_ROBINHOOD || AFF_IBKR || AFF_SCHWAB || AFF_ETORO || AFF_MOOMOO,
  );
}

export default function AffiliateCTA(_props: {
  symbol: string;
  variant?: "card" | "inline";
}) {
  // Suppress unused-prop warning — the symbol + variant inputs no
  // longer drive copy because per Pivot A the per-ticker inline
  // framing was the YMYL violation; the static /partners link is
  // intentionally context-free.
  void _props;

  const hasResearch = Boolean(AFF_RESEARCH);
  const hasBrokers = anyBrokerConfigured();

  // Nothing configured → render absolutely nothing.
  if (!hasResearch && !hasBrokers) return null;

  return (
    <>
      {hasResearch && (
        <div className="my-6 rounded-xl border border-border bg-panel p-4">
          <div className="text-[11px] uppercase tracking-widest text-dim font-semibold mb-1.5">
            Go deeper on the numbers
          </div>
          <AffiliateLink
            href={AFF_RESEARCH}
            partner="research"
            surface="ticker-below-table"
            className="text-sm font-semibold text-brand hover:underline"
          >
            Full financials and estimates on {AFF_RESEARCH_NAME} →
          </AffiliateLink>
          <PartnerDisclosure />
        </div>
      )}

      {hasBrokers && (
        <div className="my-6 text-center text-xs text-dim">
          <PartnersLink
            source="affiliate-cta"
            className="inline-flex items-center gap-1 text-muted hover:text-brand transition"
            ariaLabel="See HoldLens partner brokers and affiliate disclosure"
          >
            See our partner brokers
            <span aria-hidden>→</span>
          </PartnersLink>
        </div>
      )}
    </>
  );
}
