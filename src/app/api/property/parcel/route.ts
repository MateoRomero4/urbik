import { NextResponse } from "next/server";
import prisma from "@/libs/db";
import type { PropertyType, OperationType, Prisma } from "@prisma/client";
import type { Geometry } from "geojson";

type ParcelPayload = {
  CCA: string | null;
  PDA: string | null;
  geometry: Geometry;
};

type Body = {
  lat: number;
  lon: number;
  title: string;
  price: number;
  address: string;
  city: string;
  province: string;
  country: string;
  type: PropertyType;
  operationType?: OperationType;
  userId?: number; // 👈 ahora es opcional
  parcel: ParcelPayload;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    const {
      lat,
      lon,
      title,
      price,
      address,
      city,
      province,
      country,
      type,
      operationType = "RENT",
      userId,
      parcel,
    } = body;

    // 1️⃣ Validaciones básicas
    if (
      typeof lat !== "number" ||
      typeof lon !== "number" ||
      !title ||
      typeof price !== "number" ||
      !address ||
      !city ||
      !province ||
      !country ||
      !type ||
      !parcel ||
      !parcel.geometry
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    // 2️⃣ Determinar userId válido (para dev)
    let ownerUserId: number | null = null;

    if (typeof userId === "number") {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return NextResponse.json(
          { error: `El usuario con id ${userId} no existe.` },
          { status: 400 }
        );
      }
      ownerUserId = user.id;
    } else {
      // fallback: usar el primer usuario que exista (útil en desarrollo)
      const firstUser = await prisma.user.findFirst();
      if (!firstUser) {
        return NextResponse.json(
          {
            error:
              "No hay usuarios en la base. Creá un usuario antes de cargar propiedades.",
          },
          { status: 400 }
        );
      }
      ownerUserId = firstUser.id;
    }

    // 3️⃣ Crear propiedad
    const property = await prisma.property.create({
      data: {
        title,
        price,
        address,
        city,
        province,
        country,
        type,
        operationType,
        userId: ownerUserId,
        latitude: lat,
        longitude: lon,
        parcelCCA: parcel.CCA,
        parcelPDA: parcel.PDA,
        parcelGeom: parcel.geometry as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ property }, { status: 201 });
  } catch (error) {
    console.error("Error creando propiedad desde mapa:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
