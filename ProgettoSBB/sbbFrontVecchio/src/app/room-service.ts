import { Injectable, signal, computed } from '@angular/core';
import { Room } from './model/hotel.entities';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  // Stato privato per le stanze
  private _rooms = signal<Room[]>([]);
  
  // Segnali pubblici
  rooms = computed(() => this._rooms());
  totalRooms = computed(() => this._rooms().length);

  constructor() {
    // Inizializziamo con i dati mock
    this.generateMockData();
  }

  /**
   * READ ALL: Restituisce l'intera lista delle stanze.
   * In un'app reale con HTTP, qui faresti la get.
   */
  fetchAll(): Room[] {
    return this._rooms();
  }

  /**
   * CREATE: Aggiunge una nuova stanza
   */
  addRoom(newRoom: Room) {
    const nextId = Math.max(...this._rooms().map(r => r.id ?? 0), 0) + 1;
    const roomWithId = { ...newRoom, id: nextId };
    
    this._rooms.update(current => [...current, roomWithId]);
  }

  /**
   * UPDATE: Modifica una stanza esistente
   */
  updateRoom(updatedRoom: Room) {
    if (!updatedRoom.id) return;
    this._rooms.update(current => 
      current.map(r => r.id === updatedRoom.id ? { ...updatedRoom } : r)
    );
  }

  /**
   * DELETE: Rimuove una stanza
   */
  deleteRoom(id: number) {
    this._rooms.update(current => current.filter(r => r.id !== id));
  }

  /**
   * Inizializzazione di 5 stanze standard per l'hotel
   */
  private generateMockData() {
    const initialRooms: Room[] = [
    ];
    
    this._rooms.set(initialRooms);
  }
}