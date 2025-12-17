import { describe, it, expect } from "vitest";
import { searchDrinks, getDrinkById, getFirstDrink } from "@/lib/api";
import type { CocktailDBResponse, CocktailDBDrink } from "@/types/cocktail";
import { hasDrinks } from "@/types/cocktail";

/**
 * API Integration Tests
 *
 * These tests verify that:
 * 1. API responses match our TypeScript type definitions
 * 2. Response structure is correct
 * 3. Edge cases are handled properly
 * 4. Type guards work correctly
 *
 * NOTE: These tests are skipped to avoid pinging the external API.
 * Remove .skip to re-enable when needed.
 */

describe.skip("API Integration Tests", () => {
  describe("searchDrinks", () => {
    it("should return drinks array for valid search query", async () => {
      const result = await searchDrinks("margarita");

      // Verify response structure
      expect(result).toHaveProperty("drinks");
      expect(result.drinks).not.toBeNull();

      if (result.drinks) {
        expect(Array.isArray(result.drinks)).toBe(true);
        expect(result.drinks.length).toBeGreaterThan(0);

        // Verify first drink structure matches CocktailDBDrink type
        const firstDrink = result.drinks[0];
        expect(firstDrink).toHaveProperty("idDrink");
        expect(firstDrink).toHaveProperty("strDrink");
        expect(firstDrink).toHaveProperty("strDrinkThumb");
        expect(typeof firstDrink.idDrink).toBe("string");
        expect(typeof firstDrink.strDrink).toBe("string");
      }
    });

    it("should return null drinks for empty query", async () => {
      const result = await searchDrinks("");
      expect(result.drinks).toBeNull();
    });

    it("should return null drinks for whitespace-only query", async () => {
      const result = await searchDrinks("   ");
      expect(result.drinks).toBeNull();
    });

    it("should return null drinks for non-existent drink", async () => {
      const result = await searchDrinks("nonexistentdrink12345");
      expect(result.drinks).toBeNull();
    });

    it("should handle URL encoding correctly", async () => {
      const result = await searchDrinks("margarita & lime");
      // Should not throw error, may return null or results
      expect(result).toHaveProperty("drinks");
    });

    it("should return drinks with all required fields", async () => {
      const result = await searchDrinks("margarita");

      if (result.drinks && result.drinks.length > 0) {
        const drink = result.drinks[0];

        // Verify all required fields exist (even if null)
        expect(drink).toHaveProperty("idDrink");
        expect(drink).toHaveProperty("strDrink");
        expect(drink).toHaveProperty("strDrinkAlternate");
        expect(drink).toHaveProperty("strInstructions");
        expect(drink).toHaveProperty("strDrinkThumb");

        // Verify ingredient fields exist (at least first few)
        expect(drink).toHaveProperty("strIngredient1");
        expect(drink).toHaveProperty("strMeasure1");

        // Verify field types
        expect(typeof drink.idDrink).toBe("string");
        expect(typeof drink.strDrink).toBe("string");
        // Optional fields can be string or null
        expect(
          drink.strDrinkAlternate === null ||
            typeof drink.strDrinkAlternate === "string"
        ).toBe(true);
      }
    });

    it("should return drinks with ingredient and measure fields", async () => {
      const result = await searchDrinks("margarita");

      if (result.drinks && result.drinks.length > 0) {
        const drink = result.drinks[0];

        // Check that at least some ingredients exist
        const hasIngredients =
          drink.strIngredient1 !== null ||
          drink.strIngredient2 !== null ||
          drink.strIngredient3 !== null;

        expect(hasIngredients).toBe(true);
      }
    });
  });

  describe("getDrinkById", () => {
    it("should return a single drink for valid ID", async () => {
      // Using a known drink ID (Margarita)
      const result = await getDrinkById("11007");

      expect(result).toHaveProperty("drinks");
      expect(result.drinks).not.toBeNull();

      if (result.drinks) {
        expect(Array.isArray(result.drinks)).toBe(true);
        expect(result.drinks.length).toBe(1);

        const drink = result.drinks[0];
        expect(drink.idDrink).toBe("11007");
        expect(drink.strDrink).toBe("Margarita");
      }
    });

    it("should return null drinks for invalid ID", async () => {
      const result = await getDrinkById("999999");
      expect(result.drinks).toBeNull();
    });

    it("should return null drinks for empty ID", async () => {
      const result = await getDrinkById("");
      expect(result.drinks).toBeNull();
    });

    it("should return null drinks for whitespace-only ID", async () => {
      const result = await getDrinkById("   ");
      expect(result.drinks).toBeNull();
    });

    it("should return drink with complete data structure", async () => {
      const result = await getDrinkById("11007");

      if (result.drinks && result.drinks.length > 0) {
        const drink = result.drinks[0];

        // Verify all fields from CocktailDBDrink interface exist
        const requiredFields: (keyof CocktailDBDrink)[] = [
          "idDrink",
          "strDrink",
          "strDrinkAlternate",
          "strTags",
          "strVideo",
          "strCategory",
          "strIBA",
          "strAlcoholic",
          "strGlass",
          "strInstructions",
          "strDrinkThumb",
        ];

        requiredFields.forEach((field) => {
          expect(drink).toHaveProperty(field);
        });

        // Verify ingredient fields (1-15)
        for (let i = 1; i <= 15; i++) {
          expect(drink).toHaveProperty(
            `strIngredient${i}` as keyof CocktailDBDrink
          );
          expect(drink).toHaveProperty(
            `strMeasure${i}` as keyof CocktailDBDrink
          );
        }
      }
    });
  });

  describe("getFirstDrink helper", () => {
    it("should return first drink from response with drinks", async () => {
      const result = await searchDrinks("margarita");

      if (result.drinks && result.drinks.length > 0) {
        const firstDrink = getFirstDrink(result);
        expect(firstDrink).not.toBeNull();
        expect(firstDrink).toEqual(result.drinks[0]);
      }
    });

    it("should return null for response with null drinks", () => {
      const result: CocktailDBResponse = { drinks: null };
      const firstDrink = getFirstDrink(result);
      expect(firstDrink).toBeNull();
    });

    it("should return null for response with empty array", () => {
      const result: CocktailDBResponse = { drinks: [] };
      const firstDrink = getFirstDrink(result);
      expect(firstDrink).toBeNull();
    });
  });

  describe("hasDrinks type guard", () => {
    it("should return true for response with drinks array", () => {
      const result: CocktailDBResponse = {
        drinks: [
          {
            idDrink: "11007",
            strDrink: "Margarita",
            strDrinkAlternate: null,
            strTags: null,
            strVideo: null,
            strCategory: null,
            strIBA: null,
            strAlcoholic: null,
            strGlass: null,
            strInstructions: null,
            strInstructionsES: null,
            strInstructionsDE: null,
            strInstructionsFR: null,
            strInstructionsIT: null,
            "strInstructionsZH-HANS": null,
            "strInstructionsZH-HANT": null,
            strDrinkThumb: null,
            strIngredient1: null,
            strIngredient2: null,
            strIngredient3: null,
            strIngredient4: null,
            strIngredient5: null,
            strIngredient6: null,
            strIngredient7: null,
            strIngredient8: null,
            strIngredient9: null,
            strIngredient10: null,
            strIngredient11: null,
            strIngredient12: null,
            strIngredient13: null,
            strIngredient14: null,
            strIngredient15: null,
            strMeasure1: null,
            strMeasure2: null,
            strMeasure3: null,
            strMeasure4: null,
            strMeasure5: null,
            strMeasure6: null,
            strMeasure7: null,
            strMeasure8: null,
            strMeasure9: null,
            strMeasure10: null,
            strMeasure11: null,
            strMeasure12: null,
            strMeasure13: null,
            strMeasure14: null,
            strMeasure15: null,
            strImageSource: null,
            strImageAttribution: null,
            strCreativeCommonsConfirmed: null,
            dateModified: null,
          },
        ],
      };

      expect(hasDrinks(result)).toBe(true);

      // TypeScript should narrow the type here
      if (hasDrinks(result)) {
        expect(result.drinks.length).toBeGreaterThan(0);
      }
    });

    it("should return false for response with null drinks", () => {
      const result: CocktailDBResponse = { drinks: null };
      expect(hasDrinks(result)).toBe(false);
    });

    it("should return false for response with empty array", () => {
      const result: CocktailDBResponse = { drinks: [] };
      expect(hasDrinks(result)).toBe(false);
    });
  });

  describe("Response Type Validation", () => {
    it("should return responses that match CocktailDBResponse type", async () => {
      const searchResult = await searchDrinks("margarita");
      const drinkResult = await getDrinkById("11007");

      // Type check - if this compiles, types are correct
      const searchResponse: CocktailDBResponse = searchResult;
      const drinkResponse: CocktailDBResponse = drinkResult;

      expect(searchResponse).toBeDefined();
      expect(drinkResponse).toBeDefined();
    });

    it("should handle drinks with various null fields correctly", async () => {
      const result = await searchDrinks("margarita");

      if (result.drinks && result.drinks.length > 0) {
        const drink = result.drinks[0];

        // Verify that null fields are handled correctly
        // Some fields may be null, which is valid per our type definition
        expect(
          drink.strDrinkAlternate === null ||
            typeof drink.strDrinkAlternate === "string"
        ).toBe(true);
        expect(
          drink.strTags === null || typeof drink.strTags === "string"
        ).toBe(true);
      }
    });
  });
});
