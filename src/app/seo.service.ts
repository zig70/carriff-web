import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

// Define a simple interface for static page data
export interface StaticPageMeta {
  title: string;
  description: string;
  url: string; // The path (e.g., 'about', 'services')
  image?: string; // Optional image for social sharing
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly domain = 'https://carriffdigital.com';

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document // Inject Document to handle Link tags
  ) {}

  /**
   * Generates and updates the necessary SEO and Open Graph meta tags for a dynamic article page.
   * This is critical for both Search Engine Optimization and social media sharing previews.
   * @param articleData The full article data object containing title, summary, slug, and image URL.
   */
  generateTags(articleData: any): void {
    const canonicalUrl = `${this.domain}/articles/${articleData.slug}`;

    // Use the appropriate property for the content summary
    const descriptionContent = articleData.summary ||
                               articleData.fullContent.substring(0, 150) + '...';

    // --- 1. Basic SEO Tags ---

    // Set the Title Tag
    this.title.setTitle(articleData.title + ' | Carriff Digital');

    // Set the Description Meta Tag (Crucial for snippets)
    this.meta.updateTag({
      name: 'description',
      content: descriptionContent
    });

    // Set Canonical URL (Cleaned up URL formatting)
    this.meta.updateTag({
      rel: 'canonical',
      href: canonicalUrl
    });

    this.updateCanonicalLink(canonicalUrl);
    // --- 2. Open Graph (OG) Tags for Social Media Sharing ---

    this.meta.updateTag({ property: 'og:title', content: articleData.title });
    this.meta.updateTag({ property: 'og:description', content: descriptionContent });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:image', content: articleData.imageUrl });

    // --- 3. Twitter Card Tags ---

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: articleData.title });
    this.meta.updateTag({ name: 'twitter:description', content: descriptionContent });
    this.meta.updateTag({ name: 'twitter:image', content: articleData.imageUrl });

    this.injectSchema(articleData, canonicalUrl);
  }

  /**
   * Sets meta tags for static pages (Home, About, Services).
   * @param pageMeta The metadata object for the current static page.
   */
  setStaticTags(pageMeta: StaticPageMeta): void {
    const canonicalUrl = `${this.domain}/${pageMeta.url}`;

    // --- 1. Basic SEO Tags ---
    this.title.setTitle(pageMeta.title + ' | Carriff Digital');
    this.meta.updateTag({ name: 'description', content: pageMeta.description });
    this.meta.updateTag({ rel: 'canonical', href: canonicalUrl });

    // --- 2. Open Graph (OG) Tags ---
    this.meta.updateTag({ property: 'og:title', content: pageMeta.title });
    this.meta.updateTag({ property: 'og:description', content: pageMeta.description });
    this.updateCanonicalLink(canonicalUrl);
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' }); // Default type for static pages

    if (pageMeta.image) {
      this.meta.updateTag({ property: 'og:image', content: pageMeta.image });
      this.meta.updateTag({ name: 'twitter:image', content: pageMeta.image });
    }

    // --- 3. Twitter Card Tags ---
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageMeta.title });
    this.meta.updateTag({ name: 'twitter:description', content: pageMeta.description });
  }

  // Helper to correctly manage <link rel="canonical">
  private updateCanonicalLink(url: string) {
    let link: HTMLLinkElement | null = this.document.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  // Helper to inject JSON-LD Schema
  private injectSchema(articleData: any, url: string) {
    const existingSchema = this.document.getElementById('article-schema');
    if (existingSchema) { existingSchema.remove(); }

    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": articleData.title,
      "image": `${this.domain}/${articleData.imageUrl}`,
      "author": { "@type": "Organization", "name": "Carriff Digital" },
      "url": url
    };

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'article-schema';
    script.text = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }
}
