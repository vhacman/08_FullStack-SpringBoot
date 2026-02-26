import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestPicker } from './guest-picker';

describe('GuestPicker', () => {
  let component: GuestPicker;
  let fixture: ComponentFixture<GuestPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestPicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestPicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
