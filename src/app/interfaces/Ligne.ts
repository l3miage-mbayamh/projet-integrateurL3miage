import { Commande } from "./Commande";
import { Produit } from "./Produit";

export interface Ligne{
    jdds: string,
    commande: Commande,
    produit: Produit,
    quantite: number
}