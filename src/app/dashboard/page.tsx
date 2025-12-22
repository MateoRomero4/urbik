"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signIn } from "next-auth/react";

import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import DashboardMain from "./DashboardMain";

export type PropertySummary = {
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

export default function DashboardPage() {
  const { data: session, status } = useSession();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="rounded-2xl bg-gray-50 px-6 py-4 shadow-sm">
          Cargando tu panel...
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="max-w-md rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm text-center">
          <h1 className="text-2xl font-black text-black">
            Iniciá sesión para ver tu panel
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Vas a poder ver estadísticas y cargar propiedades.
          </p>
          <button
            onClick={() => signIn()}
            className="mt-6 rounded-full bg-[#00F0FF] px-6 py-3 text-sm font-bold text-black hover:opacity-90 transition"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="max-w-md rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm text-center">
          <h1 className="text-xl font-black text-black">
            No pudimos cargar tu perfil
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Probá recargando o volvé más tarde.
          </p>
        </div>
      </div>
    );
  }

  const activeCount = properties.filter((p) => p.isAvailable !== false).length;
  const saleCount = properties.filter((p) => p.operationType === "SALE").length;
  const rentCount = properties.filter((p) => p.operationType === "RENT").length;

  return (
    <div className="bg-white min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <DashboardHeader name={name} isAgency={isAgency} />
        <DashboardStats
          total={properties.length}
          active={activeCount}
          sale={saleCount}
          rent={rentCount}
        />
        <DashboardMain properties={properties} />
      </div>
    </div>
  );
}
