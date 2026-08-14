import type { Metadata } from "next";
import Link from "next/link";
import MethodologyDisclaimer from "@/components/MethodologyDisclaimer";
import AffiliateLink from "@/components/AffiliateLink";

// Pivot A — "Data Display Only" YMYL compliance refactor (2026-05-09)
//
// Per `rules/google-policy-compliance.md` v1.0 + the holdlens
// ADSENSE_REMEDIATION_2026-05-08.md plan: brokerage affiliate links
// were inline on 20+ result pages (/signal/*, /investor/*, /best-now,
// /buys, /sells, etc). On YMYL surfaces — pages that show smart-money
// positioning, ConvictionScore numbers, or per-ticker analysis — that
// placement reads as "unauthorized investment recommendation funneling
// to financial transaction" under Google Publisher Policies →
// Misrepresentation + Deceptive Practices.
//
// Fix: consolidate ALL broker partnerships onto this single dedicated
// /partners page. Result pages get a small text link "See our partner
// brokers →" pointing here, with a clear disclosure block. The
// affiliate links live on a page whose purpose IS to disclose the
// partnerships, not interleave them with positioning data.
//
// Operator activation: per MONETIZATION_STACK.md, brokers activate as
// soon as the matching NEXT_PUBLIC_AFF_<BROKER> env var is set in
// Cloudflare Pages / Vercel. No env var = no link rendered for that
// broker. Substantive editorial content stands regardless of how many
// brokers are configured.

export const metadata: Metadata = {
  title: "Partner with HoldLens — Media Kit & Affiliate Disclosure",
  description:
    "Audience, publisher, and editorial-standards information for partners, plus our full affiliate disclosure. HoldLens is published by Caslon Media. Partnerships are launching now.",
  alternates: { canonical: "https://holdlens.com/partners" },
  openGraph: {
    title: "Partner with HoldLens — Media Kit & Affiliate Disclosure",
    description:
      "Audience, publisher, and editorial-standards information for partners, plus our full affiliate disclosure. Partnerships are launching now.",
    url: "https://holdlens.com/partners",
    type: "website",
  },
  robots: { index: true, follow: true },
};

type Broker = {
  key: string;
  name: string;
  envCanonical: string;
  envLegacy?: string;
  region: string;
  whatItIs: string;
  whoItsFor: string;
  watchOuts: string;
};

