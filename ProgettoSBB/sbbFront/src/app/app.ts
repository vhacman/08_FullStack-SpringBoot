import { Component, computed, signal } from '@angular/core';
import { City } from './model/city';
import { TopMenu } from "./top-menu/top-menu";
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [TopMenu, RouterOutlet, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
    bornIn = signal<City | null>(null);
    diedIn = signal<City | null>(null);

}
