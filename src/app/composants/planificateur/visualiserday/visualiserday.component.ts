import { Component, inject, model } from '@angular/core';
import { CommandeService } from '../../../services/commande.service';
import { livraison } from '../../../interfaces/Livraison';
import { Client } from '../../../interfaces/Client';
import { Etat } from '../../../interfaces/enums/Etat';

@Component({
  selector: 'app-visualiserday',
  templateUrl: './visualiserday.component.html',
  styleUrl: './visualiserday.component.css'
})
export class VisualiserdayComponent {

  //declarations
  public readonly service = inject(CommandeService)
  public readonly etat = model<Etat>(Etat.encours)

  //recuperation
  public readonly tournee = model<livraison[]>()
  public readonly clients = model<Client[]>([])
  //constructeur
  constructor(){
    //recupration depuis service
    const t = this.service.getTournee()
    this.tournee.set(t)

    const c = this.service.getClientALivree()
    this.clients.set(c)
    const dataSaveTournee = localStorage.getItem('livraisonList')
    if (dataSaveTournee) {
      try {
        const data = JSON.parse(dataSaveTournee);
        // Si le parsing réussit, on met à jour la liste
        this.tournee.set(data);
        //localStorage.setItem('livraisonList', JSON.stringify(this.tournee()))
      } catch (e) {
        console.error("Erreur de parsing des données JSON dans localStorage:", e);
      }
    }
  }
 
}
