"use client";

import { SessionProvider } from "next-auth/react";
import { MapSettingsProvider } from "@/features/mapSettings/MapSettingsProvider";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <MapSettingsProvider>{children}</MapSettingsProvider>
    </SessionProvider>
  );
}
