import { map } from 'rxjs/operators';
import { CommandeService } from './../../../../services/commande.service';
import { ChangeDetectorRef, Component, computed, inject, input, model, output, signal } from '@angular/core';
import L, { Icon, icon, LatLng, latLng, Layer, marker, Marker, tileLayer, geoJSON, GeoJSON, LeafletMouseEvent } from 'leaflet';
import { Client } from '../../../../interfaces/Client';
import { Etat } from '../../../../interfaces/enums/Etat';
import { forkJoin, Observable } from 'rxjs';
import { GeoJsonObject } from 'geojson';

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
  public service = inject(CommandeService);

  public clientLatlng = signal<LatLng[][]>([])

  // Gestion de la carte avec le centre et la couche de la carte
  public readonly center = computed<LatLng>(() => latLng(this.latitude(), this.longitude()));
  public readonly layer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
  });


  // Entrée des marqueurs (LatLng[])
  public readonly marquer = input.required<readonly LatLng[]>();

  // Calcul des marqueurs à partir des LatLng
  public readonly markers = computed(() => this.marquer().map((latLng, index) => latLngToMarker(latLng, index)));

  //public readonly markers = computed(() => this.clientLatlng().map((latLng, index) =>latLng.map(((lat,indice)=>latLngToMarker(lat, indice))) ));
  // Définir les couches de la carte
  //public readonly layers = computed<Layer[]>(() => [this.layer, ...this.markers()]);


  private routeLayer: GeoJSON | null = null;
  public readonly routeGeoJson = signal<any>(null);
  public clients = input.required<Client[][]>();



  public readonly layers = computed<Layer[]>(() => {
    const layers: Layer[] = [this.layer, ...this.markers()];

    // Ajouter les marqueurs des clients
    const clientMarkers = this.clients().flatMap(clientGroup =>
      clientGroup.map(client => this.createMarker(client))
    );
    layers.push(...clientMarkers);

    // Ajouter les itinéraires
    /*if (this.routeGeoJson()) {
      layers.push(geoJSON(this.routeGeoJson() as any, {
        style: (feature) => ({
          color: feature?.properties?.color || 'yellow',
          weight: 4
        })
      }));
    }*/

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


  constructor(public commandeService: CommandeService, private cdr: ChangeDetectorRef) {
  }



  hoveredClient: Client | null = null;
  tooltipX = 0;
  tooltipY = 0;

  // Affichage des informations du client au survol
  showClientInfo(event: LeafletMouseEvent, client: Client) {
    this.hoveredClient = client;
    this.tooltipX = event.originalEvent.pageX;
    this.tooltipY = event.originalEvent.pageY;
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

    this.service.getClientsClientLatLng(this.clients()).subscribe(
      (coordonnee) => (
        coordonnee.map((coord, index)=> {
          coord.unshift(this.service.getCoordonneEntrepot())
        }
        ),
        this.clientLatlng.set(coordonnee), console.log("clients[][] latlng: ", this.clientLatlng())
      )
    )
    if (this.clientLatlng().length === 0) {
      console.warn("Aucun itinéraire à tracer.");
      return;
    }

    const colors = ['red', 'blue', 'green', 'orange', 'purple', 'brown', 'pink']
    this.clientLatlng().forEach((element,index) => {
      // Convertir les marqueurs en tableau [lng, lat]
    const coords: [number, number][] = element.map(({ lat, lng }) => [lng, lat] as [number, number]);

    // Récupérer l'itinéraire depuis OpenRouteService
    this.commandeService.getItinerary(coords).subscribe(data => {
      this.routeGeoJson.set(data);
      if (this.routeGeoJson()) {
        this.layers().push(geoJSON(this.routeGeoJson() as any, {
          style: (feature) => ({
            color: colors[index],
            weight: 4
          })
        }));
      }
    }, error => {
      console.error('Erreur lors de la récupération de l’itinéraire :', error);
    });

    });


    /*
    // Convertir les marqueurs en tableau [lng, lat]
    const coords: [number, number][] = this.marquer().map(({ lat, lng }) => [lng, lat] as [number, number]);

    // Récupérer l'itinéraire depuis OpenRouteService
    this.commandeService.getItinerary(coords).subscribe(data => {
      this.routeGeoJson.set(data);
      if (this.routeGeoJson()) {
        this.layers().push(geoJSON(this.routeGeoJson() as any, {
          style: (feature) => ({
            color: feature?.properties?.color || 'yellow',
            weight: 4
          })
        }));
      }
    }, error => {
      console.error('Erreur lors de la récupération de l’itinéraire :', error);
    });*/
  }

  /*public traceItinerary(markersGroups: LatLng[][]): void {
    if (!markersGroups.length) {
      console.warn('Aucun groupe de marqueurs fourni.');
      return;
    }

    const colors = ['red', 'blue', 'green', 'orange', 'purple', 'brown', 'pink'];
    let colorIndex = 0;

    markersGroups.forEach((markers, index) => {
      if (markers.length < 2) {
        console.warn(`Le groupe ${index + 1} doit contenir au moins deux marqueurs pour tracer un itinéraire.`);
        return;
      }

      const coords: [number, number][] = markers.map(({ lat, lng }) => [lng, lat]);
      const color = colors[colorIndex % colors.length];
      colorIndex++;

      this.commandeService.getItinerary(coords).subscribe(data => {
        // Ajouter la couleur à chaque segment de l'itinéraire
        if (data.features) {
          data.features.forEach(feature => {
            feature.properties = feature.properties || {};
            feature.properties.color = color;
          });
        }

        this.routeGeoJson.set(data);
      }, error => {
        console.error(`Erreur lors de la récupération de l’itinéraire du groupe ${index + 1} :`, error);
      });
    });
  }*/





  /*
  public traceItinerary(): void {
    this.service.getClientsClientLatLng(this.clients()).subscribe(
      (coordonnee: LatLng[][]) => (
        coordonnee.map((coord)=>{
          const newCoord=coord;
          coord=[this.service.getCoordonneEntrepot(),...newCoord]
        }),
        this.clientLatlng.set(coordonnee), console.log("clients[][] latlng: ", this.clientLatlng())
      )
    )
    if (this.clientLatlng.length === 0) {
      console.warn("Aucun itinéraire à tracer.");
      return;
    }

    const colors = ["#FF0000", "#0000FF", "#008000", "#FFA500", "#800080"];

    // Convertir chaque itinéraire en requête OpenRouteService et appeler l'API
    const requests: Observable<GeoJsonObject>[] = this.clientLatlng()
      .map(route => {
        if (route.length < 2) {
          console.warn("Un itinéraire a moins de deux points.");
          return null;
        }

        const coords: [number, number][] = route.map(({ lat, lng }) => [lng, lat]);

        return this.service.getItinerary(coords).pipe(
          map(response => {
            // Vérifier si la réponse est un tableau et extraire le premier élément
            if (Array.isArray(response) && response.length > 0) {
              return response[0] as GeoJsonObject;
            }
            return response;
          })
        }
        );
      })
      .filter((req): req is Observable<GeoJsonObject> => req !== null); // Filtrer les nulls

    // Exécuter toutes les requêtes en parallèle
    forkJoin(requests).subscribe(
      (results: GeoJsonObject[]) => {
        results.forEach((data, index) => {
          const color = colors[index % colors.length];
          const layer = L.geoJSON(data, { style: { color: color, weight: 4 } });
          this.addLayer(layer);
        });
      },
      error => {
        console.error("Erreur lors de la récupération des itinéraires :", error);
      }
    );
  }*/
  private addLayer(layer: L.GeoJSON): void {
    if (this.routeGeoJson && typeof this.routeGeoJson.set === "function") {
      this.routeGeoJson.set(layer);
    } else {
      console.error("routeGeoJson n'est pas correctement initialisé.");
    }
  }


  /*
  // Fonction pour obtenir une couleur en fonction du groupe (index)
  private getColorForGroup(groupIndex: number): string {
    const colors = ['blue', 'red', 'green', 'orange', 'purple', 'pink']; // Ajouter plus de couleurs si besoin
    return colors[groupIndex % colors.length]; // Choisir la couleur en fonction de l'index du groupe
  }*/


  // Fonction pour convertir LatLng en marqueur
}

/*
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

*/
function latLngToMarker(latLng: LatLng, index: number): Marker {
  return marker([latLng.lat, latLng.lng], {
    icon: icon({
      iconUrl: index === 0
        ? 'https://cdn-icons-png.flaticon.com/128/1076/1076999.png'  // Icône entrepôt plus petite
        : 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', // Icône par défaut

      iconRetinaUrl: index === 0
        ? 'https://cdn-icons-png.flaticon.com/128/1076/1076999.png'  // Version Retina
        : 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',

      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [32, 32],       // Taille de l'icône (ajuste selon tes besoins)
      iconAnchor: [16, 32],     // Point d’ancrage au bas du marqueur
      popupAnchor: [0, -32]     // Position du popup par rapport à l’icône

    })

  });
}
