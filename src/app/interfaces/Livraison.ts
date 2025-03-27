import { Commande } from "./Commande";

export interface livraison{
    reference: string,
    adresse: string,
    Commandes: Commande[]
}