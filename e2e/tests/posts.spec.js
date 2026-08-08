import { test, expect } from './fixtures';

test.describe('Home page content', () => {
  test('shows the hero heading', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: /welcome to my blog/i })
    ).toBeVisible();
  });

  test('renders a "View all posts" call to action', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('link', { name: /view all posts/i }).first()
    ).toBeVisible();
  });
});

test.describe('Search page', () => {
  test('renders filters and a results heading', async ({ page }) => {
    await page.goto('/search');
    await expect(page.getByText(/sort:/i)).toBeVisible();
    await expect(page.getByText(/category:/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: /posts results/i })).toBeVisible();
  });

  test('typing a term and applying filters updates the URL', async ({ page }) => {
    await page.goto('/search');
    await page.locator('#searchTerm').fill('testing');
    await page.getByRole('button', { name: /apply filters/i }).click();
    await expect(page).toHaveURL(/searchTerm=testing/);
  });
});

test.describe('Post page (requires an existing published post)', () => {
  test.skip(
    !process.env.E2E_POST_SLUG,
    'Set E2E_POST_SLUG=<slug-of-a-real-post> to run this test.'
  );

  test('renders the post title, content and comment section', async ({ page }) => {
    await page.goto(`/post/${process.env.E2E_POST_SLUG}`);

    await expect(page.getByRole('heading').first()).toBeVisible();
    await expect(page.locator('.post-content, article')).toBeVisible();
  });
});
