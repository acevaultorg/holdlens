import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { STYLES, STYLES_BY_SLUG, managersByStyle, type InvestingStyle } from "@/lib/manager-styles";

type StyleParams = { style: string };

export async function generateStaticParams(): Promise<StyleParams[]> {
  return STYLES.map((s) => ({ style: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<StyleParams>;
}): Promise<Metadata> {
  const { style } = await params;
  const meta = STYLES_BY_SLUG[style as InvestingStyle];
  if (!meta) return { title: "Style not found" };

  const managers = managersByStyle(meta.slug);
  const title = `${meta.name} superinvestors — ${managers.length} tracked on HoldLens`;
  const description = `${managers.length} tracked superinvestors classified as ${meta.name.toLowerCase()} investors. ${meta.signature} Examples: ${managers.slice(0, 3).map((m) => m.name).join(", ")}.`;
  const canonical = `https://holdlens.com/managers-by-style/${meta.slug}/`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: [{ url: "/og/home.png", width: 1200, height: 630, alt: `HoldLens — ${meta.name} investors` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: ["/og/home.png"],
    },
  };
}

export default async function StylePage({ params }: { params: Promise<StyleParams> }) {
  const { style } = await params;
  const meta = STYLES_BY_SLUG[style as InvestingStyle];
  if (!meta) notFound();
  const managers = managersByStyle(meta.slug);
  if (managers.length === 0) notFound();

  const otherStyles = STYLES.filter((s) => s.slug !== meta.slug);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
      { "@type": "ListItem", position: 2, name: "Managers by style", item: "https://holdlens.com/managers-by-style/" },
      { "@type": "ListItem", position: 3, name: `${meta.name} investors`, item: `https://holdlens.com/managers-by-style/${meta.slug}/` },
    ],
  };

  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${meta.name} superinvestors`,
    description: meta.description,
    url: `https://holdlens.com/managers-by-style/${meta.slug}/`,
    inLanguage: "en-US",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: managers.map((m, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://holdlens.com/investor/${m.slug}/`,
        name: m.name,
      })),
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />

      <nav className="text-xs text-muted">
        <Link href="/managers-by-style/" className="hover:text-text">All styles</Link>
        <span className="mx-2">→</span>
        <span className="text-text">{meta.name}</span>
      </nav>

      <header className="mt-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
          {meta.name} investing
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          {meta.name} superinvestors: {managers.length} tracked on HoldLens
        </h1>
        <p className="text-muted text-lg mt-4 leading-relaxed">{meta.description}</p>
      </header>

      <section className="mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-5">
            <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-2">
              Signature behavior
            </div>
            <p className="text-sm text-text leading-relaxed">{meta.signature}</p>
          </div>
          <div className="rounded-xl border border-border bg-panel p-5">
            <div className="text-[10px] uppercase tracking-widest text-brand font-bold mb-2">
              How this style differs
            </div>
            <p className="text-sm text-text leading-relaxed">{meta.contrast}</p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Tracked {meta.name.toLowerCase()} investors</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {managers.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/investor/${m.slug}/`}
                className="block rounded-xl border border-border bg-panel p-4 hover:border-brand transition group"
              >
                <div className="font-bold text-text group-hover:text-brand">{m.name}</div>
                <div className="text-xs text-muted mt-1">{m.fund}</div>
                <p className="text-xs text-dim mt-2 line-clamp-2">{m.philosophy}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">Other investing styles</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {otherStyles.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/managers-by-style/${s.slug}/`}
                className="block rounded-xl border border-border bg-panel p-3 text-center hover:border-brand transition"
              >
                <div className="text-sm font-semibold text-text">{s.name}</div>
                <div className="text-[10px] text-dim mt-1">
                  {managersByStyle(s.slug).length} tracked
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-16 pt-8 border-t border-border text-xs text-dim">
        <p>
          Style classifications reflect each manager&apos;s most-publicly-known posture. Some managers operate across multiple styles; this taxonomy uses the one most observable in their 13F-disclosed long-only equity book. Educational only — not investment advice.
        </p>
      </footer>
    </div>
  );
}
