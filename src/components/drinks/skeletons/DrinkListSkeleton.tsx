"use client";

import { Box } from "@chakra-ui/react";
import { DrinkListItemSkeleton } from "./DrinkListItemSkeleton";

interface DrinkListSkeletonProps {
  count?: number;
}

/**
 * Skeleton loading state for DrinkList
 * Shows multiple skeleton items
 */
export function DrinkListSkeleton({ count = 5 }: DrinkListSkeletonProps) {
  return (
    <Box>
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index}>
          <DrinkListItemSkeleton />
          {index < count - 1 && (
            <Box borderTop="1px solid" borderColor="gray.200" />
          )}
        </Box>
      ))}
    </Box>
  );
}
