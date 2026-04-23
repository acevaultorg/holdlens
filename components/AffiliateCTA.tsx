"use client";
// Affiliate CTAs — brokerage referrals on ticker pages.
//
// Operator activation: sign up for any of these affiliate programs and drop the URL into
// the corresponding Cloudflare Pages env var. Each link tracks via referral cookie + pays
// per funded account.
//
//   Interactive Bkrs:  $200 per funded account       → NEXT_PUBLIC_AFF_IBKR     (spec primary)
//   Charles Schwab:    $100-300 per funded account   → NEXT_PUBLIC_AFF_SCHWAB   (spec primary)
//   Public.com:        $25-50 per funded account     → NEXT_PUBLIC_AFF_PUBLIC
//   Robinhood:         $5-10 per funded account      → NEXT_PUBLIC_AFF_ROBINHOOD
//   eToro:             $50-200 per funded account    → NEXT_PUBLIC_AFF_ETORO
//   Moomoo:            $20-100 per funded account    → NEXT_PUBLIC_AFF_MOOMOO
//
// At ~3% click-through and ~5% sign-up rate from clicks, 1000 monthly visitors to /signal/AAPL
// could yield ~1.5 funded IBKR accounts → $300/mo from a single ticker. Compounds across
// 90 ticker pages = ~$27k/mo at scale. That's the math.
//
// All URLs pre-formatted to include the ticker symbol where the broker supports deep linking.

const AFF_PUBLIC = process.env.NEXT_PUBLIC_AFF_PUBLIC || "";
const AFF_ROBINHOOD = process.env.NEXT_PUBLIC_AFF_ROBINHOOD || "";
const AFF_IBKR = process.env.NEXT_PUBLIC_AFF_IBKR || "";
const AFF_SCHWAB = process.env.NEXT_PUBLIC_AFF_SCHWAB || "";
const AFF_ETORO = process.env.NEXT_PUBLIC_AFF_ETORO || "";
const AFF_MOOMOO = process.env.NEXT_PUBLIC_AFF_MOOMOO || "";

type Broker = {
  name: string;
  url: string;
  tagline: string;
  payout: string;
};

function getBrokers(symbol: string): Broker[] {
  const sym = symbol.toUpperCase();
  const out: Broker[] = [];
  if (AFF_PUBLIC)
    out.push({
      name: "Public.com",
      url: AFF_PUBLIC.replace("{SYMBOL}", sym),
      tagline: "Commission-free, social investing, $10 free stock",
      payout: "Get $10 free stock",
    });
  if (AFF_IBKR)
    out.push({
      name: "Interactive Brokers",
      url: AFF_IBKR.replace("{SYMBOL}", sym),
      tagline: "Lowest commissions, global markets, pro-grade",
      payout: "Open IBKR account",
    });
  if (AFF_SCHWAB)
    out.push({
      name: "Charles Schwab",
      url: AFF_SCHWAB.replace("{SYMBOL}", sym),
      tagline: "Full-service US broker, $0 trades, deep research",
      payout: "Open Schwab account",
    });
  if (AFF_ROBINHOOD)
    out.push({
      name: "Robinhood",
      url: AFF_ROBINHOOD.replace("{SYMBOL}", sym),
      tagline: "Free trades, fractional shares, simple UI",
      payout: "Get a free stock",
    });
  if (AFF_ETORO)
    out.push({
      name: "eToro",
      url: AFF_ETORO.replace("{SYMBOL}", sym),
      tagline: "CopyTrader, social investing, multi-asset",
      payout: "Open eToro account",
    });
  if (AFF_MOOMOO)
    out.push({
      name: "moomoo",
      url: AFF_MOOMOO.replace("{SYMBOL}", sym),
      tagline: "Pro trading tools, free real-time data",
      payout: "Open moomoo account",
    });
  return out.slice(0, 3); // Cap at 3 to avoid choice paralysis
}

export default function AffiliateCTA({
  symbol,
  variant = "card",
}: {
  symbol: string;
  variant?: "card" | "inline";
}) {
  const brokers = getBrokers(symbol);

  // v1.42 — no affiliate URLs configured → render nothing. Prior code
  // rendered a dead "Need a brokerage account?" placeholder on all 94
  // signal pages, which occupied hero real-estate with a CTA that went
  // nowhere. Users who land on /signal/AAPL want the signal answer, not
  // a brokerage ad for brokers we're not even referring. Returning null
  // removes the noise; the component wakes up automatically the moment
  // the operator drops any NEXT_PUBLIC_AFF_* env var into CF Pages.
  if (brokers.length === 0) {
    return null;
  }

  return (
    <div className="my-8 rounded-2xl border border-brand/30 bg-brand/5 p-5">
      <div className="text-[10px] uppercase tracking-widest font-bold text-brand mb-2">
        Ready to act on {symbol.toUpperCase()}?
      </div>
      <div className="text-base font-bold text-text mb-1">
        Open a brokerage account in minutes
      </div>
      <p className="text-xs text-muted mb-4">
        Pick one of these vetted brokers — all support {symbol.toUpperCase()} and have no minimum
        deposit. HoldLens earns a small referral when you fund your first account, at no cost to you.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {brokers.map((b) => (
          <a
            key={b.name}
            href={b.url}
            target="_blank"
            rel="sponsored noopener noreferrer"
            // v0.86 Plausible tagged-events — fires "Broker Click" with
            // broker name + ticker context on every click. Lets operator
            // measure per-broker CTR once affiliates go live.
            className={`plausible-event-name=Broker+Click plausible-event-broker=${encodeURIComponent(b.name)} plausible-event-symbol=${symbol.toUpperCase()} rounded-xl border border-border bg-bg/40 hover:border-brand/40 hover:bg-bg/60 p-3 transition group`}
          >
            <div className="font-bold text-sm text-text group-hover:text-brand transition">
              {b.name}
            </div>
            <div className="text-[11px] text-muted leading-tight mt-1 line-clamp-2">{b.tagline}</div>
            <div className="text-xs text-brand font-semibold mt-2">{b.payout} →</div>
          </a>
        ))}
      </div>
      <p className="text-[10px] text-dim mt-3">
        Disclosure: HoldLens earns a referral fee from the brokers above. We only list brokers we'd
        use ourselves. Not investment advice.
      </p>
    </div>
  );
}
