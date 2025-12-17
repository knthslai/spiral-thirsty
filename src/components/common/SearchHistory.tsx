"use client";

import { useEffect, useState, useCallback } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import { getViewedDrinks, clearViewedDrinks } from "@/lib/viewedDrinks";
import { customColors } from "@/theme";
import type { DrinkListItem } from "@/types/cocktail";

interface ViewedDrinksProps {
  onSelectDrink?: (drinkId: string) => void;
}

/**
 * Component displaying last 5 viewed drinks from localStorage
 * Clicking a drink navigates to its detail page
 * Previously named SearchHistory, now tracks viewed drinks instead
 */
export function ViewedDrinks({ onSelectDrink }: ViewedDrinksProps) {
  const [viewedDrinks, setViewedDrinks] = useState<DrinkListItem[]>([]);

  // Load viewed drinks from localStorage on mount and when page becomes visible
  useEffect(() => {
    const loadViewedDrinks = () => {
      setViewedDrinks(getViewedDrinks());
    };

    loadViewedDrinks();

    // Refresh when navigating back (listen for storage events)
    const handleStorageChange = () => {
      loadViewedDrinks();
    };

    // Listen for custom events from same-window updates
    window.addEventListener("viewedDrinksUpdated", handleStorageChange);
    // Listen for visibility change (when user navigates back to the page)
    document.addEventListener("visibilitychange", loadViewedDrinks);

    return () => {
      window.removeEventListener("viewedDrinksUpdated", handleStorageChange);
      document.removeEventListener("visibilitychange", loadViewedDrinks);
    };
  }, []);

  const handleClear = useCallback(() => {
    clearViewedDrinks();
    setViewedDrinks([]);
    // Dispatch custom event for same-window updates
    window.dispatchEvent(new Event("viewedDrinksUpdated"));
  }, []);

  const handleDrinkClick = useCallback(
    (drinkId: string) => {
      if (onSelectDrink) {
        onSelectDrink(drinkId);
      }
    },
    [onSelectDrink]
  );

  if (viewedDrinks.length === 0) {
    return null;
  }

  return (
    <Box mb={4}>
      <Flex justify="space-between" align="center" mb={2}>
        <Text
          fontSize="sm"
          color={customColors.textSecondary}
          fontWeight="medium"
        >
          Recently viewed:
        </Text>
        <Box
          as="button"
          onClick={handleClear}
          fontSize="xs"
          color={customColors.textSecondary}
          _hover={{ color: customColors.textPrimary }}
          cursor="pointer"
          px={2}
          py={1}
        >
          Clear
        </Box>
      </Flex>
      <Flex gap={2} flexWrap="wrap">
        {viewedDrinks.map((drink) => (
          <Link
            key={drink.id}
            href={`/drinks/${drink.id}`}
            onClick={() => handleDrinkClick(drink.id)}
            style={{ textDecoration: "none" }}
          >
            <Flex
              align="center"
              gap={2}
              px={3}
              py={1}
              borderRadius="md"
              bg="gray.100"
              _hover={{ bg: "gray.200" }}
              cursor="pointer"
              transition="background-color 0.2s"
            >
              {drink.image && (
                <Box
                  w="24px"
                  h="24px"
                  borderRadius="full"
                  overflow="hidden"
                  flexShrink={0}
                  position="relative"
                >
                  <Image
                    src={drink.image}
                    alt={drink.name}
                    fill
                    sizes="(max-width: 500px) 24px, 24px"
                    style={{ objectFit: "cover" }}
                  />
                </Box>
              )}
              <Text fontSize="sm" color={customColors.textPrimary}>
                {drink.name}
              </Text>
            </Flex>
          </Link>
        ))}
      </Flex>
    </Box>
  );
}
