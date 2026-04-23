import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer — not investment advice · HoldLens",
  description:
    "HoldLens is a research and information tool built on public SEC filings. It is not investment advice, a recommendation to buy or sell securities, or a substitute for consultation with a licensed financial advisor.",
  alternates: { canonical: "https://holdlens.com/disclaimer/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Disclaimer · HoldLens",
    description:
      "HoldLens is a research tool. Not investment advice. 13F data is reported with a 45-day lag; Form 4 within 2 business days. Users bear full responsibility for trading decisions.",
    url: "https://holdlens.com/disclaimer/",
    type: "website",
  },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Legal</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">Disclaimer</h1>
      <p className="text-sm text-dim mb-10">Last updated: 2026-04-23</p>

      <div className="space-y-6 text-text leading-relaxed">
        <p className="text-muted">
          HoldLens is a research and information tool. The content on{" "}
          <a href="https://holdlens.com" className="text-brand underline">
            holdlens.com
          </a>{" "}
          is provided for <strong>informational and educational purposes only</strong> and does not constitute
          investment advice, a recommendation to buy or sell any security, or an offer to solicit any transaction.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Not investment advice</h2>
        <p className="text-muted">
          Nothing on HoldLens is personalized financial advice. We are not a registered investment adviser, broker,
          dealer, or financial planner. The metrics we publish — ConvictionScore, InsiderScore, EventScore — are
          deterministic transformations of public SEC filings. They are not forward-looking predictions or
          recommendations.
        </p>
        <p className="text-muted">
          Before making any investment decision, you should consult a licensed professional who understands your
          specific situation, risk tolerance, tax posture, and goals.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Data sources and lag</h2>
        <p className="text-muted">
          All data on HoldLens is derived from public SEC filings. The sources and their mandatory lag are important
          to understand:
        </p>
        <ul className="space-y-3 list-disc list-inside text-muted">
          <li>
            <strong className="text-text">13F filings</strong> are reported to the SEC with up to a{" "}
            <strong className="text-text">45-day lag</strong> after quarter-end. A position shown on /investor/ pages
            may have been sold or materially changed since the filing date.
          </li>
          <li>
            <strong className="text-text">Form 4 insider transactions</strong> must be filed within{" "}
            <strong className="text-text">2 business days</strong> of the trade. Our /insiders/ surface publishes
            within 24 hours of SEC EDGAR availability.
          </li>
          <li>
            <strong className="text-text">Form 8-K material events</strong> must be filed within{" "}
            <strong className="text-text">4 business days</strong> of a material event. Our /events/ surface
            publishes intra-day.
          </li>
          <li>
            <strong className="text-text">13D/13G activist filings</strong> must be filed within 10 days of crossing
            the 5% ownership threshold.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">No guarantee of accuracy</h2>
        <p className="text-muted">
          We make commercially reasonable efforts to parse SEC filings correctly, but we do not guarantee accuracy,
          completeness, or timeliness. SEC filings themselves contain errors, amendments (/A suffix), and edge cases
          (derivative instruments, dual-class shares, amended filings). When we know a row is derived rather than
          directly reported, we annotate it accordingly.
        </p>
        <p className="text-muted">
          Every data point on a per-entity page is linked back to its source SEC filing URL on{" "}
          <a href="https://www.sec.gov/edgar" className="text-brand underline" target="_blank" rel="noopener noreferrer">
            EDGAR
          </a>
          . If you intend to act on HoldLens data, verify the underlying filing yourself.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Past performance ≠ future returns</h2>
        <p className="text-muted">
          Our /proof/ page shows historical backtests of HoldLens signals against market benchmarks. Backtests are
          subject to survivorship bias, look-ahead bias, and regime changes. Past performance is not indicative of,
          and does not guarantee, future results. No backtest on this site should be interpreted as a prediction.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Your responsibility</h2>
        <p className="text-muted">
          You — the reader — are solely responsible for any investment decisions you make. HoldLens, its operator,
          its contributors, and its data providers accept no liability for losses arising directly or indirectly from
          the use of this site. By using HoldLens, you acknowledge and accept this.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Regulatory status</h2>
        <p className="text-muted">
          HoldLens operates as a publisher, not as an investment adviser. We do not manage client assets, do not
          provide personalized advice, and do not accept compensation based on specific investment recommendations.
          We do not have an advisory relationship with any reader.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Third-party content</h2>
        <p className="text-muted">
          HoldLens may link to external sources, including SEC EDGAR filings, company investor-relations sites, and
          news coverage. We do not control and are not responsible for the content of external sites.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Affiliate disclosures</h2>
        <p className="text-muted">
          Where HoldLens links to broker partners (Interactive Brokers, Tastytrade, Webull, M1 Finance, Public.com, or
          others), we may receive affiliate compensation if you open an account. This does not influence which
          superinvestors or tickers we cover, how ConvictionScore / InsiderScore / EventScore are calculated, or the
          content of our reports. Affiliate links are marked as such.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Corrections</h2>
        <p className="text-muted">
          If you believe a specific data point on HoldLens is wrong, email{" "}
          <a href="mailto:contact@editnative.com" className="text-brand underline">
            contact@editnative.com
          </a>{" "}
          with the URL and the specific SEC filing that contradicts what we publish. We correct verified errors
          within 48 hours.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Related</h2>
        <p className="text-muted">
          <Link href="/privacy" className="text-brand underline">
            Privacy Policy
          </Link>
          {" · "}
          <Link href="/terms" className="text-brand underline">
            Terms of Service
          </Link>
          {" · "}
          <Link href="/methodology" className="text-brand underline">
            Methodology
          </Link>
          {" · "}
          <Link href="/glossary" className="text-brand underline">
            Glossary
          </Link>
          {" · "}
          <Link href="/contact" className="text-brand underline">
            Contact
          </Link>
        </p>
      </div>
    </div>
  );
}
