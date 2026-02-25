import { Component, input } from '@angular/core';
import { Guest } from '../model/hotel.entities';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-guest-preview',
  imports: [DatePipe],
  templateUrl: './guest-preview.html',
  styleUrl: './guest-preview.css',
})
export class GuestPreview {

    guest = input.required<Guest>();

}
