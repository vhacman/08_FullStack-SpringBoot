import { Component, inject, signal } from '@angular/core';
import { TicketService } from '../services/ticket-service';
import { Ticket } from '../model/entities';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialog } from './confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-ticket-search',
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './ticket-search.html',
  styleUrl: './ticket-search.css',
})
export class TicketSearch
{
  // ticketService gestisce le chiamate HTTP verso /vcm/api/tickets
  private   ticketService = inject(TicketService);
  // MatDialog è il servizio Angular Material per aprire finestre modali
  private   dialog = inject(MatDialog);
  // signal che contiene la lista dei biglietti: quando cambia, il template si aggiorna da solo
  tickets      = signal<Ticket[]>([]);
  errorMessage = signal<string>('');

  // nomi delle colonne della tabella — devono corrispondere ai matColumnDef nel template
  columns = ['id', 'date', 'visitor', 'price', 'seller', 'actions'];

  // il costruttore sostituisce ngOnInit: con inject() tutti i servizi sono già disponibili
  // quando il costruttore viene eseguito, quindi load() può essere chiamato direttamente
  constructor() {
    this.load();
  }

  // carica tutti i biglietti dal backend e li mette nel signal
  load(): void {
    const request = this.ticketService.findAll(); // costruisce la richiesta GET /tickets
    request.subscribe({
      next:  (data) => this.tickets.set(data),    // al successo: aggiorna il signal con i dati ricevuti
      error: ()     => this.errorMessage.set('Errore durante il caricamento dei biglietti.') // al fallimento: mostra il messaggio d'errore
    });
  }

  // safe delete: apre il dialog di conferma prima di eliminare
  // così evitiamo cancellazioni accidentali con un semplice click
  safeDelete(id: number): void {
    const ref = this.dialog.open(ConfirmDialog); // apre la modale di conferma e salva il riferimento

    // afterClosed() è un Observable che emette il valore passato a dialogRef.close()
    // true = l'utente ha confermato, false/undefined = ha annullato
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {                                    // procedo solo se l'utente ha confermato
        const request = this.ticketService.delete(id);   // costruisce la richiesta DELETE /tickets/{id}
        request.subscribe({
          next:  () => this.load(), // al successo: ricarico la lista per riflettere l'eliminazione
          error: () => this.errorMessage.set('Errore durante la cancellazione.') // al fallimento: messaggio d'errore
        });
      }
    });
  }

  // Chiama il backend per ottenere il file XML, poi delega il download a downloadBlob()
  exportAllAsXml(): void
  {
    const filename = `tickets.${this.getLoggedUsername()}.xml`; // es. tickets.llaurah.xml
    this.ticketService.exportAllAsXml().subscribe({              // lancia la richiesta GET /tickets/export/xml
      next:  (blob) => this.downloadBlob(blob, filename),        // al successo: scarica con il nome personalizzato
      error: ()     => this.errorMessage.set('Errore durante l\'esportazione.') // al fallimento: messaggio d'errore
    });
  }

  // Crea un link <a> virtuale per scaricare un Blob come file senza aprire nuove tab.
  // Riutilizzabile per qualsiasi esportazione futura (es. CSV, PDF...)
  private downloadBlob(blob: Blob, filename: string): void
  {
    const url = window.URL.createObjectURL(blob); // crea un URL temporaneo in memoria che punta al Blob
    const a   = document.createElement('a');      // crea un elemento <a> virtuale, non aggiunto al DOM
    a.href     = url;                             // imposta l'URL del Blob come destinazione del link
    a.download = filename;                        // specifica il nome con cui il file verrà salvato
    a.click();                                    // simula il click sul link per avviare il download
    window.URL.revokeObjectURL(url);              // libera la memoria: l'URL temporaneo non serve più
  }

  private getLoggedUsername(): string
  {
    const token = localStorage.getItem('token') ?? '';
    console.log('token grezzo:', token);          // controlla che il token ci sia
    if (!token)
      return 'unknown';
    const payload = token.split('.')[1];
    console.log('payload Base64:', payload);      // controlla che la split funzioni
    const decoded = JSON.parse(atob(payload));
    console.log('payload decodificato:', decoded); // vedi tutti i campi disponibili
    return decoded['username'] ?? 'unknown';
  }


}
