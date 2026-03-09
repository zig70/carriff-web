import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DOMPURIFY_TOKEN } from '../../providers/dompurify-token';
import { SeoService } from './../../seo.service';
import type { Article } from '../../services/article.service';

interface ArticleDisplay extends Omit<Article, 'fullContent'> {
  fullContent: string | SafeHtml;
}

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
})
export class ArticleComponent implements OnInit, OnDestroy {
  article: ArticleDisplay | undefined;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private seoService: SeoService,
  ) {}

  private domPurifyInstance: any = inject(DOMPURIFY_TOKEN, { optional: true });

  ngOnInit(): void {
    // Subscribe to route.data so we get a fresh article on every navigation
    // (including navigating between /articles/slug-a and /articles/slug-b).
    // articleResolver pre-fetches from GCS before the component activates —
    // foundArticle is already resolved, never undefined from an in-flight request.
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
      const foundArticle: Article | null = data['article'];
      if (!foundArticle) return;

      this.seoService.generateTags(foundArticle);

      let sanitizedHtmlString: string;
      if (this.domPurifyInstance) {
        sanitizedHtmlString = this.domPurifyInstance.sanitize(foundArticle.fullContent);
      } else if (typeof window !== 'undefined' && (window as any).DOMPurify) {
        sanitizedHtmlString = (window as any).DOMPurify.sanitize(foundArticle.fullContent);
      } else {
        sanitizedHtmlString = foundArticle.fullContent;
      }

      this.article = {
        ...foundArticle,
        fullContent: this.sanitizer.bypassSecurityTrustHtml(sanitizedHtmlString),
      };
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
