import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

export interface ArticleMeta {
  slug: string;
  title: string;
  category: string;
  summary: string;
  imageUrl: string;
  publishedAt: string;
}

export interface Article extends ArticleMeta {
  fullContent: string;
}

const GCS_BASE = 'https://storage.googleapis.com/carriffdigital-content';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private http = inject(HttpClient);

  /** Returns empty array on failure so the blog page degrades gracefully. */
  getArticleList(): Observable<ArticleMeta[]> {
    return this.http.get<ArticleMeta[]>(`${GCS_BASE}/articles/index.json`).pipe(
      retry(1),
      catchError(() => of([] as ArticleMeta[])),
    );
  }

  /** Retries once on transient failure; errors propagate for the caller to handle. */
  getArticle(slug: string): Observable<Article> {
    return this.http.get<Article>(`${GCS_BASE}/articles/${slug}.json`).pipe(
      retry(1),
    );
  }
}
