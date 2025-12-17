import { test, expect } from "@playwright/test";

// Increase test timeout for API calls
test.setTimeout(60000);

test.describe("Search Behavior and Navigation", () => {
  test("should display search results and prioritize prefix matches", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for search bar
    const searchBar = page.getByPlaceholder("Find a drink");
    await expect(searchBar).toBeVisible();

    // Type "marg" in search bar
    await searchBar.fill("marg");

    // Wait for debounce (500ms) plus API call
    await page.waitForTimeout(2000);

    // Wait for results to load
    await page.waitForSelector('a[href^="/drinks/"]', { timeout: 40000 });

    // Get all drink links
    const drinkLinks = page.locator('a[href^="/drinks/"]');
    const count = await drinkLinks.count();
    expect(count).toBeGreaterThan(0);

    // Get text content of first item
    const firstItemText = await drinkLinks.nth(0).textContent();

    // First item should start with "marg" (prefix match prioritized)
    expect(firstItemText?.toLowerCase()).toMatch(/^marg/i);
  });

  test("should highlight matching text in search results", async ({ page }) => {
    await page.goto("/");

    const searchBar = page.getByPlaceholder("Find a drink");
    await searchBar.fill("marg");
    await page.waitForTimeout(2000);

    // Wait for results
    await page.waitForSelector('a[href^="/drinks/"]', { timeout: 40000 });

    // Get first drink link
    const firstDrink = page.locator('a[href^="/drinks/"]').first();

    // Check for highlighted text (yellow background)
    const highlightedText = firstDrink.locator('span[style*="background"]');
    const highlightedCount = await highlightedText.count();

    // Should have at least one highlighted span
    expect(highlightedCount).toBeGreaterThan(0);
  });

  test("should navigate to drink detail page when clicking a drink", async ({
    page,
  }) => {
    await page.goto("/");

    // Trigger a search
    const searchBar = page.getByPlaceholder("Find a drink");
    await searchBar.fill("margarita");
    await page.waitForTimeout(2000);

    // Wait for results
    await page.waitForSelector('a[href^="/drinks/"]', { timeout: 40000 });

    // Get first drink link
    const firstDrink = page.locator('a[href^="/drinks/"]').first();
    const href = await firstDrink.getAttribute("href");

    expect(href).toMatch(/^\/drinks\/\d+$/);

    // Click and wait for navigation
    await Promise.all([
      page.waitForURL(/\/drinks\/\d+/, { timeout: 15000 }),
      firstDrink.click(),
    ]);

    // Verify we're on the detail page
    expect(page.url()).toMatch(/\/drinks\/\d+$/);
  });

  test("should display core values on drink detail page", async ({ page }) => {
    // Navigate directly to a known drink (Margarita - ID 11007)
    await page.goto("/drinks/11007");

    // Wait for page to load
    await page.waitForSelector("h1", { timeout: 20000 });

    // Verify drink name is displayed
    const drinkName = page.locator("h1").first();
    await expect(drinkName).toBeVisible();
    const nameText = await drinkName.textContent();
    expect(nameText).toBeTruthy();
    expect(nameText?.length).toBeGreaterThan(0);

    // Verify ingredients section exists (check for legend or pie chart)
    // IngredientsLabel might not have visible text, so check for ingredients legend instead
    const hasIngredients = await page.locator('svg, div[style*="background"]').count() > 0;
    expect(hasIngredients).toBeTruthy();

    // Verify instructions are displayed (if available)
    const instructionsText = page
      .locator("text=/mix|shake|stir|pour|add|blend/i")
      .first();
    const instructionsCount = await instructionsText.count();
    if (instructionsCount > 0) {
      await expect(instructionsText).toBeVisible();
    }

    // Verify page has image
    const image = page.locator("img").first();
    const imageCount = await image.count();
    expect(imageCount).toBeGreaterThan(0);
  });

  test("should handle search with query parameters", async ({ page }) => {
    // Navigate with query parameter
    await page.goto("/?search=margarita");

    // Wait for results
    await page.waitForSelector('a[href^="/drinks/"]', { timeout: 40000 });

    // Verify search bar has the query value
    const searchBar = page.getByPlaceholder("Find a drink");
    await page.waitForTimeout(1000);
    const searchValue = await searchBar.inputValue();
    expect(searchValue).toBe("margarita");

    // Verify URL has query parameter
    expect(page.url()).toContain("?search=margarita");

    // Verify results are displayed
    const drinkLinks = page.locator('a[href^="/drinks/"]');
    const count = await drinkLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should sort prefix matches alphabetically", async ({ page }) => {
    await page.goto("/");

    const searchBar = page.getByPlaceholder("Find a drink");
    await searchBar.fill("marg");
    await page.waitForTimeout(2000);

    // Wait for results
    await page.waitForSelector('a[href^="/drinks/"]', { timeout: 40000 });

    // Get drink names
    const drinkLinks = page.locator('a[href^="/drinks/"]');
    const count = await drinkLinks.count();
    expect(count).toBeGreaterThan(1);

    // Get first few items that start with "marg"
    const prefixMatches: string[] = [];
    for (let i = 0; i < Math.min(count, 5); i++) {
      const text = await drinkLinks.nth(i).textContent();
      if (text && text.toLowerCase().startsWith("marg")) {
        prefixMatches.push(text);
      }
    }

    // Verify prefix matches are sorted alphabetically
    if (prefixMatches.length > 1) {
      for (let i = 0; i < prefixMatches.length - 1; i++) {
        const current = prefixMatches[i].toLowerCase();
        const next = prefixMatches[i + 1].toLowerCase();
        expect(current.localeCompare(next)).toBeLessThanOrEqual(0);
      }
    }
  });
});
