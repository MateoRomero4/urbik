"use client";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import React from "react";

const InteractiveMap = dynamic(
  () =>
    import("../../features/search/components/InteractiveMap").then(
      (mod) => mod.InteractiveMap
    ),
  { ssr: false }
);

export default function MapPage() {
  const searchParams = useSearchParams();
  const latParam = searchParams.get("lat");
  const lonParam = searchParams.get("lon");
  const query = searchParams.get("q") || "La Plata";

  // Centro La Plata
  const defaultLat = -34.92145;
  const defaultLon = -57.95453;

  const lat = latParam ? parseFloat(latParam) : defaultLat;
  const lon = lonParam ? parseFloat(lonParam) : defaultLon;

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold">Error al Cargar Mapa</h1>
          <p>Coordenadas inválidas.</p>
        </div>
      </div>
    );
  }

  const mapKey = `${lat}-${lon}`;

  return (
    <div className="relative w-screen h-screen">
      <div className="fixed left-0 w-screen z-0" style={{ height: "100vh" }}>
        <InteractiveMap
          key={mapKey}
          lat={lat}
          lon={lon}
          query={decodeURIComponent(query)}
        />
      </div>
    </div>
  );
}
