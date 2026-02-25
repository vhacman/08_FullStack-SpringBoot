import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayArrivals } from './today-arrivals';

describe('TodayArrivals', () => {
  let component: TodayArrivals;
  let fixture: ComponentFixture<TodayArrivals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayArrivals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayArrivals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
