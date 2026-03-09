import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
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
  imports: [RouterLink, NgOptimizedImage]
})
export class ArticleComponent implements OnInit {
  article: ArticleDisplay | undefined;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private seoService: SeoService,
    private articleService: ArticleService,
  ) {}

  domPurifyInstance: any = inject(DOMPURIFY_TOKEN, { optional: true });

  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.fetchArticleData(slug);
      }
    });
  }

  fetchArticleData(slug: string): void {
    this.articleService.getArticle(slug).subscribe({
      next: (foundArticle) => {
        this.seoService.generateTags(foundArticle);
        let sanitizedHtmlString: string;

        if (isPlatformBrowser(this.platformId)) {
          if ((window as any).DOMPurify) {
            sanitizedHtmlString = (window as any).DOMPurify.sanitize(foundArticle.fullContent);
          } else {
            sanitizedHtmlString = foundArticle.fullContent;
          }
        } else {
          sanitizedHtmlString = foundArticle.fullContent;
        }

        const safeContent = this.sanitizer.bypassSecurityTrustHtml(sanitizedHtmlString);
        this.article = { ...foundArticle, fullContent: safeContent };
      },
      error: (err) => {
        console.error('Article not found for slug:', slug, err);
      }
    });
  }
}
