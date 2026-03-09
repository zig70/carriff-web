# Architecture — Carriff Digital Web

## Overview

A server-side rendered Angular 21 website deployed as a containerised Node.js service on Google Cloud Run. All routes are prerendered at build time (SSG), so Cloud Run primarily serves static HTML and handles dynamic requests with Angular Universal SSR as fallback.

```
Browser ──HTTPS──► Cloud Run (europe-west1)
                      │
                      ▼
               Express.js server
                  │          │
            Static files   Angular SSR
            (1y max-age)   (AngularNodeAppEngine)
                              │
                         Prerendered HTML
                         (built at CI time)
```

---

## Layers

### 1. Infrastructure

| Component | Service | Notes |
|-----------|---------|-------|
| Hosting | GCP Cloud Run | Serverless containers, scales to zero |
| Container registry | GCP Artifact Registry | `europe-west1-docker.pkg.dev` |
| CI/CD | GitHub Actions | Triggers on push to `main` |
| Auth (CI→GCP) | Workload Identity Federation | No long-lived service account keys |

### 2. Application Server (`src/server.ts`)

Express.js 5 with three middleware layers:

1. **`compression()`** — gzip/brotli for all responses
2. **HTTPS redirect** — reads `x-forwarded-proto` header set by GCP load balancer; 301 redirect to `https://` if `http`
3. **Static file serving** — `express.static` from the Angular browser bundle (`/app/dist/browser`), `maxAge: 1y`, no directory indexing
4. **Angular SSR catch-all** — `AngularNodeAppEngine.handle(req)` for any request not matched by static files

Port: `process.env.PORT` (defaults to 8080 — Cloud Run standard).

### 3. Angular Application

| Area | Detail |
|------|--------|
| Angular version | 21 |
| Component model | Standalone components (no NgModules) |
| Rendering | SSR + full prerendering at build time |
| Client hydration | `provideClientHydration(withEventReplay())` |
| Routing | `@angular/router` with lazy-loadable structure (currently all eager) |
| Styling | SCSS with global `_variables.scss` |

#### Pages / Routes

| Path | Component | Render Mode |
|------|-----------|-------------|
| `/` | HomeComponent | Prerender |
| `/about` | AboutComponent | Prerender |
| `/services` | ServicesComponent | Prerender |
| `/dataservices` | DataservicesComponent | Prerender |
| `/blog` | BlogComponent | Prerender |
| `/articles/:slug` | ArticleComponent | Prerender (parameterised) |
| `/contact` | ContactComponent | Prerender |
| `/**` | NotFoundComponent | Prerender |

#### Shared Services

- **SeoService** (`seo.service.ts`): Manages `<title>`, description meta, canonical `<link>`, Open Graph tags, Twitter Card tags, and JSON-LD `BlogPosting` schema injection. Used by every page component.

#### HTML Sanitisation

Blog articles contain HTML content. Two-path sanitisation:

- **Browser**: `DOMPurify` (loaded globally) → `DomSanitizer.bypassSecurityTrustHtml()`
- **Server (SSR/prerender)**: Falls through to unsanitized string → `bypassSecurityTrustHtml()` — currently safe because content is developer-authored; **would be unsafe with user-generated content**

DOMPurify is injected via `DOMPURIFY_TOKEN` (`InjectionToken`) with a server factory using `jsdom`.

### 4. Content Storage (Current — Tech Debt)

All blog content lives in TypeScript source files:

```
blog.component.ts     → allArticles[]  (article metadata: title, category, summary, imageUrl)
article.component.ts  → mockArticles[] (full HTML content as template literals, ~330 lines)
app.routes.server.ts  → imports allArticles to generate prerender slugs at build time
```

**Problems with this approach:**
- Adding/editing an article requires a code change and full redeploy
- Article HTML is embedded as template literals in TypeScript — no syntax highlighting, no preview
- The build bundle includes all article content, growing indefinitely
- No content staging or draft workflow possible
- Slug generation function duplicated in 3 files

### 5. Build & Deployment Pipeline

```
git push → main
    │
    ▼
GitHub Actions (ubuntu-latest)
    ├── Checkout code
    ├── Authenticate to GCP (Workload Identity Federation)
    ├── Configure Docker for Artifact Registry
    ├── docker build (multi-stage)
    │     ├── Stage 1: node:20 — npm ci + ng build --configuration production
    │     └── Stage 2: node:20-slim — copy /dist, npm ci --omit=dev
    ├── docker push → Artifact Registry (:latest tag)
    └── gcloud run deploy → Cloud Run (europe-west1)
```

**Note**: The image is always tagged `:latest`. There is no versioned tagging, meaning rollbacks require manual intervention.

### 6. Assets

Static assets are in `src/assets/`:
- Blog thumbnails: `src/assets/blog-thumbnails/*.webp`
- General images: `*.webp`, `*.png`
- Favicons: `favicon.ico`, `favicon.svg`, `favicon-96x96.png`, `apple-touch-icon.png`
- Image optimisation script: `optimize-images.js` (uses `sharp`, run manually)

---

## Security Posture

### Strengths
- HTTPS enforced at server level (not just via TLS termination)
- No API keys in source code; CI uses Workload Identity Federation
- DOMPurify protects against XSS in browser
- Static prerendering reduces attack surface (no dynamic server-side execution per request)
- Docker multi-stage build — only production artefacts in final image
- `npm ci --omit=dev` in Docker runner stage

### Weaknesses / Risks

| Risk | Severity | Notes |
|------|----------|-------|
| SSR DOMPurify bypass | Medium | On SSR/prerender pass, HTML is not sanitised before `bypassSecurityTrustHtml()`. Safe while content is static, but a footgun if content source ever changes. |
| No Content Security Policy (CSP) headers | Medium | No `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, or `Referrer-Policy` headers set in Express |
| No rate limiting | Low | Cloud Run auto-scales but no request rate limiting at application level |
| `:latest` Docker tag | Low | No versioned image tags; rollback requires rebuilding |
| Slug function duplicated | Low | `getArticleSlug` exists in `blog.component.ts`, `article.component.ts`, and `app.routes.server.ts` — divergence risk |
| `index.html` missing OG/Twitter defaults | Low | `<head>` in `index.html` has no default OG or description meta — SeoService sets these at runtime, but prerendered HTML should have them |
| No `.env` file protection | Info | `.gitignore` excludes `env` directory but not `.env` files by name |
| `src/dist/` committed | Info | `src/assets/dist/carriff-web/server/server.js` appears to be a committed build artefact |

---

## Data Flow — Article Page

```
Build time:
  allArticles[] in blog.component.ts
        │
        ▼
  app.routes.server.ts getPrerenderParams()
        │
        ▼
  ng prerender → generates /articles/[slug].html for each article

Request time (browser hits prerendered URL):
  Cloud Run serves static /articles/[slug].html
        │
        ▼
  Angular hydration in browser
        │
        ▼
  ArticleComponent.ngOnInit()
        │
        ▼
  fetchArticleData(slug) — looks up mockArticles[] in memory
        │
        ▼
  DOMPurify.sanitize(fullContent) → bypassSecurityTrustHtml()
        │
        ▼
  [innerHTML]="article.fullContent"
```
