import { test, expect } from '@playwright/test';

/**
 * SEO / meta tag tests.
 * These check that Angular's SeoService is correctly setting tags on each page.
 * Note: when running against `ng serve` (SPA mode), tags are set after hydration.
 * For verifying SSR-rendered meta in the HTML source, run against `npm run serve:ssr`.
 */

test.describe('SEO meta tags', () => {
  test('home page has a description meta tag', async ({ page }) => {
    await page.goto('/');
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(10);
  });

  test('blog page title contains "Blog"', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveTitle(/Blog/);
  });

  test('blog page has description meta', async ({ page }) => {
    await page.goto('/blog');
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
  });

  test('article page sets og:title matching article', async ({ page }) => {
    await page.goto('/articles/what-we-have-been-listening-to-in-2025');
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toContain('listening to');
  });

  test('article page sets og:type to article', async ({ page }) => {
    await page.goto('/articles/what-we-have-been-listening-to-in-2025');
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
    expect(ogType).toBe('article');
  });

  test('article page sets canonical URL', async ({ page }) => {
    await page.goto('/articles/what-we-have-been-listening-to-in-2025');
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain('/articles/what-we-have-been-listening-to-in-2025');
  });

  test('static pages set og:type to website', async ({ page }) => {
    for (const path of ['/about', '/contact', '/blog']) {
      await page.goto(path);
      const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
      expect(ogType).toBe('website');
    }
  });

  test('twitter:card meta is set on article page', async ({ page }) => {
    await page.goto('/articles/what-we-have-been-listening-to-in-2025');
    const card = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    expect(card).toBe('summary_large_image');
  });
});
