import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersDetailsComponent } from './customers-details.component';

describe('CustomersDetailsComponent', () => {
  let component: CustomersDetailsComponent;
  let fixture: ComponentFixture<CustomersDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomersDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
