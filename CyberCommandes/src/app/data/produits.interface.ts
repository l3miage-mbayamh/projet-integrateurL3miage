import { DataProduit } from "./produits.tuple";

export interface Produit {
    readonly reference: string;
    readonly titre: string;
    readonly description: string;
    readonly prix: number;
    readonly optionMontage: boolean;
}


export function processProduitFromTuple(tuple: DataProduit): Produit {
    return {
        reference: tuple[0],
        titre: tuple[1],
        description: tuple[2],
        prix: tuple[3],
        optionMontage: tuple[4]
    };
}
