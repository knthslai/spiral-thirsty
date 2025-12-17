"use client";

import { Box, Spinner, Text } from "@chakra-ui/react";
import { customColors } from "@/theme";

interface LoadingStateProps {
  message?: string;
}

/**
 * Loading state component for displaying while data is being fetched
 */
export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <Box py={8} textAlign="center">
      <Spinner size="lg" color={customColors.primary} mb={4} />
      <Text color={customColors.textSecondary}>{message}</Text>
    </Box>
  );
}
