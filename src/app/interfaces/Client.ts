import { Commande } from "./Commande";
import { Etat } from "./enums/Etat";

export interface Client{
    code?: string,
    email: string,
    prenom: string,
    nom: string,
    adresse: string,
    codePostal: number,
    ville: string,
    latitude: number,
    longitude: number,
    commandes: string
    etat: Etat
}