// ShareStrip — pre-filled social-sharing buttons for high-signal content
// (handbook, methodology, learn/* pieces). Each button opens a share dialog
// with the page title + URL pre-composed so a single click posts the piece.
//
// Why it matters: the compound payoff of long-form SEO content is dominated
// by the small number of pieces that hit the front page of HN, reach the top
// of r/investing, or go viral on X. The cost of friction between
// "I want to share this" and "it's shared" is measurable — every extra step
// loses a meaningful percentage of intent. A zero-click-overhead share row
// makes the difference between one share and thirty.
//
// Server component, no JS, no trackers. Opens share dialogs in a new tab.
//
// v1.12 — "Twitter" is dead, long live "X". All user-facing copy says X;
// we use x.com/intent/post (the current canonical URL Elon shipped after
// the rebrand). twitter.com/intent/tweet still redirects but x.com is the
// real surface — keeping us off the legacy domain avoids the brief redirect
// flicker users see when clicking the share link. Hover colors also
// normalized to neutral text — colored hovers violated the design system
// (emerald reserved for BUY signals; rose for SELL; amber for brand).

type Props = {
  title: string;
  url: string; // absolute, https://holdlens.com/...
  via?: string; // X @handle (formerly Twitter)
};

export default function ShareStrip({ title, url, via = "holdlens" }: Props) {
  const encTitle = encodeURIComponent(title);
  const encUrl = encodeURIComponent(url);

  const x = `https://x.com/intent/post?text=${encTitle}&url=${encUrl}&via=${encodeURIComponent(via)}`;
  const reddit = `https://www.reddit.com/submit?url=${encUrl}&title=${encTitle}`;
  const hn = `https://news.ycombinator.com/submitlink?u=${encUrl}&t=${encTitle}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`;
  const email = `mailto:?subject=${encTitle}&body=${encTitle}%20%E2%80%94%20${encUrl}`;

  const buttons: { label: string; href: string }[] = [
    { label: "Share on X", href: x },
    { label: "Post to Reddit", href: reddit },
    { label: "Submit to HN", href: hn },
    { label: "Share on LinkedIn", href: linkedin },
    { label: "Email", href: email },
  ];

  return (
    <div className="my-10 flex items-center gap-x-3 gap-y-2 flex-wrap rounded-xl border border-border bg-panel/40 px-5 py-3 text-[12px]">
      <span className="text-dim font-semibold uppercase tracking-wider mr-1">
        Share
      </span>
      {buttons.map((b) => (
        <a
          key={b.label}
          href={b.href}
          target="_blank"
          rel="noopener noreferrer"
          // Tagged Plausible event — fires "Share Click" with platform prop.
          // Which surfaces actually drive viral loop becomes measurable.
          className={`plausible-event-name=Share+Click plausible-event-platform=${b.label.replace(/\s+/g, "+")} text-muted transition hover:text-text`}
        >
          {b.label}
        </a>
      ))}
    </div>
  );
}
