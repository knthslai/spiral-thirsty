"use client";

import { Box, Text } from "@chakra-ui/react";
import { useMemo } from "react";

interface InstructionsSectionProps {
  instructions: string | null;
}

/**
 * Instructions section for drink preparation
 * Per PDF spec: font size 17px, margins left/right: 20px, top: 30px, bottom: 20px, scrollable
 * Each line of instructions is displayed as a separate list item
 */
export function InstructionsSection({
  instructions,
}: InstructionsSectionProps) {
  // Split instructions by newlines and sentences, then filter out empty lines
  const instructionLines = useMemo(() => {
    if (!instructions) {
      return [];
    }

    // First split by newlines
    const lines = instructions.split("\n");

    // Then split each line by sentence boundaries (., !, ?)
    const sentences: string[] = [];
    lines.forEach((line) => {
      // Split by sentence endings, but keep the punctuation
      const sentenceMatches = line.match(/[^.!?]+[.!?]+/g);
      if (sentenceMatches) {
        sentenceMatches.forEach((sentence) => {
          const trimmed = sentence.trim();
          if (trimmed.length > 0) {
            sentences.push(trimmed);
          }
        });
      } else {
        // If no sentence endings found, use the line as-is if it's not empty
        const trimmed = line.trim();
        if (trimmed.length > 0) {
          sentences.push(trimmed);
        }
      }
    });

    return sentences;
  }, [instructions]);

  if (instructionLines.length === 0) {
    return null;
  }

  return (
    <Box ml="20px" mr="20px" mt="30px" mb="20px" maxH="400px" overflowY="auto">
      <Box
        as="ol"
        pl={6}
        css={{
          listStyleType: "decimal",
          listStylePosition: "outside",
          "& li": {
            display: "list-item",
            marginBottom: "8px",
          },
        }}
      >
        {instructionLines.map((line, index) => (
          <Box as="li" key={index}>
            <Text fontSize="17px">{line}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
