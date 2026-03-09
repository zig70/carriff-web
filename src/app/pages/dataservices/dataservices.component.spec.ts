import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DataservicesComponent } from './dataservices.component';
import { SeoService } from '../../seo.service';

describe('DataservicesComponent', () => {
  let component: DataservicesComponent;
  let fixture: ComponentFixture<DataservicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataservicesComponent],
      providers: [
        provideRouter([]),
        { provide: SeoService, useValue: { setStaticTags: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
