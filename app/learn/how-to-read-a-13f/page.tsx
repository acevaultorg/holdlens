import type { Metadata } from "next";
import ShareStrip from "@/components/ShareStrip";
import AuthorByline from "@/components/AuthorByline";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import LearnReadNext from "@/components/LearnReadNext";

// v1.23 — new /learn/ article. "How to read a 13F in 5 minutes" is a high-volume
// practical query ("how to read 13f filing", "13f filing explained", "hedge fund
// 13f decoded") that HoldLens has strong authority to answer — every sentence
// is grounded in real 13F fields and the article walks the reader from the EDGAR
// search page all the way to interpretation. Cross-links into /investor/warren-buffett,
// /learn/what-is-a-13f (which is about the form itself), /learn/copy-trading-myth
// (which explains why knowing how to read one ≠ profiting from one), and
// /learn/conviction-score-explained (our layer on top of raw 13F data).
//
// Ships with Article + BreadcrumbList LD+JSON. Fresh URL = no existing-page
// reset per silent-SEO discipline. Evergreen — the SEC 13F format hasn't
// changed in 40 years.

export const metadata: Metadata = {
  title: "How to read a 13F filing in 5 minutes — Plain English walkthrough",
  description:
    "Step-by-step: open any 13F on EDGAR and know what every field means. With real examples from Berkshire Hathaway's filings.",
  alternates: { canonical: "https://holdlens.com/learn/how-to-read-a-13f" },
  openGraph: {
    title: "How to read a 13F filing in 5 minutes",
    description:
      "Decode the SEC form every hedge fund submits. Covers cover page, information table, share counts, value columns, and what's missing.",
    url: "https://holdlens.com/learn/how-to-read-a-13f",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to read a 13F filing in 5 minutes",
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
        name: "How to read a 13F filing in 5 minutes",
        item: "https://holdlens.com/learn/how-to-read-a-13f",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to read a 13F filing in 5 minutes",
    description:
      "Plain English walkthrough of SEC Form 13F — cover page, information table, share counts, value columns, CUSIPs, call/put notations, and what 13Fs don't show.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/how-to-read-a-13f",
    datePublished: "2026-04-16",
    dateModified: "2026-04-16",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    about: {
      "@type": "Thing",
      name: "SEC Form 13F",
      description:
        "Quarterly filing by institutional investment managers with $100M+ in US equity assets under discretion.",
    },
  },
];

