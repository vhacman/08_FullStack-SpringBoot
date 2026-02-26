import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyRight } from './copy-right';

describe('CopyRight', () => {
  let component: CopyRight;
  let fixture: ComponentFixture<CopyRight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopyRight]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyRight);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
