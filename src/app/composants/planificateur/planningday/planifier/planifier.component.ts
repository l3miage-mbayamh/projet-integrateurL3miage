import { Component, inject, model } from '@angular/core';
import { CommandeService } from '../../../../services/commande.service';
import { Commande } from '../../../../interfaces/Commande';

@Component({
  selector: 'app-planifier',
  templateUrl: './planifier.component.html',
  styleUrl: './planifier.component.css'
})
export class PlanifierComponent {

  readonly service = inject(CommandeService)
  //recuperation de commandes depuis le service
  public readonly comandes = model<readonly Commande[]>([])

  constructor(){
    const cmd = this.service.getCommandes().then(result=>
      this.comandes.set(result)
    )
  }

}
