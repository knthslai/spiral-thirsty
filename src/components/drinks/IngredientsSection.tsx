"use client";

import { Flex, Box } from "@chakra-ui/react";
import { IngredientLegend } from "@/components/ingredients/IngredientLegend";
import { IngredientsPieChart } from "@/components/ingredients/IngredientsPieChart";
import type { Ingredient } from "@/types/cocktail";

interface IngredientsSectionProps {
  ingredients: Ingredient[];
}

/**
 * Ingredients section with legend and pie chart
 * Per PDF spec: side by side layout, margins left/right: 20px, top/bottom: 20px
 */
export function IngredientsSection({ ingredients }: IngredientsSectionProps) {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      align="flex-start"
      gap={4}
      ml="20px"
      mr="20px"
      mt="20px"
      mb="20px"
    >
      {/* Legend - left side */}
      <Box flex="1">
        <IngredientLegend ingredients={ingredients} />
      </Box>

      {/* Pie Chart - right side */}
      <Box flexShrink={0}>
        <IngredientsPieChart ingredients={ingredients} />
      </Box>
    </Flex>
  );
}
