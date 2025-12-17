import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load and display the app title', async ({ page }) => {
    await page.goto('/');

    // Check that the page title is correct
    await expect(page).toHaveTitle(/Spiral Thirsty/);

    // Check that the main heading is visible
    const heading = page.getByRole('heading', { name: 'Spiral Thirsty' });
    await expect(heading).toBeVisible();
  });

  test('should have correct page structure', async ({ page }) => {
    await page.goto('/');

    // Verify main element exists
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Verify heading exists within main
    const heading = main.getByRole('heading');
    await expect(heading).toBeVisible();
  });
});

