import { Injectable, signal } from '@angular/core';
import { Pet } from './model/Pet';
import { HttpClient } from '@angular/common/http';

// @Injectable({ providedIn: 'root' }) registra questo service come singleton:
// Angular crea una sola istanza condivisa da tutti i componenti che lo iniettano.
// Questo permette a PetList, AdoptionForm e MenagePets di leggere gli stessi dati.
@Injectable({
  providedIn: 'root',
})
export class PetService {

  private readonly API = 'http://localhost:8080/petshelterbe/api/pets';

  // _pets è il signal "sorgente": può essere modificato solo all'interno del service.
  // pets (pubblico) è la versione readonly esposta ai componenti: possono leggerlo
  // ma non scriverlo direttamente, così il service rimane l'unico responsabile dei dati.
  private _pets = signal<Pet[]>([]);
  public pets = this._pets.asReadonly();

  private _suppressionList = signal<Pet[]>([]);
  public suppressionList = this._suppressionList.asReadonly();

  constructor(private http: HttpClient) {
    // Le chiamate GET nel constructor vengono eseguite all'avvio dell'app,
    // una sola volta, e popolano i signal con i dati ricevuti dal backend.
    // subscribe() è il metodo con cui ci "abboniamo" alla risposta HTTP asincrona.
    this.http.get<Pet[]>(this.API)
      .subscribe(json => this._pets.set(json));

    this.http.get<Pet[]>(`${this.API}/suppression-list`)
      .subscribe(json => this._suppressionList.set(json));
  }

  insert(pet: Pet): void {
    // POST per inserire un nuovo pet: quando il backend risponde con il pet salvato
    // (completo di ID generato), lo aggiungiamo alla lista locale con spread operator.
    this.http.post<Pet>(this.API, pet)
      .subscribe(saved => this._pets.update(list => [...list, saved]));
  }

  updateStatus(id: number, status: string): void {
    // PATCH per aggiornare solo lo status: il body è una stringa JSON (es. "IN_PROGRESS").
    // JSON.stringify aggiunge le virgolette necessarie per un JSON string valido.
    // In caso di errore lo logghiamo in console per facilitare il debug.
    this.http.patch<Pet>(`${this.API}/${id}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: updated =>
        // map sostituisce solo il pet aggiornato, lasciando invariati gli altri
        this._pets.update(list =>
          list.map(p => p.id === updated.id ? updated : p)
        ),
      error: err => console.error(`updateStatus(${id}, ${status}) failed:`, err)
    });
  }
}
