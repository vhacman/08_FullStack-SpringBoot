import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundCalculator } from './refund-calculator';

describe('RefundCalculator', () => {
  let component: RefundCalculator;
  let fixture: ComponentFixture<RefundCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefundCalculator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefundCalculator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
