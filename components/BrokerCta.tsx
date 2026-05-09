// BrokerCta — Pivot A YMYL refactor (2026-05-09)
//
// Prior version rendered an inline grid of 7 broker cards on every page
// it was used (homepage, /investor/*, /best-now, /buys, /sells, hub
// pages, learn pages, etc.). Per `rules/google-policy-compliance.md`
// v1.0 + the holdlens AdSense remediation plan, inline brokerage
// affiliate placement on YMYL surfaces (pages that show ConvictionScore,
// smart-money positioning, or per-ticker / per-investor analysis) reads
// as "unauthorized investment recommendation funneling to financial
// transaction" under Google Publisher Policies → Misrepresentation.
//
// Pivot A fix: this component now renders a small, optional text link
// to the dedicated /partners page where the full broker list lives WITH
// editorial framing + affiliate disclosure. The link only renders when
// at least one NEXT_PUBLIC_AFF_<BROKER> env var is configured — the
// "render nothing if no broker is configured" semantics are preserved
// from the prior version, so unused affiliate slots stay invisible.
//
// The /partners page is the canonical home for the affiliate links.
// This component is the (minimal, non-YMYL-violating) cross-link.

const AFF_ENV_VARS = [
  "NEXT_PUBLIC_AFF_IBKR",
  "NEXT_PUBLIC_IBKR_REF",
  "NEXT_PUBLIC_AFF_SCHWAB",
  "NEXT_PUBLIC_SCHWAB_REF",
  "NEXT_PUBLIC_AFF_PUBLIC",
  "NEXT_PUBLIC_AFF_ROBINHOOD",
  "NEXT_PUBLIC_AFF_ETORO",
  "NEXT_PUBLIC_ETORO_REF",
  "NEXT_PUBLIC_AFF_MOOMOO",
  "NEXT_PUBLIC_AFF_TRADEREPUBLIC",
  "NEXT_PUBLIC_TRADEREPUBLIC_REF",
] as const;

function anyBrokerConfigured(): boolean {
  // Each env var enumerated explicitly so Next.js static-analyses them
  // at build time. process.env[var] dynamic access does not inline.
  if (process.env.NEXT_PUBLIC_AFF_IBKR) return true;
  if (process.env.NEXT_PUBLIC_IBKR_REF) return true;
  if (process.env.NEXT_PUBLIC_AFF_SCHWAB) return true;
  if (process.env.NEXT_PUBLIC_SCHWAB_REF) return true;
  if (process.env.NEXT_PUBLIC_AFF_PUBLIC) return true;
  if (process.env.NEXT_PUBLIC_AFF_ROBINHOOD) return true;
  if (process.env.NEXT_PUBLIC_AFF_ETORO) return true;
  if (process.env.NEXT_PUBLIC_ETORO_REF) return true;
  if (process.env.NEXT_PUBLIC_AFF_MOOMOO) return true;
  if (process.env.NEXT_PUBLIC_AFF_TRADEREPUBLIC) return true;
  if (process.env.NEXT_PUBLIC_TRADEREPUBLIC_REF) return true;
  return false;
}

void AFF_ENV_VARS;

export default function BrokerCta(_props: { ticker?: string; context?: string }) {
  // Suppress unused-prop warnings — props remain in the signature so
  // existing call-sites (~20 across the app) keep type-checking. The
  // ticker / context inputs no longer drive copy because per Pivot A
  // the per-result inline framing was the YMYL violation; the static
  // /partners link is intentionally context-free.
  void _props;

  if (!anyBrokerConfigured()) return null;

  return (
    <div className="my-8 text-center text-xs text-dim">
      <a
        href="/partners"
        className="plausible-event-name=Partners+Link plausible-event-source=broker-cta inline-flex items-center gap-1 text-muted hover:text-brand transition"
        aria-label="See HoldLens partner brokers and affiliate disclosure"
      >
        See our partner brokers
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}
