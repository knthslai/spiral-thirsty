"use client";

import { Container, Box, Skeleton } from "@chakra-ui/react";

/**
 * Skeleton loading state for drink detail page
 * Matches the layout of the detail page
 */
export function DrinkDetailSkeleton() {
  return (
    <Container maxW="container.md" py={8}>
      {/* Image skeleton */}
      <Skeleton mx="auto" mt="30px" w="300px" h="300px" borderRadius="md" />

      {/* Name skeleton */}
      <Skeleton mx="auto" mt="20px" w="200px" h="24px" />

      {/* Ingredients label skeleton */}
      <Skeleton ml="20px" mt="30px" mb="20px" w="150px" h="20px" />

      {/* Legend skeleton */}
      <Box ml="20px" mr="20px" mt="20px" mb="20px">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} h="20px" w="250px" mb={2} />
        ))}
      </Box>

      {/* Pie chart skeleton */}
      <Skeleton
        mx="auto"
        ml="20px"
        mr="20px"
        mt="20px"
        mb="20px"
        w="120px"
        h="120px"
        borderRadius="full"
      />

      {/* Instructions skeleton */}
      <Box ml="20px" mr="20px" mt="30px" mb="20px">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} h="16px" w="100%" mb={2} />
        ))}
      </Box>
    </Container>
  );
}
