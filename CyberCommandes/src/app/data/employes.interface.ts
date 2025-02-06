import { ListEmploye } from "./employes.tuple";

export interface Employe {
    readonly trigramme: string;
    readonly prenom: string;
    readonly nom: string;
    readonly photo?: string;
    readonly telephone: string;
    readonly email: string;
    readonly emploi: "Planificateur" | "Livreur";
    //entrepot: string;
}

export function processEmployeFromTuple(tuple: ListEmploye): Employe {
    return {
        trigramme: tuple[0],
        prenom: tuple[1]?.replace("�", "é"),
        nom: tuple[2],
        photo: tuple[3],
        telephone: tuple[4],
        email: tuple[5],
        emploi: tuple[6]

    };
}