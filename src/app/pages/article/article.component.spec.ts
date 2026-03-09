import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ArticleComponent } from './article.component';
import { SeoService } from '../../seo.service';
import { DOMPURIFY_TOKEN } from '../../providers/dompurify-token';
import { ArticleService } from '../../services/article.service';

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

function makeRoute(slug: string | null) {
  return {
    paramMap: of(convertToParamMap(slug ? { slug } : {})),
  };
}

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;

  async function setup(slug: string | null = null, articleServiceMock?: any) {
    const defaultMock = {
      getArticle: vi.fn().mockReturnValue(of(mockArticle)),
    };
    await TestBed.configureTestingModule({
      imports: [ArticleComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: makeRoute(slug) },
        { provide: SeoService, useValue: mockSeoService },
        { provide: DOMPURIFY_TOKEN, useValue: null },
        { provide: ArticleService, useValue: articleServiceMock ?? defaultMock },
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

  it('should have no article when no slug is provided', async () => {
    await setup(null);
    expect(component.article).toBeUndefined();
  });

  it('should load article for a known slug', async () => {
    await setup('what-we-have-been-listening-to-in-2025');
    expect(component.article).toBeDefined();
    expect(component.article?.title).toContain('listening to in 2025');
  });

  it('should leave article undefined when service errors', async () => {
    await setup('some-slug', {
      getArticle: vi.fn().mockReturnValue(throwError(() => new Error('Not found'))),
    });
    expect(component.article).toBeUndefined();
  });

  it('should call seoService.generateTags when article is found', async () => {
    await setup('what-we-have-been-listening-to-in-2025');
    expect(mockSeoService.generateTags).toHaveBeenCalledOnce();
  });

  it('should not call seoService.generateTags when no slug is provided', async () => {
    await setup(null);
    expect(mockSeoService.generateTags).not.toHaveBeenCalled();
  });

  it('should populate article fullContent as SafeHtml when found', async () => {
    await setup('what-we-have-been-listening-to-in-2025');
    expect(component.article?.fullContent).toBeTruthy();
  });
});
