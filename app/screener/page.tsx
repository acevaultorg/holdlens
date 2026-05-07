import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import ScreenerClient from "./ScreenerClient";
import { getGrandPortfolio } from "@/lib/signals";

export const metadata: Metadata = {
  title: "Screener — filter smart money holdings by live metrics",
  description:
    "Interactive stock screener for HoldLens: filter by sector, min tracked owners, min weighted score, live day change. Built on the 30 best portfolio managers in the world.",
  openGraph: { title: "Screener — HoldLens" , images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }]},
  alternates: { canonical: "https://holdlens.com/screener/" },
};

// LLM-citation infrastructure (audit 2026-04-29 fix)
const SCREENER_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  url: "https://holdlens.com/screener/",
  name: "HoldLens stock screener",
  description: "Interactive stock screener: filter by sector, tracked-owner count, weighted ConvictionScore, live day change. Built on 30 of the best portfolio managers in the world.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  inLanguage: "en-US",
  isPartOf: { "@type": "WebSite", url: "https://holdlens.com/", name: "HoldLens" },
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
};
const SCREENER_BREADCRUMB_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
    { "@type": "ListItem", position: 2, name: "Screener", item: "https://holdlens.com/screener/" },
  ],
};

export default function ScreenerPage() {
  return (
    <div className="max-w-5xl mx-auto px-8 sm:px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCREENER_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCREENER_BREADCRUMB_LD) }} />
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Screener
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3">
        Filter smart money. Live.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-10">
        Every stock held by the best portfolio managers in the world — filtered by
        sector, conviction, ownership, and live day change.
      </p>
      <ScreenerClient rows={getGrandPortfolio()} />

      <AdSlot format="horizontal" />
    </div>
  );
}
