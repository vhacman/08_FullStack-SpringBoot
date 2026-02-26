import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingRow } from './booking-row';

describe('BookingRow', () => {
  let component: BookingRow;
  let fixture: ComponentFixture<BookingRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingRow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
