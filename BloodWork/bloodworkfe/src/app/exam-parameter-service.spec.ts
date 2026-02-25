import { TestBed } from '@angular/core/testing';

import { ExamParameterService } from './exam-parameter-service';

describe('ExamParameterService', () => {
  let service: ExamParameterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamParameterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
