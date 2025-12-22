"use client";

import { GeoJSON, Tooltip } from "react-leaflet";
import type { Feature, Geometry } from "geojson";
import type { PathOptions } from "leaflet";

export function SelectedParcelLayer({
  geometry,
  label,
}: {
  geometry: Geometry;
  label?: string;
}) {
  const feature: Feature<Geometry> = {
    type: "Feature",
    properties: {},
    geometry,
  };

  return (
    <GeoJSON
      data={feature as unknown as GeoJSON.GeoJsonObject}
      style={() =>
        ({
          color: "#f97316",
          weight: 3,
          fillColor: "#fb923c",
          fillOpacity: 0.2,
          dashArray: "8 8",
        } as PathOptions)
      }
    >
      {label && (
        <Tooltip
          direction="top"
          offset={[0, -4]}
          sticky
          opacity={0.95}
          className="bg-slate-900/80 text-white border border-white/10 shadow-lg"
        >
          {label}
        </Tooltip>
      )}
    </GeoJSON>
  );
}
