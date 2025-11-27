"use client";

import { useEffect, useState, useRef } from "react";
import { GeoJSON } from "react-leaflet";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import type { Layer } from "leaflet";

type ParcelProps = {
  CCA: string | null;
  PDA: string | null;
};

type ParcelFeature = Feature<Geometry, ParcelProps>;

export function ParcelsLayer() {
  const [data, setData] = useState<FeatureCollection<
    Geometry,
    ParcelProps
  > | null>(null);
  const lastHighlighted = useRef<Layer | null>(null);

  useEffect(() => {
    fetch("/api/parcels")
      .then((res) => res.json())
      .then((json: FeatureCollection<Geometry, ParcelProps>) => setData(json))
      .catch(console.error);
  }, []);

  if (!data) return null;

  const baseStyle = () => ({
    color: "#ff6600",
    weight: 1.2,
    fillColor: "#ff9933",
    fillOpacity: 0.25,
  });

  const highlightStyle = {
    color: "#0077ff",
    weight: 2,
    fillColor: "#3399ff",
    fillOpacity: 0.35,
  };

  const resetStyle = (layer: Layer) => {
    (layer as unknown as { setStyle: (s: unknown) => void }).setStyle(
      baseStyle()
    );
  };

  const onEachFeature = (feature: ParcelFeature, layer: Layer) => {
    const props = feature.properties;

    layer.bindPopup(`
      <b>Parcela publicada</b><br/>
      CCA: ${props.CCA ?? "-"}<br/>
      PDA: ${props.PDA ?? "-"}
    `);

    layer.on("click", () => {
      if (lastHighlighted.current && lastHighlighted.current !== layer)
        resetStyle(lastHighlighted.current);
      (layer as any).setStyle(highlightStyle);
      lastHighlighted.current = layer;
    });

    layer.on("mouseover", () => {
      (layer as any).setStyle({ weight: 2, fillOpacity: 0.4 });
    });

    layer.on("mouseout", () => {
      if (lastHighlighted.current === layer)
        (layer as any).setStyle(highlightStyle);
      else resetStyle(layer);
    });
  };

  return (
    <GeoJSON data={data} style={baseStyle} onEachFeature={onEachFeature} />
  );
}
