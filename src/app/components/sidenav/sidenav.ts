import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { GotGeoService } from '../../../services/GotGeo.service';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
})
export class Sidenav {

  private mapState = inject(GotGeoService)
  localization = this.mapState.selectLocation


  openedSidebar = computed(() => !!this.localization());

  toggle() {
    // solo abre si hay localización
    if (this.localization()) return;
  }


  clear() {
    this.mapState.clear();
  }


}






