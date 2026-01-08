"use client";

import { memo, useMemo } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import type { Ingredient } from "@/types/cocktail";

interface UnsupportedIngredientsProps {
  ingredients: Ingredient[];
}

/**
 * Component displaying ingredients with unsupported units
 * These ingredients are not included in the pie chart but should still be listed
 * Per PDF spec:
 * - Font size: 17px
 * - Color square: 20x20px, corner radius: 3px, gray color
 * - Ingredients wrap to multiple lines if long
 *
 * Optimizations:
 * - Memoized to prevent re-renders when props haven't changed
 */
function UnsupportedIngredientsComponent({
  ingredients,
}: UnsupportedIngredientsProps) {
  // Filter ingredients without supported units
  const unsupportedIngredients = useMemo(
    () => ingredients.filter((ing) => ing.amount === null || ing.amount === 0),
    [ingredients]
  );

  // Color for unsupported ingredients
  const UNSUPPORTED_COLOR = "#cccccc"; // Light gray

  // Memoize list items
  const listItems = useMemo(
    () =>
      unsupportedIngredients.map((ingredient) => {
        const displayText = ingredient.originalMeasure
          ? `${ingredient.name} (${ingredient.originalMeasure})`
          : ingredient.name;

        return (
          <Flex key={ingredient.name} align="center" gap={2}>
            <Box
              w="20px"
              h="20px"
              borderRadius="3px"
              bg={UNSUPPORTED_COLOR}
              flexShrink={0}
            />
            <Text fontSize="17px">{displayText}</Text>
          </Flex>
        );
      }),
    [unsupportedIngredients]
  );

  if (unsupportedIngredients.length === 0) {
    return null;
  }

  return (
    <Flex direction="column" gap={2} justify="center" align="center">
      <Text fontSize="17px" fontWeight="bold">
        Other ingredients:
      </Text>
      <Flex wrap="wrap" gap={3} justify={{ base: "center", md: "flex-start" }}>
        {listItems}
      </Flex>
    </Flex>
  );
}

// Memoize component to prevent re-renders when parent re-renders but props haven't changed
export const UnsupportedIngredients = memo(UnsupportedIngredientsComponent);
UnsupportedIngredients.displayName = "UnsupportedIngredients";
