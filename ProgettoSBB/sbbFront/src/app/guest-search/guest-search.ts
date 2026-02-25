import { Component, inject, signal } from '@angular/core';
import { GuestService } from '../guest-service';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Guest } from '../model/hotel.entities';
import { GuestPreview } from '../guest-preview/guest-preview';

@Component({
  selector: 'app-guest-search',
  imports: [FormsModule, GuestPreview],
  templateUrl: './guest-search.html',
  styleUrl: './guest-search.css',
})
export class GuestSearch {

    guestService = inject(GuestService);
    loading = signal<boolean>(false);
    results = signal<Guest[]>([]);
    errors = signal<string>("");
    key:string = "";

    findMatches():void{
        if(this.key.length<4)
            return;

        this.loading.set(true);
        this.guestService
            .findBySurname(this.key)
            .pipe(
                finalize(()=>this.loading.set(false)), 
            )
            .subscribe(
            {
                next:json=>
                {
                    this.results.set(json);
                },
                error:error=>this.errors.set(error)
            }
        );
    }

}
