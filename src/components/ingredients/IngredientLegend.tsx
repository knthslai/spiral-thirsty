"use client";

import { memo, useMemo } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { getIngredientColorMap } from "@/lib/colorUtils";
import type { Ingredient } from "@/types/cocktail";

interface IngredientLegendProps {
  ingredients: Ingredient[];
}

/**
 * Legend component displaying ingredients with color squares
 * Per PDF spec:
 * - Font size: 17px
 * - Margins: Left: 20px, Right: 20px, Top: 20px, Bottom: 20px
 * - Color squares: 20x20px, corner radius: 3px
 * - Ingredients wrap to multiple lines if long
 *
 * Optimizations:
 * - Memoized to prevent re-renders when props haven't changed
 * - Memoized color map and list items
 */
function IngredientLegendComponent({ ingredients }: IngredientLegendProps) {
  // Memoize color map calculation
  const colorMap = useMemo(
    () => getIngredientColorMap(ingredients.map((ing) => ing.name)),
    [ingredients]
  );

  // Filter to only show ingredients with amounts (those in pie chart)
  const supportedIngredients = useMemo(
    () => ingredients.filter((ing) => ing.amount !== null && ing.amount > 0),
    [ingredients]
  );

  // Memoize list items (only for supported ingredients)
  const legendItems = useMemo(
    () =>
      supportedIngredients.map((ingredient) => {
        const color = colorMap.get(ingredient.name);
        const displayText = ingredient.originalMeasure
          ? `${ingredient.name} (${ingredient.originalMeasure})`
          : ingredient.name;

        return (
          <Flex key={ingredient.name} align="center" gap={2}>
            <Box
              w="20px"
              h="20px"
              borderRadius="3px"
              bg={color}
              flexShrink={0}
            />
            <Text fontSize="17px">{displayText}</Text>
          </Flex>
        );
      }),
    [supportedIngredients, colorMap]
  );

  if (supportedIngredients.length === 0) {
    return null;
  }

  return (
    <Flex wrap="wrap" gap={3} justify={{ base: "center", md: "flex-start" }}>
      {legendItems}
    </Flex>
  );
}

// Memoize component to prevent re-renders when parent re-renders but props haven't changed
export const IngredientLegend = memo(IngredientLegendComponent);
IngredientLegend.displayName = "IngredientLegend";
