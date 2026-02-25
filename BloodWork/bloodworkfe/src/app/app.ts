import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExamParameterForm } from './exam-parameter-form/exam-parameter-form';
import { ExamParameterList } from "./exam-parameter-list/exam-parameter-list";

@Component({
  selector: 'app-root',
  imports: [ExamParameterForm, ExamParameterList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bloodworkfe');
}
