import { Employer } from "./Employer";

export interface livreurs{
    trigramme: string,
    prenom: string,
    nom: string,
    photo: string,
    telephone: number,
    email: string,
    emploi: Employer,
    entrepot: string
}