import { Component, inject, model, signal } from '@angular/core';
import { ListCommandeComponent } from './list-commande/list-commande.component';
import { MatBottomSheet, MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { JourneeComponent } from './journee/journee.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { Journee } from '../../../interfaces/journee';
import { PlanifierComponent } from './planifier/planifier.component';
import { livraison } from '../../../interfaces/Livraison';
import { Equipe } from '../../../interfaces/Equipes';
import { Commande } from '../../../interfaces/Commande';
import { CommandeService } from '../../../services/commande.service';
import { EntrepotData } from '../../../interfaces/entrepotData';


@Component({
  selector: 'app-planningday',
  templateUrl: './planningday.component.html',
  styleUrl: './planningday.component.css'
})
export class PlanningdayComponent {
  //element pour ajouter une journee qui fera appel au composant journee
  public readonly journeeService = inject(MatDialog)
  public readonly service = inject(CommandeService)
  //declaration de variable
  //journee
  public readonly entrepot = model<string>()
  public readonly date = model<Date>()
  public readonly dayName = model<string>()
  public readonly journee = model<Journee>()
  //tournee
  public readonly reference = model<string>()
  public readonly equipe = model<Equipe>()
  public readonly adresse = model<string>()
  public readonly commandes = model<Commande[]>()
  //recuperation des retours dialog
  public readonly journeeList = model<Journee[]>([])
  public readonly tournee = model<livraison[]>([])
  public entrepotData = model<EntrepotData[]>([])

  //jeu de changement d'etat
  estPlanifier = false

  //constructor pour recuperer la liste sauver au demarrage
  constructor() {
    const savedData = localStorage.getItem('journeeList');
    if (savedData) {
      this.journeeList.set(JSON.parse(savedData));
    }

    this.service.getEntrepotData().subscribe(result=>
      this.entrepotData.set(result)
    )

    this.service.updateCoordonneeEntrepot(this.getEntrepot(this.journeeList()))
  }

  //lancement du dialog qui ouvre le composant journee pour la definir
  addDay(): void {
    const dialogRef = this.journeeService.open(JourneeComponent, {
      data: { jour: this.dayName(), entrepot: this.entrepot(), date: this.date() }, height: '250px',
      width: '500px'
    })
    //mise a jour par abonnement a la fermeture du dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        //mise a jour de la liste apres ajout
        this.journeeList.set([...this.journeeList(), result])

        //savegarde de la liste pour un rechargement apres changement d'onglet
        localStorage.setItem('journeeList', JSON.stringify(this.journeeList()));
        this.service.updateCoordonneeEntrepot(this.getEntrepot(this.journeeList()))
        this.journeeList().forEach(value => console.log(value.nomEntrepot))
        console.log("client coordonnee: ",this.service.getCoordonneEntrepot());
      }
    });

  }

  getEntrepot(slection:Journee[]): EntrepotData {

    for (const coordonneeEntrepot of this.entrepotData()) {
      for (const select of slection) {
        if (coordonneeEntrepot.nom === select.nomEntrepot) {
          return coordonneeEntrepot;
        }
      }
    }
    return this.entrepotData()[0];
  }

  //suprimer une journee de la liste
  protected suprimerJournee(index: number) {
    if (this.journeeList().at(index) !== undefined) {
      const listUpdate = this.journeeList().filter((_, i) => i !== index)
      this.journeeList.set(listUpdate)
      //this.service.updateCoordonneeEntrepot(this.getEntrepot())
    }
    //save modif
    localStorage.setItem('journeeList', JSON.stringify(this.journeeList()));
  }

  //planifier journee ouvre dialog du composant plannifier
  planifier() {
    //this.service.updateCoordonneeEntrepot(this.getEntrepot())
    const dialogRefTournee = this.journeeService.open(PlanifierComponent, {
      data: {
        reference: this.reference(), adresse: this.adresse(), equipe: this.equipe(), commandes: this.commandes()
      }, height: '600px',
      width: '800px'
    })

    dialogRefTournee.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.tournee.set(result)
      }
      this.service.updateTournee(result)
      localStorage.setItem('tournee', JSON.stringify(this.tournee()));
    })
  }



}
