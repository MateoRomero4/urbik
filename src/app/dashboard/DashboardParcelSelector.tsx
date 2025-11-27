"use client";

import { useEffect, useState } from "react";

type SelectedParcel = {
  CCA: string | null;
  PDA: string | null;
  geometry: unknown;
  lat: number;
  lon: number;
};

interface Props {
  selectedParcel: SelectedParcel | null;
  onSave: (title: string, price: number) => void;
  saving: boolean;
  message: string | null;
}

export function DashboardParcelSelector({
  selectedParcel,
  onSave,
  saving,
  message,
}: Props) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<string>("");

  useEffect(() => {
    if (selectedParcel) {
      setTitle(
        `Propiedad en parcela ${selectedParcel.PDA ?? selectedParcel.CCA ?? ""}`
      );
    }
  }, [selectedParcel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(price);
    if (!title || Number.isNaN(numericPrice) || numericPrice <= 0) return;
    onSave(title, numericPrice);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Nueva propiedad</h2>

      {!selectedParcel && (
        <p className="text-sm text-gray-600">
          Hacé click en una parcela del mapa para empezar a cargar una
          propiedad.
        </p>
      )}

      {selectedParcel && (
        <>
          <div className="text-xs bg-gray-50 border border-gray-200 rounded p-2">
            <div>
              <span className="font-semibold">CCA:</span>{" "}
              {selectedParcel.CCA ?? "-"}
            </div>
            <div>
              <span className="font-semibold">PDA:</span>{" "}
              {selectedParcel.PDA ?? "-"}
            </div>
            <div className="mt-1 text-[11px] text-gray-500">
              Lat: {selectedParcel.lat.toFixed(6)} – Lon:{" "}
              {selectedParcel.lon.toFixed(6)}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Título</label>
              <input
                className="w-full border rounded px-2 py-1 text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Depto 2 ambientes, La Plata"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">
                Precio (USD)
              </label>
              <input
                className="w-full border rounded px-2 py-1 text-sm"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="80000"
                min={0}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-1 inline-flex items-center justify-center rounded bg-black text-white text-sm px-3 py-1.5 disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar propiedad"}
            </button>
          </form>
        </>
      )}

      {message && <div className="text-xs mt-2 text-gray-700">{message}</div>}
    </div>
  );
}
