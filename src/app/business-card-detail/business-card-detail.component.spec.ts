import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCardDetailComponent } from './business-card-detail.component';

describe('BusinessCardDetailComponent', () => {
  let component: BusinessCardDetailComponent;
  let fixture: ComponentFixture<BusinessCardDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessCardDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessCardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
