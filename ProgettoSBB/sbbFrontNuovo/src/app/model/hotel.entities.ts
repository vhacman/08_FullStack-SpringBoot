/**
 * Rappresenta un ospite registrato nel sistema di prenotazione.
 */
export interface Guest
{
  id?          : number;
  firstName    : string;
  lastName     : string;
  ssn          : string;
  dob?         : Date;
  address      : string;
  city         : string;
}

/**
 * Stati possibili di una camera.
 * Usiamo un union type invece di un enum TypeScript perché il JSON che arriva
 * dal backend è già una stringa ("AVAILABLE", "OCCUPIED", "TO_CLEAN"):
 * il union type permette confronti diretti (room.status === 'AVAILABLE')
 * senza conversioni, ed è la forma idiomatica in Angular per valori da API.
 *
 * Gli stati sono mutuamente esclusivi (non servono boolean separati):
 *   AVAILABLE → libera e pulita, pronta per nuovi ospiti
 *   OCCUPIED  → ospite attualmente in stanza (booking in CHECKED_IN)
 *   TO_CLEAN  → ospite uscito, camera da pulire (booking in CHECKED_OUT)
 */
export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'TO_CLEAN';

/**
 * Rappresenta una camera disponibile in un hotel.
 */
export interface Room
{
  id?          : number;
  name         : string;
  description  : string;
  basePrice    : number;
  hotelId      : number;
  // Stato corrente aggiornato automaticamente dal backend ad ogni transizione
  // di stato della prenotazione associata.
  status       : RoomStatus;
  // Data dell'ultima pulizia certificata. Nullable: le camere nuove non ce l'hanno.
  // Utile per mostrare "ultima pulizia: X giorni fa" e segnalare camere inattive.
  lastCleaned? : Date;
}

/**
 * Stati possibili di una prenotazione. Macchina a stati:
 *
 *   PENDING ──► CHECKED_IN ──► CHECKED_OUT ──► COMPLETE
 *      │
 *      └──────► CANCELED
 *
 * PENDING:     stato iniziale alla creazione, in attesa di accettazione.
 * CHECKED_IN:  prenotazione accettata, ospite in stanza. Room → OCCUPIED.
 * CANCELED:    prenotazione rifiutata da PENDING. Room non cambia.
 * CHECKED_OUT: ospite uscito (solo dal giorno di partenza). Room → TO_CLEAN.
 * COMPLETE:    camera pulita, ciclo concluso. Room → AVAILABLE + lastCleaned aggiornato.
 */
export type BookingStatus = 'PENDING' | 'CHECKED_IN' | 'CHECKED_OUT' | 'COMPLETE' | 'CANCELED';

/**
 * Rappresenta una prenotazione effettuata da un ospite per una camera.
 */
export interface Booking
{
  id?      : number;
  guestId  : number;
  roomId   : number;
  guest    : Guest;
  room     : Room;
  checkIn  : Date;
  checkOut : Date;
  notes    : string;
  status   : BookingStatus;
  price    : number;
  // "cleaned" rimosso: lo stato di pulizia è ora room.status (TO_CLEAN / AVAILABLE).
  // Tenerlo sulla prenotazione era semanticamente sbagliato: la pulizia è
  // una proprietà della camera, non di chi ci ha soggiornato.
}

/**
 * Rappresenta un hotel registrato nel sistema.
 */
export interface Hotel
{
  id       : number;
  name     : string;
  address  : string;
  city     : string;
}

/**
 * Rappresenta un utente autenticato nel sistema, associato a un hotel.
 */
export interface User
{
  id         : number;
  email      : string;
  firstName  : string;
  lastName   : string;
  role       : string;
  hotel      : Hotel;
}
