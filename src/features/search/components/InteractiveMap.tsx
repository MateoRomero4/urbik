"use client";

import React, { useState, useEffect, ReactNode, useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { StaticParcelsLayer } from "./StaticParcelsLayer";
import { DbParcelsLayer } from "./DbParcelsLayer";
import { mapBaseLayers } from "@/features/mapSettings/baseLayers";
import { useMapSettings } from "@/features/mapSettings/MapSettingsProvider";
import { SelectedParcelLayer } from "./SelectedParcelLayer";
import type { Geometry } from "geojson";
// icono default
const defaultIcon = L.icon({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

type SelectedOverlay = {
  geometry: Geometry;
  label?: string;
};

interface InteractiveMapProps {
  lat: number;
  lon: number;
  query: string;
  children?: ReactNode;
  selectedOverlay?: SelectedOverlay | null;
  height?: string | number;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  lat,
  lon,
  query,
  children,
  selectedOverlay,
  height,
}) => {
  const { baseLayer } = useMapSettings();
  const position: [number, number] = [lat, lon];
  const [isClient, setIsClient] = useState(false);
  const currentBaseLayer = useMemo(
    () => mapBaseLayers[baseLayer] ?? mapBaseLayers.cartoLight,
    [baseLayer]
  );

  useEffect(() => setIsClient(true), []);

  if (!isClient) {
    return (
      <div className="bg-gray-200 flex items-center justify-center h-96">
        Cargando mapa...
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-10 px-3 py-2 bg-black/75 text-white text-xs rounded shadow-lg backdrop-blur">
        <div className="uppercase tracking-wide text-[10px] text-white/70">
          Mapa base
        </div>
        <div className="text-sm font-semibold">{currentBaseLayer.label}</div>
      </div>

      <div className="absolute bottom-3 left-3 z-10 px-4 py-2 bg-black/70 text-white text-sm rounded shadow-lg">
        {query || "Urbik"}
      </div>

      <MapContainer
        center={position}
        zoom={15} // igual que el HTML
        minZoom={14}
        maxZoom={18}
        scrollWheelZoom={true}
        style={{ height: height ?? "100vh", width: "100%" }}
      >
        {/* Mapa base OSM */}
        <TileLayer
          attribution={currentBaseLayer.attribution}
          url={currentBaseLayer.url}
        />

        {/* Tiles estáticos de parcelas (QGIS) */}
        <StaticParcelsLayer />
        <DbParcelsLayer />

        {/* Lo que quieras encima (click, parcels DB, etc.) */}
        {children}
        {selectedOverlay && (
          <SelectedParcelLayer
            geometry={selectedOverlay.geometry}
            label={selectedOverlay.label}
          />
        )}
      </MapContainer>
    </div>
  );
};
