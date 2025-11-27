import { NextResponse } from "next/server";
import prisma from "@/libs/db";

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      where: {
        isAvailable: true,
        parcelGeom: { not: null },
      },
      select: {
        parcelGeom: true,
        parcelCCA: true,
        parcelPDA: true,
      },
    });

    const features = properties
      .filter((p) => p.parcelGeom)
      .map((p) => ({
        type: "Feature",
        geometry: p.parcelGeom,
        properties: {
          CCA: p.parcelCCA,
          PDA: p.parcelPDA,
        },
      }));

    return NextResponse.json({
      type: "FeatureCollection",
      features,
    });
  } catch (error) {
    console.error("Error en /api/parcels:", error);
    return NextResponse.json(
      { type: "FeatureCollection", features: [] },
      { status: 500 }
    );
  }
}
