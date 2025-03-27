import { Commande } from "./Commande";
import { Equipe } from "./Equipes";

export interface livraison{
    reference: string,
    adresse: string,
    equipe: Equipe
    Commandes: Commande[]
}