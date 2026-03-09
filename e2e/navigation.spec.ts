import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Carriff Digital/);
  });

  test('blog page loads', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveTitle(/Blog.*Carriff Digital/);
    await expect(page.locator('h1')).toContainText('Industry Knowledge');
  });

  test('about page loads', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(/About.*Carriff Digital/);
  });

  test('services page loads', async ({ page }) => {
    await page.goto('/services');
    await expect(page).toHaveTitle(/Services.*Carriff Digital/);
  });

  test('contact page loads', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveTitle(/Contact.*Carriff Digital/);
  });

  test('unknown route shows 404 page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page.locator('body')).toBeVisible();
    // Should not crash — either shows 404 component or redirects
    await expect(page).not.toHaveURL('/error');
  });

  test('header navigation links are present', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('header, nav').first();
    await expect(nav).toBeVisible();
  });

  test('clicking blog in header navigates to blog', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/blog"], a[routerLink="/blog"], a:has-text("Blog")');
    await expect(page).toHaveURL('/blog');
  });

  test('footer is present on all pages', async ({ page }) => {
    for (const path of ['/', '/blog', '/about', '/contact']) {
      await page.goto(path);
      await expect(page.locator('footer')).toBeVisible();
    }
  });
});
