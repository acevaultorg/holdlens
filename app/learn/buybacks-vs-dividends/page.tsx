import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import ShareStrip from "@/components/ShareStrip";

export const metadata: Metadata = {
  title: "Buybacks vs dividends — what's the real difference? · HoldLens",
  description:
    "Share repurchases and dividends both return cash to shareholders, but they hit your account, your tax bill, and your company's future very differently. The honest tradeoffs.",
  alternates: { canonical: "https://holdlens.com/learn/buybacks-vs-dividends" },
  openGraph: {
    title: "Buybacks vs dividends — what's the real difference?",
    description:
      "Both return capital. One is flashier; the other is more tax-efficient. How to think about the tradeoff.",
    url: "https://holdlens.com/learn/buybacks-vs-dividends",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Buybacks vs dividends — HoldLens explainer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buybacks vs dividends — HoldLens explainer",
    description: "Both return capital. One is flashier; the other is more tax-efficient.",
    creator: "@holdlens",
    images: ["/og/home.png"],
  },
  robots: { index: true, follow: true },
};

export default function BuybacksVsDividendsPage() {
  const url = "https://holdlens.com/learn/buybacks-vs-dividends";
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Buybacks vs dividends — what's the real difference?",
    description:
      "Share repurchases and dividends both return cash to shareholders but differ in tax treatment, flexibility, and long-term compounding.",
    datePublished: "2026-04-20",
    dateModified: "2026-04-20",
    inLanguage: "en",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    image: ["https://holdlens.com/og/home.png"],
    author: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com" },
    publisher: {
      "@type": "Organization",
      name: "HoldLens",
      url: "https://holdlens.com",
      logo: { "@type": "ImageObject", url: "https://holdlens.com/logo.png" },
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Learn", item: "https://holdlens.com/learn" },
      { "@type": "ListItem", position: 3, name: "Buybacks vs dividends", item: url },
    ],
  };

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <a href="/learn" className="text-xs text-muted hover:text-text">
        ← Learn
      </a>

      <div className="mt-3 text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Explainer · Capital return
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
        Buybacks vs dividends.
      </h1>
      <p className="text-muted text-lg leading-relaxed mb-8">
        Both send cash back to shareholders. One is an event (a check arrives);
        the other is invisible (share count shrinks). They differ on tax, on
        flexibility, and on what they signal about the company&rsquo;s future.
      </p>

      <section className="prose prose-invert max-w-none text-text leading-relaxed space-y-6">
        <p>
          <strong>Dividends</strong> are cash payments per share. If you own
          100 shares of a $2 annual dividend, you get $200 a year, typically
          paid quarterly. The company debits its retained earnings;
          you get taxed as ordinary income or at qualified-dividend rates
          (0% / 15% / 20% in the US depending on bracket).
        </p>
        <p>
          <strong>Share buybacks</strong> are the company using its cash to buy
          its own stock on the open market, then retiring those shares. Total
          float shrinks, so each remaining share owns a bigger slice of the
          company. You don&rsquo;t get a check &mdash; but if you hold
          long-term, your proportional ownership grows every quarter the
          program runs.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">The honest tradeoffs</h2>

        <div className="rounded-2xl border border-border bg-panel overflow-hidden my-4">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">Dimension</th>
                <th className="px-4 py-3 text-left">Dividends</th>
                <th className="px-4 py-3 text-left">Buybacks</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-semibold">Tax timing</td>
                <td className="px-4 py-3">Annual, automatic</td>
                <td className="px-4 py-3">Deferred until you sell</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-semibold">Tax rate (US)</td>
                <td className="px-4 py-3">0-20% qualified</td>
                <td className="px-4 py-3">0-20% long-term cap gains</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-semibold">Signal</td>
                <td className="px-4 py-3">Commitment (hard to cut)</td>
                <td className="px-4 py-3">Flexibility (easy to pause)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-semibold">Per-share effect</td>
                <td className="px-4 py-3">Cash to you; stock unchanged</td>
                <td className="px-4 py-3">No cash; your % ownership grows</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">Re-invest friction</td>
                <td className="px-4 py-3">You choose where to deploy</td>
                <td className="px-4 py-3">Management chose for you</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-3">When buybacks beat dividends</h2>
        <p>
          <strong>Tax efficiency.</strong> A buyback is the rare corporate
          action that returns capital without triggering a taxable event for
          shareholders. You decide when you sell, not the calendar.
        </p>
        <p>
          <strong>Flexibility.</strong> Boards can pause a buyback at any time;
          cutting a dividend is a PR nightmare (and often a fatal signal).
          Cyclical businesses often prefer buybacks precisely for this reason.
        </p>
        <p>
          <strong>Accretive at a good price.</strong> Buying back stock below
          intrinsic value is the textbook Buffett trade &mdash; shareholders
          who don&rsquo;t sell get a larger slice of the same company at a
          discount.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">When buybacks go wrong</h2>
        <p>
          <strong>Repurchasing at peak valuations.</strong> If management buys
          back $10B of stock at $200/share and the stock then falls to $120,
          that&rsquo;s $4B of shareholder capital burned. Discipline matters.
        </p>
        <p>
          <strong>Funded by debt.</strong> Leveraging the balance sheet to buy
          back shares is financial engineering, not capital return. It inflates
          EPS while raising interest expense and default risk.
        </p>
        <p>
          <strong>Masking dilution.</strong> Many tech companies use buybacks
          primarily to offset stock-based compensation. Total share count stays
          flat while employees get paid; you got no real capital return.
          Check net buybacks (gross minus SBC) before crediting management.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">Our view</h2>
        <p>
          Both tools are good. Dividends are best for investors who want predictable
          income and companies with stable cash flows. Buybacks are best for
          tax-deferred compounding and cyclical businesses. A company using
          both responsibly &mdash; like Apple or Bank of America in recent
          years &mdash; gives shareholders maximum optionality.
        </p>
        <p>
          The number that matters most across both: <strong>total capital
          return yield</strong> = (dividends + net buybacks) ÷ market cap. We
          surface that on every{" "}
          <a href="/buybacks" className="text-brand hover:underline">
            buyback tracker page
          </a>
          .
        </p>
      </section>

      <AdSlot format="horizontal" />

      <section className="mt-12 pt-8 border-t border-border">
        <ShareStrip
          title="Buybacks vs dividends — what's the real difference?"
          url={url}
        />
      </section>
    </article>
  );
}
