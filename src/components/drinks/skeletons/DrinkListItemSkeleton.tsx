"use client";

import { Flex, Box, Skeleton } from "@chakra-ui/react";

/**
 * Skeleton loading state for DrinkListItem
 * Matches the exact layout of DrinkListItem (60px height, 40px image, etc.)
 */
export function DrinkListItemSkeleton() {
  return (
    <Flex h="60px" align="center" px={4}>
      <Skeleton
        w="40px"
        h="40px"
        borderRadius="full"
        ml="10px"
        mr="15px"
        mt="10px"
        mb="10px"
        flexShrink={0}
      />
      <Skeleton h="17px" w="200px" flex={1} />
    </Flex>
  );
}
