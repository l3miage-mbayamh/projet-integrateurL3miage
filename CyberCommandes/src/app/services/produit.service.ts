import { Injectable, signal } from '@angular/core';
import rawData from '../data/liste-Produits.csv'; // Importation du CSV
import { processStringToDataProduit } from '../data/produits.tuple';
import { Produit, processProduitFromTuple } from '../data/produits.interface';

@Injectable({
  providedIn: 'root',
})
export class ProduitService {
  private readonly _produits = signal<readonly Produit[]>([]);
  public readonly produits = this._produits.asReadonly();

  constructor() {
    const lignes = rawData.split("\n").filter(line => line.trim() !== ""); // Éviter les lignes vides
    const produitsData = lignes.map(processStringToDataProduit).map(processProduitFromTuple);
    this._produits.set(produitsData);
  }
}
