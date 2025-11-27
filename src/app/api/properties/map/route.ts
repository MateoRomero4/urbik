// src/app/api/properties/map/route.ts
import { NextResponse } from "next/server";
import prisma from "@/libs/db";

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      where: {
        isAvailable: true,
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        title: true,
        price: true,
        latitude: true,
        longitude: true,
        city: true,
        province: true,
        operationType: true,
        type: true,
        parcelCCA: true, // 👈 clave para matchear con GeoJSON
      },
    });

    return NextResponse.json({ properties });
  } catch (error) {
    console.error("Error fetching properties for map:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
