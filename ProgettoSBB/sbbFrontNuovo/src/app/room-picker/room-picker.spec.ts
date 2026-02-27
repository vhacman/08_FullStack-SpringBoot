import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomPicker } from './room-picker';

describe('RoomPicker', () => {
  let component: RoomPicker;
  let fixture: ComponentFixture<RoomPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomPicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomPicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
