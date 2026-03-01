import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarHeader } from './calendar-header';

describe('CalendarHeader', () => {
  let component: CalendarHeader;
  let fixture: ComponentFixture<CalendarHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
