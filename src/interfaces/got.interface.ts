export interface GotGeoJson {
  type: 'FeatureCollection';
  features: GotFeature[];
}

export interface GotFeature {
  type: 'Feature';
  properties: GotProperties;
  geometry: GotGeometry;
}

export interface GotProperties {
  latitude: any;
  longitude: any;
  id: string;
  series: string;
  scene: string;
  real_place: string;
  country: string;
  actors: GotActor[];
  place_image: string;
  place_logo: string;
}

export interface GotActor {
  name: string;
  nameActor:string;
  image: string;
}

export interface GotGeometry {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

export interface GotCoordinatesMarker {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}
