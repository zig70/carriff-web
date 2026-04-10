import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set currentYear to the current year', () => {
    expect(component.currentYear).toBe(new Date().getFullYear());
  });

  it('should render the current year in the copyright notice', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.footer-copy')?.textContent).toContain(
      String(new Date().getFullYear())
    );
  });

  it('should render the company registration number', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.footer-copy')?.textContent).toContain('NI694330');
  });

  it('should render a contact email link', () => {
    const el: HTMLElement = fixture.nativeElement;
    const emailLink = el.querySelector('a[href^="mailto:"]');
    expect(emailLink).not.toBeNull();
    expect(emailLink?.getAttribute('href')).toContain('carriffgroup.co.uk');
  });

  it('should render a Blog nav link', () => {
    const el: HTMLElement = fixture.nativeElement;
    const links = Array.from(el.querySelectorAll('nav a'));
    expect(links.some((a) => a.textContent?.trim() === 'Blog')).toBe(true);
  });
});
