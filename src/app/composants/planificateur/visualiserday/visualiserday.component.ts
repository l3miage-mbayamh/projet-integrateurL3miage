import { Component, inject } from '@angular/core';
import { CommandeService } from '../../../services/commande.service';

@Component({
  selector: 'app-visualiserday',
  templateUrl: './visualiserday.component.html',
  styleUrl: './visualiserday.component.css'
})
export class VisualiserdayComponent {

  public readonly service = inject(CommandeService)

  //recuperation
  public readonly tournee = this.service.getTournee()
}
