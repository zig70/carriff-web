import { ServerRoute, RenderMode } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Blog and article pages use Server rendering so Angular SSR waits for the
  // GCS HttpClient fetch to complete before serialising HTML. Prerender was
  // causing a race condition: native fetch() in withFetch() isn't tracked by
  // Zone.js during the build-time prerender step, so Angular serialised the
  // empty template before the GCS response arrived.
  { path: 'articles/:slug', renderMode: RenderMode.Server },
  { path: 'blog', renderMode: RenderMode.Server },

  // Static/marketing pages have no async data — prerender them at build time.
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'services', renderMode: RenderMode.Prerender },
  { path: 'dataservices', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: 'intelligent-automation', renderMode: RenderMode.Prerender },
  { path: 'travel-insurance-ai', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Prerender },
];
