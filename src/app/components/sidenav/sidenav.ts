import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { GotGeoService } from '../../../services/GotGeo.service';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
})
export class Sidenav {

    constructor() {

    effect(() => {
      if (this.localization()) {
        this.opened = true;   // se abre automáticamente
      }
    });
  }

  private mapState = inject(GotGeoService)
  localization = this.mapState.selectLocation
  opened = false;


  toggle() {
  if (!this.localization()) return; // solo abre si hay localización
  this.opened = !this.opened;
  }


  clear() {
    this.mapState.clear();
    this.opened = false;
  }


}






