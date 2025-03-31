import { Adresse } from "./Adresse";
import { Commande } from "./Commande";
import { Equipe } from "./Equipes";


export interface livraison{
    reference: string,
    adresse: Adresse[],
    equipe: Equipe,
    Commandes: Commande[]
}
