import { pastel } from "@/theme";

/**
 * Generate a deterministic color for an ingredient name
 * Uses a simple hash function to consistently map ingredient names to colors
 *
 * @param ingredientName - The name of the ingredient
 * @returns A pastel color hex string
 */
export function getIngredientColor(ingredientName: string): string {
  if (!ingredientName || ingredientName.trim() === "") {
    return pastel[0];
  }

  // Simple hash function to convert string to number
  let hash = 0;
  const normalizedName = ingredientName.toLowerCase().trim();

  for (let i = 0; i < normalizedName.length; i++) {
    const char = normalizedName.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use absolute value and modulo to get index in pastel array
  const index = Math.abs(hash) % pastel.length;
  return pastel[index];
}

/**
 * Get color for multiple ingredients, ensuring each gets a unique color
 * If there are more ingredients than colors, colors will repeat deterministically
 *
 * @param ingredientNames - Array of ingredient names
 * @returns Map of ingredient name to color hex string
 */
export function getIngredientColorMap(
  ingredientNames: string[]
): Map<string, string> {
  const colorMap = new Map<string, string>();

  ingredientNames.forEach((name) => {
    if (!colorMap.has(name)) {
      colorMap.set(name, getIngredientColor(name));
    }
  });

  return colorMap;
}
