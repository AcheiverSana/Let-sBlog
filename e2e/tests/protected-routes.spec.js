import { test, expect } from './fixtures';

test.describe('Protected routes redirect anonymous users', () => {
  test('/dashboard redirects to /sign-in', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/sign-in$/);
  });

  test('/create-post redirects to /sign-in', async ({ page }) => {
    await page.goto('/create-post');
    await expect(page).toHaveURL(/\/sign-in$/);
  });

  test('/update-post/:id redirects to /sign-in', async ({ page }) => {
    await page.goto('/update-post/some-post-id');
    await expect(page).toHaveURL(/\/sign-in$/);
  });
});
