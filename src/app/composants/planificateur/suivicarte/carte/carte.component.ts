import { map } from 'rxjs/operators';
import { CommandeService } from './../../../../services/commande.service';
import { ChangeDetectorRef, Component, computed, input, model, output, signal } from '@angular/core';
import { Icon, icon, LatLng, latLng, Layer, marker, Marker, tileLayer, geoJSON, GeoJSON, LeafletMouseEvent } from 'leaflet';
import { Client } from '../../../../interfaces/Client';
import { Etat } from '../../../../interfaces/enums/Etat';

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
  public clients = input.required<Client[][]>();

  // Couches affichées
  /*public readonly layers = computed<Layer[]>(() => {
    const layers: Layer[] = [this.layer, ...this.markers()];
    if (this.routeGeoJson()) {
      layers.push(geoJSON(this.routeGeoJson() as any, { style: { color: 'blue', weight: 4 } }));
    }
    return layers;
  });*/

  /*
  public readonly layers = computed<Layer[]>(() => {
    const layers: Layer[] = [this.layer, ...this.markers()];
    if (this.routeGeoJson()) {
      layers.push(geoJSON(this.routeGeoJson() as any, { style: { color: 'blue', weight: 4 } }));
    }
    return layers;
  });*/


  /*
  public readonly layers = computed<Layer[]>(() => {
    const layers: Layer[] = [this.layer, ...this.markers()];

    // Ajouter les itinéraires de chaque groupe de clients à la couche
    if (this.routeGeoJson()) {
      layers.push(geoJSON(this.routeGeoJson() as any, {
        style: (feature) => {
          if (!feature || !feature.properties) {
            return { color: 'blue', weight: 4 }; // Valeur par défaut si feature est undefined
          }
          return {
            color: feature.properties.color || 'blue', // Appliquer la couleur du GeoJSON
            weight: 4
          };
        }
      }));
    }
    return layers;
});*/

  public readonly layers = computed<Layer[]>(() => {
    const layers: Layer[] = [this.layer, ...this.markers()];

    // Ajouter les marqueurs des clients
    const clientMarkers = this.clients().flatMap(clientGroup =>
      clientGroup.map(client => this.createMarker(client))
    );
    layers.push(...clientMarkers);

    // Ajouter les itinéraires
    if (this.routeGeoJson()) {
      layers.push(geoJSON(this.routeGeoJson() as any, {
        style: (feature) => ({
          color: feature?.properties?.color || 'blue',
          weight: 4
        })
      }));
    }

    return layers;
  });


  /*private createMarker(client: Client): Marker {
    return marker([client.latitude, client.longitude], {
      icon: icon({
        ...Icon.Default.prototype.options,
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
      })
    })
      .on('mouseover', (event) => this.showClientInfo(event, client))
      .on('mouseout', () => this.hideClientInfo()) // Cacher les infos
      .on('click', () => this.selectClient(client)); // Sélectionner un client
  }*/

      private createMarker(client: Client): Marker {
        return marker([client.latitude, client.longitude], {
          icon: icon({
            ...Icon.Default.prototype.options,
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
          })
        })
          .on('mouseover', (event: LeafletMouseEvent) => this.showClientInfo(event, client)) // Survol
          .on('mouseout', () => this.hideClientInfo()); // Cacher les infos
      }


  constructor(public commandeService: CommandeService,private cdr: ChangeDetectorRef) { }


  hoveredClient: Client | null = null;
  tooltipX = 0;
  tooltipY = 0;

  // Affichage des informations du client au survol
  showClientInfo(event: LeafletMouseEvent, client: Client) {
    this.hoveredClient = client;
    this.tooltipX = event.originalEvent.pageX + 10;
    this.tooltipY = event.originalEvent.pageY + 10;
    this.cdr.detectChanges(); // Force l'UI à se mettre à jour
  }

  hideClientInfo() {
    console.log('Masquer les infos du client');
    this.hoveredClient = null;
  }

  // Sélection d'un client (optionnel)
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

  /*public traceItinerary(): void {
    if (this.clients().length === 0) {
    console.warn('Aucun groupe de clients trouvé.');
    return;
  }

  // Boucler à travers chaque tableau de clients
  this.clients().forEach((clientGroup, index) => {
    // Récupérer les LatLng pour ce groupe de clients
    this.commandeService.getClientsLatLng(clientGroup).subscribe((coordinates) => {
      // S'assurer qu'il y a au moins deux points pour tracer un itinéraire
      if (coordinates.length < 2) {
        console.warn(`Il faut au moins deux points pour le groupe de clients ${index + 1}`);
        return;
      }

      // Définir la couleur pour cet itinéraire (ex : couleur différente par groupe)
      const color = this.getColorForGroup(index);

      // Convertir les coordonnées en tableau [lng, lat]
      const coords: [number, number][] = coordinates.map(({ lat, lng }) => [lng, lat] as [number, number]);

      // Appeler la méthode de commande pour obtenir l'itinéraire
      this.commandeService.getItinerary(coords).subscribe(data => {
        this.routeGeoJson.set({
          ...data,
          properties: {
            color: color,  // Ajouter la couleur au GeoJSON pour appliquer le style
          }
        });
      }, error => {
        console.error('Erreur lors de la récupération de l’itinéraire pour le groupe ', index + 1, error);
      });
    });
  });
  }

  // Fonction pour obtenir une couleur en fonction du groupe (index)
private getColorForGroup(groupIndex: number): string {
  const colors = ['blue', 'red', 'green', 'orange', 'purple', 'pink']; // Ajouter plus de couleurs si besoin
  return colors[groupIndex % colors.length]; // Choisir la couleur en fonction de l'index du groupe
}*/


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
