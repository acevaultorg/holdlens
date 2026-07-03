// data/books.ts — the canonical investing reading list for HoldLens.
//
// SHARED SOURCE (one copy, consumed at build time): the book data + the
// Amazon-link resolver + the Audible bounty link live here so InvestingBooks.tsx
// and app/reading/page.tsx render from the SAME source. Copy-forked in shape
// from readinglist.school's BuyLinks.tsx (the proven fleet earner) — adapted to
// a value-investing / 13F-tracking audience.
//
// AFFILIATE COMPLIANCE (shared Amazon Associates account — one breach risks the
// whole fleet):
//   - Every link carries the affiliate tag (NEXT_PUBLIC_AMAZON_AFFILIATE_TAG,
//     default `global074-20` = the account-wide tag that ACTUALLY earns today).
//     Do NOT change the default to an un-created per-site tag (e.g. `holdlens-20`)
//     — an unregistered tag earns $0. When the operator creates `holdlens-20` in
//     Amazon Associates, set NEXT_PUBLIC_AMAZON_AFFILIATE_TAG=holdlens-20 for
//     per-site attribution.
//   - rel="sponsored nofollow noopener" is applied at the render site.
//   - Inline FTC disclosure is rendered adjacent to every CTA block.
//   - NO price display. No fake scarcity. No incentivizing clicks. Books are
//     framed as EDITORIAL recommendations (YMYL-safe per Pivot A) — never as
//     "transact now" adjacent to a ConvictionScore.
//
// ZERO FABRICATION: titles + authors are real and correct. ISBN-13s are only
// hardcoded where verified (they were carried over from the prior InvestingBooks
// component). Books without a verified ISBN resolve to an affiliate-tagged Amazon
// SEARCH link (still lands the reader on the right book, still attributed) — a
// Google-Books ISBN-verification pass can later upgrade these `null`s to direct
// /dp/ links for higher CVR. Never invent an ISBN.

export type BookGroup =
  | "Foundations"
  | "Mental models & temperament"
  | "In their own words"
  | "Macro & memoirs"
  | "Valuation";

export type Book = {
  /** Verified ISBN-13 (978 prefix) → resolves to a direct /dp/ product page.
   *  null → affiliate-tagged Amazon search fallback (honest, still attributed). */
  isbn13: string | null;
  title: string;
  author: string;
  /** One editorial line — why THIS reader (a 13F/superinvestor tracker) should read it. */
  why: string;
  group: BookGroup;
};