export default function HowToReadA13FPage() {
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
        How to read a 13F filing in 5 minutes
      </h1>
      <p className="text-xl text-muted mb-10">
        Every hedge fund with $100M+ sends one every quarter. Once you know the
        structure, reading them is fast. Once you know the <em>limits</em>, you
        won't get burned trusting them.
      </p>

      <div className="space-y-6 text-text leading-relaxed">
        <p className="text-muted">
          This guide assumes nothing. If you've never opened an SEC document
          before, you'll leave this page knowing exactly what to look at, what
          every column means, and what the filing deliberately doesn't tell you.
        </p>

        <AuthorByline date="2026-04-16" />

        <h2 className="text-2xl font-bold mt-10 mb-3">Step 1 — Find a filing</h2>
        <p className="text-muted">
          The fastest path:
        </p>
        <ol className="list-decimal ml-6 text-muted space-y-2">
          <li>
            Open{" "}
            <a
              href="https://efts.sec.gov/LATEST/search-index?q=%22Berkshire+Hathaway%22&forms=13F-HR"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand underline"
            >
              SEC EDGAR full-text search
            </a>{" "}
            for the manager name you want.
          </li>
          <li>
            Filter the <strong className="text-text">Filing type</strong> dropdown to{" "}
            <strong className="text-text">13F-HR</strong> (the &quot;HR&quot; means
            &quot;Holdings Report&quot; — what retail investors care about).
          </li>
          <li>
            The most recent entry at the top is the latest quarter. Click it.
            You&apos;ll land on a filing index page with a small number of
            documents — the two that matter are{" "}
            <code className="text-text bg-panel px-1.5 py-0.5 rounded text-sm">
              primary_doc.xml
            </code>{" "}
            (the cover page) and{" "}
            <code className="text-text bg-panel px-1.5 py-0.5 rounded text-sm">
              infotable.xml
            </code>{" "}
            (the holdings list).
          </li>
        </ol>
        <p className="text-muted">
          Or — skip the friction entirely and open a manager&apos;s HoldLens
          profile. We parse the same files and render them in plain English. For
          example,{" "}
          <a href="/investor/warren-buffett" className="text-brand underline">
            Warren Buffett / Berkshire Hathaway
          </a>{" "}
          or any of the{" "}
          <a href="/investor" className="text-brand underline">
            30 tracked superinvestors
          </a>.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">
          Step 2 — Read the cover page (30 seconds)
        </h2>
        <p className="text-muted">
          <code className="text-text bg-panel px-1.5 py-0.5 rounded text-sm">
            primary_doc.xml
          </code>{" "}
          is boilerplate with two useful facts:
        </p>
        <ul className="list-disc ml-6 text-muted space-y-2">
          <li>
            <strong className="text-text">Period of report</strong> — the quarter
            being reported. 13Fs are filed up to 45 days AFTER this date, so a
            2025-Q4 filing lands by Feb 14, 2026.
          </li>
          <li>
            <strong className="text-text">Table value total</strong> — the total
            dollar value of all reported US equity positions. Gives you the
            portfolio&apos;s scale at a glance.
          </li>
        </ul>
        <p className="text-muted">
          That&apos;s it for the cover. The real data is in the next file.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">
          Step 3 — Read the information table (4 minutes)
        </h2>
        <p className="text-muted">
          The holdings list has 10 columns. Six of them matter:
        </p>

        <div className="rounded-xl border border-border bg-panel p-6 my-6">
          <div className="grid grid-cols-[140px_1fr] gap-y-4 gap-x-6 text-sm">
            <div className="text-text font-semibold">Name of Issuer</div>
            <div className="text-muted">
              Company name. Sometimes a parent (&quot;ALPHABET INC&quot;) rather
              than the ticker you expect.
            </div>
            <div className="text-text font-semibold">Title of Class</div>
            <div className="text-muted">
              Usually &quot;COM&quot; (common stock) or &quot;CL A&quot; / &quot;CL
              C&quot; (share class). Same-company different-class positions list
              separately.
            </div>
            <div className="text-text font-semibold">CUSIP</div>
            <div className="text-muted">
              9-character security identifier — the real unique ID. Two different
              tickers can share a name; two different CUSIPs never share a
              security. Use this to cross-check.
            </div>
            <div className="text-text font-semibold">Value (x$1000)</div>
            <div className="text-muted">
              Position market value, in thousands of dollars. A value of
              &quot;84,293,740&quot; means $84.29 billion — check the decimal.
            </div>
            <div className="text-text font-semibold">SSH PRNAMT</div>
            <div className="text-muted">
              Share count. Combined with the value column lets you infer the
              price the SEC used for valuation (typically quarter-end close).
            </div>
            <div className="text-text font-semibold">Put/Call</div>
            <div className="text-muted">
              Blank for long stock. Non-blank means the row is an options
              position — typically a protective put or a covered call. If you
              see this, treat the underlying stock position carefully.
            </div>
          </div>
        </div>

        <p className="text-muted">
          The other four columns (Investment Discretion, Other Managers, Voting
          Authority Sole/Shared/None) are regulatory metadata — skip them for
          investment analysis unless you&apos;re doing activism research.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">
          Step 4 — Compare quarter-over-quarter (most of the signal)
        </h2>
        <p className="text-muted">
          A single 13F is a snapshot. The <strong className="text-text">change</strong>{" "}
          between quarters is what every sophisticated reader cares about.
        </p>
        <ul className="list-disc ml-6 text-muted space-y-2">
          <li>
            <strong className="text-emerald-400">NEW</strong> — the security
            appears this quarter but not the previous. Real conviction signal
            when the position size is meaningful.
          </li>
          <li>
            <strong className="text-emerald-400">ADD</strong> — share count grew.
            Note the percentage. A 3% add on a 12% position is different from a
            300% add on a 0.1% starter.
          </li>
          <li>
            <strong className="text-rose-400">TRIM</strong> — share count
            shrunk. Could be portfolio rebalancing or loss of conviction —
            context matters.
          </li>
          <li>
            <strong className="text-rose-400">EXIT</strong> — zero shares now.
            This is a strong signal: the manager had a reason to sell the full
            position.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">
          Step 5 — Remember what a 13F doesn&apos;t show
        </h2>
        <p className="text-muted">
          This is the part most retail investors skip, and it&apos;s why
          mechanical copy-trading of 13Fs{" "}
          <a href="/learn/copy-trading-myth" className="text-brand underline">
            doesn&apos;t work
          </a>.
        </p>
        <ul className="list-disc ml-6 text-muted space-y-2">
          <li>
            <strong className="text-text">No short positions.</strong> The fund may
            be long Apple on the 13F and short Apple via a total-return swap off
            the filing. Net exposure ≠ what you see.
          </li>
          <li>
            <strong className="text-text">No foreign equities.</strong> 13Fs only
            cover US-listed securities. A global fund&apos;s 13F is a fraction of
            their book.
          </li>
          <li>
            <strong className="text-text">No bonds, cash, derivatives, commodities.</strong>{" "}
            Druckenmiller famously runs 60%+ in things that never touch a 13F.
          </li>
          <li>
            <strong className="text-text">45-day lag.</strong> By the time you
            read it, the position may already have been closed. The manager had
            6+ weeks to change their mind before the filing is even required.
          </li>
          <li>
            <strong className="text-text">No options strike/expiry detail.</strong>{" "}
            The put/call column tells you options exist but not at what price or
            when they expire.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">What to do next</h2>
        <p className="text-muted">
          You now know how to read any 13F. The question is what to do with that
          skill.
        </p>
        <ul className="list-disc ml-6 text-muted space-y-2">
          <li>
            Interested in the form itself?{" "}
            <a href="/learn/what-is-a-13f" className="text-brand underline">
              What is a 13F filing?
            </a>{" "}
            covers the why, the rules, and the history.
          </li>
          <li>
            Curious about signal vs noise?{" "}
            <a href="/learn/conviction-score-explained" className="text-brand underline">
              What is a Conviction Score?
            </a>{" "}
            explains our signed −100..+100 scale that aggregates every tracked
            manager into one number.
          </li>
          <li>
            Thinking of copying someone?{" "}
            <a href="/learn/copy-trading-myth" className="text-brand underline">
              The copy-trading myth
            </a>{" "}
            walks through why mechanically mirroring Buffett&apos;s 13F
            underperforms Berkshire itself.
          </li>
          <li>
            Want to just see the data, pre-parsed? Start with{" "}
            <a href="/best-now" className="text-brand underline">
              top buy signals right now
            </a>{" "}
            or browse{" "}
            <a href="/investor" className="text-brand underline">
              the 30 tracked superinvestors
            </a>.
          </li>
        </ul>

        <div className="border-t border-border pt-6 mt-12">
          <p className="text-dim text-sm">
            HoldLens parses 13F filings from 30 of the world&apos;s best
            portfolio managers and renders them as plain-English signals. Free,
            no signup, no paywall. Updated within hours of each SEC filing.
          </p>
        </div>
      </div>

      <LearnReadNext currentSlug="how-to-read-a-13f" />

      <ShareStrip
        title="How to read a 13F filing in 5 minutes — HoldLens"
        url="https://holdlens.com/learn/how-to-read-a-13f"
        via="holdlens"
      />
    </div>
  );
}
