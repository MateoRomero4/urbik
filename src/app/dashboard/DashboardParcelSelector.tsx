"use client";

import { useEffect, useMemo, useState } from "react";

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
  const formattedPrice = useMemo(() => {
    const n = Number(price);
    return Number.isFinite(n) && n > 0 ? n.toLocaleString("es-AR") : null;
  }, [price]);

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
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
          Carga rápida
        </p>
        <h2 className="text-xl font-semibold text-gray-900">
          Nueva propiedad
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Selecciona una parcela en el mapa y completa los datos mínimos para
          publicarla.
        </p>
      </div>

      {!selectedParcel && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-4 text-sm text-gray-600">
          Haz click en una parcela del mapa para empezar a cargar una propiedad.
          Podrás revisar CCA y PDA antes de guardar.
        </div>
      )}

      {selectedParcel && (
        <>
          <div className="text-xs bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Parcela activa</span>
              <span className="rounded-full bg-white px-2 py-1 text-[11px] text-orange-600 border border-orange-200">
                Precisión mapa
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <div className="text-[11px] text-gray-500">CCA</div>
                <div className="font-semibold">
                  {selectedParcel.CCA ?? "Sin dato"}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-gray-500">PDA</div>
                <div className="font-semibold">
                  {selectedParcel.PDA ?? "Sin dato"}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-gray-500">Latitud</div>
                <div className="font-semibold">
                  {selectedParcel.lat.toFixed(6)}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-gray-500">Longitud</div>
                <div className="font-semibold">
                  {selectedParcel.lon.toFixed(6)}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Título</label>
              <input
                className="w-full border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900/40 rounded-lg px-3 py-2 text-sm transition"
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
                className="w-full border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900/40 rounded-lg px-3 py-2 text-sm transition"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="80000"
                min={0}
              />
              {formattedPrice && (
                <p className="mt-1 text-[11px] text-gray-500">
                  Vista previa: USD {formattedPrice}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-gray-900 text-white text-sm px-3 py-2 disabled:opacity-60 shadow-sm hover:shadow transition-all"
            >
              {saving ? "Guardando..." : "Guardar propiedad"}
            </button>
          </form>
        </>
      )}

      {message && (
        <div className="text-xs mt-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-800">
          {message}
        </div>
      )}
    </div>
  );
}
