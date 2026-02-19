import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GotGeoService } from '../../../services/GotGeo.service';
import { GotFeature, GotGeometry } from '../../../interfaces/got.interface';

@Component({
  selector: 'app-mini-buscador',
  imports: [CommonModule, FormsModule],
  templateUrl: './mini-buscador.html',
  styleUrl: './mini-buscador.css',
})
export class MiniBuscador implements OnInit {

  public inputLocalization = "";

  public mapStateUpdated = inject(GotGeoService);
  localization = this.mapStateUpdated.searchLocalition;
  public allMarkers: GotFeature[] = [];
  public result: GotFeature[] = [];



getInputLocalization() {

  const input = this.inputLocalization.trim().toLowerCase()
  let filteredFeatures = this.allMarkers.filter(item =>
    item.properties.real_place.toLowerCase().includes(input) ||
    item.properties.country.toLowerCase() === input
  );

  if (filteredFeatures.length > 0) {
    this.mapStateUpdated.setSearchLocation(filteredFeatures[0].properties);
    console.log('Valor actual de la señal:', this.mapStateUpdated.searchLocalition());
  }
}


  getAllMarkers (){
  this.mapStateUpdated. getLocalizationMarkers().subscribe((geoJson:any)=>{
   this.allMarkers=geoJson.features||[]
     this.getInputLocalization()

  })
}










  ngOnInit(): void {
      this.getAllMarkers()



  }

}















