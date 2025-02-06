import { Injectable, signal } from '@angular/core';
import rawData from '../data/liste-Client.csv'; // Importation du CSV
import { processStringToDataClient } from '../data/clients.tuple';
import { Client, processClientFromTuple } from '../data/clients.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly _clients = signal<readonly Client[]>([]);
  public readonly clients = this._clients.asReadonly();

  constructor() {
    const lignes = rawData.split("\n");
    const clientsData = lignes.map(processStringToDataClient).map(processClientFromTuple);
    this._clients.set(clientsData);
  }
}
