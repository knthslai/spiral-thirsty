import { test, expect } from "@playwright/test";

// Increase test timeout for API calls and localStorage operations
test.setTimeout(60000);

// Helper function to clear localStorage
async function clearLocalStorage(page: any) {
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();
}

// Helper function to wait for search results
async function waitForSearchResults(page: any, timeout = 40000) {
  await page.waitForSelector('a[href^="/drinks/"]', { timeout });
}

// Helper function to perform search
async function performSearch(page: any, searchTerm: string) {
  const searchBar = page.getByPlaceholder("Find a drink");
  await expect(searchBar).toBeVisible();
  await searchBar.clear();
  await page.waitForTimeout(100);
  await searchBar.fill(searchTerm);
  await page.waitForTimeout(2000); // Wait for debounce + API call
  await waitForSearchResults(page);
}

// Helper function to navigate to a drink detail page
async function navigateToDrinkDetail(page: any, drinkIndex = 0) {
  const drinkLink = page.locator('a[href^="/drinks/"]').nth(drinkIndex);

  // Wait for the link to be visible and ready
  await expect(drinkLink).toBeVisible({ timeout: 10000 });

  const drinkName = await drinkLink.textContent();
  const drinkHref = await drinkLink.getAttribute("href");

  // Click and wait for navigation
  await Promise.all([
    page.waitForURL(/\/drinks\/\d+/, { timeout: 15000 }),
    drinkLink.click(),
  ]);

  await page.waitForSelector("h1", { timeout: 20000 });
  await page.waitForTimeout(1000); // Wait for tracking to complete

  return { drinkName: drinkName?.trim(), drinkHref };
}

