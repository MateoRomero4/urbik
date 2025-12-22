"use client";

import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Geometry } from "geojson";

import { MapLayersProvider } from "@/features/map/components/MapLayersProvider";
import { ClickToCreateProperty } from "@/features/map/components/ClickToCreateProperty";
import DashboardParcelSelector from "./DashboardParcelSelector";

const InteractiveMap = dynamic(
  () =>
    import("@/features/map/components/InteractiveMap").then(
      (m) => m.InteractiveMap
    ),
  { ssr: false }
);

type SelectedParcel = {
  CCA: string | null;
  PDA: string | null;
  geometry: Geometry;
  lat: number;
  lon: number;
};

type CreatePropertyPayload = {
  parcel: SelectedParcel;

  title: string;
  description: string;
  areaM2: number | null;
  coveredM2: number | null;
  rooms: number | null;
  bathrooms: number | null;
  amenities: {
    agua: boolean;
    luz: boolean;
    gas: boolean;
    internet: boolean;
    cochera: boolean;
    pileta: boolean;
  };

  priceUsd: number;
};

function Stepper({
  currentStep,
  steps,
}: {
  currentStep: number; // 1..n
  steps: { label: string }[];
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4">
        {steps.map((s, idx) => {
          const stepNumber = idx + 1;
          const done = stepNumber < currentStep;
          const active = stepNumber === currentStep;

          return (
            <div key={s.label} className="flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={[
                    "h-7 w-7 rounded-full flex items-center justify-center text-xs font-black border",
                    done
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : active
                      ? "bg-[#00F0FF] border-[#00F0FF] text-black"
                      : "bg-white border-gray-200 text-gray-500",
                  ].join(" ")}
                >
                  {done ? "✓" : stepNumber}
                </div>

                <div
                  className={[
                    "text-xs font-bold",
                    active
                      ? "text-black"
                      : done
                      ? "text-gray-700"
                      : "text-gray-400",
                  ].join(" ")}
                >
                  {s.label}
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="mt-3 h-[3px] w-full rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={[
                      "h-full rounded-full transition-all duration-300",
                      done ? "w-full bg-emerald-500" : "w-0 bg-[#00F0FF]",
                    ].join(" ")}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1 text-black">{label}</label>
      {children}
    </div>
  );
}

function AmenitiesGrid({
  value,
  onChange,
}: {
  value: CreatePropertyPayload["amenities"];
  onChange: (next: CreatePropertyPayload["amenities"]) => void;
}) {
  const toggle = (k: keyof CreatePropertyPayload["amenities"]) => {
    onChange({ ...value, [k]: !value[k] });
  };

  const Item = ({
    k,
    label,
  }: {
    k: keyof CreatePropertyPayload["amenities"];
    label: string;
  }) => (
    <button
      type="button"
      onClick={() => toggle(k)}
      className={[
        "rounded-2xl border px-3 py-3 text-left text-sm font-bold transition",
        value[k]
          ? "border-black bg-black text-white"
          : "border-gray-200 bg-gray-50 text-black hover:bg-gray-100",
      ].join(" ")}
    >
      {label}
      <div className="mt-1 text-[11px] font-medium opacity-80">
        {value[k] ? "Incluido" : "No"}
      </div>
    </button>
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      <Item k="agua" label="Agua" />
      <Item k="luz" label="Luz" />
      <Item k="gas" label="Gas" />
      <Item k="internet" label="Internet" />
      <Item k="cochera" label="Cochera" />
      <Item k="pileta" label="Pileta" />
    </div>
  );
}

