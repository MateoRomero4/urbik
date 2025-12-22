"use client";

import { useEffect, useMemo, useState } from "react";
import { CircleMarker, GeoJSON, Popup } from "react-leaflet";
import type {
  Feature,
  FeatureCollection,
  Geometry,
  GeoJsonObject,
} from "geojson";
import type { MapProperty, OperationType } from "../types";

type ApiResponse = { properties: MapProperty[] };

type ParcelaProps = { CCA?: string };
type ParcelaFeature = Feature<Geometry, ParcelaProps>;
type ParcelaFC = FeatureCollection<Geometry, ParcelaProps>;

export function DbParcelsLayer() {
  const [properties, setProperties] = useState<MapProperty[]>([]);
  const [parcels, setParcels] = useState<ParcelaFC | null>(null);

  useEffect(() => {
    fetch("/api/properties/map")
      .then((r) => r.json())
      .then((d: ApiResponse) => setProperties(d.properties ?? []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/laplata.geojson")
      .then((r) => r.json())
      .then((json: ParcelaFC) => setParcels(json))
      .catch(console.error);
  }, []);

  const parcelsByCCA = useMemo(() => {
    if (!parcels) return new Map<string, ParcelaFeature>();
    const map = new Map<string, ParcelaFeature>();
    parcels.features.forEach((f) => {
      if (f.properties?.CCA) map.set(f.properties.CCA, f);
    });
    return map;
  }, [parcels]);

  const styleByOperation = (op: OperationType) => ({
    color: op === "SALE" ? "#16a34a" : "#0284c7",
    weight: 2,
    fillColor: op === "SALE" ? "#4ade80" : "#38bdf8",
    fillOpacity: 0.35,
  });

  if (!properties.length) return null;

  return (
    <>
      {properties.map((p) => {
        const parcel = p.parcelCCA ? parcelsByCCA.get(p.parcelCCA) : undefined;

        // ✅ Si hay parcela, pintamos el polígono pero SIN hover effects extra
        if (parcel) {
          return (
            <GeoJSON
              key={`db-parcel-${p.id}`}
              data={parcel as unknown as GeoJsonObject}
              style={() => styleByOperation(p.operationType)}
            >
              {/* ✅ solo info */}
              <Popup>
                <div className="text-sm">
                  <div className="font-bold">{p.title}</div>
                  <div className="text-xs text-gray-500">
                    {p.city ?? ""} {p.province ? `· ${p.province}` : ""}
                  </div>
                  <div className="font-semibold mt-1">
                    USD {p.price.toLocaleString("es-AR")}
                  </div>
                  <div className="mt-1 text-[11px] text-gray-400">
                    {p.operationType === "SALE" ? "Venta" : "Alquiler"} ·{" "}
                    {p.type}
                  </div>
                </div>
              </Popup>
            </GeoJSON>
          );
        }

        // fallback a punto
        return (
          <CircleMarker
            key={`db-point-${p.id}`}
            center={[p.latitude, p.longitude]}
            radius={6}
            pathOptions={{
              ...styleByOperation(p.operationType),
              fillOpacity: 0.9,
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{p.title}</div>
                <div className="text-xs text-gray-500">
                  USD {p.price.toLocaleString("es-AR")}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}
