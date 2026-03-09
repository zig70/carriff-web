import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ArticleService, ArticleMeta } from '../services/article.service';

/**
 * Fetches the article list before BlogComponent activates.
 * Angular's router tracks resolvers as pending navigation tasks, so SSR
 * waits for the GCS response before rendering — articles are in the HTML
 * on first load AND on client-side navigation.
 */
export const blogResolver: ResolveFn<ArticleMeta[]> = () =>
  inject(ArticleService)
    .getArticleList()
    .pipe(catchError(() => of([] as ArticleMeta[])));
