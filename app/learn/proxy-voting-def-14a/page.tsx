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
  title: "Proxy voting and DEF 14A — Plain English guide",
  description:
    "DEF 14A is the definitive proxy statement: the document a public company sends shareholders before the annual meeting. Here's what to read, what to skip, and how to vote informed.",
  alternates: { canonical: "https://holdlens.com/learn/proxy-voting-def-14a" },
  openGraph: {
    title: "Proxy voting and DEF 14A",
    description:
      "DEF 14A is the definitive proxy statement public companies send before the annual meeting. What to read, what to skip.",
    url: "https://holdlens.com/learn/proxy-voting-def-14a",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Proxy voting and DEF 14A",
    description:
      "The definitive proxy statement explained — what to read, what to skip, how to vote informed.",
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
      { "@type": "ListItem", position: 3, name: "Proxy voting and DEF 14A", item: "https://holdlens.com/learn/proxy-voting-def-14a" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Proxy voting and DEF 14A — Plain English guide",
    description: "Plain English guide to definitive proxy statements and shareholder voting.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/proxy-voting-def-14a",
    datePublished: "2026-05-16",
    dateModified: "2026-05-16",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    about: [
      {
        "@type": "DefinedTerm",
        name: "DEF 14A",
        description:
          "Definitive proxy statement filed under Section 14(a) of the Securities Exchange Act of 1934. The document a public company sends to shareholders soliciting their vote on board elections, executive compensation, and other governance matters before the annual meeting.",
      },
      {
        "@type": "DefinedTerm",
        name: "Preliminary Proxy (PRE 14A)",
        description:
          "The preliminary version of a proxy statement filed with the SEC for staff review before the definitive (DEF 14A) version is mailed to shareholders. Required when the issuer expects SEC comments on the proposed disclosures.",
      },
      {
        "@type": "DefinedTerm",
        name: "Say-on-Pay Vote",
        description:
          "Non-binding shareholder vote on executive compensation, required annually (or at the frequency shareholders elect) under Section 14A of the Exchange Act, added by the 2010 Dodd-Frank Act. A high 'against' vote is a public-record rebuke even when non-binding.",
      },
      {
        "@type": "DefinedTerm",
        name: "Proxy Advisor",
        description:
          "A firm that issues voting recommendations to institutional investors. ISS (Institutional Shareholder Services) and Glass Lewis are the two dominant advisors; together they influence roughly 90% of institutional proxy votes in the U.S.",
      },
    ],
  },
];

