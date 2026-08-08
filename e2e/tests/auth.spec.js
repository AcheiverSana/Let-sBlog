import { test, expect, randomUser } from './fixtures';

test.describe('Sign up page', () => {
  test('renders form fields and link to sign in', async ({ page }) => {
    await page.goto('/sign-up');

    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
  });

  test('shows a validation error when submitted empty', async ({ page }) => {
    await page.goto('/sign-up');
    await page.getByRole('button', { name: /sign up/i }).click();
    await expect(page.getByText(/please fill.*fields/i)).toBeVisible();
  });

  test('link navigates to sign in page', async ({ page }) => {
    await page.goto('/sign-up');
    await page.getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/sign-in$/);
  });
});

test.describe('Sign in page', () => {
  test('renders form fields and link to sign up', async ({ page }) => {
    await page.goto('/sign-in');

    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible();
  });

  test('shows a validation error when submitted empty', async ({ page }) => {
    await page.goto('/sign-in');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/please fill.*fields/i)).toBeVisible();
  });

  test('shows an error for invalid credentials', async ({ page }) => {
    await page.goto('/sign-in');
    await page.locator('#email').fill('nonexistent-user@example.com');
    await page.locator('#password').fill('wrong-password');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Whether the backend rejects the credentials or the request itself
    // fails (e.g. no API running), the error is dispatched into Redux
    // and rendered as an Alert.
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('Sign up -> Sign in happy path (requires live API + DB)', () => {
  test.skip(
    !process.env.E2E_FULL_STACK,
    'Set E2E_FULL_STACK=1 to run tests that hit a real API/database.'
  );

  test('a new user can sign up then sign in', async ({ page }) => {
    const user = randomUser();

    await page.goto('/sign-up');
    await page.locator('#username').fill(user.username);
    await page.locator('#email').fill(user.email);
    await page.locator('#password').fill(user.password);
    await page.getByRole('button', { name: /sign up/i }).click();

    await expect(page).toHaveURL(/\/sign-in$/, { timeout: 10_000 });

    await page.locator('#email').fill(user.email);
    await page.locator('#password').fill(user.password);
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL('/', { timeout: 10_000 });
  });
});
