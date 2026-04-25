import type { Metadata } from "next";
import ShareStrip from "@/components/ShareStrip";
import AuthorByline from "@/components/AuthorByline";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import LearnReadNext from "@/components/LearnReadNext";

// /learn/form-4-vs-13f
//
// Target queries (long-tail, high-intent):
//   "form 4 vs 13f"
//   "insider buying vs institutional buying"
//   "difference between form 4 and 13f"
//   "form 4 sec filing"
//   "what is form 4 sec"
//   "13f vs form 4 filings"
//
// Unique angle: most write-ups cover Form 4 OR 13F in isolation. HoldLens
// can frame them as a complementary pair — micro (single insider trade,
// 2-day disclosure) vs macro (institutional portfolio, 45-day quarterly
// snapshot). That's the actual mental model serious 13F readers use:
// "what did insiders do at this company between 13F snapshots?"
//
// Cross-links: /learn/sec-signals-trilogy, /learn/insider-score-explained,
// /learn/what-is-a-13f, /learn/45-day-lag-explained, /insiders, /investor.

export const metadata: Metadata = {
  title: "Form 4 vs 13F — insider trades vs institutional portfolios, side by side",
  description:
    "Plain English comparison of SEC Form 4 and Schedule 13F. Who files each, how fast they arrive, and how to read the difference between a single insider trade (2 days late) and a full institutional portfolio snapshot (45 days late).",
  alternates: {
    canonical: "https://holdlens.com/learn/form-4-vs-13f",
  },
  openGraph: {
    title: "Form 4 vs 13F — insider trades vs institutional portfolios",
    description:
      "Two SEC filings, two completely different signals. Form 4 is a 2-day insider receipt. 13F is a 45-day institutional portfolio snapshot. Here's how each works and when each one matters.",
    url: "https://holdlens.com/learn/form-4-vs-13f",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Form 4 vs 13F — insider vs institutional signals",
    images: ["/og/home.png"],
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
        name: "Form 4 vs 13F",
        item: "https://holdlens.com/learn/form-4-vs-13f",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Form 4 vs 13F — insider trades vs institutional portfolios, side by side",
    description:
      "Plain English comparison of SEC Form 4 and Schedule 13F. Two filings, two timeframes, two different signals about what's happening at any public company.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/form-4-vs-13f",
    datePublished: "2026-04-25",
    dateModified: "2026-04-25",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    about: [
      {
        "@type": "DefinedTerm",
        name: "SEC Form 4",
        description:
          "An SEC filing required from corporate insiders (officers, directors, and 10%+ beneficial owners) under Section 16(a) of the Securities Exchange Act of 1934. Filed within 2 business days of any transaction in the company's equity securities. Discloses a single transaction with exact share count, price, and date.",
      },
      {
        "@type": "DefinedTerm",
        name: "Schedule 13F",
        description:
          "A quarterly SEC filing required from institutional investment managers with at least $100 million in Section 13(f) securities under the Securities Exchange Act of 1934. Filed within 45 days of each calendar quarter end. Discloses a portfolio snapshot of long US equity positions, not transactions.",
      },
      {
        "@type": "DefinedTerm",
        name: "Section 16 insider",
        description:
          "A person subject to Section 16 of the Securities Exchange Act of 1934 — corporate officers, directors, and beneficial owners of more than 10% of any class of registered equity security. Must report all transactions in the company's stock on Form 4 within 2 business days.",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the biggest difference between Form 4 and 13F?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Speed and scope. Form 4 reports a single insider transaction within 2 business days — fast and narrow. 13F reports an entire institutional portfolio 45 days after quarter end — slow and wide. Form 4 tells you what one insider just did. 13F tells you what one fund held six weeks ago.",
        },
      },
      {
        "@type": "Question",
        name: "Can the same person file both Form 4 and 13F?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rarely, but yes. Form 4 filers are individual insiders at one specific company. 13F filers are institutional investment managers managing $100M+. A few people qualify as both — for example, a hedge fund founder who sits on the board of a portfolio company files Form 4 for that company while their fund files 13F for the broader portfolio. The two filings answer different questions.",
        },
      },
      {
        "@type": "Question",
        name: "Why is Form 4 a stronger signal than 13F per dollar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Insiders have direct visibility into the business — they see internal numbers institutional managers cannot. When a CFO buys $1M of their company's stock with personal money, that's a signal weighted by insider information. When an institutional manager buys $1M of a stock they cover, that's a signal weighted by external research. Multiple academic studies (Lakonishok, Lee 2001; Cohen, Malloy, Pomorski 2012) find insider purchases predict outperformance more reliably than institutional purchases at comparable dollar volumes.",
        },
      },
      {
        "@type": "Question",
        name: "Why does 13F arrive 45 days late if Form 4 arrives in 2 days?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The lag is regulatory, not technical. Section 13(f) deliberately gave institutional managers 45 days post-quarter to file so they could finish positions, do internal valuation, and avoid front-running. Section 16 gave insiders 2 days because their trades are individual, not portfolio-level, and the prevention concern is insider trading itself — late disclosure would defeat the purpose. Two different regulatory goals, two different timelines.",
        },
      },
      {
        "@type": "Question",
        name: "If I want one signal to track at any company, which should I pick?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Track Form 4 first if you have an existing thesis on a specific company — insider activity is the freshest available signal at that level. Track 13F if you want to know what smart-money managers think across hundreds of names — it is the only systematic source of institutional positioning. Most serious 13F readers eventually use both: 13F to find what to look at, Form 4 to confirm what to do.",
        },
      },
    ],
  },
];

