import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { searchDrinks } from "@/lib/api";
import { hasDrinks } from "@/types/cocktail";
import type { DrinkListItem } from "@/types/cocktail";

/**
 * Default search term for initial page load
 * Shows popular drinks when user first visits
 */
const DEFAULT_SEARCH_TERM = "margarita";

/**
 * React Query hook for searching drinks by name
 * Automatically loads default drinks when searchTerm is empty
 *
 * Optimizations:
 * - Memoized effective search term to prevent unnecessary query key changes
 * - Extended cache times to reduce API calls
 * - Memoized select function result
 *
 * @param searchTerm - Search query string (empty string loads default drinks)
 * @returns Query result with drink list items
 */
export function useDrinkSearch(searchTerm: string) {
  // Memoize effective search term to prevent query key changes on every render
  const effectiveSearchTerm = useMemo(
    () => searchTerm.trim() || DEFAULT_SEARCH_TERM,
    [searchTerm]
  );

  return useQuery({
    queryKey: ["drinks", effectiveSearchTerm],
    queryFn: () => searchDrinks(effectiveSearchTerm),
    staleTime: 10 * 60 * 1000, // 10 minutes - increased to reduce API calls
    gcTime: 30 * 60 * 1000, // 30 minutes garbage collection - increased cache time
    refetchOnMount: false, // Don't refetch if data exists in cache
    refetchOnWindowFocus: false, // Already set globally, but explicit here
    select: (data) => {
      if (!hasDrinks(data)) {
        return [];
      }

      // Transform API response to DrinkListItem format
      // React Query automatically memoizes select results
      const drinks = data.drinks.map(
        (drink): DrinkListItem => ({
          id: drink.idDrink,
          name: drink.strDrink,
          image: drink.strDrinkThumb,
        })
      );

      // Sort: prioritize matches at beginning, then alphabetically
      const normalizedSearch = effectiveSearchTerm.toLowerCase();

      return drinks.sort((a, b) => {
        const aNameLower = a.name.toLowerCase();
        const bNameLower = b.name.toLowerCase();

        // Check if search term matches at the beginning
        const aStartsWith = aNameLower.startsWith(normalizedSearch);
        const bStartsWith = bNameLower.startsWith(normalizedSearch);

        // If one starts with search term and the other doesn't, prioritize the one that starts
        if (aStartsWith && !bStartsWith) {
          return -1; // a comes first
        }
        if (!aStartsWith && bStartsWith) {
          return 1; // b comes first
        }

        // If both start with search term or neither does, sort alphabetically
        return a.name.localeCompare(b.name);
      });
    },
  });
}
