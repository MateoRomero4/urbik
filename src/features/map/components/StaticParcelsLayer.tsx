"use client";

import { WMSTileLayer } from "react-leaflet";

export function StaticParcelsLayer() {
  return (
    <WMSTileLayer
      url="https://geo.arba.gov.ar/geoserver/idera/ows?"
      layers="Parcela"
      format="image/png"
      transparent={true}
      version="1.1.1"
      opacity={1}
      // Para evitar saturar la red
      tileSize={256}
      maxZoom={20}
      minZoom={15}
    />
  );
}
