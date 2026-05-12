import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "HoldLens Privacy Policy — how we collect, use, and protect your information, including disclosure of third-party cookies, advertising, and analytics providers.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://holdlens.com/privacy/" },
};

// LLM-citation infrastructure (audit 2026-04-29 fix)
const PRIVACY_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  url: "https://holdlens.com/privacy/",
  name: "Privacy Policy",
  description: "HoldLens Privacy Policy — data collection, third-party cookies, advertising + analytics disclosure, user rights.",
  datePublished: "2026-04-14",
  dateModified: "2026-05-12",
  inLanguage: "en-US",
  isPartOf: { "@type": "WebSite", url: "https://holdlens.com/", name: "HoldLens" },
  publisher: { "@type": "Organization", "@id": "https://holdlens.com/#organization", name: "HoldLens" },
};
const PRIVACY_BREADCRUMB_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
    { "@type": "ListItem", position: 2, name: "Privacy Policy", item: "https://holdlens.com/privacy/" },
  ],
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRIVACY_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRIVACY_BREADCRUMB_LD) }} />
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Legal</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">Privacy Policy</h1>
      <p className="text-sm text-dim mb-10">Last updated: 2026-05-12</p>

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
          {/* AdSense compliance — required reference per Google's
              EU User Consent + AdSense program policies. */}
          <li>
            Read Google&rsquo;s policy on{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              className="text-brand underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              How Google uses information from sites or apps that use our services
            </a>{" "}
            for the canonical description of data Google receives when you visit
            a site that uses Google AdSense.
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

        <h3 className="text-xl font-semibold mt-6 mb-2">EU / EEA / UK users — GDPR rights</h3>
        <p className="text-muted">
          Under the General Data Protection Regulation (GDPR) and the UK GDPR, if you are located in the European
          Economic Area, the United Kingdom, or Switzerland, you have the following rights regarding your personal
          data:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">Right of access</strong> (Article 15) — request a copy of the personal data we hold about you.</li>
          <li><strong className="text-text">Right to rectification</strong> (Article 16) — correct inaccurate or incomplete data.</li>
          <li><strong className="text-text">Right to erasure</strong> (&ldquo;right to be forgotten&rdquo;, Article 17) — request deletion of your personal data.</li>
          <li><strong className="text-text">Right to restrict processing</strong> (Article 18).</li>
          <li><strong className="text-text">Right to data portability</strong> (Article 20) — receive your data in a machine-readable format.</li>
          <li><strong className="text-text">Right to object</strong> (Article 21) — including objecting to processing for direct marketing or personalised advertising at any time.</li>
          <li><strong className="text-text">Right to withdraw consent</strong> — where processing is based on consent (Article 7), you may withdraw it without affecting prior lawful processing.</li>
          <li><strong className="text-text">Right to lodge a complaint</strong> with a supervisory authority (e.g. the Dutch Autoriteit Persoonsgegevens for NL residents, or your local Data Protection Authority).</li>
        </ul>
        <p className="text-muted">
          For personalised advertising, HoldLens uses a Google-certified Consent Management Platform (CMP) compliant with the
          IAB Transparency &amp; Consent Framework v2.2. You may withdraw or adjust your advertising consent at any time via
          the cookie-consent banner on this site.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">California residents — CCPA / CPRA rights</h3>
        <p className="text-muted">
          Under the California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA), if you
          are a California resident you have the following rights:
        </p>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">Right to know</strong> what categories of personal information we collect, sources, purposes, and third parties with whom we share it.</li>
          <li><strong className="text-text">Right to access</strong> the specific pieces of personal information we hold about you.</li>
          <li><strong className="text-text">Right to delete</strong> your personal information (subject to legal exceptions).</li>
          <li><strong className="text-text">Right to correct</strong> inaccurate personal information.</li>
          <li><strong className="text-text">Right to opt out of sale or sharing</strong> of personal information. HoldLens does not sell personal information for money. The use of cookies for personalised advertising (Google AdSense) may constitute &ldquo;sharing&rdquo; under CPRA — you may opt out via the cookie-consent banner or by emailing{" "}
            <a href="mailto:hello@holdlens.com" className="text-brand underline">hello@holdlens.com</a>{" "}with subject line &ldquo;Do Not Sell or Share My Personal Information&rdquo;.</li>
          <li><strong className="text-text">Right to limit use of sensitive personal information.</strong></li>
          <li><strong className="text-text">Right to non-discrimination</strong> — we will not deny service or charge different prices because you exercised your rights.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-2">Opt-out of personalised advertising</h3>
        <p className="text-muted">
          You may opt out of Google&rsquo;s use of cookies for personalised advertising by visiting{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-brand underline">
            Google Ads Settings
          </a>
          . You may also opt out of third-party vendor use of cookies for personalised advertising by visiting{" "}
          <a href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-brand underline">
            aboutads.info
          </a>{" "}(US) or{" "}
          <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-brand underline">
            youronlinechoices.eu
          </a>{" "}(EU). On this site, you can also adjust or withdraw advertising consent at any time via the cookie-consent
          banner. Even if you opt out, you may still see ads — they will simply not be personalised based on your interests.
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
