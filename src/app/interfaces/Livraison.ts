import { Commande } from "./Commande";
import { Equipe } from "./Equipes";

export interface livraison{
    reference: string,
    adresse: string,
    codePostal: number,
    equipe: Equipe,
    Commandes: Commande[]
}