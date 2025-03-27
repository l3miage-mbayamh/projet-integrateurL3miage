import { Component, inject, model } from '@angular/core';
import { CommandeService } from '../../../services/commande.service';
import { livraison } from '../../../interfaces/Livraison';

@Component({
  selector: 'app-visualiserday',
  templateUrl: './visualiserday.component.html',
  styleUrl: './visualiserday.component.css'
})
export class VisualiserdayComponent {

  //declarations
  public readonly service = inject(CommandeService)

  //recuperation
  public readonly tournee = model<livraison[]>()
  //constructeur
  constructor(){
    //recupration depuis service
    const t = this.service.getTournee()
    this.tournee.set(t)

    const dataSaveTournee = localStorage.getItem('livraisonList')
    if (dataSaveTournee) {
      try {
        const parsedData = JSON.parse(dataSaveTournee);
        // Si le parsing réussit, on met à jour la liste
        this.tournee.set(parsedData);
      } catch (e) {
        console.error("Erreur de parsing des données JSON dans localStorage:", e);
      }
    }
  }
 
}
