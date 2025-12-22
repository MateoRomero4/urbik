"use client";

import { useEffect, useMemo, useState } from "react";

type SelectedParcel = {
  CCA: string | null;
  PDA: string | null;
  geometry: unknown;
  lat: number;
  lon: number;
};

export default function DashboardParcelSelector({
  selectedParcel,
  onSave,
  saving,
  message,
}: {
  selectedParcel: SelectedParcel | null;
  onSave: (title: string, price: number) => void;
  saving: boolean;
  message: string | null;
}) {
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
        <h2 className="text-2xl font-black mb-1 text-black">Nueva propiedad</h2>
        <p className="text-gray-500 text-sm">
          Elegí una parcela y completá lo mínimo para publicarla.
        </p>
      </div>

      {!selectedParcel && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-sm text-gray-600">
          Hacé click en una parcela del mapa para empezar.
        </div>
      )}

      {selectedParcel && (
        <>
          <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-regular text-black">
                Parcela activa
              </span>
              <span className="text-[11px] font-regular rounded-full bg-white border border-gray-200 px-3 py-1 text-gray-600">
                Precisión mapa
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="col-span-3">
                <div className="text-gray-500 font-bold thinkes">CCA</div>
                <div className="font-medium tracking-wide overflow-x-scroll  text-black">
                  {selectedParcel.CCA ?? "Sin dato"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 font-bold thinkes">PDA</div>
                <div className="font-medium  text-black">
                  {selectedParcel.PDA ?? "Sin dato"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 font-bold thinkes">Latitud</div>
                <div className="font-medium  text-black">
                  {selectedParcel.lat.toFixed(6)}
                </div>
              </div>
              <div>
                <div className="text-gray-500 font-bold thinkes">Longitud</div>
                <div className="font-medium  text-black">
                  {selectedParcel.lon.toFixed(6)}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-regular mb-1 text-black">
                Título
              </label>
              <input
                className="w-full bg-gray-100 rounded-lg px-4 py-3 outline-none text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Depto 2 ambientes, La Plata"
              />
            </div>

            <div>
              <label className="block text-xs font-regular mb-1 text-black">
                Precio (USD)
              </label>
              <input
                className="w-full bg-gray-100 rounded-lg px-4 py-3 outline-none text-sm"
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
              className="w-full bg-[#00F0FF] text-black font-regular py-3 rounded-full text-sm shadow-sm hover:opacity-90 transition disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar propiedad"}
            </button>
          </form>
        </>
      )}

      {message && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800">
          {message}
        </div>
      )}
    </div>
  );
}
