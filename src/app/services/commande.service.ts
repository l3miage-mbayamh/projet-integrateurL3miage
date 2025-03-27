import { Commande } from './../interfaces/Commande';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Feature, Point } from 'geojson';
import { geoJSON, latLng, LatLng } from 'leaflet';
import { livreurs } from '../interfaces/Livreur';
import { Camion } from '../interfaces/Camion';
import { Client } from '../interfaces/Client';
import { EntrepotData } from '../interfaces/entrepotData';
import { Etat } from '../interfaces/enums/Etat';
import { __values } from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  constructor(private http: HttpClient) {}

  // Récupération des entrepôts
  //recuperation de donnees depuis le server json-serve
  //liste des entrepots
  async getEntrepotData(): Promise<EntrepotData[]>{
    const entrepotData = await fetch('http://localhost:3006/entrepots')
    return await entrepotData.json() ?? []
  }
  //recuperation des commandes
  async getCommandes(): Promise<Commande[]> {
    try {
      const response = await fetch('http://localhost:3008/commandes');

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data:Commande[] = await response.json();
      console.log("Données commande reçues :", data); // Vérifie si l'API renvoie bien un tableau

      return data ?? [];
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes :", error);
      return [];
    }
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



  async searchCommandes(searchTerm: string/*, clients: Client[]*/): Promise<Commande[]> {
    try {
      const response = await fetch('http://localhost:3008/commandes');
      const commandes: Commande[] = await response.json() ?? [];

      // Séparer la chaîne par des virgules et nettoyer les espaces
      const terms = searchTerm.split(',').map(term => term.trim().toLowerCase());

      // Filtrage des commandes par le terme de recherche
      const filteredCommandes = commandes
        .map(cmd => ({
          ...cmd,
          dateDeCreation: new Date(cmd.dateDeCreation),
          ligne: {
            jdds: cmd.ligne?.jdds,
            reference: cmd.ligne?.reference,
            quantite: cmd.ligne?.quantite
          }
        }))
        .filter(cmd =>
          terms.some(term =>
            cmd.reference.toLowerCase().includes(term) ||
            cmd.client.toLowerCase().includes(term)
          )
        );

      // Filtrer les commandes en fonction des clients
      /*const clientsWithCommandes = clients.map(client => ({
        ...client,
        commandes: filteredCommandes.filter(cmd => cmd.client === client.nom)
      }));*/

      // Retourner les commandes filtrées
      return filteredCommandes;

    } catch (error) {
      console.error('Erreur lors de la recherche des commandes:', error);
      return [];
    }
  }

  private readonly clientsApiUrl = 'http://localhost:3009/clients';

  async getClients(): Promise<Client[]> {
    try {
      // Récupérer les clients
      const response = await fetch(this.clientsApiUrl);

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data:Client[] = await response.json(); // Déclare `data` comme un tableau de `Client`
      console.log("Données clients reçues :", data); // Vérification

      // Récupérer les commandes (attendre leur résolution)

      return data ?? [];

    } catch (error) {
      console.error("Erreur lors de la récupération des clients :", error);
      return [];
    }
  }



  // Fonction pour récupérer toutes les commandes


  /*getLivreurs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.jsonServerURL}/livreurs`);
  }*/

  private readonly geoBaseURL = 'https://geo.api.gouv.fr';
  private readonly googleMapsAPIUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  private readonly jsonServerURL = 'http://localhost:3000';

  private readonly openRouteServiceURL = 'https://api.openrouteservice.org/geocode/search'; // URL d'OpenRouteService
  private readonly apiKey = '5b3ce3597851110001cf62481e732f07a07a4748af741d9c667ec9e6'; // Remplace par ta clé API Google Maps

  private readonly apiUrl = 'https://api.openrouteservice.org/v2/directions/driving-car';
  // Obtenir les coordonnées d'un client avec Google Maps API
  getCoordinates(address: string, postalCode: number, ville:string): Observable<LatLng> {
    //const url = `${this.googleMapsAPIUrl}?address=${encodeURIComponent(address + ', ' + postalCode)}&key=${this.apiKey}`;
    //const url = `${this.googleMapsAPIUrl}?address=${encodeURIComponent(address + ', ' + postalCode)}&q=8+bd+du+port`;
    const url = `${this.openRouteServiceURL}?api_key=${this.apiKey}&text=${encodeURIComponent(address + ', ' + postalCode+' '+ville)}`;


    return this.http.get<any>(url).pipe(
      map(response => {
        if (response.features && response.features.length > 0) {
          const location = response.features[0].geometry.coordinates; // [longitude, latitude]
          return new LatLng(location[1], location[0]); // Inverser lat et lng pour Leaflet
        }
        throw new Error('Aucune coordonnée trouvée');
      })
    );
  }

  // Récupérer les coordonnées des clients ayant des commandes
  getClientsLatLng(clients: Client[]): Observable<LatLng[]> {
    // On crée un tableau de promises pour chaque client avec des commandes
    const requests = clients
      .filter(client => (client.commandes.length > 0 )) // Filtrer les clients ayant des commandes
      .filter(client =>
        client.commandes.some(commande => commande.etat.toUpperCase() === Etat.ouverte) // Vérifier si au moins une commande est "OUVERTE"
      )
      .map(client => this.getCoordinates(client.adresse, client.codePostale,client.ville));

      for (const clt of clients) {
        const laln = this.getCoordinates(clt.adresse,clt.codePostale,clt.ville);
        laln.subscribe(
          result =>clt.latitude=result.lat
        )
        laln.subscribe(
          result =>clt.longitude=result.lng
        )
      }
      console.log("client filrer: ",clients);
    // On exécute toutes les requêtes en parallèle avec forkJoin et on retourne un tableau de LatLng[]
    return forkJoin(requests).pipe(
      map(coordinates => coordinates.map(coord => latLng(coord.lat, coord.lng))) // Formater les résultats en LatLng[]
    );
  }


  /*getItinerary(coords: [number, number][]): Observable<any[]> {
    if (coords.length < 2) {
      console.error("Erreur : Il faut au moins deux points pour tracer un itinéraire.");
      return new Observable(observer => {
        observer.error("Il faut au moins deux points.");
        observer.complete();
      });
    }

    // Construire les requêtes pour chaque segment entre les points
    const requests: Observable<any>[] = [];
    let i;
    for (i = 0; i < coords.length - 1; i++) {
      const start = coords[i].join(',');
      const end =i+1<coords.length?coords[i + 1].join(','):coords[i].join(',');
      const url = `${this.apiUrl}?api_key=${this.apiKey}&start=${start}&end=${end}`;

      console.log("Requête envoyée à :", url); // Debugging
      requests.push(this.http.get(url));
    }
    const url = `${this.apiUrl}?api_key=${this.apiKey}&start=${coords[i].join(',')}&end=${coords[0].join(',')}`;
    //console.log("Requête envoyée à :", url); // Debugging
    requests.push(this.http.get(url));

    // Exécuter toutes les requêtes en parallèle et retourner le résultat
    return forkJoin(requests);
  }*/

    getItinerary(coords: [number, number][]): Observable<any[]> {
      if (coords.length < 2) {
        console.error("Erreur : Il faut au moins deux points pour tracer un itinéraire.");
        return new Observable(observer => {
          observer.error("Il faut au moins deux points.");
          observer.complete();
        });
      }

      // 1️⃣ Trouver le chemin optimal (ex. algorithme du voyageur de commerce)
      const optimizedRoute = this.solveTSP(coords);

      // 2️⃣ Construire les requêtes API basées sur le meilleur itinéraire trouvé
      const requests: Observable<any>[] = [];
      for (let i = 0; i < optimizedRoute.length - 1; i++) {
        const start = optimizedRoute[i].join(',');
        const end = optimizedRoute[i + 1].join(',');
        const url = `${this.apiUrl}?api_key=${this.apiKey}&start=${start}&end=${end}`;

        console.log("Requête envoyée à :", url); // Debugging
        requests.push(this.http.get(url));
      }

      // 3️⃣ Boucler le dernier point vers le premier pour fermer l'itinéraire
      const last = optimizedRoute[optimizedRoute.length - 1].join(',');
      const first = optimizedRoute[0].join(',');
      const finalUrl = `${this.apiUrl}?api_key=${this.apiKey}&start=${last}&end=${first}`;
      requests.push(this.http.get(finalUrl));

      // 4️⃣ Exécuter toutes les requêtes en parallèle et retourner le résultat
      return forkJoin(requests);
    }

    /**
     * Trouve l'itinéraire optimal en minimisant la distance totale
     * Utilisation d'un algorithme naïf du voyageur de commerce (TSP)
     */
    private solveTSP(coords: [number, number][]): [number, number][] {
      const n = coords.length;
      const visited = new Array(n).fill(false);
      const path: [number, number][] = [];

      let currentIndex = 0;
      visited[currentIndex] = true;
      path.push(coords[currentIndex]);

      for (let step = 1; step < n; step++) {
        let nearestIndex = -1;
        let minDistance = Infinity;

        for (let j = 0; j < n; j++) {
          if (!visited[j]) {
            const dist = this.getDistance(coords[currentIndex], coords[j]);
            if (dist < minDistance) {
              minDistance = dist;
              nearestIndex = j;
            }
          }
        }

        if (nearestIndex !== -1) {
          visited[nearestIndex] = true;
          path.push(coords[nearestIndex]);
          currentIndex = nearestIndex;
        }
      }

      return path;
    }

    /**
     * Calcule la distance entre deux points (latitude, longitude) en km
     */
    private getDistance(a: [number, number], b: [number, number]): number {
      const R = 6371; // Rayon de la Terre en km
      const dLat = this.degToRad(b[0] - a[0]);
      const dLon = this.degToRad(b[1] - a[1]);

      const lat1 = this.degToRad(a[0]);
      const lat2 = this.degToRad(b[0]);

      const aVal = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(lat1) * Math.cos(lat2) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));

      return R * c; // Distance en km
    }

    private degToRad(deg: number): number {
      return deg * (Math.PI / 180);
    }


  // Obtenir les coordonnées d'une commande spécifique
  getLatLngCommande(idCommande: string): Observable<[number, number]> {
    return this.http.get<Feature<Point>>(`${this.jsonServerURL}/commandes/${idCommande}`)
      .pipe(
        map(f => {
          if (f.geometry && f.geometry.coordinates) {
            return [f.geometry.coordinates[1], f.geometry.coordinates[0]];
          }
          throw new Error("Coordonnées non trouvées");
        })
      );
  }
}
