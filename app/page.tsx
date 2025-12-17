"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Container, Text, Box } from "@chakra-ui/react";
import { SearchBar } from "@/components/common/SearchBar";
import { ViewedDrinks } from "@/components/common/SearchHistory";
import { DrinkList } from "@/components/drinks/DrinkList";
import { DrinkListSkeleton } from "@/components/drinks/skeletons/DrinkListSkeleton";
import { useDrinkSearch } from "@/hooks/useDrinkSearch";
import { customColors } from "@/theme";

/**
 * Search page content component that uses useSearchParams
 * Must be wrapped in Suspense for Next.js App Router
 */
function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Read search query param on mount and when it changes
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParams]);

  // Memoize the search change handler to prevent SearchBar re-renders
  const handleSearchChange = useCallback(
    (term: string) => {
      setSearchTerm(term);
      // Update URL query parameter
      const params = new URLSearchParams(searchParams.toString());
      if (term.trim()) {
        params.set("search", term.trim());
      } else {
        params.delete("search");
      }
      // Use replace to avoid adding to history for every keystroke
      router.replace(`/?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const { data: drinks = [], isLoading } = useDrinkSearch(searchTerm);

  // Get initial value from query params
  const initialSearchValue = searchParams.get("search") || "";

  return (
    <>
      <SearchBar
        onSearchChange={handleSearchChange}
        initialValue={initialSearchValue}
      />
      <Box
        borderTop="1px solid"
        borderColor={customColors.borderLight}
        mb={4}
      />
      <ViewedDrinks />
      {isLoading ? (
        <DrinkListSkeleton count={8} />
      ) : (
        <DrinkList
          drinks={drinks}
          isLoading={isLoading}
          searchTerm={searchTerm}
        />
      )}
    </>
  );
}

/**
 * Search page - Main screen for finding drinks
 * Per PDF spec:
 * - Search bar with placeholder "Find a drink"
 * - List of drink results
 * - Shows initial drinks on page load (default search)
 * - Shows skeleton loading states
 *
 * Features:
 * - Query parameter support (?search=margarita)
 * - Search history from localStorage
 * - Clicking history items triggers search
 * - Title header "Thirsty" at the top
 * - Max width container for content
 *
 * Optimizations:
 * - Memoized search handler to prevent unnecessary re-renders
 * - React Query's select function already memoizes the drinks array
 * - Suspense boundary for useSearchParams
 */
export default function Home() {
  return (
    <Box
      w="100%"
      h="100vh"
      bg="white"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      {/* Fixed header */}
      <Box
        position="sticky"
        top={0}
        zIndex={10}
        bg="white"
        borderBottom="1px solid"
        borderColor={customColors.borderLight}
        py={4}
      >
        <Container maxW="500px" px={4}>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            textAlign="center"
            color="gray.800"
          >
            Thirsty
          </Text>
        </Container>
      </Box>
      {/* Scrollable content */}
      <Box flex={1} overflowY="auto">
        <Container maxW="500px" py={4} px={4}>
          <Suspense fallback={<DrinkListSkeleton count={8} />}>
            <SearchPageContent />
          </Suspense>
        </Container>
      </Box>
    </Box>
  );
}