export default function ProxyVotingDef14aPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">Proxy voting and DEF 14A</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          A DEF 14A is the definitive proxy statement — the document a public company is required
          to send shareholders before the annual meeting. It contains{" "}
          <strong className="text-text">director nominees, executive compensation, auditor
          ratification, and shareholder proposals</strong>. It is your formal vehicle for exercising
          shareholder voting rights. The 200-page documents are intimidating; the actual decisions
          you&apos;re voting on usually fit on one page. Read the 1-page summary, skim the
          compensation tables, vote.
        </TldrCard>

        <p className="text-lg text-muted">
          DEF 14A is filed under{" "}
          <strong className="text-text">Section 14(a) of the Securities Exchange Act of 1934</strong>{" "}
          and the related Regulation 14A. Every U.S. public company files one annually before its
          annual meeting; the document solicits shareholder votes on the corporate governance
          decisions the bylaws assign to the shareholders.
        </p>

        <AuthorByline date="2026-05-16" />

        <h2 className="text-2xl font-bold mt-10 mb-3">What you&apos;re actually voting on</h2>
        <p className="text-muted">
          The substantive votes in a typical large-cap DEF 14A:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>
            <strong className="text-text">Election of directors</strong> — usually the full board,
            one vote per nominee, typically uncontested. The board recommends &quot;FOR all
            nominees&quot;. Withholding votes is the standard mechanism for dissent.
          </li>
          <li>
            <strong className="text-text">Ratification of auditor</strong> — typically a formality,
            very rarely defeated.
          </li>
          <li>
            <strong className="text-text">Say-on-pay</strong> — annual non-binding vote on executive
            compensation. The board recommends &quot;FOR&quot; their own compensation; institutional
            holders sometimes vote against based on proxy-advisor recommendations.
          </li>
          <li>
            <strong className="text-text">Equity-plan amendments</strong> — when management wants
            additional shares for stock-based compensation. Dilutive; warrants close reading.
          </li>
          <li>
            <strong className="text-text">Shareholder proposals</strong> — Rule 14a-8 lets eligible
            shareholders submit binding or precatory proposals. The board nearly always recommends
            against them. Modern activist proposals: emissions targets, board diversity, political-
            spending transparency, executive-clawback policies.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">The compensation table — the highest-density disclosure in the document</h2>
        <p className="text-muted">
          The DEF 14A&apos;s Summary Compensation Table reports the previous three fiscal years
          of total compensation for the CEO, CFO, and three other most-highly-compensated
          executives (the &quot;named executive officers&quot;). For each, it shows:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>Base salary</li>
          <li>Cash bonus</li>
          <li>Stock awards (grant-date fair value)</li>
          <li>Option awards (Black-Scholes valuation)</li>
          <li>Non-equity incentive plan compensation</li>
          <li>Pension and deferred compensation changes</li>
          <li>All other compensation (perquisites)</li>
          <li>Total</li>
        </ul>
        <p className="text-muted mt-3">
          The 2022 amendments added a &quot;Pay versus Performance&quot; disclosure comparing
          reported compensation to compensation actually realized and to TSR (total shareholder
          return). For sophisticated readers, the gap between &quot;reported&quot; and{" "}
          &quot;actually paid&quot; is often where the story is.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-10 mb-3">Why most retail shareholders don&apos;t vote (and why they should)</h2>
        <p className="text-muted">
          Retail-shareholder turnout in U.S. public-company proxy votes is chronically low — typically
          under 30% of shares held by retail accounts. The reasons are structural: the proxy material
          arrives in the mail, the broker handles forwarding, the voting interface is clunky, the
          decisions feel low-stakes. Institutional shareholders (mutual funds, pensions, hedge funds)
          vote essentially 100% of the time, often guided by proxy-advisor recommendations from ISS
          and Glass Lewis.
        </p>
        <p className="text-muted mt-3">
          The asymmetry has consequences. A 60% institutional + 30% retail turnout means
          institutional preferences dominate. If retail holders want their preferences represented
          (lower CEO compensation, climate-risk disclosure, board independence, etc.), the lever is
          right there: read the proxy, vote your shares. The interface is in your brokerage
          account&apos;s proxy section, usually within ~5 minutes of locating it.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">How smart money treats proxy season</h2>
        <p className="text-muted">
          Most of HoldLens&apos;s tracked superinvestors are governance-engaged. Berkshire votes
          its positions methodically (Buffett has written about voting against management on
          compensation issues). Activist investors (Ackman, Loeb, Singer) often use the proxy
          process as the formal mechanism for board representation campaigns. Even
          quiet-quant managers (Renaissance, Two Sigma) vote — frequently following ISS by
          policy.
        </p>
        <p className="text-muted mt-3">
          The published voting records of large institutional investors are themselves a useful
          data set. Mutual funds and pension funds publish their proxy voting decisions in Form
          N-PX filings; the patterns reveal which institutional holders are governance-active and
          which defer to management.
        </p>

        <OurView>
          <p>
            The DEF 14A is the U.S. public-markets shareholder-democracy interface, and it is
            chronically underused by retail holders. The 200-page documents intimidate, but the
            actual decisions on the ballot usually take under 10 minutes to vote informed. The
            single highest-leverage exercise of shareholder rights — telling the board what you
            think of CEO compensation, board composition, and major capital-allocation policies —
            is also the cheapest. It costs nothing but the time to read the summary.
          </p>
          <p>
            If you hold individual stocks, vote your proxies. The system was designed for you;
            most retail holders default away from it; the holders who do show up have outsized
            influence per share. If you hold mutual funds, read Form N-PX for the fund — that&apos;s
            the public record of how the fund manager voted on your behalf, and whether their
            governance positions match yours.
          </p>
        </OurView>

        <p className="text-muted text-sm border-l-2 border-border pl-4 mt-6">
          Pure-reference encyclopedic entry for DEF 14A on our sister site:{" "}
          <a href="https://secfilingdex.com/learn/def-14a/" className="text-brand underline" rel="noopener">
            secfilingdex.com/learn/def-14a
          </a>
          {" "}— SEC regulatory citation + every proxy variant (PRE 14A, DEFA14A, etc.).
        </p>

        <InvestingBooks
          heading="Foundational reading on securities analysis"
          sub="Proxy season is corporate governance in practice. These books — Graham, Lynch, Munger — frame why governance matters for long-horizon returns."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. See <a href="/methodology" className="underline">methodology</a> for
          how we score governance signals across tracked superinvestors.
        </p>

        <CiteThisPage />
        <LearnReadNext currentSlug="proxy-voting-def-14a" />

        <ShareStrip url="https://holdlens.com/learn/proxy-voting-def-14a" title="Proxy voting and DEF 14A" />

        <AdSlot format="horizontal" priority="secondary" />

        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text mb-3">See DEF 14A filings live on HoldLens</h2>
          <p className="text-sm text-muted leading-relaxed">
            <a href="/proxies" className="text-brand hover:underline">Live DEF 14A tracker</a>
            {" — every proxy filing from companies in the tracked-superinvestor portfolio universe. "}
            <a href="/activist/" className="text-brand hover:underline">Activist campaigns</a>
            {" tracked via 13D/13G. Sister property cataloging every form variant: "}
            <a href="https://secfilingdex.com/" className="text-brand hover:underline">SecFilingDex</a>
            {"."}
          </p>
        </section>
      </div>
    </div>
  );
}
