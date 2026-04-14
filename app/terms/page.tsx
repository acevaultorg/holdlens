import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "HoldLens Terms of Service — the rules for using holdlens.com, including the non-investment-advice disclaimer, data usage rights, and limits of liability.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Legal</div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">Terms of Service</h1>
      <p className="text-sm text-dim mb-10">Last updated: 2026-04-14</p>

      <div className="space-y-6 text-text leading-relaxed">
        <p className="text-muted">
          Welcome to HoldLens. These Terms of Service (&ldquo;Terms&rdquo;) govern your use of{" "}
          <a href="https://holdlens.com" className="text-brand underline">
            holdlens.com
          </a>
          {" "}(the &ldquo;Service&rdquo;) operated by HoldLens. By accessing or using the Service, you agree to
          be bound by these Terms. If you do not agree, please do not use the Service.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">1. Not investment advice</h2>
        <p className="text-muted">
          <strong className="text-text">
            HoldLens is not a registered investment adviser, broker-dealer, or financial planner. Nothing on
            this site is investment advice, a recommendation to buy or sell any security, or an offer to
            provide investment services.
          </strong>{" "}
          All content is for informational and educational purposes only. Do your own research and consult a
          licensed financial adviser before making any investment decision. Past performance does not predict
          future results.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">2. Data source and accuracy</h2>
        <p className="text-muted">
          HoldLens surfaces data from publicly-filed SEC Form 13F disclosures and other public sources. 13Fs
          are filed with a 45-day delay, which means every position you see here was held as of the filing
          date, not the current moment. We make reasonable efforts to parse the data correctly but we make no
          warranty of accuracy, completeness, or timeliness. Use the raw SEC filings as the authoritative
          source if accuracy matters to you.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">3. Permitted use</h2>
        <p className="text-muted">
          You may view, download, and reference the content for personal, non-commercial purposes. You may
          share links to HoldLens pages freely. You may not:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>Scrape or systematically extract data from the Service without written permission</li>
          <li>Reverse-engineer, decompile, or disassemble any part of the Service</li>
          <li>Use the Service to build a competing product</li>
          <li>Introduce malware, viruses, or harmful code</li>
          <li>Attempt to bypass rate limits or access controls</li>
          <li>Misrepresent your identity or the source of content</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">4. Intellectual property</h2>
        <p className="text-muted">
          The Service content (excluding raw SEC data, which is public domain) — including the ConvictionScore
          methodology, rankings, commentary, design, code, and brand — is owned by HoldLens and protected by
          copyright and other intellectual property laws. The HoldLens name and logo are trademarks. You may
          not use them without written permission.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">5. Third-party content and links</h2>
        <p className="text-muted">
          The Service contains links to third-party websites and services (SEC EDGAR, Yahoo Finance, brokerage
          affiliates, etc.). We do not control these third parties and are not responsible for their content
          or practices. Their use is subject to their own terms and privacy policies.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">6. Affiliate disclosure</h2>
        <p className="text-muted">
          HoldLens may earn referral commissions when you click certain links (e.g., brokerage sign-up links).
          These commissions help keep the core Service free. Affiliate links are always marked with{" "}
          <code className="text-xs bg-panel px-1 py-0.5 rounded">rel=&ldquo;sponsored&rdquo;</code> and an
          on-page disclosure. We only list services we would use ourselves.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">7. Advertising</h2>
        <p className="text-muted">
          HoldLens displays advertisements via Google AdSense. Ads are clearly labeled. We do not review or
          endorse the content of ads. Clicking an ad takes you to a third-party site whose practices are
          outside our control. See our{" "}
          <a href="/privacy" className="text-brand underline">
            Privacy Policy
          </a>{" "}
          for details on advertising cookies and how to opt out.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">8. Accounts and email subscriptions</h2>
        <p className="text-muted">
          HoldLens currently does not require account creation for the core Service. If you subscribe to
          email alerts, you agree to receive those emails. You can unsubscribe at any time. You are
          responsible for keeping your email address accurate.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">9. Pro subscriptions</h2>
        <p className="text-muted">
          Paid Pro subscriptions are billed in advance on a recurring basis. You can cancel at any time from
          your billing portal. Cancellations take effect at the end of the current billing period. Refund
          policy: pro-rated refund within 14 days, no refund after 14 days.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">10. Disclaimer of warranties</h2>
        <p className="text-muted">
          THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY
          KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED,
          ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">11. Limitation of liability</h2>
        <p className="text-muted">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, HOLDLENS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOST DATA, OR INVESTMENT LOSSES
          ARISING FROM OR IN CONNECTION WITH YOUR USE OF THE SERVICE. IN NO EVENT SHALL OUR TOTAL LIABILITY
          EXCEED THE AMOUNT YOU PAID US (IF ANY) IN THE 12 MONTHS PRECEDING THE CLAIM.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">12. Changes to the Service or Terms</h2>
        <p className="text-muted">
          We may modify, suspend, or discontinue any part of the Service at any time without notice. We may
          also update these Terms; when we do we will revise the &ldquo;Last updated&rdquo; date. Continued use
          of the Service after changes constitutes acceptance of the updated Terms.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">13. Governing law</h2>
        <p className="text-muted">
          These Terms are governed by the laws of the Netherlands, without regard to conflict-of-law
          principles. Any dispute arising under these Terms will be resolved in the courts of the Netherlands.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">14. Contact</h2>
        <p className="text-muted">
          Questions about these Terms? Email{" "}
          <a href="mailto:hello@holdlens.com" className="text-brand underline">
            hello@holdlens.com
          </a>
          .
        </p>

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          These Terms are provided for informational purposes and do not constitute legal advice.
        </p>
      </div>
    </div>
  );
}
