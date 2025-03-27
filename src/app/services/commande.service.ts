import { Commande } from './../interfaces/Commande';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Feature, Point } from 'geojson';
import { geoJSON, latLng, LatLng } from 'leaflet';
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
    const commandeData = await fetch('http://localhost:3000/commandes')
    return await commandeData.json()?? []
  }
  //recuperation de la liste des livreurs
  getLivreurs(): Observable<livreurs[]>{
    const apiLivreur = 'http://localhost:3003/employes'
    return this.http.get<livreurs[]>(apiLivreur)
  }
  //recuperation des camions
  async getCamion(): Promise<Camion[]>{
    const camions = await fetch('http://localhost:3002/camions')
    return await camions.json()?? []
  }

}

