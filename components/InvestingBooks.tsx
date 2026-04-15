// InvestingBooks — affiliate-ready book recommendation widget.
//
// Drops into high-intent learning surfaces (/learn/superinvestor-handbook,
// /learn/what-is-a-13f, /methodology). Each card links to the book's Amazon
// page; the `tag=` query param — the Amazon Associates affiliate tag — is
// appended ONLY when NEXT_PUBLIC_AMZN_TAG is set at build time. Without the
// tag the links still work (Amazon's default canonical), so there is no
// ugly-link fallback.
//
// Revenue model: Amazon Associates pays 1-4% commission on purchases via
// affiliate links. Finance-and-investment is one of the higher-converting
// categories on Amazon; readers of this widget are high-intent and
// specifically asked for "how to read 13Fs" — the canonical next step is
// Graham's Security Analysis.
//
// Activation for operator: one env var. No approval queue bottleneck
// beyond the Amazon Associates signup itself (~24h review).

type Book = {
  asin: string;
  title: string;
  author: string;
  why: string;
};

// Canonical reading list for the "how do I read 13Fs and think like Buffett"
// reader. Ordered by actionability — foundational first, advanced last.
const BOOKS: Book[] = [
  {
    asin: "0060555661",
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    why: "The foundational text. Warren Buffett calls it 'by far the best book about investing ever written.'",
  },
  {
    asin: "0071592539",
    title: "Security Analysis (6th Edition)",
    author: "Graham & Dodd",
    why: "The deep dive behind The Intelligent Investor — how to actually read financial statements and value a business.",
  },
  {
    asin: "1578643643",
    title: "Poor Charlie's Almanack",
    author: "Charles T. Munger",
    why: "The mental models Munger uses to evaluate every bet Berkshire ever made. Incomparable.",
  },
  {
    asin: "0743200403",
    title: "One Up On Wall Street",
    author: "Peter Lynch",
    why: "The clearest writing about spotting great businesses early. Lynch compounded 29% a year for 13 years doing exactly this.",
  },
  {
    asin: "0991573307",
    title: "The Dhandho Investor",
    author: "Mohnish Pabrai",
    why: "How a modern concentrated value manager actually thinks. Heads I win; tails I don't lose much.",
  },
  {
    asin: "0470181753",
    title: "The Most Important Thing",
    author: "Howard Marks",
    why: "Oaktree's Marks on risk, cycles, and second-level thinking. The intellectual framework behind reading any 13F.",
  },
];

function amznUrl(asin: string): string {
  const tag = process.env.NEXT_PUBLIC_AMZN_TAG;
  const base = `https://www.amazon.com/dp/${encodeURIComponent(asin)}`;
  return tag ? `${base}?tag=${encodeURIComponent(tag)}` : base;
}

export default function InvestingBooks({
  heading = "Recommended reading",
  sub = "The six books that map the mental model behind every 13F on this site.",
}: {
  heading?: string;
  sub?: string;
}) {
  return (
    <section className="my-12 rounded-2xl border border-border bg-panel p-6 md:p-8">
      <div className="text-[11px] uppercase tracking-widest text-brand font-semibold mb-2">
        Deep dive
      </div>
      <h2 className="text-xl md:text-2xl font-bold mb-2">{heading}</h2>
      <p className="text-sm text-muted mb-6">{sub}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {BOOKS.map((b) => (
          <a
            key={b.asin}
            href={amznUrl(b.asin)}
            target="_blank"
            rel="noopener sponsored nofollow"
            // Tagged-events: fires "Book Click" with asin + title props on
            // every Plausible session. Outbound-links script ALSO fires
            // an "Outbound Link: Click" automatically for the same click.
            // Operator sees book-level conversion in Plausible Events.
            className={`plausible-event-name=Book+Click plausible-event-asin=${b.asin} plausible-event-title=${encodeURIComponent(b.title)} block rounded-xl border border-border bg-bg/50 p-4 hover:border-brand/40 transition group`}
          >
            <div className="text-[10px] uppercase tracking-widest text-dim font-semibold mb-1">
              {b.author}
            </div>
            <div className="font-semibold text-text group-hover:text-brand transition mb-1.5">
              {b.title}
            </div>
            <div className="text-[12px] text-muted leading-relaxed">{b.why}</div>
            <div className="text-[11px] text-dim mt-2">View on Amazon →</div>
          </a>
        ))}
      </div>
      <p className="text-[11px] text-dim mt-5 leading-relaxed">
        Amazon affiliate links — HoldLens earns a small commission if you buy, at no extra cost
        to you. These are the books we actually recommend. Always do your own research.
      </p>
    </section>
  );
}
