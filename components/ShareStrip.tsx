// ShareStrip — pre-filled social-sharing buttons for high-signal content
// (handbook, methodology, learn/* pieces). Each button opens a share dialog
// with the page title + URL pre-composed so a single click posts the piece.
//
// Why it matters: the compound payoff of long-form SEO content is dominated
// by the small number of pieces that hit the front page of HN, reach the top
// of r/investing, or go viral on Twitter. The cost of friction between
// "I want to share this" and "it's shared" is measurable — every extra step
// loses a meaningful percentage of intent. A zero-click-overhead share row
// makes the difference between one share and thirty.
//
// Server component, no JS, no trackers. Opens share dialogs in a new tab.

type Props = {
  title: string;
  url: string; // absolute, https://holdlens.com/...
  via?: string; // Twitter @handle
};

export default function ShareStrip({ title, url, via = "holdlens" }: Props) {
  const encTitle = encodeURIComponent(title);
  const encUrl = encodeURIComponent(url);

  const twitter = `https://twitter.com/intent/tweet?text=${encTitle}&url=${encUrl}&via=${encodeURIComponent(via)}`;
  const reddit = `https://www.reddit.com/submit?url=${encUrl}&title=${encTitle}`;
  const hn = `https://news.ycombinator.com/submitlink?u=${encUrl}&t=${encTitle}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`;
  const email = `mailto:?subject=${encTitle}&body=${encTitle}%20%E2%80%94%20${encUrl}`;

  const buttons: { label: string; href: string; hoverColor: string }[] = [
    { label: "Share on X", href: twitter, hoverColor: "hover:text-text" },
    { label: "Post to Reddit", href: reddit, hoverColor: "hover:text-rose-400" },
    { label: "Submit to HN", href: hn, hoverColor: "hover:text-brand" },
    { label: "Share on LinkedIn", href: linkedin, hoverColor: "hover:text-emerald-400" },
    { label: "Email", href: email, hoverColor: "hover:text-text" },
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
          className={`text-muted transition ${b.hoverColor}`}
        >
          {b.label}
        </a>
      ))}
    </div>
  );
}
