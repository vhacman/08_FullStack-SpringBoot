import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertQuickBooking } from './insert-quick-booking';

describe('InsertQuickBooking', () => {
  let component: InsertQuickBooking;
  let fixture: ComponentFixture<InsertQuickBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsertQuickBooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsertQuickBooking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
