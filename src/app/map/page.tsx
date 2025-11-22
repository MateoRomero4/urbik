'use client';

import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import React from 'react';

const InteractiveMap = dynamic(
  () => import('../../features/search/components/InteractiveMap').then(mod => mod.InteractiveMap),
  { ssr: false }
);

export default function MapPage() {
  const searchParams = useSearchParams();
  const latParam = searchParams.get('lat');
  const lonParam = searchParams.get('lon');
  const query = searchParams.get('q') || 'Ubicación seleccionada';

  const lat = latParam ? parseFloat(latParam) : null;
  const lon = lonParam ? parseFloat(lonParam) : null;

  const mapKey = `${lat}-${lon}`; 

  if (lat === null || lon === null || isNaN(lat) || isNaN(lon)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50"> 
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold">Error al Cargar Mapa</h1>
          <p>No se proporcionaron coordenadas válidas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen"> 
      
      <div 
        className="fixed left-0 w-screen z-0" 
        style={{ 
          height: 'calc(100vh' 
        }}
      >
        <InteractiveMap 
          key={mapKey}
          lat={lat} 
          lon={lon} 
          query={decodeURIComponent(query)} 
        />
      </div>

    </div>
  );
}