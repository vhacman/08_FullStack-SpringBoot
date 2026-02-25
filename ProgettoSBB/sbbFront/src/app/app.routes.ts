import { Routes } from '@angular/router';
import { TodayArrivals } from './today-arrivals/today-arrivals';
import { RefundCalculator } from './refund-calculator/refund-calculator';
import { TodayDepartures } from './today-departures/today-departures';

export const routes: Routes = [
    { path: 'arrivals', component: TodayArrivals },
    { path: 'departures', component: TodayDepartures },
    { path: 'refund', component: RefundCalculator },
];
