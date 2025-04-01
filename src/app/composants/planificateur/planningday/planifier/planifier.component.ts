
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

import { MatTableDataSource } from '@angular/material/table';
import { CdkMonitorFocus } from '@angular/cdk/a11y';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Adresse } from '../../../../interfaces/Adresse';

@Component({
  selector: 'app-planifier',
  templateUrl: './planifier.component.html',
  styleUrl: './planifier.component.css'
})
export class PlanifierComponent {
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
  public readonly equipeChoisie=model<Equipe>()

  public readonly dialogRef = inject(MatDialogRef<PlanifierComponent>)
  public readonly data = inject(MAT_DIALOG_DATA)
  //public readonly nombreEquipe = model<number>(0)
  //test commandes
  public readonly commandesGroupe = model<Commande[][]>([])
  public readonly clientALivrer = model<Client[]>([])
  public clientPerTourne=model<Client[][]>([]);



  constructor(){


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
      result=> this.clients.set(
        result
        .filter(client=>(client.commandes.length>0))
        .filter(client=>client.commandes.some(commande=>commande.etat.toUpperCase()===Etat.ouverte))
    ))
    //sauvegarde des donnees
    //tableau de equipes
    const savedData = localStorage.getItem("equipeList")
    if(savedData){
      this.equipeList.set(JSON.parse(savedData))

    }
    //envoie de donnees au service pour un access generale
    //donnees client a livre
    this.service.updateClientALivree(this.getSelectedClients())
    this.service.updateClientPerTournee(this.clientPerTourne());
    //recuperation de donnees depuis local livraison liste
    const savedData2 = localStorage.getItem('livraisonList');
    if (savedData2) {
      try {
        const parsedData = JSON.parse(savedData2);
        // Si le parsing réussit, on met à jour la liste
        this.livraisonList.set(parsedData);
      } catch (e) {
        console.error("Erreur de parsing des données JSON dans localStorage:", e);
      }
    }
    //test commandes
    effect(() => {
      this.dataSource.data = this.clients();
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
    //test
    //console.log(this.equipeList().length)
    this.livreursChoisit.set("");
    this.camionChoisit.set("");

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
  equipeForm = new FormControl('')

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



  /* quant toutes les lignes sont selectionnees. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numVisible = this.dataSource.filteredData.length;  // Nombre d'éléments visibles après filtrage
    return numSelected === numVisible;  // Retourne vrai si tous les éléments visibles sont sélectionnés
  }




  /* selection de l'ensemble des elements. */
  toggleAllRows() {
     // Récuperation les clients filtrés (visibles)
    const visibleClients = this.dataSource.filteredData;

    if (this.isAllSelected()) {
      // Désélectionnons tous les clients
      this.selection.clear();
    } else {
      visibleClients.forEach(client => this.selection.select(client));
    }
  }

  /* la selection ligne du check */
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


    // Filtrons les commandes et afficher que celles ouvertes
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

  this.commandeSelectDefault()
}

//selection par default de 5 clients ne fonctionne pas d'abord
commandeSelectDefault(){

  const dataSelect = this.dataSource.data.slice(0,5)
  dataSelect.map(client => this.selection.select(client)


  );
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
getSelectedClients(): Client[] {
  const cl = this.selection.selected
  let clts=this.clientALivrer();
  clts.push(...cl)
  this.clientALivrer.set(clts);
  //renvoi une liste trier.
  return this.clientALivrer().sort((a,b)=>a.latitude - b.latitude && a.longitude - b.longitude)

}
//affectation de commande a une equipe soit creation de livraison
//version manuelle
/*affectationDeCommandeAEquipe(): void {

  // Récupération de la sélection
  const clientsASelect = this.selection.selected;
  this.clientPerTourne().push(clientsASelect);


  //  si une équipe est choisie
  if (!this.equipeChoisie) {
    alert("Veuillez sélectionner une équipe !");
    return;
  }

  const equipeC = this.equipeChoisie();

  if (!equipeC) {
    alert("Équipe non valide !");
    return;
  }

  if (clientsASelect.length === 0) {
    alert("Veuillez sélectionner au moins une commande !");
    return;
  }

  // Filtrage des commandes non livrées
  const commandesAffectees = clientsASelect.flatMap(client =>
    client.commandes.filter(cmd => cmd.etat.toLowerCase() !== "livrée")
  );

  if (commandesAffectees.length === 0) {
    alert("Aucune commande à affecter !");
    return;
  }

  // creation d'adresse unique avec le code postal et adresse voir object adresse
  const adressesAvecCodePostal = Array.from(
    new Map(
      clientsASelect.map(client => [client.adresse, { adresse: client.adresse, codePostal: client.codePostal }])
    ).values()
  );

  // la liste actuelle des livraisons
  const livraisonList = this.livraisonList();

  // Vérifions si une livraison existe déjà pour cette équipe
  //le code n'est pas totalement au point la verif ne passe pas (livraisonExistante est tjr a undefined)

 let livraisonExistante = this.livraisonList().find(value=>
  value.reference === equipeC.camion && value.equipe.livreurs === equipeC.livreurs
 )

  if (livraisonExistante !== undefined) {
    // Mise à jour des commandes et adresses existantes
    livraisonExistante.Commandes.push(...commandesAffectees);
    livraisonExistante.adresse.push(...adressesAvecCodePostal);
    livraisonExistante.adresse = Array.from(new Map(livraisonExistante.adresse.map(a => [a.adresse, a])).values());
  } else {
    // Création d’une nouvelle livraison
    const nouvelleLivraison = {
      reference: `LIV-${Date.now()}`,
      adresse: adressesAvecCodePostal,
      equipe: equipeC,
      Commandes: commandesAffectees
    };

    livraisonList.push(nouvelleLivraison);
  }



  this.service.updateClientALivree(this.getSelectedClients())
  this.service.updateClientPerTournee(this.clientPerTourne());

  // Sauvegarde dans le localStorage
  localStorage.setItem('livraisonList', JSON.stringify(livraisonList));

  alert(`Commandes affectées à l'équipe ${equipeC.livreurs}!`);
}*/

//test affectation automatique des commandes aux liveurs start
//version automatique
affectationDeCommandeAEquipeAuto(): void {
 // Récupération de la sélection client
const clientsASelect = this.selection.selected;

if (clientsASelect.length === 0) {
  alert("Veuillez sélectionner au moins une commande !");
  return;
}

// Récupération des équipes disponibles
const equipesDisponibles = this.equipeList();
if (equipesDisponibles.length === 0) {
  alert("Aucune équipe disponible !");
  return;
}

// Récupération des livraisons en cours
const livraisonList = this.livraisonList();

// Répartition des clients entiers aux équipes
let i = 0;

clientsASelect.forEach((client, index) => {
  // Récupérer toutes les commandes non livrées du client
  // Si le client n'a pas de commandes valides, on passe
  const commandesClient = client.commandes.filter(cmd => cmd.etat.toLowerCase() !== "livrée");
  if (commandesClient.length === 0) return;
//construction de l'objeect adresse
  const adresseClient = { adresse: client.adresse, codePostal: client.codePostal };


  // Sélection de l'équipe depuis liste equipe disponible
  const equipeC = equipesDisponibles[i];
  if (!this.clientPerTourne()[i]) {
    this.clientPerTourne()[i] = []; // 🔹 Initialiser un tableau vide si undefined
  }
  this.clientPerTourne()[i].push(client);

  // Vérifications si une livraison existe déjà pour cette équipe
  let livraisonExistante = livraisonList.find(value =>
    value.equipe.livreurs === equipeC.livreurs && value.equipe.camion === equipeC.camion
  );
  if (livraisonExistante) {
    // Ajout de toutes les commandes du client à la livraison existante
    livraisonExistante.Commandes.push(...commandesClient);

    // Ajout de l'adresse si elle n'est pas déjà présente
    const adressesExistantes = new Map(livraisonExistante.adresse.map(a => [a.adresse, a]));
    adressesExistantes.set(adresseClient.adresse, adresseClient);
    livraisonExistante.adresse = Array.from(adressesExistantes.values());
    //test

  } else {
    // Créer une nouvelle livraison pour cette équipe
    const nouvelleLivraison = {
      reference: `LIV-${Date.now()}-${index}`,
      adresse: [adresseClient],
      equipe: equipeC,
      Commandes: commandesClient
    };

    livraisonList.push(nouvelleLivraison);

  }

  // Passer à l'équipe suivante (répartition circulaire)
  i = (i + 1) % equipesDisponibles.length;

});

// Mise à jour des composants dans le service
this.service.updateClientALivree(this.getSelectedClients());
this.service.updateClientPerTournee(this.clientPerTourne());

// Sauvegarde dans le localStorage
localStorage.setItem('livraisonList', JSON.stringify(livraisonList));

alert("Commandes affectées automatiquement aux équipes !");
}

//gestion des selections
livreurDejaSelectionner(nomLivreur: string): boolean{

  return this.equipeList().some(equipe=>equipe.livreurs.includes(nomLivreur))


}

camionDejaSelectionner(imat: string): boolean{
  return this.equipeList().some(equipe=>equipe.camion === imat)
}

equipeDejaAffecter(equipe: any): boolean{
  return this.livraisonList().some(livraison=> livraison.equipe === equipe)
}

clientSelectionner(client: any): boolean{
  this.clients().filter(valeur=>!this.clientALivrer().includes(valeur))
  return this.clientALivrer().some(clients=>clients.nom === client.nom)
}

}