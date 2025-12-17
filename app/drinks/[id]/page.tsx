"use client";

import { useEffect } from "react";
import { Container, Heading, Text, Box } from "@chakra-ui/react";
import { customColors } from "@/theme";
import { useDrinkDetails } from "@/hooks/useDrinkDetails";
import { IngredientsLabel } from "@/components/ingredients/IngredientsLabel";
import {
  DetailPageHeader,
  DrinkImage,
  IngredientsSection,
  InstructionsSection,
} from "@/components/drinks";
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
      <Box w="100%" minH="100vh" bg="white">
        <Container maxW="500px" py={8} px={4}>
          <Text textAlign="center" color={customColors.textSecondary}>
            Drink not found.
          </Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box w="100%" minH="100vh" bg="white">
      <Container maxW="500px" py={8} px={4}>
        <DetailPageHeader drinkName={drink.name} />

        <DrinkImage imageUrl={drink.image} drinkName={drink.name} />

        {/* Name - font size: 20px, bold, top margin: 20px, centered */}
        <Heading
          as="h1"
          fontSize="20px"
          fontWeight="bold"
          textAlign="center"
          mt="20px"
          mx="auto"
          maxW="100%"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {drink.name}
        </Heading>

        <IngredientsLabel />

        <IngredientsSection ingredients={drink.ingredients} />

        <InstructionsSection instructions={drink.instructions} />
      </Container>
    </Box>
  );
}
