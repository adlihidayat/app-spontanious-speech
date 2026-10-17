/**
 * Text normalization utilities for ASR evaluation (WER / CER)
 * Standardizes Indonesian text by removing punctuation, lowercasing, and normalizing spaces.
 */

export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    // Replace hyphens and dashes with spaces (e.g. "ikut-ikutan" -> "ikut ikutan")
    .replace(/[-_–—]/g, ' ')
    // Remove all punctuation and symbols except alphanumerics and whitespace
    .replace(/[^\w\s\u00C0-\u017F]/gi, ' ')
    // Collapse multiple whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tokenize string into array of normalized words
 */
export function tokenizeWords(text: string): string[] {
  const normalized = normalizeText(text);
  return normalized ? normalized.split(' ') : [];
}
