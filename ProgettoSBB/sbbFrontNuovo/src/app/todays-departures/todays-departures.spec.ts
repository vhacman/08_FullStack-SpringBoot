import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysDepartures } from './todays-departures';

describe('TodaysDepartures', () => {
  let component: TodaysDepartures;
  let fixture: ComponentFixture<TodaysDepartures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodaysDepartures]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodaysDepartures);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
