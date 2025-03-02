import { Component, computed, input, model, output, signal } from '@angular/core';
import { Icon, icon, latLng, LatLng, Layer, MapOptions, marker, Marker, tileLayer } from 'leaflet';


@Component({
  selector: 'app-suivicarte',
  templateUrl: './suivicarte.component.html',
  styleUrl: './suivicarte.component.css'
})
export class SuivicarteComponent {

  //declaration de signal
  public readonly markers = signal<readonly LatLng[]>([latLng(45.166672, 5.71667), latLng(45.166672, 5.71667)])
  

}
