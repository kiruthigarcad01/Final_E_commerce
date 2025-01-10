import { ComponentFixture, TestBed } from '@angular/core/testing';

import { customerHomeComponent } from './customer-home.component';

describe('customerHomeComponent', () => {
  let component: customerHomeComponent;
  let fixture: ComponentFixture<customerHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [customerHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(customerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
