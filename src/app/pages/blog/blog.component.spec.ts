import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { BlogComponent } from './blog.component';
import { SeoService } from '../../seo.service';

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
        // blogResolver pre-fetches articles; tests simulate the resolved route data.
        { provide: ActivatedRoute, useValue: { snapshot: { data: { articles: mockArticles } } } },
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
});
