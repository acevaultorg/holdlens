import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import FoundersNudge from "@/components/FoundersNudge";
import BrokerCta from "@/components/BrokerCta";
import { STYLES, styleCounts, managersByStyle } from "@/lib/manager-styles";
import { MANAGERS } from "@/lib/managers";

export const metadata: Metadata = {
  title: "Superinvestors by investing style — value, growth, activist, macro, long-short",
  description: "30 tracked superinvestors clustered by investing style. Value (Buffett, Klarman), growth (Coleman, Smith), activist (Ackman, Icahn), macro (Druckenmiller, Tepper), long-short (Einhorn, Halvorsen) and more. Free.",
  alternates: { canonical: "https://holdlens.com/managers-by-style/" },
  openGraph: {
    title: "Superinvestors by investing style — HoldLens",
    description: "30 superinvestors clustered into 7 investing styles. Each style has its own ConvictionScore behavior; this taxonomy shows you which managers think alike.",
    url: "https://holdlens.com/managers-by-style/",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — superinvestors by style" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Superinvestors by investing style",
    description: "30 superinvestors. 7 styles. Value, growth, activist, macro, long-short, contrarian, special-situations.",
    images: ["/og/home.png"],
  },
};

const BREADCRUMB_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
    { "@type": "ListItem", position: 2, name: "Managers by style", item: "https://holdlens.com/managers-by-style/" },
  ],
};

const COLLECTION_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Superinvestors by investing style",
  description: "Cluster view of 30 tracked superinvestors organized into 7 distinct investing styles. Each cluster groups managers whose ConvictionScore-driving philosophy and observable behavior put them in the same style camp.",
  url: "https://holdlens.com/managers-by-style/",
  inLanguage: "en-US",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: STYLES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://holdlens.com/managers-by-style/${s.slug}/`,
      name: `${s.name} investors`,
    })),
  },
};

export default function ManagersByStyleHub() {
  const rows = styleCounts();

  return (
    <div className="max-w-4xl mx-auto px-8 sm:px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(COLLECTION_LD) }} />

      <a href="/" className="text-xs text-muted hover:text-text">← HoldLens</a>

      <header className="mt-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
          Superinvestors by style
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          {MANAGERS.length} superinvestors, {rows.length} distinct investing styles
        </h1>
        <p className="text-muted text-lg mt-4 leading-relaxed">
          ConvictionScore tells you <em>what</em> each manager is buying. Style tells you <em>why</em>. A value investor's 7% position is a different signal than a long-short manager's 7% — both are conviction, but they answer to different math. Below: every tracked manager grouped by their dominant style. Click through to see which managers cluster together and which positions are signal-by-style.
        </p>
      </header>

      <section className="mt-12">
        <ul className="grid gap-4 sm:grid-cols-2">
          {rows.map(({ style, count }) => {
            const managers = managersByStyle(style.slug);
            return (
              <li key={style.slug}>
                <Link
                  href={`/managers-by-style/${style.slug}/`}
                  className="block rounded-2xl border border-border bg-panel p-6 hover:border-brand transition group"
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <h2 className="text-2xl font-bold text-text group-hover:text-brand">
                      {style.name}
                    </h2>
                    <span className="text-sm text-dim font-mono tabular-nums">
                      {count} {count === 1 ? "manager" : "managers"}
                    </span>
                  </div>
                  <p className="text-sm text-muted leading-relaxed mb-3">{style.description}</p>
                  <p className="text-xs text-dim">
                    Examples: {managers.slice(0, 3).map((m) => m.name).join(" · ")}
                    {managers.length > 3 && ` · +${managers.length - 3} more`}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-3">Why style matters for ConvictionScore</h2>
        <div className="rounded-xl border border-border bg-panel p-5 text-sm text-muted leading-relaxed space-y-3">
          <p>
            ConvictionScore is style-agnostic by construction — it only sees position size, multi-quarter trend, and consensus across managers. But the <em>signal value</em> of a given ConvictionScore varies by style:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              A <strong className="text-text">value</strong> manager's 8% position is built over years and rarely trimmed; high signal, slow decay.
            </li>
            <li>
              A <strong className="text-text">long-short</strong> manager's 8% long is half the story — the matched short matters too; signal needs context.
            </li>
            <li>
              An <strong className="text-text">activist</strong> 8% is a pre-announcement of a corporate-action thesis; high signal, time-bounded.
            </li>
            <li>
              A <strong className="text-text">macro</strong> manager's 8% equity position is unusual; macros usually express via futures and FX, so an 8% stock is a louder commitment.
            </li>
          </ul>
          <p>
            Reading positions through the style lens beats reading them as commodity holdings.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">Related</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <a href="/investor/" className="rounded-xl border border-border bg-panel p-4 hover:border-brand transition block">
            <div className="text-brand text-xs uppercase tracking-widest font-bold mb-1">All managers</div>
            <div className="font-semibold text-text">Per-investor portfolio detail — full 13F holdings</div>
            <div className="text-xs text-muted mt-1">All {MANAGERS.length} tracked managers, individual pages.</div>
          </a>
          <a href="/grand/" className="rounded-xl border border-border bg-panel p-4 hover:border-brand transition block">
            <div className="text-brand text-xs uppercase tracking-widest font-bold mb-1">Top consensus</div>
            <div className="font-semibold text-text">Weighted-consensus tickers across all managers</div>
            <div className="text-xs text-muted mt-1">The names with highest cross-manager conviction.</div>
          </a>
        </div>
      </section>

      <FoundersNudge tone="brand" context="You're browsing the 30 tracked managers grouped by their dominant investing style." />
      <BrokerCta context="Want to follow a manager's style? Open a brokerage account." />
      <AdSlot format="horizontal" />

      <p className="mt-16 text-xs text-dim">
        Style classifications are editorial and reflect the manager&apos;s most-publicly-known posture. Some managers operate across multiple styles; this taxonomy uses the one most observable in their 13F-disclosed long-only equity book.
      </p>
    </div>
  );
}
