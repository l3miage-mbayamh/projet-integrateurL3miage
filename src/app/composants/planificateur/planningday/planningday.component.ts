import { Component, inject } from '@angular/core';
import { ListCommandeComponent } from './list-commande/list-commande.component';
import {MatBottomSheet,MatBottomSheetModule, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { JourneeComponent } from './journee/journee.component';
import {MatDialog} from '@angular/material/dialog'

@Component({
  selector: 'app-planningday',
  templateUrl: './planningday.component.html',
  styleUrl: './planningday.component.css'
})
export class PlanningdayComponent {
//element pour ajouter une journee qui fera appel au composant journee
public readonly journee = inject(MatDialog)

  addDay(): void{
    this.journee.open(JourneeComponent,  {height: '250px',
      width: '500px'})
  }

}
