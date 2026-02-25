import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamParameterList } from './exam-parameter-list';

describe('ExamParameterList', () => {
  let component: ExamParameterList;
  let fixture: ComponentFixture<ExamParameterList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamParameterList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamParameterList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
