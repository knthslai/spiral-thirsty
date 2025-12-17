/**
 * API integration for TheCocktailDB
 * All API calls are centralized here
 */

import type { CocktailDBResponse, CocktailDBDrink } from "@/types/cocktail";

/**
 * Base URL for TheCocktailDB API
 */
const API_BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1";

/**
 * Search for drinks by name
 * @param query - Search query string
 * @returns Promise resolving to API response with drinks array or null
 */
export async function searchDrinks(query: string): Promise<CocktailDBResponse> {
  if (!query.trim()) {
    return { drinks: null };
  }

  const url = `${API_BASE_URL}/search.php?s=${encodeURIComponent(query.trim())}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data: CocktailDBResponse = await response.json();
    return data;
  } catch (error) {
    // Per requirements: network error handling is not required
    // Return empty response on error
    console.error("Error fetching drinks:", error);
    return { drinks: null };
  }
}

/**
 * Get a single drink by ID
 * @param id - Drink ID
 * @returns Promise resolving to API response with drinks array (single item) or null
 */
export async function getDrinkById(id: string): Promise<CocktailDBResponse> {
  if (!id.trim()) {
    return { drinks: null };
  }

  const url = `${API_BASE_URL}/lookup.php?i=${encodeURIComponent(id.trim())}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data: CocktailDBResponse = await response.json();
    return data;
  } catch (error) {
    // Per requirements: network error handling is not required
    // Return empty response on error
    console.error("Error fetching drink:", error);
    return { drinks: null };
  }
}

/**
 * Helper function to get the first drink from a response, or null if not found
 * Useful for getDrinkById which returns a single drink in the array
 */
export function getFirstDrink(
  response: CocktailDBResponse
): CocktailDBDrink | null {
  if (!response.drinks || response.drinks.length === 0) {
    return null;
  }
  return response.drinks[0];
}
