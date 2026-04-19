import { AUTHOR_NAME, AUTHOR_URL } from "@/lib/author";

/**
 * AuthorByline — visible author attribution for /learn articles.
 *
 * Renders "By HoldLens Editorial · Published [date]" with a link back to
 * /about where the editorial philosophy lives. Pairs with Person schema
 * in each article's JSON-LD to satisfy E-E-A-T "Credible" + LLM-citation
 * "Recognizable" characteristics.
 *
 * Place directly under the article h1 + hero paragraph, before the
 * first section h2.
 */
export default function AuthorByline({
  date,
  updated,
}: {
  /** ISO-8601 date the article was first published (e.g. "2026-04-17"). */
  date: string;
  /** Optional ISO date if last-updated differs from first-published. */
  updated?: string;
}) {
  const dateObj = new Date(date);
  const formatted = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const updatedObj = updated ? new Date(updated) : null;
  const updatedFormatted = updatedObj?.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-dim border-y border-border py-3 my-8">
      <span>
        By{" "}
        <a
          href={AUTHOR_URL}
          rel="author"
          className="text-muted hover:text-text underline-offset-2 hover:underline transition"
        >
          {AUTHOR_NAME}
        </a>
      </span>
      <span aria-hidden="true" className="text-border">
        ·
      </span>
      <span>
        Published{" "}
        <time dateTime={date} className="text-muted">
          {formatted}
        </time>
      </span>
      {updatedFormatted && updated !== date && (
        <>
          <span aria-hidden="true" className="text-border">
            ·
          </span>
          <span>
            Updated{" "}
            <time dateTime={updated} className="text-muted">
              {updatedFormatted}
            </time>
          </span>
        </>
      )}
    </div>
  );
}
