# Improvement Plan — Carriff Digital Web

Priority order: **High** → **Medium** → **Low**

---

## 1. Blog Content — Move to GCS Bucket (High)

**Problem**: All article content is hardcoded in TypeScript source files. Adding or editing an article requires a code change and full CI/CD redeploy (~5 mins). The article HTML (~300+ lines) lives in TypeScript template literals.

**Recommended approach: GCS bucket with JSON files**

Why GCS over Firestore for this use case:
- Articles are read-only at runtime (no writes from the app)
- Full prerendering already happens at build time — just need the data accessible during `ng build`
- JSON files in a bucket are simpler to author, edit, and version in Git (or a CMS)
- Zero SDK cost; fetched with plain `fetch()` or `@google-cloud/storage`
- Easier to seed from existing TypeScript data

**Target structure**:

```
gs://carriffdigital-content/
  articles/
    what-we-have-been-listening-to-in-2025.json
    beyond-chatbots-using-ai-for-hyper-personalized-marketing.json
    the-5-pillars-of-modern-data-governance-framework.json
    ...
  index.json     ← article metadata list (title, category, summary, slug, imageUrl)
```

**Article JSON schema**:
```json
{
  "slug": "what-we-have-been-listening-to-in-2025",
  "title": "What we have been listening to in 2025",
  "category": "Digital Transformation",
  "summary": "A little bit of help to breakdown the AI bubble.",
  "imageUrl": "assets/blog-thumbnails/topofthepops.webp",
  "publishedAt": "2025-01-01",
  "fullContent": "<p>...</p>"
}
```

**Implementation steps**:

1. **Create GCS bucket** `carriffdigital-content` (or similar), set public read on `articles/` and `index.json`
2. **Migrate existing articles**: convert the 6 `mockArticles` entries to JSON files, upload to bucket
3. **Create `ArticleService`** (`src/app/services/article.service.ts`):
   - `getArticleList(): Observable<ArticleMeta[]>` — fetches `index.json`
   - `getArticle(slug: string): Observable<Article>` — fetches `articles/{slug}.json`
   - Use Angular's `HttpClient` (add `provideHttpClient(withFetch())` to `app.config.ts`)
4. **Update `BlogComponent`**: replace `allArticles[]` constant with `ArticleService.getArticleList()`
5. **Update `ArticleComponent`**: replace `mockArticles[]` lookup with `ArticleService.getArticle(slug)`
6. **Update `app.routes.server.ts`**: `getPrerenderParams()` must fetch `index.json` at build time
   - Use Node's `fetch()` (available in Node 18+) or `@google-cloud/storage` SDK
7. **Remove hardcoded data** from `blog.component.ts` and `article.component.ts`
8. **Update `app.config.ts`**: add `provideHttpClient(withFetch())` for SSR-compatible HTTP

**Alternative: Firestore** (choose if you need draft/publish workflow or CMS-like querying)
- More operational overhead (SDK, IAM, Firestore rules)
- Better if you want to add a headless CMS or admin UI later
- `getPrerenderParams()` would use the Firestore Admin SDK at build time

---

## 2. HTTP Security Headers (High)

**Problem**: No security headers are set. Browser gets no CSP, no framing protection, no MIME sniffing protection.

**Add to `server.ts`** (or use `helmet` package):

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],  // Angular needs inline scripts initially
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      frameSrc: ["https://open.spotify.com"],    // Spotify embeds in articles
      connectSrc: ["'self'"],
    }
  },
  crossOriginEmbedderPolicy: false,  // Required for Spotify iframes
}));
```

At minimum (before full CSP audit), add these headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

**Effort**: ~1 hour. Install `helmet`, add 5 lines to `server.ts`.

---

## 3. Fix SSR DOMPurify Bypass (High)

**Problem**: In `article.component.ts`, the SSR path skips DOMPurify sanitisation:
```typescript
} else {
  // Server: avoid window, use fallback or skip sanitisation
  sanitizedHtmlString = foundArticle.fullContent as string;  // ← UNSANITIZED
}
```
Then immediately: `this.sanitizer.bypassSecurityTrustHtml(sanitizedHtmlString)`

The `server-sanitizer.factory.ts` and `ssr.utils.ts` files exist with a working jsdom+DOMPurify server implementation — but they're not wired up to `ArticleComponent`.

**Fix**:
1. Provide `DOMPURIFY_TOKEN` in `app.config.server.ts` using `getDomPurifyServerInstance()` from `server-sanitizer.factory.ts`
2. Use the injected `this.domPurifyInstance` in `fetchArticleData()` for both browser and server paths

**Effort**: ~30 minutes. The infrastructure is already built.

---

## 4. Slug Utility — Remove Duplication (Medium)

**Problem**: The slug generation function is copy-pasted in 3 files:
- `blog.component.ts` → `getArticleSlug()`
- `article.component.ts` → `formatSlug()`
- `app.routes.server.ts` → `getArticleSlug()`

**Fix**: Extract to `src/app/utils/slug.utils.ts`:
```typescript
export function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
}
```
Import in all three locations. This also fixes the current inconsistency where `blog.component.ts` uses the slug for routing but the article data has an explicit `slug` field that may not always match.

**Effort**: ~15 minutes.

---

## 5. Versioned Docker Image Tags (Medium)

**Problem**: CI always pushes `:latest`. Rolling back requires rebuilding.

**Fix in `.github/workflows/main.yml`**:
```yaml
env:
  IMAGE_TAG: ${{ github.sha }}

