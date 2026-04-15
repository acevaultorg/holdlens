// SupportBar — zero-approval revenue path for HoldLens.
//
// Renders a small "support this free tool" footer strip with links to:
//   - Ko-fi     (NEXT_PUBLIC_KOFI_USERNAME)
//   - BuyMeACoffee (NEXT_PUBLIC_BMAC_USERNAME)
//   - Liberapay (NEXT_PUBLIC_LIBERAPAY_USERNAME)
//   - GitHub Sponsors (NEXT_PUBLIC_GITHUB_SPONSORS_USERNAME)
//
// Each platform requires ~5 minutes of operator setup (create account, set
// payout method) and zero platform approval. Unlike AdSense / Amazon, there
// is no review queue — the moment the operator drops any of these env vars
// into the Cloudflare Pages environment and redeploys, the link becomes
// live revenue.
//
// The component renders NOTHING if no env var is set, so it's safe to wire
// into the layout even before the operator has set anything up.

type Platform = {
  key: string;
  label: string;
  buildHref: (username: string) => string;
};

const PLATFORMS: Platform[] = [
  {
    key: "kofi",
    label: "Support on Ko-fi",
    buildHref: (u) => `https://ko-fi.com/${encodeURIComponent(u)}`,
  },
  {
    key: "bmac",
    label: "Buy me a coffee",
    buildHref: (u) => `https://buymeacoffee.com/${encodeURIComponent(u)}`,
  },
  {
    key: "liberapay",
    label: "Support on Liberapay",
    buildHref: (u) => `https://liberapay.com/${encodeURIComponent(u)}`,
  },
  {
    key: "github",
    label: "Sponsor on GitHub",
    buildHref: (u) => `https://github.com/sponsors/${encodeURIComponent(u)}`,
  },
];

function readUsername(key: string): string | undefined {
  // Each NEXT_PUBLIC_* is baked at build time and inlined by webpack.
  // We still reference the full identifier so the static analysis picks them up.
  switch (key) {
    case "kofi":
      return process.env.NEXT_PUBLIC_KOFI_USERNAME;
    case "bmac":
      return process.env.NEXT_PUBLIC_BMAC_USERNAME;
    case "liberapay":
      return process.env.NEXT_PUBLIC_LIBERAPAY_USERNAME;
    case "github":
      return process.env.NEXT_PUBLIC_GITHUB_SPONSORS_USERNAME;
  }
  return undefined;
}

export default function SupportBar() {
  const active = PLATFORMS.flatMap((p) => {
    const u = readUsername(p.key);
    if (!u) return [];
    return [{ ...p, href: p.buildHref(u) }];
  });

  if (active.length === 0) return null;

  return (
    <div className="border-t border-border bg-panel/40">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap text-xs text-dim">
        <div>
          HoldLens is free and will stay free.{" "}
          <span className="text-text">If it saved you time, buy us a coffee.</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {active.map((p) => (
            <a
              key={p.key}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-border bg-bg/60 px-3 py-1.5 text-[11px] font-semibold text-text hover:border-brand/40 hover:text-brand transition"
            >
              {p.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
