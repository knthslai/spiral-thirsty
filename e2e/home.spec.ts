import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should load and display the app title", async ({ page }) => {
    await page.goto("/");

    // Check that the page title is correct
    await expect(page).toHaveTitle(/Spiral Thirsty/);

    // Check that the search bar is visible
    const searchBar = page.getByPlaceholder("Find a drink");
    await expect(searchBar).toBeVisible();
  });

  test("should have correct page structure", async ({ page }) => {
    await page.goto("/");

    // Verify search bar exists
    const searchBar = page.getByPlaceholder("Find a drink");
    await expect(searchBar).toBeVisible();

    // Verify page has content (either loading skeleton or drink list)
    // This is a lenient check that just ensures the page rendered
    const pageContent = page.locator("body");
    await expect(pageContent).toBeVisible();
  });
});
