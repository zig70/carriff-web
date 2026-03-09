import { Component, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Subject, EMPTY } from 'rxjs';
import { switchMap, filter, takeUntil, catchError } from 'rxjs/operators';
import { DOMPURIFY_TOKEN } from '../../providers/dompurify-token';
import { SeoService } from './../../seo.service';
import { ArticleService, Article } from '../../services/article.service';

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
    private articleService: ArticleService,
  ) {}

  domPurifyInstance: any = inject(DOMPURIFY_TOKEN, { optional: true });

  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        filter(params => !!params.get('slug')),
        switchMap(params =>
          this.articleService.getArticle(params.get('slug')!).pipe(
            catchError(err => {
              console.error('Article not found:', err);
              return EMPTY;
            }),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(foundArticle => {
        this.seoService.generateTags(foundArticle);

        let sanitizedHtmlString: string;
        if (isPlatformBrowser(this.platformId) && (window as any).DOMPurify) {
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
