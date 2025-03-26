import { Commande } from "./Commande";
import { Produit } from "./Produit";

export interface Ligne{
    jdds: string,
    refCommande: string,
    produit: Produit,
    quantite: number
}