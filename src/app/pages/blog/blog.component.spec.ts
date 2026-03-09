import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { BlogComponent } from './blog.component';
import { SeoService } from '../../seo.service';
import { ArticleService } from '../../services/article.service';

const mockArticles = [
  { slug: 'article-1', title: 'Article One', category: 'Data Governance', summary: 'Summary 1', imageUrl: 'img1.webp', publishedAt: '2025-01-01' },
  { slug: 'article-2', title: 'Article Two', category: 'AI & Automation', summary: 'Summary 2', imageUrl: 'img2.webp', publishedAt: '2025-02-01' },
  { slug: 'article-3', title: 'Article Three', category: 'AI & Automation', summary: 'Summary 3', imageUrl: 'img3.webp', publishedAt: '2025-03-01' },
  { slug: 'article-4', title: 'Article Four', category: 'Case Studies', summary: 'Summary 4', imageUrl: 'img4.webp', publishedAt: '2025-04-01' },
  { slug: 'article-5', title: 'Article Five', category: 'Digital Transformation', summary: 'Summary 5', imageUrl: 'img5.webp', publishedAt: '2025-05-01' },
  { slug: 'article-6', title: 'Article Six', category: 'Data Governance', summary: 'Summary 6', imageUrl: 'img6.webp', publishedAt: '2025-06-01' },
];

describe('BlogComponent', () => {
  let component: BlogComponent;
  let fixture: ComponentFixture<BlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogComponent],
      providers: [
        provideRouter([]),
        { provide: SeoService, useValue: { setStaticTags: vi.fn(), generateTags: vi.fn() } },
        { provide: ArticleService, useValue: { getArticleList: vi.fn().mockReturnValue(of(mockArticles)) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show all articles on init', () => {
    expect(component.filteredArticles.length).toBe(mockArticles.length);
    expect(component.activeFilter).toBe('All Articles');
  });

  it('should filter by AI & Automation', () => {
    component.filterArticles('AI & Automation');
    const expected = mockArticles.filter(a => a.category === 'AI & Automation');
    expect(component.filteredArticles.length).toBe(expected.length);
    expect(component.filteredArticles.every(a => a.category === 'AI & Automation')).toBe(true);
  });

  it('should filter by Data Governance', () => {
    component.filterArticles('Data Governance');
    const expected = mockArticles.filter(a => a.category === 'Data Governance');
    expect(component.filteredArticles.length).toBe(expected.length);
    expect(component.filteredArticles.every(a => a.category === 'Data Governance')).toBe(true);
  });

  it('should restore all articles when switching back to All Articles', () => {
    component.filterArticles('AI & Automation');
    component.filterArticles('All Articles');
    expect(component.filteredArticles.length).toBe(mockArticles.length);
    expect(component.activeFilter).toBe('All Articles');
  });

  it('should update activeFilter on each call', () => {
    component.filterArticles('Case Studies');
    expect(component.activeFilter).toBe('Case Studies');
    component.filterArticles('Digital Transformation');
    expect(component.activeFilter).toBe('Digital Transformation');
  });

  it('should not mutate allArticles when filtering', () => {
    const originalLength = component.allArticles.length;
    component.filterArticles('Data Governance');
    expect(component.allArticles.length).toBe(originalLength);
  });

  describe('getArticleSlug', () => {
    it('lowercases and hyphenates a simple title', () => {
      expect(component.getArticleSlug('Hello World')).toBe('hello-world');
    });

    it('preserves numbers', () => {
      expect(component.getArticleSlug('The 5 Pillars')).toBe('the-5-pillars');
    });

    it('strips special characters', () => {
      expect(component.getArticleSlug('AI & Automation: A Guide')).toBe('ai-automation-a-guide');
    });

    it('collapses multiple whitespace into a single dash', () => {
      expect(component.getArticleSlug('hello   world')).toBe('hello-world');
    });

    it('generates the correct slug for a real article title', () => {
      const slug = component.getArticleSlug('What we have been listening to in 2025');
      expect(slug).toBe('what-we-have-been-listening-to-in-2025');
    });
  });
});
