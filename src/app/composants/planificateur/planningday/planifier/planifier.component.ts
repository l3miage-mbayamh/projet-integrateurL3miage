import { Component, inject, model, signal } from '@angular/core';
import { CommandeService } from '../../../../services/commande.service';
import { Commande } from '../../../../interfaces/Commande';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Employer } from '../../../../interfaces/Employer';
import { livreurs } from '../../../../interfaces/Livreur';
import { EntrepotData } from '../../../../interfaces/entrepotData';
import { Camion } from '../../../../interfaces/Camion';
import { Equipe } from '../../../../interfaces/Equipes';
import { livraison } from '../../../../interfaces/Livraison';
import { Client } from '../../../../interfaces/Client';

@Component({
  selector: 'app-planifier',
  templateUrl: './planifier.component.html',
  styleUrl: './planifier.component.css'
})
export class PlanifierComponent {

  readonly service = inject(CommandeService)
  //recuperation de data depuis le service
  public readonly commandes = signal<Commande[]>([])
  public readonly livreursListe = signal<livreurs[]>([])
  public readonly camionList = signal<Camion[]>([])
  public readonly equipeList = model<Equipe[]>([])
  public readonly livraisonList = model<livraison[]>([])
  public readonly clients = model<Client[]>([])
  //declaration des variables
  public readonly camionChoisit = model<string>("")
  public readonly livreursChoisit = model<string>("")
  public readonly equipe = model<Equipe>({livreurs: "Euler", camion: "415655"})
  //public readonly nombreEquipe = model<number>(0)
  //test commandes
  public readonly commandesGroupe = model<string[][]>([])


  constructor(){
    //commandes
   

    //livreurs
    const employerList = this.service.getLivreurs()
    employerList.subscribe(result=> this.livreursListe.set(result))
    //camion
    const camion = this.service.getCamion()
    camion.subscribe(resuult=> this.camionList.set(resuult))
    //livraison (commande grouper) test
    const commandes = this.service.getCommandePerArray()
    commandes.subscribe(result=>
      this.commandesGroupe.set(result)
    )
    //clients
    const client = this.service.getClients()
    client.subscribe(
      result=> this.clients.set(result)
    )
    //sauvegarde des donnees 
    //tableau de equipes
    const savedData = localStorage.getItem("equipeList")
    if(savedData){
      this.equipeList.set(JSON.parse(savedData))

    }
    //test via console
    console.log(this.clients)
 
    
    
         
  }
  //creation des equipes
  confirmer():void{
    this.equipe.update(()=> ({
      livreurs: this.livreursChoisit(),
      camion: this.camionChoisit()
    }))
    this.equipeList().push(this.equipe())
    //this.nombreEquipe.update(()=> this.nombreEquipe() + 1)
    //sauvons le tableau
    localStorage.setItem('equipeList', JSON.stringify(this.equipeList()))
  }
  //supression d'equipe de la table
  suprimer(index: number): void{
    if(this.equipeList().at(index)){
      const equipeNew = this.equipeList().filter((_,i)=> i!== index)
      this.equipeList.update(()=>equipeNew)
      //this.nombreEquipe.set(this.nombreEquipe()-1)
    }
    localStorage.setItem('equipeList', JSON.stringify(this.equipeList()))
  }
  
  //gestion champs form control
  equipierForm = new FormControl('')
  camionForm = new FormControl('')

  //la navigation dans le composant pour switcher les differentes parties
  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });


  

  
}
