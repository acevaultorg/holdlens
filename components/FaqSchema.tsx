// <FaqSchema /> — emits a FAQPage JSON-LD block as a SERVER-RENDERED <script>
// tag so AI crawlers (GPTBot/ClaudeBot/PerplexityBot/Googlebot-Extended) can
// parse it without JS execution.
//
// 2026-05-13 fix: prior impl used next/script with strategy="beforeInteractive"
// which in the app router serializes into __next_f.push() payloads instead of
// emitting a raw <script type="application/ld+json"> in the streamed HTML.
// Live audit found 0 FAQPage tags in production HTML even though 7 Q/A pairs
// were defined on the homepage — schema only appeared inside escaped JSON
// inside the Next.js client-side hydration payload, invisible to non-JS bots.
// Plain <script dangerouslySetInnerHTML> matches the site-wide pattern used
// elsewhere in the app (see app/page.tsx siteWideSchema) and ships in SSR HTML.

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
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}
