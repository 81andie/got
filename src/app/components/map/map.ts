import { Component, effect, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as L from 'leaflet';
import { GotFeature, GotGeoJson, GotGeometry, GotCoordinatesMarker } from '../../../interfaces/got.interface';
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

    effect(() => {
      const selected = this.mapStateUpdate.searchLocalition()
      if (!selected.length || !this.map) return

      const latlngs = selected.map(p => [p.latitude, p.longitude] as [number, number]);
      //console.log(latlngs)
      this.map.fitBounds(latlngs, {
        padding: [50, 50], // margen alrededor de los markers
        animate: true,
        duration: 1.5,
        maxZoom: 18
      })



    })
  }

  private gotGeoService = inject(GotGeoService)
  public mapState = inject(GotGeoService);
  public mapStateUpdate = inject(GotGeoService)

  public markerPosicion: number[] = []

  private map: L.Map | undefined;
  private markers: GotGeometry[] = []

  private initMap(): void {
    this.map = L.map('map', {
      center: [40, -3.7],
      zoom: 4
    });

    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    L.control.zoom({
      position: 'bottomright' // bottomleft | bottomright | topleft | topright
    }).addTo(this.map);

    tiles.addTo(this.map);

    var popup = L.popup();

    const onMapClick = (e: any) => {
      if (this.map) {
        popup
          .setLatLng(e.latlng)
          .setContent("<p class='text-2xl'>Estas aquí</p>")
          .openOn(this.map);

        const coordinatesArr = this.mapStateUpdate.searchLocalition();

        let puntoA = e.latlng;

        let distanciaMinima = Infinity;
        let puntoMasCercano;

        coordinatesArr.forEach((item) => {

          const puntoB = L.latLng(item.latitude, item.longitude)
          var distance = puntoA.distanceTo(puntoB);

          if (distance < distanciaMinima) {
            distanciaMinima = distance
            puntoMasCercano = puntoB
          }

        });


        if (!puntoMasCercano) return;

        this.map.fitBounds([puntoMasCercano], {
          padding: [50, 50], // margen alrededor de los markers
          animate: true,
          duration: 1.5,
          maxZoom: 18
        })

      }

    }

    this.map.on('click', onMapClick);

  }




  getAlLocalize() {

    const cityIcon = L.icon({
      iconUrl: 'assets/marker.png',   // ruta a tu icono
      iconSize: [30, 30],
      iconAnchor: [25, 10],
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
              this.mapState.setLocation(p);
              this.mapStateUpdate.setSearchLocation([{ ...p, latitude: feature.geometry.coordinates[1], longitude: feature.geometry.coordinates[0] }])
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
