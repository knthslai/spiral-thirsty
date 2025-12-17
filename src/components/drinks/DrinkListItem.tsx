"use client";

import { memo, useCallback, useMemo } from "react";
import { Flex, Text, Box } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import { customColors } from "@/theme";
import { highlightText } from "@/lib/textHighlight";
import type { DrinkListItem as DrinkListItemType } from "@/types/cocktail";

interface DrinkListItemProps {
  drink: DrinkListItemType;
  searchTerm?: string;
}

/**
 * List item component for displaying a drink in the search results
 * Per PDF spec:
 * - Row height: 60px
 * - Image: 40px circle, margins L: 10px, R: 15px, T: 10px, B: 10px
 * - Name: Font size 17px, vertically centered with image
 * - Chevron icon on the right
 *
 * Features:
 * - Highlights matching text in drink name
 *
 * Optimizations:
 * - Memoized to prevent unnecessary re-renders when parent re-renders
 * - Memoized error handler to prevent Image component re-renders
 * - Memoized highlight segments to prevent recalculation
 */
function DrinkListItemComponent({
  drink,
  searchTerm = "",
}: DrinkListItemProps) {
  // Memoize error handler to prevent Image re-renders
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.target as HTMLImageElement;
      target.src = "https://via.placeholder.com/40";
    },
    []
  );

  // Memoize highlight segments
  const highlightSegments = useMemo(
    () => highlightText(drink.name, searchTerm),
    [drink.name, searchTerm]
  );

  // Chevron icon SVG
  const ChevronIcon = () => (
    <Box color="gray.400">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </Box>
  );

  return (
    <Link href={`/drinks/${drink.id}`} style={{ textDecoration: "none" }}>
      <Flex
        h="60px"
        align="center"
        _hover={{ bg: customColors.cardHover }}
        cursor="pointer"
        px={0}
      >
        {/* Image with specified margins */}
        <Box
          w="40px"
          h="40px"
          borderRadius="full"
          overflow="hidden"
          ml="10px"
          mr="15px"
          mt="10px"
          mb="10px"
          flexShrink={0}
          position="relative"
        >
          {drink.image ? (
            <Image
              src={drink.image}
              alt={drink.name}
              fill
              style={{ objectFit: "cover" }}
              onError={handleImageError}
            />
          ) : (
            <Box
              w="100%"
              h="100%"
              bg="gray.200"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="xs" color="gray.500">
                No Image
              </Text>
            </Box>
          )}
        </Box>
        {/* Name with font size 17px */}
        <Text fontSize="17px" fontWeight="normal" flex={1}>
          {highlightSegments.map((segment, index) =>
            segment.highlight ? (
              <span
                key={index}
                style={{
                  backgroundColor: "#fef08a",
                  fontWeight: 600,
                  padding: "0 1px",
                }}
              >
                {segment.text}
              </span>
            ) : (
              <span key={index}>{segment.text}</span>
            )
          )}
        </Text>
        {/* Chevron icon on the right */}
        <Box mr={4} flexShrink={0}>
          <ChevronIcon />
        </Box>
      </Flex>
    </Link>
  );
}

// Memoize component to prevent re-renders when parent re-renders but props haven't changed
export const DrinkListItem = memo(DrinkListItemComponent);
