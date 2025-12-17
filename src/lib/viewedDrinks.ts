/**
 * LocalStorage utilities for managing viewed drinks history
 */

import type { DrinkListItem } from "@/types/cocktail";

const STORAGE_KEY = "drink-viewed-history";
const MAX_VIEWED_ITEMS = 5;

/**
 * Get viewed drinks history from localStorage
 * @returns Array of viewed drinks (most recent first)
 */
export function getViewedDrinks(): DrinkListItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const history = JSON.parse(stored) as DrinkListItem[];
    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.error("Error reading viewed drinks history:", error);
    return [];
  }
}

/**
 * Add a drink to viewed history
 * Removes duplicates and keeps only the most recent MAX_VIEWED_ITEMS
 * @param drink - Drink to add
 */
export function addToViewedDrinks(drink: DrinkListItem): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!drink || !drink.id || !drink.name) {
    return;
  }

  try {
    const history = getViewedDrinks();

    // Remove if already exists (to move to top)
    const filtered = history.filter((item) => item.id !== drink.id);

    // Add to beginning (most recent first)
    const updated = [drink, ...filtered].slice(0, MAX_VIEWED_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch custom event for same-window updates
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("viewedDrinksUpdated"));
    }
  } catch (error) {
    console.error("Error saving viewed drinks history:", error);
  }
}

/**
 * Clear viewed drinks history
 */
export function clearViewedDrinks(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing viewed drinks history:", error);
  }
}
