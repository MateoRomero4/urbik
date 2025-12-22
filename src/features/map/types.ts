import type { Geometry } from "geojson";

export type Overlay = {
  geometry: Geometry;
  label?: string;
};

export type SelectedParcel = {
  CCA: string | null;
  PDA: string | null;
  geometry: Geometry;
  lat: number;
  lon: number;
};

export type OperationType = "RENT" | "SALE";

export type PropertyType =
  | "HOUSE"
  | "APARTMENT"
  | "LAND"
  | "COMMERCIAL_PROPERTY"
  | "OFFICE";

export type MapProperty = {
  id: number;
  title: string;
  price: number;
  latitude: number;
  longitude: number;
  city: string | null;
  province: string | null;
  operationType: OperationType;
  type: PropertyType;
  parcelCCA: string | null;
};
