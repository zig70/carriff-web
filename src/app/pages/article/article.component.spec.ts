import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ArticleComponent } from './article.component';
import { SeoService } from '../../seo.service';
import { DOMPURIFY_TOKEN } from '../../providers/dompurify-token';

const mockSeoService = { generateTags: vi.fn(), setStaticTags: vi.fn() };

const mockArticle = {
  slug: 'what-we-have-been-listening-to-in-2025',
  title: 'What we have been listening to in 2025',
  category: 'Digital Transformation',
  summary: 'A little bit of help to breakdown the AI bubble.',
  imageUrl: 'assets/blog-thumbnails/topofthepops.webp',
  publishedAt: '2025-01-01',
  fullContent: '<p>Test content</p>',
};

// Simulate articleResolver resolved data — article is pre-fetched before component activates.
function makeRoute(article: typeof mockArticle | null = null) {
  return {
    data: of({ article }),
  };
}

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;

  async function setup(article: typeof mockArticle | null = null) {
    await TestBed.configureTestingModule({
      imports: [ArticleComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: makeRoute(article) },
        { provide: SeoService, useValue: mockSeoService },
        { provide: DOMPURIFY_TOKEN, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create', async () => {
    await setup();
    expect(component).toBeTruthy();
  });

  it('should have no article when resolver returns null', async () => {
    await setup(null);
    expect(component.article).toBeUndefined();
  });

  it('should load article when resolver provides it', async () => {
    await setup(mockArticle);
    expect(component.article).toBeDefined();
    expect(component.article?.title).toContain('listening to in 2025');
  });

  it('should leave article undefined when resolver returns null (e.g. on fetch error)', async () => {
    await setup(null);
    expect(component.article).toBeUndefined();
  });

  it('should call seoService.generateTags when article is found', async () => {
    await setup(mockArticle);
    expect(mockSeoService.generateTags).toHaveBeenCalledOnce();
  });

  it('should not call seoService.generateTags when resolver returns null', async () => {
    await setup(null);
    expect(mockSeoService.generateTags).not.toHaveBeenCalled();
  });

  it('should populate article fullContent as SafeHtml when found', async () => {
    await setup(mockArticle);
    expect(component.article?.fullContent).toBeTruthy();
  });
});
