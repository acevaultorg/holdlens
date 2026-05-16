import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import InvestingBooks from "@/components/InvestingBooks";
import AuthorByline from "@/components/AuthorByline";
import ShareStrip from "@/components/ShareStrip";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import LearnReadNext from "@/components/LearnReadNext";
import TldrCard from "@/components/learn/TldrCard";
import OurView from "@/components/learn/OurView";
import CiteThisPage from "@/components/learn/CiteThisPage";

export const metadata: Metadata = {
  title: "Rule 144 holding period — when insiders can sell, and how to read it",
  description:
    "Rule 144 holding periods govern when corporate affiliates can sell restricted or control securities. 6 months for reporting issuers; 12 months otherwise. Why the holding period matters for reading insider trades.",
  alternates: { canonical: "https://holdlens.com/learn/rule-144-holding-period" },
  openGraph: {
    title: "Rule 144 holding period explained",
    description:
      "When insiders can sell restricted or control securities — Rule 144's holding period mechanics and what they signal.",
    url: "https://holdlens.com/learn/rule-144-holding-period",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rule 144 holding period explained",
    description:
      "When insiders can sell restricted/control securities, and what the holding period signals for retail readers.",
    images: ["/og/home.png"],
  },
};

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Learn", item: "https://holdlens.com/learn" },
      { "@type": "ListItem", position: 3, name: "Rule 144 holding period", item: "https://holdlens.com/learn/rule-144-holding-period" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Rule 144 holding period — when insiders can sell, and how to read it",
    description: "Plain English explainer of Rule 144 holding periods for restricted and control securities.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/rule-144-holding-period",
    datePublished: "2026-05-16",
    dateModified: "2026-05-16",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    about: [
      {
        "@type": "DefinedTerm",
        name: "Rule 144 Holding Period",
        description:
          "The minimum time a holder of restricted securities must hold those securities before reselling them publicly under Rule 144. 6 months for securities of a 1934-Act reporting issuer; 12 months for securities of a non-reporting issuer.",
      },
      {
        "@type": "DefinedTerm",
        name: "Restricted Securities",
        description:
          "Securities acquired in unregistered transactions — private placements, Rule 144A offerings, Regulation D offerings, gifts, stock-based compensation grants. Resale is restricted; Rule 144 provides the principal public-resale safe harbor.",
      },
      {
        "@type": "DefinedTerm",
        name: "Control Securities",
        description:
          "Securities held by an affiliate of the issuer (officer, director, 10%+ holder). Resale restrictions apply regardless of when the securities were acquired. Differs from restricted securities, which are restricted by acquisition mode rather than holder status.",
      },
      {
        "@type": "DefinedTerm",
        name: "Affiliate",
        description:
          "A person controlling, controlled by, or under common control with the issuer. Officers, directors, and 10%+ beneficial holders are presumptively affiliates. Affiliate status triggers Rule 144 volume limitations and Form 144 filing obligations on all sales, regardless of whether the securities were originally restricted.",
      },
    ],
  },
];

