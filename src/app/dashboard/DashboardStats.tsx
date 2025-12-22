"use client";

import React from "react";
import { Home, TrendingUp } from "lucide-react";

export default function DashboardStats({
  total,
  active,
  sale,
  rent,
}: {
  total: number;
  active: number;
  sale: number;
  rent: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-[#1E1E1E] rounded-full px-8 py-4 flex items-center justify-between text-white">
        <div>
          <div className="text-xs text-gray-400 mb-1">Mis propiedades</div>
          <div className="text-3xl font-bold">{total}</div>
        </div>
        <div className="bg-blue-600 p-2 rounded-full">
          <Home className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="bg-[#1E1E1E] rounded-full px-8 py-4 flex items-center justify-between text-white">
        <div>
          <div className="text-xs text-gray-400 mb-1">Disponibles</div>
          <div className="text-3xl font-bold">{active}</div>
        </div>
        <div className="bg-green-600 p-2 rounded-full">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="bg-[#1E1E1E] rounded-full px-8 py-4 flex items-center justify-between text-white">
        <div>
          <div className="text-xs text-gray-400 mb-1">Ventas / Alquileres</div>
          <div className="text-3xl font-bold">
            {sale} / {rent}
          </div>
        </div>
        <div className="bg-cyan-500 p-2 rounded-full">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}
