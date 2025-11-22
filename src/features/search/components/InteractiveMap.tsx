import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; 

delete (L.Icon.Default.prototype as any)._getIconUrl; 
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
  iconUrl: '/leaflet/images/marker-icon.png',
  shadowUrl: '/leaflet/images/marker-shadow.png',
});

const baseLayers = {
  osm: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
};

interface InteractiveMapProps {
  lat: number;
  lon: number;
  query: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ lat, lon, query }) => {
  const position: [number, number] = [lat, lon];
  const [currentLayer, setCurrentLayer] = useState('osm');
  const [isClient, setIsClient] = useState(false); 

  useEffect(() => {
    setIsClient(true);
  }, []);

  const activeLayer = baseLayers[currentLayer as keyof typeof baseLayers];

  if (!isClient) {
    return (
      <div 
        style={{ height: '600px', width: '100%', zIndex: 1 }} 
        className='bg-gray-200 flex items-center justify-center'
      >
        Cargando mapa...
      </div>
    );
  }

  return (
    <div className='relative'>
      <div className='absolute top-3 right-3 z-[1000] flex space-x-2 p-2 bg-black/80 rounded-lg shadow-lg'>
        <button
          onClick={() => setCurrentLayer('osm')}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${currentLayer === 'osm' ? 'bg-white text-black font-bold' : 'bg-transparent text-white hover:bg-white/20'}`}
        >
          Mapa
        </button>
        <button
          onClick={() => setCurrentLayer('satellite')}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${currentLayer === 'satellite' ? 'bg-white text-black font-bold' : 'bg-transparent text-white hover:bg-white/20'}`}
        >
          Satélite
        </button>
      </div>

      <MapContainer 
        center={position} 
        zoom={15} 
        scrollWheelZoom={true}
        style={{ height: '100vh', width: '100%', zIndex: 1 }} 
      >
        <TileLayer
          attribution={activeLayer.attribution}
          url={activeLayer.url}
          maxZoom={20}
        />
        
        <Marker position={position}>
          <Popup>
            **Ubicación:** <br />{query}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};