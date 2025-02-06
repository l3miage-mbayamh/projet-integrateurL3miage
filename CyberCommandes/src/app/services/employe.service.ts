import { Injectable ,signal, WritableSignal} from '@angular/core';
import rawData from '../data/liste-Employes.csv';
import {processStringToDataEmploye} from '../data/employes.tuple';
import { Employe, processEmployeFromTuple } from '../data/employes.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeService {
  private readonly _employes = signal<readonly Employe[]>([]);
  public readonly employes = this._employes.asReadonly();
  
  
  constructor() { 
   // console.log(rawData);
    const lines = rawData.split("\n");
    const Ldata = lines.map(processStringToDataEmploye)
    this._employes.set(Ldata.map(processEmployeFromTuple));

    const LC = rawData.split("\n")
    .map( processStringToDataEmploye )
    .map( processEmployeFromTuple )

   // console.log(LC);
  }
}
