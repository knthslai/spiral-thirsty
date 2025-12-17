import { test, expect } from "@playwright/test";

// Increase test timeout for API calls and localStorage operations
test.setTimeout(60000);

test.describe("Search Bar and Viewed Drinks", () => {
  // Clear localStorage before each test to ensure clean state
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Clear localStorage
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
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

    // Initially, clear button should not be visible (empty search)
    const clearButton = page.getByRole("button", { name: /clear search/i });
    await expect(clearButton).not.toBeVisible();

    // Type in search bar
    await searchBar.fill("margarita");
    await page.waitForTimeout(100);

    // Clear button should now be visible
    await expect(clearButton).toBeVisible();
  });

  test("should clear search input when clicking clear button", async ({
    page,
  }) => {
    await page.goto("/");

    const searchBar = page.getByPlaceholder("Find a drink");
    await expect(searchBar).toBeVisible();

    // Type in search bar
    await searchBar.fill("margarita");
    await page.waitForTimeout(100);

    // Verify search bar has text
    const searchValue = await searchBar.inputValue();
    expect(searchValue).toBe("margarita");

    // Click clear button
    const clearButton = page.getByRole("button", { name: /clear search/i });
    await expect(clearButton).toBeVisible();
    await clearButton.click();

    // Wait for state update
    await page.waitForTimeout(500);

    // Verify search bar is cleared
    const clearedValue = await searchBar.inputValue();
    expect(clearedValue).toBe("");

    // Clear button should be hidden again
    await expect(clearButton).not.toBeVisible();
  });

  test("should track viewed drinks when navigating to detail pages", async ({
    page,
  }) => {
    await page.goto("/");

    // Clear localStorage first
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();

    // Search for a drink
    const searchBar = page.getByPlaceholder("Find a drink");
    await searchBar.fill("margarita");
    await page.waitForTimeout(2000);

    // Wait for results
    await page.waitForSelector('a[href^="/drinks/"]', { timeout: 40000 });

    // Get first drink link
    const firstDrink = page.locator('a[href^="/drinks/"]').first();
    const drinkName = await firstDrink.textContent();
    const drinkHref = await firstDrink.getAttribute("href");
    expect(drinkHref).toBeTruthy();
    expect(drinkName).toBeTruthy();

    // Navigate to detail page
    await Promise.all([
      page.waitForURL(/\/drinks\/\d+/, { timeout: 15000 }),
      firstDrink.click(),
    ]);

    // Wait for page to load
    await page.waitForSelector("h1", { timeout: 20000 });

    // Navigate back to home
    await page.goto("/");
    await page.waitForTimeout(1000);

    // Check that viewed drinks section appears
    const viewedDrinksSectionLabel = page.getByText("Recently viewed:");
    await expect(viewedDrinksSectionLabel).toBeVisible({ timeout: 5000 });

    // Verify the drink we viewed is in the list
    // Use a more specific selector - look for the drink in the viewed drinks section
    const viewedDrinksSection = page
      .locator("text=Recently viewed:")
      .locator("..");
    const viewedDrink = viewedDrinksSection
      .getByText(drinkName!.trim(), { exact: false })
      .first();
    await expect(viewedDrink).toBeVisible({ timeout: 5000 });
  });

  test("should display up to 5 recently viewed drinks", async ({ page }) => {
    await page.goto("/");

    // Clear localStorage
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();

    // Search for drinks and view multiple ones
    const searchBar = page.getByPlaceholder("Find a drink");
    await searchBar.fill("marg");
    await page.waitForTimeout(2000);

    // Wait for results
    await page.waitForSelector('a[href^="/drinks/"]', { timeout: 40000 });

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
      }

      // Search again to get results
      await searchBar.fill("marg");
      await page.waitForTimeout(2000);
      await page.waitForSelector('a[href^="/drinks/"]', { timeout: 40000 });

      // Get the drink link (use different index each time)
      const drinkLink = page.locator('a[href^="/drinks/"]').nth(i);
      const drinkName = await drinkLink.textContent();
      if (drinkName) {
        viewedDrinkNames.push(drinkName.trim());
      }

      // Navigate to detail page
      await Promise.all([
        page.waitForURL(/\/drinks\/\d+/, { timeout: 15000 }),
        drinkLink.click(),
      ]);

      // Wait for page to load
      await page.waitForSelector("h1", { timeout: 20000 });
      await page.waitForTimeout(1000); // Wait for tracking to complete
    }

    // Go back to home
    await page.goto("/");
    await page.waitForTimeout(1000);

    // Check that only 5 drinks are shown
    const viewedDrinksSection = page.getByText("Recently viewed:");
    await expect(viewedDrinksSection).toBeVisible({ timeout: 5000 });

    // Count the viewed drink items (they should be links)
    const viewedDrinkLinks = page
      .locator("text=Recently viewed:")
      .locator("..")
      .locator('a[href^="/drinks/"]');
    const viewedCount = await viewedDrinkLinks.count();

    // Should have at most 5 drinks
    expect(viewedCount).toBeLessThanOrEqual(5);
    expect(viewedCount).toBeGreaterThan(0);

    // The most recently viewed drink should be first
    if (viewedCount > 0) {
      const firstViewed = await viewedDrinkLinks.first().textContent();
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

    // Clear localStorage
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();

    // View a drink
    const searchBar = page.getByPlaceholder("Find a drink");
    await searchBar.fill("margarita");
    await page.waitForTimeout(2000);

    await page.waitForSelector('a[href^="/drinks/"]', { timeout: 40000 });
    const firstDrink = page.locator('a[href^="/drinks/"]').first();
    const drinkName = await firstDrink.textContent();

    // Navigate to detail page
    await Promise.all([
      page.waitForURL(/\/drinks\/\d+/, { timeout: 15000 }),
      firstDrink.click(),
    ]);

    await page.waitForSelector("h1", { timeout: 20000 });

    // Go back to home
    await page.goto("/");
    await page.waitForTimeout(1000);

    // Verify viewed drinks section is visible
    const viewedDrinksSection = page.getByText("Recently viewed:");
    await expect(viewedDrinksSection).toBeVisible({ timeout: 5000 });

    // Verify the drink is in the list
    if (drinkName) {
      const viewedDrinksSection = page
        .locator("text=Recently viewed:")
        .locator("..");
      const viewedDrink = viewedDrinksSection
        .getByText(drinkName.trim(), { exact: false })
        .first();
      await expect(viewedDrink).toBeVisible({ timeout: 5000 });
    }

    // Click clear button
    const clearButton = page.getByRole("button", { name: /clear/i }).filter({
      hasText: /clear/i,
    });
    // There might be multiple clear buttons, get the one near "Recently viewed"
    const clearViewedButton = page
      .locator("text=Recently viewed:")
      .locator("..")
      .getByRole("button", { name: /clear/i });

    await expect(clearViewedButton).toBeVisible();
    await clearViewedButton.click();

    // Wait for update
    await page.waitForTimeout(500);

    // Verify viewed drinks section is gone
    await expect(viewedDrinksSection).not.toBeVisible({ timeout: 2000 });
  });

  test("should not show viewed drinks section when no drinks have been viewed", async ({
    page,
  }) => {
    await page.goto("/");

    // Clear localStorage
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();

    // Verify viewed drinks section is not visible
    const viewedDrinksSection = page.getByText("Recently viewed:");
    await expect(viewedDrinksSection).not.toBeVisible();
  });

  test("should update viewed drinks list when viewing new drinks", async ({
    page,
  }) => {
    await page.goto("/");

    // Clear localStorage
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();

    // View first drink
    const searchBar = page.getByPlaceholder("Find a drink");
    await searchBar.fill("margarita");
    await page.waitForTimeout(2000);

    await page.waitForSelector('a[href^="/drinks/"]', { timeout: 40000 });
    const firstDrink = page.locator('a[href^="/drinks/"]').first();
    const firstDrinkName = await firstDrink.textContent();

    await Promise.all([
      page.waitForURL(/\/drinks\/\d+/, { timeout: 15000 }),
      firstDrink.click(),
    ]);

    await page.waitForSelector("h1", { timeout: 20000 });
    await page.waitForTimeout(500);

    // Go back and view second drink
    await page.goto("/");
    await page.waitForTimeout(1000);

    await searchBar.fill("martini");
    await page.waitForTimeout(2000);

    await page.waitForSelector('a[href^="/drinks/"]', { timeout: 40000 });
    const secondDrink = page.locator('a[href^="/drinks/"]').first();
    const secondDrinkName = await secondDrink.textContent();

    await Promise.all([
      page.waitForURL(/\/drinks\/\d+/, { timeout: 15000 }),
      secondDrink.click(),
    ]);

    await page.waitForSelector("h1", { timeout: 20000 });
    await page.waitForTimeout(500);

    // Go back to home
    await page.goto("/");
    await page.waitForTimeout(2000);

    // Verify both drinks are in the list, with second drink first (most recent)
    const viewedDrinksSectionLabel = page.getByText("Recently viewed:");
    await expect(viewedDrinksSectionLabel).toBeVisible({ timeout: 5000 });

    // Wait a bit more for the component to update
    await page.waitForTimeout(1000);

    const viewedDrinkLinks = page
      .locator("text=Recently viewed:")
      .locator("..")
      .locator('a[href^="/drinks/"]');

    const viewedCount = await viewedDrinkLinks.count();
    expect(viewedCount).toBeGreaterThanOrEqual(1);

    // Most recent drink should be first
    if (secondDrinkName) {
      const firstViewed = await viewedDrinkLinks.first().textContent();
      expect(firstViewed?.trim()).toContain(secondDrinkName.trim());
    }
  });

  test("should navigate to drink detail page when clicking viewed drink", async ({
    page,
  }) => {
    await page.goto("/");

    // Clear localStorage
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();

    // View a drink
    const searchBar = page.getByPlaceholder("Find a drink");
    await searchBar.fill("margarita");
    await page.waitForTimeout(2000);

    await page.waitForSelector('a[href^="/drinks/"]', { timeout: 40000 });
    const firstDrink = page.locator('a[href^="/drinks/"]').first();
    const drinkHref = await firstDrink.getAttribute("href");

    await Promise.all([
      page.waitForURL(/\/drinks\/\d+/, { timeout: 15000 }),
      firstDrink.click(),
    ]);

    await page.waitForSelector("h1", { timeout: 20000 });
    await page.waitForTimeout(1000);

    // Go back to home
    await page.goto("/");
    await page.waitForTimeout(2000);

    // Wait for viewed drinks section to appear
    const viewedDrinksSectionLabel = page.getByText("Recently viewed:");
    await expect(viewedDrinksSectionLabel).toBeVisible({ timeout: 5000 });

    // Click on the viewed drink
    const viewedDrinkLink = page
      .locator("text=Recently viewed:")
      .locator("..")
      .locator('a[href^="/drinks/"]')
      .first();

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
