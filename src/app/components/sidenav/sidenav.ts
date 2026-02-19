import { Component, computed, effect, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common'
import { GotGeoService } from '../../../services/GotGeo.service';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
})
export class Sidenav {

    constructor(@Inject(PLATFORM_ID) platformId: Object) {

    effect(() => {
      if (this.localization()) {
        this.opened = true;   
      }
    });




  }

  private mapState = inject(GotGeoService)
  localization = this.mapState.selectLocation
  opened = false;


  toggle() {
  if (!this.localization()) return;
  this.opened = !this.opened;
  }


  clear() {
    this.mapState.clear();
    this.opened = false;
  }


}






