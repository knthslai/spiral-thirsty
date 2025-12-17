"use client";

import { Container, Box, Skeleton, Flex } from "@chakra-ui/react";

/**
 * Skeleton loading state for drink detail page
 * Matches the layout of the detail page
 */
export function DrinkDetailSkeleton() {
  return (
    <Box w="100%" minH="100vh" bg="white">
      <Container maxW="500px" py={8} px={4}>
        {/* Header skeleton */}
        <Flex align="center" justify="space-between" mb={4} position="relative">
          <Flex align="center" gap={2}>
            <Skeleton w="32px" h="32px" borderRadius="md" />
            <Skeleton w="60px" h="20px" />
          </Flex>
          <Skeleton
            w="150px"
            h="24px"
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
          />
          <Box w="100px" />
        </Flex>

        {/* Image skeleton */}
        <Skeleton mx="auto" mt="30px" w="250px" h="250px" borderRadius="50%" />

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
    </Box>
  );
}
