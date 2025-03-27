import { Injectable, model, signal } from '@angular/core';
import { EntrepotData } from '../interfaces/entrepotData';
import { Commande } from '../interfaces/Commande';
import { livreurs } from '../interfaces/Livreur';
import { Camion } from '../interfaces/Camion';
import { Client } from '../interfaces/Client';
import { livraison } from '../interfaces/Livraison';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TitleStrategy } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  //traitement de tournee pour envoyer a un composant
  private readonly tournne = signal<livraison[]>([])
  private readonly clientAlivree= signal<Client[]>([])
  //mise a jour de tournee
  public updateTournee(tournee: livraison[]){
    this.tournne.set(tournee)
  }

  //recuperation de tournee
  public getTournee(): livraison[]{
    return this.tournne()
  }
  //recuperons les clients a livree
  updateClientAlivree(client: Client[]): void{
    this.clientAlivree.set(client)
  }
  //recuperation de commandes
  getClientALivree(){
    return this.clientAlivree()
  }
  constructor(private http: HttpClient) { }
  //recuperation de donnees depuis le server json-serve
  //liste des entrepots
   getEntrepotData(): Observable<EntrepotData[]>{
    const apiEntrepot = 'http://localhost:3000/entrepots'
    return this.http.get<EntrepotData[]>(apiEntrepot)
  }
  //recuperation des commandes
  getCommandes(): Observable<Commande[]>{
   const apiCommande = 'http://localhost:3004/commandes'
   return this.http.get<Commande[]>(apiCommande)
  }
  //recuperation de la liste des livreurs
  getLivreurs(): Observable<livreurs[]>{
    const apiLivreur = 'http://localhost:3003/employes'
    return this.http.get<livreurs[]>(apiLivreur)
  }
  //recuperation des camions
 getCamion(): Observable<Camion[]>{
   const apiCamion = 'http://localhost:3002/camions'
   return this.http.get<Camion[]>(apiCamion)
  }
  //recuperation de clients data
  getClients(): Observable<Client[]>{
    const apiClient = 'http://localhost:3006/clients'
    return this.http.get<Client[]>(apiClient)
  }
  
 
  //recuperoms les commandes sous forme de tableau depuis client commandes groupees
  getCommandePerArray(): Observable<Commande[][]>{
    return this.getClients().pipe(
      map((clients: Client[])=> clients.map((client: Client)=> client.commandes))
    )
  }




  
  
  
  
  
}