const BROKERS: Broker[] = [
  {
    key: "ibkr",
    name: "Interactive Brokers",
    envCanonical: "NEXT_PUBLIC_AFF_IBKR",
    envLegacy: "NEXT_PUBLIC_IBKR_REF",
    region: "Global (US-domiciled, services 200+ countries)",
    whatItIs:
      "A US-listed (NASDAQ: IBKR) prime-broker-grade platform that has been around since 1978. Originally built for professional traders, the retail product (IBKR Lite / Pro) inherited the same API, the same global market reach, and the same SIPC insurance coverage on US accounts.",
    whoItsFor:
      "Investors who want access to non-US markets (London, Hong Kong, Tokyo, Frankfurt, Toronto and 100+ exchanges), pro-grade order routing, and the lowest-in-industry margin rates. Also the platform of choice when an investor wants programmatic / API access alongside a regular brokerage account.",
    watchOuts:
      "The interface is dense. The Pro tier has commission tiers; the Lite tier is commission-free on US equities but routes through a payment-for-order-flow model. Read both before picking.",
  },
  {
    key: "schwab",
    name: "Charles Schwab",
    envCanonical: "NEXT_PUBLIC_AFF_SCHWAB",
    envLegacy: "NEXT_PUBLIC_SCHWAB_REF",
    region: "United States",
    whatItIs:
      "One of the largest US brokerages by client assets ($8+ trillion). Full-service: cash account, brokerage account, IRAs, fractional shares, ETFs, options, fixed income, even direct CD purchases. The 2020 acquisition of TD Ameritrade brought the thinkorswim platform under the same roof.",
    whoItsFor:
      "US residents who want a single one-stop home for their long-term portfolio, IRAs, and active trading. The research depth is meaningful — Schwab's equity ratings and fund analyst reports are publicly cited by financial press.",
    watchOuts:
      "International trading is limited compared to IBKR. New-account funding promos shift quarterly — read the current terms, not last year's.",
  },
  {
    key: "public",
    name: "Public.com",
    envCanonical: "NEXT_PUBLIC_AFF_PUBLIC",
    region: "United States",
    whatItIs:
      "A modern commission-free brokerage with a social-investing layer (visible portfolio sharing, member discussion threads, commentary from professional analysts). FINRA / SIPC insured. Notably, Public removed payment-for-order-flow as a revenue model — the platform earns through tipping, premium memberships, and securities lending.",
    whoItsFor:
      "Newer investors who appreciate transparency about how a broker makes money, plus the social discovery layer (what experienced members hold, what they are accumulating). Fractional-share support is strong.",
    watchOuts:
      "Order routing is solid but not the absolute lowest-latency — fine for buy-and-hold, less ideal for active trading. Tax-loss-harvesting tooling is thinner than at full-service brokers.",
  },
  {
    key: "robinhood",
    name: "Robinhood",
    envCanonical: "NEXT_PUBLIC_AFF_ROBINHOOD",
    region: "United States",
    whatItIs:
      "The mobile-first brokerage that popularised commission-free trading. SIPC-insured, regulated by FINRA / SEC. Retirement accounts (IRAs) and a Gold premium tier (margin, market data, larger instant deposits) round out the product.",
    whoItsFor:
      "Mobile-native users who want a clean, fast UX for buying and holding US equities, ETFs, options, and (where available) crypto. Fractional shares supported.",
    watchOuts:
      "Robinhood has historically generated revenue through payment-for-order-flow. The product is excellent for casual buy-and-hold; investors who want professional-grade research, complex order types, or international markets will outgrow it.",
  },
  {
    key: "etoro",
    name: "eToro",
    envCanonical: "NEXT_PUBLIC_AFF_ETORO",
    envLegacy: "NEXT_PUBLIC_ETORO_REF",
    region: "European Union, United Kingdom, Australia (and select other regions; not US-equity)",
    whatItIs:
      "A European-headquartered multi-asset platform with a distinctive CopyTrader feature — investors can mirror the trades of other public users on the platform automatically. Regulated by CySEC (EU), FCA (UK), and ASIC (Australia).",
    whoItsFor:
      "EU / UK / AU investors who want a single account spanning equities, ETFs, commodities, and (where regulated) crypto. The CopyTrader product is a real differentiator — but it is a discretionary tool, and copy-trading does not eliminate the underlying market risk of any position.",
    watchOuts:
      "Spread costs are higher than at pure-execution brokers. CopyTrader returns are public on the platform — they are real, but past performance of any copy target does not predict future returns. Use the same caution you would use picking a fund manager.",
  },
  {
    key: "moomoo",
    name: "moomoo",
    envCanonical: "NEXT_PUBLIC_AFF_MOOMOO",
    region: "United States, Singapore, Australia, Japan, Malaysia",
    whatItIs:
      "A US / APAC retail brokerage owned by Futu Holdings (NASDAQ: FUTU). Sister product to Futubull (which dominates Hong Kong retail). Pro-grade charting, free Level-2 US market data on the entry tier, and a research feed that draws from institutional sources.",
    whoItsFor:
      "Active traders and chart-driven analysts who want institutional-feeling market data and analytics without paying Bloomberg-tier prices. Strong fit for investors with positions across US and APAC markets.",
    watchOuts:
      "The product surface area is large — onboarding can feel busy. Some advanced features (margin, options, paper trading) are gated behind app sections that require activation.",
  },
  {
    key: "tradere",
    name: "Trade Republic",
    envCanonical: "NEXT_PUBLIC_AFF_TRADEREPUBLIC",
    envLegacy: "NEXT_PUBLIC_TRADEREPUBLIC_REF",
    region: "European Union (Germany, France, Italy, Spain, Austria, Belgium, Ireland, Netherlands, Portugal)",
    whatItIs:
      "A German-licensed full bank (BaFin-supervised) operating an EU-wide mobile brokerage. €1 flat per trade. Cash held in segregated accounts at custodian banks; securities held in book-entry at Clearstream. Standard German deposit insurance (€100k) on cash; standard EU securities-segregation rules on holdings.",
    whoItsFor:
      "EU-resident investors who want a clean, mobile-first home for long-term equity / ETF / bond positions, with negative-real-rate-aware cash interest paid on uninvested balances. Particularly strong for investors building a lifetime ETF savings plan (Sparplan).",
    watchOuts:
      "Order execution routes through LS Exchange (a regulated venue, but quote spreads can be wider than primary-listing exchanges in low-liquidity windows). Not a fit for active intraday trading. No US-domiciled accounts — a separate EU residence is required.",
  },
];

