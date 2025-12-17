/**
 * Utility functions for highlighting matching text in search results
 */

/**
 * Highlight matching text in a string
 * Case-insensitive matching with case-preserving highlight
 *
 * @param text - The text to search in
 * @param searchTerm - The search term to highlight
 * @returns Array of text segments with highlight information
 */
export function highlightText(
  text: string,
  searchTerm: string
): Array<{ text: string; highlight: boolean }> {
  if (!searchTerm.trim() || !text) {
    return [{ text, highlight: false }];
  }

  const normalizedText = text.toLowerCase();
  const normalizedSearch = searchTerm.toLowerCase().trim();
  const segments: Array<{ text: string; highlight: boolean }> = [];
  let lastIndex = 0;
  let currentIndex = normalizedText.indexOf(normalizedSearch, lastIndex);

  while (currentIndex !== -1) {
    // Add text before the match
    if (currentIndex > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, currentIndex),
        highlight: false,
      });
    }

    // Add the highlighted match (preserve original case)
    segments.push({
      text: text.substring(
        currentIndex,
        currentIndex + normalizedSearch.length
      ),
      highlight: true,
    });

    lastIndex = currentIndex + normalizedSearch.length;
    currentIndex = normalizedText.indexOf(normalizedSearch, lastIndex);
  }

  // Add remaining text after the last match
  if (lastIndex < text.length) {
    segments.push({
      text: text.substring(lastIndex),
      highlight: false,
    });
  }

  // If no matches found, return the original text
  if (segments.length === 0) {
    return [{ text, highlight: false }];
  }

  return segments;
}
