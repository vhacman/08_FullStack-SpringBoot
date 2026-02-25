import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestPreview } from './guest-preview';

describe('GuestPreview', () => {
  let component: GuestPreview;
  let fixture: ComponentFixture<GuestPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestPreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
