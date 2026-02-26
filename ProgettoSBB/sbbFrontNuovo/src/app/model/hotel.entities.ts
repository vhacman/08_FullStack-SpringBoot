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
 * Rappresenta una camera disponibile in un hotel.
 */
export interface Room
{
  id?          : number;
  name         : string;
  description  : string;
  basePrice    : number;
  hotelId      : number;
}

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
  from     : Date;
  to       : Date;
  notes    : string;
  status   : string;
  price    : number;
  cleaned  : boolean;
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
