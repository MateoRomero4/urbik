"use client";

import { useEffect, useState, useRef } from "react";
import { GeoJSON } from "react-leaflet";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import type { Layer } from "leaflet";
import L from "leaflet";

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

  const setLayerStyle = (layer: Layer, style: L.PathOptions) => {
    // GeoJSON polygons are Path layers
    const path = layer as unknown as L.Path;
    if (path.setStyle) path.setStyle(style);
  };

  const onEachFeature = (feature: ParcelFeature, layer: Layer) => {
    const props = feature.properties;

    layer.bindPopup(`
      <b>Parcela publicada</b><br/>
      CCA: ${props.CCA ?? "-"}<br/>
      PDA: ${props.PDA ?? "-"}
    `);

    layer.on("click", () => {
      if (lastHighlighted.current && lastHighlighted.current !== layer) {
        setLayerStyle(lastHighlighted.current, baseStyle());
      }
      setLayerStyle(layer, highlightStyle);
      lastHighlighted.current = layer;
    });

    layer.on("mouseover", () => {
      setLayerStyle(layer, { weight: 2, fillOpacity: 0.4 });
    });

    layer.on("mouseout", () => {
      if (lastHighlighted.current === layer)
        setLayerStyle(layer, highlightStyle);
      else setLayerStyle(layer, baseStyle());
    });
  };

  return (
    <GeoJSON data={data} style={baseStyle} onEachFeature={onEachFeature} />
  );
}
