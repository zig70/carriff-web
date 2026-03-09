import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ArticleService, Article } from '../services/article.service';

/**
 * Fetches the full article before ArticleComponent activates.
 * Angular's router tracks resolvers as pending navigation tasks, so SSR
 * waits for the GCS response before rendering — article content is in the
 * HTML on first load AND on client-side navigation between articles.
 */
export const articleResolver: ResolveFn<Article | null> = (route: ActivatedRouteSnapshot) =>
  inject(ArticleService)
    .getArticle(route.paramMap.get('slug')!)
    .pipe(catchError(() => of(null)));
