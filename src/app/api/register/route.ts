// src/app/api/register/route.ts
import { NextResponse, NextRequest } from "next/server";
import {
  registerUserAndAgency,
  RegisterInput,
  RegisterResult,
} from "@/features/register/service/registerService";

interface RegisterData {
  email: string;
  password: string;
  agencyName: string;
  accountType: "user" | "agency";
}

export async function POST(req: NextRequest) {
  try {
    const data: RegisterData = await req.json();

    const mapped: RegisterInput = {
      name: data.agencyName,
      email: data.email,
      password: data.password,
      role: data.accountType === "agency" ? "RealEstateAgency" : "User",
    };

    const user: RegisterResult = await registerUserAndAgency(mapped);

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error en el Route Handler de registro:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";

    const status =
      errorMessage.includes("correo ya está registrado") ||
      errorMessage.includes("Tipo de cuenta no válido")
        ? 400
        : 500;

    return NextResponse.json(
      { error: errorMessage || "Error interno del servidor." },
      { status }
    );
  }
}
