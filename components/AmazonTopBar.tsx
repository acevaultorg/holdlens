// AmazonTopBar — Amili Kit Amazon ad, top-of-page placement (Paulo card
// mumlcoqwh2pkpm, 2026-09-29: "Add Amili Amazon affiliate kitt topbar asap").
//
// Same design contract as the fleet's Amili Kit top card shipped 2026-09-28 to
// cabinpets/watchspecdb/readstacks/mybookpdf/stickyidea/dormbyschool/visitwhen/
// sourdoughhydration/espressospecdb (tooling/fleet-kit/amazon-ad — VENDORED
// pattern, adapted to this Next.js/Tailwind codebase rather than the raw
// vanilla-CSS injector those static sites use): "Sponsored · affiliate link"
// label always visible, an info disclosure, no price/stars/Prime badge (this
// site has no Creators API credentials wired, so it renders the kit's own
// compliant no-API fallback: our own name + our own benefit line + a CTA —
// never fabricated). Links resolve through resolveAmazonUrl() -> the site's
// existing gated /go/dp (functions/go/[[path]].ts, tag holdlens-20) — the same
// resolver InvestingBooks.tsx uses, so there is exactly one link-generation
// path on this site. data-event-from satisfies amazon-tracking-guard.mjs.
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

export default function AmazonTopBar() {
  const books = booksByTitles(PICKS);
  if (books.length === 0) return null;

  return (
    <aside
      aria-label="Sponsored: recommended investing books"
      className="max-w-5xl mx-auto px-6 mt-0 mb-8"
    >
      <div className="rounded-xl border border-border bg-panel/70 px-4 py-3 sm:px-5 sm:py-4">
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
            <div className="absolute right-0 z-10 mt-1 w-64 rounded-lg border border-border bg-panel p-3 text-[11px] leading-relaxed text-dim shadow-lg">
              As an Amazon Associate, HoldLens earns from qualifying purchases at
              no extra cost to you. These are books we genuinely recommend for
              understanding how superinvestors think. Not investment advice.
            </div>
          </details>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {books.map((b) => {
            const { url } = resolveAmazonUrl(b);
            return (
              <a
                key={b.title}
                href={url}
                target="_blank"
                rel="noopener sponsored nofollow"
                data-event-from="amazon-topbar"
                className="plausible-event-name=Book+Click plausible-event-title=amazon-topbar flex items-center gap-3 rounded-lg border border-border bg-bg/50 px-3 py-2.5 hover:border-brand/40 transition min-h-[44px]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-text leading-snug truncate">
                    {b.title}
                  </span>
                  <span className="block text-[11px] text-muted truncate">
                    {b.author}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-brand px-3 py-1.5 text-[11px] font-semibold text-black whitespace-nowrap">
                  See on Amazon
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
