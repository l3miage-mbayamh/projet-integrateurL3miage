import { Component, input , inject, signal} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { EmployeService } from '../../services/employe.service' ;
import { ClientService } from '../../services/client.service';
import { CommandeService } from '../../services/commande.service';
import { ProduitService } from '../../services/produit.service';





@Component({
  selector: 'app-planificateur',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, CommonModule,], 
  templateUrl: './planificateur.component.html',
  styleUrls: ['./planificateur.component.css'] 
})
export class PlanificateurComponent {
  private readonly employeService = inject(EmployeService);
  public readonly employes = this.employeService.employes;

  private readonly clientService = inject(ClientService);
  public readonly clients = this.clientService.clients;

  private readonly commandeService = inject(CommandeService);
  public readonly commandes = this.commandeService.commandes;


  private readonly produitService = inject(ProduitService);
  public readonly produits = this.produitService.produits;

  constructor() {
   
  }

}
