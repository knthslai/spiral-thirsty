"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input, Flex, Box, IconButton } from "@chakra-ui/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { addToSearchHistory } from "@/lib/searchHistory";

interface SearchBarProps {
  onSearchChange: (searchTerm: string) => void;
  placeholder?: string;
  initialValue?: string;
}

/**
 * Search bar component that triggers search on every input change
 * Uses debouncing to avoid excessive API calls and rate limiting
 *
 * Features:
 * - Saves searches to localStorage
 * - Supports initial value from query params
 * - Increased debounce to 500ms to reduce API calls
 * - Uses ref to track latest callback to prevent stale closures
 * - Memoized onChange handler
 * - Prevents initial empty callback on mount to avoid unnecessary re-renders
 * - Styled to match spec: light grey rounded rectangle with search icon and clear button
 */
export function SearchBar({
  onSearchChange,
  placeholder = "Find a drink",
  initialValue = "",
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const callbackRef = useRef(onSearchChange);
  const isInitialMount = useRef(true);
  const hasInitialized = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isClearingRef = useRef(false);

  // Initialize with initialValue if provided
  useEffect(() => {
    if (initialValue && !hasInitialized.current) {
      hasInitialized.current = true;
      setSearchTerm(initialValue);
      // Trigger search immediately if we have an initial value
      if (initialValue.trim()) {
        callbackRef.current(initialValue);
      }
    }
  }, [initialValue]);

  // Sync with initialValue changes (e.g., from URL changes)
  // Only sync if initialValue actually changed externally
  useEffect(() => {
    if (hasInitialized.current && initialValue !== searchTerm) {
      setSearchTerm(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  // Keep callback ref up to date without causing re-renders
  useEffect(() => {
    callbackRef.current = onSearchChange;
  }, [onSearchChange]);

  // Debounce search to avoid excessive API calls
  useEffect(() => {
    // Skip the initial mount to prevent unnecessary callback on empty string
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Skip debounce if we're clearing (handleClear will handle it)
    if (isClearingRef.current) {
      isClearingRef.current = false;
      return;
    }

    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Don't trigger search for empty string - let parent handle default
    if (searchTerm.trim() === "") {
      callbackRef.current("");
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      callbackRef.current(searchTerm);
      // Save to search history when search is triggered
      addToSearchHistory(searchTerm);
      debounceTimerRef.current = null;
    }, 500); // 500ms debounce - increased to reduce API calls

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [searchTerm]);

  // Memoize onChange handler
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Handle clear button click - bypass debounce and clear immediately
  const handleClear = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Mark that we're clearing to skip debounce effect
    isClearingRef.current = true;

    // Clear any pending debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Clear the search term and notify parent immediately
    setSearchTerm("");
    callbackRef.current("");
  }, []);

  return (
    <Flex
      position="relative"
      align="center"
      mb={4}
      bg="gray.100"
      borderRadius="md"
      _focusWithin={{
        outline: "none",
      }}
    >
      {/* Search icon */}
      <Box
        position="absolute"
        left={3}
        zIndex={1}
        pointerEvents="none"
        color="gray.400"
      >
        <MagnifyingGlassIcon width={16} height={16} />
      </Box>
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        size="lg"
        bg="transparent"
        borderRadius="md"
        pl={10}
        pr={searchTerm ? 10 : 4}
        border="none"
        _focus={{
          bg: "transparent",
          boxShadow: "none",
        }}
        _hover={{
          bg: "transparent",
        }}
      />
      {searchTerm && (
        <Box position="absolute" right={2} zIndex={1}>
          <IconButton
            aria-label="Clear search"
            onClick={handleClear}
            size="sm"
            variant="ghost"
            borderRadius="full"
            bg="gray.300"
            color="gray.600"
            _hover={{
              bg: "gray.400",
            }}
            minW="20px"
            h="20px"
            p={0}
          >
            <XMarkIcon width={12} height={12} />
          </IconButton>
        </Box>
      )}
    </Flex>
  );
}