# Tag with both commit SHA and latest
tags: |
  europe-west2-docker.pkg.dev/.../carriff-angular-web:${{ github.sha }}
  europe-west2-docker.pkg.dev/.../carriff-angular-web:latest
```

Then deploy using `${{ github.sha }}` tag. Rollback = redeploy previous SHA.

**Effort**: ~15 minutes.

---

## 6. Lazy Loading Routes (Medium)

**Problem**: All page components are eagerly imported in `app.routes.ts`. The initial bundle includes all page code.

**Fix**: Convert to lazy routes:
```typescript
{ path: 'blog', loadComponent: () => import('./pages/blog/blog.component').then(m => m.BlogComponent) },
{ path: 'articles/:slug', loadComponent: () => import('./pages/article/article.component').then(m => m.ArticleComponent) },
// etc.
```

**Impact**: Smaller initial bundle, faster first paint. Important once article content moves to the DB (otherwise the lazy-loaded component still imports all articles).

**Effort**: ~20 minutes.

---

## 7. Remove Committed Build Artefact (Low)

**Problem**: `src/dist/carriff-web/server/server.js` appears to be a committed build output.

**Fix**:
1. Verify the file is not intentionally tracked (it shouldn't be — `dist/` is in `.gitignore` but `src/dist/` is not)
2. Add `src/dist/` to `.gitignore`
3. `git rm --cached src/dist/carriff-web/server/server.js`

---

## 8. Fix `.gitignore` — Protect `.env` Files (Low)

**Problem**: `.gitignore` excludes `env` (directory) but not `.env` or `.env.*` files.

**Fix**: Add to `.gitignore`:
```
.env
.env.*
!.env.example
```

---

## 9. Default OG / Description Meta in `index.html` (Low)

**Problem**: The `<head>` in `index.html` has no default `<meta name="description">` or OG tags. On the first client navigation to a page before SeoService runs, there are no tags.

**Fix**: Add sensible defaults to `index.html`:
```html
<meta name="description" content="Carriff Digital — data governance, AI automation, and digital transformation consulting.">
<meta property="og:title" content="Carriff Digital">
<meta property="og:description" content="Data governance, AI automation, and digital transformation consulting.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://carriffdigital.com">
```

---

## 10. Blog Article `link: '#'` Placeholder (Low)

**Problem**: In `blog.component.ts`, all articles have `link: '#'` — the `link` field is unused (routing uses slug-generated URL). The `Article` interface has a `link` field that's never read by the template.

**Fix**: Remove the `link` field from the `Article` interface and all article objects in `blog.component.ts`, as the `RouterLink` uses `getArticleSlug(article.title)` directly.

---

## Summary Table

| # | Item | Priority | Effort | Impact |
|---|------|----------|--------|--------|
| 1 | Blog content → GCS bucket | **High** | 1–2 days | Eliminates deploy-to-publish coupling |
| 2 | HTTP security headers | **High** | 1 hour | Closes XSS/framing attack surface |
| 3 | Fix SSR DOMPurify bypass | **High** | 30 min | Correct sanitisation on SSR path |
| 4 | Slug utility deduplication | Medium | 15 min | Eliminates divergence risk |
| 5 | Versioned Docker tags | Medium | 15 min | Enables clean rollbacks |
| 6 | Lazy load routes | Medium | 20 min | Smaller initial bundle |
| 7 | Remove committed dist artefact | Low | 10 min | Clean repo |
| 8 | `.gitignore` `.env` protection | Low | 5 min | Prevents accidental secret commit |
| 9 | Default OG meta in index.html | Low | 15 min | SEO completeness |
| 10 | Remove unused `link` field | Low | 10 min | Code clarity |
