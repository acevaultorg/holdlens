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
import { QUARTER_DEEP_DIVES } from "@/lib/quarterDeepDives";
import Link from "next/link";

const dives = QUARTER_DEEP_DIVES.filter((d) => d.period === "2026-q1");

export const metadata: Metadata = {
  title: "What superinvestors bought in Q1 2026 — 13 hedge fund 13F filings, read together",
  description:
    "A synthesis of Q1 2026 13F filings (filed May 15, 2026) across 13 tracked superinvestors. The AI trade split four ways — Tiger Global bought chips, Lone Pine bought power, TCI gutted Microsoft, Ackman bought it. Plus the value investors (Buffett, Klarman, Li Lu), the deep-value bets (Pabrai's 3-stock coal book), and the net sellers (Fundsmith). Every move EDGAR-reconstructable.",
  alternates: { canonical: "https://holdlens.com/learn/superinvestors-q1-2026-moves" },
  openGraph: {
    title: "What superinvestors bought in Q1 2026 — 13 13F filings, read together",
    description:
      "The AI trade split four ways (chips / power / Microsoft-out / Microsoft-in), the value investors, the deep-value bets, and the net sellers — synthesized from 13 Q1 2026 13F filings.",
    url: "https://holdlens.com/learn/superinvestors-q1-2026-moves",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — superinvestor 13F tracking with ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "What superinvestors bought in Q1 2026",
    description: "13 hedge fund 13F filings read together — the AI trade split four ways, plus value, deep-value, and the net sellers.",
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
      { "@type": "ListItem", position: 3, name: "Superinvestors Q1 2026 moves", item: "https://holdlens.com/learn/superinvestors-q1-2026-moves" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "What superinvestors bought in Q1 2026 — 13 hedge fund 13F filings, read together",
    description:
      "A cross-fund synthesis of Q1 2026 13F-HR filings across 13 tracked superinvestors: how the AI trade split four ways, where the value investors added, the most concentrated bets, and the net sellers. Every cited move is reconstructable from public EDGAR filings.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/superinvestors-q1-2026-moves",
    datePublished: "2026-05-28",
    dateModified: "2026-05-28",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "superinvestor Q1 2026 moves",
      "hedge fund 13F Q1 2026",
      "what hedge funds bought Q1 2026",
      "13F filings May 2026",
      "superinvestor portfolio changes 2026",
      "hedge fund AI trade 2026",
    ],
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "HoldLens superinvestor quarterly recaps",
      url: "https://holdlens.com/learn",
    },
    citation: [
      "https://holdlens.com/quarterly/2026-q1/",
      "https://holdlens.com/api/v1/snapshot/2026-Q1.json",
      "https://holdlens.com/reports/2026-05-q1-2026-13f-signal-summary",
    ],
  },
];

