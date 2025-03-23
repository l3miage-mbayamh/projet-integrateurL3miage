import { EntrepotData } from "./entrepotData";
import { TypeCamion } from "./TypeCamion";

export interface Camion{
    code:string,
    immatriculation: string,
    kilometrage: number,
    entrepot?: EntrepotData,
    type?: TypeCamion
}