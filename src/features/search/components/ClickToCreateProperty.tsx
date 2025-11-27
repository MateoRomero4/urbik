"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";
import * as turf from "@turf/turf";
import type {
  FeatureCollection,
  Polygon,
  MultiPolygon,
  Geometry,
} from "geojson";

type LaplataGeoJSON = FeatureCollection<
  Polygon | MultiPolygon,
  { CCA?: string; PDA?: string }
>;

type SelectedParcel = {
  CCA: string | null;
  PDA: string | null;
  geometry: Geometry;
  lat: number;
  lon: number;
};

interface Props {
  onParcelPicked: (parcel: SelectedParcel) => void;
}

let cache: LaplataGeoJSON | null = null;

export function ClickToCreateProperty({ onParcelPicked }: Props) {
  const map = useMap();
  const loadingRef = useRef(false);

  useEffect(() => {
    const load = async () => {
      if (cache || loadingRef.current) return;
      loadingRef.current = true;

      try {
        const res = await fetch("/laplata.geojson");
        cache = (await res.json()) as LaplataGeoJSON;
      } catch (err) {
        console.error("Error cargando laplata.geojson:", err);
      } finally {
        loadingRef.current = false;
      }
    };

    load();

    const handleClick = async (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      if (!cache) await load();
      if (!cache) return;

      const point = turf.point([lng, lat]);

      for (const feature of cache.features) {
        if (turf.booleanPointInPolygon(point, feature)) {
          onParcelPicked({
            CCA: feature.properties?.CCA ?? null,
            PDA: feature.properties?.PDA ?? null,
            geometry: feature.geometry,
            lat,
            lon: lng,
          });
          return;
        }
      }
    };

    map.on("click", handleClick);
    return () => map.off("click", handleClick);
  }, [map, onParcelPicked]);

  return null;
}
