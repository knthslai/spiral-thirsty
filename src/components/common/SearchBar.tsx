"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@chakra-ui/react";
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

    // Don't trigger search for empty string - let parent handle default
    if (searchTerm.trim() === "") {
      callbackRef.current("");
      return;
    }

    const timer = setTimeout(() => {
      callbackRef.current(searchTerm);
      // Save to search history when search is triggered
      addToSearchHistory(searchTerm);
    }, 500); // 500ms debounce - increased to reduce API calls

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Memoize onChange handler
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <Input
      placeholder={placeholder}
      value={searchTerm}
      onChange={handleChange}
      size="lg"
      mb={4}
    />
  );
}
