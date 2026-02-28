import { Component } from '@angular/core';

/**
 * Componente footer con il copyright dell'applicazione.
 * Non ha logica: il contenuto è solo nel template HTML.
 * In Angular anche componenti "vuoti" come questo hanno senso
 * perché permettono di riutilizzare il footer in qualsiasi punto
 * del layout con un semplice <app-copy-right>.
 */
@Component({
  selector: 'app-copy-right',
  imports: [],
  templateUrl: './copy-right.html',
  styleUrl: './copy-right.css',
})
export class CopyRight {}
