"use client";

import { useState, useEffect } from "react";
import { Container, Heading, Text, Box } from "@chakra-ui/react";
import Image from "next/image";
import { customColors } from "@/theme";
import { useDrinkDetails } from "@/hooks/useDrinkDetails";
import { IngredientsLabel } from "@/components/ingredients/IngredientsLabel";
import { IngredientLegend } from "@/components/ingredients/IngredientLegend";
import { IngredientsPieChart } from "@/components/ingredients/IngredientsPieChart";
import { DrinkDetailSkeleton } from "@/components/drinks/skeletons/DrinkDetailSkeleton";
import { addToViewedDrinks } from "@/lib/viewedDrinks";

interface DrinkDetailPageProps {
  params: { id: string };
}

/**
 * Drink detail page - Shows full recipe information
 * Per PDF spec:
 * - Image: top margin 30px, horizontally centered
 * - Name: font size 20px, bold, top margin 20px, centered
 * - Ingredients label: font size 17px, bold, left: 20px, top: 30px, bottom: 20px
 * - Legend: left/right: 20px, top/bottom: 20px
 * - Pie chart: size 120px, left/right: 20px, top/bottom: 20px
 * - Instructions: left/right: 20px, top: 30px from chart/legend, bottom: 20px, scrollable
 * - Shows skeleton loading states
 */
export default function DrinkDetailPage({ params }: DrinkDetailPageProps) {
  // In Next.js 14.2, params is a plain object in client components
  const id = params.id;
  const { data: drink, isLoading, error } = useDrinkDetails(id);
  const [imageError, setImageError] = useState(false);

  // Track when drink is viewed
  useEffect(() => {
    if (drink) {
      addToViewedDrinks({
        id: drink.id,
        name: drink.name,
        image: drink.image,
      });
    }
  }, [drink]);

  if (isLoading) {
    return <DrinkDetailSkeleton />;
  }

  if (error || !drink) {
    return (
      <Container maxW="container.md" py={8}>
        <Text textAlign="center" color={customColors.textSecondary}>
          Drink not found.
        </Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      {/* Image - top margin: 30px, horizontally centered */}
      <Box
        mx="auto"
        mt="30px"
        maxH="400px"
        position="relative"
        w="100%"
        h="300px"
      >
        {drink.image && !imageError ? (
          <Image
            src={drink.image}
            alt={drink.name}
            fill
            style={{ objectFit: "contain", borderRadius: "8px" }}
            unoptimized
            onError={() => {
              setImageError(true);
            }}
          />
        ) : (
          <Box
            w="100%"
            h="100%"
            bg="gray.200"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="md"
          >
            <Text color="gray.500">Image not available</Text>
          </Box>
        )}
      </Box>

      {/* Name - font size: 20px, bold, top margin: 20px, centered */}
      <Heading
        as="h1"
        fontSize="lg"
        fontWeight="bold"
        textAlign="center"
        mt="20px"
        mb={4}
      >
        {drink.name}
      </Heading>

      {/* Ingredients Label */}
      <IngredientsLabel />

      {/* Legend - left/right: 20px, top/bottom: 20px */}
      <IngredientLegend ingredients={drink.ingredients} />

      {/* Pie Chart - size: 120px, left/right: 20px, top/bottom: 20px */}
      <IngredientsPieChart ingredients={drink.ingredients} />

      {/* Instructions - left/right: 20px, top: 30px from chart/legend, bottom: 20px, scrollable */}
      {drink.instructions && (
        <Box
          ml="20px"
          mr="20px"
          mt="30px"
          mb="20px"
          maxH="400px"
          overflowY="auto"
        >
          <Text fontSize="md" whiteSpace="pre-wrap">
            {drink.instructions}
          </Text>
        </Box>
      )}
    </Container>
  );
}
