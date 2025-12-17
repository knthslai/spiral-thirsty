/**
 * LocalStorage utilities for managing search history
 */

const STORAGE_KEY = "drink-search-history";
const MAX_HISTORY_ITEMS = 10;

/**
 * Get search history from localStorage
 * @returns Array of previous search terms (most recent first)
 */
export function getSearchHistory(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const history = JSON.parse(stored) as string[];
    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.error("Error reading search history:", error);
    return [];
  }
}

/**
 * Add a search term to history
 * Removes duplicates and keeps only the most recent MAX_HISTORY_ITEMS
 * @param searchTerm - Search term to add
 */
export function addToSearchHistory(searchTerm: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const trimmed = searchTerm.trim();
  if (!trimmed) {
    return;
  }

  try {
    const history = getSearchHistory();

    // Remove if already exists (to move to top)
    const filtered = history.filter(
      (term) => term.toLowerCase() !== trimmed.toLowerCase()
    );

    // Add to beginning (most recent first)
    const updated = [trimmed, ...filtered].slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving search history:", error);
  }
}

/**
 * Clear search history
 */
export function clearSearchHistory(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing search history:", error);
  }
}
