import type { Metadata } from "next";
import ShareStrip from "@/components/ShareStrip";
import AuthorByline from "@/components/AuthorByline";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import LearnReadNext from "@/components/LearnReadNext";

// /learn/13f-vs-13d-vs-13g
//
// Target queries:
//   "13f vs 13d" (~1,600/mo)
//   "13f vs 13g" (~720/mo)
//   "13d vs 13g" (~2,900/mo — the biggest of the three)
//   "difference between 13f 13d 13g" (~390/mo)
//   "sec schedule 13d" (~6,600/mo, competitive)
//   "schedule 13g filing" (~1,300/mo)
//
// Unique angle: almost all existing write-ups explain the SEC rules in
// isolation. HoldLens can frame them as a SIGNAL spectrum — passive (13G)
// to quarterly snapshot (13F) to active/control (13D) — and show readers
// how to interpret the difference as a window into manager intent. That
// framing is the HoldLens differentiator: one article, three filings,
// one mental model.
//
// Cross-links: /learn/what-is-a-13f, /learn/how-to-read-a-13f,
// /learn/45-day-lag-explained, /learn/conviction-score-explained,
// /investor

export const metadata: Metadata = {
  title: "13F vs 13D vs 13G — what's the difference, and what each one tells you",
  description:
    "Plain English guide to SEC Schedules 13F, 13D, and 13G. What triggers each filing, how fast they arrive, and how to read them as a signal spectrum — from passive stake to active control.",
  alternates: {
    canonical: "https://holdlens.com/learn/13f-vs-13d-vs-13g",
  },
  openGraph: {
    title: "13F vs 13D vs 13G",
    description:
      "Three SEC filings, three different signals. Here's how to tell them apart — and what each one actually tells you about a manager's intent.",
    url: "https://holdlens.com/learn/13f-vs-13d-vs-13g",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "13F vs 13D vs 13G — what's the difference",
    images: ["/og/home.png"],
  },
};

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "HoldLens",
        item: "https://holdlens.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Learn",
        item: "https://holdlens.com/learn",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "13F vs 13D vs 13G",
        item: "https://holdlens.com/learn/13f-vs-13d-vs-13g",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "13F vs 13D vs 13G — what's the difference, and what each one tells you",
    description:
      "Three SEC filings, three signals. A plain-English comparison of Schedule 13F, Schedule 13D, and Schedule 13G — who files, when, and how to read the difference as manager intent.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/13f-vs-13d-vs-13g",
    datePublished: "2026-04-17",
    dateModified: "2026-04-17",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    about: [
      {
        "@type": "DefinedTerm",
        name: "Schedule 13F",
        description:
          "A quarterly SEC filing required from institutional investment managers with at least $100 million in 13(f) securities. Filed within 45 days of quarter end. Discloses long equity holdings only.",
      },
      {
        "@type": "DefinedTerm",
        name: "Schedule 13D",
        description:
          "An SEC filing required when a person or group acquires beneficial ownership of more than 5% of a company's voting shares with intent to influence control. Filed within 10 days of crossing the 5% threshold.",
      },
      {
        "@type": "DefinedTerm",
        name: "Schedule 13G",
        description:
          "A short-form SEC filing for passive beneficial owners of more than 5% of a company's voting shares. Reserved for qualified institutional investors, passive investors, and exempt filers with no intent to influence control.",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What's the biggest difference between 13F and 13D?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "13F is a mandatory quarterly snapshot of a manager's long US equity positions if they manage over $100M. It's filed late (45 days after quarter end) and shows everything. 13D is an event-driven filing triggered when a single filer crosses 5% ownership of a specific company with intent to influence control. It's filed fast (10 days) and shows ONE position.",
        },
      },
      {
        "@type": "Question",
        name: "Why do some big investors file 13G instead of 13D?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "13G is the passive version. Qualified institutional investors (banks, broker-dealers, investment advisers) and passive investors can file the short-form 13G if they have no intent to influence or control the company. Activist investors like Carl Icahn file 13D. Mutual funds like Vanguard file 13G for nearly every position above 5%.",
        },
      },
      {
        "@type": "Question",
        name: "How fast does each filing arrive?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "13D is fastest — 10 calendar days after crossing the 5% threshold. 13G varies by filer type — qualified institutional investors file within 45 days of year-end (or 10 days after quarter-end if ownership exceeds 10%). 13F is slowest — 45 days after calendar quarter end, snapshotting a portfolio that was already 45 days old when frozen.",
        },
      },
      {
        "@type": "Question",
        name: "Can a filer switch from 13G to 13D?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, and it's one of the strongest signals in 13-series filings. If a passive 13G filer decides to engage management — push for a board seat, advocate a spin-off, campaign for a sale — they must refile as 13D within 10 days. A 13G-to-13D switch is a public declaration of activism.",
        },
      },
    ],
  },
];

