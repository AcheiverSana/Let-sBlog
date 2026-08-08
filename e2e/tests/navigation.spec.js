import { test, expect } from './fixtures';

test.describe('Navigation & core pages', () => {
  // The nav links live in a Flowbite NavbarCollapse that's only shown
  // uncollapsed at the md breakpoint and above.
  test.use({ viewport: { width: 1280, height: 800 } });

  test('home page loads with header and footer', async ({ page }) => {
    await page.goto('/');

    // Header logo/brand
    await expect(page.getByRole('link', { name: /Sana's/i })).toBeVisible();

    // Nav links present
    await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Projects', exact: true })).toBeVisible();

    // Footer renders
    await expect(page.locator('footer')).toBeVisible();
  });

  test('can navigate to About page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'About', exact: true }).click();
    await expect(page).toHaveURL(/\/about$/);
  });

  test('can navigate to Projects page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Projects', exact: true }).click();
    await expect(page).toHaveURL(/\/projects$/);
  });

  test('search bar navigates to search results page', async ({ page }) => {
    // The inline search box is only shown at lg breakpoint (>=1024px);
    // force a desktop-sized viewport so this works on all projects,
    // including mobile ones.
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const searchInput = page.getByPlaceholder('Search...');
    await searchInput.fill('react');
    await searchInput.press('Enter');

    await expect(page).toHaveURL(/\/search\?searchTerm=react/);
  });

  test('unknown route still renders header/footer shell', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist');
    // App has no explicit 404 route in App.jsx, so React Router renders
    // nothing for Routes, but the shared Header/Footer should still mount.
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('footer')).toBeVisible();
  });
});
