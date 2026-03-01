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
  private miniMap: L.Map | undefined;

  private initMap(): void {
    this.map = L.map('map', {
      center: [40, -3.7],
      zoom: 4
    });


    const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors © CARTO'
    });


    tiles.addTo(this.map);

    this.miniMap = L.map('mini-map', {
      center: [40, -3.7],
      zoom: 2,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
    ).addTo(this.miniMap);

    this.map.on('move', () => {
      if (!this.map || !this.miniMap) return;
      this.miniMap.setView(
        this.map.getCenter(),
        Math.max(this.map.getZoom() - 2, 1),
        { animate: false }
      );
    });


    var popup = L.popup();

    const onMapClick = (e: L.LeafletMouseEvent) => {
      if (!this.map) return;
      if (this.map) {
        popup
          .setLatLng(e.latlng)
          .setContent("<p class='text-2xl'>Estas aquí</p>")
          .openOn(this.map);

        const coordinatesArr = this.mapStateUpdate.searchLocalition();
        if (!coordinatesArr.length) return;

        let puntoA = e.latlng;

        let distanciaMinima = Infinity;
        let puntoMasCercano: L.LatLng | null = null;

        coordinatesArr.forEach((item) => {

          console.log(item)

          const puntoB = L.latLng(item.latitude, item.longitude)
          var distance = puntoA.distanceTo(puntoB);

          if (distance < distanciaMinima) {
            distanciaMinima = distance
            puntoMasCercano = puntoB
          }

        });


        if (!puntoMasCercano) return;

        this.map.fitBounds([puntoMasCercano], {
          padding: [10, 10],
          animate: true,
          duration: 1.5,
          maxZoom: 12
        })


      }

    }

    this.map.on('click', onMapClick);

  }




  getAlLocalize() {

    const cityIcon = L.icon({
      iconUrl: 'assets/pin-point.png',   // ruta a tu icono
      iconSize: [30, 30],
      iconAnchor: [15, 30],
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

  <div class="w-64 z-0 space-y-4 font-sans bg-stone-100 rounded-lg">

    <!-- Label -->
    <p class="text-xs uppercase tracking-widest text-stone-400">
      Localización
    </p>

    <!-- Título -->
    <h2 class="text-lg font-semibold text-black leading-tight">
      ${p.real_place}
    </h2>

    <!-- Imagen -->
    <div class="overflow-hidden rounded-lg border border-white/10">
      <img
        src="${p.place_image}"
        class="w-full h-36 object-cover"
        alt="${p.real_place}"
      >
    </div>

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
