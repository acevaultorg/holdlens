// BrokerCta — subtle broker-affiliate CTA for signal/ticker pages.
//
// Revenue model: Interactive Brokers pays ~$200 per funded account opened
// through an affiliate link. Signal-page visitors are by definition
// high-intent retail investors — the exact audience that opens a new
// broker account when a conviction thesis resonates.
//
// Placement is deliberate: the "Found a bet you like? → Open an IBKR account"
// CTA sits AFTER the user has read the smart-money analysis, not before.
// It's a natural next step, not a popup interruption.
//
// Activation: operator signs up for IBKR's referral program, gets an
// affiliate URL, drops it into NEXT_PUBLIC_IBKR_REF in Cloudflare Pages env.
// Until then the component renders nothing — zero UI noise.
//
// Optional alt brokers supported: eToro (NEXT_PUBLIC_ETORO_REF), Trade Republic
// (NEXT_PUBLIC_TRADEREPUBLIC_REF). Any broker the operator has a referral URL
// for can be added to the array with a new env-var entry.

type Broker = {
  key: string;
  label: string;
  pitch: string;
  env: string;
  payout: string;
};

const BROKERS: Broker[] = [
  {
    key: "ibkr",
    label: "Interactive Brokers",
    pitch: "Global reach, pro-grade API, SIPC-insured. Fund the account and get our conviction data for free.",
    env: "NEXT_PUBLIC_IBKR_REF",
    payout: "US-available",
  },
  {
    key: "etoro",
    label: "eToro",
    pitch: "Copy-trading and fractional shares, best for discretionary US-equity bets.",
    env: "NEXT_PUBLIC_ETORO_REF",
    payout: "EU + UK + AU",
  },
  {
    key: "tradere",
    label: "Trade Republic",
    pitch: "€1 flat per trade, EU-native. Best-in-class mobile UI.",
    env: "NEXT_PUBLIC_TRADEREPUBLIC_REF",
    payout: "EU only",
  },
];

function readRef(env: string): string | undefined {
  // Each env var inlined at build time. Enumerated explicitly so static
  // analysis picks them up.
  switch (env) {
    case "NEXT_PUBLIC_IBKR_REF":
      return process.env.NEXT_PUBLIC_IBKR_REF;
    case "NEXT_PUBLIC_ETORO_REF":
      return process.env.NEXT_PUBLIC_ETORO_REF;
    case "NEXT_PUBLIC_TRADEREPUBLIC_REF":
      return process.env.NEXT_PUBLIC_TRADEREPUBLIC_REF;
  }
  return undefined;
}

export default function BrokerCta({
  ticker,
  context = "Found a bet you like?",
}: {
  ticker?: string;
  context?: string;
}) {
  const active = BROKERS.map((b) => ({ ...b, href: readRef(b.env) })).filter(
    (b) => b.href,
  );

  // Render nothing if no broker is configured — keeps signal pages clean
  // while the operator hasn't signed up yet.
  if (active.length === 0) return null;

  return (
    <aside
      className="my-10 rounded-2xl border border-brand/30 bg-brand/5 p-5 md:p-6"
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