// The value-investing canon. Ordered foundational → advanced within each group.
export const BOOKS: Book[] = [
  // ── Foundations ──────────────────────────────────────────────────────────
  {
    isbn13: "9780060555665",
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    why: "The foundational text. Buffett calls it 'by far the best book about investing ever written.'",
    group: "Foundations",
  },
  {
    isbn13: "9780071592536",
    title: "Security Analysis",
    author: "Benjamin Graham & David Dodd",
    why: "The deep dive behind The Intelligent Investor — how to actually read a filing and value a business.",
    group: "Foundations",
  },
  {
    isbn13: null,
    title: "Common Stocks and Uncommon Profits",
    author: "Philip A. Fisher",
    why: "The 'scuttlebutt' method — how to judge a business's quality, not just its price. A Buffett-endorsed pillar.",
    group: "Foundations",
  },
  {
    isbn13: null,
    title: "The Little Book of Common Sense Investing",
    author: "John C. Bogle",
    why: "The counterweight every stock-picker should read: why costs and indexing win over most active managers.",
    group: "Foundations",
  },

  // ── Mental models & temperament ─────────────────────────────────────────
  {
    isbn13: "9781578643646",
    title: "Poor Charlie's Almanack",
    author: "Charles T. Munger",
    why: "The latticework of mental models Munger used to sanity-check every bet Berkshire ever made.",
    group: "Mental models & temperament",
  },
  {
    isbn13: "9780470181751",
    title: "The Most Important Thing",
    author: "Howard Marks",
    why: "Oaktree's Marks on risk, cycles, and second-level thinking — the framework behind reading any 13F.",
    group: "Mental models & temperament",
  },
  {
    isbn13: null,
    title: "Mastering the Market Cycle",
    author: "Howard Marks",
    why: "Where in the cycle are we, and how should that change your positioning? Marks's companion volume.",
    group: "Mental models & temperament",
  },
  {
    isbn13: "9780470043899",
    title: "The Dhandho Investor",
    author: "Mohnish Pabrai",
    why: "How a modern concentrated value manager thinks: 'Heads I win; tails I don't lose much.'",
    group: "Mental models & temperament",
  },
  {
    isbn13: null,
    title: "Margin of Safety",
    author: "Seth A. Klarman",
    why: "The most-cited value book never reprinted. Klarman on why cash is a position and patience pays.",
    group: "Mental models & temperament",
  },

  // ── In their own words (managers tracked on this site) ──────────────────
  {
    isbn13: "9780743200400",
    title: "One Up On Wall Street",
    author: "Peter Lynch",
    why: "The clearest writing about spotting great businesses early. Lynch compounded ~29% a year for 13 years.",
    group: "In their own words",
  },
  {
    isbn13: null,
    title: "The Essays of Warren Buffett",
    author: "Lawrence A. Cunningham (ed.)",
    why: "Buffett's shareholder letters, organized by theme. The single best source on how he actually thinks.",
    group: "In their own words",
  },
  {
    isbn13: null,
    title: "The Little Book That Beats the Market",
    author: "Joel Greenblatt",
    why: "Greenblatt's 'Magic Formula' — good companies at cheap prices, made systematic.",
    group: "In their own words",
  },
  {
    isbn13: null,
    title: "You Can Be a Stock Market Genius",
    author: "Joel Greenblatt",
    why: "Special situations — spinoffs, restructurings — where a patient small investor can out-edge the crowd.",
    group: "In their own words",
  },
  {
    isbn13: null,
    title: "Fooling Some of the People All of the Time",
    author: "David Einhorn",
    why: "Einhorn's blow-by-blow of a real short thesis — how to read a fraud, and how the game actually gets played.",
    group: "In their own words",
  },

  // ── Macro & memoirs ─────────────────────────────────────────────────────
  {
    isbn13: null,
    title: "The Big Short",
    author: "Michael Lewis",
    why: "The story behind Michael Burry's 2007 subprime bet — contrarian conviction against a whole market.",
    group: "Macro & memoirs",
  },
  {
    isbn13: null,
    title: "The Snowball",
    author: "Alice Schroeder",
    why: "The definitive Buffett biography — the temperament and habits behind six decades of compounding.",
    group: "Macro & memoirs",
  },
  {
    isbn13: null,
    title: "The Alchemy of Finance",
    author: "George Soros",
    why: "Soros's theory of reflexivity — the macro mind behind Druckenmiller's greatest trades.",
    group: "Macro & memoirs",
  },
  {
    isbn13: null,
    title: "More Money Than God",
    author: "Sebastian Mallaby",
    why: "A history of the hedge fund — how the managers on this site's leaderboards actually built their edge.",
    group: "Macro & memoirs",
  },
  {
    isbn13: null,
    title: "Richer, Wiser, Happier",
    author: "William Green",
    why: "Interviews with the great investors on process and mindset — the human side of the 13F.",
    group: "Macro & memoirs",
  },

  // ── Valuation ───────────────────────────────────────────────────────────
  {
    isbn13: null,
    title: "Damodaran on Valuation",
    author: "Aswath Damodaran",
    why: "The reference for putting a number on a business — the discipline behind any conviction score.",
    group: "Valuation",
  },
];

/** Ordered groups for rendering the /reading hub. */
export const BOOK_GROUPS: BookGroup[] = [
  "Foundations",
  "Mental models & temperament",
  "In their own words",
  "Macro & memoirs",
  "Valuation",
];

const BY_TITLE = new Map(BOOKS.map((b) => [b.title, b]));

/** The 5 books every value investor on this site should start with. Used as the
 *  default set for the InvestingBooks widget on generic /learn pages. */
export const CORE_CANON: string[] = [
  "The Intelligent Investor",
  "Security Analysis",
  "Poor Charlie's Almanack",
  "The Most Important Thing",
  "One Up On Wall Street",
];

