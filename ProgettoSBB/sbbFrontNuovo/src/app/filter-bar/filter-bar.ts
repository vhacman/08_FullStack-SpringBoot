import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Barra di navigazione principale con i tab dell'applicazione.
 * RouterLink gestisce la navigazione senza ricaricare la pagina (SPA).
 * RouterLinkActive aggiunge automaticamente la classe "active" al tab
 * corrispondente alla route corrente, senza logica manuale.
 */
@Component({
  selector: 'app-filter-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.css',
})
export class FilterBar {}
