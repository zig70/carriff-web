# CLAUDE.md — Carriff Digital Web

## Project Overview
Angular 21 SSR website for Carriff Digital, a data & digital transformation consultancy. Deployed on Google Cloud Run via Docker.

## Tech Stack
- **Framework**: Angular 21 (standalone components, SSR via Angular Universal)
- **Server**: Express.js 5 wrapping `AngularNodeAppEngine`
- **Deployment**: Docker → GCP Artifact Registry → Cloud Run (region: europe-west2)
- **CI/CD**: GitHub Actions with Workload Identity Federation (no long-lived SA keys)
- **Node version**: 20 (builder) / 20-slim (runner)

## Key Commands
```bash
npm run start          # Local dev server (no SSR)
npm run dev:ssr        # Local dev with SSR
npm run build:ssr      # Production build
npm run serve:ssr      # Build + serve production locally
npm run prerender      # Prerender all static routes
npm test               # Vitest unit tests (Angular test builder)
npm run test:e2e       # Playwright e2e tests (starts ng serve automatically)
npm run test:e2e:ui    # Playwright interactive UI mode
npm run test:e2e:debug # Playwright step-through debugger
```

## Testing
- **Unit tests**: Vitest via `@angular/build:unit-test`, specs in `src/**/*.spec.ts`
  - Use `imports: [ComponentName]` (standalone) — NOT `declarations`
  - Mock `SeoService` with `{ provide: SeoService, useValue: { setStaticTags: vi.fn() } }`
  - `vi.fn()` is available globally from `"types": ["vitest/globals"]` in `tsconfig.spec.json`
- **E2E tests**: Playwright, specs in `e2e/*.spec.ts`, config in `playwright.config.ts`
  - Playwright starts `ng serve` automatically via `webServer` config
  - Run `npx playwright install chromium` once before first e2e run if browsers aren't installed

## Project Structure
```
src/
  server.ts                    # Express entry point (HTTPS redirect, compression, static files)
  main.ts / main.server.ts     # Angular bootstrap (client / server)
  app/
    app.config.ts              # Client providers
    app.config.server.ts       # Server providers (SSR + prerender routes)
    app.routes.ts              # Client routes
    app.routes.server.ts       # Server routes with RenderMode (Prerender)
    seo.service.ts             # Canonical tags, OG tags, JSON-LD schema
    providers/
      dompurify-token.ts       # DI token for DOMPurify
      server-sanitizer.factory.ts  # Server-side DOMPurify via jsdom
    pages/
      blog/blog.component.ts   # Article listing — DATA IS HARDCODED HERE (see plan.md)
      article/article.component.ts  # Article detail — DATA IS HARDCODED HERE (see plan.md)
      home/ about/ contact/ services/ dataservices/ not-found/
    shared/
      header/ footer/
```

## Critical Architecture Notes

### Blog Content (Active Tech Debt)
All blog articles are hardcoded as TypeScript arrays in:
- `blog.component.ts` — `allArticles[]` (metadata only: title, category, summary, link, imageUrl)
- `article.component.ts` — `mockArticles[]` (full HTML content inline as template literals)
- `app.routes.server.ts` imports `allArticles` to generate prerender slugs at build time

**To add a new article**: edit both TS files and redeploy. See `plan.md` for the migration plan.

### Security
- HTML content in articles uses `DomSanitizer.bypassSecurityTrustHtml()` — safe because content is developer-authored, but must stay controlled (no user input ever reaches this path)
- DOMPurify is wired up for browser but currently falls through to unsanitized on SSR (`sanitizedHtmlString = foundArticle.fullContent as string`) — acceptable while content is static/trusted
- HTTPS enforced via `x-forwarded-proto` check in `server.ts` (GCP sets this header)

### Prerendering
All routes are set to `RenderMode.Prerender`. The `articles/:slug` route uses `getPrerenderParams()` which reads from `allArticles` at build time. When content moves to a DB/bucket, this function will need to fetch slugs at build time from that source.

### Deployment
- Push to `main` → GitHub Actions → builds Docker image → pushes to Artifact Registry → deploys to Cloud Run
- Image tag: `europe-west2-docker.pkg.dev/carriffdigital/carriffdigital-web/carriff-angular-web:latest`
- GCP auth uses Workload Identity Federation (secrets: `WIF_PROVIDER`, `GCP_SERVICE_ACCOUNT`, `GCP_PROJECT_ID`, `GCP_REGION`, `ARTIFACT_REGISTRY_REPO`)

## Development Conventions
- Angular standalone components (no NgModule)
- Prettier with `printWidth: 100`, single quotes
- SCSS for all styles
- Services are `providedIn: 'root'`
- Slug generation: `title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')`
  - Same function exists in 3 places — consolidate to a shared util if touching this code

## MCP Servers
- **context7**: Provides up-to-date docs for Angular, Express, etc. Use before working with any library API.
