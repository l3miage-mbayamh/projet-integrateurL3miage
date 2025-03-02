import { Component } from '@angular/core';
import { ListCommandeComponent } from './list-commande/list-commande.component';
import {MatBottomSheet,MatBottomSheetModule, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-planningday',
  templateUrl: './planningday.component.html',
  styleUrl: './planningday.component.css'
})
export class PlanningdayComponent {
//element pour ajouter une journee qui fera appel au composant journee
 constructor(private journee : MatBottomSheet){}
  addDay(): void{
    this.journee.open(ListCommandeComponent)

  }

}
