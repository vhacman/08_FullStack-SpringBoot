import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysArrivals } from './todays-arrivals';

describe('TodaysArrivals', () => {
  let component: TodaysArrivals;
  let fixture: ComponentFixture<TodaysArrivals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodaysArrivals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodaysArrivals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
