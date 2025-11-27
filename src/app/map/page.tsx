"use client";

import Link from "next/link";
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
    <div className="relative min-h-screen bg-slate-900">
      <div className="fixed left-0 top-0 z-0 h-screen w-screen">
        <InteractiveMap
          key={mapKey}
          lat={lat}
          lon={lon}
          query={decodeURIComponent(query)}
        />
      </div>
      <div className="pointer-events-none absolute left-0 right-0 top-4 flex justify-center">
        <div className="pointer-events-auto w-full max-w-4xl px-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/70 px-5 py-4 text-white shadow-2xl backdrop-blur">
            <div className="text-xs uppercase tracking-[0.2em] text-white/60">
              Mapa interactivo
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">Explora La Plata</div>
                <p className="text-sm text-white/70">
                  Filtra por mapa base en Configuración y selecciona parcelas
                  con precisión.
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/dashboard"
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
                >
                  Ir al Dashboard
                </Link>
                <Link
                  href="/settings"
                  className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
                >
                  Configurar mapa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
