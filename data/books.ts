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
  | "Behavioral finance"
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
  {
    isbn13: null,
    title: "The Little Book of Value Investing",
    author: "Christopher H. Browne",
    why: "The Tweedy Browne partner distils Graham-and-Dodd value into its plainest, most usable form.",
    group: "Foundations",
  },
  {
    isbn13: null,
    title: "Value Investing: From Graham to Buffett and Beyond",
    author: "Bruce C. N. Greenwald",
    why: "The Columbia Business School course in a book — how modern value investors actually build a thesis.",
    group: "Foundations",
  },
  {
    isbn13: null,
    title: "The Warren Buffett Way",
    author: "Robert G. Hagstrom",
    why: "A clear reverse-engineering of Buffett's actual criteria — the checklist behind decades of 13Fs.",
    group: "Foundations",
  },
  {
    isbn13: null,
    title: "Contrarian Investment Strategies",
    author: "David Dreman",
    why: "The data case for buying what the crowd sells — the empirical backbone of contrarian conviction.",
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

  // ── Behavioral finance (why smart investors still get it wrong) ─────────
  {
    isbn13: null,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    why: "Timeless: doing well with money is about behaviour, not IQ — the temperament every 13F-copier lacks.",
    group: "Behavioral finance",
  },
  {
    isbn13: null,
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    why: "The Nobel work on the biases that wreck investors — anchoring, overconfidence, loss aversion, mapped.",
    group: "Behavioral finance",
  },
  {
    isbn13: null,
    title: "Fooled by Randomness",
    author: "Nassim Nicholas Taleb",
    why: "How luck masquerades as skill in markets — required reading before you copy any 'genius' manager.",
    group: "Behavioral finance",
  },
  {
    isbn13: null,
    title: "The Little Book of Behavioral Investing",
    author: "James Montier",
    why: "A field guide to your own worst instincts — and the checklists great managers use to override them.",
    group: "Behavioral finance",
  },
  {
    isbn13: null,
    title: "Influence: The Psychology of Persuasion",
    author: "Robert B. Cialdini",
    why: "A Munger favourite — the persuasion patterns that move markets, boards, and your own decisions.",
    group: "Behavioral finance",
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
  {
    isbn13: null,
    title: "Beating the Street",
    author: "Peter Lynch",
    why: "Lynch walks through his actual picks — the sequel that shows the method on live case studies.",
    group: "In their own words",
  },
  {
    isbn13: null,
    title: "Berkshire Hathaway Letters to Shareholders",
    author: "Warren Buffett (ed. Max Olson)",
    why: "The complete letters, unedited — the primary source behind every 'Buffett would say' on this site.",
    group: "In their own words",
  },
  {
    isbn13: null,
    title: "Common Sense on Mutual Funds",
    author: "John C. Bogle",
    why: "Bogle's full argument on costs, indexing, and long-horizon discipline — the case active managers answer to.",
    group: "In their own words",
  },
  {
    isbn13: null,
    title: "The Joys of Compounding",
    author: "Gautam Baid",
    why: "A modern value investor's synthesis of the whole canon into a lived philosophy — a superb on-ramp.",
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
  {
    isbn13: null,
    title: "When Genius Failed",
    author: "Roger Lowenstein",
    why: "The LTCM collapse — the cautionary tale of leverage and hubris behind every risk-management chapter.",
    group: "Macro & memoirs",
  },
  {
    isbn13: null,
    title: "Reminiscences of a Stock Operator",
    author: "Edwin Lefèvre",
    why: "The century-old Jesse Livermore classic on speculation and psychology — still quoted on every desk.",
    group: "Macro & memoirs",
  },
  {
    isbn13: null,
    title: "A Random Walk Down Wall Street",
    author: "Burton G. Malkiel",
    why: "The efficient-markets challenge every stock-picker should be able to answer — know the other side.",
    group: "Macro & memoirs",
  },
  {
    isbn13: null,
    title: "Manias, Panics, and Crashes",
    author: "Charles P. Kindleberger",
    why: "The anatomy of financial bubbles across four centuries — how to recognise the cycle you're standing in.",
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
  {
    isbn13: null,
    title: "The Little Book of Valuation",
    author: "Aswath Damodaran",
    why: "Damodaran's approachable entry point — enough DCF and multiples to sanity-check any thesis.",
    group: "Valuation",
  },
  {
    isbn13: null,
    title: "The Five Rules for Successful Stock Investing",
    author: "Pat Dorsey",
    why: "Morningstar's Dorsey on reading financial statements and spotting quality — practical and clear.",
    group: "Valuation",
  },
  {
    isbn13: null,
    title: "The Little Book That Builds Wealth",
    author: "Pat Dorsey",
    why: "The clearest short book on economic moats — the durable competitive edge behind long-term compounders.",
    group: "Valuation",
  },
  {
    isbn13: null,
    title: "Financial Statement Analysis",
    author: "Martin S. Fridson & Fernando Alvarez",
    why: "How to read what a filing is really saying — the forensic skill behind every ConvictionScore input.",
    group: "Valuation",
  },
  {
    isbn13: null,
    title: "Valuation: Measuring and Managing the Value of Companies",
    author: "McKinsey & Company (Koller, Goedhart, Wessels)",
    why: "The professional's DCF bible — the deep end for anyone serious about putting a number on a business.",
    group: "Valuation",
  },
];

/** Ordered groups for rendering the /reading hub. */
export const BOOK_GROUPS: BookGroup[] = [
  "Foundations",
  "Mental models & temperament",
  "Behavioral finance",
  "In their own words",
  "Macro & memoirs",
  "Valuation",
];

// ── Topic shelves ──────────────────────────────────────────────────────────
// Each BookGroup gets its own indexable /reading/[slug] page — a curated
// "books about X" entity surface (acquisition target) that links back into the
// /reading hub and its sibling shelves. Copy is genuinely unique per shelf
// (HCU + Amazon OA both require real human editorial, not templated stubs).
export type GroupMeta = {
  group: BookGroup;
  /** URL slug: /reading/[slug] */
  slug: string;
  /** On-page H1 */
  h1: string;
  /** SEO <title> */
  title: string;
  /** meta description */
  description: string;
  /** 2-paragraph editorial intro — unique per shelf, not a template */
  intro: string[];
};

export const GROUP_META: GroupMeta[] = [
  {
    group: "Foundations",
    slug: "foundations",
    h1: "The best value-investing books to start with",
    title: "The Best Value Investing Books — the foundational canon",
    description:
      "The foundational value-investing books, in the order a serious investor should read them: Graham, Fisher, Bogle and the modern texts that teach how to value a business.",
    intro: [
      "Every serious value investor starts in the same place: a handful of books that teach what a business is worth, why price and value diverge, and how to keep your head when the market loses its. This is that shelf — the foundations, ordered from the first book to read to the ones that deepen it.",
      "If you only read one, make it The Intelligent Investor — the book Warren Buffett calls the best ever written on investing. From there, Security Analysis shows you how to actually read a filing, Fisher and Greenwald teach you to judge business quality, and Bogle keeps you honest about costs. Together they are the grammar behind every 13F on this site.",
    ],
  },
  {
    group: "Mental models & temperament",
    slug: "mental-models",
    h1: "Books on the mental models behind great investing",
    title: "Books on Investing Mental Models & Temperament",
    description:
      "The books that build the temperament and thinking behind great investing: Munger's mental models, Howard Marks on risk and cycles, and how concentrated value investors actually decide.",
    intro: [
      "Stock-picking is a decision-making problem before it is a numbers problem. This shelf is about the thinking that separates managers who compound for decades from those who blow up in a single cycle — the latticework of mental models, the discipline of second-level thinking, and the patience to do nothing while others panic.",
      "Poor Charlie's Almanack is the source text: Munger's cross-disciplinary models for sanity-checking any bet. Howard Marks's The Most Important Thing and Mastering the Market Cycle add the risk-and-cycles frame, and Pabrai and Klarman show how modern concentrated value investors actually behave when the odds are in their favour.",
    ],
  },
  {
    group: "Behavioral finance",
    slug: "behavioral-finance",
    h1: "The best behavioral finance books for investors",
    title: "The Best Behavioral Finance Books — the psychology of investing",
    description:
      "The best books on the psychology of investing: why smart people still lose money, the biases that wreck portfolios, and the checklists great managers use to override their own instincts.",
    intro: [
      "The biggest edge in markets is not information — it is behaviour. Most investors know what to do and still don't do it, because fear, overconfidence and the pull of the crowd override the plan at exactly the wrong moment. This shelf is the antidote: the books that name your biases so you can catch them.",
      "Kahneman's Thinking, Fast and Slow is the science; Housel's The Psychology of Money is the wisdom; Taleb and Montier show how luck disguises itself as skill and how to build the checklists that protect you from yourself. Read this before you copy any 'genius' manager's 13F — because the returns you see are downstream of a temperament you may not have.",
    ],
  },
  {
    group: "In their own words",
    slug: "in-their-own-words",
    h1: "Books by the superinvestors we track",
    title: "Books by the Best Investors — in their own words",
    description:
      "Books written by (or definitively about) the superinvestors tracked on HoldLens: Buffett's letters, Lynch, Greenblatt, Einhorn and the modern value canon in the managers' own words.",
    intro: [
      "The best way to understand a manager's 13F is to read the manager. Several of the investors whose live holdings you can follow on this site wrote the definitive book on their own method — and reading it turns a list of tickers into a coherent way of thinking.",
      "Buffett's shareholder letters (collected in The Essays and the complete Letters) are the primary source; Lynch teaches you to spot great businesses early; Greenblatt hands you a systematic formula and the special-situations playbook; Einhorn walks you through a real short thesis. Each pairs directly with a live profile on HoldLens.",
    ],
  },
  {
    group: "Macro & memoirs",
    slug: "macro-and-memoirs",
    h1: "Investing history, macro and market-crash books",
    title: "The Best Books on Market History, Macro & Financial Crashes",
    description:
      "The best books on financial history and macro investing: the great trades, the famous blow-ups, and the four-century pattern of manias, panics and crashes every investor should recognise.",
    intro: [
      "You cannot read the present cycle without knowing the ones before it. This shelf is the narrative history of markets — the great trades, the catastrophic blow-ups, and the recurring anatomy of bubbles — told well enough to actually stick.",
      "The Big Short and The Snowball turn contrarian conviction and lifelong compounding into stories; When Genius Failed is the leverage cautionary tale; Kindleberger's Manias, Panics, and Crashes gives you the four-century pattern; and Malkiel's A Random Walk makes you argue the other side. Together they are the context behind every macro call the superinvestors make.",
    ],
  },
  {
    group: "Valuation",
    slug: "valuation",
    h1: "The best books on valuing a stock",
    title: "The Best Valuation Books — how to value a stock",
    description:
      "The best books on valuing a business: Damodaran's DCF references, Pat Dorsey on economic moats and reading financials, and the professional valuation texts behind any conviction score.",
    intro: [
      "At some point every thesis comes down to a number: what is this business worth, and is the market offering it for less? This shelf teaches the discipline of putting that number on paper — from the plain-language entry points to the professional's DCF bible.",
      "Damodaran is the reference (start with The Little Book of Valuation, graduate to Investment Valuation); Pat Dorsey's Five Rules and moat book teach you to read a company's quality from its financials; and the McKinsey Valuation text is the deep end. This is the analytical machinery behind every ConvictionScore on the site.",
    ],
  },
];

const BY_SLUG = new Map(GROUP_META.map((g) => [g.slug, g]));

/** Look up a shelf's metadata by URL slug. */
export function groupMetaBySlug(slug: string): GroupMeta | undefined {
  return BY_SLUG.get(slug);
}

/** All books in a group, in canon order. */
export function booksInGroup(group: BookGroup): Book[] {
  return BOOKS.filter((b) => b.group === group);
}

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
  process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || "holdlens-20";

// Audible Premium Plus free-trial BOUNTY link — a flat ~$5-15 bounty per
// qualified trial (far higher $/click than ~4.5% on a book). MUST be an operator
// SiteStripe-generated link (linkCode/linkId attribution); a hand-built ?tag=
// Audible URL earns $0. Regenerated 2026-07-27 under holdlens's OWN tracking ID
// (was https://amzn.to/4e5EMgF — the fleet-shared short link resolving to
// tag=global074-20, which made every bounty untraceable to the earning site).
export const AUDIBLE_URL =
  process.env.NEXT_PUBLIC_AUDIBLE_URL ||
  "https://www.amazon.com/hz/audible/arya/mlp?purchaseType=MTRIAL&linkCode=ll2&tag=holdlens-20&linkId=b2894376c47827fee26909adc1c3a55d&language=en_US&ref_=as_li_ss_tl";

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
