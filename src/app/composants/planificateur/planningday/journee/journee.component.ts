import { Component, inject, Input, model, output, Signal } from '@angular/core';
import { CommandeService } from '../../../../services/commande.service';
import { EntrepotData } from '../../../../interfaces/entrepotData';
import { Journee } from '../../../../interfaces/journee';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent,MatDialogActions, MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-journee',
  templateUrl: './journee.component.html',
  styleUrl: './journee.component.css'
})
export class JourneeComponent {
//gestion d'entrepot
//injcetion de service
public readonly entrepotDataService = inject(CommandeService)
//liste d'entrepot depuis le service via server
public  entrepotData= model<EntrepotData[]>([])

public readonly dialogRef = inject(MatDialogRef<JourneeComponent>)
public readonly data = inject(MAT_DIALOG_DATA)
//choix entrepot pour la journee
//public readonly entrepotSelect = model(this.data.entrepot)
//public readonly date = model<Date>(new Date())
//liste des journee creer par le planificateur
public readonly journee = model<Journee>({nomJournee: "J00", nomEntrepot:"Brenis", date: new Date()})




//contucteur
constructor(){
  this.entrepotDataService.getEntrepotData().subscribe(result=>
    this.entrepotData.set(result)
  )
   // console.log(this.entrepotData);
}

//creer une journee


}