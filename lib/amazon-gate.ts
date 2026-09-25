// Amazon affiliate link gate — shared constants (rules/affiliate-link-gate.md, 2026-09-25).
//
// The Amazon tag no longer appears in the HTML. Pages emit INTERNAL paths
// (/go/dp?a=<ASIN> · /go/s?k=<query> · /go/audible) and functions/go/[[path]].ts
// reattaches the tag and 302s, but only for real browser navigations. A bare HTTP
// client harvesting the HTML gets an untagged bounce home, so scrapers cannot mint
// clicks against the SHARED Associates account. Found by phone QA 2026-09-25:
// holdlens was the one earner still serving raw tag=holdlens-20 links (16 on 3 pages).
//
// This file is the single source for both halves (the page links in data/books.ts
// and the edge function), so the tag can never drift between them.
export const AMAZON_TAG = "holdlens-20";

// Amazon department pin for SEARCH links only (print books). /dp/ and the Audible
// bounty link must NOT carry it.
export const AMAZON_BOOKS_DEPT = "stripbooks";

// Audible Premium Plus free-trial BOUNTY link — operator SiteStripe-generated
// (linkCode/linkId attribution). Redirected to VERBATIM: a rebuilt ?tag= Audible
// URL earns $0, so the gate never edits this string.
export const AUDIBLE_DEST =
  "https://www.amazon.com/hz/audible/arya/mlp?purchaseType=MTRIAL&linkCode=ll2&tag=holdlens-20&linkId=b2894376c47827fee26909adc1c3a55d&language=en_US&ref_=as_li_ss_tl";
