import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestSearch } from './guest-search';

describe('GuestSearch', () => {
  let component: GuestSearch;
  let fixture: ComponentFixture<GuestSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
