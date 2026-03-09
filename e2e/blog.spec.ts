import { test, expect } from '@playwright/test';

test.describe('Blog page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('displays articles on load', async ({ page }) => {
    const articles = page.locator('article.blog-card');
    await expect(articles).toHaveCount(6); // Total articles currently in mock data
  });

  test('category filter buttons are present', async ({ page }) => {
    await expect(page.locator('button.filter-btn')).toHaveCount(5);
  });

  test('"All Articles" filter is active by default', async ({ page }) => {
    const allBtn = page.locator('button.filter-btn', { hasText: 'All Articles' });
    await expect(allBtn).toHaveClass(/active/);
  });

  test('filtering by AI & Automation reduces article count', async ({ page }) => {
    await page.click('button.filter-btn:has-text("AI & Automation")');
    const articles = page.locator('article.blog-card');
    const count = await articles.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(6);
  });

  test('filtered articles all belong to selected category', async ({ page }) => {
    await page.click('button.filter-btn:has-text("Data Governance")');
    const tags = page.locator('article.blog-card .category-tag');
    const count = await tags.count();
    for (let i = 0; i < count; i++) {
      await expect(tags.nth(i)).toHaveText('Data Governance');
    }
  });

  test('switching back to All Articles shows all cards', async ({ page }) => {
    await page.click('button.filter-btn:has-text("AI & Automation")');
    await page.click('button.filter-btn:has-text("All Articles")');
    await expect(page.locator('article.blog-card')).toHaveCount(6);
  });

  test('active filter button changes on click', async ({ page }) => {
    await page.click('button.filter-btn:has-text("Case Studies")');
    await expect(page.locator('button.filter-btn:has-text("Case Studies")')).toHaveClass(/active/);
    await expect(page.locator('button.filter-btn:has-text("All Articles")')).not.toHaveClass(/active/);
  });

  test('each article card has a "Read Article" link', async ({ page }) => {
    const links = page.locator('article.blog-card a.read-more');
    const count = await links.count();
    expect(count).toBe(6);
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).toMatch(/\/articles\/.+/);
    }
  });

  test('clicking an article card navigates to article page', async ({ page }) => {
    const firstLink = page.locator('article.blog-card a.read-more').first();
    await firstLink.click();
    await expect(page).toHaveURL(/\/articles\/.+/);
  });
});
