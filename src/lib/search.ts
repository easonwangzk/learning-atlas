export function matchesQuery(text: string, query: string): boolean {
  const haystack = text.normalize("NFKC").toLocaleLowerCase();
  const terms = query.normalize("NFKC").trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return terms.every((term) => haystack.includes(term));
}
