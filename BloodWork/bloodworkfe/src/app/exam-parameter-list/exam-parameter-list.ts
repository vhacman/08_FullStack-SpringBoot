import { Component, computed, inject } from '@angular/core';
import { ExamParameterService } from '../exam-parameter-service';

@Component({
  selector: 'app-exam-parameter-list',
  imports: [],
  templateUrl: './exam-parameter-list.html',
  styleUrl: './exam-parameter-list.css',
})
export class ExamParameterList {
    //  devo caricare i parametri dal backend
    // ma non posso farlo io, DEVO passare dal service

    examParameterService = inject(ExamParameterService);

    // prendo un riferimento ai dati caricati dal db
    examParameters = this.examParameterService.examsParameters;

    count = computed(()=>
    {
        console.log("Ricalcolo");
        return this.examParameters().length;
    });

}
