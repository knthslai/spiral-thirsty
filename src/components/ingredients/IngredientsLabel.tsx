"use client";

import { Text } from "@chakra-ui/react";

/**
 * Label component for the ingredients section
 * Per PDF spec:
 * - Text: "Ingredients:"
 * - Font size: 17px, Bold
 * - Margins: Left: 20px, Top: 30px, Bottom: 20px
 */
export function IngredientsLabel() {
  return (
    <Text
      fontSize="17px"
      fontWeight="bold"
      ml={{ base: "0", md: "20px" }}
      textAlign={{ base: "center", md: "left" }}
      mt="30px"
      mb="20px"
    >
      Ingredients:
    </Text>
  );
}
