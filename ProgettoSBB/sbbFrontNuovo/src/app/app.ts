import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopMenu } from './top-menu/top-menu';
import { FilterBar } from './filter-bar/filter-bar';
import { CopyRight } from './copyright/copy-right';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopMenu, FilterBar, CopyRight],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('superiorbb');
}
