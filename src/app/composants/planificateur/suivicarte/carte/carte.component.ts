import { CommandeService } from './../../../../services/commande.service';
import { Component, computed, input, model, output, signal } from '@angular/core';
import { Icon, icon, LatLng, latLng, Layer, marker, Marker, tileLayer, geoJSON, GeoJSON } from 'leaflet';
import { Client } from '../../../../interfaces/Client';

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.css']
})
export class CarteComponent {
  // Déclaration des variables de modèle
  public readonly latitude = model<number>(45.166672);
  public readonly longitude = model<number>(5.71667);
  public readonly zoom = model<number>(10);
  public readonly clickOnMap = output<LatLng>();

  // Gestion de la carte avec le centre et la couche de la carte
  public readonly center = computed<LatLng>(() => latLng(this.latitude(), this.longitude()));
  public readonly layer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
  });


  // Entrée des marqueurs (LatLng[])
  public readonly marquer = input.required<readonly LatLng[]>();

  // Calcul des marqueurs à partir des LatLng
  public readonly markers = computed(() => this.marquer().map(latLngToMarker.bind(this)));

  // Définir les couches de la carte
  //public readonly layers = computed<Layer[]>(() => [this.layer, ...this.markers()]);


  private routeLayer: GeoJSON | null = null;
  public readonly routeGeoJson = signal<any>(null);

  // Couches affichées
  public readonly layers = computed<Layer[]>(() => {
    const layers: Layer[] = [this.layer, ...this.markers()];
    if (this.routeGeoJson()) {
      layers.push(geoJSON(this.routeGeoJson() as any, { style: { color: 'blue', weight: 4 } }));
    }
    return layers;
  });
  constructor(public commandeService: CommandeService) {}

  public clients=input.required<Client[]>();

  hoveredClient: Client | null = null;
  tooltipX = 0;
  tooltipY = 0;

  private createMarker(client: Client): Marker {
    return marker([client.latitude, client.longitude], {
      icon: icon({
        ...Icon.Default.prototype.options,
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
      })
    })
    .on('mouseover', (event) => this.showClientInfo(event, client)) // Survol
    .on('mouseout', () => this.hideClientInfo()) // Cacher les infos
    .on('click', () => this.selectClient(client)); // Sélectionner un client
  }

  // Affichage des informations du client au survol
  showClientInfo(event: any, client: Client) {
    this.hoveredClient = client;
    this.tooltipX = event.originalEvent.pageX + 10; // Décalage pour éviter qu'il ne soit trop proche
    this.tooltipY = event.originalEvent.pageY + 10;
  }

  // Cacher les informations lorsque le survol disparaît
  hideClientInfo() {
    this.hoveredClient = null;
  }

  // Fonction pour sélectionner un client
  selectClient(client: Client) {
    this.hoveredClient = client;
  }

  // Calcule les couches à afficher sur la carte
  /*public readonly layers = computed<Layer[]>(() => {
    const clientMarkers = this.clients().map(client => this.createMarker(client)); // Crée des marqueurs pour chaque client
    return [this.layer, ...clientMarkers]; // Retourne la couche de fond + les marqueurs des clients
  });*/
  // Fonction pour récupérer et tracer l'itinéraire
  public traceItinerary(): void {
    if (this.marquer().length < 2) {
      console.warn('Ajoute au moins deux marqueurs pour tracer un itinéraire.');
      return;
    }

    // Convertir les marqueurs en tableau [lng, lat]
    const coords: [number, number][] = this.marquer().map(({ lat, lng }) => [lng, lat] as [number, number]);

    // Récupérer l'itinéraire depuis OpenRouteService
    this.commandeService.getItinerary(coords).subscribe(data => {
      this.routeGeoJson.set(data);
    }, error => {
      console.error('Erreur lors de la récupération de l’itinéraire :', error);
    });
  }

  // Fonction pour convertir LatLng en marqueur
}
function latLngToMarker(latLng: LatLng): Marker {
  return marker([latLng.lat, latLng.lng], {
    icon: icon({
      ...Icon.Default.prototype.options,
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
    })
  });
}
