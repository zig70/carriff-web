import { ServerRoute, RenderMode } from '@angular/ssr';

const GCS_BASE = 'https://storage.googleapis.com/carriffdigital-content';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'articles/:slug',
    renderMode: RenderMode.Prerender,

    // Fetches slug list from GCS at build time to generate static pages
    async getPrerenderParams() {
      const res = await fetch(`${GCS_BASE}/articles/index.json`);
      const articles: { slug: string }[] = await res.json();
      return articles.map(a => ({ slug: a.slug }));
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
