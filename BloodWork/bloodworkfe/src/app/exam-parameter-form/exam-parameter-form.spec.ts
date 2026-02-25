import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamParameterForm } from './exam-parameter-form';

describe('ExamParameterForm', () => {
  let component: ExamParameterForm;
  let fixture: ComponentFixture<ExamParameterForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamParameterForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamParameterForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