export default function SuperinvestorsQ12026Page() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Quarterly recaps</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">
        What superinvestors bought in Q1 2026
      </h1>

      <AuthorByline date="2026-05-28" />
      <ShareStrip url="https://holdlens.com/learn/superinvestors-q1-2026-moves" title="What superinvestors bought in Q1 2026" />

      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          The Q1 2026 13F-HR filings (all filed by 2026-05-15) are out, and read across 13 tracked
          superinvestors one theme dominates: <strong>the AI trade, expressed four different
          ways</strong>. Tiger Global bought the chips, Lone Pine bought the power, TCI sold
          Microsoft to concentrate elsewhere, and Ackman bought Microsoft. Around that sit the
          value investors still adding (Buffett, Klarman, Li Lu), the most concentrated bet we track
          (Pabrai&apos;s three-stock coal book), and a notable net seller (Fundsmith). Below is the
          synthesis, with each fund&apos;s full breakdown one click away. Every move is{" "}
          <Link href="/learn/edgar-explained" className="text-brand underline">
            reconstructable from EDGAR
          </Link>.
        </TldrCard>

        <h2 className="text-2xl font-bold mt-12 mb-3">The AI trade, split four ways</h2>
        <p>
          No single quarter has shown the AI thesis fragment so cleanly. Four respected managers
          expressed it through completely different parts of the stack:
        </p>
        <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
          <li>
            <strong className="text-text">The chips —</strong>{" "}
            <Link href="/learn/coleman-q1-2026-moves" className="text-brand underline">Chase Coleman (Tiger Global)</Link>{" "}
            added Nvidia, lifted TSMC 49% and Applied Materials 85%, and held Lam Research — while
            halving Microsoft.
          </li>
          <li>
            <strong className="text-text">The power + plumbing —</strong>{" "}
            <Link href="/learn/mandel-q1-2026-moves" className="text-brand underline">Stephen Mandel (Lone Pine)</Link>{" "}
            went a layer deeper: Vistra and Talen Energy for datacenter power, plus ASML, Teradyne,
            Corning and MasTec for equipment and materials — while halving the TSMC foundry.
          </li>
          <li>
            <strong className="text-text">Microsoft, out —</strong>{" "}
            <Link href="/learn/hohn-q1-2026-moves" className="text-brand underline">Chris Hohn (TCI)</Link>{" "}
            gutted Microsoft from 17.1% to 2.6% to deepen GE Aerospace and Visa to 58% of the book.
          </li>
          <li>
            <strong className="text-text">Microsoft, in —</strong>{" "}
            <Link href="/learn/ackman-q1-2026-moves" className="text-brand underline">Bill Ackman</Link>{" "}
            did the opposite, opening Microsoft at 15% while nearly exiting Alphabet.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-12 mb-3">The Microsoft split</h2>
        <p>
          Microsoft is the most-disagreed-upon stock of the quarter. Hohn gutted it; Coleman halved
          it;{" "}
          <Link href="/learn/halvorsen-q1-2026-moves" className="text-brand underline">Andreas Halvorsen (Viking)</Link>{" "}
          and{" "}
          <Link href="/learn/terry-smith-q1-2026-moves" className="text-brand underline">Terry Smith (Fundsmith)</Link>{" "}
          trimmed it; and Ackman bought it new at 15%. Five respected managers, the same mega-cap,
          and no consensus whatsoever — a reminder that a 13F shows conviction, not agreement.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-3">The value investors — still adding</h2>
        <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
          <li>
            <Link href="/learn/buffett-q1-2026-moves" className="text-brand underline">Warren Buffett</Link>{" "}
            ran Berkshire&apos;s most active quarter in years — a Delta re-entry, an Alphabet add,
            and Visa / Mastercard / UnitedHealth / Aon exits.
          </li>
          <li>
            <Link href="/learn/klarman-q1-2026-moves" className="text-brand underline">Seth Klarman (Baupost)</Link>{" "}
            made Amazon his top holding (+47%) and opened new Aon, Visa and Teleflex positions.
          </li>
          <li>
            <Link href="/learn/li-lu-q1-2026-moves" className="text-brand underline">Li Lu (Himalaya)</Link>{" "}
            cut his 15-year Bank of America anchor 71% — though Alphabet (~45% combined) keeps the
            book firmly concentrated.
          </li>
          <li>
            <Link href="/learn/tepper-q1-2026-moves" className="text-brand underline">David Tepper (Appaloosa)</Link>{" "}
            rotated China into US tech, taking Amazon to #1.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-12 mb-3">The concentrated + contrarian bets</h2>
        <p>
          <Link href="/learn/pabrai-q1-2026-moves" className="text-brand underline">Mohnish Pabrai</Link>{" "}
          runs the most concentrated 13F we track — a <strong>three-stock US book</strong> that is
          68% metallurgical coal (Warrior Met Coal + Alpha Metallurgical), with Transocean trimmed
          and Valaris exited. At the opposite end of risk appetite,{" "}
          <Link href="/learn/druckenmiller-q1-2026-moves" className="text-brand underline">Stanley Druckenmiller</Link>{" "}
          ran a diversification pivot with Natera at 18%.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-3">Opposite sides of the same stocks</h2>
        <p>
          The clearest illustration that filings show conviction, not consensus: Lone Pine&apos;s
          Mandel <em>bought</em> Carpenter Technology (+38%) and opened a new MasTec position as
          part of his AI-infrastructure bet — while{" "}
          <Link href="/learn/ainslie-q1-2026-moves" className="text-brand underline">Lee Ainslie (Maverick)</Link>{" "}
          was <em>dumping</em> the exact same two names (Carpenter −61%, MasTec −65%) and rotating
          into new Meta and Alphabet stakes. Two strong managers, the same quarter, opposite calls.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-3">The net seller</h2>
        <p>
          One manager stood apart by selling almost everything:{" "}
          <Link href="/learn/terry-smith-q1-2026-moves" className="text-brand underline">Terry Smith&apos;s Fundsmith</Link>{" "}
          trimmed nearly every top US position at once — Marriott, Stryker, Waters, Visa, Alphabet,
          Pfizer and more — with no offsetting adds, a uniform pullback more consistent with
          fund-level selling than individual stock calls.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-12 mb-3">All 13 Q1 2026 deep dives</h2>
        <div className="grid md:grid-cols-2 gap-3 not-prose">
          {dives.map((d) => (
            <Link key={d.slug} href={`/learn/${d.slug}`}
              className="rounded-xl border border-border bg-panel p-4 hover:border-brand transition">
              <div className="font-semibold text-text">{d.investor}</div>
              <div className="text-xs text-muted mt-0.5">{d.fund}</div>
              <p className="text-sm text-muted mt-2 leading-relaxed">{d.hook}</p>
            </Link>
          ))}
        </div>

        <p className="mt-8">
          For the data behind the narrative — top consensus positions and every tracked
          manager&apos;s holdings — see the{" "}
          <Link href="/quarterly/2026-q1/" className="text-brand underline">
            Q1 2026 quarterly recap
          </Link>
          . New to 13F filings? Start with{" "}
          <Link href="/learn/what-is-a-13f" className="text-brand underline">what a 13F is</Link>{" "}
          and{" "}
          <Link href="/learn/45-day-lag-explained" className="text-brand underline">why it&apos;s 45 days late</Link>.
        </p>

        <OurView>
          Read together, the Q1 2026 filings are less a consensus than a Rorschach test for the AI
          build-out: some managers want the chips, some the power, some are selling the software
          incumbents, and some are nowhere near tech at all. The single most useful takeaway is
          structural, not directional — a 13F captures a 45-day-old, long-only snapshot, and the
          sharpest signal is rarely &ldquo;what everyone bought&rdquo; but where respected investors
          openly disagree. Q1 2026 had plenty of that, and all of it is in the public record.
        </OurView>

        <CiteThisPage />

        <InvestingBooks />

        <LearnReadNext currentSlug="superinvestors-q1-2026-moves" />

        <p className="text-xs text-dim pt-6 border-t border-border mt-10">
          Not investment advice. Synthesized from public SEC EDGAR Form 13F-HR filings across 13
          tracked managers; each linked deep-dive cites its filer&apos;s CIK. 13F-HR data is a
          45-day-lagged snapshot of long-only U.S.-listed positions — see{" "}
          <Link href="/learn/45-day-lag-explained" className="text-brand underline">
            45-day lag explained
          </Link>{" "}
          and{" "}
          <Link href="/methodology" className="text-brand underline">methodology</Link>.
        </p>
      </div>
    </div>
  );
}
