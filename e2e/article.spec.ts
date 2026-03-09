import { test, expect } from '@playwright/test';

const KNOWN_ARTICLES = [
  {
    slug: 'what-we-have-been-listening-to-in-2025',
    titleFragment: 'What we have been listening to',
  },
  {
    slug: 'the-5-pillars-of-a-modern-data-governance-framework',
    titleFragment: '5 Pillars',
  },
  {
    slug: 'beyond-chatbots-using-ai-for-hyper-personalized-marketing',
    titleFragment: 'Chatbots',
  },
];

test.describe('Article page', () => {
  test('known article slug loads correctly', async ({ page }) => {
    await page.goto('/articles/what-we-have-been-listening-to-in-2025');
    await expect(page.locator('h1')).toContainText('listening to');
    await expect(page.locator('main.article-page-container')).toBeVisible();
  });

  test('article page has a back link to blog', async ({ page }) => {
    await page.goto('/articles/what-we-have-been-listening-to-in-2025');
    const backLink = page.locator('a.back-link');
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/blog');
  });

  test('back link navigates to blog', async ({ page }) => {
    await page.goto('/articles/what-we-have-been-listening-to-in-2025');
    await page.click('a.back-link');
    await expect(page).toHaveURL('/blog');
  });

  test('article content body is rendered', async ({ page }) => {
    await page.goto('/articles/the-5-pillars-of-a-modern-data-governance-framework');
    const body = page.locator('.article-content-body');
    await expect(body).toBeVisible();
    await expect(body).not.toBeEmpty();
  });

  test('article CTA section is present', async ({ page }) => {
    await page.goto('/articles/what-we-have-been-listening-to-in-2025');
    await expect(page.locator('section.article-cta')).toBeVisible();
    await expect(page.locator('section.article-cta a.cta-button')).toBeVisible();
  });

  for (const { slug, titleFragment } of KNOWN_ARTICLES) {
    test(`article "${titleFragment}" renders its title in h1`, async ({ page }) => {
      await page.goto(`/articles/${slug}`);
      await expect(page.locator('h1')).toContainText(titleFragment);
    });
  }

  test('article page sets a unique document title', async ({ page }) => {
    await page.goto('/articles/what-we-have-been-listening-to-in-2025');
    const title = await page.title();
    expect(title).toContain('Carriff Digital');
    expect(title).not.toBe('Carriff Digital'); // Should have article title too
  });
});
