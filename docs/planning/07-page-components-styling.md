---
name: Layout and Theme Planning
overview: Plan the page layouts, component structure, and color theme system based on the PDF specification, ensuring proper Chakra UI integration and adherence to spacing/sizing requirements.
todos: []
---

# Layout and Theme Planning for Spiral Thirsty

## Overview

This plan establishes the page layouts, component structure, and color theme system based on the PDF specification. The implementation will use Chakra UI for all styling and follow the exact spacing, sizing, and layout requirements from the spec.

## 1. Dependencies Installation

Install required packages:

- `@chakra-ui/react` - UI component library
- `@emotion/react` - Required peer dependency for Chakra UI
- `@emotion/styled` - Required peer dependency for Chakra UI
- `framer-motion` - Required peer dependency for Chakra UI
- `@tanstack/react-query` - Data fetching library

## 2. Color Theme System

Create a custom Chakra UI theme in `src/theme/index.ts` with:

### Color Palette

- **Primary**: A warm, inviting color (e.g., coral/orange) for accents and interactive elements
- **Secondary**: A complementary color (e.g., teal/blue) for secondary actions
- **Background**: Light neutral (e.g., off-white/light gray) for main background
- **Card**: White or slightly tinted background for list items and cards
- **Text**: Dark gray/black for primary text, medium gray for secondary text
- **Border**: Light gray for dividers and borders
- **Pastel Colors**: Array of pastel colors for ingredient legend (20+ colors for variety)

### Theme Configuration

- Extend Chakra's default theme
- Define semantic color tokens (primary, secondary, bg, card, etc.)
- Configure typography scales matching PDF specs (17px, 20px)
- Set spacing scale for consistent margins/padding
- Configure component defaults (Button, Input, etc.)

## 3. Chakra UI Provider Setup

Update `app/layout.tsx` to:

- Wrap the app with `ChakraProvider` using the custom theme
- Ensure proper font loading
- Set up base styles for consistent rendering

## 4. Search Page Layout (`app/page.tsx`)

Based on PDF spec, implement:

### Structure

```
<Container>
  <SearchBar /> (with default params, placeholder: "Find a drink")
  <DrinkList /> (displays search results)
</Container>
```

### SearchBar Component (`src/components/SearchBar.tsx`)

- Input field with placeholder "Find a drink"
- Reloads results on every input change (debounced for performance)
- Uses Chakra `Input` component
- Styled according to spec

### DrinkList Component (`src/components/DrinkList.tsx`)

- Displays list of drinks from search results
- Handles empty state gracefully
- Uses Chakra `VStack` or `Box` for layout

### DrinkListItem Component (`src/components/DrinkListItem.tsx`)

- **Row height**: Fixed 60px (per spec)
- **Image**:
  - Size: 40px
  - Circular (using Chakra `borderRadius="full"`)
  - Margins: Left: 10px, Right: 15px, Top: 10px, Bottom: 10px
- **Name**:
  - Font size: 17px
  - Vertically centered with image
  - Uses Chakra `Text` component
- Layout: Uses Chakra `Flex` or `HStack` for horizontal alignment
- Clickable/navigable to detail page

## 5. Details Page Layout (`app/drinks/[id]/page.tsx`)

Based on PDF spec, implement:

### Structure

```
<Container>
  <Image /> (top margin: 30px, horizontally centered)
  <Name /> (font size: 20px, bold, top margin: 20px, centered)
  <IngredientsLabel /> (font size: 17px, bold, left: 20px, top: 30px, bottom: 20px)
  <IngredientLegend /> (left/right: 20px, top/bottom: 20px)
  <IngredientsPieChart /> (size: 120px, left/right: 20px, top/bottom: 20px)
  <Instructions /> (left/right: 20px, top: 30px from chart/legend, bottom: 20px, scrollable)
</Container>
```

### Image Display

- Top margin: 30px
- Horizontally centered
- Uses Chakra `Image` component with `mx="auto"`

### Name Display

