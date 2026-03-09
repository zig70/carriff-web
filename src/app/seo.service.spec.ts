import { TestBed } from '@angular/core/testing';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let titleService: Title;
  let metaService: Meta;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeoService],
    });
    service = TestBed.inject(SeoService);
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setStaticTags', () => {
    it('should set the page title with site suffix', () => {
      service.setStaticTags({ title: 'About', description: 'About us', url: 'about' });
      expect(titleService.getTitle()).toBe('About | Carriff Digital');
    });

    it('should set the description meta tag', () => {
      service.setStaticTags({ title: 'Blog', description: 'Our articles', url: 'blog' });
      const desc = metaService.getTag('name="description"');
      expect(desc?.content).toBe('Our articles');
    });

    it('should set og:title', () => {
      service.setStaticTags({ title: 'Services', description: 'What we do', url: 'services' });
      const ogTitle = metaService.getTag('property="og:title"');
      expect(ogTitle?.content).toBe('Services');
    });

    it('should set og:type to website for static pages', () => {
      service.setStaticTags({ title: 'About', description: 'About us', url: 'about' });
      const ogType = metaService.getTag('property="og:type"');
      expect(ogType?.content).toBe('website');
    });

    it('should set og:url using the full domain', () => {
      service.setStaticTags({ title: 'Contact', description: 'Contact us', url: 'contact' });
      const ogUrl = metaService.getTag('property="og:url"');
      expect(ogUrl?.content).toBe('https://carriffdigital.com/contact');
    });
  });

  describe('generateTags', () => {
    const mockArticle = {
      title: 'Test Article',
      summary: 'A test summary',
      slug: 'test-article',
      imageUrl: 'assets/blog-thumbnails/test.webp',
      category: 'AI & Automation',
    };

    it('should set the article title with site suffix', () => {
      service.generateTags(mockArticle);
      expect(titleService.getTitle()).toBe('Test Article | Carriff Digital');
    });

    it('should set og:type to article', () => {
      service.generateTags(mockArticle);
      const ogType = metaService.getTag('property="og:type"');
      expect(ogType?.content).toBe('article');
    });

    it('should set the canonical URL to the articles path', () => {
      service.generateTags(mockArticle);
      const document = TestBed.inject(DOCUMENT);
      const canonical = document.querySelector("link[rel='canonical']");
      expect(canonical?.getAttribute('href')).toBe(
        'https://carriffdigital.com/articles/test-article'
      );
    });

    it('should set twitter:card to summary_large_image', () => {
      service.generateTags(mockArticle);
      const twitterCard = metaService.getTag('name="twitter:card"');
      expect(twitterCard?.content).toBe('summary_large_image');
    });

    it('should inject a JSON-LD script tag', () => {
      service.generateTags(mockArticle);
      const document = TestBed.inject(DOCUMENT);
      const schema = document.getElementById('article-schema');
      expect(schema).not.toBeNull();
      const parsed = JSON.parse(schema!.textContent!);
      expect(parsed['@type']).toBe('BlogPosting');
      expect(parsed.headline).toBe('Test Article');
    });

    it('should remove and re-inject the schema script on repeat calls', () => {
      service.generateTags(mockArticle);
      service.generateTags({ ...mockArticle, title: 'Second Article', slug: 'second-article' });
      const document = TestBed.inject(DOCUMENT);
      const schemas = document.querySelectorAll('#article-schema');
      expect(schemas.length).toBe(1);
      const parsed = JSON.parse(schemas[0].textContent!);
      expect(parsed.headline).toBe('Second Article');
    });
  });
});
