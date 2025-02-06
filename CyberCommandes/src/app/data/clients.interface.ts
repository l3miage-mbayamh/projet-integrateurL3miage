import { DataClient } from "./clients.tuple";

export interface Client {
    readonly jdds: string;
    readonly code: string;
    readonly email: string;
    readonly prenom: string;
    readonly nom: string;
    readonly adresse: string;
    readonly code_postal: string;
    readonly ville: string;
    readonly latitude: number;
    readonly longitude: number;
    readonly commandes: string[]; // Transforme la liste des commandes en tableau
    readonly etat: string;
}

// Fonction pour transformer un tuple `DataClient` en `Client`
export function processClientFromTuple(tuple: DataClient): Client {
    return {
        jdds: tuple[0],
        code: tuple[1],
        email: tuple[2],
        prenom: tuple[3],
        nom: tuple[4],
        adresse: tuple[5],
        code_postal: tuple[6],
        ville: tuple[7],
        latitude: tuple[8],
        longitude: tuple[9],
        commandes: tuple[10].split(",").filter(cmd => cmd.trim() !== ""), // Conversion en tableau
        etat: tuple[11]
    };
}
