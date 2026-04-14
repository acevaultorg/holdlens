import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "HoldLens Privacy Policy — how we collect, use, and protect your information, including disclosure of third-party cookies, advertising, and analytics providers.",
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Legal</div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">Privacy Policy</h1>
      <p className="text-sm text-dim mb-10">Last updated: 2026-04-14</p>

      <div className="space-y-6 text-text leading-relaxed">
        <p className="text-muted">
          HoldLens (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates{" "}
          <a href="https://holdlens.com" className="text-brand underline">
            holdlens.com
          </a>{" "}
          (the &ldquo;Service&rdquo;). This page explains what information we collect, how we use it, who we share it
          with, and the choices you have. By using the Service you agree to this policy.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Who we are</h2>
        <p className="text-muted">
          HoldLens is an independent research tool that surfaces publicly-filed SEC 13F data from institutional
          investors. We are not a broker, investment adviser, or financial services company. Contact:{" "}
          <a href="mailto:hello@holdlens.com" className="text-brand underline">
            hello@holdlens.com
          </a>
          .
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Information we collect</h2>
        <p className="text-muted">
          We try to collect as little personal information as possible. The Service runs as a static website, so
          most browsing activity never reaches our servers. The categories of information that may be collected:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>
            <strong className="text-text">Information you give us voluntarily.</strong> When you subscribe to
            an email alert or join the waitlist, we collect your email address.
          </li>
          <li>
            <strong className="text-text">Technical information from your browser.</strong> IP address, device
            type, operating system, browser type, referring URL, and pages visited. This is collected by the
            third-party services listed below, not directly by HoldLens.
          </li>
          <li>
            <strong className="text-text">Local browser storage.</strong> Your watchlist, personal portfolio,
            saved screener filters, and UI preferences are stored in your browser&rsquo;s localStorage. This data
            never leaves your device and we cannot read it.
          </li>
          <li>
            <strong className="text-text">Cookies.</strong> See the Cookies section below.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">How we use information</h2>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>To provide, operate, and improve the Service</li>
          <li>To send email alerts and the weekly digest (only if you subscribed)</li>
          <li>To measure traffic and usage patterns in aggregate</li>
          <li>To serve personalized and non-personalized advertising via Google AdSense</li>
          <li>To comply with legal obligations</li>
        </ul>
        <p className="text-muted">
          We do not sell your personal information. We do not build user profiles to sell to third parties.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Cookies</h2>
        <p className="text-muted">
          A cookie is a small text file placed on your device by a website. HoldLens itself does not set any
          first-party cookies. However, the third-party services we use may set their own cookies:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>
            <strong className="text-text">Google AdSense</strong> sets cookies to serve and measure ads, and to
            prevent the same ad from being shown repeatedly.
          </li>
          <li>
            <strong className="text-text">Plausible Analytics</strong> is a privacy-first, cookie-free analytics
            provider that does not use cookies or collect personal data.
          </li>
        </ul>
        <p className="text-muted">
          You can clear cookies at any time through your browser settings. Blocking cookies will not break the
          core functionality of HoldLens but may reduce ad relevance.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Third-party advertising (Google AdSense)</h2>
        <p className="text-muted">
          HoldLens uses Google AdSense to display advertisements. Google, as a third-party vendor, uses cookies
          to serve ads on our site. Google&rsquo;s use of advertising cookies enables it and its partners to serve
          ads to users based on their visit to HoldLens and/or other sites on the Internet.
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li>
            Third-party vendors, including Google, use cookies to serve ads based on a user&rsquo;s prior visits to
            this website or other websites.
          </li>
          <li>
            Google&rsquo;s use of advertising cookies enables it and its partners to serve ads to users based on
            their visit to this site and/or other sites on the Internet.
          </li>
          <li>
            Users may opt out of personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              className="text-brand underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Ads Settings
            </a>
            .
          </li>
          <li>
            Alternatively, users may opt out of a third-party vendor&rsquo;s use of cookies for personalized
            advertising by visiting{" "}
            <a
              href="https://www.aboutads.info/choices/"
              className="text-brand underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.aboutads.info
            </a>
            .
          </li>
          <li>
            For users in Europe, visit{" "}
            <a
              href="https://www.youronlinechoices.eu/"
              className="text-brand underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.youronlinechoices.eu
            </a>{" "}
            to manage your ad preferences.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Analytics</h2>
        <p className="text-muted">
          We use <strong className="text-text">Plausible Analytics</strong>, a privacy-focused analytics service
          hosted in the European Union. Plausible does not use cookies, does not collect personal data, and does
          not track users across websites. It gives us aggregate metrics like page views and referrer sources,
          nothing more. See the{" "}
          <a
            href="https://plausible.io/data-policy"
            className="text-brand underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Plausible data policy
          </a>
          .
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Email data</h2>
        <p className="text-muted">
          If you sign up for an email alert or the waitlist, we store your email address. We use it only to
          send you the alerts you requested. We never sell, rent, or share your email address with third
          parties. You can unsubscribe at any time by clicking the unsubscribe link in any email.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Data retention</h2>
        <p className="text-muted">
          Email addresses are kept until you unsubscribe. Aggregate analytics data is kept for up to 24 months.
          Server access logs are kept for up to 30 days for security purposes.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Your rights</h2>
        <p className="text-muted">
          Depending on where you live, you may have the right to access, correct, delete, or export your
          personal information, and to object to or restrict certain processing. To exercise any of these
          rights, email us at{" "}
          <a href="mailto:hello@holdlens.com" className="text-brand underline">
            hello@holdlens.com
          </a>
          . We will respond within 30 days.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Children&rsquo;s privacy</h2>
        <p className="text-muted">
          HoldLens is not directed to children under 13. We do not knowingly collect personal information from
          children under 13. If you believe a child has provided personal information, please contact us and we
          will delete it.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Changes to this policy</h2>
        <p className="text-muted">
          We may update this policy from time to time. When we do, we will revise the &ldquo;Last updated&rdquo;
          date at the top of this page. Material changes will be announced via a notice on the homepage for at
          least 30 days.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Contact</h2>
        <p className="text-muted">
          Questions? Email{" "}
          <a href="mailto:hello@holdlens.com" className="text-brand underline">
            hello@holdlens.com
          </a>
          .
        </p>

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          This policy is provided for informational purposes and does not constitute legal advice.
        </p>
      </div>
    </div>
  );
}
