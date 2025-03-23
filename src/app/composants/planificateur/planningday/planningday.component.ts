import { Component, inject, model, signal } from '@angular/core';
import { ListCommandeComponent } from './list-commande/list-commande.component';
import {MatBottomSheet,MatBottomSheetModule, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { JourneeComponent } from './journee/journee.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog'


@Component({
  selector: 'app-planningday',
  templateUrl: './planningday.component.html',
  styleUrl: './planningday.component.css'
})
export class PlanningdayComponent {
//element pour ajouter une journee qui fera appel au composant journee
public readonly journee = inject(MatDialog)
public readonly entrepot = model<string>()
public readonly date = model<string>() 
public readonly dayName = model<string>("j001")




  addDay(): void{
  const dialogRef =  this.journee.open(JourneeComponent, {
    data: {jour: this.dayName(),entrepot: this.entrepot(),date: this.date()}, height: '250px',
      width: '500px'
   })
   dialogRef.afterClosed().subscribe(result => {
    if (result !== undefined) {
      this.entrepot.set(result);
      
    }
  });
  }

}
