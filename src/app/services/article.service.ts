import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  getArticleList(): Observable<ArticleMeta[]> {
    return this.http.get<ArticleMeta[]>(`${GCS_BASE}/articles/index.json`);
  }

  getArticle(slug: string): Observable<Article> {
    return this.http.get<Article>(`${GCS_BASE}/articles/${slug}.json`);
  }
}
