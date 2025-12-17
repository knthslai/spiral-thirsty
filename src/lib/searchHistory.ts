/**
 * LocalStorage utilities for managing search history
 */

import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from "./storageUtils";

const STORAGE_KEY = "drink-search-history";
const MAX_HISTORY_ITEMS = 10;

/**
 * Get search history from localStorage
 * @returns Array of previous search terms (most recent first)
 */
export function getSearchHistory(): string[] {
  const history = getStorageItem<string[]>(STORAGE_KEY);
  return Array.isArray(history) ? history : [];
}

/**
 * Add a search term to history
 * Removes duplicates and keeps only the most recent MAX_HISTORY_ITEMS
 * @param searchTerm - Search term to add
 */
export function addToSearchHistory(searchTerm: string): void {
  const trimmed = searchTerm.trim();
  if (!trimmed) {
    return;
  }

  const history = getSearchHistory();

  // Remove if already exists (to move to top)
  const filtered = history.filter(
    (term) => term.toLowerCase() !== trimmed.toLowerCase()
  );

  // Add to beginning (most recent first)
  const updated = [trimmed, ...filtered].slice(0, MAX_HISTORY_ITEMS);

  setStorageItem(STORAGE_KEY, updated);
}

/**
 * Clear search history
 */
export function clearSearchHistory(): void {
  removeStorageItem(STORAGE_KEY);
}
