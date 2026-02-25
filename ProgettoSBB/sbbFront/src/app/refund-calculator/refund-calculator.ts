import { Component, computed, signal } from '@angular/core';
import { City } from '../model/city';
import { CityInput } from '../city-input/city-input';

@Component({
  selector: 'app-refund-calculator',
  imports: [CityInput],
  templateUrl: './refund-calculator.html',
  styleUrl: './refund-calculator.css',
})
export class RefundCalculator {

    // preparo due signal che saranno messi in comune coi figli
    // ho un signal che potrebbe contenere una città
    home = signal<City | null>(null);

    work = signal<City | null>(null);

    refund = computed<number>(()=> {
                if(!this.home())
                    return 0;
                if(!this.work())
                    return 0;
                if(this.home()!.name != this.work()!.name)
                    return 100;
                return 0;
            });


}
