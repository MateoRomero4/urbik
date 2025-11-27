"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { DashboardParcelSelector } from "./DashboardParcelSelector";
import { ClickToCreateProperty } from "@/features/search/components/ClickToCreateProperty";

const InteractiveMap = dynamic(
  () =>
    import("@/features/search/components/InteractiveMap").then(
      (m) => m.InteractiveMap
    ),
  { ssr: false }
);

type SelectedParcel = {
  CCA: string | null;
  PDA: string | null;
  geometry: unknown;
  lat: number;
  lon: number;
};

export default function DashboardPage() {
  const [selectedParcel, setSelectedParcel] = useState<SelectedParcel | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleParcelPicked = (parcel: SelectedParcel) => {
    setSelectedParcel(parcel);
    setMessage(null);
  };

  const handleSave = async (title: string, price: number) => {
    if (!selectedParcel) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/property/parcel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: selectedParcel.lat,
          lon: selectedParcel.lon,
          title,
          price,
          address: "Sin dirección", // TODO: atar al formulario real
          city: "La Plata",
          province: "Buenos Aires",
          country: "Argentina",
          type: "LAND", // PropertyType
          operationType: "SALE", // OperationType
          userId: 1, // TODO: sacar de la sesión
          parcel: {
            CCA: selectedParcel.CCA,
            PDA: selectedParcel.PDA,
            geometry: selectedParcel.geometry,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error ?? "Error al guardar la propiedad");
      } else {
        setMessage("Propiedad creada correctamente");
        setSelectedParcel(null);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error de red al guardar la propiedad");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 relative">
        <InteractiveMap
          lat={-34.92145}
          lon={-57.95453}
          query="Dashboard Inmobiliaria - La Plata"
        >
          <ClickToCreateProperty onParcelPicked={handleParcelPicked} />
        </InteractiveMap>
      </div>

      <div className="w-[380px] border-l border-gray-200 p-4 bg-white flex flex-col">
        <DashboardParcelSelector
          selectedParcel={selectedParcel}
          onSave={handleSave}
          saving={saving}
          message={message}
        />
      </div>
    </div>
  );
}
