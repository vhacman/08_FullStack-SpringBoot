import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { AvailabilityRooms } from './availability-rooms/availability-rooms';

export const routes: Routes = [
    {path:'', component: HomePage},
    {path:'rooms', component: AvailabilityRooms}
];
