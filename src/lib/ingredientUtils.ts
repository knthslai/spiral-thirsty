import type { CocktailDBDrink, Ingredient } from "@/types/cocktail";

/**
 * Conversion factors to milliliters (ml)
 * All measurements will be normalized to ml for consistency
 */
const CONVERSION_TO_ML: Record<string, number> = {
  // Fluid ounces
  oz: 29.5735,
  "fl oz": 29.5735,
  "fluid ounce": 29.5735,
  "fluid ounces": 29.5735,
  // Cups
  cup: 236.588,
  cups: 236.588,
  // Teaspoons
  tsp: 4.92892,
  teaspoon: 4.92892,
  teaspoons: 4.92892,
  // Tablespoons
  tbsp: 14.7868,
  tablespoon: 14.7868,
  tablespoons: 14.7868,
  // Centiliters
  cl: 10,
  centiliter: 10,
  centiliters: 10,
  // Milliliters (already in target unit)
  ml: 1,
  milliliter: 1,
  milliliters: 1,
};

/**
 * Supported unit patterns for regex matching
 */
const UNIT_PATTERNS = Object.keys(CONVERSION_TO_ML)
  .map((unit) => unit.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .join("|");

/**
 * Regex to extract number and unit from measurement string
 * Matches patterns like "1 oz", "1/2 cup", "2.5 tsp", etc.
 */
const MEASUREMENT_REGEX = new RegExp(
  `^(\\d+(?:\\.\\d+)?(?:\\s*\\/\\s*\\d+)?)\\s*(${UNIT_PATTERNS})(?:s)?\\s*$`,
  "i"
);

/**
 * Parse a fraction string (e.g., "1/2") to a decimal number
 *
 * @param fractionStr - Fraction string like "1/2" or "3/4"
 * @returns Decimal number or null if invalid
 */
function parseFraction(fractionStr: string): number | null {
  const parts = fractionStr.split("/").map((p) => p.trim());

  if (parts.length !== 2) {
    return null;
  }

  const numerator = parseFloat(parts[0]);
  const denominator = parseFloat(parts[1]);

  if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
    return null;
  }

  return numerator / denominator;
}

/**
 * Parse a measurement string and convert to milliliters
 *
 * @param measureStr - Measurement string from API (e.g., "1 oz", "1/2 cup", "2.5 tsp")
 * @returns Amount in milliliters, or null if parsing fails
 */
export function parseMeasurementToMl(measureStr: string | null): number | null {
  if (!measureStr || measureStr.trim() === "") {
    return null;
  }

  const trimmed = measureStr.trim();

  // Try to match standard pattern
  const match = trimmed.match(MEASUREMENT_REGEX);

  if (match) {
    const amountStr = match[1];
    const unit = match[2].toLowerCase();

    // Parse amount (could be fraction or decimal)
    let amount: number;

    if (amountStr.includes("/")) {
      const fraction = parseFraction(amountStr);
      if (fraction === null) {
        return null;
      }
      amount = fraction;
    } else {
      amount = parseFloat(amountStr);
      if (isNaN(amount)) {
        return null;
      }
    }

    // Find matching unit (case-insensitive, handle plurals)
    const unitKey = Object.keys(CONVERSION_TO_ML).find(
      (key) => key.toLowerCase() === unit || `${key.toLowerCase()}s` === unit
    );

    if (!unitKey) {
      return null;
    }

    const conversionFactor = CONVERSION_TO_ML[unitKey];
    return amount * conversionFactor;
  }

  // If no match, return null (unsupported unit)
  return null;
}

/**
 * Normalize ingredients from API format to application format
 * Extracts ingredients and measures from strIngredient1-15 and strMeasure1-15 fields
 * Converts measurements to milliliters and filters out unsupported units
 *
 * @param drink - Raw drink object from API
 * @returns Array of normalized ingredients with ml amounts
 */
export function normalizeIngredients(drink: CocktailDBDrink): Ingredient[] {
  const ingredients: Ingredient[] = [];

  // Iterate through all possible ingredient/measure pairs (1-15)
  for (let i = 1; i <= 15; i++) {
    const ingredientKey = `strIngredient${i}` as keyof CocktailDBDrink;
    const measureKey = `strMeasure${i}` as keyof CocktailDBDrink;

    const ingredientName = drink[ingredientKey];
    const measureStr = drink[measureKey];

    // Skip if no ingredient name
    if (!ingredientName || ingredientName.trim() === "") {
      continue;
    }

    // Try to parse measurement
    const amountMl = parseMeasurementToMl(measureStr);

    // Only include if we successfully parsed the measurement
    // Per spec: "If an ingredient doesn't match one of your supported units, don't display it in the pie chart"
    if (amountMl !== null && amountMl > 0) {
      ingredients.push({
        name: ingredientName.trim(),
        amount: amountMl,
        unit: "ml",
        originalMeasure: measureStr ? measureStr.trim() : null,
      });
    }
  }

  return ingredients;
}

/**
 * Check if a unit is supported for conversion
 *
 * @param unit - Unit string to check
 * @returns True if unit can be converted to ml
 */
export function isSupportedUnit(unit: string): boolean {
  const normalizedUnit = unit.toLowerCase().trim();
  return Object.keys(CONVERSION_TO_ML).some(
    (key) =>
      key.toLowerCase() === normalizedUnit ||
      `${key.toLowerCase()}s` === normalizedUnit
  );
}
