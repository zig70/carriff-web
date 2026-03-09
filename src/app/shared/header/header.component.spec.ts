import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with mobile menu closed', () => {
    expect(component.isMobileMenuOpen).toBe(false);
  });

  it('toggleMobileMenu should open the menu', () => {
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBe(true);
  });

  it('toggleMobileMenu should close the menu when called again', () => {
    component.toggleMobileMenu();
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBe(false);
  });

  it('closeMobileMenu should close an open menu', () => {
    component.isMobileMenuOpen = true;
    component.closeMobileMenu();
    expect(component.isMobileMenuOpen).toBe(false);
  });

  it('should render the brand name', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.brand-name')?.textContent).toContain('Carriff Digital');
  });

  it('should render a nav link for Blog', () => {
    const el: HTMLElement = fixture.nativeElement;
    const links = Array.from(el.querySelectorAll('nav a'));
    expect(links.some(a => a.textContent?.trim() === 'Blog')).toBe(true);
  });
});
