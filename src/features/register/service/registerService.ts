// src/features/register/service/registerService.ts
import { hash } from "bcryptjs";
import prisma from "@/libs/db";
import type { Prisma, Role, RealEstateAgency, User } from "@prisma/client";

export type RegisterInput = {
  name?: string; // 👈 lo hacemos opcional en el input
  email: string;
  password: string;
  role: "User" | "RealEstateAgency";
};

export type RegisterResult = {
  user: {
    id: number;
    email: string;
    name: string;
    role: Role;
  };
  agency?: {
    id: number;
    name: string;
    email: string;
  } | null;
};

export async function registerUserAndAgency(
  input: RegisterInput
): Promise<RegisterResult> {
  const { name, email, password, role } = input;

  // 1️⃣ Validar tipo de cuenta
  if (role !== "User" && role !== "RealEstateAgency") {
    throw new Error(
      "Tipo de cuenta no válido. Debe ser 'User' o 'RealEstateAgency'."
    );
  }

  // 2️⃣ Verificar que no exista el mail
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("El correo ya está registrado");
  }

  // 3️⃣ Hashear contraseña
  const hashed = await hash(password, 10);

  // 4️⃣ Mapear a enum Role de Prisma
  const userRole: Role = role === "RealEstateAgency" ? "REALSTATE" : "USER";

  // 5️⃣ Asegurarnos de tener SIEMPRE un nombre
  const safeName =
    typeof name === "string" && name.trim().length > 0
      ? name.trim()
      : email.split("@")[0]; // ej: "estebanhxrn" si falta name

  console.log("[registerUserAndAgency] creando usuario con name =", safeName);

  // 6️⃣ Transacción: crear usuario y, si corresponde, la inmobiliaria
  const result = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      // 🔹 Crear usuario
      const user: User = await tx.user.create({
        data: {
          name: safeName, // 👈 AHORA SIEMPRE ES STRING
          email,
          password: hashed,
          role: userRole,
        },
      });

      let agency: RealEstateAgency | null = null;

      if (role === "RealEstateAgency") {
        agency = await tx.realEstateAgency.create({
          data: {
            name: safeName, // usamos mismo nombre para la agencia
            email,
            password: hashed,
            userId: user.id,
          },
        });
      }

      return { user, agency };
    }
  );

  return {
    user: {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
    },
    agency: result.agency
      ? {
          id: result.agency.id,
          name: result.agency.name,
          email: result.agency.email,
        }
      : null,
  };
}
