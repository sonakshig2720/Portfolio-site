/** Questions say "Sonakshi" or "she" interchangeably; map the name to the pronoun
 *  so it doesn't dominate the match. Used when building the index and when
 *  embedding a visitor's question. */
export function normalizeQuestion(q: string) {
  return q
    .replace(/\b(sonakshi\s+godavarthy|sonakshi|godavarthy)['’]s\b/gi, "her")
    .replace(/\b(sonakshi\s+godavarthy|sonakshi|godavarthy)\b/gi, "she");
}
