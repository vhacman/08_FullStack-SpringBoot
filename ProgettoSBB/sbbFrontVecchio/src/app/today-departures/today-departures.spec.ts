import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayDepartures } from './today-departures';

describe('TodayDepartures', () => {
  let component: TodayDepartures;
  let fixture: ComponentFixture<TodayDepartures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayDepartures]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayDepartures);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
