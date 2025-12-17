"use client";

import type { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import system from "@/theme";

/**
 * Providers component that wraps the app with Chakra UI and React Query
 * Must be a client component to use hooks
 *
 * Caching strategy (optimized to prevent rate limiting):
 * - Default staleTime: 10 minutes (can be overridden per query)
 * - gcTime: 30 minutes (how long unused data stays in cache)
 * - refetchOnWindowFocus: false (don't refetch when user returns to tab)
 * - refetchOnMount: false (don't refetch if data exists in cache)
 * - refetchOnReconnect: false (don't refetch on reconnect to prevent rate limits)
 * - retry: 1 (retry failed requests once, but don't spam)
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10 * 60 * 1000, // 10 minutes default - increased to reduce API calls
            gcTime: 30 * 60 * 1000, // 30 minutes garbage collection - increased cache time
            refetchOnWindowFocus: false, // Don't refetch when user returns to tab
            refetchOnMount: false, // Don't refetch if data exists in cache
            refetchOnReconnect: false, // Don't refetch on reconnect to prevent rate limits
            retry: 1, // Retry failed requests once, but don't spam
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </QueryClientProvider>
  );
}
