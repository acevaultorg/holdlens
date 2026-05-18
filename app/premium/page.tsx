import type { Metadata } from "next";
import Link from "next/link";

// /premium — repurposed 2026-05-19 per operator directive: "remove all pro
// stuff. we give all for free to anyone."
//
// Page preserved (not 404'd) so inbound links + SEO results redirect to
// the "everything is free" message. Permanent canonical redirect alternative
// would lose the indexed surface; instead we keep the URL with an honest
// "no premium tier right now" message that links to /pricing.

export const metadata: Metadata = {
  title: "Premium features — all free at HoldLens",
  description:
    "Every HoldLens feature is currently free for everyone. There is no premium / Pro tier at this stage. ConvictionScore, signal dossiers, JSON API, CSV exports, daily insider feed — all open access.",
  alternates: { canonical: "https://holdlens.com/pricing" },
  robots: { index: false, follow: true },
};

export default function PremiumPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-3">
        Premium
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-6">
        There&apos;s no premium tier — everything is free.
      </h1>

      <p className="text-muted text-lg leading-relaxed mb-6">
        HoldLens is in growth-first mode. Every feature is currently open to everyone.
        ConvictionScore rankings, signal dossiers, 30 superinvestor portfolios, daily
        insider feed, JSON API, CSV exports — all free, no paywall, no sign-up wall.
      </p>

      <p className="text-muted leading-relaxed mb-10">
        We may introduce optional paid tiers later — when the audience is big enough
        that monetization makes sense without compromising free access for everyone
        else. For now: <Link href="/pricing" className="text-brand underline">read the pricing page</Link>{" "}
        for the full &ldquo;why free&rdquo; explanation, or just{" "}
        <Link href="/scores" className="text-brand underline">jump to the ConvictionScore rankings</Link>.
      </p>

      <section className="rounded-card border border-border bg-surface p-5 mb-8">
        <h2 className="text-base font-bold text-text mb-2">Start here</h2>
        <ul className="space-y-1.5 text-sm">
          <li>→ <Link href="/scores" className="text-brand underline">ConvictionScore rankings</Link></li>
          <li>→ <Link href="/best-now" className="text-brand underline">Most-bought + most-sold this quarter</Link></li>
          <li>→ <Link href="/today" className="text-brand underline">Daily insider + 8-K feed</Link></li>
          <li>→ <Link href="/api/v1/" className="text-brand underline">JSON API</Link></li>
        </ul>
      </section>

      <p className="text-xs text-dim pt-6 border-t border-border leading-relaxed">
        Not investment advice. Sourced from public SEC EDGAR filings. See{" "}
        <Link href="/methodology" className="text-brand underline">methodology</Link>.
      </p>
    </div>
  );
}
