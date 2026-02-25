import { WritableSignal } from "@angular/core";

export interface ExamParameter {
    id?:number;
    name:string;
    min:number;
    max:number;
    unit:string;
    notes:string;
}

export interface ExamParameterReading {
    id:number;
    parameter:ExamParameter;
    value:WritableSignal<number>
}

export interface Exam {
    id:number;
    ssn:string;
    readings:ExamParameterReading[];
    date:string;
    price:number;
}