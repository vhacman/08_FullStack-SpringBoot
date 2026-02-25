import { Component, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityService } from '../city-service';
import { City } from '../model/city';
import { debounceTime, finalize } from 'rxjs';

@Component({
  selector: 'app-city-input',
  imports: [FormsModule],
  templateUrl: './city-input.html',
  styleUrl: './city-input.css',
})
export class CityInput {

    // importo il cityService, che chiamerà una api specifica
    // che ho creato sulla porta 3001
    cityService = inject(CityService);    

    // input=> signal di input, monodirezionale, dal padre al figlio
    label = input<string>("");

    // model si traduce con InputOutput
    city = model<City | null>(null);

    // queste sono le città che ho caricato dal database
    // quando l'utente ha cliccato su tab, quando è uscito dalla casella di testo
    results = signal<City[]>([]);
    
    // questo è un signal che conterrà eventuali errori di lettura
    // e li stamperò...
    errors = signal<String>("");

    // quando l'utente preme sul pulsante
    // il componente entra in stato di loading
    // e disabilito il pulsante
    // o in generale, se sto caricando non voglio avviare un'altra
    // chiamata http
    loading = signal<boolean>(false);

    // l'utente ha selezionato una città
    // gli impedisco di modificarla dopo averla selezionata a meno che 
    // non faccia doppio click sulla città
    // con doppio click viene cancellata
    // selected viene rimesso a false
    selected = signal<boolean>(false);

    // chiave di filtro... contenuto della casella di testo
    key:string="";
    
    // find city viene invocato quando l'utente cambia il valore di key
    // e in key ci sono almeno 3 caratteri
    findCity():void{
        
        if(this.key.length<3)
            return;
        
        this.loading.set(true);
        // gli observable sono MODIFICABILI
        // posso modificare il comportamento del flusso di dati
        this.cityService
            .findCitiesByName(this.key)
            .pipe(
                // piping: derivare un observable migliore
                // a partire da uno di base
                finalize(()=>this.loading.set(false))
            )
            .subscribe({
                    next:json=>
                    {
                        // ho caricato le mie città
                        // le imposto in results
                        this.results.set(json);
                        console.log(json.length);
                        if(json.length==1)
                            this.selectCity(json[0]);
                    },
                    error:error=>this.errors.set(error)
            });
    }

    selectCity(result:City):void{
        this.city.set(result); // e avviserà mio padre...
        this.results.set([]);
        this.key = result.name+" "+result.province+" "+result.region;
        this.selected.set(true);

    }

    deselect():void{
        this.city.set(null);
        this.selected.set(false);
        this.key = "";
    }

}
