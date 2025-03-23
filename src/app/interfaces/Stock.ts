import { EntrepotData } from "./entrepotData";
import { Produit } from "./Produit";

export interface Stock{
    reference: string,
    entrepot: EntrepotData
    produitStock: Produit
    quantite: number

}