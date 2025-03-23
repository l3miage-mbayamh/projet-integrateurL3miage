import { EntrepotData } from "./entrepotData";
import { Encombrement } from "./enums/Encombrement";
import { Ligne } from "./Ligne";
import { Stock } from "./Stock";

export interface Produit{
    reference: string,
    photo?: string,
    titre: string,
    description: string,
    prix: number,
    optionMontage?: string,
    tdmTheorique?: string,
    stock?: Stock,
    ligne?: Ligne[]
    encombrement?: Encombrement
}