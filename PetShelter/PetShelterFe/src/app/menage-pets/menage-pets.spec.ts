import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenagePets } from './menage-pets';

describe('MenagePets', () => {
  let component: MenagePets;
  let fixture: ComponentFixture<MenagePets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenagePets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenagePets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
