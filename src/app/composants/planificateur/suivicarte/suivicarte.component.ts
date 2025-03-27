import { Commande } from './../../../interfaces/Commande';
import { Component, model, OnInit, signal } from '@angular/core';
import { latLng, LatLng } from 'leaflet';
import { CommandeService } from '../../../services/commande.service';
import { Client } from '../../../interfaces/Client';
import { Etat } from '../../../interfaces/enums/Etat';
import { livreurs } from '../../../interfaces/Livreur';
import { Camion } from '../../../interfaces/Camion';
import { Equipe } from '../../../interfaces/Equipes';

@Component({
  selector: 'app-suivicarte',
  templateUrl: './suivicarte.component.html',
  styleUrls: ['./suivicarte.component.css']
})
export class SuivicarteComponent {

  /*public clients: Client[] = [
    {
        code: "C001",
        email: "alice@example.com",
        prenom: "Alice",
        nom: "Dupont",
        adresse: "12 rue de Paris",
        codePostale: 75001,
        ville: "Paris",
        latitude: 48.8566,
        longitude: 2.3522,
        etat: Etat.ouverte,
        commdes: [
          {
            reference: "CMD001",
            etat: Etat.ouverte,
            dateDeCreation: new Date("2024-03-20"),
            note: 4,
            commentaire: "Livraison rapide",
            client: "Jean Dupont",
            ligne: { jdds:"J045", reference: "CMD001", quantite: 1}
          },
        ]
    },
    {
        code: "C002",
        email: "bob@example.com",
        prenom: "Bob",
        nom: "Martin",
        adresse: "25 avenue des Champs",
        codePostale: 75008,
        ville: "Paris",
        latitude: 48.8708,
        longitude: 2.3078,
        etat: Etat.planifier,
        commdes: [
          {
            reference: "CMD002",
            etat: Etat.livree,
            dateDeCreation: new Date("2024-03-18"),
            client: "Alice Martin",
            ligne: { jdds:"J045", reference: "CMD002", quantite: 1}
          },

        ]
    },
    {
        code: "C003",
        email: "charlie@example.com",
        prenom: "Charlie",
        nom: "Lemoine",
        adresse: "10 boulevard Haussmann",
        codePostale: 75009,
        ville: "Paris",
        latitude: 48.8738,
        longitude: 2.332,
        etat: Etat.encour,
        commdes: [
        {
          reference: "CMD003",
          etat: Etat.notee,
          dateDeCreation: new Date("2024-03-22"),
          note: 5,
          client: "Paul Durand",
          ligne: { jdds:"J045", reference: "CMD003", quantite: 1}
        }
      ]
    }
  ];*/


  public readonly comandes = signal<readonly Commande[]>([])
  public clients = signal<Client[]>([])
    public readonly livreursListe = signal<livreurs[]>([])
    public readonly camionList = signal<Camion[]>([])
    //declaration des variables
    public readonly camionChoisit = model<string>("")
    public readonly livreursChoisit = model<string>("")
    public readonly equipe = model<Equipe>({livreurs: "Euler", camion: "415655"})
    public readonly equipeList = model<Equipe[]>([])
    public readonly nombreEquipe = model<number>(0)

  public markers=signal<LatLng[]>([]);
  public clts=signal<Client[]>([]);
  //readonly service = inject(CommandeService)

  public currentValue = latLng(45.1485200,5.7369725);
  constructor(private commandeService: CommandeService) {
    /*const cmd = this.commandeService.getCommandes().then(result=>{
      this.comandes.set(result);
      console.log("commande",this.comandes.le);
  })*/
      this.commandeService.getCommandes().then(result => {
        this.comandes.set(result);
      });



      this.commandeService.getClients().then(result=>{
        this.clients.set(result);
        this.commandeService.getClientsLatLng(this.clients()).subscribe(
          (coordinates: LatLng[]) => {
            this.clts.set(
              this.clients()
              .filter(client => (client.commandes.length > 0 )) // Filtrer les clients ayant des commandes
              .filter(client =>
        client.commandes.some(commande => commande.etat.toUpperCase() === Etat.ouverte) // Vérifier si au moins une commande est "OUVERTE"
      )

          );
            this.markers.set([this.currentValue, ...coordinates]); // Ajouter les coordonnées aux marqueurs
            console.log('Coordonnées des clients avec commandes :', this.markers());
          },
          (error) => {
            console.error('Erreur lors de la récupération des coordonnées :', error);
          }
        );
      });

    //livreurs
    /*const employerList = this.commandeService.getLivreurs().then(result=>
      this.livreursListe.set([...result])
    )
    const camion = this.commandeService.getCamion().then(result=>
      this.camionList.set(result)
    )

    //sauvegarde des donnees
    //tableau de equipes
    const savedData = localStorage.getItem("equipeList")
    if(savedData){
      this.equipeList.set(JSON.parse(savedData))
    }*/

      console.log(this.clients);


  }

  /*ngOnInit() {
    this.getClientsMarkers();
  }



  getClientsMarkers() {
    // S'assurer que les clients et commandes sont bien chargés avant d'accéder à leurs données
    const clients = this.clients(); // Accéder aux clients stockés dans le signal
    const commandes = this.comandes(); // Accéder aux commandes stockées dans le signal

    console.log("les coordonnees sont:", clients.length); // Afficher les clients dans la console
    console.log("commandes", commandes.length);   // Afficher le nombre de commandes

    if (clients.length === 0 || commandes.length === 0) {
      console.log('Aucune donnée disponible pour les clients ou les commandes.');
      return;
    }

    // Utiliser les clients pour récupérer les coordonnées
    this.commandeService.getClientsLatLng(clients).subscribe(
      (coordinates: LatLng[]) => {
        this.markers.set([this.currentValue, ...coordinates]); // Ajouter les coordonnées aux marqueurs
        console.log('Coordonnées des clients avec commandes :', this.markers()[0].lat);
      },
      (error) => {
        console.error('Erreur lors de la récupération des coordonnées :', error);
      }
    );
  }*/

}
