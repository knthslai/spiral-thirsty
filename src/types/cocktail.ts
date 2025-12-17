/**
 * Type definitions for TheCocktailDB API responses and normalized application types
 */

/**
 * Raw API Response Types
 * These types match the exact structure returned by TheCocktailDB API
 */

/**
 * Raw drink object from TheCocktailDB API
 * Ingredients and measures are stored in numbered fields (strIngredient1-15, strMeasure1-15)
 */
export interface CocktailDBDrink {
  idDrink: string;
  strDrink: string;
  strDrinkAlternate: string | null;
  strTags: string | null;
  strVideo: string | null;
  strCategory: string | null;
  strIBA: string | null;
  strAlcoholic: string | null;
  strGlass: string | null;
  strInstructions: string | null;
  strInstructionsES: string | null;
  strInstructionsDE: string | null;
  strInstructionsFR: string | null;
  strInstructionsIT: string | null;
  'strInstructionsZH-HANS': string | null;
  'strInstructionsZH-HANT': string | null;
  strDrinkThumb: string | null;
  strIngredient1: string | null;
  strIngredient2: string | null;
  strIngredient3: string | null;
  strIngredient4: string | null;
  strIngredient5: string | null;
  strIngredient6: string | null;
  strIngredient7: string | null;
  strIngredient8: string | null;
  strIngredient9: string | null;
  strIngredient10: string | null;
  strIngredient11: string | null;
  strIngredient12: string | null;
  strIngredient13: string | null;
  strIngredient14: string | null;
  strIngredient15: string | null;
  strMeasure1: string | null;
  strMeasure2: string | null;
  strMeasure3: string | null;
  strMeasure4: string | null;
  strMeasure5: string | null;
  strMeasure6: string | null;
  strMeasure7: string | null;
  strMeasure8: string | null;
  strMeasure9: string | null;
  strMeasure10: string | null;
  strMeasure11: string | null;
  strMeasure12: string | null;
  strMeasure13: string | null;
  strMeasure14: string | null;
  strMeasure15: string | null;
  strImageSource: string | null;
  strImageAttribution: string | null;
  strCreativeCommonsConfirmed: string | null;
  dateModified: string | null;
}

/**
 * Response wrapper from TheCocktailDB API
 * The drinks field can be null if no results are found
 */
export interface CocktailDBResponse {
  drinks: CocktailDBDrink[] | null;
}

/**
 * Normalized Application Types
 * These types represent clean, normalized data structures for use in the application
 */

/**
 * Normalized ingredient with converted measurements
 * All amounts are normalized to milliliters (ml)
 */
export interface Ingredient {
  name: string;
  amount: number; // Amount in milliliters
  unit: 'ml';
  originalMeasure: string | null; // Original measurement string from API for display
}

/**
 * Minimal drink information for list view
 */
export interface DrinkListItem {
  id: string;
  name: string;
  image: string | null;
}

/**
 * Full drink details for detail page
 */
export interface Drink {
  id: string;
  name: string;
  image: string | null;
  instructions: string | null;
  ingredients: Ingredient[];
  glass: string | null;
  category: string | null;
  alcoholic: string | null;
}

/**
 * Type guard to check if API response has drinks
 */
export function hasDrinks(
  response: CocktailDBResponse
): response is { drinks: CocktailDBDrink[] } {
  return response.drinks !== null && Array.isArray(response.drinks);
}

