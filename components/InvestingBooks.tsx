// InvestingBooks — affiliate-ready book recommendation widget.
//
// Drops into high-intent learning surfaces (/learn/superinvestor-handbook,
// /learn/what-is-a-13f, /methodology). Each card links to Bookshop.org —
// indie-bookseller consortium, 10% affiliate commission (2.5× Amazon's
// 1-4% per I-38). The `/a/{AFFID}/{ISBN}` segment activates ONLY when
// NEXT_PUBLIC_BOOKSHOP_AFFILIATE_ID is set at build time. Without the
// id the links go to plain Bookshop search (still works, no commission).
//
// Per I-38 (Bookshop default, NOT Amazon): Bookshop.org is fleet-default
// affiliate. Amazon's 2025 commission gutting (1-4%) makes Bookshop the
// dominant choice for the entire fleet. Same NEXT_PUBLIC_BOOKSHOP_AFFILIATE_ID
// env var activates revenue across HoldLens + readinglist.school + readminute.com
// from a SINGLE Bookshop shop signup.
//
// Revenue model: 10% commission on every Bookshop purchase via affiliate-
// tagged links. Finance-and-investment is one of the higher-converting
// categories on Bookshop; readers of this widget are high-intent and
// specifically asked for "how to read 13Fs" — the canonical next step is
// Graham's Security Analysis.
//
// Activation for operator: one env var (shared across fleet). No approval
// queue bottleneck beyond the Bookshop shop signup itself (~1-3 business
// day review).

type Book = {
  isbn13: string;     // Canonical Bookshop product key (also used by readinglist.school + readminute.com)
  title: string;
  author: string;
  why: string;
};

// Canonical reading list for the "how do I read 13Fs and think like Buffett"
// reader. Ordered by actionability — foundational first, advanced last.
// ISBN-13s verified against Bookshop.org product pages; if Bookshop ever
// retires an edition the affiliate URL falls back to title-author search
// (still tracked when AFFID is present via /a/{AFFID}?keywords=).
const BOOKS: Book[] = [
  {
    isbn13: "9780060555665",
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    why: "The foundational text. Warren Buffett calls it 'by far the best book about investing ever written.'",
  },
  {
    isbn13: "9780071592536",
    title: "Security Analysis",
    author: "Graham & Dodd",
    why: "The deep dive behind The Intelligent Investor — how to actually read financial statements and value a business.",
  },
  {
    isbn13: "9781578643646",
    title: "Poor Charlie's Almanack",
    author: "Charles T. Munger",
    why: "The mental models Munger uses to evaluate every bet Berkshire ever made. Incomparable.",
  },
  {
    isbn13: "9780743200400",
    title: "One Up On Wall Street",
    author: "Peter Lynch",
    why: "The clearest writing about spotting great businesses early. Lynch compounded 29% a year for 13 years doing exactly this.",
  },
  {
    isbn13: "9780470043899",
    title: "The Dhandho Investor",
    author: "Mohnish Pabrai",
    why: "How a modern concentrated value manager actually thinks. Heads I win; tails I don't lose much.",
  },
  {
    isbn13: "9780470181751",
    title: "The Most Important Thing",
    author: "Howard Marks",
    why: "Oaktree's Marks on risk, cycles, and second-level thinking. The intellectual framework behind reading any 13F.",
  },
];

// Bookshop URL builder — affiliate-tagged when AFFID is set, plain search
// otherwise. ISBN-13 path is preferred (direct product attribution); title
// search is a defensive fallback if Bookshop ever retires an edition.
function bookshopUrl(book: Book): string {
  const affid = process.env.NEXT_PUBLIC_BOOKSHOP_AFFILIATE_ID || "";
  const base = "https://bookshop.org";
  if (book.isbn13 && affid) {
    return `${base}/a/${affid}/${book.isbn13}`;
  }
  if (affid) {
    return `${base}/a/${affid}?keywords=${encodeURIComponent(`${book.title} ${book.author}`)}`;
  }
  // No affiliate ID yet — plain search so the link still works pre-approval
  return `${base}/search?keywords=${encodeURIComponent(`${book.title} ${book.author}`)}`;
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
            key={b.isbn13}
            href={bookshopUrl(b)}
            target="_blank"
            rel="noopener sponsored nofollow"
            // Tagged-events: fires "Book Click" with isbn + title props on
            // every Plausible session. Outbound-links script ALSO fires
            // an "Outbound Link: Click" automatically for the same click.
            // Operator sees book-level conversion in Plausible Events.
            className={`plausible-event-name=Book+Click plausible-event-isbn=${b.isbn13} plausible-event-title=${encodeURIComponent(b.title)} block rounded-xl border border-border bg-bg/50 p-4 hover:border-brand/40 transition group`}
          >
            <div className="text-[10px] uppercase tracking-widest text-dim font-semibold mb-1">
              {b.author}
            </div>
            <div className="font-semibold text-text group-hover:text-brand transition mb-1.5">
              {b.title}
            </div>
            <div className="text-[12px] text-muted leading-relaxed">{b.why}</div>
            <div className="text-[11px] text-dim mt-2">View on Bookshop.org →</div>
          </a>
        ))}
      </div>
      <p className="text-[11px] text-dim mt-5 leading-relaxed">
        Bookshop.org affiliate links — HoldLens earns a 10% commission if you buy, at no
        extra cost to you. Bookshop.org is the indie-bookseller consortium that supports
        local bookstores. These are the books we actually recommend. Always do your own
        research.
      </p>
    </section>
  );
}
