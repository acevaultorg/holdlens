// AmazonTopBar — Amili Kit Amazon ad, top-of-page placement (Paulo card
// mumlcoqwh2pkpm, 2026-09-29: "Add Amili Amazon affiliate kitt topbar asap").
// Revised 2026-09-29 (cards mumrr01hhc13tj / mumrri4c3o106i) after a live
// iPhone screenshot showed two EMPTY tiles (no cover, no title, just the CTA)
// with the second tile clipped past the box's right edge at phone width.
//
// Root causes fixed:
//  1. Title/author WERE server-rendered text already (never a client fetch),
//     but a `flex items-center gap-3` row with a fixed-width "See on Amazon"
//     pill squeezed the `min-w-0 flex-1` text span toward zero width at
//     ~170px column width — truncate on a near-zero-width flex child can
//     render nothing visible even though the text is in the DOM. Fixed by
//     moving the title into its own full-width "cover" block, so it never
//     shares a row with the CTA.
//  2. No cover — this site has no Creators API credentials, so this always
//     renders the kit's own compliant no-API fallback: a typographic cover
//     (the title on a dark card), never a blank box.
//  3. Overflow at 360/390px — single column below `sm` (was a fixed
//     `grid-cols-2` at every width); every tile is `w-full min-w-0` with no
//     fixed pixel widths, and the tile itself is `overflow-hidden`.
//  4. Missing-data handling — a tile only renders for a title actually found
//     in data/books.ts (booksByTitles silently drops unknown titles); the
//     whole box renders nothing when zero titles resolve.
//
// Same design contract as the fleet's Amili Kit top card shipped 2026-09-28 to
// cabinpets/watchspecdb/readstacks/mybookpdf/stickyidea/dormbyschool/visitwhen/
// sourdoughhydration/espressospecdb (tooling/fleet-kit/amazon-ad — VENDORED
// pattern, adapted to this Next.js/Tailwind codebase rather than the raw
// vanilla-CSS injector those static sites use): "Sponsored · affiliate link"
// label always visible, an info disclosure, no price/stars/Prime badge (never
// fabricated). Links resolve through resolveAmazonUrl() -> the site's existing
// gated /go/dp (functions/go/[[path]].ts, tag holdlens-20) — the same resolver
// InvestingBooks.tsx uses. data-event-from satisfies amazon-tracking-guard.mjs.
//
// FIT (YMYL): HoldLens is a 13F/investing site, so the picks are the two most
// load-bearing books in CORE_CANON (data/books.ts) — never a generic product.
//
// PLACEMENT: after the hero section (search box + CTAs), not above or inside
// it — a slim bar this size added ABOVE the hero risks pushing the hero's own
// search box below the fold at 375px, which the operator explicitly ruled
// out. Placing it immediately after the hero keeps it the first thing below
// the fold rather than buried at the bottom of the page (where the existing
// <InvestingBooks /> editorial block already lives, further down).
import { booksByTitles, resolveAmazonUrl } from "@/data/books";

const PICKS = ["The Intelligent Investor", "Poor Charlie's Almanack"];

// Deterministic per-title gradient so the typographic cover always looks
// intentional (never a flat blank rectangle) without depending on any image.
const COVERS = [
  "from-amber-900/40 via-neutral-900 to-neutral-950",
  "from-emerald-900/40 via-neutral-900 to-neutral-950",
];

export default function AmazonTopBar() {
  const books = booksByTitles(PICKS);
  if (books.length === 0) return null; // both missing -> hide the whole box

  return (
    <aside
      aria-label="Sponsored: recommended investing books"
      className="max-w-5xl mx-auto px-6 mt-0 mb-8"
    >
      <div className="rounded-xl border border-border bg-panel/70 px-4 py-3 sm:px-5 sm:py-4 overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] uppercase tracking-widest text-dim font-semibold">
            Sponsored · affiliate link
          </span>
          <details className="relative">
            <summary
              aria-label="About this ad"
              className="list-none cursor-pointer text-[10px] text-dim underline decoration-dotted min-h-[24px] min-w-[24px] flex items-center justify-end"
            >
              About this ad
            </summary>
            <div className="absolute right-0 z-10 mt-1 w-64 max-w-[80vw] rounded-lg border border-border bg-panel p-3 text-[11px] leading-relaxed text-dim shadow-lg">
              As an Amazon Associate, HoldLens earns from qualifying purchases at
              no extra cost to you. These are books we genuinely recommend for
              understanding how superinvestors think. Not investment advice.
            </div>
          </details>
        </div>
        {/* One column below `sm` (phones), two columns from `sm` up. Every
            tile is w-full + min-w-0 (no fixed pixel widths) so neither the
            grid nor the tile itself can overflow the box at 360/390px. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {books.map((b, i) => {
            const { url } = resolveAmazonUrl(b);
            return (
              <a
                key={b.title}
                href={url}
                target="_blank"
                rel="noopener sponsored nofollow"
                data-event-from="amazon-topbar"
                className="plausible-event-name=Book+Click plausible-event-title=amazon-topbar group flex w-full min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-bg/50 hover:border-brand/40 transition"
              >
                {/* Typographic cover — always renders (no Creators API on
                    this site, so this is the permanent state, not a loading
                    placeholder). Title lives HERE, full width, never
                    squeezed beside the CTA. */}
                <span
                  className={`flex min-h-[64px] w-full items-center justify-center bg-gradient-to-br ${COVERS[i % COVERS.length]} px-3 py-3 text-center`}
                >
                  <span className="line-clamp-2 text-[13px] font-semibold leading-snug text-text">
                    {b.title}
                  </span>
                </span>
                <span className="flex w-full min-w-0 items-center justify-between gap-2 px-3 py-2.5 min-h-[44px]">
                  <span className="min-w-0 truncate text-[11px] text-muted">
                    {b.author}
                  </span>
                  <span className="shrink-0 rounded-full bg-brand px-3 py-1.5 text-[11px] font-semibold text-black whitespace-nowrap">
                    See on Amazon
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
