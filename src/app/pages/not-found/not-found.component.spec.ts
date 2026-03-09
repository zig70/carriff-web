import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a link back to home', () => {
    const el: HTMLElement = fixture.nativeElement;
    const homeLink = el.querySelector('a[routerLink="/"], a[href="/"]');
    expect(homeLink).not.toBeNull();
  });

  it('should render an h1 error message', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')).not.toBeNull();
  });
});
