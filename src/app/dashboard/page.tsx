"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { DashboardParcelSelector } from "./DashboardParcelSelector";
import { ClickToCreateProperty } from "@/features/search/components/ClickToCreateProperty";
import type { Geometry } from "geojson";

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
  geometry: Geometry;
  lat: number;
  lon: number;
};

type PropertySummary = {
  id: number;
  title: string;
  price?: number;
  city?: string;
  province?: string;
  isAvailable?: boolean;
  operationType?: string | null;
  type?: string | null;
};

type ProfileData = {
  role?: string;
  name?: string;
  firstName?: string | null;
  lastName?: string | null;
  agencyData?: { name?: string | null; properties?: PropertySummary[] | null };
  properties?: PropertySummary[] | null;
};

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-white/40 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
      <div className="text-xs uppercase tracking-[0.18em] text-gray-500">
        {label}
      </div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
    </div>
  );
}

function PropertyListPreview({ properties }: { properties: PropertySummary[] }) {
  if (!properties.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-3 text-sm text-gray-600">
        Aún no cargaste propiedades. Usa el mapa para seleccionar una parcela y
        crear la primera.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {properties.slice(0, 3).map((p) => (
        <div
          key={p.id}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-900">{p.title}</div>
            <span className="text-[11px] rounded-full bg-gray-100 px-2 py-1 text-gray-700">
              {p.operationType ?? "—"}
            </span>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {p.city ?? ""} {p.province ? `· ${p.province}` : ""}
          </div>
          {typeof p.price === "number" && (
            <div className="mt-1 text-sm font-semibold text-emerald-600">
              USD {p.price.toLocaleString("es-AR")}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [selectedParcel, setSelectedParcel] = useState<SelectedParcel | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

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
          address: "Sin dirección",
          city: "La Plata",
          province: "Buenos Aires",
          country: "Argentina",
          type: "LAND", // PropertyType
          operationType: "SALE", // OperationType
          userId: session?.user?.id ? Number(session.user.id) : undefined,
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

  useEffect(() => {
    const fetchProfile = async () => {
      if (status !== "authenticated") return;
      setLoadingProfile(true);
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("No se pudo cargar el perfil");
        const data = (await res.json()) as ProfileData;
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [status]);

  const properties = useMemo(() => {
    if (!profile) return [] as PropertySummary[];
    if (profile.role === "REALSTATE") {
      return (
        profile.agencyData?.properties ??
        profile.properties ??
        ([] as PropertySummary[])
      );
    }
    return profile.properties ?? ([] as PropertySummary[]);
  }, [profile]);

  const isAgency =
    profile?.role === "REALSTATE" || session?.user?.role === "REALSTATE";

  const name =
    profile?.agencyData?.name ||
    profile?.name ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    session?.user?.name ||
    "Urbik";

  if (status === "loading" || loadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-orange-50">
        <div className="rounded-lg bg-white px-6 py-4 shadow">
          Cargando tu panel...
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Inicia sesión para ver tu panel
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Aquí podrás acceder a tu dashboard personalizado, crear propiedades
            y configurar el mapa.
          </p>
          <button
            onClick={() => signIn()}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-white shadow-sm hover:shadow"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            No pudimos cargar tu perfil
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Intenta actualizar la página o vuelve más tarde.
          </p>
        </div>
      </div>
    );
  }

  const activeCount = properties.filter((p) => p.isAvailable !== false).length;
  const saleCount = properties.filter((p) => p.operationType === "SALE").length;
  const rentCount = properties.filter((p) => p.operationType === "RENT").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-8">
        <div className="flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-6 text-white shadow-xl">
          <div className="text-xs uppercase tracking-[0.2em] text-white/60">
            Dashboard · {isAgency ? "Inmobiliaria" : "Usuario"}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold">Hola, {name}</h1>
              <p className="text-sm text-white/70">
                Controla tus propiedades, explora el mapa y cambia el mapa base
                desde aquí.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/map"
                className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Ver mapa
              </Link>
              <Link
                href="/settings"
                className="inline-flex items-center rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                Configuración
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Propiedades" value={properties.length} />
            <StatCard label="Disponibles" value={activeCount} />
            <StatCard label="Ventas" value={saleCount} />
            <StatCard label="Alquileres" value={rentCount} />
          </div>
        </div>

        {isAgency ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/80 shadow-xl">
              <div className="pointer-events-none absolute inset-x-6 top-4 z-10 flex items-center justify-between">
                <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-gray-800 shadow-sm backdrop-blur">
                  Selecciona una parcela para publicar
                </div>
                {selectedParcel && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                    Parcela elegida
                  </span>
                )}
              </div>
              <InteractiveMap
                lat={-34.92145}
                lon={-57.95453}
                query="Dashboard Inmobiliaria - La Plata"
                height="78vh"
                selectedOverlay={
                  selectedParcel
                    ? {
                        geometry: selectedParcel.geometry,
                        label: `CCA ${selectedParcel.CCA ?? ""} · PDA ${
                          selectedParcel.PDA ?? "N/D"
                        }`,
                      }
                    : null
                }
              >
                <ClickToCreateProperty onParcelPicked={handleParcelPicked} />
              </InteractiveMap>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-lg">
              <DashboardParcelSelector
                selectedParcel={selectedParcel}
                onSave={handleSave}
                saving={saving}
                message={message}
              />
              <div className="mt-5">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                  Ultimas cargadas
                </p>
                <PropertyListPreview properties={properties} />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
            <div className="rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-lg">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                Accesos rápidos
              </p>
              <div className="mt-3 space-y-3">
                <Link
                  href="/map"
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  Abrir mapa interactivo
                  <span className="text-xs text-gray-500">Explora parcelas</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  Configurar mapa base
                  <span className="text-xs text-gray-500">Capas y estilo</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  Editar mi perfil
                  <span className="text-xs text-gray-500">Datos y alertas</span>
                </Link>
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                  Mis propiedades
                </p>
                <div className="mt-3">
                  <PropertyListPreview properties={properties} />
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/80 shadow-xl">
              <div className="pointer-events-none absolute inset-x-6 top-4 z-10 flex items-center justify-between">
                <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-gray-800 shadow-sm backdrop-blur">
                  Explora parcelas y propiedades
                </div>
                <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  Vista Mapa
                </span>
              </div>
              <InteractiveMap
                lat={-34.92145}
                lon={-57.95453}
                query="Mapa Urbik - La Plata"
                height="75vh"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
