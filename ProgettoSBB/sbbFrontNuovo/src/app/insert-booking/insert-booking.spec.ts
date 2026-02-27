import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertBooking } from './insert-booking';

describe('InsertBooking', () => {
  let component: InsertBooking;
  let fixture: ComponentFixture<InsertBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsertBooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsertBooking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
