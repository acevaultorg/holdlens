// BrokerCta — subtle broker-affiliate CTA for hub / learn / homepage surfaces.
//
// Sister component: AffiliateCTA (rendered on /ticker/[symbol]/ +
// /signal/[ticker]/). Both components share the same canonical env-var
// convention NEXT_PUBLIC_AFF_<BROKER> so the operator drops ONE value
// per broker and BOTH components activate. Legacy NEXT_PUBLIC_<BROKER>_REF
// names (BrokerCta original spec) still read as fallback for any value
// the operator already set.
//
// Revenue model: Interactive Brokers pays ~$200 per funded account; Schwab
// $100-300; eToro $50-200; moomoo $20-100; Public $25-50; Trade Republic
// flat. Visitors landing on a HoldLens hub are high-intent retail investors
// — the exact audience that opens a new broker account when a thesis
// resonates. Placement is AFTER the analysis, not before — a natural next
// step, not a popup.
//
// Operator activation: per MONETIZATION_STACK.md (2026-04-23) operator
// specified IBKR + Charles Schwab as primary brokers. Drop EITHER:
//   NEXT_PUBLIC_AFF_IBKR=<URL>   (canonical; activates BrokerCta + AffiliateCTA)
//   NEXT_PUBLIC_IBKR_REF=<URL>   (legacy; activates BrokerCta only)
// into Vercel/Cloudflare Pages env. Component renders nothing if no value.
//
// Full env-var inventory: see .env.example at repo root.

type Broker = {
  key: string;
  label: string;
  pitch: string;
  envCanonical: string;  // NEXT_PUBLIC_AFF_* — preferred, matches AffiliateCTA
  envLegacy?: string;    // NEXT_PUBLIC_*_REF — original BrokerCta names
  payout: string;
};

const BROKERS: Broker[] = [
  {
    key: "ibkr",
    label: "Interactive Brokers",
    pitch: "Global reach, pro-grade API, SIPC-insured. ~$200/funded account.",
    envCanonical: "NEXT_PUBLIC_AFF_IBKR",
    envLegacy: "NEXT_PUBLIC_IBKR_REF",
    payout: "US-available",
  },
  {
    key: "schwab",
    label: "Charles Schwab",
    pitch: "$0 commissions on US stocks/ETFs, deep research suite, fractional shares. ~$100-300/funded.",
    envCanonical: "NEXT_PUBLIC_AFF_SCHWAB",
    envLegacy: "NEXT_PUBLIC_SCHWAB_REF",
    payout: "US-available",
  },
  {
    key: "public",
    label: "Public.com",
    pitch: "Commission-free, social investing, $10 free stock signup. ~$25-50/funded.",
    envCanonical: "NEXT_PUBLIC_AFF_PUBLIC",
    payout: "US-available",
  },
  {
    key: "robinhood",
    label: "Robinhood",
    pitch: "Free trades, fractional shares, simple UI. ~$5-10/funded.",
    envCanonical: "NEXT_PUBLIC_AFF_ROBINHOOD",
    payout: "US only",
  },
  {
    key: "etoro",
    label: "eToro",
    pitch: "Copy-trading and fractional shares, best for discretionary US-equity bets. ~$50-200/funded.",
    envCanonical: "NEXT_PUBLIC_AFF_ETORO",
    envLegacy: "NEXT_PUBLIC_ETORO_REF",
    payout: "EU + UK + AU",
  },
  {
    key: "moomoo",
    label: "moomoo",
    pitch: "Pro trading tools, free real-time data. ~$20-100/funded.",
    envCanonical: "NEXT_PUBLIC_AFF_MOOMOO",
    payout: "US + APAC",
  },
  {
    key: "tradere",
    label: "Trade Republic",
    pitch: "€1 flat per trade, EU-native. Best-in-class mobile UI.",
    envCanonical: "NEXT_PUBLIC_AFF_TRADEREPUBLIC",
    envLegacy: "NEXT_PUBLIC_TRADEREPUBLIC_REF",
    payout: "EU only",
  },
];

