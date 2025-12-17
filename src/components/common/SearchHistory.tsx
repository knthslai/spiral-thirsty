"use client";

import { useEffect, useState, useCallback } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { getSearchHistory, clearSearchHistory } from "@/lib/searchHistory";
import { customColors } from "@/theme";

interface SearchHistoryProps {
  onSelectSearch: (searchTerm: string) => void;
}

/**
 * Component displaying previous search terms from localStorage
 * Clicking a term triggers a new search
 */
export function SearchHistory({ onSelectSearch }: SearchHistoryProps) {
  const [history, setHistory] = useState<string[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  const handleSelect = useCallback(
    (term: string) => {
      onSelectSearch(term);
    },
    [onSelectSearch]
  );

  const handleClear = useCallback(() => {
    clearSearchHistory();
    setHistory([]);
  }, []);

  if (history.length === 0) {
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
          Recent searches:
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
        {history.map((term) => (
          <Box
            key={term}
            as="button"
            px={3}
            py={1}
            borderRadius="md"
            bg="gray.100"
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
            onClick={() => handleSelect(term)}
            fontSize="sm"
            color={customColors.textPrimary}
            transition="background-color 0.2s"
          >
            {term}
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
