import { Reference } from './../../../node_modules/regjsparser/parser.d';
import { Commande } from "./Commande";
import { Produit } from "./Produit";

export interface Ligne{
    jdds: string,
    reference:string,
    //commande: Commande,
    //produit: Produit,
    quantite: number
}
