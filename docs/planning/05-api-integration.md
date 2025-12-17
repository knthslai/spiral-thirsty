# API Integration and Type Models

## Overview
Set up the foundation for API integration by testing the TheCocktailDB API endpoint, creating comprehensive TypeScript type models, and implementing the API integration layer.

## Decision: Type-First Approach

**Why type-first?**
- Ensures type safety throughout the application
- Separates raw API types from normalized application types
- Makes API inconsistencies explicit and manageable
- Provides clear contracts for data transformation layers

**Architecture:**
- Raw API types match exact API response structure
- Normalized types represent clean application data
- API functions return raw types; normalization happens in utilities (future step)

## Implementation Steps

### 1. API Endpoint Testing
- Tested the API endpoint: `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita`
- Verified response structure matches expected format
- Confirmed ingredients are stored in numbered fields (`strIngredient1-15`, `strMeasure1-15`)
- Identified that `drinks` field can be `null` when no results found

### 2. Type Models Created (`src/types/cocktail.ts`)

#### Raw API Response Types
- **`CocktailDBDrink`** - Complete type matching the API response structure
  - Includes all 15 ingredient fields (`strIngredient1-15`)
  - Includes all 15 measurement fields (`strMeasure1-15`)
  - All optional fields properly typed as `string | null`
  - Handles multilingual instruction fields

- **`CocktailDBResponse`** - Response wrapper
  - `drinks` field can be `CocktailDBDrink[]` or `null`
  - Matches actual API behavior

#### Normalized Application Types
- **`Ingredient`** - Clean ingredient representation
  - `name`: string
  - `amount`: number (normalized to milliliters)
  - `unit`: 'ml' (literal type)
  - `originalMeasure`: string | null (preserves original for display)

- **`DrinkListItem`** - Minimal type for list view
  - `id`, `name`, `image`
  - Optimized for performance in list rendering

- **`Drink`** - Full drink details for detail page
  - Complete drink information
  - Normalized ingredients array
  - All metadata fields

#### Helper Functions
- **`hasDrinks()`** - Type guard for API responses
  - Safely checks if response contains drinks
  - Provides type narrowing for TypeScript

### 3. API Integration Layer (`src/lib/api.ts`)

#### Functions Created
- **`searchDrinks(query: string)`**
  - Searches drinks by name using `/search.php?s={query}`
  - Returns `Promise<CocktailDBResponse>`
  - Handles empty queries gracefully
  - URL encoding for query parameters

- **`getDrinkById(id: string)`**
  - Fetches single drink using `/lookup.php?i={id}`
  - Returns `Promise<CocktailDBResponse>`
  - Returns single drink in array format (API convention)

- **`getFirstDrink(response: CocktailDBResponse)`**
  - Helper to extract first drink from response
  - Useful for `getDrinkById` which returns array with one item
  - Returns `null` if no drinks found

#### Error Handling Philosophy
- Per requirements: network error handling is NOT required
- Functions return empty response (`{ drinks: null }`) on error
- Errors logged to console for debugging
- Graceful degradation without crashing

### 4. TypeScript Configuration Updates

**Updated `tsconfig.json`:**
- Modified path alias `@/*` to point to `./src/*`
- Ensures imports resolve correctly with new `src/` structure
- Maintains compatibility with Next.js App Router

## File Structure Created

```
src/
├── types/
│   └── cocktail.ts          # All type definitions
└── lib/
    └── api.ts               # API integration functions
```

## Reasoning

**Why separate raw and normalized types?**
- API data structure is inconsistent and verbose
- Normalized types provide clean interface for components
- Clear separation between API layer and application layer
- Makes data transformation explicit and testable

**Why type guard function?**
- TypeScript needs explicit type narrowing for nullable arrays
- Makes code more readable and type-safe
- Reusable across the application

**Why helper function for first drink?**
- API returns single drink in array format
- Helper provides semantic clarity
- Reduces repetitive null checking code

**Trade-offs:**
- ✅ Strong type safety throughout application
- ✅ Clear separation of concerns
- ✅ Easy to extend with new types
- ⚠️ More verbose type definitions (necessary for API accuracy)
- ✅ Future normalization utilities can be added without changing API layer

## Files Created

- `src/types/cocktail.ts` - Type definitions (124 lines)
- `src/lib/api.ts` - API integration functions (86 lines)
- `tsconfig.json` - Updated path alias configuration

## Files Modified

- `tsconfig.json` - Updated `paths` configuration to support `src/` structure

## Verification

- ✅ TypeScript compilation passes
- ✅ No linting errors
- ✅ Build succeeds (`npm run build`)
- ✅ Types match actual API response structure
- ✅ All imports resolve correctly

## Next Steps

- Create React Query hooks (`useDrinkSearch`, `useDrinkDetails`)
- Implement ingredient normalization utilities (`ingredientUtils.ts`)
- Create color generation utilities (`colorUtils.ts`)
- Build UI components using these types and API functions
