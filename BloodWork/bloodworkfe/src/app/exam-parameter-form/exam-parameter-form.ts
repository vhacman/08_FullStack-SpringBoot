import { Component, inject } from '@angular/core';
import { ExamParameter } from '../model/Entities';
import { FormsModule } from '@angular/forms';
import { ExamParameterService } from '../exam-parameter-service';

@Component({
  selector: 'app-exam-parameter-form',
  imports: [FormsModule],
  templateUrl: './exam-parameter-form.html',
  styleUrl: './exam-parameter-form.css',
})
export class ExamParameterForm {

    // autowired
    service = inject(ExamParameterService);

    newParameter:ExamParameter={
        name:"",
        notes:"",
        min:0,
        max:0,
        unit:""
    };

    saveParameter():void{
        this.service.insert(this.newParameter);
        this.newParameter = {
            name:"",
            notes:"",
            min:0,
            max:0,
            unit:""
        }
    }
        

}
