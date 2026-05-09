"use client";

// AffiliateCTA — Pivot A YMYL refactor (2026-05-09)
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
// Pivot A fix: this component now renders a small, optional text
// link to the dedicated /partners page where the full broker list
// lives WITH editorial framing + affiliate disclosure. The link only
// renders when at least one NEXT_PUBLIC_AFF_<BROKER> env var is
// configured — the "render nothing if no affiliate URLs configured"
// semantics from v1.42 are preserved.
//
// The /partners page is the canonical home for the affiliate links.

const AFF_PUBLIC = process.env.NEXT_PUBLIC_AFF_PUBLIC || "";
const AFF_ROBINHOOD = process.env.NEXT_PUBLIC_AFF_ROBINHOOD || "";
const AFF_IBKR = process.env.NEXT_PUBLIC_AFF_IBKR || "";
const AFF_SCHWAB = process.env.NEXT_PUBLIC_AFF_SCHWAB || "";
const AFF_ETORO = process.env.NEXT_PUBLIC_AFF_ETORO || "";
const AFF_MOOMOO = process.env.NEXT_PUBLIC_AFF_MOOMOO || "";

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

  if (!anyBrokerConfigured()) return null;

  return (
    <div className="my-6 text-center text-xs text-dim">
      <a
        href="/partners"
        className="plausible-event-name=Partners+Link plausible-event-source=affiliate-cta inline-flex items-center gap-1 text-muted hover:text-brand transition"
        aria-label="See HoldLens partner brokers and affiliate disclosure"
      >
        See our partner brokers
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}
