"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultBaseLayerId,
  isBaseLayerId,
  type BaseLayerId,
} from "./baseLayers";

type MapSettingsContextValue = {
  baseLayer: BaseLayerId;
  setBaseLayer: (id: BaseLayerId) => void;
};

const MapSettingsContext = createContext<MapSettingsContextValue | null>(null);

export function MapSettingsProvider({ children }: { children: ReactNode }) {
  const [baseLayer, setBaseLayerState] = useState<BaseLayerId>(
    defaultBaseLayerId
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("urbik.baseLayer");
    if (stored && isBaseLayerId(stored)) {
      setBaseLayerState(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("urbik.baseLayer", baseLayer);
  }, [baseLayer]);

  const value = useMemo(
    () => ({
      baseLayer,
      setBaseLayer: (id: BaseLayerId) => setBaseLayerState(id),
    }),
    [baseLayer]
  );

  return (
    <MapSettingsContext.Provider value={value}>
      {children}
    </MapSettingsContext.Provider>
  );
}

export function useMapSettings() {
  const ctx = useContext(MapSettingsContext);
  if (!ctx) {
    throw new Error("useMapSettings debe usarse dentro de MapSettingsProvider");
  }
  return ctx;
}
