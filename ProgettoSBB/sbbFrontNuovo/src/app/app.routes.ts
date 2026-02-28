import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { AvailabilityRooms } from './availability-rooms/availability-rooms';
import { BookingList } from './booking-list/booking-list';
import { MenageGuests } from './menage-guests/menage-guests';
import { Calendar } from './calendar/calendar';

export const routes: Routes = [
    { path: '',          component: HomePage },
    { path: 'bookings',  component: BookingList },
    { path: 'rooms',     component: AvailabilityRooms },
    { path: 'guests',    component: MenageGuests },
    { path: 'calendar',  component: Calendar },
];
