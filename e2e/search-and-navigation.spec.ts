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

    // Wait for initial results to load (default search)
    await page
      .waitForSelector('a[href^="/drinks/"]', { timeout: 10000 })
      .catch(() => {
        // If no results, that's okay, we'll search
      });

    // Clear and type "marg" in search bar
    await searchBar.clear();
    await page.waitForTimeout(100);
    await searchBar.fill("marg");

    // Wait for debounce (500ms) plus API call
    await page.waitForTimeout(2000);

    // Wait for results to load - use more flexible selector
    await page.waitForSelector('a[href^="/drinks/"]', { timeout: 40000 });

    // Get all drink links
    const drinkLinks = page.locator('a[href^="/drinks/"]');
    const count = await drinkLinks.count();
    expect(count).toBeGreaterThan(0);

    // Get text content of first item (trim whitespace)
    const firstItemText = (await drinkLinks.nth(0).textContent())?.trim();

    // First item should start with "marg" (prefix match prioritized)
    expect(firstItemText?.toLowerCase()).toMatch(/^marg/i);
  });

  test("should highlight matching text in search results", async ({ page }) => {
    await page.goto("/");

    const searchBar = page.getByPlaceholder("Find a drink");
    await expect(searchBar).toBeVisible();

    // Clear and type
    await searchBar.clear();
    await page.waitForTimeout(100);
    await searchBar.fill("marg");
    await page.waitForTimeout(2000);

    // Wait for results
    await page.waitForSelector('a[href^="/drinks/"]', { timeout: 40000 });

    // Get first drink link
    const firstDrink = page.locator('a[href^="/drinks/"]').first();

    // Check for highlighted text (yellow background - #fef08a or backgroundColor in style)
    const highlightedText = firstDrink.locator('span[style*="background"]');
    const highlightedCount = await highlightedText.count();

    // Should have at least one highlighted span
    expect(highlightedCount).toBeGreaterThan(0);
  });

  test("should navigate to drink detail page when clicking a drink", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for initial results or trigger a search
    const searchBar = page.getByPlaceholder("Find a drink");
    await expect(searchBar).toBeVisible();

    // Results might already be loaded from default search
    // Wait for results (either from default or after typing)
    await page
      .waitForSelector('a[href^="/drinks/"]', { timeout: 10000 })
      .catch(async () => {
        // If no results, trigger search
        await searchBar.fill("margarita");
        await page.waitForTimeout(2000);
        await page.waitForSelector('a[href^="/drinks/"]', { timeout: 40000 });
      });

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

    // Wait for page to load - check for drink name heading
    // Chakra UI Heading with as="h1" should render as h1
    await page.waitForSelector("h1", { timeout: 20000 });

    // Verify drink name is displayed and visible
    const drinkName = page.locator("h1").first();
    await expect(drinkName).toBeVisible({ timeout: 5000 });
    const nameText = await drinkName.textContent();
    expect(nameText).toBeTruthy();
    expect(nameText?.trim().length).toBeGreaterThan(0);
    // Verify it's actually "Margarita"
    expect(nameText?.toLowerCase()).toContain("margarita");

    // Wait for ingredients section to render
    await page.waitForTimeout(1000);

    // Verify ingredients label is visible
    // The IngredientsLabel component renders "Ingredients:" text
    const ingredientsLabel = page.getByText("Ingredients:", { exact: true });
    await expect(ingredientsLabel).toBeVisible({ timeout: 5000 });

    // Verify ingredients legend or pie chart exists (indicating ingredients are displayed)
    // Check for SVG (pie chart) or colored boxes (legend)
    const hasPieChart = (await page.locator("svg").count()) > 0;
    const hasLegend =
      (await page.locator('div[style*="background"]').count()) > 0;

    // At least one should be present if ingredients exist
    expect(hasPieChart || hasLegend).toBeTruthy();

    // Verify instructions are displayed as an ordered list
    const orderedList = page.locator("ol");
    const listItemCount = await orderedList.locator("li").count();

    // Instructions should be present for a valid drink
    expect(listItemCount).toBeGreaterThan(0);

    // Verify instructions contain common cocktail preparation words
    const instructionsContainer = page.locator(
      "text=/mix|shake|stir|pour|add|blend|combine/i"
    );
    const instructionsCount = await instructionsContainer.count();

    // Instructions text should be visible
    expect(instructionsCount).toBeGreaterThan(0);
    if (instructionsCount > 0) {
      await expect(instructionsContainer.first()).toBeVisible();
    }
  });

  test("should handle search with query parameters", async ({ page }) => {
    // Navigate with query parameter
    await page.goto("/?search=margarita");

    // Wait for page to load and search bar to be visible
    const searchBar = page.getByPlaceholder("Find a drink");
    await expect(searchBar).toBeVisible({ timeout: 5000 });

    // Wait for results (query param should trigger search automatically)
    await page.waitForSelector('a[href^="/drinks/"]', { timeout: 40000 });

    // Verify search bar has the query value (wait for state update)
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
    await expect(searchBar).toBeVisible();

    // Clear and type
    await searchBar.clear();
    await page.waitForTimeout(100);
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
        prefixMatches.push(text.trim());
      }
    }

    // Verify we have prefix matches
    expect(prefixMatches.length).toBeGreaterThan(0);

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
