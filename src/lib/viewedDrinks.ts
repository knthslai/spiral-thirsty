/**
 * LocalStorage utilities for managing viewed drinks history
 */

import type { DrinkListItem } from "@/types/cocktail";
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  isClient,
} from "./storageUtils";

const STORAGE_KEY = "drink-viewed-history";
const MAX_VIEWED_ITEMS = 5;

/**
 * Get viewed drinks history from localStorage
 * @returns Array of viewed drinks (most recent first)
 */
export function getViewedDrinks(): DrinkListItem[] {
  const history = getStorageItem<DrinkListItem[]>(STORAGE_KEY);
  return Array.isArray(history) ? history : [];
}

/**
 * Add a drink to viewed history
 * Removes duplicates and keeps only the most recent MAX_VIEWED_ITEMS
 * @param drink - Drink to add
 */
export function addToViewedDrinks(drink: DrinkListItem): void {
  if (!drink || !drink.id || !drink.name) {
    return;
  }

  const history = getViewedDrinks();

  // Remove if already exists (to move to top)
  const filtered = history.filter((item) => item.id !== drink.id);

  // Add to beginning (most recent first)
  const updated = [drink, ...filtered].slice(0, MAX_VIEWED_ITEMS);

  setStorageItem(STORAGE_KEY, updated);

  // Dispatch custom event for same-window updates
  if (isClient()) {
    window.dispatchEvent(new Event("viewedDrinksUpdated"));
  }
}

/**
 * Clear viewed drinks history
 */
export function clearViewedDrinks(): void {
  removeStorageItem(STORAGE_KEY);
}