- Font size: 20px, Bold
- Top margin: 20px
- Horizontally centered
- Uses Chakra `Heading` or `Text` with `fontWeight="bold"`

### IngredientsLabel Component (`src/components/IngredientsLabel.tsx`)

- Text: "Ingredients:"
- Font size: 17px, Bold
- Margins: Left: 20px, Top: 30px, Bottom: 20px
- Uses Chakra `Text` component

### IngredientLegend Component (`src/components/IngredientLegend.tsx`)

- Font size: 17px
- Margins: Left: 20px, Right: 20px, Top: 20px, Bottom: 20px
- Each ingredient has:
  - Color square: 20x20px, corner radius: 3px
  - Random but deterministic color (pastel colors preferred)
- Ingredients wrap to multiple lines if long
- Uses Chakra `Flex` with `wrap` for wrapping
- Uses Chakra `Box` for color squares

### IngredientsPieChart Component (`src/components/IngredientsPieChart.tsx`)

- Size: 120px
- Margins: Left: 20px, Right: 20px, Top: 20px, Bottom: 20px
- Displays ingredients by ratio (normalized to ml)
- Only includes convertible ingredients
- Colors match legend colors exactly
- Uses a charting library (e.g., `recharts` or `@nivo/core`) or SVG implementation

### Instructions Display

- Font size: 17px
- Margins: Left: 20px, Right: 20px, Top: 30px (from bottom of pie chart/legend), Bottom: 20px
- Scrollable if content is long
- Uses Chakra `Text` component
- Container uses `maxH` and `overflowY="auto"` for scrolling

## 6. Supporting Utilities

### Color Utilities (`src/lib/colorUtils.ts`)

- Function to generate deterministic pastel colors for ingredients
- Hash ingredient names to consistent colors
- Returns pastel color values (hex or Chakra color tokens)

### Ingredient Utilities (`src/lib/ingredientUtils.ts`)

- Unit conversion functions (oz, cup, tsp, tbsp, cl → ml)
- Ingredient normalization from API format
- Filtering unsupported units
- Already partially defined in types, needs implementation

## 7. Component Hierarchy

```
app/
  layout.tsx (ChakraProvider wrapper)
  page.tsx (Search page)
    └── SearchBar
    └── DrinkList
        └── DrinkListItem (multiple)
  drinks/
    [id]/
      page.tsx (Details page)
        └── Image
        └── Name
        └── IngredientsLabel
        └── IngredientLegend
        └── IngredientsPieChart
        └── Instructions
```

## 8. Spacing and Sizing Reference

### Search Page

- List row height: 60px
- Image: 40px circle
- Image margins: L: 10px, R: 15px, T: 10px, B: 10px
- Name font: 17px

### Details Page

- Image top margin: 30px
- Name font: 20px bold, top margin: 20px
- Ingredients label: 17px bold, L: 20px, T: 30px, B: 20px
- Legend: 17px, L/R: 20px, T/B: 20px, color squares: 20x20px, radius: 3px
- Pie chart: 120px, L/R: 20px, T/B: 20px
- Instructions: 17px, L/R: 20px, T: 30px, B: 20px

## 9. Implementation Order

1. Install dependencies
2. Create theme configuration with color system
3. Set up ChakraProvider in layout
4. Implement SearchBar component
5. Implement DrinkListItem component
6. Implement DrinkList component
7. Implement Search page layout
8. Implement Details page components (Image, Name, Label)
9. Implement IngredientLegend component
10. Implement IngredientsPieChart component
11. Implement Instructions display
12. Implement Details page layout
13. Add color utilities for ingredient colors
14. Add ingredient normalization utilities

## 10. Design Philosophy

- **Clean and minimal**: Follow PDF spec exactly, avoid over-designing
- **Consistent spacing**: Use Chakra spacing scale for all margins/padding
- **Accessible**: Proper semantic HTML and ARIA where needed
- **Responsive**: Consider mobile/tablet layouts (though not specified)
- **Pastel colors**: Use soft, pleasant colors for ingredient legend (extra credit)
- **Deterministic colors**: Same ingredient always gets same color
