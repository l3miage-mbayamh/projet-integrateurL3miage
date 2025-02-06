export type DataProduit = [
    reference: string,
    titre: string,
    description: string,
    prix: number,
    optionMontage: boolean
];


export function processStringToDataProduit(str: string): DataProduit {
    const L = str.split(";");

    return [
        L[1], // Référence du produit
        L[3], // Titre du produit
        L[4], // Description du produit
        parseFloat(L[5].replace("€", "").trim()), // Prix du produit
        L[6] === "true" // Option de montage (true/false)
    ];
}
