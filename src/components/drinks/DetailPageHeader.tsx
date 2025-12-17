"use client";

import { Flex, Text, IconButton } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

interface DetailPageHeaderProps {
  drinkName: string;
}

/**
 * Header component for drink detail page
 * Displays back button with "Thirsty" link above centered drink name
 */
export function DetailPageHeader({ drinkName }: DetailPageHeaderProps) {
  const router = useRouter();

  return (
    <Flex direction="column" gap={2} mb={4}>
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
        textAlign="center"
        color="gray.800"
        maxW="100%"
        truncate
      >
        {drinkName}
      </Text>
    </Flex>
  );
}
