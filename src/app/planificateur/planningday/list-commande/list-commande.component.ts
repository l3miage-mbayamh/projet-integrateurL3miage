import { Component } from '@angular/core';

import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';

export interface PeriodicElement {
  Reference: string;
  position: number;
  Etat: string;
  Date_de_Creation: string;
  Client: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, Reference: "c001", Etat: "ouverte", Date_de_Creation: "04-01-2024", Client: "amartin@wan.fr" },
  { position: 2, Reference: "c002", Etat: "livrée", Date_de_Creation: "05-01-2024", Client: "azainab@m6.com" },
  { position: 3, Reference: "c003", Etat: "notée", Date_de_Creation: "09-01-2024", Client: "lsaleh@brt.fr" },
  { position: 4, Reference: "c004", Etat: "livrée", Date_de_Creation: "09-01-2024", Client: "lsaleh@brt.fr" },
  { position: 5, Reference: "c005", Etat: "livrée", Date_de_Creation: "11-01-2024", Client: "apascal@or.fr" },
  { position: 6, Reference: "c006", Etat: "livrée", Date_de_Creation: "02-02-2024", Client: "ssharma@but.org" },
  { position: 7, Reference: "c007", Etat: "livrée", Date_de_Creation: "02-02-2024", Client: "ssharma@but.org" },
  { position: 8, Reference: "c008", Etat: "livrée", Date_de_Creation: "02-02-2024", Client: "ykim@but.org" },
  { position: 9, Reference: "c009", Etat: "livrée", Date_de_Creation: "02-02-2024", Client: "agilles@sfr.fr" },
  { position: 10, Reference: "c010", Etat: "notée", Date_de_Creation: "02-02-2024", Client: "rlambert@lp.net" },
  { position: 11, Reference: "c011", Etat: "notée", Date_de_Creation: "02-02-2024", Client: "cmercier@hot.fr" },
  { position: 12, Reference: "c012", Etat: "notée", Date_de_Creation: "02-02-2024", Client: "lblanc@gm.fr" },
  { position: 13, Reference: "c013", Etat: "notée", Date_de_Creation: "02-02-2024", Client: "lsaleh@brt.fr" },
  { position: 14, Reference: "c014", Etat: "notée", Date_de_Creation: "03-02-2024", Client: "vmartino@lp.net" },
  { position: 15, Reference: "c015", Etat: "notée", Date_de_Creation: "03-02-2024", Client: "ldubois@wel.fr" },
  { position: 16, Reference: "c016", Etat: "livrée", Date_de_Creation: "03-02-2024", Client: "egiraud@lp.net" },
  { position: 17, Reference: "c017", Etat: "livrée", Date_de_Creation: "03-02-2024", Client: "ebernard@lp.net" },
  { position: 18, Reference: "c018", Etat: "livrée", Date_de_Creation: "03-02-2024", Client: "lblanc@gm.fr" },
  { position: 19, Reference: "c019", Etat: "livrée", Date_de_Creation: "03-02-2024", Client: "sshin@but.org" },
  { position: 20, Reference: "c020", Etat: "ouverte", Date_de_Creation: "05-02-2024", Client: "lguyot@lp.net" },
  { position: 21, Reference: "c021", Etat: "ouverte", Date_de_Creation: "05-02-2024", Client: "emarchand@ok.fr" },
  { position: 22, Reference: "c022", Etat: "ouverte", Date_de_Creation: "05-02-2024", Client: "amohed@brt.fr" },
  { position: 23, Reference: "c023", Etat: "livrée", Date_de_Creation: "05-02-2024", Client: "ssharma@but.org" },
  { position: 24, Reference: "c024", Etat: "livrée", Date_de_Creation: "05-02-2024", Client: "lgarnier@lp.net" },
  { position: 25, Reference: "c025", Etat: "livrée", Date_de_Creation: "05-02-2024", Client: "mmoh@m6.com" },
  { position: 26, Reference: "c026", Etat: "notée", Date_de_Creation: "05-02-2024", Client: "rbonnet@gm.fr" },
  { position: 27, Reference: "c027", Etat: "notée", Date_de_Creation: "05-02-2024", Client: "lmartin@or.fr" },
  { position: 28, Reference: "c028", Etat: "notée", Date_de_Creation: "05-02-2024", Client: "vmartin@lp.net" },
  { position: 29, Reference: "c029", Etat: "notée", Date_de_Creation: "05-02-2024", Client: "tdufour@sfr.fr" },
  { position: 30, Reference: "c030", Etat: "notée", Date_de_Creation: "05-02-2024", Client: "aduval@wan.fr" }
]
;

@Component({
 
  selector: 'app-list-commande',
  templateUrl: './list-commande.component.html',
  styleUrl: './list-commande.component.css'
})
export class ListCommandeComponent {
  displayedColumns: string[] = ['select', 'position', 'Etat', 'Date_de_Creation', 'Client'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  
 

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}


