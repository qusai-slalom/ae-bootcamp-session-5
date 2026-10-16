// Example-only Playwright smoke test for workflow validation, not production UI coverage.
const { test, expect } = require('@playwright/test');

test.describe('Example UI Test', () => {
  test('navigates to Google', async ({ page }) => {
    await page.goto('https://www.google.com', { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveTitle(/Google/i);
  });
});