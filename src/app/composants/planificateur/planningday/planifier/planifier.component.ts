import { Component, inject, model, signal } from '@angular/core';
import { CommandeService } from '../../../../services/commande.service';
import { Commande } from '../../../../interfaces/Commande';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Employer } from '../../../../interfaces/Employer';
import { livreurs } from '../../../../interfaces/Livreur';
import { EntrepotData } from '../../../../interfaces/entrepotData';
import { Camion } from '../../../../interfaces/Camion';

@Component({
  selector: 'app-planifier',
  templateUrl: './planifier.component.html',
  styleUrl: './planifier.component.css'
})
export class PlanifierComponent {

  readonly service = inject(CommandeService)
  //recuperation de data depuis le service
  public readonly comandes = signal<readonly Commande[]>([])
  public readonly livreursListe = signal<livreurs[]>([])
  public readonly camionList = signal<Camion[]>([])

  constructor(){
    //commandes
    const cmd = this.service.getCommandes().then(result=>
      this.comandes.set(result)
    )
    //livreurs
    const employerList = this.service.getLivreurs().then(result=>
      this.livreursListe.set([...result])
    )
    const camion = this.service.getCamion().then(result=>
      this.camionList.set(result)
    )
  }
  //gestion champs equipes qui utilise la liste des livreurs
  equipierForm = new FormControl('')

  

  //la navigation dans le composant pour switcher les differentes parties
  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

}