export default function Form4vs13FPage() {
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
        Form 4 vs 13F
      </h1>
      <p className="text-xl text-muted mb-10">
        Two SEC filings, two completely different signals.{" "}
        <strong className="text-text">
          Form 4 tells you a CEO just bought $2M of their own stock yesterday.
          13F tells you a hedge fund held that same stock 45 days ago.
        </strong>{" "}
        Different speeds. Different scopes. Different things they prove.
      </p>

      <AuthorByline date="2026-04-25" />

      <div className="space-y-6 text-text leading-relaxed">
        {/* Quick reference card */}
        <div className="rounded-2xl border border-border bg-panel p-6 my-6">
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
            Quick reference
          </div>
          <div className="space-y-5 text-sm">
            <div>
              <div className="text-text font-semibold">Form 4</div>
              <div className="text-muted">
                Who: corporate insiders — officers, directors, and 10%+
                beneficial owners (Section 16 of the Exchange Act). When:
                within 2 business days of the transaction. What: a single
                buy or sell, with exact shares, price, and date. Why you
                care: it&apos;s the freshest available signal of insider
                conviction.
              </div>
            </div>
            <div>
              <div className="text-text font-semibold">Schedule 13F</div>
              <div className="text-muted">
                Who: institutional investment managers with ≥ $100M in
                13(f) securities (Section 13(f) of the Exchange Act).
                When: within 45 days of calendar quarter end. What: a
                portfolio snapshot of long US equity positions, not
                transactions. Why you care: it&apos;s the only
                systematic source of institutional positioning.
              </div>
            </div>
            <div className="text-xs text-muted pt-2 border-t border-border">
              Both filings live on{" "}
              <a
                href="https://www.sec.gov/edgar"
                className="underline hover:text-text"
                target="_blank"
                rel="noopener noreferrer"
              >
                EDGAR
              </a>
              . Both are free to read. Both are legally required.
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-4">The speed gap</h2>
        <p>
          The single biggest difference between Form 4 and 13F is freshness.
          Form 4 must be filed within{" "}
          <strong className="text-text">2 business days</strong> of an insider
          transaction. 13F must be filed within{" "}
          <strong className="text-text">45 calendar days</strong> of quarter
          end. By the time a 13F arrives, the snapshot inside it is already
          six weeks stale, and was already a quarter old when frozen.
        </p>
        <p>
          That means at any given moment, the freshest signal you can get
          about a public company is what its insiders did this week. The
          freshest institutional signal you can get about that same company
          is what its largest holders held forty-five days ago. The order of
          magnitude difference matters: insiders react to next quarter&apos;s
          numbers; institutions react to last quarter&apos;s.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4">The scope gap</h2>
        <p>
          The second difference is what each filing covers. A Form 4 reports
          one transaction at one company by one insider. A 13F reports every
          long US equity position a manager held on the quarter-end snapshot
          date — sometimes thousands of positions at once.
        </p>
        <p>
          That means Form 4 is a depth signal: it answers{" "}
          <em>what is happening at this specific company right now?</em> 13F
          is a breadth signal: it answers{" "}
          <em>what does this manager think across their universe?</em> Trying
          to read Form 4 for breadth is exhausting (you need to follow every
          insider at every company you care about). Trying to read 13F for
          depth misses everything that happened in the 45 days after the
          snapshot.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4">The signal-strength gap</h2>
        <p>
          Per dollar of capital deployed, insider purchases (Form 4) carry
          more predictive weight than institutional purchases (13F). The
          academic record is consistent on this point: Lakonishok and Lee
          (2001) found insider buying predicted future returns more reliably
          than institutional buying at comparable volumes; Cohen, Malloy, and
          Pomorski (2012) found certain insider trades — those by insiders
          who had successfully traded their company&apos;s stock before — had
          even stronger predictive value than the average insider purchase.
        </p>
        <p>
          The reason is information asymmetry. Insiders see internal
          financials, customer pipeline, and operational reality. They
          aren&apos;t allowed to trade on material non-public information,
          but their decisions still reflect a richer information set than
          any external analyst has access to. When a CFO with stock options
          chooses to buy more shares with personal cash, that&apos;s a
          choice made with the best available information.
        </p>
        <p>
          Institutional managers, by contrast, are reading the same SEC
          filings, earnings calls, and sell-side research everyone else has.
          Their edge is portfolio construction and conviction sizing — not
          information access. A 13F tells you which institutions size
          which positions large; it does not tell you which institutions
          have an information edge.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4">When each one matters most</h2>
        <p>
          The two filings answer different questions, so the right one to
          read depends on what you&apos;re trying to learn:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <strong className="text-text">Should I worry about this stock right now?</strong>{" "}
            Form 4. Recent insider sells in clusters are a faster warning
            than waiting for the next 13F.
          </li>
          <li>
            <strong className="text-text">Who are the smartest money managers in my portfolio thesis?</strong>{" "}
            13F. Quarterly snapshots show which superinvestors share your
            thesis (or disagree).
          </li>
          <li>
            <strong className="text-text">Did insiders buy or sell during the run-up I missed?</strong>{" "}
            Form 4. The trail of insider activity around major price moves
            is in Form 4 history, not 13F.
          </li>
          <li>
            <strong className="text-text">Is this stock a consensus institutional buy?</strong>{" "}
            13F. Aggregate Q-over-Q changes across managers reveal
            institutional consensus or divergence.
          </li>
          <li>
            <strong className="text-text">Are insiders using buybacks to mask selling?</strong>{" "}
            Form 4. If buybacks are pushing share count down while insiders
            are personally selling at the same time, that contradiction
            shows in Form 4.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-12 mb-4">Why HoldLens uses both</h2>
        <p>
          HoldLens normalizes both filings into a unified signal layer. Each
          public company we track has an{" "}
          <a href="/insiders" className="underline hover:text-text">
            insider activity timeline
          </a>{" "}
          (Form 4) running alongside its{" "}
          <a href="/investor" className="underline hover:text-text">
            institutional ownership view
          </a>{" "}
          (13F). The two together close the temporal gap that either one
          alone leaves open: 45 days of institutional silence between
          quarterly snapshots is exactly when insider activity is most
          informative.
        </p>
        <p>
          The same logic powers the broader{" "}
          <a href="/learn/sec-signals-trilogy" className="underline hover:text-text">
            SEC signals trilogy
          </a>{" "}
          — quarterly 13F (
          <a href="/learn/conviction-score-explained" className="underline hover:text-text">
            ConvictionScore
          </a>
          ), daily Form 4 (
          <a href="/learn/insider-score-explained" className="underline hover:text-text">
            InsiderScore
          </a>
          ), and intra-day 8-K (EventScore). Each one answers a question
          the other two can&apos;t. Reading any one alone leaves the other
          two questions unanswered.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4">Common confusion: &quot;institutional Form 4&quot;</h2>
        <p>
          A persistent search query is &quot;institutional Form 4 filings.&quot;
          That is a category error. Institutions do not file Form 4. Section
          16 specifically applies to natural persons in insider roles
          (officers, directors) plus any beneficial owner that crosses the
          10% threshold. An institutional fund could in theory cross 10% of
          a company&apos;s equity and become a Section 16 reporter — but
          when that happens, the institution typically files{" "}
          <a href="/learn/13d-vs-13g-activist-filings" className="underline hover:text-text">
            Schedule 13D or 13G
          </a>{" "}
          for the position, not Form 4 for individual trades.
        </p>
        <p>
          So if you see a phrase like &quot;BlackRock&apos;s Form 4 in
          AAPL,&quot; that&apos;s either a misreading or an error in the
          source. BlackRock files 13F (institutional portfolio) and 13G
          (passive 5%+ stake). Apple&apos;s officers and directors file
          Form 4 when they personally trade Apple stock. Two separate
          filing universes, easy to confuse from the outside.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4">The honest limitations</h2>
        <p>
          Form 4 is not a complete picture of insider intent. Insiders sell
          for many reasons unrelated to a view on the stock — diversification,
          taxes, college tuition, divorce, planned 10b5-1 schedules. Reading
          a single Form 4 sale as &quot;insider thinks the stock is overvalued&quot;
          is overinterpretation. Form 4 is most informative in clusters
          (multiple insiders selling in the same window) and in deviation
          from a known plan (a sale not pre-scheduled in a 10b5-1).
        </p>
        <p>
          13F is also incomplete. Section 13(f) only requires disclosure of
          long US equity positions in the 13(f) securities list — short
          positions are exempt, options are reported only as the underlying,
          international holdings are excluded, and non-13(f) instruments
          (Treasuries, corporate bonds, private placements) are entirely
          off-record. A 13F is not a full portfolio; it is a partial and
          delayed view filtered through a specific definition.
        </p>
        <p>
          Used honestly, the two together are better than either alone.
          Used to confirm a thesis you already hold, both can mislead.
          Used to find new questions to ask, both reward careful reading.
        </p>

        <ShareStrip
          title="Form 4 vs 13F — insider trades vs institutional portfolios"
          url="https://holdlens.com/learn/form-4-vs-13f"
        />
      </div>

      <LearnReadNext currentSlug="form-4-vs-13f" />
    </div>
  );
}
