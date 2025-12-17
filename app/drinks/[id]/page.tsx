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
    return (
      <Box
        w="100%"
        h="100vh"
        bg="white"
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        <Box
          position="sticky"
          top={0}
          zIndex={10}
          bg="white"
          borderBottom="1px solid"
          borderColor={customColors.borderLight}
          py={4}
        >
          <Container maxW="500px" px={4}>
            <Box h="60px" />
          </Container>
        </Box>
        <Box flex={1} overflowY="auto">
          <DrinkDetailSkeleton />
        </Box>
      </Box>
    );
  }

  if (error || !drink) {
    return (
      <Box
        w="100%"
        h="100vh"
        bg="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Container maxW="500px" px={4}>
          <Text textAlign="center" color={customColors.textSecondary}>
            Drink not found.
          </Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      w="100%"
      h="100vh"
      bg="white"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      {/* Fixed header */}
      <Box
        position="sticky"
        top={0}
        zIndex={10}
        bg="white"
        borderBottom="1px solid"
        borderColor={customColors.borderLight}
        py={4}
      >
        <Container maxW="500px" px={4}>
          <DetailPageHeader drinkName={drink.name} />
        </Container>
      </Box>
      {/* Scrollable content */}
      <Box flex={1} overflowY="auto">
        <Container maxW="500px" py={4} px={4}>
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
    </Box>
  );
}
