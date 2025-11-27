"use client";

import { GeoJSON, Tooltip } from "react-leaflet";
import type { Geometry } from "geojson";

type Props = {
  geometry: Geometry;
  label?: string;
};

export function SelectedParcelLayer({ geometry, label }: Props) {
  const feature = {
    type: "Feature" as const,
    properties: {},
    geometry,
  };

  return (
    <GeoJSON
      data={feature as GeoJSON.GeoJsonObject}
      className="selected-parcel-shine"
      style={() => ({
        color: "#f97316",
        weight: 3,
        fillColor: "#fb923c",
        fillOpacity: 0.2,
        dashArray: "8 8",
      })}
    >
      {label && (
        <Tooltip
          direction="top"
          offset={[0, -4]}
          sticky
          opacity={0.95}
          className="!bg-slate-900/80 !text-white !border !border-white/10 !shadow-lg"
        >
          {label}
        </Tooltip>
      )}
    </GeoJSON>
  );
}
