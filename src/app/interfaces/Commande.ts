import { Etat } from "./enums/Etat";
import { Ligne } from "./Ligne";

export interface Commande{
    reference: string,
    etat: Etat,
    dateDeCreation: Date,
    note?: number,
    commentaire?: string,
    client: string,
    ligne: Ligne


}
