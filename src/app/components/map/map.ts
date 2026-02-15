import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';


@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map implements OnInit {

  constructor() { }


  private map: any;

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

  ngOnInit(): void {
    this.initMap();
  }
}
