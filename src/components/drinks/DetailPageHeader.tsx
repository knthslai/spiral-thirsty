"use client";

import { Flex, Text, Box, IconButton } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

interface DetailPageHeaderProps {
  drinkName: string;
}

/**
 * Header component for drink detail page
 * Displays back button with "Thirsty" link and centered drink name
 */
export function DetailPageHeader({ drinkName }: DetailPageHeaderProps) {
  const router = useRouter();

  return (
    <Flex align="center" justify="space-between" mb={4} position="relative">
      {/* Back button with "Thirsty" */}
      <Flex align="center">
        <IconButton
          aria-label="Go back"
          onClick={() => router.back()}
          variant="ghost"
          size="sm"
          _hover={{ bg: "gray.100" }}
        >
          <ChevronLeftIcon width={16} height={16} />
        </IconButton>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Text
            fontSize="md"
            fontWeight="normal"
            color="gray.800"
            _hover={{ color: "gray.600" }}
          >
            Thirsty
          </Text>
        </Link>
      </Flex>

      {/* Drink name centered */}
      <Text
        fontSize="lg"
        fontWeight="bold"
        position="absolute"
        left="50%"
        transform="translateX(-50%)"
        color="gray.800"
      >
        {drinkName}
      </Text>

      {/* Spacer to balance the layout */}
      <Box w="100px" />
    </Flex>
  );
}