export default function Rule144Page() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">Rule 144 holding period — when insiders can sell</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Rule 144 holding periods determine when corporate insiders and holders of restricted
          securities can sell publicly. <strong className="text-text">6 months</strong> for
          securities of a 1934-Act reporting issuer (anything publicly listed on a U.S. exchange);
          <strong className="text-text">{" "}12 months</strong> for non-reporting issuers (private
          companies). The clock starts the day the holder paid the full purchase price. After the
          holding period expires, sales are still subject to volume limitations + Form 144 filings
          + manner-of-sale rules.
        </TldrCard>

        <p className="text-lg text-muted">
          Rule 144 is the safe-harbor rule for public resale of restricted and control securities.
          Adopted in 1972 under the Securities Act of 1933, it provides a defined path for
          insiders, founders, and private-placement investors to convert their illiquid securities
          into publicly-tradeable shares — subject to the holding-period and manner-of-sale
          conditions described here.
        </p>

        <AuthorByline date="2026-05-16" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The two holding-period rules</h2>
        <p className="text-muted">
          Rule 144 sets different holding periods based on whether the issuer is a 1934-Act
          reporting company:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>
            <strong className="text-text">Reporting issuer — 6-month holding period.</strong>{" "}
            Applies to any company filing periodic reports (10-K, 10-Q, etc.) with the SEC under
            Section 13 or 15(d) of the Securities Exchange Act. Effectively any publicly-traded U.S.
            issuer.
          </li>
          <li>
            <strong className="text-text">Non-reporting issuer — 12-month holding period.</strong>{" "}
            Applies to private companies whose securities are not subject to Exchange Act periodic
            reporting. Once such a company goes public (becomes a reporting issuer), the holding
            period shifts to 6 months only for securities acquired after the registration.
          </li>
        </ul>
        <p className="text-muted mt-3">
          The clock starts on the date the holder paid the <em>full</em> purchase price (or, for
          gifts, on the donor&apos;s payment date) — Rule 144(d)(3). Stock-option grants don&apos;t
          start the clock until exercise + full payment; restricted stock awards don&apos;t start
          until vesting + delivery.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Post-holding-period restrictions for affiliates</h2>
        <p className="text-muted">
          For non-affiliates of the issuer, the holding period is typically the only Rule 144
          condition — once expired, the securities are freely tradeable. For affiliates (officers,
          directors, 10%+ holders), even after the holding period expires, additional restrictions
          apply:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>
            <strong className="text-text">Volume limitation</strong> — sales in any 3-month period
            cannot exceed the greater of (a) 1% of the outstanding shares of the class or (b) the
            average weekly trading volume of the prior 4 weeks.
          </li>
          <li>
            <strong className="text-text">Manner of sale</strong> — sales must be made through a
            broker in unsolicited transactions, OR directly to a market maker, OR via Rule 144A
            qualified institutional buyer (QIB) transactions.
          </li>
          <li>
            <strong className="text-text">Current public information</strong> — the issuer must
            have current public information available (i.e., be current in its 1934-Act reporting).
          </li>
          <li>
            <strong className="text-text">Form 144 filing</strong> — required if proposed sales in
            any 3-month period would exceed 5,000 shares or $50,000 aggregate market value.{" "}
            <a href="https://secfilingdex.com/learn/form-144/" className="text-brand underline" rel="noopener">
              Form 144 explainer
            </a>.
          </li>
        </ul>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-10 mb-3">Reading Rule 144 signals as an investor</h2>
        <p className="text-muted">
          Three practical reading angles:
        </p>
        <ol className="text-muted space-y-2 list-decimal list-inside">
          <li>
            <strong className="text-text">Post-IPO lockup expirations align with Rule 144</strong>.
            Pre-IPO insiders typically agree to lockup periods (90-180 days post-IPO) that exceed
            Rule 144&apos;s 6-month minimum. When the contractual lockup expires, the Rule 144
            6-month period has already elapsed, freeing the entire pre-IPO holding for sale subject
            only to volume and Form 144 conditions.
          </li>
          <li>
            <strong className="text-text">M&A acquirer stock issued in deal</strong> — when an
            acquirer pays for a target with its own newly-issued stock, the target&apos;s pre-deal
            shareholders typically receive restricted shares that start their own 6-month clock at
            deal close. The first wave of selling pressure from those shareholders typically appears
            ~6 months post-close.
          </li>
          <li>
            <strong className="text-text">Founder + early-employee selling patterns</strong> — Form
            144 filings cluster around earnings releases, after lockup expirations, and at the
            beginning of trading-window opens following blackout periods. Reading the patterns
            tells you whether senior management is selling discretionarily or under 10b5-1 plans
            (which appear as the &quot;plan&quot; characterization on Form 144 trades).
          </li>
        </ol>

        <OurView>
          <p>
            Rule 144 is the structural plumbing that determines when insider supply hits the public
            market. Most retail investors don&apos;t understand it; most professional investors
            track it as a calendar event. Knowing that a pre-IPO holder&apos;s 6-month clock is
            about to expire — and that their entire holding becomes Rule 144-saleable that day —
            is high-value information that&apos;s usually visible 30-60 days in advance via Form
            144 announcements.
          </p>
          <p>
            For tracked-superinvestor reading on HoldLens, the Rule 144 signal often shows up
            indirectly: as 13D/13G filings from late-stage VC investors disclosing 5%+ stakes
            shortly after lockup expiration, as the first wave of Form 4 sales from founders, as
            the cluster of Form 144 filings ahead of a planned secondary offering. Each of these
            traces back to Rule 144 mechanics.
          </p>
        </OurView>

        <p className="text-muted text-sm border-l-2 border-border pl-4 mt-6">
          Pure-reference encyclopedic entry for Form 144 (Rule 144&apos;s primary filing) on our
          sister site:{" "}
          <a href="https://secfilingdex.com/learn/form-144/" className="text-brand underline" rel="noopener">
            secfilingdex.com/learn/form-144
          </a>
          {" "}— Rule 144 mechanics + how Form 144 pairs with Form 4 to track insider sells.
        </p>

        <InvestingBooks
          heading="Foundational reading on securities analysis"
          sub="Rule 144 mechanics shape insider selling patterns. These books — Graham, Lynch, Munger — frame how to weight insider activity in long-horizon investment decisions."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. See <a href="/methodology" className="underline">methodology</a> for
          how we score insider activity across tracked positions.
        </p>

        <CiteThisPage />
        <LearnReadNext currentSlug="rule-144-holding-period" />

        <ShareStrip url="https://holdlens.com/learn/rule-144-holding-period" title="Rule 144 holding period explained" />

        <AdSlot format="horizontal" priority="secondary" />

        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text mb-3">See insider activity live on HoldLens</h2>
          <p className="text-sm text-muted leading-relaxed">
            <a href="/insiders/" className="text-brand hover:underline">Live insider feed</a>
            {" — every Form 4 transaction from the tracked-superinvestor portfolio universe, scored on the HoldLens Insider Score scale. "}
            <a href="/learn/insider-score-explained" className="text-brand hover:underline">Insider Score methodology</a>
            {". Sister property cataloging every form variant: "}
            <a href="https://secfilingdex.com/" className="text-brand hover:underline">SecFilingDex</a>
            {"."}
          </p>
        </section>
      </div>
    </div>
  );
}
