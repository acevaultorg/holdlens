import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import InvestingBooks from "@/components/InvestingBooks";
import AuthorByline from "@/components/AuthorByline";
import ShareStrip from "@/components/ShareStrip";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import LearnReadNext from "@/components/LearnReadNext";
import TldrCard from "@/components/learn/TldrCard";
import OurView from "@/components/learn/OurView";
import CiteThisPage from "@/components/learn/CiteThisPage";

export const metadata: Metadata = {
  title: "How do hedge funds disclose positions? The full SEC matrix",
  description:
    "Hedge funds disclose US long positions quarterly on Form 13F, 5%+ stakes on Schedule 13D or 13G, and insider trades on Form 4. Here's the complete required-vs-voluntary disclosure matrix — which form, which trigger, which deadline, and what never gets disclosed at all.",
  alternates: { canonical: "https://holdlens.com/learn/how-do-hedge-funds-disclose-positions" },
  openGraph: {
    title: "How do hedge funds disclose their positions?",
    description:
      "13F, 13D, 13G, Form 4 — the complete matrix of what hedge funds must disclose, when, and what stays hidden.",
    url: "https://holdlens.com/learn/how-do-hedge-funds-disclose-positions",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How do hedge funds disclose their positions?",
    description: "The complete SEC disclosure matrix — forms, triggers, deadlines, and the gaps.",
    images: ["/og/home.png"],
  },
};

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Learn", item: "https://holdlens.com/learn" },
      { "@type": "ListItem", position: 3, name: "How do hedge funds disclose positions?", item: "https://holdlens.com/learn/how-do-hedge-funds-disclose-positions" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "How do hedge funds disclose positions? The full SEC matrix",
    description:
      "Reference matrix of every SEC mechanism through which hedge funds and institutional managers disclose equity positions — Form 13F, Schedule 13D, Schedule 13G, and Form 4 — with triggers, deadlines, and the disclosure gaps that remain.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/how-do-hedge-funds-disclose-positions",
    datePublished: "2026-06-11",
    dateModified: "2026-06-11",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "hedge fund disclosure",
      "how do hedge funds disclose positions",
      "13F filing",
      "Schedule 13D",
      "Schedule 13G",
      "Form 4",
      "SEC disclosure requirements",
    ],
    citation: [
      "https://www.sec.gov/divisions/investment/13ffaq",
      "https://www.sec.gov/corpfin/divisionscorpfinguidancereg13d-interpshtm",
      "https://www.sec.gov/news/press-release/2023-219",
      "https://www.investor.gov/introduction-investing/investing-basics/glossary/schedules-13d-and-13g",
    ],
    about: [
      {
        "@type": "DefinedTerm",
        name: "Form 13F",
        description:
          "Quarterly SEC filing required of institutional investment managers exercising discretion over $100 million or more in 13(f) securities. Lists US long positions only, due within 45 days of each calendar quarter-end.",
      },
      {
        "@type": "DefinedTerm",
        name: "Schedule 13D",
        description:
          "SEC beneficial-ownership report required when a person or fund acquires more than 5% of a public company's voting equity with intent to influence control. Since the SEC's 2023 amendments took effect in February 2024, the initial filing is due within 5 business days (previously 10 calendar days), with amendments within 2 business days of a material change.",
      },
      {
        "@type": "DefinedTerm",
        name: "Schedule 13G",
        description:
          "The shorter beneficial-ownership report available to passive investors and qualified institutional investors crossing the 5% threshold without control intent. The 2023 SEC amendments accelerated its deadlines — qualified institutions now file within 45 days after the end of the calendar quarter in which they cross 5%.",
      },
      {
        "@type": "DefinedTerm",
        name: "Voluntary disclosure",
        description:
          "Position information a fund chooses to reveal outside SEC requirements — investor letters, conference presentations, and media interviews. Selective, unaudited, and usually disclosed only when it serves the fund's interest.",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://holdlens.com/learn/how-do-hedge-funds-disclose-positions#faq",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do hedge funds have to disclose all their positions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Required disclosure covers US long positions (quarterly, on Form 13F, for managers over $100 million), 5%+ stakes (Schedule 13D or 13G), and insider trades by 10%+ owners (Form 4). Short positions, most derivatives, foreign-listed holdings, and cash are not in those filings.",
        },
      },
      {
        "@type": "Question",
        name: "How quickly does a hedge fund have to disclose a new position?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on size and intent. An ordinary long position appears only in the next quarterly 13F, up to 135 days after purchase. Crossing 5% with control intent triggers a Schedule 13D within 5 business days. Becoming a 10%+ owner makes the fund a Section 16 insider, with Form 4 due within 2 business days of each subsequent trade.",
        },
      },
      {
        "@type": "Question",
        name: "Why do funds disclose some positions in letters or interviews?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Voluntary disclosure is selective marketing. A fund may talk its book to attract co-investors, pressure management in an activist campaign, or raise capital. Unlike SEC filings, these disclosures are unaudited, partial, and timed to serve the fund.",
        },
      },
    ],
  },
];

