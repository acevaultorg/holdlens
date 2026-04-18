import type { Metadata } from "next";
import ShareStrip from "@/components/ShareStrip";
import AuthorByline from "@/components/AuthorByline";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import LearnReadNext from "@/components/LearnReadNext";

// v1.29 — new /learn article. "Warren Buffett method" gets ~6,500 monthly
// search queries. HoldLens has authority to answer because we hold the
// actual Berkshire 13F data. Unique angle: separate folklore from
// replicable. Every claim is grounded in a real filing. Cross-links
// directly into /investor/warren-buffett which has the live portfolio.

export const metadata: Metadata = {
  title: "The Warren Buffett method — what's transferable, what isn't",
  description:
    "Not every Buffett principle scales to a retail account. Here's what the 13F data actually reveals about his approach — and which pieces you can realistically use.",
  alternates: { canonical: "https://holdlens.com/learn/warren-buffett-method" },
  openGraph: {
    title: "The Warren Buffett method — what's transferable, what isn't",
    description:
      "Separating the folklore from the 13F data. What Buffett actually does that you can (and can't) replicate.",
    url: "https://holdlens.com/learn/warren-buffett-method",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Warren Buffett method — what's transferable, what isn't",
  },
};

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
      { "@type": "ListItem", position: 2, name: "Learn", item: "https://holdlens.com/learn" },
      {
        "@type": "ListItem",
        position: 3,
        name: "The Warren Buffett method",
        item: "https://holdlens.com/learn/warren-buffett-method",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "The Warren Buffett method — what's transferable, what isn't",
    description:
      "Honest breakdown of which Buffett principles scale to a retail account and which depend on a structural advantage you don't have.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/warren-buffett-method",
    datePublished: "2026-04-17",
    dateModified: "2026-04-17",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    about: {
      "@type": "Person",
      name: "Warren Buffett",
      jobTitle: "Chairman & CEO",
      worksFor: { "@type": "Organization", name: "Berkshire Hathaway" },
    },
  },
];

