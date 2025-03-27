import { Component, effect, inject, model, signal } from '@angular/core';
import { CommandeService } from '../../../../services/commande.service';
import { Commande } from '../../../../interfaces/Commande';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Employer } from '../../../../interfaces/Employer';
import { livreurs } from '../../../../interfaces/Livreur';
import { EntrepotData } from '../../../../interfaces/entrepotData';
import { Camion } from '../../../../interfaces/Camion';
import { Equipe } from '../../../../interfaces/Equipes';
import { livraison } from '../../../../interfaces/Livraison';
import { Etat } from '../../../../interfaces/enums/Etat';
import { Client } from '../../../../interfaces/Client';
import { SelectionModel } from '@angular/cdk/collections';
import { PeriodicElement } from '../list-commande/list-commande.component';
import { MatTableDataSource } from '@angular/material/table';

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
  public readonly etat = Etat
  //public readonly nombreEquipe = model<number>(0)
  //test commandes
  public readonly commandesGroupe = model<Commande[][]>([])
  public readonly clientALivrer = model<Client[]>([])
  


  constructor(){
    /*commandes peuvent etre recuperer via clients ou depuis service
    l'objectif est d'avoir un affichage de commande que j'appelle livraison grouper par client
    ce qui facilitera la tache au planificateur car destination unique pour caque groupe de commande
    livreurList: regroupe les data des livreurs dont on affichera juste le nom pour la selection dans equipe
    commandes: contient les data brute de tout les commandes non grouper
    camionList: contient la liste des des data de tout les camion dont affiche le matricule dans equipe
    equipesList : contient la liste d toutes les equipes former
    clients: contient les data de tout les clients
    livraisonList: contient les differentes livraison planifier pour un jour donner
    commandesGroupe: contient les ref commande de toutes les commandes grouper par client
    
    */
   
    //commande
    const cmd = this.service.getCommandes()
    cmd.subscribe(value => this.commandes.set(value))
    //livreurs
    const employerList = this.service.getLivreurs()
    employerList.subscribe(result=> this.livreursListe.set(result))
    //camion
    const camion = this.service.getCamion()
    camion.subscribe(resuult=> this.camionList.set(resuult))
    //livraison (commande grouper) 
    const commandes = this.service.getCommandePerArray()
    commandes.subscribe(result=>
      this.commandesGroupe.set(result)
    )
    //clients data 
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
    //test commandes
    effect(() => {
      this.dataSource.data = this.clients(); // Rafraîchir les données
    });
 
    
    
         
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

  //gestion commandes et client

  
  
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
//test start
//selection de toutes les commandes via client
displayedColumns: string[] = ['select', 'nom', 'adresse', 'codePostal','ville', 'commandes','etat'];
  dataSource = new MatTableDataSource<Client>(this.clients());
  selection = new SelectionModel<Client>(true, []);

  

  /** quant toutes les lignes sont selectionnees. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numVisible = this.dataSource.filteredData.length;  // Nombre d'éléments visibles après filtrage
    return numSelected === numVisible;  // Retourne vrai si tous les éléments visibles sont sélectionnés
  }

  
 

  /** selection de l'ensemble des elements. */
  toggleAllRows() {
    const visibleClients = this.dataSource.filteredData;  // Récupère les clients filtrés (visibles)
  
    if (this.isAllSelected()) {
      this.selection.clear();  // Désélectionne tous les clients
    } else {
      visibleClients.forEach(client => this.selection.select(client));  // Sélectionne les clients visibles
    }
  }

  /** la selection ligne du check */
  checkboxLabel(row?: Client): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} `;
  }
//modifions le comportement du filter pour trier les elements
ngOnInit() {
  this.dataSource.filterPredicate = (data: Client, filter: string) => {
    const transformedFilter = filter.trim().toLowerCase();

    // Vérifions si la recherche correspond aux infos du client
    const matchClient =
      data.email.toLowerCase().includes(transformedFilter) ||
      data.prenom.toLowerCase().includes(transformedFilter) ||
      data.nom.toLowerCase().includes(transformedFilter) ||
      data.adresse.toLowerCase().includes(transformedFilter) ||
      data.codePostal.toString().includes(transformedFilter) ||
      data.ville.toLowerCase().includes(transformedFilter)


    // Filtrons les commandes : masquer "livré" sauf si on cherche "livré"
    let filteredCommandes = data.commandes;
    if (transformedFilter === "ouverte") {
      filteredCommandes = data.commandes.filter(cmd => cmd.etat.toLowerCase() === "ouverte");
    } else if (transformedFilter !== "livrée") {
      filteredCommandes = data.commandes.filter(cmd => cmd.etat.toLowerCase() !== "livrée");
    }

    // Vérifions si une commande restante correspond au filtre
    const matchCommande = filteredCommandes.some(cmd =>
      cmd.reference.toLowerCase().includes(transformedFilter) ||
      cmd.etat.toLowerCase().includes(transformedFilter)
    );

    return matchClient || matchCommande;
  };
}
//application du filtre
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator ) {
      this.dataSource.paginator.firstPage();
    }
  }


//recuperation des  clients selectionner (a livree)
getSelectedClients() {
  const cl = this.selection.selected
  this.clientALivrer.set(this.selection.selected); // Récupère la liste des clients sélectionnés
  console.log(this.clientALivrer()); // Vérifie dans la console
}


//test end

  

  
}
