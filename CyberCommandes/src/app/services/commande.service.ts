import { Injectable, signal } from '@angular/core';
import rawData from '../data/liste-Ligne.csv'; // Importation du CSV
import { processStringToDataCommande } from '../data/commande.tuple';
import { Commande, processCommandeFromTuple } from '../data/commande.interface';

@Injectable({
  providedIn: 'root',
})
export class CommandeService {
  private readonly _commandes = signal<readonly Commande[]>([]);
  public readonly commandes = this._commandes.asReadonly();

  constructor() {
    const lignes = rawData.split("\n").filter(line => line.trim() !== ""); // Éviter les lignes vides
    const commandesData = lignes.map(processStringToDataCommande).map(processCommandeFromTuple);
    this._commandes.set(commandesData);
  }
}
