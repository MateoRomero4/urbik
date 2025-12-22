import dynamic from "next/dynamic";
import type { InteractiveMapProps } from "./InteractiveMapClient";

export const InteractiveMap = dynamic(
  () => import("./InteractiveMapClient").then((m) => m.InteractiveMapClient),
  { ssr: false }
);

export type { InteractiveMapProps };
