export type DataClient = [
    jdds: string,
    code: string,
    email: string,
    prenom: string,
    nom: string,
    adresse: string,
    code_postal: string,
    ville: string,
    latitude: number,
    longitude: number,
    commandes: string, // Chaîne séparée par des virgules
    etat: string
];

// Fonction pour convertir une ligne CSV en tuple `DataClient`
export function processStringToDataClient(str: string): DataClient {
    const L = str.split(";"); // Séparation des valeurs CSV
    return [
        L[0], // jdds
        L[1], // code
        L[2], // email
        L[3]?.replace("�", "é"), // Correction des caractères spéciaux (prenom)
        L[4], // nom
        L[5], // adresse
        L[6], // code postal
        L[7], // ville
        parseFloat(L[8]), // latitude
        parseFloat(L[9]), // longitude
        L[10] || "", // commandes (séparées par des virgules)
        L[11] // état (livré, livrable, inscrit)
    ];
}
