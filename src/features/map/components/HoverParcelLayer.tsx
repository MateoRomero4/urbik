"use client";

import { GeoJSON, Tooltip } from "react-leaflet";
import type { Feature, Geometry } from "geojson";
import type { PathOptions } from "leaflet";

export function HoverParcelLayer({
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
          color: "#ffffff",
          weight: 2,
          fillColor: "#ffffff",
          fillOpacity: 0.08,
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
