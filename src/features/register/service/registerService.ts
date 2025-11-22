// src/features/register/service/registerService.ts
import { hash } from "bcryptjs";
import prisma from "@/libs/db";
import type { Prisma } from "@prisma/client";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: "User" | "RealEstateAgency";
};

export type RegisterResult = {
  id: string;
  email: string;
  agencyId: string | null;
};

export async function registerUserAndAgency({
  name,
  email,
  password,
  role,
}: RegisterInput): Promise<RegisterResult> {
  if (!role || (role !== "User" && role !== "RealEstateAgency")) {
    throw new Error(
      "Tipo de cuenta no válido. Debe ser 'User' o 'RealEstateAgency'."
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("El correo ya está registrado");
  }

  const hashed = await hash(password, 10);
  const userRole = role === "RealEstateAgency" ? "REALSTATE" : "USER";

  const result = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const user = await tx.user.create({
        data: { name, email, password: hashed, role: userRole },
      });

      let realEstateAgency: { id: number } | null = null;

      if (role === "RealEstateAgency") {
        realEstateAgency = await tx.realEstateAgency.create({
          data: {
            name: user.name,
            email: user.email,
            password: hashed, // si más adelante querés, esto se puede eliminar del modelo
            userId: user.id,
          },
          select: { id: true },
        });
      }

      return { user, realEstateAgency };
    }
  );

  return {
    id: result.user.id.toString(),
    email: result.user.email,
    agencyId: result.realEstateAgency?.id.toString() ?? null,
  };
}
