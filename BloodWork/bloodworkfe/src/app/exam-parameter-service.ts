import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ExamParameter } from './model/Entities';

@Injectable({
  providedIn: 'root',
})
export class ExamParameterService {
  
    // inietto httpClient dentro ExamParameterService
    // Autowired
    http = inject(HttpClient);
    apiURL = "http://localhost:8080/bloodwork/api/examparameters";

    // QUESTO è un signal WRITABLE. Il resto del mondo potrebbe
    // SOVRASCRIVERLO
    private _examsParameters = signal<ExamParameter[]>([]);
    // ESPONGO UNA VERSIONE PUBBLICA READ ONLY
    public examsParameters = this._examsParameters.asReadonly();
    // il metodo readOnly produce un riferimento al signal su cui lo invoco
    // ma di tipo read only, quindi senza i metodi update e set
    // asReadOnly PRODUCE un signal read only che punta allo stesso signal di quello originale

    /**
     *  WritableSignal extends Signal
     *  private WritableSignal a = new WriteableSignal();
     *  public Signal b = (Signal) a;
     *  il mondo esterno non può chiamare set o update
     * 
     */

    // quando lancio il servizio carico tutti i parametri
    constructor(){
        this.fetchAll();
    }

    // fetchAll riempie il signal
    public fetchAll():void{
        this
            .http
            .get<ExamParameter[]>(this.apiURL)
            .subscribe
            (
                // imposto il valore del mio signal
                json=>this._examsParameters.set(json)
            );
    }


    public insert(parameter:ExamParameter):void{
        // si legge: fai una fetch di tipo post e invia il parameter
        this
            .http
            .post<ExamParameter>(this.apiURL, parameter)
            .subscribe(

                // ho inserito un nuovo parametro
                // dovrei ricaricare la lista.. ma è stupido
                newParameter =>
                {
                    // ho inserito un nuovo parametro (esempio colesterolo)
                    // il nuovo parametro mi è stato restituito sotto forma di json (newParameter)
                    // invece di ricaricare la lista che avevo caricato prima
                    // la aggiorno (update)
                    // v=> vecchio valore
                    // nuovo valore: [newParameter, ...v]
                    // il nuovo valore è un VETTORE nuovo
                    // che ha come primo elemento il parametro appena inserito
                    // e poi copia tutti i valori del vecchio vettore
                    // tramite i tre puntini (spread operator anche detto operatore di copia)
                    this._examsParameters.update(v=>[newParameter, ...v])
                    // DOPO AVERE AGGIORNATO LA LISTA SUL SERVER LA AGGIORNO SUL CLIENT
                }
            );
    }

}
