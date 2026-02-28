import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { AvailabilityRooms } from './availability-rooms/availability-rooms';
import { BookingList } from './booking-list/booking-list';
import { MenageGuests } from './menage-guests/menage-guests';
import { Calendar } from './calendar/calendar';

/**
 * Definizione delle route dell'applicazione.
 * Ogni path corrisponde a una sezione della navbar (FilterBar).
 * Il path '' (root) carica la homepage con gli arrivi/partenze del giorno.
 */
export const routes: Routes = [
    { path: '',          component: HomePage },
    { path: 'bookings',  component: BookingList },
    { path: 'rooms',     component: AvailabilityRooms },
    { path: 'guests',    component: MenageGuests },
    { path: 'calendar',  component: Calendar },
];