function readRef(envCanonical: string, envLegacy?: string): string | undefined {
  // Each env var inlined at build time. Enumerated explicitly so static
  // analysis picks them up. Canonical first, legacy as fallback for any
  // value the operator already set under the original BrokerCta spec.
  switch (envCanonical) {
    case "NEXT_PUBLIC_AFF_IBKR":
      return process.env.NEXT_PUBLIC_AFF_IBKR || process.env.NEXT_PUBLIC_IBKR_REF;
    case "NEXT_PUBLIC_AFF_SCHWAB":
      return process.env.NEXT_PUBLIC_AFF_SCHWAB || process.env.NEXT_PUBLIC_SCHWAB_REF;
    case "NEXT_PUBLIC_AFF_PUBLIC":
      return process.env.NEXT_PUBLIC_AFF_PUBLIC;
    case "NEXT_PUBLIC_AFF_ROBINHOOD":
      return process.env.NEXT_PUBLIC_AFF_ROBINHOOD;
    case "NEXT_PUBLIC_AFF_ETORO":
      return process.env.NEXT_PUBLIC_AFF_ETORO || process.env.NEXT_PUBLIC_ETORO_REF;
    case "NEXT_PUBLIC_AFF_MOOMOO":
      return process.env.NEXT_PUBLIC_AFF_MOOMOO;
    case "NEXT_PUBLIC_AFF_TRADEREPUBLIC":
      return process.env.NEXT_PUBLIC_AFF_TRADEREPUBLIC || process.env.NEXT_PUBLIC_TRADEREPUBLIC_REF;
  }
  // Suppress unused-variable warning for envLegacy — included in signature
  // for future brokers that may not have a canonical _AFF_ name yet.
  void envLegacy;
  return undefined;
}

export default function BrokerCta({
  ticker,
  context = "Found a bet you like?",
}: {
  ticker?: string;
  context?: string;
}) {
  const active = BROKERS.map((b) => ({ ...b, href: readRef(b.envCanonical, b.envLegacy) })).filter(
    (b) => b.href,
  );

  // Render nothing if no broker is configured — keeps signal pages clean
  // while the operator hasn't signed up yet.
  if (active.length === 0) return null;

  return (
    <aside
      className="my-10 mx-2 sm:mx-0 rounded-2xl border border-brand/30 bg-brand/5 p-5 md:p-6"
      aria-label="Broker CTA"
    >
      <div className="text-[10px] uppercase tracking-widest font-bold text-brand mb-2">
        Next step
      </div>
      <h3 className="text-lg md:text-xl font-bold mb-1">
        {ticker ? `Want to trade ${ticker}?` : context}
      </h3>
      <p className="text-sm text-muted mb-4">
        We do not execute trades. These are the brokers we use ourselves.
        HoldLens earns a small affiliate bonus if you fund an account — at zero
        extra cost to you. Pick what fits your region.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {active.map((b) => (
          <a
            key={b.key}
            href={b.href}
            target="_blank"
            rel="noopener sponsored nofollow"
            // Tagged Plausible events — matches the pattern established in
            // InvestingBooks so every affiliate click lands in one Events view.
            // Fires "Broker Click" with broker + optional ticker props.
            className={`plausible-event-name=Broker+Click plausible-event-broker=${b.key}${ticker ? ` plausible-event-ticker=${ticker}` : ""} block rounded-xl border border-border bg-bg/50 p-4 hover:border-brand transition`}
          >
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <div className="font-semibold text-text">{b.label}</div>
              <div className="text-[10px] text-dim">{b.payout}</div>
            </div>
            <div className="text-[12px] text-muted leading-relaxed">{b.pitch}</div>
            <div className="text-[11px] text-brand mt-2">Open an account →</div>
          </a>
        ))}
      </div>
      <p className="text-[10px] text-dim mt-4 leading-relaxed">
        Not investment advice. Every trade carries risk of total loss of capital.
        Brokers are independent regulated entities; HoldLens does not hold any
        of your funds at any time.
      </p>
    </aside>
  );
}
