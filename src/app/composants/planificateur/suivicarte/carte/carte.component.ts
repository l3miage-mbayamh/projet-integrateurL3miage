import { Component, computed, output, signal } from '@angular/core';
import { latLng, LatLng, Layer, TileLayer, tileLayer } from 'leaflet';

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrl: './carte.component.css'
})
export class CarteComponent {

//attribut pour les coordonnées de la carte
public readonly latitude = signal<number>(45.766612)
public readonly longitude = signal<number>(5.76612)
public readonly zoom = signal<number>(5)
//centre
public readonly center =  computed<LatLng>(()=>latLng(this.latitude(), this.longitude()))

//sortie vers suivie carte
public readonly onClick = output<LatLng>()
//lien pour map
public readonly baseLayer = signal<TileLayer> (tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom: 18, attribution: '...'}))
public readonly layers = computed<Layer[]> (()=>[this.baseLayer()])


}
