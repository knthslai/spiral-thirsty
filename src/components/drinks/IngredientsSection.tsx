"use client";

import { Flex, Box } from "@chakra-ui/react";
import { IngredientLegend } from "@/components/ingredients/IngredientLegend";
import { IngredientsPieChart } from "@/components/ingredients/IngredientsPieChart";
import { UnsupportedIngredients } from "@/components/ingredients/UnsupportedIngredients";
import type { Ingredient } from "@/types/cocktail";

interface IngredientsSectionProps {
  ingredients: Ingredient[];
}

/**
 * Ingredients section with legend and pie chart
 * Per PDF spec: side by side layout, margins left/right: 20px, top/bottom: 20px
 * Also includes separate section for unsupported ingredients
 */
export function IngredientsSection({ ingredients }: IngredientsSectionProps) {
  return (
    <Flex direction="column" gap={4}>
      {/* Pie chart section with legend */}
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "center", md: "flex-start" }}
        justify={{ base: "center", md: "flex-start" }}
        gap={4}
        ml={{ base: "0", md: "20px" }}
        mr={{ base: "0", md: "20px" }}
        mt="20px"
        mb="20px"
      >
        {/* Legend - left side */}
        <Box flex="1" w={{ base: "100%", md: "auto" }}>
          <IngredientLegend ingredients={ingredients} />
        </Box>

        {/* Pie Chart - right side */}
        <Box flexShrink={0}>
          <IngredientsPieChart ingredients={ingredients} />
        </Box>
      </Flex>

      {/* Unsupported ingredients section */}
      <Box
        ml={{ base: "0", md: "20px" }}
        mr={{ base: "0", md: "20px" }}
        mb="20px"
      >
        <UnsupportedIngredients ingredients={ingredients} />
      </Box>
    </Flex>
  );
}
