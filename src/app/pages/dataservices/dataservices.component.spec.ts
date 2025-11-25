import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataservicesComponent } from './dataservices.component';

describe('DataservicesComponent', () => {
  let component: DataservicesComponent;
  let fixture: ComponentFixture<DataservicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataservicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
