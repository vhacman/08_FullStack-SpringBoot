import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopMenu } from "./top-menu/top-menu";
import { CopyRight } from "./copy-right/copy-right";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopMenu, CopyRight],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('superiorbb');
}