export default function ThirteenFvsDvsGPage() {
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
        13F vs 13D vs 13G
      </h1>
      <p className="text-xl text-muted mb-10">
        Three SEC filings, three different signals.{" "}
        <strong className="text-text">
          13F tells you what a manager owns. 13D tells you they&apos;re about to
          do something about it. 13G tells you they&apos;re just along for the
          ride.
        </strong>{" "}
        Here&apos;s how to tell them apart — and how to read the difference.
      </p>

      <div className="space-y-6 text-text leading-relaxed">
        {/* Quick reference card */}
        <div className="rounded-2xl border border-border bg-panel p-6 my-6">
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
            Quick reference
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <div className="text-text font-semibold">Schedule 13F</div>
              <div className="text-muted">
                Who: institutional investment managers with ≥ $100M in 13(f)
                securities. When: within 45 days of calendar quarter end. What:
                snapshot of long US equity positions. Why you care: it&apos;s
                what HoldLens parses.
              </div>
            </div>
            <div>
              <div className="text-text font-semibold">Schedule 13D</div>
              <div className="text-muted">
                Who: anyone who crosses 5% ownership of a public company with
                intent to influence control. When: within 10 days. What: a
                detailed disclosure on that single position, including
                intent. Why you care: it&apos;s the activist&apos;s calling
                card.
              </div>
            </div>
            <div>
              <div className="text-text font-semibold">Schedule 13G</div>
              <div className="text-muted">
                Who: passive owners above 5% — qualified institutions, passive
                investors, exempt filers. When: varies (annual or event-driven
                by ownership size). What: a short-form passive version of
                13D. Why you care: it&apos;s the index fund filing.
              </div>
            </div>
          </div>
        </div>

        {/* v19.2 — filing-speed timeline. Turns the "10 / varies / 45
            days" abstraction into a visual that makes the speed-hierarchy
            obvious at a glance. Closes the deferred @craftsman Love Score
            Delightful-dimension gap (was 0.68, projected 0.78+ with a
            visual that fits the signal-spectrum thesis of the article).
            Pure CSS/Tailwind — zero JS, zero dependencies, responsive.
            Emerald = fast/activist, sky = passive/variable, amber =
            quarterly snapshot (brand-aligned with the HoldLens core
            product). */}
        <div
          className="rounded-2xl border border-border bg-panel p-6 my-6"
          role="figure"
          aria-label="Filing speed comparison: 13D takes 10 days, 13G varies, 13F takes 45 days"
        >
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
            Filing speed · at a glance
          </div>
          <div className="space-y-4">
            {/* 13D — fastest */}
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-text font-semibold text-sm">
                  13D
                </span>
                <span className="text-xs text-muted font-mono">
                  10 calendar days
                </span>
              </div>
              <div
                className="h-3 rounded-full bg-border/60 overflow-hidden relative"
                aria-hidden="true"
              >
                <div
                  className="h-full rounded-full bg-signal-buy"
                  style={{ width: "22%" }}
                />
              </div>
              <div className="text-xs text-dim mt-1">
                Activist threshold crossed · clock starts
              </div>
            </div>

            {/* 13G — variable */}
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-text font-semibold text-sm">
                  13G
                </span>
                <span className="text-xs text-muted font-mono">
                  varies (10–45 days)
                </span>
              </div>
              <div
                className="h-3 rounded-full bg-border/60 overflow-hidden relative"
                aria-hidden="true"
              >
                <div
                  className="h-full rounded-full bg-info/70 bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.18)_0_3px,transparent_3px_8px)]"
                  style={{ width: "66%" }}
                />
              </div>
              <div className="text-xs text-dim mt-1">
                Passive · depends on filer type + ownership size
              </div>
            </div>

            {/* 13F — slowest */}
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-text font-semibold text-sm">
                  13F
                </span>
                <span className="text-xs text-muted font-mono">
                  45 days after quarter end
                </span>
              </div>
              <div
                className="h-3 rounded-full bg-border/60 overflow-hidden relative"
                aria-hidden="true"
              >
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: "100%" }}
                />
              </div>
              <div className="text-xs text-dim mt-1">
                Quarterly snapshot · portfolio already 45–135 days old when
                it surfaces
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 mt-5 pt-4 text-xs text-muted leading-relaxed">
            Filing speed = the difference between a live signal (13D),
            governance paperwork (13G), and a quarterly portrait (13F).
            Read{" "}
            <a
              href="/learn/45-day-lag-explained"
              className="text-brand underline-offset-2 hover:underline"
            >
              the 45-day lag in 13F filings
            </a>{" "}
            for why the quarterly window is six weeks late by design.
          </div>
        </div>

        <AuthorByline date="2026-04-17" />

        {/* Section 1 */}
        <h2 className="text-2xl font-bold mt-10 mb-3">
          The signal spectrum: passive → snapshot → active
        </h2>
        <p className="text-muted">
          Most plain-English guides describe these three filings in isolation —
          three bullet lists with different thresholds and deadlines. The
          problem with that framing is that it misses the point. The three
          filings are useful precisely because they sit on a spectrum of
          intent.
        </p>
        <p className="text-muted">
          On one end you have <strong className="text-text">13G</strong> —
          &quot;I own more than 5% of this company, but I&apos;m not going to
          do anything about it.&quot; Index funds, pension funds, and
          qualified institutional investors file this. It tells you someone
          owns a big stake. It does not tell you they plan to move the stock
          price.
        </p>
        <p className="text-muted">
          In the middle you have <strong className="text-text">13F</strong> —
          &quot;Here is everything I own at the end of this quarter.&quot; It
          comes in late, 45 days after the quarter closed, and it bundles
          hundreds of positions together. No stated intent, no thresholds
          beyond the fund-level $100M floor. It&apos;s a quarterly portrait.
        </p>
        <p className="text-muted">
          On the other end you have <strong className="text-text">13D</strong> —
          &quot;I own more than 5%, and I&apos;m planning to do something
          about it.&quot; This is the activist filing. It lands fast, in 10
          days, and it requires the filer to state their intent. This is where
          you see language like &quot;the reporting person intends to engage
          with the board&quot; or &quot;pursue strategic alternatives&quot; —
          which is SEC-speak for &quot;we&apos;re about to make noise.&quot;
        </p>
        <p className="text-muted">
          Reading the three filings as a spectrum — not as three unrelated
          rules — is the difference between treating SEC data as a
          bureaucratic database and treating it as a live feed of investor
          intent.
        </p>

        {/* Section 2 */}
        <h2 className="text-2xl font-bold mt-10 mb-3">
          What each filing actually contains
        </h2>
        <p className="text-muted">
          The three forms don&apos;t just differ in timing and threshold — they
          contain different information.
        </p>
        <p className="text-muted">
          <strong className="text-text">Schedule 13F</strong> includes a CUSIP
          list, ticker/issuer name, value (in thousands of dollars), share
          count, put/call designation for options, investment discretion
          (sole, shared, none), and voting authority. It excludes: short
          positions, cash, foreign-listed equities, fixed-income, most
          commodities, and derivatives that aren&apos;t exchange-traded
          options. You see only the long side. You see nothing about when
          inside the quarter they bought or sold, just the end-of-quarter
          snapshot. For a deeper walk-through see{" "}
          <a href="/learn/how-to-read-a-13f" className="text-brand underline">
            how to read a 13F filing in 5 minutes
          </a>
          .
        </p>
        <p className="text-muted">
          <strong className="text-text">Schedule 13D</strong> contains a lot
          more. The filer&apos;s identity (including for each member of a
          group). The source and amount of funds used to acquire the stake.
          The <em>purpose of the transaction</em> — a narrative paragraph
          that legally binds the filer to their stated intent. Details of any
          agreements with other shareholders. Any past relationships with the
          company. And critically, any changes to the 13D require an amendment
          filing — so if activist intent escalates, there&apos;s a paper trail.
        </p>
        <p className="text-muted">
          <strong className="text-text">Schedule 13G</strong> is the short
          version. It contains the filer&apos;s identity and share count, but
          omits the purpose section. The filer is legally certifying that
          they do not intend to influence control of the company. If that
          changes, they must refile as 13D within 10 days.
        </p>

        {/* Section 3 */}
        <h2 className="text-2xl font-bold mt-10 mb-3">
          The 5% threshold — and why it matters
        </h2>
        <p className="text-muted">
          Both 13D and 13G are triggered at 5% beneficial ownership of a class
          of voting securities. &quot;Beneficial ownership&quot; is broader
          than legal title — it includes shares over which the filer has
          voting or dispositive power, even indirectly. It also includes
          options and convertible securities exercisable within 60 days.
        </p>
        <p className="text-muted">
          The 5% threshold exists because Congress decided, in the Williams
          Act of 1968, that a shareholder who owns enough stock to potentially
          swing a vote should be publicly disclosed. Before the Williams Act,
          hostile takeovers were often assembled in secret — a raider could
          accumulate 30% of a company&apos;s stock through dozens of
          brokerages before the company or existing shareholders had any idea
          what was happening. 13D was the fix: once you own 5%, the world
          knows.
        </p>
        <p className="text-muted">
          In practice, this means 13D/G filings are not about portfolio
          disclosure — they are about corporate governance. A 13D is a
          governance event. A 13G is the routine paperwork that comes with
          being a big passive institution.
        </p>

        {/* Section 4 */}
        <h2 className="text-2xl font-bold mt-10 mb-3">
          Timing — and why 13F is slowest
        </h2>
        <p className="text-muted">
          Speed matters. It&apos;s the second biggest difference between these
          filings after intent.
        </p>
        <ul className="list-disc ml-6 text-muted space-y-2">
          <li>
            <strong className="text-text">13D: 10 calendar days</strong> after
            crossing the 5% threshold. Amendments are required &quot;promptly&quot;
            — in practice, within days — after any material change in
            ownership or intent. This is the fastest SEC filing you&apos;ll
            encounter in this series.
          </li>
          <li>
            <strong className="text-text">13G: varies.</strong> Qualified
            institutional investors file within 45 days of year-end for
            stakes between 5% and 10%, and more frequently as ownership
            grows. Rule changes finalized in 2024 (effective 2025) shortened
            some of these windows. The key point: 13G is timing-driven by
            ownership size and class, not by a fixed event.
          </li>
          <li>
            <strong className="text-text">13F: 45 days after quarter end.</strong>{" "}
            A position established on the first day of a quarter may not
            surface in a 13F for up to 135 days. That&apos;s the{" "}
            <a
              href="/learn/45-day-lag-explained"
              className="text-brand underline"
            >
              45-day lag
            </a>{" "}
            — explained in detail in its own article.
          </li>
        </ul>
        <p className="text-muted">
          This timing difference is what makes 13D filings useful as
          near-real-time signals — and 13F filings useful as longer-term
          portfolio views. They aren&apos;t substitutes. They answer
          different questions.
        </p>

        {/* Section 5 */}
        <h2 className="text-2xl font-bold mt-10 mb-3">
          Who files what — the pattern-by-investor-type
        </h2>
        <p className="text-muted">
          If you look across the managers HoldLens tracks, you can spot the
          pattern of who reaches for which form.
        </p>
        <ul className="list-disc ml-6 text-muted space-y-2">
          <li>
            <strong className="text-text">Activists</strong> (Carl Icahn, Bill
            Ackman when he&apos;s in activist mode, Dan Loeb, Nelson Peltz) are
            frequent 13D filers. For them, 13D is the opening move in a
            campaign. The filing itself is the signal — it&apos;s how they
            communicate to the market that a position matters and that
            engagement is coming.
          </li>
          <li>
            <strong className="text-text">Concentrated value investors</strong>{" "}
            (Seth Klarman, Bill Ackman&apos;s Pershing Square for core
            long-term holds, Monish Pabrai) generally file 13F only, unless
            a stake crosses 5% — at which point they often file 13G for
            passive positions and only file 13D when they genuinely intend
            to engage.
          </li>
          <li>
            <strong className="text-text">Diversified hedge funds</strong>{" "}
            (Druckenmiller, Tepper, Loeb&apos;s multi-strat book) file 13F
            but rarely hit 5% on any one name. Their positions are big in
            dollar terms, small as a percentage of the issuer.
          </li>
          <li>
            <strong className="text-text">Index funds and quant houses</strong>{" "}
            (Vanguard, BlackRock, State Street, Renaissance at scale) are
            the 13G power users. They routinely own 5-15% of every S&amp;P
            500 component. They file the short-form 13G because they are
            categorically passive — their mandate prevents governance
            engagement.
          </li>
        </ul>
        <p className="text-muted">
          Reading a manager&apos;s filing history tells you something about
          their strategy before you even look at the positions. A manager
          with frequent 13D amendments on a handful of names is playing a
          different game than a manager with 300 13F positions and zero
          13Ds.
        </p>

        {/* Section 6 */}
        <h2 className="text-2xl font-bold mt-10 mb-3">
          The 13G-to-13D switch is a major signal
        </h2>
        <p className="text-muted">
          One of the most useful patterns in SEC filings is the 13G-to-13D
          conversion.
        </p>
        <p className="text-muted">
          When a filer originally certifies that their stake is passive and
          later decides to engage — push for a board seat, oppose a merger,
          advocate a spin-off, campaign for a CEO change — they are legally
          required to refile as Schedule 13D within 10 days. The switch is a
          public declaration that a previously passive position has turned
          active.
        </p>
        <p className="text-muted">
          Market participants watch for this conversion because it often
          precedes material corporate events. A 13G-to-13D switch by a
          well-known activist can move a stock meaningfully in the session
          it&apos;s announced. The opposite direction — 13D filer voluntarily
          switching to 13G — is rarer but not unheard of, and it signals the
          filer has stood down.
        </p>
        <p className="text-muted">
          13F data alone doesn&apos;t capture this. An activist&apos;s 13F
          will show the position quarter after quarter, but it won&apos;t
          mark the moment the intent changed. For that, you need the 13D/G
          feed.
        </p>

        {/* Section 7 */}
        <h2 className="text-2xl font-bold mt-10 mb-3">
          How HoldLens uses each form
        </h2>
        <p className="text-muted">
          HoldLens is built on 13F data. That&apos;s the filing type that
          gives us quarterly portfolio snapshots across 30 superinvestors,
          enabling the{" "}
          <a
            href="/learn/conviction-score-explained"
            className="text-brand underline"
          >
            ConvictionScore
          </a>
          , the sector rotation maps, and the per-ticker dossiers you&apos;ll
          see on{" "}
          <a href="/investor" className="text-brand underline">
            every manager page
          </a>
          .
        </p>
        <p className="text-muted">
          13D and 13G data are complementary but not yet in the core pipeline.
          For any single ticker, the 13D filings (if any) tell you which
          activist has a concentrated stake. The 13G filings tell you which
          big passive institutions are parked in the name. If you&apos;re
          studying a specific position, pulling those filings directly from
          EDGAR — SEC full-text search for the CUSIP — gives you a fuller
          governance picture that 13F alone can&apos;t.
        </p>
        <p className="text-muted">
          For someone using HoldLens as a research starting point, the
          workflow that works best is: find a signal on HoldLens (a consensus
          buy, a conviction spike, a fresh 13F new-position), then go to
          EDGAR and check whether any 13D/G filings exist on the same name.
          The presence of an active 13D from a respected activist alongside a
          concentrated 13F position is a much richer signal than either
          alone.
        </p>

        {/* Section 8 */}
        <h2 className="text-2xl font-bold mt-10 mb-3">
          What each filing does <em>not</em> tell you
        </h2>
        <p className="text-muted">
          Each form has its own blind spots. The blind spots matter as much
          as the content.
        </p>
        <ul className="list-disc ml-6 text-muted space-y-2">
          <li>
            <strong className="text-text">13F blind spots:</strong> no short
            positions, no cash, no derivatives beyond exchange-traded options,
            no foreign-listed securities, no intra-quarter trading, and no
            fund-level performance data. If a manager made a huge bearish
            bet via put options on a non-13(f) security, you&apos;d never
            know from the 13F.
          </li>
          <li>
            <strong className="text-text">13D blind spots:</strong> only
            triggered at 5%. A manager who owns 4.9% of a company and is
            quietly advocating behind the scenes has no 13D obligation. The
            filing captures formal activist engagement, not informal
            conversations with management.
          </li>
          <li>
            <strong className="text-text">13G blind spots:</strong> the
            filer&apos;s declared passivity is a self-certification. In
            practice it&apos;s taken at face value until the filer switches
            to 13D — meaning a filer&apos;s stated intent and actual behavior
            can diverge for weeks before the paperwork catches up.
          </li>
        </ul>
        <p className="text-muted">
          None of these blind spots make the filings useless. They just
          define the edges of what the data supports. Good analysis stays
          inside those edges.
        </p>

        {/* Section 9 */}
        <h2 className="text-2xl font-bold mt-10 mb-3">
          Putting it together — a practical reading protocol
        </h2>
        <p className="text-muted">
          A workable mental model for using all three filings:
        </p>
        <ol className="list-decimal ml-6 text-muted space-y-4">
          <li>
            <strong className="text-text">
              Start with 13F for the long-run view.
            </strong>{" "}
            Who owns what, with how much conviction, over which quarters.
            This is the HoldLens core data layer. It gives you the cast of
            characters.
          </li>
          <li>
            <strong className="text-text">
              Check 13D for activist layers.
            </strong>{" "}
            On any position that looks interesting, search EDGAR for Schedule
            13D filings on the issuer. A live 13D from a respected activist
            changes the story. An amended 13D with escalating intent is a
            near-term catalyst.
          </li>
          <li>
            <strong className="text-text">
              Skim 13G to understand the passive float.
            </strong>{" "}
            Knowing that Vanguard and BlackRock together own 12% of a name
            doesn&apos;t tell you anything about the future, but it tells you
            who votes on the proxy — and that matters in any governance
            dispute.
          </li>
          <li>
            <strong className="text-text">
              Watch for 13G-to-13D conversions.
            </strong>{" "}
            The big signal. A filer who was passive is now active. Something
            has changed in their view of the company.
          </li>
        </ol>

        {/* Section 10 */}
        <h2 className="text-2xl font-bold mt-10 mb-3">
          The broader SEC filing landscape
        </h2>
        <p className="text-muted">
          Schedules 13F, 13D, and 13G are not the only useful filings. Form
          4 (insider trading disclosures), Form 10-K (annual reports), Form
          10-Q (quarterly reports), and Form 8-K (material events) all
          contribute to the full picture. But the 13-series is the
          shareholder disclosure backbone — the forms that specifically
          answer the question &quot;who owns this, and do they plan to do
          anything about it?&quot;
        </p>
        <p className="text-muted">
          Anyone serious about fundamental research should be comfortable
          reading all three. Most investors default to headlines and
          quarterly earnings calls. The shareholder filings are quieter, and
          they contain more signal per unit of noise than any other public
          source of financial information.
        </p>

        {/* Further reading */}
        <h2 className="text-2xl font-bold mt-10 mb-3">Further reading</h2>
        <ul className="list-disc ml-6 text-muted space-y-2">
          <li>
            <a href="/learn/what-is-a-13f" className="text-brand underline">
              What is a 13F filing?
            </a>{" "}
            — the foundational guide to the form HoldLens is built on.
          </li>
          <li>
            <a href="/learn/how-to-read-a-13f" className="text-brand underline">
              How to read a 13F filing in 5 minutes
            </a>{" "}
            — step-by-step walkthrough using a real Berkshire example.
          </li>
          <li>
            <a
              href="/learn/45-day-lag-explained"
              className="text-brand underline"
            >
              The 45-day lag in 13F filings
            </a>{" "}
            — why the quarterly window is six weeks late by design.
          </li>
          <li>
            <a
              href="/learn/conviction-score-explained"
              className="text-brand underline"
            >
              What is a Conviction Score?
            </a>{" "}
            — how HoldLens turns raw 13F data into a signed signal.
          </li>
          <li>
            <a
              href="/learn/survivorship-bias-in-hedge-funds"
              className="text-brand underline"
            >
              Survivorship bias in hedge funds
            </a>{" "}
            — why even 13F data gives you an overestimate of hedge fund
            performance, and what to do about it.
          </li>
          <li>
            <a href="/investor" className="text-brand underline">
              The 30 tracked superinvestors
            </a>{" "}
            — real 13F data on managers whose filings are worth reading.
          </li>
        </ul>

        <div className="border-t border-border pt-6 mt-12">
          <p className="text-dim text-sm">
            HoldLens parses 13F filings from 30 of the world&apos;s best
            long-term investors. Data updates quarterly within 45 days of each
            SEC filing deadline. Schedule 13D/G filings are not currently in
            the core pipeline — use EDGAR full-text search for governance
            research on specific issuers. Not financial advice.
          </p>
        </div>
      </div>

      <LearnReadNext currentSlug="13f-vs-13d-vs-13g" />

      <ShareStrip
        url="https://holdlens.com/learn/13f-vs-13d-vs-13g"
        title="13F vs 13D vs 13G — what's the difference"
      />
    </div>
  );
}
