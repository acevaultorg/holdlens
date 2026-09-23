import type { Metadata } from "next";
import sitemap from "../sitemap";
import { MANAGERS } from "@/lib/managers";
import { TICKER_INDEX } from "@/lib/tickers";
import SiteSearch, { type SearchItem } from "@/components/SiteSearch";

export const metadata: Metadata = {
  title: "Search investors, tickers and guides — HoldLens",
  description: "Find any tracked superinvestor, stock ticker or HoldLens guide.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://holdlens.com/search" },
};

const lc = (x: string) => x.toLowerCase().normalize("NFKD").replace(/[^a-z0-9. ]+/g, " ");

function titleFor(path: string): string {
  const last = path.split("/").filter(Boolean).pop() ?? "";
  return last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function SearchPage() {
  const items: SearchItem[] = [];
  for (const m of MANAGERS) {
    items.push({ u: `/investor/${m.slug}/`, t: m.name, s: `Investor · ${m.fund}`, k: lc(`${m.name} ${m.fund} investor`) });
  }
  for (const t of Object.values(TICKER_INDEX)) {
    items.push({ u: `/ticker/${t.symbol}/`, t: `${t.symbol} · ${t.name}`, s: `Stock · held by ${t.ownerCount} tracked ${t.ownerCount === 1 ? "investor" : "investors"}`, k: lc(`${t.symbol} ${t.name} stock ticker`) });
  }
  const seen = new Set(items.map((i) => i.u));
  const entries = await sitemap();
  for (const e of entries) {
    const p = new URL(e.url).pathname.replace(/\/?$/, "/");
    if (seen.has(p) || /\/q\/|\/ticker\/|\/signal\/|\/stock\//.test(p) || p === "/") continue;
    seen.add(p);
    const t = titleFor(p);
    items.push({ u: p, t, s: p.startsWith("/learn/") ? "Guide" : "Page", k: lc(`${t} ${p.replace(/[/-]/g, " ")}`) });
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Search</h1>
      <p className="text-muted mb-6">{MANAGERS.length} investors, {Object.keys(TICKER_INDEX).length} tickers and every guide.</p>
      <SiteSearch items={items} />
    </div>
  );
}
