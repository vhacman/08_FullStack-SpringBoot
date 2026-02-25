// In TypeScript non esiste enum come in Java, ma si usa un "union type":
// la variabile può essere SOLO uno dei valori elencati, altrimenti TypeScript
// segnala un errore in fase di compilazione.
export type PetSex = 'MALE' | 'FEMALE';

// PetStatus aggiunto perché il backend restituisce questo campo nel PetDTO.
// Rispecchia l'enum Java PetStatus (AVAILABLE | ADOPTED).
export type PetStatus = 'AVAILABLE' | 'IN_PROGRESS' | 'ADOPTED';

// L'interface definisce la "forma" dell'oggetto Pet che arriva dal backend come JSON.
// TypeScript usa questa definizione per verificare che i dati abbiano i campi giusti.
export interface Pet {
    id:number;
    name:string;
    species:string;
    age:number;
    notes:string;
    sex:PetSex;
    // status aggiunto per allineare il modello TypeScript alla risposta reale dell'API,
    // che include questo campo a differenza del precedente mock pet.json.
    status:PetStatus;
    // true se l'animale è sterilizzato; corrisponde al campo boolean Java nell'entità
    sterilized:boolean;
    // Data di arrivo nel rifugio, serializzata da Spring come stringa 'YYYY-MM-DD'
    arrivalDate:string;
}