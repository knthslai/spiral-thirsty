"use client";

import { memo, useMemo } from "react";
import { Text, Box } from "@chakra-ui/react";
import { DrinkListItem } from "./DrinkListItem";
import { customColors } from "@/theme";
import type { DrinkListItem as DrinkListItemType } from "@/types/cocktail";

interface DrinkListProps {
  drinks: DrinkListItemType[];
  isLoading?: boolean;
  searchTerm?: string;
}

/**
 * List component for displaying search results
 * Handles empty state gracefully
 *
 * Features:
 * - Passes searchTerm to items for text highlighting
 *
 * Optimizations:
 * - Memoized to prevent re-renders when props haven't changed
 * - Memoized list items to prevent unnecessary re-renders
 */
function DrinkListComponent({
  drinks,
  isLoading,
  searchTerm = "",
}: DrinkListProps) {
  // Memoize list items to prevent re-renders
  const listItems = useMemo(
    () =>
      drinks.map((drink, index) => (
        <Box key={drink.id}>
          <DrinkListItem drink={drink} searchTerm={searchTerm} />
          {index < drinks.length - 1 && (
            <Box borderTop="1px solid" borderColor={customColors.borderLight} />
          )}
        </Box>
      )),
    [drinks, searchTerm]
  );

  if (isLoading) {
    return (
      <Box py={8}>
        <Text color={customColors.textSecondary} textAlign="center">
          Searching...
        </Text>
      </Box>
    );
  }

  if (drinks.length === 0) {
    return (
      <Box py={8}>
        <Text color={customColors.textSecondary} textAlign="center">
          No drinks found. Try a different search term.
        </Text>
      </Box>
    );
  }

  return <Box>{listItems}</Box>;
}

// Memoize component to prevent re-renders when parent re-renders but props haven't changed
export const DrinkList = memo(DrinkListComponent);
