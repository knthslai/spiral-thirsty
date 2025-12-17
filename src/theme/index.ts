import { defaultSystem } from "@chakra-ui/react";

/**
 * Pastel colors for ingredient legend (20+ colors)
 * These are used directly in components, not through theme tokens
 */
export const pastel = [
  "#ffb3ba", // Pastel pink
  "#ffdfba", // Pastel peach
  "#ffffba", // Pastel yellow
  "#baffc9", // Pastel green
  "#bae1ff", // Pastel blue
  "#e0bbff", // Pastel purple
  "#ffcccb", // Light red
  "#ffd9b3", // Light orange
  "#fff4a3", // Light yellow
  "#c7f5d9", // Mint green
  "#b3e5fc", // Light sky blue
  "#d1c4e9", // Light purple
  "#f8bbd0", // Light pink
  "#ffe0b2", // Light amber
  "#fff9c4", // Light lemon
  "#c5e1a5", // Light lime
  "#b2ebf2", // Light cyan
  "#ce93d8", // Light violet
  "#f48fb1", // Pink
  "#90caf9", // Light indigo
  "#a5d6a7", // Light green
  "#ffccbc", // Light deep orange
  "#d7ccc8", // Light brown
  "#b0bec5", // Light blue grey
  "#e1bee7", // Light purple
];

/**
 * Custom color values for use in components
 * These are used directly as string values, not through theme tokens
 */
export const customColors = {
  primary: "#ff5f1a", // Main primary color (coral/orange)
  secondary: "#00a2a2", // Main secondary color (teal)
  bgLight: "#fafafa", // Off-white background
  bgDefault: "#ffffff", // White background
  cardDefault: "#ffffff", // White card background
  cardHover: "#f5f5f5", // Light gray on hover
  textPrimary: "#1a1a1a", // Dark gray/black for primary text
  textSecondary: "#666666", // Medium gray for secondary text
  borderLight: "#e0e0e0", // Light gray for borders
  borderDefault: "#cccccc", // Default border color
};

/**
 * Use default Chakra UI v3 system
 * Custom colors are used directly in components via customColors export
 */
export default defaultSystem;
