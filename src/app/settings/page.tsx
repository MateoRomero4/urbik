"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import {
  mapBaseLayers,
  type BaseLayerId,
} from "@/features/mapSettings/baseLayers";
import { useMapSettings } from "@/features/mapSettings/MapSettingsProvider";

const InteractiveMap = dynamic(
  () =>
    import("@/features/map/components/InteractiveMap").then(
      (m) => m.InteractiveMap
    ),
  { ssr: false }
);

export default function SettingsPage() {
  const { baseLayer, setBaseLayer } = useMapSettings();
  const selected = useMemo(() => mapBaseLayers[baseLayer], [baseLayer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-10">
        <div className="rounded-2xl bg-white px-6 py-6 shadow-xl border border-gray-200">
          <div className="text-xs uppercase tracking-[0.2em] text-gray-500">
            Configuración
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Ajusta tu experiencia de mapa
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Elige el mapa base que prefieras. Se aplicará en el dashboard y en
            el mapa interactivo.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {Object.values(mapBaseLayers).map((layer) => (
            <button
              key={layer.id}
              onClick={() => setBaseLayer(layer.id as BaseLayerId)}
              className={`flex w-full flex-col rounded-2xl border px-4 py-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                baseLayer === layer.id
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-900"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.15em]">
                    Mapa base
                  </div>
                  <div className="text-lg font-semibold">{layer.label}</div>
                </div>
                <div
                  className={`h-10 w-10 rounded-full border ${
                    baseLayer === layer.id
                      ? "border-white/40 bg-white/10"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
              </div>
              <p
                className={`mt-2 text-sm ${
                  baseLayer === layer.id ? "text-white/80" : "text-gray-600"
                }`}
              >
                {layer.description}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                Previsualización
              </p>
              <p className="text-sm text-gray-700">
                {selected.label} · {selected.description}
              </p>
            </div>
            <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
              Activo
            </span>
          </div>
          <InteractiveMap
            lat={-34.92145}
            lon={-57.95453}
            query="Configurar mapa base - La Plata"
            height="70vh"
          />
        </div>
      </div>
    </div>
  );
}
