import { test, expect } from '@playwright/test';

/**
 * Production smoke tests — run against the live Cloud Run URL after every deploy.
 * Kept deliberately minimal: fast, resilient, and focused on proving the server
 * is actually up and serving rendered content (not crashing on startup).
 *
 * If any of these fail, the CI pipeline automatically rolls back to the
 * previously deployed image.
 */

test('homepage responds and renders', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBeLessThan(400);
  await expect(page.locator('app-header')).toBeVisible();
  await expect(page.locator('app-footer')).toBeVisible();
});

test('blog page loads and shows articles', async ({ page }) => {
  const response = await page.goto('/blog');
  expect(response?.status()).toBeLessThan(400);
  // At least one article card must be visible — catches GCS fetch failures
  // and any server-side rendering crash (e.g. missing runtime dependencies)
  await expect(page.locator('article.blog-card').first()).toBeVisible({ timeout: 15000 });
});

test('article page renders SSR content', async ({ page }) => {
  const response = await page.goto('/articles/what-we-have-been-listening-to-in-2026');
  expect(response?.status()).toBeLessThan(400);
  await expect(page.locator('h1').first()).toBeVisible({ timeout: 15000 });
});

test('no 500 errors on critical pages', async ({ page }) => {
  const serverErrors: string[] = [];

  page.on('response', res => {
    if (res.status() >= 500) serverErrors.push(`${res.status()} ${res.url()}`);
  });

  for (const path of ['/', '/blog', '/about', '/contact', '/services']) {
    await page.goto(path);
  }

  expect(serverErrors, `Server errors detected: ${serverErrors.join(', ')}`).toHaveLength(0);
});
