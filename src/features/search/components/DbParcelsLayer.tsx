"use client";

import { useEffect, useMemo, useState } from "react";
import { CircleMarker, GeoJSON, Popup } from "react-leaflet";
import type { Feature, FeatureCollection, Geometry } from "geojson";

type OperationType = "RENT" | "SALE";

type PropertyType =
  | "HOUSE"
  | "APARTMENT"
  | "LAND"
  | "COMMERCIAL_PROPERTY"
  | "OFFICE";

type MapProperty = {
  id: number;
  title: string;
  price: number;
  latitude: number;
  longitude: number;
  city: string | null;
  province: string | null;
  operationType: OperationType;
  type: PropertyType;
  parcelCCA: string | null;
};

type ApiResponse = {
  properties: MapProperty[];
};

type ParcelaProps = {
  CCA?: string;
  PDA?: string;
  [key: string]: unknown;
};

type ParcelaFeature = Feature<Geometry, ParcelaProps>;
type ParcelaFC = FeatureCollection<Geometry, ParcelaProps>;

export function DbParcelsLayer() {
  const [properties, setProperties] = useState<MapProperty[]>([]);
  const [parcels, setParcels] = useState<ParcelaFC | null>(null);

  // 1️⃣ Cargar propiedades desde la API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("/api/properties/map");
        if (!res.ok) throw new Error("Error al cargar propiedades del mapa");
        const data: ApiResponse = await res.json();
        setProperties(data.properties || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProperties();
  }, []);

  // 2️⃣ Cargar GeoJSON local con TODAS las parcelas (La Plata)
  useEffect(() => {
    const fetchGeojson = async () => {
      try {
        const res = await fetch("/laplata.geojson");
        if (!res.ok) throw new Error("Error al cargar laplata.geojson");
        const json = (await res.json()) as ParcelaFC;
        setParcels(json);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGeojson();
  }, []);

  // 3️⃣ Índice CCA -> Feature para lookup rápido
  const parcelsByCCA = useMemo(() => {
    if (!parcels) return new Map<string, ParcelaFeature>();

    const map = new Map<string, ParcelaFeature>();

    for (const feat of parcels.features) {
      const cca = feat.properties?.CCA;
      if (cca) {
        map.set(cca, feat);
      }
    }

    return map;
  }, [parcels]);

  if (!properties.length) return null;

  // estilos para las parcelas destacadas de la DB
  const getParcelStyle = (operationType: OperationType) => {
    const isSale = operationType === "SALE";

    return {
      color: isSale ? "#16a34a" : "#2563eb", // borde
      weight: 2,
      fillColor: isSale ? "#4ade80" : "#60a5fa",
      fillOpacity: 0.5,
    };
  };

  return (
    <>
      {properties.map((p) => {
        const parcelFeature =
          p.parcelCCA && parcelsByCCA.get(p.parcelCCA || "");

        // 4️⃣ Si encontramos la parcela en el GeoJSON -> pintamos polígono
        if (parcelFeature) {
          return (
            <GeoJSON
              key={`parcel-${p.id}`}
              data={parcelFeature as GeoJSON.GeoJsonObject}
              style={() => getParcelStyle(p.operationType)}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold mb-1">{p.title}</div>
                  <div className="text-xs text-gray-500 mb-1">
                    {p.city ?? ""} {p.province ? `· ${p.province}` : ""}
                  </div>
                  <div className="font-semibold">
                    ${p.price.toLocaleString("es-AR")}
                  </div>
                  <div className="text-xs mt-1">
                    {p.operationType === "SALE" ? "Venta" : "Alquiler"} ·{" "}
                    {p.type}
                  </div>
                  {p.parcelCCA && (
                    <div className="text-[11px] text-gray-400 mt-1">
                      CCA: {p.parcelCCA}
                    </div>
                  )}
                </div>
              </Popup>
            </GeoJSON>
          );
        }

        // 5️⃣ Si NO encontramos la parcela en el GeoJSON, fallback a punto
        return (
          <CircleMarker
            key={`point-${p.id}`}
            center={[p.latitude, p.longitude]}
            radius={6}
            pathOptions={{
              color: p.operationType === "SALE" ? "#16a34a" : "#2563eb",
              fillColor: p.operationType === "SALE" ? "#4ade80" : "#60a5fa",
              fillOpacity: 0.9,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold mb-1">{p.title}</div>
                <div className="text-xs text-gray-500 mb-1">
                  {p.city ?? ""} {p.province ? `· ${p.province}` : ""}
                </div>
                <div className="font-semibold">
                  ${p.price.toLocaleString("es-AR")}
                </div>
                <div className="text-xs mt-1"></div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}
