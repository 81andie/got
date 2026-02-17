import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as L from 'leaflet';
import { GotFeature, GotGeoJson, GotGeometry } from '../../../interfaces/got.interface';
import { GotGeoService } from '../../../services/GotGeo.service';



@Component({
  selector: 'app-map',
  imports: [CommonModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map implements OnInit {
  isBrowser: any;

  constructor(@Inject(PLATFORM_ID) platformId: Object,
    private gotService: GotGeoService) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private gotGeoService = inject(GotGeoService)
  public mapState = inject(GotGeoService);
  private map: L.Map | undefined;
  private markers: GotGeometry[] = []

  private initMap(): void {
    this.map = L.map('map', {
      center: [40, -3.7],
      zoom: 4
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 10,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    L.control.zoom({
      position: 'bottomright' // bottomleft | bottomright | topleft | topright
    }).addTo(this.map);

    tiles.addTo(this.map);

  }



  getAlLocalize() {

    const cityIcon = L.icon({
      iconUrl: 'assets/marker.png',   // ruta a tu icono
      iconSize: [20, 20],
      iconAnchor: [15, 40],
      popupAnchor: [0, -35]
    });


    this.gotGeoService.getLocalization().subscribe((data: GotGeometry[]) => {
    //  console.log(data)
      if (this.map) {
        L.geoJSON(data, {
          pointToLayer: (feature: GotFeature, latlng: L.LatLng) => L.marker(latlng, { icon: cityIcon }),
          onEachFeature: (feature: GotFeature, layer: L.Layer) => {
            const p = feature.properties;

           // console.log(p.place_image)

            layer.on('click', () => {
            // 🔥 AQUÍ ESTÁ LA CONEXIÓN CON EL SIDEBAR
            this.mapState.setLocation(p);
          });


            layer.bindPopup(`


<div class="space-y-3.5 ">
        <h3 class="font-semibold text-heading bg-fg-purple">Localizaciones</h3>
         <span class="font-semibold p-1 mt-1 mb-1">${p.real_place}</span>
        <div class="w-full bg-neutral-quaternary rounded-full  mb-4">
        <img src="${p.place_image}">
    </div>
            `);
          }
        }).addTo(this.map);
      }
    });
  }




  ngOnInit(): void {
    this.initMap();
    this.getAlLocalize()
  }
}
