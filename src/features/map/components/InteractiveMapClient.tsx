"use client";

import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { StaticParcelsLayer } from "./StaticParcelsLayer";
import { DbParcelsLayer } from "./DbParcelsLayer";
import { SelectedParcelLayer } from "./SelectedParcelLayer";

import { mapBaseLayers } from "@/features/mapSettings/baseLayers";
import { useMapSettings } from "@/features/mapSettings/MapSettingsProvider";
import { useMapLayers } from "./MapLayersProvider";

export interface InteractiveMapProps {
  lat: number;
  lon: number;
  query: string;
  children?: ReactNode;
  height?: string | number;
}

export function InteractiveMapClient({
  lat,
  lon,
  query,
  children,
  height,
}: InteractiveMapProps) {
  const { baseLayer } = useMapSettings();
  const { hovered, selected } = useMapLayers();

  const position: [number, number] = [lat, lon];
  const [mounted, setMounted] = useState(false);

  const currentBaseLayer = useMemo(
    () => mapBaseLayers[baseLayer] ?? mapBaseLayers.cartoLight,
    [baseLayer]
  );

  useEffect(() => {
    setMounted(true);

    const defaultIcon = L.icon({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
    L.Marker.prototype.options.icon = defaultIcon;
  }, []);

  if (!mounted) {
    return (
      <div
        className="flex items-center justify-center bg-gray-200"
        style={{ height: height ?? 480 }}
      >
        Cargando mapa...
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: height ?? "100vh" }}
    >
      {/* overlay oscuro (boceto) */}
      <div className="absolute top-4 left-4 z-10 rounded-2xl bg-black/70 px-4 py-3 text-white text-xs shadow-lg backdrop-blur">
        <div className="uppercase tracking-wide text-[10px] text-white/70">
          Mapa base
        </div>
        <div className="text-sm font-semibold">{currentBaseLayer.label}</div>
      </div>

      <div className="absolute bottom-3 left-3 z-10 rounded-2xl bg-black/70 px-4 py-2 text-white text-sm shadow-lg backdrop-blur">
        {query || "Urbik"}
      </div>

      {/* ✅ SOLO TAG DE HOVER (sin pintar borde) */}
      {hovered?.label ? (
        <div className="pointer-events-none absolute top-4 right-4 z-10 rounded-full bg-black/70 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur">
          {hovered.label}
        </div>
      ) : null}

      <MapContainer
        center={position}
        zoom={15}
        minZoom={14}
        maxZoom={18}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution={currentBaseLayer.attribution}
          url={currentBaseLayer.url}
        />

        <StaticParcelsLayer />
        <DbParcelsLayer />

        {children}

        {/* ✅ selected (este sí pinta) */}
        {selected && (
          <SelectedParcelLayer
            // ✅ clave para forzar re-render si Leaflet se “queda pegado”
            key={`selected-${selected.label ?? "x"}`}
            geometry={selected.geometry}
            label={selected.label}
          />
        )}
      </MapContainer>
    </div>
  );
}
