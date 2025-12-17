"use client";

import { memo, useMemo } from "react";
import { Box } from "@chakra-ui/react";
import { getIngredientColorMap } from "@/lib/colorUtils";
import type { Ingredient } from "@/types/cocktail";

interface IngredientsPieChartProps {
  ingredients: Ingredient[];
}

/**
 * Pie chart component displaying ingredients by ratio
 * Per PDF spec:
 * - Size: 120px
 * - Margins: Left: 20px, Right: 20px, Top: 20px, Bottom: 20px
 * - Only includes convertible ingredients (already filtered)
 * - Colors match legend colors exactly
 *
 * Optimizations:
 * - Memoized to prevent re-renders when props haven't changed
 * - Memoized expensive calculations (color map, paths, total amount)
 */
function IngredientsPieChartComponent({
  ingredients,
}: IngredientsPieChartProps) {
  // Memoize color map calculation
  const colorMap = useMemo(
    () => getIngredientColorMap(ingredients.map((ing) => ing.name)),
    [ingredients]
  );

  // Memoize total amount calculation
  const totalAmount = useMemo(
    () => ingredients.reduce((sum, ing) => sum + ing.amount, 0),
    [ingredients]
  );

  // Memoize SVG paths calculation (expensive operation)
  const paths = useMemo(() => {
    if (ingredients.length === 0 || totalAmount === 0) {
      return [];
    }

    let currentAngle = -90; // Start at top
    const radius = 60; // Half of 120px
    const centerX = 60;
    const centerY = 60;

    return ingredients.map((ingredient) => {
      const percentage = (ingredient.amount / totalAmount) * 100;
      const angle = (percentage / 100) * 360;
      const color = colorMap.get(ingredient.name) || "#cccccc";

      // Calculate start and end points for this slice
      const startAngle = (currentAngle * Math.PI) / 180;
      const endAngle = ((currentAngle + angle) * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        "Z",
      ].join(" ");

      currentAngle += angle;

      return (
        <path
          key={ingredient.name}
          d={pathData}
          fill={color}
          stroke="#fff"
          strokeWidth="1"
        />
      );
    });
  }, [ingredients, totalAmount, colorMap]);

  if (ingredients.length === 0 || totalAmount === 0) {
    return null;
  }

  return (
    <Box ml="20px" mr="20px" mt="20px" mb="20px" w="120px" h="120px" mx="auto">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {paths}
      </svg>
    </Box>
  );
}

// Memoize component to prevent re-renders when parent re-renders but props haven't changed
export const IngredientsPieChart = memo(IngredientsPieChartComponent);
