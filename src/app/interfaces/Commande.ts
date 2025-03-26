import { Etat } from "./enums/Etat";
import { Ligne } from "./Ligne";

export interface Commande{
    reference: string,
    etat: Etat,
    dateDeCreation: Date,
    client: string,
    note:number,
    commentaire?:string,
    ligne:Ligne
}