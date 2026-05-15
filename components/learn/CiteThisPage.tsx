"use client";

import { useEffect, useState } from "react";

// Self-configuring "Cite this page" widget for /learn articles.
//
// Renders copy-paste-ready citation blocks in 3 formats:
//   - Wikipedia / MediaWiki {{cite web}} template
//   - APA 7th edition
//   - MLA 9th edition
//
// Why this exists (per Wikipedia WP:EL + WP:CITE guideline analysis):
// Wikipedia editors look for "Cite this page" patterns on reference-type
// sites — its presence signals the publisher welcomes reference use AND
// lowers their friction. Editors are markedly more likely to cite a page
// that makes citation 1-click than one where they must assemble {{cite
// web}} parameters from page metadata themselves.
//
// Zero props by design: the component derives URL from window.location,
// title from <title> stripped of suffix, and dates from the page's
// JSON-LD Article schema (already present on every /learn page per the
// AUTHOR_SCHEMA pattern). Add to any /learn page with: <CiteThisPage />
//
// Server-render fallback: while JS hydrates, the component renders a
// minimal scaffold (no copy buttons) so it doesn't flash empty. After
// hydration, the populated formats appear.
export default function CiteThisPage() {
  const [meta, setMeta] = useState<{
    url: string;
    title: string;
    publisher: string;
    datePublished: string;
    dateModified: string;
    accessDate: string;
  } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    // Strip the " · HoldLens" or " — HoldLens" suffix that layout.tsx appends
    const fullTitle = document.title;
    const cleaned = fullTitle
      .replace(/\s*[·—|]\s*HoldLens\s*$/, "")
      .replace(/\s*—\s*Plain English guide for retail investors\s*/, "")
      .trim();

    // Strip query string + fragment from URL for canonical reference
    const url = window.location.href.split("?")[0].split("#")[0];

    // Read dates from JSON-LD Article schema embedded in the page
    let datePublished = "";
    let dateModified = "";
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const s of jsonLdScripts) {
      try {
        const data = JSON.parse(s.textContent || "[]");
        const arr = Array.isArray(data) ? data : [data];
        for (const item of arr) {
          if (item && (item["@type"] === "Article" || (Array.isArray(item["@type"]) && item["@type"].includes("Article")))) {
            if (item.datePublished && !datePublished) datePublished = String(item.datePublished).slice(0, 10);
            if (item.dateModified && !dateModified) dateModified = String(item.dateModified).slice(0, 10);
          }
        }
      } catch {
        // ignore unparseable JSON-LD
      }
    }

    setMeta({
      url,
      title: cleaned,
      publisher: "HoldLens",
      datePublished: datePublished || "",
      dateModified: dateModified || "",
      accessDate: new Date().toISOString().slice(0, 10),
    });
  }, []);

  function copy(text: string, kind: string) {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(kind);
        setTimeout(() => setCopied(null), 2000);
      },
      () => {
        setCopied("manual");
        setTimeout(() => setCopied(null), 3000);
      }
    );
  }

  if (!meta) {
    // Server-render + pre-hydration scaffold
    return (
      <section className="mt-12 pt-6 border-t border-border">
        <h2 className="text-sm font-semibold text-text mb-3 uppercase tracking-widest">
          Cite this page
        </h2>
        <p className="text-xs text-muted leading-relaxed">
          Researchers, journalists, and Wikipedia editors — citation formats load with the page.
          HoldLens content is freely available for reference; please cite.
        </p>
      </section>
    );
  }

  const wikitext = `{{cite web |url=${meta.url} |title=${meta.title} |publisher=${meta.publisher}${
    meta.datePublished ? ` |date=${meta.datePublished}` : ""
  } |access-date=${meta.accessDate}}}`;

  const apa = `${meta.publisher}. (${meta.datePublished ? meta.datePublished.slice(0, 4) : "n.d."}). ${meta.title}. Retrieved ${meta.accessDate}, from ${meta.url}`;

  const mla = `"${meta.title}." ${meta.publisher}, ${meta.datePublished || "n.d."}, ${meta.url}. Accessed ${meta.accessDate}.`;

  return (
    <section className="mt-12 pt-6 border-t border-border">
      <h2 className="text-sm font-semibold text-text mb-3 uppercase tracking-widest">
        Cite this page
      </h2>
      <p className="text-xs text-muted mb-4 leading-relaxed">
        Researchers, journalists, and Wikipedia editors — copy the format that fits your use.
        HoldLens content is freely available for reference; please cite.
      </p>

      <details className="mb-3 group">
        <summary className="cursor-pointer text-sm text-text font-medium hover:text-brand">
          Wikipedia / MediaWiki {`{{cite web}}`}
        </summary>
        <div className="mt-2 relative">
          <pre className="text-xs bg-panel border border-border rounded p-3 overflow-x-auto whitespace-pre-wrap break-all text-muted">
            {wikitext}
          </pre>
          <button
            type="button"
            onClick={() => copy(wikitext, "wiki")}
            className="absolute top-2 right-2 text-xs px-2 py-1 bg-bg border border-border rounded hover:border-brand text-muted hover:text-text"
            aria-label="Copy Wikipedia cite-web template"
          >
            {copied === "wiki" ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </details>

      <details className="mb-3 group">
        <summary className="cursor-pointer text-sm text-text font-medium hover:text-brand">
          APA 7th
        </summary>
        <div className="mt-2 relative">
          <pre className="text-xs bg-panel border border-border rounded p-3 overflow-x-auto whitespace-pre-wrap break-words text-muted">
            {apa}
          </pre>
          <button
            type="button"
            onClick={() => copy(apa, "apa")}
            className="absolute top-2 right-2 text-xs px-2 py-1 bg-bg border border-border rounded hover:border-brand text-muted hover:text-text"
            aria-label="Copy APA 7th citation"
          >
            {copied === "apa" ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </details>

      <details className="mb-3 group">
        <summary className="cursor-pointer text-sm text-text font-medium hover:text-brand">
          MLA 9th
        </summary>
        <div className="mt-2 relative">
          <pre className="text-xs bg-panel border border-border rounded p-3 overflow-x-auto whitespace-pre-wrap break-words text-muted">
            {mla}
          </pre>
          <button
            type="button"
            onClick={() => copy(mla, "mla")}
            className="absolute top-2 right-2 text-xs px-2 py-1 bg-bg border border-border rounded hover:border-brand text-muted hover:text-text"
            aria-label="Copy MLA 9th citation"
          >
            {copied === "mla" ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </details>

      <p className="text-xs text-dim mt-4 leading-relaxed">
        Snapshot of this page is archived on the{" "}
        <a
          href={`https://web.archive.org/web/*/${meta.url}`}
          className="underline hover:text-text"
          rel="noopener"
        >
          Internet Archive
        </a>
        . Wikipedia editors can add{" "}
        <code className="text-text">|archive-url=</code> +{" "}
        <code className="text-text">|archive-date=</code> to the {`{{cite web}}`} template.
      </p>
    </section>
  );
}
