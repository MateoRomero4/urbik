"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

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
        description: "Encontrá lotes y terrenos listos para construir o invertir, en zonas urbanas y rurales.",
    },
    {
        src: "/departamento.png",
        alt: "Departamento",
        title: "Departamentos",
        description: "Explorá departamentos de 1 a 4 ambientes, con amenities y en las mejores ubicaciones de la ciudad.",
    },
    {
        src: "/casa.png",
        alt: "Casa",
        title: "Casas",
        description: "Descubrí casas familiares, quintas y chalets con amplios espacios, jardines y todas las comodidades.",
    },
    {
        src: "/galpon.png",
        alt: "Galpón",
        title: "Galpones",
        description: "Buscá galpones industriales, depósitos logísticos y locales comerciales aptos para tu negocio.",
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
    <div className="w-full flex flex-col items-center">
      
      <div className="min-h-[80vh] w-full flex flex-row items-center justify-around overflow-hidden px-4 max-w-7xl mx-auto py-12"> 
        
        <section className="relative flex flex-col items-center text-center w-full md:w-1/2">
          <div className="overflow-hidden h-[6rem]">
            <AnimatePresence mode="wait">
              <motion.h1
                key={topWords[index]}
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="text-6xl md:text-7xl font-bold text-black"
              >
                {topWords[index]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <div className="overflow-hidden h-[6rem] mt-2">
            <AnimatePresence mode="wait">
              <motion.h2
                key={bottomWords[bottomIndex]}
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="text-6xl md:text-7xl font-semibold text-gray-800"
              >
                {bottomWords[bottomIndex]}
              </motion.h2>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Ir al Dashboard
            </Link>
            <Link
              href="/map"
              className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Abrir mapa interactivo
            </Link>
          </div>
        </section>

        <div className="hidden md:block w-1/2 bg-transparent pl-8"> 
          <img
            src="/main.png"
            alt="Descripción de la imagen principal de Urbik"
            className="w-full h-auto object-cover bg-transparent rounded-2xl shadow-xl" 
          />
        </div>
      </div>
      
      <section className="w-full bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-black mb-12">
            Encontrá la propiedad perfecta para vos
          </h3>
          
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
            {propertyTypes.map((prop, idx) => (
              <div 
                key={idx} 
                className="flex flex-col items-center text-center bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg"> {/* Aumentado el tamaño del contenedor y añadido overflow-hidden para cortar */}
                  <img
                    src={prop.src}
                    alt={prop.alt}
                    className="w-full h-full object-cover" // Cambiado a object-cover
                  />
                </div>
                
                <div className="w-full p-4">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{prop.title}</h4>
                <p className="text-sm text-gray-600">
                  {prop.description}
                </p>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
