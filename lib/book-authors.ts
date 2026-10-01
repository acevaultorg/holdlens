import { MANAGERS } from "@/lib/managers";
import { BOOKS, type Book } from "@/data/books";

// Books on the reading list written by a manager whose 13F we track — matched on
// the author field (first + last name as whole words), so it can't claim
// authorship the data doesn't show. Whole words matter for short names: "Li Lu"
// must not match an author whose name merely contains "Li" and "Lu".
const words = (s: string) => new Set(s.split(/[^\p{L}]+/u).filter(Boolean));

export const BY_TRACKED_MANAGER: { slug: string; name: string; books: Book[] }[] = MANAGERS.map(
  (m) => {
    const parts = m.name.split(" ");
    const first = parts[0]!;
    const last = parts[parts.length - 1]!;
    return {
      slug: m.slug,
      name: m.name,
      books: BOOKS.filter((b) => {
        const w = words(b.author);
        return w.has(first) && w.has(last);
      }),
    };
  },
).filter((x) => x.books.length > 0);

/** The tracked manager who wrote this book, if any. */
export function trackedAuthorOf(book: Book): { slug: string; name: string } | undefined {
  const hit = BY_TRACKED_MANAGER.find((x) => x.books.includes(book));
  return hit ? { slug: hit.slug, name: hit.name } : undefined;
}
