import { ServerRoute, RenderMode } from '@angular/ssr';

const GCS_BASE = 'https://storage.googleapis.com/carriffdigital-content';

// Fallback used when GCS is unreachable at build time so the build never fails
const FALLBACK_SLUGS = [
  'what-we-have-been-listening-to-in-2025',
  'the-future-of-price-comparision-sites-will-ai-take-over',
  'beyond-chatbots-using-ai-for-hyper-personalized-marketing',
  'roadmap-to-digital-success-in-2026',
  'ai-driven-quality-in-month-end-reporting',
  'the-5-pillars-of-a-modern-data-governance-framework',
];

export const serverRoutes: ServerRoute[] = [
  {
    path: 'articles/:slug',
    renderMode: RenderMode.Prerender,

    // Fetches slug list from GCS at build time to generate static pages.
    // Falls back to a hardcoded list if GCS is unreachable so the build never fails.
    async getPrerenderParams() {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10_000);
        const res = await fetch(`${GCS_BASE}/articles/index.json`, { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const articles: { slug: string }[] = await res.json();
        return articles.map(a => ({ slug: a.slug }));
      } catch (e) {
        console.warn('[SSR] GCS index.json unavailable, falling back to hardcoded slugs:', e);
        return FALLBACK_SLUGS.map(slug => ({ slug }));
      }
    },
  },
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'blog', renderMode: RenderMode.Prerender },
  { path: 'services', renderMode: RenderMode.Prerender },
  { path: 'dataservices', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Prerender }
];
