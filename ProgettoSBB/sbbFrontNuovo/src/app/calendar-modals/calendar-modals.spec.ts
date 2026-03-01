import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarModals } from './calendar-modals';

describe('CalendarModals', () => {
  let component: CalendarModals;
  let fixture: ComponentFixture<CalendarModals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarModals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarModals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
