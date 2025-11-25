import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Article {
  title: string;
  category: string;
  summary: string;
  imageUrl: string;
  fullContent: string; // <-- Added property for the full content
  slug: string;        // <-- Added property for linking/finding
}

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
article: Article | undefined; 

  // Inject ActivatedRoute into the constructor
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // 1. Subscribe to changes in the URL parameters
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.fetchArticleData(slug);
      }
    });
  }

  // --- MOCK DATA SOURCE (Replace with a real service later) ---
  private mockArticles: Article[] = [
    {
      title: 'The 5 Pillars of a Modern Data Governance Framework',
      category: 'Data Governance',
      summary: 'An essential guide...',
      imageUrl: 'assets/blog-thumbnails/datagovblogimage.png',
      // Ensure the slug matches the URL path!
      slug: 'the-5-pillars-of-modern-data-governance-framework', 
      fullContent: `<h2>Defining Data Ownership</h2><p>This section discusses the organizational setup...</p>...` 
    },
    // ... Add all your other articles here with unique slugs ...
  ];
  // -------------------------------------------------------------

  /**
   * Finds the article data based on the URL slug.
   * @param slug The article slug from the URL.
   */
  fetchArticleData(slug: string): void {
    // 2. Find the article in your data array
    const foundArticle = this.mockArticles.find(a => this.formatSlug(a.title) === slug);
    
    if (foundArticle) {
      this.article = foundArticle;
    } else {
      // Handle 404 error if article is not found
      console.error('Article not found for slug:', slug);
      // Optionally redirect to a 404 page
    }
  }

  // Helper function to ensure consistency between your link slugs and your data slugs
  private formatSlug(title: string): string {
    return title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
  }
}
