"use client";

import React from "react";

export default function DashboardHeader({
  name,
  isAgency,
}: {
  name: string;
  isAgency: boolean;
}) {
  const initials = (name ?? "Urbik")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-[#D4A574] flex items-center justify-center text-white font-serif italic text-2xl border-4 border-white shadow-lg">
          {initials || "U"}
        </div>
        <div>
          <h1 className="text-3xl font-black text-black">Hola, {name}</h1>
          <p className="text-gray-500">
            {isAgency
              ? "Aquí tenés el resumen de tu actividad inmobiliaria."
              : "Aquí tenés el resumen de tu actividad."}
          </p>
        </div>
      </div>
    </div>
  );
}
