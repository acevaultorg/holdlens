import type { ReactNode } from "react";

// ReadingFaq — the visible "Common questions" block on the /reading pages plus
// its matching FAQPage JSON-LD. Every answer is built by the caller from
// data/books.ts (titles, authors, the editorial `why` line, shelf order), so the
// structured data can never say more than the page does. `text` is the plain
// version of `answer` used in the JSON-LD; keep the two saying the same thing.
// Server component, zero JS.

export type FaqItem = { q: string; answer: ReactNode; text: string };

export default function ReadingFaq({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.text },
    })),
  };
  return (
    <section className="mb-10" aria-labelledby="reading-faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 id="reading-faq" className="text-lg md:text-xl font-bold mb-4 pb-2 border-b border-border">
        Common questions
      </h2>
      <div className="space-y-6">
        {items.map((it) => (
          <div key={it.q}>
            <h3 className="font-semibold text-text mb-1.5">{it.q}</h3>
            <div className="text-sm text-muted leading-relaxed">{it.answer}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
