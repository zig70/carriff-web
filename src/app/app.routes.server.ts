import { ServerRoute, RenderMode } from '@angular/ssr';
import { allArticles } from './pages/blog/blog.component'; // Data source

function getArticleSlug(title: string): string {
    return title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
}

export const serverRoutes: ServerRoute[] = [
  {
    path: 'articles/:slug',
    renderMode: RenderMode.Prerender, // We want these pages to be static (SSG)
    
    // This function runs at build time to tell the compiler which slugs to use
    async getPrerenderParams() {
      // Use the exported allArticles data
      const params = allArticles.map(article => ({
        slug: getArticleSlug(article.title)
      }));
      
      return params; // Returns [{ slug: 'what-we-have-been-listening-to-in-2025' }, ...]
    },
  },
  // Optionally, you can set other static routes to prerender here
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'blog', renderMode: RenderMode.Prerender },
  { path: 'services', renderMode: RenderMode.Prerender },
  { path: 'dataservices', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Prerender }
];