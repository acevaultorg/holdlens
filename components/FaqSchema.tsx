import Script from "next/script";

// <FaqSchema /> — emits a FAQPage JSON-LD block. Google surfaces FAQ
// rich results with expandable Q/A directly in SERP for queries that
// match any of the listed questions — estimated +15% CTR lift on
// informational queries (SimplyWall.St / Investopedia pattern).
//
// Emit on / /about /methodology /vs/dataroma /learn/* — anywhere with
// static "what is…" content that already appears on the page. The
// guideline per Google: the Q/A MUST also appear in the visible page
// copy (don't ship schema-only answers), or Google suppresses it.

export type FaqItem = { q: string; a: string };

export default function FaqSchema({ id, items }: { id: string; items: FaqItem[] }) {
  if (!items.length) return null;
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
  return (
    <Script
      id={id}
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}
