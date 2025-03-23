import { Component, computed, input, model, output } from '@angular/core';
import { Icon, icon, LatLng, latLng, Layer, marker, Marker, tileLayer } from 'leaflet';

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrl: './carte.component.css'
})
export class CarteComponent {
  //creation des entrees et sorties
  public readonly latitude = model<number>(45.166672)
  public readonly longitude = model<number>(5.71667)
  public readonly zoom = model<number>(10)
  public readonly clickOnMap  = output<LatLng>()

//gestion pour afficher la carte
  public readonly center = computed<LatLng>(()=>latLng(this.latitude(), this.longitude()) )
  public readonly layer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
  })
  public readonly marquer = input.required<readonly LatLng[]>();
  public readonly markers = computed(()=>this.marquer().map(this.latLngToMarker))
  public readonly layers = computed<Layer[]>(()=> [this.layer, ...this.markers()])

  
  protected latLngToMarker(latLng: LatLng): Marker {
    return marker(
        [latLng.lat, latLng.lng], {
        icon: icon({
        ...Icon.Default.prototype.options,
        iconUrl: 'assets/marker-icon.png',
        iconRetinaUrl: 'assets/marker-icon-2x.png',
        shadowUrl: 'assets/marker-shadow.png'
        })
    });
  }


}
