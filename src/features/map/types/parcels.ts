import type {
  FeatureCollection,
  Polygon,
  MultiPolygon,
  Geometry,
  Feature,
} from "geojson";

export type ParcelaProps = {
  CCA?: string;
  PDA?: string;
  [key: string]: unknown;
};

export type LaplataGeoJSON = FeatureCollection<
  Polygon | MultiPolygon,
  ParcelaProps
>;

export type SelectedParcel = {
  CCA: string | null;
  PDA: string | null;
  geometry: Geometry;
  lat: number;
  lon: number;
};

export type Overlay = {
  geometry: Geometry;
  label?: string;
};

export type ParcelaFeature = Feature<Geometry, ParcelaProps>;
