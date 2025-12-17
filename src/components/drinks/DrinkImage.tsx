"use client";

import { useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import Image from "next/image";

interface DrinkImageProps {
  imageUrl: string | null;
  drinkName: string;
}

/**
 * Circular drink image component
 * Per PDF spec: top margin 30px, horizontally centered, circular (250px)
 */
export function DrinkImage({ imageUrl, drinkName }: DrinkImageProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Box
      mx="auto"
      mt="30px"
      position="relative"
      w="250px"
      h="250px"
      borderRadius="50%"
      overflow="hidden"
      flexShrink={0}
    >
      {imageUrl && !imageError ? (
        <Image
          src={imageUrl}
          alt={drinkName}
          fill
          style={{ objectFit: "cover" }}
          unoptimized
          onError={() => {
            setImageError(true);
          }}
        />
      ) : (
        <Box
          w="100%"
          h="100%"
          bg="gray.200"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="50%"
        >
          <Text color="gray.500">Image not available</Text>
        </Box>
      )}
    </Box>
  );
}