export default function HowHedgeFundsDisclosePage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/learn" className="text-xs text-muted hover:text-text">← Learn</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">How do hedge funds disclose their positions?</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Four SEC mechanisms do almost all the work: <strong className="text-text">Form 13F</strong> (US longs,
          quarterly, within 45 days of quarter-end), <strong className="text-text">Schedule 13D</strong> (5%+ stake
          with control intent, within 5 business days), <strong className="text-text">Schedule 13G</strong> (5%+
          passive stake, slower track), and <strong className="text-text">Form 4</strong> (trades by 10%+ owners,
          within 2 business days). Everything else — letters, interviews, conference pitches — is
          voluntary and selective. Shorts, most derivatives, and foreign listings stay out of public view.
        </TldrCard>

        <p className="text-lg text-muted">
          Hedge funds don&rsquo;t disclose positions because they want to — they disclose because{" "}
          <strong className="text-text">specific SEC triggers force them to</strong>. Knowing which trigger produced a
          filing tells you how fresh, how complete, and how meaningful the information is.
        </p>

        <AuthorByline date="2026-06-11" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The required-disclosure matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-muted border-collapse">
            <thead>
              <tr className="border-b border-border text-left text-text">
                <th className="py-2 pr-3">Form</th>
                <th className="py-2 pr-3">Trigger</th>
                <th className="py-2 pr-3">Deadline</th>
                <th className="py-2">Shows</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-3 text-text font-semibold">13F</td>
                <td className="py-2 pr-3">≥$100M in 13(f) securities</td>
                <td className="py-2 pr-3">45 days after quarter-end</td>
                <td className="py-2">All US long positions</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-3 text-text font-semibold">13D</td>
                <td className="py-2 pr-3">&gt;5% stake, control intent</td>
                <td className="py-2 pr-3">5 business days</td>
                <td className="py-2">Stake, intent, funding</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-3 text-text font-semibold">13G</td>
                <td className="py-2 pr-3">&gt;5% stake, passive</td>
                <td className="py-2 pr-3">45 days after the quarter crossed (institutions)</td>
                <td className="py-2">Stake size only</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 text-text font-semibold">Form 4</td>
                <td className="py-2 pr-3">Trade by a 10%+ owner</td>
                <td className="py-2 pr-3">2 business days</td>
                <td className="py-2">Each individual trade</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted mt-3">
          Note the freshness gradient: Form 4 is near-real-time, 13D arrives within a week, and a 13F can
          be up to <strong className="text-text">135 days stale</strong> for a position bought on the first day of a
          quarter — see <a href="/learn/45-day-lag-explained" className="text-brand underline">the 45-day lag explained</a>.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Form 13F — the quarterly portfolio snapshot</h2>
        <p className="text-muted">
          Any institutional manager exercising investment discretion over{" "}
          <strong className="text-text">$100&nbsp;million or more in 13(f) securities</strong> — hedge funds, mutual
          funds, pension funds, large family offices — files{" "}
          <a href="/learn/what-is-a-13f" className="text-brand underline">Form 13F</a> within 45 days of each
          calendar quarter-end. It is the only filing that shows the <em>whole</em> US long book, which is
          why superinvestor tracking is built on it. It omits shorts, most derivatives economics, foreign
          listings, bonds, and cash — see{" "}
          <a href="/learn/why-13f-doesnt-show-shorts" className="text-brand underline">why a 13F never shows shorts</a>.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-10 mb-3">Schedules 13D and 13G — the 5% tripwire</h2>
        <p className="text-muted">
          Crossing <strong className="text-text">5% of a company&rsquo;s voting equity</strong> triggers beneficial-ownership
          reporting. Intent decides the form: an investor seeking to influence control files the long-form{" "}
          <strong className="text-text">Schedule 13D</strong>; a passive holder may use the shorter{" "}
          <strong className="text-text">Schedule 13G</strong>. The SEC&rsquo;s 2023 amendments (effective February 2024)
          accelerated both tracks — an initial 13D is now due within{" "}
          <strong className="text-text">5 business days</strong> (it was 10 calendar days for decades), with
          amendments within 2 business days of any material change. A 13G-to-13D switch is itself a
          high-signal event: intent changed. Full comparison:{" "}
          <a href="/learn/13d-vs-13g-activist-filings" className="text-brand underline">13D vs 13G</a>.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Form 4 — when a fund becomes an insider</h2>
        <p className="text-muted">
          Cross <strong className="text-text">10% ownership</strong> and the fund becomes a Section 16{" "}
          <a href="/learn/what-is-an-insider" className="text-brand underline">corporate insider</a> — the same
          regime as the CEO. Every subsequent buy or sell must be reported on{" "}
          <a href="/learn/form-4-vs-13f" className="text-brand underline">Form 4</a> within two business days.
          For concentrated activists (Icahn is the classic case), Form 4s are the freshest public record
          of their trading.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Voluntary disclosure — letters, pitches, interviews</h2>
        <p className="text-muted">
          Everything outside the matrix is voluntary: quarterly investor letters, idea presentations at
          conferences, CNBC and podcast interviews, activist white papers. Two properties make voluntary
          disclosure categorically different from filings: it is <strong className="text-text">selective</strong> (a
          fund shows you the positions it wants you to see) and <strong className="text-text">unaudited</strong> (no
          regulator checks the framing). It is best read as marketing that sometimes contains data.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">What never gets disclosed</h2>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">Short positions</strong> — invisible in 13Fs; only aggregated short-interest data is public.</li>
          <li><strong className="text-text">Most derivatives economics</strong> — swaps and many structured exposures sit outside the 13(f) list.</li>
          <li><strong className="text-text">Foreign-listed holdings</strong> — a fund&rsquo;s Tokyo or London book never appears in US filings.</li>
          <li><strong className="text-text">Cash and timing</strong> — no filing reveals cost basis, entry dates within the quarter, or cash levels.</li>
        </ul>

        <OurView>
          <p>
            The matrix is best read as a freshness hierarchy, not a completeness one. Form 4 and 13D are
            fast but narrow — they fire only on special situations. The 13F is slow but panoramic. The
            common mistake is treating the panoramic view as if it were fast: a 13F position was bought
            up to four and a half months before you read about it.
          </p>
          <p>
            That is why HoldLens labels every data surface with its source filing and lag, and reads the
            three filing types together — the{" "}
            <a href="/learn/sec-signals-trilogy" className="text-brand underline">SEC signals trilogy</a> — instead
            of pretending any single form tells the whole story.
          </p>
        </OurView>

        <InvestingBooks
          heading="Going deeper on disclosure-driven analysis"
          sub="The investors who use filings best read them the way these books teach — as evidence about businesses, not as trade tickets."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. Filing triggers and deadlines summarized from SEC Form 13F guidance,
          Regulation 13D-G interpretations, and the SEC&rsquo;s October 2023 beneficial-ownership amendments
          (effective February 2024); verify against the primary sources linked above. See{" "}
          <a href="/methodology" className="underline">methodology</a> for how we parse each filing type.
        </p>

        <CiteThisPage />
        <LearnReadNext currentSlug="how-do-hedge-funds-disclose-positions" />

        <ShareStrip url="https://holdlens.com/learn/how-do-hedge-funds-disclose-positions" title="How do hedge funds disclose their positions?" />

        <AdSlot format="horizontal" priority="secondary" />

        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text mb-3">See the disclosures parsed live on HoldLens</h2>
          <p className="text-sm text-muted leading-relaxed">
            <a href="/filings/" className="text-brand hover:underline">Latest 13F filings</a>
            {" from the 30 tracked superinvestors, "}
            <a href="/activist/" className="text-brand hover:underline">activist 13D situations</a>
            {", and the "}
            <a href="/insiders/" className="text-brand hover:underline">Form 4 insider firehose</a>
            {". Related explainers: "}
            <a href="/learn/13f-vs-13d-vs-13g" className="text-brand hover:underline">13F vs 13D vs 13G</a>
            {", "}
            <a href="/learn/who-files-a-13f" className="text-brand hover:underline">who files a 13F</a>
            {", "}
            <a href="/learn/how-to-interpret-changes-in-positions" className="text-brand hover:underline">how to interpret position changes</a>
            {"."}
          </p>
        </section>
      </div>
    </div>
  );
}