function readRef(envCanonical: string, envLegacy?: string): string | undefined {
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
  void envLegacy;
  return undefined;
}

const PARTNERS_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://holdlens.com/partners",
  url: "https://holdlens.com/partners",
  name: "Partner with HoldLens — Media Kit & Affiliate Disclosure",
  description:
    "Audience, publisher, and editorial-standards information for partners, plus the HoldLens affiliate disclosure. Published by Caslon Media.",
  inLanguage: "en-US",
  isPartOf: { "@type": "WebSite", url: "https://holdlens.com/", name: "HoldLens" },
  publisher: {
    "@type": "Organization",
    name: "Caslon Media",
    description: "Independent network of data and reference sites. Operated by Paulo de Vries.",
  },
};

const BREADCRUMB_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
    { "@type": "ListItem", position: 2, name: "Partners", item: "https://holdlens.com/partners" },
  ],
};

export default function PartnersPage() {
  const active = BROKERS.map((b) => ({ ...b, href: readRef(b.envCanonical, b.envLegacy) }));
  const liveCount = active.filter((b) => b.href).length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 prose-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PARTNERS_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_LD) }} />

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Partners &amp; media kit</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">Partner with HoldLens.</h1>
      <p className="text-lg text-muted leading-relaxed mb-8">
        HoldLens tracks the public SEC 13F filings of 30 superinvestors plus daily Form 4 insider transactions,
        and turns them into per-ticker, per-investor, and per-insider dossiers with an original ConvictionScore
        synthesis. It is read by retail investors and finance-curious professionals who want to see where
        institutional money is positioned — without a Bloomberg terminal. This page is our media kit for
        prospective partners, followed by our full affiliate disclosure.
      </p>

      <MethodologyDisclaimer />

      <div className="space-y-6 text-text leading-relaxed">
        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">Who reads HoldLens</h2>
        <div className="rounded-2xl border border-border bg-panel p-6">
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-widest font-bold text-dim mb-1">Monthly visitors</dt>
              <dd className="text-2xl font-bold text-text">1,758</dd>
              <dd className="text-xs text-dim mt-1">human visitors, last 30 days (GA4, August 2026)</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-widest font-bold text-dim mb-1">Geography</dt>
              <dd className="text-2xl font-bold text-text">US</dd>
              <dd className="text-xs text-dim mt-1">predominantly US audience</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-widest font-bold text-dim mb-1">Reader persona</dt>
              <dd className="text-sm text-muted leading-relaxed">
                Retail investors and finance professionals researching institutional 13F positioning and insider
                activity before making their own decisions.
              </dd>
            </div>
          </dl>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">About the publisher</h2>
        <p>
          HoldLens is published by <strong>Caslon Media</strong>, an independent network of data and reference
          sites operated by Paulo de Vries and registered in the Netherlands (Chamber of Commerce / KvK
          64708101, Amsterdam). Operator identity, mission, and
          editorial principles are documented on the{" "}
          <Link href="/about" className="text-brand hover:underline">about page</Link>. Partnership contact:{" "}
          <a href="mailto:hello@holdlens.com" className="text-brand hover:underline">hello@holdlens.com</a>.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">Editorial standards</h2>
        <p>
          Every data point on HoldLens is derived from public SEC filings and links back to its source filing on
          EDGAR. The scoring computation is fully documented on the{" "}
          <Link href="/methodology" className="text-brand hover:underline">methodology page</Link> — including a
          published backtest that openly reports the ConvictionScore&apos;s lack of predictive signal. A data-freshness
          band in the site footer shows when the underlying filing data was last refreshed, and verified data errors
          are corrected within 48 hours (see <Link href="/contact" className="text-brand hover:underline">contact</Link>).
          We use plain-English descriptive labels, never BUY/SELL recommendation labels.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">How we partner</h2>
        <ul className="space-y-2 list-disc list-inside text-muted">
          <li><strong>Broker</strong> placements live on this dedicated page only — never adjacent to scores, signals, or positioning data anywhere else on the site. Book links (Amazon Associates, and the Audible free trial) do appear in our reading lists and research articles, where a book is the subject rather than a financial product.</li>
          <li>Every affiliate link is FTC-disclosed in plain English, on the page where it appears.</li>
          <li>All affiliate links carry <code className="text-xs">rel=&quot;sponsored nofollow noopener&quot;</code>.</li>
          <li>We never incentivize clicks, never use fake urgency or scarcity, and never accept payment to alter data, scores, or coverage.</li>
          <li>We do not bid on partner brand terms in paid search.</li>
        </ul>
        <p className="text-muted">
          <strong className="text-text">Partnership status:</strong> partnerships are launching now. If you run a
          partner program that fits our audience, contact{" "}
          <a href="mailto:hello@holdlens.com" className="text-brand hover:underline">hello@holdlens.com</a>.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-3 text-text">Affiliate disclosure</h2>
        <p>
          HoldLens is informational only — we do not execute trades, hold client funds, or act as an investment
          advisor. Below are the brokerage platforms we assessed against the three filters described above. If you choose
          to open an account through a link on this page once partnerships are active, HoldLens may receive a
          small affiliate bonus from the broker, at zero additional cost to you. That income helps fund the
          editorial work behind the site.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">What this page is — and what it is not</h2>
        <p>
          <strong>What it is:</strong> a disclosed list of regulated brokerage platforms (each independently
          licensed by FINRA / SIPC / FCA / BaFin / CySEC / ASIC / MAS in their respective jurisdictions) where
          our team has opened accounts at some point. Each broker is described in factual terms: what it is, who
          it tends to fit, and what to read carefully before signing up.
        </p>
        <p>
          <strong>What it is NOT:</strong> a recommendation that you should open any of these accounts. HoldLens
          is not a registered investment advisor, broker-dealer, or financial planner. We do not know your
          financial situation, tax residency, risk tolerance, or investment goals — only you (and a licensed
          professional, if you choose to consult one) can evaluate whether any specific broker fits your
          circumstances. Always read the broker&apos;s own customer agreement, fee schedule, risk disclosure, and
          deposit-protection terms before funding an account.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">How we chose what to list</h2>
        <p>
          Three filters: (1) the broker must be licensed in at least one major regulatory regime — US (FINRA /
          SIPC), UK (FCA), EU (CySEC, BaFin, AMF, or equivalent), Australia (ASIC), or Asia-Pacific
          (MAS / SFC / FSA-Japan); (2) the broker must publish a transparent fee schedule and a clear customer
          agreement; (3) the broker must have a multi-year public operating history with no unresolved
          regulatory action we could find in its primary regulator&apos;s public register. We assess brokers from
          their published documentation and regulatory filings — we do not claim to have personally held an
          account with each one, and you should not read a listing here as a personal endorsement.
          The list deliberately mixes US-only platforms (Schwab, Robinhood),
          EU-only platforms (Trade Republic), and globally-available platforms (IBKR, eToro, Public, moomoo) so
          that visitors from different regions can find a broker that actually serves their jurisdiction.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">The brokers</h2>

        {liveCount === 0 && (
          <div className="rounded-2xl border border-amber-400/40 bg-amber-400/5 p-5 text-sm text-muted my-6">
            <strong className="text-text">Partnerships launching now — no affiliate links are live yet.</strong>{" "}
            Our broker partnerships are listed below for transparency. Direct sign-up links activate on this
            page once each broker&apos;s referral program completes approval. In the meantime you can search for any
            of the broker names below directly to evaluate them.
          </div>
        )}

        <div className="space-y-8 mt-6">
          {active.map((b) => (
            <article key={b.key} className="rounded-2xl border border-border bg-panel p-6">
              <div className="flex items-baseline justify-between gap-2 flex-wrap mb-2">
                <h3 className="text-xl font-bold text-text">{b.name}</h3>
                <div className="text-xs text-dim">{b.region}</div>
              </div>

              <div className="space-y-3 text-sm text-muted leading-relaxed">
                <p>
                  <strong className="text-text">What it is.</strong> {b.whatItIs}
                </p>
                <p>
                  <strong className="text-text">Who it tends to fit.</strong> {b.whoItsFor}
                </p>
                <p>
                  <strong className="text-text">Read carefully.</strong> {b.watchOuts}
                </p>
              </div>

              {b.href ? (
                <div className="mt-4 pt-4 border-t border-border">
                  <AffiliateLink
                    href={b.href}
                    partner={b.key}
                    surface="partners-page"
                    className="inline-flex items-center gap-1 text-brand hover:underline font-semibold text-sm"
                  >
                    Open a {b.name} account →
                  </AffiliateLink>
                  <div className="text-[11px] text-dim mt-2">
                    Affiliate link — HoldLens may receive a referral bonus at no extra cost to you. This is not a
                    recommendation; read {b.name}&apos;s own disclosures before funding an account. See our{" "}
                    <a href="/disclaimer#affiliate-disclosure" className="underline hover:text-muted">
                      affiliate disclosure
                    </a>
                    .
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-border text-[11px] text-dim">
                  Sign-up link not yet active. Search for {b.name} directly to evaluate the platform.
                </div>
              )}
            </article>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-3 text-text">Affiliate compensation, in plain English</h2>
        <p>
          When you click an affiliate link on this page and subsequently open and fund an account with the
          relevant broker, HoldLens may receive a referral fee from that broker. The fee structures vary —
          typically a one-time flat payment per funded account, with the exact amount set by each broker&apos;s
          referral program and subject to change. The fee is paid by the broker, not by you. Affiliate links
          do not change the price, terms, or conditions you receive at the broker.
        </p>
        <p>
          We disclose this clearly because we think you deserve to know. If you would prefer to open an account
          without our affiliate link, simply navigate to the broker&apos;s website directly and sign up there —
          your terms and our editorial content remain identical either way.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">What HoldLens never does</h2>
        <ul className="space-y-2 list-disc list-inside text-muted">
          <li>We never receive payment in exchange for ranking, scoring, or featuring any specific ticker.</li>
          <li>We never receive payment for the order in which brokers appear on this page (the order reflects when each broker entered our list).</li>
          <li>We never tell you which broker to choose, how to allocate your money, or which specific securities to buy or sell.</li>
          <li>We never guarantee any outcome from following any signal, ranking, or analysis published on HoldLens.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">Not investment advice — repeated, intentionally</h2>
        <p className="text-muted">
          The data published on HoldLens (ConvictionScore, smart-money positioning summaries, per-ticker dossiers,
          per-investor profiles) describes <em>what tracked institutional investors and corporate insiders have
          disclosed in public SEC filings</em>. It does not tell you what you should do with your money. Public 13F
          filings are reported with a 45-day SEC filing lag; insider Form 4 disclosures are reported with a 2 to
          4 business-day lag. Past behaviour of any tracked investor does not predict future results, and our
          published 2026 backtest of the ConvictionScore over 221 ticker-quarter pairs found no statistically
          significant predictive signal for forward returns (Pearson r = −0.117). Always do your own research and
          consult a licensed financial advisor before making investment decisions.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">Questions about a partnership</h2>
        <p>
          If you have questions about any specific partnership listed here — including the exact fee a broker
          pays HoldLens, the duration of any referral cookie, or any conflict-of-interest concern — email{" "}
          <a href="mailto:hello@holdlens.com" className="text-brand hover:underline">hello@holdlens.com</a>. We
          will respond on the record. We will also disclose any new partnership added to this page in our public{" "}
          <Link href="/changelog" className="text-brand hover:underline">changelog</Link> on the day it goes
          live.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3 text-text">More from HoldLens</h2>
        <ul className="space-y-2 list-disc list-inside text-muted">
          <li><Link href="/about" className="text-brand hover:underline">About HoldLens</Link> — operator identity, mission, editorial principles</li>
          <li><Link href="/methodology" className="text-brand hover:underline">Methodology</Link> — how the ConvictionScore is computed (with the published backtest)</li>
          <li><Link href="/learn/45-day-lag-explained" className="text-brand hover:underline">The 45-day SEC lag, explained</Link> — why 13F data is never real-time</li>
          <li><Link href="/learn/copy-trading-myth" className="text-brand hover:underline">The copy-trading myth</Link> — what 13Fs cannot tell you</li>
          <li><Link href="/learn/conviction-score-explained" className="text-brand hover:underline">ConvictionScore explained</Link> — plain-English walkthrough</li>
        </ul>
      </div>
    </div>
  );
}
