/// src/app/page.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import analisis from "@/assets/analisis_de_tus_propiedades.png";
import busca from "@/assets/busca_tu_proxima_propiedad.png";

export default function HomePageBanner() {
  const topWords = ["Buscá un", "Buscá", "Encontrá", "Urbik"];
  const bottomWords = ["departamento", "una casa", "tu hogar", " "];
  const [index, setIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);

  const propertyTypes = [
    {
      src: "/terreno.png",
      alt: "Terreno",
      title: "Terrenos",
      description:
        "Encontrá lotes y terrenos listos para construir o invertir, en zonas urbanas y rurales.",
    },
    {
      src: "/departamento.png",
      alt: "Departamento",
      title: "Departamentos",
      description:
        "Explorá departamentos de 1 a 4 ambientes, con amenities y en las mejores ubicaciones de la ciudad.",
    },
    {
      src: "/casa.png",
      alt: "Casa",
      title: "Casas",
      description:
        "Descubrí casas familiares, quintas y chalets con amplios espacios, jardines y todas las comodidades.",
    },
    {
      src: "/galpon.png",
      alt: "Galpón",
      title: "Galpones",
      description:
        "Buscá galpones industriales, depósitos logísticos y locales comerciales aptos para tu negocio.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % topWords.length);
      setBottomIndex((prev) => (prev + 1) % bottomWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-urbik-white min-h-screen pt-16">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-6xl font-display font-black text-urbik-black leading-tight mb-6">
            Encontrá tu lugar
            <br />
            en el mundo.
          </h1>

          <p className="text-urbik-muted text-lg mb-10 max-w-lg">
            La primera plataforma de búsqueda inmobiliaria que integra y
            visualiza información catastral de cada propiedad.
          </p>

          <div className="mb-2 text-xs font-extrabold text-urbik-black uppercase tracking-wide">
            Busqueda por dirección o nombre de inmobiliaria
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {/*<Search className="w-5 h-5 text-urbik-black/50" />*/}
            </div>
            <input
              type="text"
              placeholder="Iniciar busqueda"
              className="w-full bg-urbik-g200 rounded-full py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-urbik-black"
            />
          </div>

          <div className="mb-2 text-xs font-extrabold text-urbik-black uppercase tracking-wide">
            Busqueda detallada
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <button className="pill bg-urbik-g300 text-urbik-black hover:bg-urbik-g400 transition">
              COMPRAR
            </button>
            <button className="pill bg-urbik-black text-urbik-white hover:opacity-90 transition">
              ALQUILAR
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-10">
            <button className="pill bg-urbik-g300 text-urbik-black hover:bg-urbik-g400 transition">
              LOCAL COMERCIAL
            </button>
            <button className="pill bg-urbik-black text-urbik-white hover:opacity-90 transition">
              LA PLATA
            </button>
          </div>

          <button className="btn bg-urbik-black text-urbik-white hover:bg-urbik-dark flex items-center gap-2">
            BUSCAR
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative flex justify-center">
            {/* Card dark */}
            <img
              src={busca.src}
              alt="Busca tu próxima propiedad"
              className="absolute z-20 -top-10 -right-40 w-80 h-80 bg-urbik-g200 rounded-[2rem] shadow-xl flex flex-col items-center justify-center rotate-6 border border-urbik"
            />
            {/* Card light */}
            <img
              src={analisis.src}
              alt="Análisis de tus propiedades"
              className="relative z-10 w-80 h-80 bg-urbik-black rounded-[2rem] text-urbik-white shadow-2xl -rotate-6"
            />
          </div>
          {/* Agency CTA */}
          <div className="max-w-4xl mx-auto text-center py-20">
            <h2 className="text-3xl font-display font-black mb-8 text-urbik-black">
              ¿Sos una inmobiliaria?
            </h2>

            <div className="flex flex-col justify-center gap-4 flex-wrap">
              <button className="btn bg-urbik-dark text-urbik-white hover:bg-urbik-black w-3/4">
                Quiero publicar una propiedad
              </button>
              <button className="btn bg-urbik-g300 self-end text-urbik-black hover:bg-urbik-g400 w-3/4">
                Quiero ver mis estadísticas
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-display font-bold mb-1 text-urbik-black">
          Propiedades destacadas
        </h2>
        <p className="text-urbik-muted text-sm mb-8">
          Oportunidades seleccionadas por nuestro algoritmo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-urbik-g300 h-80 rounded-3xl animate-pulse" />
          <div className="bg-urbik-g300 h-80 rounded-3xl animate-pulse" />
          <div className="bg-urbik-g300 h-80 rounded-3xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
