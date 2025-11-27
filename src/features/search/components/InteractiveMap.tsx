"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { StaticParcelsLayer } from "./StaticParcelsLayer";
import { DbParcelsLayer } from "./DbParcelsLayer";
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

const baseLayers = {
  osm: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  },
  cartoLight: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, IGN y otros",
  },
};

interface InteractiveMapProps {
  lat: number;
  lon: number;
  query: string;
  children?: ReactNode;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  lat,
  lon,
  query,
  children,
}) => {
  const position: [number, number] = [lat, lon];
  const [isClient, setIsClient] = useState(false);

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
      <div className="absolute bottom-3 left-3 z-10 px-3 py-1 bg-black/70 text-white text-xs rounded">
        {query}
      </div>

      <MapContainer
        center={position}
        zoom={15} // igual que el HTML
        minZoom={14}
        maxZoom={18}
        scrollWheelZoom={true}
        style={{ height: "100vh", width: "100%" }}
      >
        {/* Mapa base OSM */}
        <TileLayer
          attribution={baseLayers.cartoLight.attribution}
          url={baseLayers.cartoLight.url}
        />

        {/* Tiles estáticos de parcelas (QGIS) */}
        <StaticParcelsLayer />
        <DbParcelsLayer />

        {/* Lo que quieras encima (click, parcels DB, etc.) */}
        {children}
      </MapContainer>
    </div>
  );
};
