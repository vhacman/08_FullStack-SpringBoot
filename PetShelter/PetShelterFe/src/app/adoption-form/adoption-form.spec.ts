import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdoptionForm } from './adoption-form';

describe('AdoptionForm', () => {
  let component: AdoptionForm;
  let fixture: ComponentFixture<AdoptionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdoptionForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdoptionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
