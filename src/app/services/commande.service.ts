import { Injectable } from '@angular/core';
import { EntrepotData } from '../interfaces/entrepotData';
import { Commande } from '../interfaces/Commande';
import { livreurs } from '../interfaces/Livreur';
import { Camion } from '../interfaces/Camion';


@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  constructor() { }
  //recuperation de donnees depuis le server json-serve
  //liste des entrepots
  async getEntrepotData(): Promise<EntrepotData[]>{
    const entrepotData = await fetch('http://localhost:3000/entrepots')
    return await entrepotData.json() ?? []
  }
  //recuperation des commandes
  async getCommandes(): Promise< readonly Commande[]>{
    const commandeData = await fetch('http://localhost:3004/commandes')
    return await commandeData.json()?? []
  }
  //recuperation de la liste des livreurs
  async getLivreurs(): Promise<readonly livreurs[]>{
    const livreurs = await fetch('http://localhost:3003/employes')
    return await livreurs.json()?? []
  }
  //recuperation des camions
  async getCamion(): Promise<Camion[]>{
    const camions = await fetch('http://localhost:3002/camions')
    return await camions.json()?? []
  }
  
}