// Per-investor book map: a manager's OWN/defining book(s) first, then the shared
// canon they're associated with. Every association is real (author↔manager or a
// book explicitly about that manager). Managers not listed fall back to CORE_CANON.
export const INVESTOR_BOOKS: Record<string, string[]> = {
  "warren-buffett": [
    "The Essays of Warren Buffett",
    "The Snowball",
    "The Intelligent Investor",
    "Common Stocks and Uncommon Profits",
  ],
  "seth-klarman": ["Margin of Safety", "The Intelligent Investor", "Security Analysis"],
  "joel-greenblatt": [
    "The Little Book That Beats the Market",
    "You Can Be a Stock Market Genius",
    "The Intelligent Investor",
  ],
  "michael-burry": ["The Big Short", "Security Analysis", "The Intelligent Investor"],
  "monish-pabrai": ["The Dhandho Investor", "Poor Charlie's Almanack", "The Intelligent Investor"],
  "howard-marks": [
    "The Most Important Thing",
    "Mastering the Market Cycle",
    "The Intelligent Investor",
  ],
  "david-einhorn": [
    "Fooling Some of the People All of the Time",
    "Security Analysis",
    "The Intelligent Investor",
  ],
  "li-lu": ["Poor Charlie's Almanack", "The Intelligent Investor", "Security Analysis"],
  "stanley-druckenmiller": [
    "The Alchemy of Finance",
    "More Money Than God",
    "The Most Important Thing",
  ],
  "carl-icahn": ["The Most Important Thing", "The Intelligent Investor", "More Money Than God"],
  "bill-ackman": ["Richer, Wiser, Happier", "The Most Important Thing", "The Intelligent Investor"],
  "terry-smith": [
    "Common Stocks and Uncommon Profits",
    "The Intelligent Investor",
    "Poor Charlie's Almanack",
  ],
  "chuck-akre": [
    "Common Stocks and Uncommon Profits",
    "Poor Charlie's Almanack",
    "The Most Important Thing",
  ],
};

/** Return the curated Book[] for a manager slug (defining book(s) + canon),
 *  falling back to CORE_CANON. Titles that aren't in BOOKS are skipped. */
export function booksForInvestor(slug: string): Book[] {
  const titles = INVESTOR_BOOKS[slug] ?? CORE_CANON;
  return titles.map((t) => BY_TITLE.get(t)).filter((b): b is Book => Boolean(b));
}

/** Return the CORE_CANON as Book[] (default widget set). */
export function coreCanonBooks(): Book[] {
  return CORE_CANON.map((t) => BY_TITLE.get(t)).filter((b): b is Book => Boolean(b));
}

// ── Amazon link resolution ────────────────────────────────────────────────
// Tag: default `global074-20` (account-wide, earns today). Override per-site via
// NEXT_PUBLIC_AMAZON_AFFILIATE_TAG once a `holdlens-20` tracking ID exists.
export const AMAZON_TAG =
  process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || "global074-20";

// Audible Premium Plus free-trial BOUNTY link — a flat ~$5-15 bounty per
// qualified trial (far higher $/click than ~4.5% on a book). MUST be an operator
// SiteStripe-generated link (linkCode/linkId attribution); a hand-built ?tag=
// Audible URL earns $0. Default = the operator's verified fleet bounty link
// (also shipped on readinglist / Read Stacks, tag global074-20). Override with a
// holdlens-tagged SiteStripe link via NEXT_PUBLIC_AUDIBLE_URL for per-site credit.
export const AUDIBLE_URL =
  process.env.NEXT_PUBLIC_AUDIBLE_URL || "https://amzn.to/4e5EMgF";

/** ISBN-13 (978 prefix) → ISBN-10. ISBN-10 === ASIN for most print books. */
function isbn13to10(isbn13: string): string | null {
  if (isbn13.length !== 13 || !isbn13.startsWith("978")) return null;
  const core = isbn13.slice(3, 12);
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += (10 - i) * parseInt(core[i]!, 10);
  const checkNum = (11 - (sum % 11)) % 11;
  return core + (checkNum === 10 ? "X" : String(checkNum));
}

export type AmazonResolution = "asin_direct" | "title_author_search";

/** Resolve a Book to its best affiliate-tagged Amazon URL. Direct /dp/ when we
 *  hold a verified ISBN (highest CVR); an affiliate-tagged title+author search
 *  otherwise (still attributed, honest — no false 'direct product' promise). */
export function resolveAmazonUrl(book: Book): { url: string; resolution: AmazonResolution } {
  const base = "https://www.amazon.com";
  const asin = book.isbn13 ? isbn13to10(book.isbn13) : null;
  if (asin) return { url: `${base}/dp/${asin}?tag=${AMAZON_TAG}`, resolution: "asin_direct" };
  return {
    url: `${base}/s?k=${encodeURIComponent(`${book.title} ${book.author}`)}&tag=${AMAZON_TAG}`,
    resolution: "title_author_search",
  };
}
