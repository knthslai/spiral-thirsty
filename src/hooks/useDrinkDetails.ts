import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getDrinkById, getFirstDrink } from "@/lib/api";
import { normalizeIngredients } from "@/lib/ingredientUtils";
import type { Drink, Ingredient } from "@/types/cocktail";

/**
 * React Query hook for fetching a single drink by ID
 * Uses longer cache time since drink details don't change
 *
 * Optimizations:
 * - Memoized drink ID to prevent unnecessary query key changes
 * - Extended cache times to reduce API calls
 * - Don't refetch if data exists in cache
 *
 * @param drinkId - Drink ID to fetch
 * @returns Query result with full drink details
 */
export function useDrinkDetails(drinkId: string) {
  // Memoize trimmed drink ID to prevent query key changes
  const trimmedDrinkId = useMemo(() => drinkId.trim(), [drinkId]);

  return useQuery({
    queryKey: ["drink", trimmedDrinkId],
    queryFn: () => getDrinkById(trimmedDrinkId),
    enabled: trimmedDrinkId.length > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes - drink details rarely change, increased cache
    gcTime: 60 * 60 * 1000, // 60 minutes garbage collection - longer cache for details
    refetchOnMount: false, // Don't refetch if data exists in cache
    refetchOnWindowFocus: false, // Already set globally, but explicit here
    select: (data) => {
      try {
        const drink = getFirstDrink(data);

        if (!drink) {
          return null;
        }

        // Normalize ingredients from API format
        // Wrap in try-catch to handle any parsing errors gracefully
        let ingredients: Ingredient[] = [];
        try {
          ingredients = normalizeIngredients(drink);
        } catch (error) {
          console.error("Error normalizing ingredients:", error);
          // Continue with empty ingredients array
          ingredients = [];
        }

        // Transform to Drink format
        return {
          id: drink.idDrink,
          name: drink.strDrink,
          image: drink.strDrinkThumb,
          instructions: drink.strInstructions,
          ingredients,
          glass: drink.strGlass,
          category: drink.strCategory,
          alcoholic: drink.strAlcoholic,
        } as Drink;
      } catch (error) {
        console.error("Error processing drink data:", error);
        return null;
      }
    },
  });
}
