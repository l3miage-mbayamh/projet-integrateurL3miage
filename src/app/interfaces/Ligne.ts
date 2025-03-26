import { Commande } from "./Commande";
import { Produit } from "./Produit";

export interface Ligne{
    jdds: string,
    reference:string,
    //refCommande: string,
    //produit: Produit,
    quantite: number
}