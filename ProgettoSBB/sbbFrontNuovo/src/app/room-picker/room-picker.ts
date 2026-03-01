import {Component, inject, signal, input, output, effect} from '@angular/core';
import {RoomService} from '../APIservices/room/room-service';
import {UserLogicService} from '../APIservices/user/user-logic-service';
import {Room} from '../model/hotel.entities';

/**
 * Mostra le camere libere per un dato periodo.
 * Comunica col padre tramite input() (date in entrata) e output() (camera scelta in uscita).
 */
@Component({
  selector: 'app-room-picker',
  imports: [],
  templateUrl: './room-picker.html',
  styleUrl: './room-picker.css',
})
export class RoomPicker
{

  private roomService = inject(RoomService);
  private userLogicService = inject(UserLogicService);

  // input() = Signal in sola lettura alimentato dal padre; quando cambia, l'effect() rilancia la ricerca.
  checkIn = input<string | null>(null);
  checkOut = input<string | null>(null);
  resetTrigger = input<number>(0); // il padre lo incrementa per resettare la selezione

  roomSelected = output<Room>(); // output() = canale figlio → padre

  rooms = signal<Room[]>([]);
  searched = signal(false);  // true dopo la prima risposta HTTP: evita il flash vuoto iniziale
  selectedRoom = signal<Room | null>(null);

  constructor()
  {
    // effect() si ri-esegue automaticamente ogni volta che uno dei Signal letti cambia.
    // Qui leggiamo checkIn, checkOut e loggedUser: se uno qualsiasi di questi cambia
    // (es. l'utente modifica la data di check-out), Angular riesegue tutto il blocco.
    effect(() =>
    {
      const checkIn = this.checkIn();
      const checkOut = this.checkOut();
      const hotelId = this.userLogicService.loggedUser()?.hotel?.id;

      // Guard: se non abbiamo ancora tutti e tre i valori necessari per la ricerca,
      // svuotiamo la lista (per non mostrare risultati vecchi) e usciamo subito.
      // searched viene rimesso a false così il template nasconde la sezione finché
      // non arriva una risposta valida.
      if (!checkIn || !checkOut || !hotelId)
      {
        this.rooms.set([]);
        this.searched.set(false);
        return;
      }

      // Abbiamo tutto: chiediamo al backend le camere libere per questo hotel e questo periodo.
      this.roomService.getFreeRooms(hotelId, checkIn, checkOut).subscribe({
        next: result =>
        {
          // result ?? [] gestisce il caso (improbabile) in cui il backend risponda con null.
          this.rooms.set(result ?? []);
          // searched = true sblocca il template: da ora mostra la lista o il messaggio "nessuna camera".
          this.searched.set(true);
          // Resettiamo la selezione perché le date sono cambiate: la camera precedente
          // potrebbe non essere più disponibile nel nuovo periodo.
          this.selectedRoom.set(null);
        },
        error: err =>
        {
          console.error('Errore ricerca camere:', err);
          // In caso di errore HTTP mostriamo comunque la sezione (searched = true)
          // con lista vuota, così l'utente vede "nessuna camera" invece di uno schermo bloccato.
          this.rooms.set([]);
          this.searched.set(true);
        }
      });
    });

    // Secondo effect separato: scopo unico, resettare la selezione quando il padre lo chiede.
    effect(() =>
    {
      this.resetTrigger();
      this.selectedRoom.set(null);
    });
  }

  // Salva la camera scelta e la comunica al padre tramite emit().
  select(room: Room): void
  {
    this.selectedRoom.set(room);
    this.roomSelected.emit(room);
  }

  // Deseleziona senza ricaricare: le camere rimangono, solo la selezione sparisce.
  reset(): void
  {
    this.selectedRoom.set(null);
  }
}
