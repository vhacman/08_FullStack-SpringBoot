import { Component, output } from '@angular/core';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.html',
  styleUrl: './menubar.css'
})
export class MenuBar {
  // output<string>() crea un canale di comunicazione dal figlio al genitore.
  // Quando il MenuBar vuole "avvisare" l'App di quale voce è stata cliccata,
  // chiama .emit() su questo output: il componente padre (App) riceve la stringa
  // e decide cosa mostrare tramite onMenuChange().
  menuChange = output<string>();

  // Ogni metodo emette una stringa diversa che identifica quale sezione aprire.
  // La stringa deve corrispondere esattamente a quella controllata in app.ts
  // (es. menu === 'pet').
  onInsertPet(): void {
    this.menuChange.emit('pet');
  }

  onInsertAdoption(): void {
    this.menuChange.emit('adoption');
  }

  onManagePets(): void {
    this.menuChange.emit('manage');
  }
}
