import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ArticleComponent } from './article.component';
import { SeoService } from '../../seo.service';
import { DOMPURIFY_TOKEN } from '../../providers/dompurify-token';

const mockSeoService = { generateTags: vi.fn(), setStaticTags: vi.fn() };

function makeRoute(slug: string | null) {
  return {
    paramMap: of(convertToParamMap(slug ? { slug } : {})),
  };
}

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;

  async function setup(slug: string | null = null) {
    await TestBed.configureTestingModule({
      imports: [ArticleComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: makeRoute(slug) },
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

  it('should have no article when no slug is provided', async () => {
    await setup(null);
    expect(component.article).toBeUndefined();
  });

  it('should find the correct article for a known slug', async () => {
    await setup('what-we-have-been-listening-to-in-2025');
    expect(component.article).toBeDefined();
    expect(component.article?.title).toContain('listening to in 2025');
  });

  it('should resolve the Data Governance article by slug', async () => {
    await setup('the-5-pillars-of-modern-data-governance-framework');
    expect(component.article).toBeDefined();
    expect(component.article?.category).toBe('Data Governance');
  });

  it('should leave article undefined for an unknown slug', async () => {
    await setup('slug-that-does-not-exist');
    expect(component.article).toBeUndefined();
  });

  it('should call seoService.generateTags when article is found', async () => {
    await setup('what-we-have-been-listening-to-in-2025');
    expect(mockSeoService.generateTags).toHaveBeenCalledOnce();
  });

  it('should not call seoService.generateTags for an unknown slug', async () => {
    await setup('unknown-slug');
    expect(mockSeoService.generateTags).not.toHaveBeenCalled();
  });

  it('should populate article fullContent as SafeHtml when found', async () => {
    await setup('beyond-chatbots-using-ai-for-hyper-personalized-marketing');
    // SafeHtml is an object, not a plain string
    expect(component.article?.fullContent).toBeTruthy();
  });
});
