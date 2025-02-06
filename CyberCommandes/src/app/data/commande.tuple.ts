export type DataCommande = [
    jdds: string[],
    reference: string,
    etat: string,
    dateCreation: string,
    note: number | null,
    commentaire: string | null,
    clientEmail: string,
    lignes: string[]
];

// Fonction pour convertir une ligne CSV en tuple `DataCommande`
export function processStringToDataCommande(str: string): DataCommande {
    const L = str.split(";");
    
    return [
        L[0].split(","), // jdds peut être une liste séparée par des virgules
        L[1], // Référence de la commande
        L[2]?.replace("�", "é"), // Correction des caractères spéciaux (état)
        L[3], // Date de création
        L[4] ? parseInt(L[4]) : null, // Note (peut être null)
        L[5] || null, // Commentaire (peut être null)
        L[6], // Email du client
        L[7] ? L[7].split(",") : [] // Lignes de commande (séparées par des virgules)
    ];
}
