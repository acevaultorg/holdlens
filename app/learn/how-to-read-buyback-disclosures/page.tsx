import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import ShareStrip from "@/components/ShareStrip";
import TldrCard from "@/components/learn/TldrCard";
import OurView from "@/components/learn/OurView";

export const metadata: Metadata = {
  title: "How to read buyback disclosures — a plain-English SEC filing guide",
  description:
    "What to look for in a company's 10-K cash-flow statement, 8-K authorization announcements, and 10-Q monthly share-repurchase tables. With examples.",
  alternates: { canonical: "https://holdlens.com/learn/how-to-read-buyback-disclosures" },
  openGraph: {
    title: "How to read buyback disclosures — SEC filings, plain English",
    description:
      "10-K, 8-K, 10-Q — where the real buyback numbers live and how to spot financial engineering.",
    url: "https://holdlens.com/learn/how-to-read-buyback-disclosures",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens buyback disclosures guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to read buyback disclosures — HoldLens",
    description: "Where the real buyback numbers live in SEC filings, plain English.",
    creator: "@holdlens",
    images: ["/og/home.png"],
  },
  robots: { index: true, follow: true },
};

export default function HowToReadBuybackDisclosuresPage() {
  const url = "https://holdlens.com/learn/how-to-read-buyback-disclosures";
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to read buyback disclosures — a plain-English SEC filing guide",
    description:
      "A retail-investor guide to finding share-repurchase data in SEC 10-K, 10-Q, and 8-K filings, plus how to spot common distortions.",
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
      { "@type": "ListItem", position: 3, name: "How to read buyback disclosures", item: url },
    ],
  };

  return (
    <article className="max-w-3xl mx-auto px-8 sm:px-6 py-16">
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
        Methodology · SEC filings
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
        How to read buyback disclosures.
      </h1>
      <p className="text-muted text-lg leading-relaxed mb-8">
        Companies disclose share repurchases in three places in the SEC&rsquo;s
        EDGAR system. Each answers a different question. Knowing where to look
        separates retail-investor interpretation from financial-journalist
        coverage &mdash; most CNBC blurbs quote the authorization size; the
        real action is in the cash-flow statement.
      </p>

      <TldrCard>
        Companies disclose share buybacks in three SEC filings, each answering a different
        question. 8-K: the headline announcement when the board authorizes a new program
        (size + duration). 10-Q quarterly: the monthly Purchases of Equity Securities table
        showing actual shares bought, price, and remaining authorization. 10-K annual:
        cash-flow statement &ldquo;repurchase of common stock&rdquo; line showing the dollar
        amount actually spent. Most retail coverage quotes the 8-K authorization
        (&ldquo;announced $10B buyback&rdquo;); the real signal is what gets executed in the
        10-Q tables and confirmed in the 10-K cash flow. Authorization is permission;
        execution is conviction.
      </TldrCard>

      <section className="prose prose-invert max-w-none text-text leading-relaxed space-y-6">
        <h2 className="text-2xl font-bold mt-8 mb-3">The three filings that matter</h2>

        <h3 className="text-xl font-bold mt-6 mb-2">1. 8-K &mdash; The authorization announcement</h3>
        <p>
          An 8-K is filed within 4 business days when something material
          happens. When a board approves a new buyback program, that 8-K
          tells you: the dollar limit (e.g., &ldquo;$110 billion&rdquo;), any
          time cap (e.g., &ldquo;over 5 years&rdquo; or &ldquo;no expiration&rdquo;),
          and whether it replaces or adds to prior authorizations.
        </p>
        <p>
          <strong>What to watch for:</strong> &ldquo;no expiration&rdquo; means
          the company can spread repurchases over years; a time cap means a
          faster pace. Cumulative announcements matter &mdash; a $50B program
          layered on top of a $20B program with $10B remaining tells you what
          the runway actually is.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-2">2. 10-K &mdash; What was actually repurchased</h3>
        <p>
          The annual 10-K contains the cash-flow-from-financing statement. The
          line labeled &ldquo;repurchases of common stock&rdquo; or similar
          shows the dollar amount of share repurchases in the fiscal year.
          This is the single number that matters most &mdash; authorizations
          are intent; this is execution.
        </p>
        <p>
          <strong>What to watch for:</strong> compare to the prior fiscal year
          (did the pace accelerate or slow?) and to free cash flow (is the
          company returning earned cash or borrowing to fund buybacks?).
        </p>

        <h3 className="text-xl font-bold mt-6 mb-2">3. 10-Q Issuer Purchases table</h3>
        <p>
          Each 10-Q contains a table showing repurchases by month for the
          quarter: shares purchased, average price, total purchased, and
          program-to-date authorization remaining. This gives the most
          granular view &mdash; accelerations mid-quarter, pauses during
          volatility, etc.
        </p>
        <p>
          <strong>What to watch for:</strong> when stocks fell in early 2025,
          some aggressive boards accelerated buybacks to capture the discount;
          others paused, worried about balance-sheet flexibility. The 10-Q
          table shows which side a company took.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">Common distortions</h2>

        <h3 className="text-xl font-bold mt-6 mb-2">Gross vs net buybacks</h3>
        <p>
          Companies report gross repurchases &mdash; dollars spent buying back
          stock. But if the same company issued $5B of new stock via
          stock-based compensation in the same year and repurchased $10B, the
          NET reduction in float is only $5B. Tech companies especially run
          this pattern.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-2">Debt-funded buybacks</h3>
        <p>
          Look at the balance sheet: if long-term debt rose by a similar
          amount to the buybacks, the company leveraged up to return capital.
          Not inherently bad, but the risk profile of those shares just
          changed.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-2">Authorizations ≠ execution</h3>
        <p>
          A $75B authorization doesn&rsquo;t mean $75B of buybacks are coming.
          Boards routinely let authorizations sit unused for years. The 10-K
          cash-flow number is always the ground truth.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-2">Accelerated share repurchase (ASR) programs</h3>
        <p>
          ASRs are forward-dated large repurchases executed through an
          investment bank. The initial tranche is reflected upfront; the final
          settlement (share-count adjustment) comes later. A company using
          ASRs will show a large buyback number for the quarter it initiates
          them, which can create misleading yearly comparisons.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-3">How HoldLens handles this</h2>
        <p>
          Every row on our{" "}
          <a href="/buybacks" className="text-brand hover:underline">
            buyback tracker
          </a>{" "}
          cites the specific 10-K or 8-K filing that produced each number, with
          the filing date visible. Authorization figures are current active
          programs; repurchased figures are trailing-fiscal-year from the cash
          flow statement.
        </p>
        <p>
          We explicitly do <em>not</em> net out stock-based compensation in
          reported figures &mdash; that&rsquo;s a judgment-call adjustment best
          made by the investor reviewing the company&rsquo;s SBC profile. We
          flag companies where SBC is a material percentage of repurchases in
          the per-ticker pages when the data is available.
        </p>
      </section>

      <AdSlot format="horizontal" />

      <section className="mt-12 pt-8 border-t border-border">
        <h2 className="text-base font-bold text-text mb-3">See buyback disclosures live on HoldLens</h2>
        <p className="text-sm text-muted leading-relaxed">
          <a href="/buybacks" className="text-brand hover:underline">Corporate buybacks tracker</a>
          {" — authorizations + execution. Related SEC filings: "}
          <a href="/events/" className="text-brand hover:underline">8-K material events</a>
          {", "}
          <a href="/insiders/" className="text-brand hover:underline">Form 4 insider trades</a>
          {" (10b5-1 plans often align with repurchase windows). Background reading: "}
          <a href="/learn/buybacks-vs-dividends" className="text-brand hover:underline">buybacks vs dividends</a>
          {"."}
        </p>

        <OurView>
          <p>
            The most useful buyback question is rarely &ldquo;how big was the
            authorization?&rdquo; — it&rsquo;s &ldquo;how aggressively did they execute it
            during the price drawdown?&rdquo; A company that buys back its own stock
            opportunistically (loading up when shares fell, slowing down when shares rallied)
            is signaling that management views the stock as undervalued in cold-blooded
            financial terms. A company that mechanically buys at any price — often to offset
            executive option dilution — is signaling something much weaker.
          </p>
          <p>
            Reading the 10-Q monthly tables is the practical test of which type of company
            you own. Most retail headlines never reach this level of detail. HoldLens
            surfaces the execution-rate-vs-price pattern on every ticker page with active
            buyback programs specifically because the 8-K announcement is marketing and the
            10-Q execution is signal.
          </p>
        </OurView>
      </section>

      <section className="mt-8 pt-6 border-t border-border">
        <ShareStrip
          title="How to read buyback disclosures — a plain-English SEC filing guide"
          url={url}
        />
      </section>
    </article>
  );
}