export default function WarrenBuffettMethodPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }}
      />

      <a href="/learn" className="text-xs text-muted hover:text-text">
        ← All guides
      </a>

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">
        Learn
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
        The Warren Buffett method
      </h1>
      <p className="text-xl text-muted mb-10">
        Six decades of 20%+ annualized returns, $900B+ of market cap, and an
        entire publishing industry built around him. But the{" "}
        <strong className="text-text">method</strong> is smaller than the
        folklore. Here&apos;s what&apos;s transferable to your account — and
        what isn&apos;t.
      </p>

      <div className="space-y-6 text-text leading-relaxed">
        <AuthorByline date="2026-04-17" />

        <h2 className="text-2xl font-bold mt-10 mb-3">
          The 5 principles you actually see in the 13F
        </h2>
        <p className="text-muted">
          Stripping away the annual letters and the aphorisms, five
          characteristics of Buffett&apos;s{" "}
          <a href="/investor/warren-buffett" className="text-brand underline">
            live Berkshire portfolio
          </a>{" "}
          show up in every quarterly filing:
        </p>

        <ol className="list-decimal ml-6 text-muted space-y-3">
          <li>
            <strong className="text-text">Extreme concentration.</strong> Apple
            alone has been 22–44% of the reportable book for years. The top 5
            positions are ~75% of it. Most of the &quot;200+ stocks he
            owns&quot; is noise — a handful matter.
          </li>
          <li>
            <strong className="text-text">Long holding periods.</strong>{" "}
            Coca-Cola since 1988. American Express since the 1960s salad oil
            scandal. Moody&apos;s since the 2000 spin-off. The median
            top-10 position has been held 8+ years.
          </li>
          <li>
            <strong className="text-text">Zero turnover on winners.</strong> He
            trims aggressively (Bank of America 2024, Apple 2024) but rarely
            fully exits a core compounder that&apos;s still working.
          </li>
          <li>
            <strong className="text-text">Comfortable with cash.</strong> The
            13F doesn&apos;t show Treasuries, but Berkshire&apos;s 10-Q does:
            $300B+ in T-bills through 2024. Sitting out when nothing meets
            the bar is the method.
          </li>
          <li>
            <strong className="text-text">Buying businesses, not ideas.</strong>{" "}
            Top positions all share a trait: dominant share in a stable category
            (insurance, credit cards, fast food, consumer brands) with pricing
            power. No unprofitable growth, no pre-revenue bets.
          </li>
        </ol>

        <h2 className="text-2xl font-bold mt-10 mb-3">
          What&apos;s actually transferable
        </h2>

        <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-6 my-6">
          <h3 className="text-lg font-bold text-emerald-400 mb-3">Concentration</h3>
          <p className="text-muted text-sm">
            Owning 8–12 positions you understand deeply, not 50 you vaguely
            know. Most retail portfolios are too diffuse to outperform by
            definition. This one is freely copyable. It just requires the
            discipline to <em>say no</em> more than you say yes.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-6 my-6">
          <h3 className="text-lg font-bold text-emerald-400 mb-3">Patience</h3>
          <p className="text-muted text-sm">
            Holding through multi-year drawdowns on names that still pass the
            thesis. Buffett&apos;s Coca-Cola was flat for a decade in the
            late 90s. A retail investor can do this — but only if you bought
            for reasons that survive a 40% drawdown. If you bought on
            momentum, patience won&apos;t save you.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-6 my-6">
          <h3 className="text-lg font-bold text-emerald-400 mb-3">
            Sitting on cash when nothing fits
          </h3>
          <p className="text-muted text-sm">
            The hardest and most transferable principle. Most retail investors
            feel pressure to &quot;deploy&quot; — the money manager version of
            FOMO. Buffett&apos;s 2024 $300B cash pile was the largest in his
            career. He wasn&apos;t predicting a crash — he just wasn&apos;t
            finding value at the price. That&apos;s the skill.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-6 my-6">
          <h3 className="text-lg font-bold text-emerald-400 mb-3">
            Quality over price
          </h3>
          <p className="text-muted text-sm">
            Early Buffett (1960s) was cigar-butt value — dying businesses at
            80-cents-on-the-dollar. Modern Buffett (post-1988 Coca-Cola)
            pays fair prices for great businesses and lets them compound. The
            second method is what you can copy; the first requires buying
            micro-caps he&apos;d never touch today.
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-3">
          What isn&apos;t transferable
        </h2>

        <div className="rounded-xl border border-rose-400/30 bg-rose-400/5 p-6 my-6">
          <h3 className="text-lg font-bold text-rose-400 mb-3">
            Insurance float
          </h3>
          <p className="text-muted text-sm">
            Berkshire&apos;s secret weapon since 1967 is GEICO/Gen Re float —
            billions of dollars of policyholder premiums that sit in
            Berkshire&apos;s pocket earning returns until claims are paid.
            It&apos;s essentially free leverage. You cannot replicate this
            without buying an insurance company.
          </p>
        </div>

        <div className="rounded-xl border border-rose-400/30 bg-rose-400/5 p-6 my-6">
          <h3 className="text-lg font-bold text-rose-400 mb-3">
            Deal flow and preferred terms
          </h3>
          <p className="text-muted text-sm">
            In 2008, Goldman Sachs and Bank of America came to Buffett for
            capital — and he got preferred stock with 10% annual dividends
            and warrants worth billions at the equity kicker. No retail
            investor gets that call. The &quot;Buffett premium&quot; is
            non-transferable by design.
          </p>
        </div>

        <div className="rounded-xl border border-rose-400/30 bg-rose-400/5 p-6 my-6">
          <h3 className="text-lg font-bold text-rose-400 mb-3">
            Permanent capital
          </h3>
          <p className="text-muted text-sm">
            Berkshire doesn&apos;t have quarterly redemptions. Shareholders
            who disagree with the cash pile can&apos;t force a sale. A retail
            investor with a spouse, a mortgage, or a liquidity need
            doesn&apos;t have permanent capital — so can&apos;t tolerate the
            same drawdowns Buffett shrugs off.
          </p>
        </div>

        <div className="rounded-xl border border-rose-400/30 bg-rose-400/5 p-6 my-6">
          <h3 className="text-lg font-bold text-rose-400 mb-3">
            Information advantage from direct access
          </h3>
          <p className="text-muted text-sm">
            When Tim Cook takes Buffett&apos;s call, that&apos;s an edge no
            public-data analyst can match. Same for every CEO in the
            portfolio. Retail investors work from the 10-Q and the earnings
            call. Not the same information set.
          </p>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-3">
          The honest conclusion
        </h2>
        <p className="text-muted">
          The transferable part of the Buffett method is the{" "}
          <strong className="text-text">discipline</strong>:
          concentration, patience, the willingness to hold cash, paying fair
          prices for great businesses. None of that requires $100B or GEICO.
        </p>
        <p className="text-muted">
          The non-transferable part is the{" "}
          <strong className="text-text">structural leverage</strong>: insurance
          float, preferred-terms deal flow, permanent capital, CEO-level
          access. Most Buffett-imitation strategies fail because they copy
          the portfolio (transferable) without the discipline
          (non-transferable) — and have none of the structural edges either.
        </p>
        <p className="text-muted">
          The right lesson from Buffett for a retail investor isn&apos;t
          &quot;buy what he&apos;s buying&quot; — that&apos;s{" "}
          <a href="/learn/copy-trading-myth" className="text-brand underline">
            already shown not to work
          </a>
          . It&apos;s: &quot;own fewer things, for longer, at fair prices, and
          be willing to sit on cash when nothing fits.&quot;
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">See for yourself</h2>
        <ul className="list-disc ml-6 text-muted space-y-2">
          <li>
            <a href="/investor/warren-buffett" className="text-brand underline">
              Warren Buffett&apos;s live Berkshire portfolio
            </a>{" "}
            — every current position, every 13F move, trimmed and added
            quarter by quarter.
          </li>
          <li>
            <a href="/simulate/buffett" className="text-brand underline">
              Backtest: &quot;what if you&apos;d copied Buffett since 2015?&quot;
            </a>{" "}
            — concrete return numbers for the blind-copy strategy. Spoiler:
            underperforms Berkshire.
          </li>
          <li>
            <a href="/learn/what-is-alpha" className="text-brand underline">
              What is alpha?
            </a>{" "}
            — why Buffett&apos;s extra return is structural, not mystical.
          </li>
          <li>
            <a href="/learn/45-day-lag-explained" className="text-brand underline">
              The 45-day lag
            </a>{" "}
            — why you&apos;ll never front-run a Buffett move even if you try.
          </li>
        </ul>

        <div className="border-t border-border pt-6 mt-12">
          <p className="text-dim text-sm">
            HoldLens parses every Berkshire 13F within hours of its SEC
            filing. No paywall, no signup, no noise.
          </p>
        </div>
      </div>

      <LearnReadNext currentSlug="warren-buffett-method" />

      <ShareStrip
        title="The Warren Buffett method — what's transferable, what isn't — HoldLens"
        url="https://holdlens.com/learn/warren-buffett-method"
        via="holdlens"
      />
    </div>
  );
}