export default function CreatePropertyModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}) {
  const steps = useMemo(
    () => [{ label: "Parcela" }, { label: "Detalles" }],
    []
  );
  const [step, setStep] = useState<1 | 2>(1);

  const [selectedParcel, setSelectedParcel] = useState<SelectedParcel | null>(
    null
  );

  // Paso 2
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [areaM2, setAreaM2] = useState<string>("");
  const [coveredM2, setCoveredM2] = useState<string>("");
  const [rooms, setRooms] = useState<string>("");
  const [bathrooms, setBathrooms] = useState<string>("");
  const [amenities, setAmenities] = useState<
    CreatePropertyPayload["amenities"]
  >({
    agua: false,
    luz: false,
    gas: false,
    internet: false,
    cochera: false,
    pileta: false,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const resetAll = () => {
    setStep(1);
    setSelectedParcel(null);
    setTitle("");
    setDescription("");
    setAreaM2("");
    setCoveredM2("");
    setRooms("");
    setBathrooms("");
    setAmenities({
      agua: false,
      luz: false,
      gas: false,
      internet: false,
      cochera: false,
      pileta: false,
    });
    setSaving(false);
    setMessage(null);
  };

  const handleClose = () => {
    onClose();
    resetAll();
  };

  const handleNext = () => {
    if (!selectedParcel) {
      setMessage("Primero seleccioná una parcela en el mapa.");
      return;
    }

    if (!title) {
      setTitle(
        `Propiedad en parcela ${selectedParcel.PDA ?? selectedParcel.CCA ?? ""}`
      );
    }

    setMessage(null);
    setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleCreate = async (priceTitle: string, priceUsd: number) => {
    if (!selectedParcel) return;

    setSaving(true);
    setMessage(null);

    const payload: CreatePropertyPayload = {
      parcel: selectedParcel,
      title: priceTitle || title,
      description,
      areaM2: areaM2 ? Number(areaM2) : null,
      coveredM2: coveredM2 ? Number(coveredM2) : null,
      rooms: rooms ? Number(rooms) : null,
      bathrooms: bathrooms ? Number(bathrooms) : null,
      amenities,
      priceUsd,
    };

    try {
      const res = await fetch("/api/property/parcel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: payload.parcel.lat,
          lon: payload.parcel.lon,
          title: payload.title,
          description: payload.description,
          price: payload.priceUsd,

          areaM2: payload.areaM2,
          coveredM2: payload.coveredM2,
          rooms: payload.rooms,
          bathrooms: payload.bathrooms,
          amenities: payload.amenities,

          address: "Sin dirección",
          city: "La Plata",
          province: "Buenos Aires",
          country: "Argentina",
          type: "LAND",
          operationType: "SALE",
          parcel: {
            CCA: payload.parcel.CCA,
            PDA: payload.parcel.PDA,
            geometry: payload.parcel.geometry,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Error al guardar");
      } else {
        setMessage("Propiedad creada correctamente");
        onCreated?.();
        handleClose();
      }
    } catch {
      setMessage("Error de red");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-999 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={handleClose} />

          {/* modal (FIX: header fijo + body flexible) */}
          <motion.div
            className="
              relative w-[min(1200px,92vw)] h-[min(84vh,860px)]
              bg-white rounded-3xl shadow-2xl overflow-hidden
              flex flex-col
            "
            initial={{ y: 12, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER (fijo) */}
            <div className="shrink-0 px-6 py-5 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-500">
                    Cargar propiedad
                  </div>
                  <div className="text-lg font-black text-black">
                    {step === 1
                      ? "Paso 1: Seleccioná la parcela"
                      : "Paso 2: Completá los detalles"}
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold hover:bg-gray-200 transition"
                >
                  Cerrar
                </button>
              </div>

              <div className="mt-4">
                <Stepper currentStep={step} steps={steps} />
              </div>
            </div>

            {/* BODY (solo esto cambia/scrollea) */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px]">
                {/* LEFT */}
                <div className="relative bg-slate-900">
                  {step === 1 ? (
                    <>
                      <MapLayersProvider>
                        <InteractiveMap
                          lat={-34.92145}
                          lon={-57.95453}
                          query="Selección de parcela - La Plata"
                          height="100%"
                        >
                          <ClickToCreateProperty
                            onParcelPicked={(p) => {
                              setSelectedParcel(p);
                              setMessage(null);
                            }}
                          />
                        </InteractiveMap>
                      </MapLayersProvider>

                      <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/70 px-4 py-2 text-xs font-bold text-white">
                        Click para elegir parcela
                      </div>
                    </>
                  ) : (
                    <div className="h-full p-6">
                      <div className="rounded-3xl bg-white/10 border border-white/10 p-5 text-white">
                        <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                          Parcela seleccionada
                        </div>
                        <div className="mt-2 text-sm font-bold">
                          CCA {selectedParcel?.CCA ?? "—"} · PDA{" "}
                          {selectedParcel?.PDA ?? "—"}
                        </div>
                        <div className="mt-2 text-xs text-white/70">
                          Lat {selectedParcel?.lat.toFixed(6)} · Lon{" "}
                          {selectedParcel?.lon.toFixed(6)}
                        </div>

                        <div className="mt-5 text-xs text-white/70">
                          En este paso completás todos los datos de la
                          propiedad.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT */}
                <div className="bg-gray-50 p-5 overflow-y-auto">
                  {step === 1 ? (
                    <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-200">
                      <DashboardParcelSelector
                        selectedParcel={selectedParcel}
                        onSave={() => {
                          // En step 1 no guardamos, solo pasamos al paso 2.
                          handleNext();
                        }}
                        saving={false}
                        message={message}
                      />

                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={handleNext}
                          disabled={!selectedParcel}
                          className="w-full rounded-full bg-[#00F0FF] px-6 py-3 text-sm font-bold text-black hover:opacity-90 transition disabled:opacity-60"
                        >
                          Siguiente
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-200">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-black text-black">
                          Detalles de la propiedad
                        </div>
                        <button
                          type="button"
                          onClick={handleBack}
                          className="rounded-full bg-gray-100 px-4 py-2 text-xs font-bold hover:bg-gray-200 transition"
                        >
                          Volver
                        </button>
                      </div>

                      <div className="mt-4 space-y-4">
                        <Field label="Título">
                          <input
                            className="w-full bg-gray-100 rounded-lg px-4 py-3 outline-none text-sm"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Depto 2 ambientes, La Plata"
                          />
                        </Field>

                        <Field label="Descripción">
                          <textarea
                            className="w-full bg-gray-100 rounded-lg px-4 py-3 outline-none text-sm min-h-[110px] resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Contá lo importante (ubicación, estado, expensas, etc.)"
                          />
                        </Field>

                        <div className="grid grid-cols-2 gap-3">
                          <Field label="m² totales">
                            <input
                              type="number"
                              className="w-full bg-gray-100 rounded-lg px-4 py-3 outline-none text-sm"
                              value={areaM2}
                              onChange={(e) => setAreaM2(e.target.value)}
                              placeholder="80"
                            />
                          </Field>
                          <Field label="m² cubiertos">
                            <input
                              type="number"
                              className="w-full bg-gray-100 rounded-lg px-4 py-3 outline-none text-sm"
                              value={coveredM2}
                              onChange={(e) => setCoveredM2(e.target.value)}
                              placeholder="60"
                            />
                          </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Ambientes">
                            <input
                              type="number"
                              className="w-full bg-gray-100 rounded-lg px-4 py-3 outline-none text-sm"
                              value={rooms}
                              onChange={(e) => setRooms(e.target.value)}
                              placeholder="3"
                            />
                          </Field>
                          <Field label="Baños">
                            <input
                              type="number"
                              className="w-full bg-gray-100 rounded-lg px-4 py-3 outline-none text-sm"
                              value={bathrooms}
                              onChange={(e) => setBathrooms(e.target.value)}
                              placeholder="1"
                            />
                          </Field>
                        </div>

                        <div>
                          <div className="text-xs font-bold text-black mb-2">
                            Servicios / Amenities
                          </div>
                          <AmenitiesGrid
                            value={amenities}
                            onChange={setAmenities}
                          />
                        </div>

                        {/* Guardado final */}
                        <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                          <DashboardParcelSelector
                            selectedParcel={selectedParcel}
                            onSave={handleCreate}
                            saving={saving}
                            message={message}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
