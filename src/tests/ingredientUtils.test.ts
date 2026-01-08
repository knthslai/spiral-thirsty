import { describe, it, expect } from "vitest";
import {
  parseMeasurementToMl,
  normalizeIngredients,
  isSupportedUnit,
} from "@/lib/ingredientUtils";
import type { CocktailDBDrink } from "@/types/cocktail";

describe("ingredientUtils", () => {
  describe("parseMeasurementToMl", () => {
    describe("whole numbers", () => {
      it("should parse whole number measurements", () => {
        const result = parseMeasurementToMl("1 oz");
        expect(result).toBeCloseTo(29.5735, 2);
      });

      it("should parse larger whole numbers", () => {
        const result = parseMeasurementToMl("2 oz");
        expect(result).toBeCloseTo(59.147, 2);
      });
    });

    describe("decimals", () => {
      it("should parse decimal measurements", () => {
        const result = parseMeasurementToMl("1.5 oz");
        expect(result).toBeCloseTo(44.36025, 2);
      });

      it("should parse decimal measurements with different units", () => {
        const result = parseMeasurementToMl("2.5 tsp");
        expect(result).toBeCloseTo(12.3223, 2);
      });
    });

    describe("simple fractions", () => {
      it("should parse simple fraction measurements", () => {
        const result = parseMeasurementToMl("1/2 oz");
        expect(result).toBeCloseTo(14.78675, 2);
      });

      it("should parse other simple fractions", () => {
        const result = parseMeasurementToMl("3/4 cup");
        expect(result).toBeCloseTo(177.441, 2);
      });

      it("should parse fractions with spaces around slash", () => {
        const result = parseMeasurementToMl("1 / 2 oz");
        expect(result).toBeCloseTo(14.78675, 2);
      });
    });

    describe("mixed fractions", () => {
      it("should parse mixed fraction measurements like '1 2/3 oz'", () => {
        const result = parseMeasurementToMl("1 2/3 oz");
        // 1 + 2/3 = 1.666... oz = 49.289 ml
        expect(result).toBeCloseTo(49.289, 2);
      });

      it("should parse mixed fraction with different whole numbers", () => {
        const result = parseMeasurementToMl("2 1/4 oz");
        // 2 + 1/4 = 2.25 oz = 66.540375 ml
        expect(result).toBeCloseTo(66.540375, 2);
      });

      it("should parse mixed fraction with larger fractions", () => {
        const result = parseMeasurementToMl("1 3/4 cup");
        // 1 + 3/4 = 1.75 cup = 414.029 ml
        expect(result).toBeCloseTo(414.029, 2);
      });

      it("should parse mixed fraction with different units", () => {
        const result = parseMeasurementToMl("1 1/2 tbsp");
        // 1 + 1/2 = 1.5 tbsp = 22.1802 ml
        expect(result).toBeCloseTo(22.1802, 2);
      });
    });

    describe("edge cases", () => {
      it("should return null for empty string", () => {
        expect(parseMeasurementToMl("")).toBeNull();
      });

      it("should return null for null input", () => {
        expect(parseMeasurementToMl(null)).toBeNull();
      });

      it("should return null for whitespace-only input", () => {
        expect(parseMeasurementToMl("   ")).toBeNull();
      });

      it("should return null for unsupported units", () => {
        expect(parseMeasurementToMl("1 pint")).toBeNull();
      });

      it("should return null for invalid fraction", () => {
        expect(parseMeasurementToMl("1/0 oz")).toBeNull();
      });

      it("should return null for malformed input", () => {
        expect(parseMeasurementToMl("abc oz")).toBeNull();
      });

      it("should handle plural units", () => {
        const result = parseMeasurementToMl("2 cups");
        expect(result).toBeCloseTo(473.176, 2);
      });
    });

    describe("unit conversions", () => {
      it("should convert oz to ml correctly", () => {
        const result = parseMeasurementToMl("1 oz");
        expect(result).toBeCloseTo(29.5735, 2);
      });

      it("should convert tsp to ml correctly", () => {
        const result = parseMeasurementToMl("1 tsp");
        expect(result).toBeCloseTo(4.92892, 2);
      });

      it("should convert tbsp to ml correctly", () => {
        const result = parseMeasurementToMl("1 tbsp");
        expect(result).toBeCloseTo(14.7868, 2);
      });

      it("should convert cup to ml correctly", () => {
        const result = parseMeasurementToMl("1 cup");
        expect(result).toBeCloseTo(236.588, 2);
      });

      it("should convert cl to ml correctly", () => {
        const result = parseMeasurementToMl("1 cl");
        expect(result).toBeCloseTo(10, 2);
      });

      it("should return ml as-is", () => {
        const result = parseMeasurementToMl("100 ml");
        expect(result).toBeCloseTo(100, 2);
      });
    });
  });

  describe("normalizeIngredients", () => {
    it("should normalize ingredients with mixed fractions", () => {
      const drink: CocktailDBDrink = {
        idDrink: "123",
        strDrink: "Test Drink",
        strIngredient1: "Vodka",
        strMeasure1: "1 2/3 oz",
        strIngredient2: "Lime Juice",
        strMeasure2: "1/2 oz",
        strIngredient3: null,
        strMeasure3: null,
      } as CocktailDBDrink;

      const result = normalizeIngredients(drink);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Vodka");
      expect(result[0].amount).toBeCloseTo(49.289, 2); // 1 2/3 oz in ml
      expect(result[0].unit).toBe("ml");
      expect(result[0].originalMeasure).toBe("1 2/3 oz");

      expect(result[1].name).toBe("Lime Juice");
      expect(result[1].amount).toBeCloseTo(14.78675, 2); // 1/2 oz in ml
    });

    it("should include ingredients with unsupported units but with null amount", () => {
      const drink: CocktailDBDrink = {
        idDrink: "123",
        strDrink: "Test Drink",
        strIngredient1: "Vodka",
        strMeasure1: "1 2/3 oz",
        strIngredient2: "Unknown",
        strMeasure2: "1 pint", // unsupported
        strIngredient3: null,
        strMeasure3: null,
      } as CocktailDBDrink;

      const result = normalizeIngredients(drink);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Vodka");
      expect(result[0].amount).not.toBeNull();
      expect(result[0].unit).toBe("ml");

      expect(result[1].name).toBe("Unknown");
      expect(result[1].amount).toBeNull();
      expect(result[1].unit).toBeNull();
      expect(result[1].originalMeasure).toBe("1 pint");
    });

    it("should skip ingredients without names", () => {
      const drink: CocktailDBDrink = {
        idDrink: "123",
        strDrink: "Test Drink",
        strIngredient1: "",
        strMeasure1: "1 oz",
        strIngredient2: null,
        strMeasure2: "1 oz",
        strIngredient3: null,
        strMeasure3: null,
      } as CocktailDBDrink;

      const result = normalizeIngredients(drink);

      expect(result).toHaveLength(0);
    });

    it("should handle all 15 ingredient slots", () => {
      const drink: Partial<CocktailDBDrink> = {
        idDrink: "123",
        strDrink: "Test Drink",
      };

      // Fill all 15 slots
      for (let i = 1; i <= 15; i++) {
        (drink as any)[`strIngredient${i}`] = `Ingredient ${i}`;
        (drink as any)[`strMeasure${i}`] = "1 oz";
      }

      const result = normalizeIngredients(drink as CocktailDBDrink);

      expect(result).toHaveLength(15);
    });
  });

  describe("isSupportedUnit", () => {
    it("should return true for supported units", () => {
      expect(isSupportedUnit("oz")).toBe(true);
      expect(isSupportedUnit("cup")).toBe(true);
      expect(isSupportedUnit("tsp")).toBe(true);
      expect(isSupportedUnit("tbsp")).toBe(true);
    });

    it("should handle plural forms", () => {
      expect(isSupportedUnit("cups")).toBe(true);
      expect(isSupportedUnit("teaspoons")).toBe(true);
      expect(isSupportedUnit("tablespoons")).toBe(true);
    });

    it("should be case-insensitive", () => {
      expect(isSupportedUnit("OZ")).toBe(true);
      expect(isSupportedUnit("Cup")).toBe(true);
    });

    it("should return false for unsupported units", () => {
      expect(isSupportedUnit("pint")).toBe(false);
      expect(isSupportedUnit("gallon")).toBe(false);
      expect(isSupportedUnit("liter")).toBe(false);
    });
  });
});
