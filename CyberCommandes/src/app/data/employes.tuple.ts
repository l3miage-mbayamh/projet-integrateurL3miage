export type ListEmploye = [
    tigrame:string,
    prenom : string,
    nom: string,
    photo : string,
    telephone:string,
    email:string,
    emploi:"Planificateur"|"Livreur",
    
]


export function processStringToDataEmploye(str: string): ListEmploye {
    const L = str.split(";");
    return [
        L[1],
        L[2],
        L[3],
        L[4],
        L[5],
        L[6] ,
        L[7] === "Planificateur" ? "Planificateur" : "Livreur"
    ]
}