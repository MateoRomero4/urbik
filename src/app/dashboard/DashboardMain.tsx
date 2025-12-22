"use client";

import React, { useMemo, useState } from "react";
import type { PropertySummary } from "./page";

import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";
import CreatePropertyModal from "./CreatePropertyModal";

const mockViews = [
  { name: "Ene", views: 200 },
  { name: "Feb", views: 250 },
  { name: "Mar", views: 180 },
  { name: "Abr", views: 220 },
  { name: "May", views: 190 },
  { name: "Jun", views: 240 },
  { name: "Jul", views: 280 },
];

export default function DashboardMain({
  properties,
}: {
  properties: PropertySummary[];
}) {
  const [openCreate, setOpenCreate] = useState(false);

  const mostViewed = useMemo(() => properties[0] ?? null, [properties]);

  const lastMonthViews = useMemo(() => {
    return mockViews.reduce((acc, x) => acc + x.views, 0);
  }, []);

  return (
    <>
      {/* ACTIONS (boceto) */}
      <div className="flex gap-2 justify-end mb-8">
        <button
          onClick={() => setOpenCreate(true)}
          className="bg-[#00F0FF] text-black py-3 w-1/2 lg:w-1/6 rounded-full font-medium text-sm hover:opacity-90 transition"
        >
          Cargar propiedad
        </button>

        <button
          className="bg-gray-100 text-black py-3 w-1/2 lg:w-1/7 rounded-full font-medium text-sm hover:bg-gray-200 transition"
          onClick={() => {
            // conectar después
          }}
        >
          Editar propiedad
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CHART */}
        <div className="lg:col-span-2 bg-gray-50 rounded-3xl overflow-hidden shadow-sm flex flex-col">
          <div className="grow p-4 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockViews}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#00F0FF"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#1E1E1E] p-4 text-white text-sm font-bold flex items-center gap-2">
            Vistas en el último mes:
            <span className="text-xl">{lastMonthViews}</span>
          </div>
        </div>

        {/* MOST VIEWED */}
        <div>
          <h2 className="text-xl font-bold mb-4">Propiedad más vista</h2>

          <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-sm">
            <img
              src="https://picsum.photos/600/400"
              alt="Propiedad"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="font-medium text-lg leading-tight mb-1">
                {mostViewed?.title ?? "Todavía no hay datos"}
              </h3>
              <p className="text-gray-500 text-xs mb-6">
                {mostViewed?.city ?? "—"}{" "}
                {mostViewed?.province ? `· ${mostViewed.province}` : ""}
              </p>

              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {typeof mostViewed?.price === "number"
                    ? `USD ${mostViewed.price.toLocaleString("es-AR")}`
                    : "—"}
                </div>
                <span className="bg-[#1E1E1E] text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
                  {mostViewed?.operationType ?? "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ MODAL WIZARD 2 PASOS */}
      <CreatePropertyModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={() => {
          // opcional: refrescar lista / invalidar cache
          // por ahora lo dejamos vacío
        }}
      />
    </>
  );
}