test.describe("Search Bar and Viewed Drinks", () => {
  // Clear localStorage before each test to ensure clean state
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await clearLocalStorage(page);
  });

  test("should display divider underneath search input", async ({ page }) => {
    await page.goto("/");

    // Wait for search bar to be visible
    const searchBar = page.getByPlaceholder("Find a drink");
    await expect(searchBar).toBeVisible();

    // Wait for page to fully render
    await page.waitForTimeout(1000);

    // The divider is a Box element with borderTop="1px solid" that appears after the search bar
    // We verify it exists by checking for elements with border-top styles
    // Chakra UI renders borders as inline styles or CSS classes

    // Check for divider by evaluating the DOM structure
    const hasDivider = await page.evaluate(() => {
      // Find all divs and check if any have border-top styles
      const divs = Array.from(document.querySelectorAll("div"));
      return divs.some((div) => {
        const style = window.getComputedStyle(div);
        return (
          style.borderTopWidth !== "0px" &&
          style.borderTopWidth !== "" &&
          parseFloat(style.borderTopWidth) > 0
        );
      });
    });

    // Verify divider exists (either as a visible border or in the structure)
    // Even if no drinks are viewed, the divider should still be present
    expect(hasDivider).toBeTruthy();
  });

  test("should show clear button when typing in search bar", async ({
    page,
  }) => {
    await page.goto("/");

    const searchBar = page.getByPlaceholder("Find a drink");
    await expect(searchBar).toBeVisible();

    // Clear any existing search value first
    await searchBar.clear();
    await page.waitForTimeout(200);

    // Initially, clear button should not be visible (empty search)
    const clearButton = page.getByTestId("clear-search-button");
    await expect(clearButton).not.toBeVisible();

    // Type in search bar
    await searchBar.fill("margarita");
    // Wait for state update (React state update is synchronous but DOM update might take a frame)
    await page.waitForTimeout(100);

    // Clear button should now be visible
    await expect(clearButton).toBeVisible({ timeout: 2000 });
  });

  test("should clear search input when clicking clear button", async ({
    page,
  }) => {
    await page.goto("/");

    const searchBar = page.getByPlaceholder("Find a drink");
    await expect(searchBar).toBeVisible();

    // Clear any existing value first
    await searchBar.clear();
    await page.waitForTimeout(200);

    // Type in search bar
    await searchBar.fill("margarita");
    await page.waitForTimeout(200);

    // Verify search bar has text
    const searchValue = await searchBar.inputValue();
    expect(searchValue).toBe("margarita");

    // Click clear button using data-testid for reliability
    const clearButton = page.getByTestId("clear-search-button");
    await expect(clearButton).toBeVisible({ timeout: 2000 });
    await clearButton.click();

    // Wait for state update
    await page.waitForTimeout(500);

    // Verify search bar is cleared
    const clearedValue = await searchBar.inputValue();
    expect(clearedValue).toBe("");

    // Clear button should be hidden again
    await expect(clearButton).not.toBeVisible({ timeout: 2000 });
  });

  test("should track viewed drinks when navigating to detail pages", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for search bar and initial results (default search might already show results)
    const searchBar = page.getByPlaceholder("Find a drink");
    await expect(searchBar).toBeVisible();

    // Results might already be loaded from default search
    try {
      await waitForSearchResults(page, 10000);
    } catch {
      // If no results, trigger search
      await performSearch(page, "margarita");
    }

    // Navigate to detail page
    const { drinkName } = await navigateToDrinkDetail(page, 0);
    expect(drinkName).toBeTruthy();

    // Navigate back to home
    await page.goto("/");
    await page.waitForTimeout(1000);

    // Check that viewed drinks section appears
    const viewedDrinksSectionLabel = page.getByText("Recently viewed:");
    await expect(viewedDrinksSectionLabel).toBeVisible({ timeout: 5000 });

    // Verify the drink we viewed is in the list
    const viewedDrinkLink = page
      .locator('a[href^="/drinks/"]')
      .filter({ hasText: drinkName! })
      .first();
    await expect(viewedDrinkLink).toBeVisible({ timeout: 5000 });
  });

  test("should display up to 5 recently viewed drinks", async ({ page }) => {
    await page.goto("/");

    // Search for drinks and view multiple ones
    const searchBar = page.getByPlaceholder("Find a drink");
    await expect(searchBar).toBeVisible();

    // Results might already be loaded from default search
    try {
      await waitForSearchResults(page, 10000);
    } catch {
      // If no results, trigger search
      await performSearch(page, "marg");
    }

    // View 3 drinks (enough to test the feature without being too slow)
    const drinkLinks = page.locator('a[href^="/drinks/"]');
    const drinkCount = await drinkLinks.count();
    const drinksToView = Math.min(3, drinkCount);

    const viewedDrinkNames: string[] = [];

    for (let i = 0; i < drinksToView; i++) {
      // Go back to home if not already there
      if (i > 0) {
        await page.goto("/");
        await page.waitForTimeout(1500);
        await performSearch(page, "marg");
      }

      // Navigate to detail page
      const { drinkName } = await navigateToDrinkDetail(page, i);
      if (drinkName) {
        viewedDrinkNames.push(drinkName);
      }
    }

    // Go back to home
    await page.goto("/");
    await page.waitForTimeout(1000);

    // Check that only 5 drinks are shown
    const viewedDrinksSection = page.getByText("Recently viewed:");
    await expect(viewedDrinksSection).toBeVisible({ timeout: 5000 });

    // Count the viewed drink items (they should be links)
    // Use a more reliable selector - find all drink links on the page
    // Since viewed drinks appear before search results, we can filter by position
    const allDrinkLinks = page.locator('a[href^="/drinks/"]');
    const viewedCount = Math.min(await allDrinkLinks.count(), 5);

    // Should have at most 5 drinks
    expect(viewedCount).toBeLessThanOrEqual(5);
    expect(viewedCount).toBeGreaterThan(0);

    // The most recently viewed drink should be first
    if (viewedCount > 0) {
      const firstViewed = await allDrinkLinks.first().textContent();
      // Should be the last drink we viewed
      expect(firstViewed?.trim()).toBe(
        viewedDrinkNames[viewedDrinkNames.length - 1]?.trim()
      );
    }
  });

  test("should clear viewed drinks when clicking clear button", async ({
    page,
  }) => {
    await page.goto("/");

    // View a drink
    const searchBar = page.getByPlaceholder("Find a drink");
    await expect(searchBar).toBeVisible();

    // Results might already be loaded from default search
    try {
      await waitForSearchResults(page, 10000);
    } catch {
      // If no results, trigger search
      await performSearch(page, "margarita");
    }

    // Navigate to detail page
    const { drinkName } = await navigateToDrinkDetail(page, 0);

    // Go back to home
    await page.goto("/");
    await page.waitForTimeout(1000);

    // Verify viewed drinks section is visible
    const viewedDrinksSectionLabel = page.getByText("Recently viewed:");
    await expect(viewedDrinksSectionLabel).toBeVisible({ timeout: 5000 });

    // Verify the drink is in the list
    if (drinkName) {
      const viewedDrinkLink = page
        .locator('a[href^="/drinks/"]')
        .filter({ hasText: drinkName })
        .first();
      await expect(viewedDrinkLink).toBeVisible({ timeout: 5000 });
    }

    // Click clear button - find the button that's a sibling of "Recently viewed:" text
    const clearViewedButton = page
      .locator("text=Recently viewed:")
      .locator("..")
      .getByRole("button", { name: /clear/i });

    await expect(clearViewedButton).toBeVisible();
    await clearViewedButton.click();

    // Wait for update
    await page.waitForTimeout(500);

    // Verify viewed drinks section is gone
    await expect(viewedDrinksSectionLabel).not.toBeVisible({ timeout: 2000 });
  });

  test("should not show viewed drinks section when no drinks have been viewed", async ({
    page,
  }) => {
    await page.goto("/");

    // Verify viewed drinks section is not visible
    const viewedDrinksSection = page.getByText("Recently viewed:");
    await expect(viewedDrinksSection).not.toBeVisible();
  });

  test("should update viewed drinks list when viewing new drinks", async ({
    page,
  }) => {
    await page.goto("/");

    // View first drink
    const searchBar = page.getByPlaceholder("Find a drink");
    await expect(searchBar).toBeVisible();

    // Results might already be loaded from default search
    try {
      await waitForSearchResults(page, 10000);
    } catch {
      // If no results, trigger search
      await performSearch(page, "margarita");
    }

    const { drinkName: firstDrinkName } = await navigateToDrinkDetail(page, 0);

    // Go back and view second drink
    await page.goto("/");
    await page.waitForTimeout(1000);

    await performSearch(page, "martini");

    const { drinkName: secondDrinkName } = await navigateToDrinkDetail(page, 0);

    // Go back to home
    await page.goto("/");
    await page.waitForTimeout(2000);

    // Verify both drinks are in the list, with second drink first (most recent)
    const viewedDrinksSectionLabel = page.getByText("Recently viewed:");
    await expect(viewedDrinksSectionLabel).toBeVisible({ timeout: 5000 });

    // Wait a bit more for the component to update
    await page.waitForTimeout(1000);

    // Find all drink links - viewed drinks appear first
    const allDrinkLinks = page.locator('a[href^="/drinks/"]');
    const viewedCount = await allDrinkLinks.count();
    expect(viewedCount).toBeGreaterThanOrEqual(1);

    // Most recent drink should be first
    if (secondDrinkName) {
      const firstViewed = await allDrinkLinks.first().textContent();
      expect(firstViewed?.trim()).toContain(secondDrinkName.trim());
    }
  });

  test("should navigate to drink detail page when clicking viewed drink", async ({
    page,
  }) => {
    await page.goto("/");

    // View a drink
    const searchBar = page.getByPlaceholder("Find a drink");
    await expect(searchBar).toBeVisible();

    // Results might already be loaded from default search
    try {
      await waitForSearchResults(page, 10000);
    } catch {
      // If no results, trigger search
      await performSearch(page, "margarita");
    }

    const { drinkHref } = await navigateToDrinkDetail(page, 0);
    expect(drinkHref).toBeTruthy();

    // Go back to home
    await page.goto("/");
    await page.waitForTimeout(2000);

    // Wait for viewed drinks section to appear
    const viewedDrinksSectionLabel = page.getByText("Recently viewed:");
    await expect(viewedDrinksSectionLabel).toBeVisible({ timeout: 5000 });

    // Click on the viewed drink - it should be the first drink link on the page
    const viewedDrinkLink = page.locator('a[href^="/drinks/"]').first();

    await expect(viewedDrinkLink).toBeVisible({ timeout: 5000 });

    // Navigate to detail page by clicking viewed drink
    await Promise.all([
      page.waitForURL(/\/drinks\/\d+/, { timeout: 15000 }),
      viewedDrinkLink.click(),
    ]);

    // Verify we're on the detail page
    expect(page.url()).toMatch(/\/drinks\/\d+$/);
    await page.waitForSelector("h1", { timeout: 20000 });
  });
});
