import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityRooms } from './availability-rooms';

describe('AvailabilityRooms', () => {
  let component: AvailabilityRooms;
  let fixture: ComponentFixture<AvailabilityRooms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilityRooms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailabilityRooms);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
