import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopMenu } from './top-menu/top-menu';
import { FilterBar } from './filter-bar/filter-bar';
import { CopyRight } from './copyright/copy-right';

/**
 * Componente radice dell'applicazione. Definisce la struttura fissa della pagina:
 * barra superiore → navigazione → contenuto (RouterOutlet) → footer.
 * RouterOutlet è il segnaposto dove Angular inserisce il componente
 * corrispondente alla route attiva, senza ricaricare il resto della pagina.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopMenu, FilterBar, CopyRight],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('superiorbb');
}
