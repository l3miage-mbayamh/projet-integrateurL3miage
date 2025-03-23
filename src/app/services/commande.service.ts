import { Injectable } from '@angular/core';
import { EntrepotData } from '../interfaces/entrepotData';
import { Commande } from '../interfaces/Commande';


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
    const commandeData = await fetch('http://localhost:3000/commandes')
    return await commandeData.json()?? []
  }
}

