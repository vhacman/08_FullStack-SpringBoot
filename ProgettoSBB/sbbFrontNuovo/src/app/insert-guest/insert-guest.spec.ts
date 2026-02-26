import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertGuest } from './insert-guest';

describe('InsertGuest', () => {
  let component: InsertGuest;
  let fixture: ComponentFixture<InsertGuest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsertGuest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsertGuest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
