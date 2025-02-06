import { DataCommande } from "./commande.tuple";

export interface Commande {
    readonly jdds: string[];
    readonly reference: string;
    readonly etat: string;
    readonly dateCreation: Date;
    readonly note: number | null;
    readonly commentaire: string | null;
    readonly clientEmail: string;
    readonly lignes: string[];
}


export function processCommandeFromTuple(tuple: DataCommande): Commande {
    return {
        jdds: tuple[0],
        reference: tuple[1],
        etat: tuple[2],
        dateCreation: new Date(tuple[3]), // Conversion en Date
        note: tuple[4],
        commentaire: tuple[5],
        clientEmail: tuple[6],
        lignes: tuple[7]
    };
}
