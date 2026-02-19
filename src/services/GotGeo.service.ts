import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GotGeometry } from '../interfaces/got.interface';
import { GotFeature } from '../interfaces/got.interface';


@Injectable({ providedIn: 'root' })
export class GotGeoService {

  constructor(private http: HttpClient){}

  private geoLocalize = 'assets/prueba.geojson';
  private _selectLocation = signal<GotFeature['properties'] | null>(null);
  private _searchLocation = signal<Array<GotFeature['properties'] & {latitude: number, longitude: number}>>([]);

  selectLocation = this._selectLocation.asReadonly();
  searchLocalition = this._searchLocation.asReadonly()

  getLocalization(){
  return this.http.get<[GotGeometry]>(this.geoLocalize)
}

  getLocalizationMarkers(){
  return this.http.get<[GotFeature]>(this.geoLocalize)
}

  setLocation(properties: GotFeature['properties']) {
    this._selectLocation.set(properties);
  }

  setSearchLocation(properties: Array<GotFeature['properties'] & {latitude: number, longitude: number}>){
     this._searchLocation.set(properties)
  }

  clear() {
    this._selectLocation.set(null);
  }


}
