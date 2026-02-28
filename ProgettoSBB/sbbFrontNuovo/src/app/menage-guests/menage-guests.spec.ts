import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenageGuests } from './menage-guests';

describe('MenageGuests', () => {
  let component: MenageGuests;
  let fixture: ComponentFixture<MenageGuests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenageGuests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenageGuests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
